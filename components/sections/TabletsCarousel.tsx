"use client";

import { useEffect, useRef } from "react";

/**
 * Section 4 — Tablet carousel rotated -30°
 *
 * Figma node 101:193. Visual idea: 4 horizontal rails of "tablets", the
 * entire rig tilted -30°. Each rail scrolls horizontally on its own; rows
 * alternate direction (left / right / left / right).
 *
 * Seamless loop technique:
 *   • Each row's pool of N=8 unique tablets is rendered TWICE in the DOM.
 *   • CSS animates `translate-x: 0 → -50%`. At 100% the duplicate copy is
 *     in exactly the same visual spot as the original was at 0% → no seam.
 *
 * Rotation:
 *   • A frame container clips everything with overflow:hidden + rounded corners.
 *   • Inside, an oversized rotor (centered, sized to cover the frame's diagonal
 *     after a -30° tilt) holds the 4 stacked rails.
 *
 * Responsive scaling:
 *   • mobile  ( <md  / <768 ) → 0.5×  (320×200, gap 14, rotor 1300×842)
 *   • tablet  ( md   / 768+ ) → 0.66× (427×267, gap 19, rotor 1733×1125)
 *   • desktop ( lg   / 1024+) → 1×    (640×400, gap 28, rotor 2600×1684)
 *
 * Image swap-in:
 *   • Files live at /public/img/tablets/1.png … 8.png
 *   • Missing files fall back to coloured placeholders.
 *   • See /public/img/tablets/README.md
 */

const TABLET_POOL_SIZE = 8;

const PLACEHOLDER_COLORS = [
  "#3D5F94",
  "#A8B2C5",
  "#5B7FB8",
  "#7A87A0",
  "#2E4A7A",
  "#94A2BC",
  "#4A6BAA",
  "#6B8AC4",
];

const tablets = Array.from({ length: TABLET_POOL_SIZE }, (_, i) => ({
  id: i + 1,
  src: `/img/tablets/${i + 1}.png`,
  bg: PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length],
}));

const rowOrders: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7],
  [3, 4, 5, 6, 7, 0, 1, 2],
  [5, 6, 7, 0, 1, 2, 3, 4],
  [2, 1, 0, 7, 6, 5, 4, 3],
];

const rowDirections: ("left" | "right")[] = ["left", "right", "left", "right"];

// Per-row durations (seconds). Slightly different so rails don't sync up.
const rowDurations = [110, 96, 120, 104];

export function TabletsCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  // Scroll-driven scale: 80% when the section first peeks into view from
  // below, animating up to 100% by the time its centre reaches the viewport
  // centre. Scrubbed (tied to scroll position) for a tactile feel.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section || !frame) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      const tween = gsap.fromTo(
        frame,
        { scale: 0.8 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom", // section's top hits viewport bottom
            end: "center center", // section's centre reaches viewport centre
            scrub: true,
          },
        }
      );

      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    })();

    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-bg-deep py-[80px]"
      aria-label="Адаптивні версії — дизайн планшета"
    >
      {/* Side gutters: 0 on mobile (full bleed) → 24/32px on tablet/desktop. */}
      <div className="mx-auto w-full max-w-[1860px] px-0 sm:px-6 lg:px-8">
        <div
          ref={frameRef}
          // Frame heights:
          //   mobile  ( <sm  / <640 ) → fixed 480px, no border radius (full-bleed)
          //   tablet  ( md / 768+   ) → 600px (mid-point feel between mobile and desktop)
          //   desktop ( lg / 1024+  ) → fluid by aspect ratio 1860/700 (~700px at full width)
          className="relative h-[480px] origin-center overflow-hidden rounded-none will-change-transform sm:rounded-[40px] md:h-[600px] lg:h-auto lg:aspect-[1860/700]"
          style={{
            background: "linear-gradient(180deg, #29559F 0%, #19315B 100%)",
          }}
        >
          {/* Rotor — sized to cover frame diagonal once rotated -30°.
              Width / height / gap scale per breakpoint. */}
          <div
            className={[
              "absolute left-1/2 top-1/2 flex flex-col",
              // mobile 0.5×
              "h-[842px] w-[1300px] gap-[14px]",
              // tablet 0.66×
              "md:h-[1125px] md:w-[1733px] md:gap-[19px]",
              // desktop 1×
              "lg:h-[1684px] lg:w-[2600px] lg:gap-[28px]",
            ].join(" ")}
            style={{
              transform: "translate(-50%, -50%) rotate(-30deg)",
              transformOrigin: "center center",
            }}
          >
            {rowOrders.map((order, rowIdx) => (
              <Row
                key={rowIdx}
                order={order}
                direction={rowDirections[rowIdx]}
                durationSec={rowDurations[rowIdx]}
                offsetIdx={rowIdx}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface RowProps {
  order: number[];
  direction: "left" | "right";
  durationSec: number;
  /** index of row, used to offset starting position so rails don't line up */
  offsetIdx: number;
}

function Row({ order, direction, durationSec, offsetIdx }: RowProps) {
  // Render the pool TWICE for the seamless loop.
  const items = [...order, ...order];

  // Different start offset per row (in % of one full pool) so rails don't
  // start with the same item under the same screen-x position.
  const startOffsetPct = -((offsetIdx * 12) % 50);

  return (
    <div
      // overflow visible on purpose — outer frame clips at the section edge,
      // and we want each tablet's shadow to bleed past row borders.
      // Heights match the responsive Tablet sizes (h = TABLET_H per breakpoint).
      className="relative w-full overflow-visible h-[200px] md:h-[267px] lg:h-[400px]"
    >
      <div
        className="flex h-full items-center will-change-transform gap-[14px] md:gap-[19px] lg:gap-[28px]"
        style={{
          width: "fit-content",
          // Initial offset gives each row a different visible "seed", so the
          // 4 rails don't all show the same items in the same column.
          transform: `translate3d(${startOffsetPct}%, 0, 0)`,
          animation: `${
            direction === "left" ? "marqueeLeft" : "marqueeRight"
          } ${durationSec}s linear infinite`,
        }}
      >
        {items.map((idx, i) => (
          <Tablet
            key={`${idx}-${i}`}
            src={tablets[idx].src}
            bg={tablets[idx].bg}
          />
        ))}
      </div>
    </div>
  );
}

interface TabletProps {
  src: string;
  bg: string;
}

function Tablet({ src, bg }: TabletProps) {
  return (
    <div
      // Sizes scale per breakpoint (mobile 0.5× → tablet 0.66× → desktop 1×).
      className={[
        "relative shrink-0 overflow-hidden border-[2px] shadow-[0_8px_22px_rgba(0,0,0,0.18)]",
        // mobile
        "h-[200px] w-[320px] rounded-[12.8px]",
        // tablet
        "md:h-[267px] md:w-[427px] md:rounded-[17px]",
        // desktop
        "lg:h-[400px] lg:w-[640px] lg:rounded-[25.6px]",
      ].join(" ")}
      style={{
        backgroundColor: bg,
        // #50598F @ 50% — explicit so intent is obvious
        borderColor: "rgba(80, 89, 143, 0.5)",
      }}
    >
      {/* Real screenshot if present. If the file 404s, onError removes the
          element from the DOM so the bg colour stays as a clean placeholder. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).remove();
        }}
      />
    </div>
  );
}
