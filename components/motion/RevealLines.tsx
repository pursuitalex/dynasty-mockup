"use client";

import { Fragment, useEffect, useRef } from "react";

interface RevealLinesProps {
  text: string;
  className?: string;
  /** Per-line offset in the scroll-driven timeline (in seconds, relative units). */
  staggerSec?: number;
  /** Duration of each word's reveal slice within the scroll-driven timeline. */
  durationSec?: number;
}

/**
 * Scroll-scrubbed line-by-line blur reveal.
 *
 * Each word starts hidden (opacity 0 + blur + slight slide). A GSAP
 * ScrollTrigger timeline maps scroll progress over the paragraph (from "top
 * 85%" → "bottom 50%") onto per-line word reveals — so:
 *
 *   • Fast scroll  → fast reveal
 *   • Slow scroll  → slow reveal
 *   • Scroll up    → reveals back down (bidirectional)
 *   • Page settles → animation pauses where the user stopped
 *
 * Lines are detected by grouping words with the same `getBoundingClientRect().top`,
 * and re-detected on resize so re-flowed text gets the right line indices.
 */
export function RevealLines({
  text,
  className = "",
  staggerSec = 0.18,
  durationSec = 0.45,
}: RevealLinesProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(/\s+/);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const wordEls = Array.from(
      el.querySelectorAll<HTMLSpanElement>(".reveal-lines-word")
    );

    // ── Reduced-motion: just show everything, skip GSAP entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wordEls.forEach((w) => {
        w.style.opacity = "1";
        w.style.filter = "none";
        w.style.transform = "none";
      });
      return;
    }

    /**
     * For each word, determine which visual LINE it belongs to by snapping
     * to the closest `top` value. Returns an array of line indices the same
     * length as `wordEls`.
     */
    function computeLineMap(): number[] {
      let currentLine = -1;
      let lastTop = -Infinity;
      return wordEls.map((w) => {
        const top = Math.round(w.getBoundingClientRect().top);
        if (top > lastTop + 5) {
          currentLine++;
          lastTop = top;
        }
        return currentLine;
      });
    }

    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      // We need the words at their initial CSS state for an accurate
      // line-grouping measurement (display: inline-block, etc).
      let lineMap = computeLineMap();

      function buildTimeline(): gsap.core.Timeline {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 85%",     // paragraph's top reaches 85% of viewport
            end: "bottom 55%",    // paragraph's bottom reaches mid-viewport
            scrub: 0.5,           // 0.5s catch-up smoothing — natural feel
          },
        });

        wordEls.forEach((word, i) => {
          tl.fromTo(
            word,
            {
              opacity: 0,
              filter: "blur(8px)",
              y: 12,
            },
            {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              duration: durationSec,
              ease: "none",
            },
            // Position in timeline based on this word's line index.
            lineMap[i] * staggerSec
          );
        });

        return tl;
      }

      let tl = buildTimeline();

      // On resize, lines re-flow → recompute and rebuild the timeline.
      let resizeRaf = 0;
      const onResize = () => {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(() => {
          tl.scrollTrigger?.kill();
          tl.kill();
          lineMap = computeLineMap();
          tl = buildTimeline();
          ScrollTrigger.refresh();
        });
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(resizeRaf);
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    })();

    return () => cleanup?.();
  }, [staggerSec, durationSec]);

  return (
    <p ref={ref} className={`reveal-lines ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="reveal-lines-word" aria-hidden="true">
            {w}
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </p>
  );
}
