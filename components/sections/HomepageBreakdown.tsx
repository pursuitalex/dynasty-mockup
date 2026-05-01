"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Section 6 — "Главная Страница" (homepage breakdown)
 *
 * Figma node 101:209.
 *   • Centered heading + subtitle (col 3-10)
 *   • Long vertical screenshot frame (col 3-10, ~819px wide × 3492px tall).
 *     Single image at /public/img/pics/homepage.png.
 *   • Two floating "glass" info-cards absolutely positioned over the screenshot:
 *       – left card  @ top 513   — Lightning icon
 *       – right card @ top 1106  — Kanban   icon
 *   • Subtle BLUR decoration behind everything.
 */

const SCREENSHOT_WIDTH = 819;
const FRAME_HEIGHT = 3492;
const HOMEPAGE_IMAGE = "/img/pics/homepage.png";

const glassCards = [
  {
    side: "left" as const,
    top: 513,
    icon: "/img/icons/lightning.svg",
    text: "Главная страница помогает быстро найти подходящие образовательные программы и сориентироваться в доступных направлениях обучения.",
    parallax: -260,
  },
  {
    side: "right" as const,
    top: 1106,
    icon: "/img/icons/kanban.svg",
    text: "Основной акцент сделан на категориях и популярных направлениях, дополнительно представлены новости, информация о программе и команда проекта.",
    parallax: -340,
  },
];

export function HomepageBreakdown() {
  return (
    <section
      className="relative w-full overflow-hidden bg-bg-deep py-[40px] sm:py-[80px]"
      aria-label="Главная страница — разбор"
    >
      {/* Atmospheric blur behind the screenshot */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[55%] -z-0 h-[1140px] w-[1140px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(39,86,166,0.35)_0%,_transparent_70%)] blur-3xl"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-6 sm:px-10 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-[60px] grid grid-cols-12 gap-x-6 lg:mb-[90px]">
          <div className="col-span-12 flex flex-col items-center gap-4 text-center text-white lg:col-span-8 lg:col-start-3">
            <h2 className="text-fade-in font-sans text-[clamp(32px,4.5vw,46px)] font-medium leading-[1.1] tracking-[-0.01em]">
              Главная Страница
            </h2>
            <p
              className="text-fade-in text-[clamp(15px,1.4vw,18px)] font-normal leading-[1.35] tracking-[-0.18px] opacity-80"
              style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
            >
              Формирует первое впечатление и задаёт направление навигации
              по&nbsp;сайту, помогая быстро понять ключевые услуги и&nbsp;перейти
              к&nbsp;консультации
            </p>
          </div>
        </div>

        {/* Screenshot frame + floating cards */}
        <div className="grid grid-cols-12 gap-x-6">
          <div className="relative col-span-12 lg:col-span-8 lg:col-start-3">
            {/* The clip frame — single tall image */}
            <div
              className="relative mx-auto overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#1a3470,#0e2452)]"
              style={{
                width: "100%",
                maxWidth: `${SCREENSHOT_WIDTH}px`,
                aspectRatio: `${SCREENSHOT_WIDTH} / ${FRAME_HEIGHT}`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HOMEPAGE_IMAGE}
                alt="Главная страница Dynasty Business Adviser"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-top"
                onError={(e) =>
                  (e.currentTarget as HTMLImageElement).remove()
                }
              />
            </div>

            {/* Floating glass cards — positioned as % of frame height so they
                stay anchored to the same point of the screenshot at any size. */}
            {glassCards.map((card, i) => (
              <GlassCard
                key={i}
                side={card.side}
                topPct={(card.top / FRAME_HEIGHT) * 100}
                icon={card.icon}
                text={card.text}
                parallaxY={card.parallax}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface GlassCardProps {
  side: "left" | "right";
  topPct: number;
  icon: string;
  text: string;
  /** How far up (in px) the card travels relative to its natural position
      across the section's full scroll. Negative = moves up faster than scroll. */
  parallaxY: number;
}

function GlassCard({ side, topPct, icon, text, parallaxY }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Fade-in (one-shot when card enters view) + parallax (scrub-bound to the
  // section's scroll). They control different properties so they don't fight.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      return;
    }

    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      // The screenshot wrapper is the parallax trigger — when it scrolls,
      // the card translates faster.
      const triggerEl = el.parentElement;

      const fadeIn = gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        }
      );

      const parallax = gsap.fromTo(
        el,
        { y: -parallaxY },        // start below natural (positive = below)
        {
          y: parallaxY,           // end above natural (negative = above)
          ease: "none",
          scrollTrigger: {
            trigger: triggerEl,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.4,
          },
        }
      );

      cleanup = () => {
        fadeIn.scrollTrigger?.kill();
        fadeIn.kill();
        parallax.scrollTrigger?.kill();
        parallax.kill();
      };
    })();

    return () => cleanup?.();
  }, [parallaxY]);

  return (
    <div
      ref={ref}
      className={[
        // base — visible on all sizes, just smaller on mobile/tablet
        "absolute z-20 flex flex-col gap-2 rounded-[14px] text-white opacity-0 backdrop-blur-[12px] will-change-transform",
        // soft drop-shadow stack (4 layers, matches Figma)
        "shadow-[0_60px_40px_rgba(0,0,0,0.21),0_30.375px_17.438px_rgba(0,0,0,0.14),0_12px_6.5px_rgba(0,0,0,0.10),0_2.625px_2.313px_rgba(0,0,0,0.07)]",
        // Responsive sizing — mobile/tablet widths are +50% of the original
        // baseline so the cards don't feel cramped on smaller viewports.
        // Desktop (lg/xl) keep the original Figma sizes.
        "w-[225px] px-3 py-3.5 sm:w-[270px] sm:px-4 sm:py-4 md:w-[345px] md:gap-3 md:px-5 md:py-6 lg:w-[300px] lg:px-7 lg:py-8 xl:w-[350px]",
        // Anchor by side. NO translate-x — GSAP drives transform for the
        // parallax, so we keep positioning purely via left/right (otherwise
        // GSAP's matrix overrides Tailwind's translate and cards drift off
        // viewport on mobile/tablet). On mobile the negative offset cancels
        // the container's px-6 so the cards flush against the screen edges.
        side === "left"
          ? "-left-6 sm:left-3 md:left-4 lg:-left-6 xl:-left-12"
          : "-right-6 sm:right-3 md:right-4 lg:-right-6 xl:-right-12",
      ].join(" ")}
      style={{
        top: `${topPct}%`,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
    >
      <Image
        src={icon}
        alt=""
        width={36}
        height={36}
        className="h-5 w-5 shrink-0 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-9 lg:w-9"
      />
      <p className="font-sans text-[11px] font-normal leading-[1.35] sm:text-[12px] md:text-[13px] lg:text-[15px]">
        {text}
      </p>
    </div>
  );
}
