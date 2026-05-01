"use client";

import { useEffect, useRef } from "react";

/**
 * Section 1 — Hero
 *
 * Layout (desktop, ~1920×1000):
 *   - Top bar: brand mark "DP" left, burger right
 *   - Centered/left H1 "Dynasty Business Adviser" (120px)
 *   - Sub-line above title (uppercase eyebrow)
 *   - Right: gold "Dynasty" client logo
 *   - Background: full-bleed autoplay video (start-screen1.webm),
 *     mobile uses start-screen1-mob.webm
 *
 * Visual juice (keeping it light here — the page-wide GSAP layer comes later):
 *   - Soft vignette overlay so the H1 keeps contrast over any frame
 *   - Subtle gradient floor blending into next section's #002057
 *   - Animated gold "starburst" cursor next to the title (small CSS twinkle)
 */
import { VideoBackground } from "@/components/ui/VideoBackground";

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Lightweight intro on mount (will be replaced by GSAP timeline later
  // in the global motion pass — keeps the section feeling alive even
  // before scroll-triggered animations are wired up).
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.animate(
      [
        { opacity: 0, transform: "translateY(28px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: 900,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "both",
        delay: 120,
      }
    );
  }, []);

  return (
    <section
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-bg"
      aria-label="Dynasty Business Adviser — обложка кейса"
    >
      {/* Background video */}
      <VideoBackground
        desktopSrc="/video/start-screen1.webm"
        mobileSrc="/video/start-screen1-mob.webm"
        className="z-0"
      />

      {/* Atmospheric overlays */}
      {/* 1. global vignette: keeps frame moody at edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_30%_50%,_rgba(6,29,68,0)_0%,_rgba(6,29,68,0.45)_55%,_rgba(6,29,68,0.85)_100%)]"
      />
      {/* 2. left-side fade — readability for the H1 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-full bg-gradient-to-r from-bg via-bg/65 via-30% to-transparent lg:w-3/4 lg:from-bg/90 lg:via-bg/40 lg:via-50%"
      />
      {/* 3. bottom seam → blends into next section #002057 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48 bg-gradient-to-b from-transparent to-bg-deep"
      />
      {/* 4. colored glow behind the H1 (#2756A6) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 z-10 h-[720px] w-[1000px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(39,86,166,0.55)_0%,_rgba(39,86,166,0.25)_45%,_transparent_75%)] blur-3xl motion-safe:animate-[float_18s_ease-in-out_infinite]"
      />

      {/* Hero content */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1700px] flex-1 items-end px-6 pb-12 pt-16 sm:px-10 sm:pb-16 lg:px-16">
        <div className="w-full text-left">
          <p className="text-fade-in mb-6 inline-flex items-center gap-3 text-[13px] uppercase tracking-[0.28em] text-white/70 sm:text-sm">
            <span className="inline-block h-px w-10 bg-accent" />
            Кейс / 2025
          </p>

          <h1
            ref={titleRef}
            className="max-w-[1100px] font-sans text-[clamp(48px,8.5vw,120px)] font-bold leading-[1.02] tracking-[-0.02em] text-white [text-shadow:0_4px_30px_rgba(6,29,68,0.45)]"
          >
            Dynasty Business
            <br />
            <span className="relative inline-block">
              Adviser
              <span
                aria-hidden
                className="absolute -right-6 -top-2 inline-block h-3 w-3 animate-pulse rounded-full bg-accent shadow-[0_0_24px_rgba(251,221,28,0.9)] sm:-right-8 sm:-top-1 sm:h-4 sm:w-4"
              />
            </span>
          </h1>

          <p
            className="text-fade-in mt-8 max-w-[640px] text-base leading-relaxed text-white/75 sm:text-lg"
            style={{ "--reveal-delay": "350ms" } as React.CSSProperties}
          >
            Разработка корпоративного сайта для консалтинговой компании
            в&nbsp;ОАЭ. Услуги по&nbsp;регистрации компаний, лицензированию,
            открытию банковских счетов и&nbsp;визовой поддержке.
          </p>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="relative z-20 flex justify-center pb-8 sm:pb-10">
        <div className="flex flex-col items-center gap-2 text-white/50">
          <span className="text-[11px] uppercase tracking-[0.32em]">scroll</span>
          <span
            aria-hidden
            className="block h-10 w-px bg-gradient-to-b from-white/60 to-transparent"
          />
        </div>
      </div>
    </section>
  );
}
