"use client";

import Image from "next/image";

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
  },
  {
    side: "right" as const,
    top: 1106,
    icon: "/img/icons/kanban.svg",
    text: "Основной акцент сделан на категориях и популярных направлениях, дополнительно представлены новости, информация о программе и команда проекта.",
  },
];

export function HomepageBreakdown() {
  return (
    <section
      className="relative w-full overflow-hidden bg-bg-deep py-[80px]"
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
            <h2 className="font-sans text-[clamp(32px,4.5vw,46px)] font-medium leading-[1.1] tracking-[-0.01em]">
              Главная Страница
            </h2>
            <p className="text-[clamp(15px,1.4vw,18px)] font-normal leading-[1.35] tracking-[-0.18px] opacity-80">
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
                delayMs={i * 200}
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
  delayMs?: number;
}

function GlassCard({ side, topPct, icon, text, delayMs = 0 }: GlassCardProps) {
  return (
    <div
      className={[
        // base
        "absolute z-20 hidden w-[300px] rounded-[16px] border-2 px-7 py-8 text-white",
        "shadow-[0_60px_40px_rgba(0,0,0,0.21),0_30.375px_17.438px_rgba(0,0,0,0.14),0_12px_6.5px_rgba(0,0,0,0.10),0_2.625px_2.313px_rgba(0,0,0,0.07)]",
        "backdrop-blur-[12px]",
        // Show on lg+ where the screenshot frame is wide enough for
        // floating cards to make sense. On mobile they'd cover everything.
        "lg:flex lg:flex-col lg:gap-3 xl:w-[350px]",
        // Anchoring per side. We push outward so half the card overlaps the
        // screenshot edge and half hangs over the gutter (matches Figma).
        side === "left"
          ? "lg:left-0 lg:-translate-x-[10%] xl:-translate-x-[25%]"
          : "lg:right-0 lg:translate-x-[10%] xl:translate-x-[25%]",
        "glass-card",
      ].join(" ")}
      style={
        {
          top: `${topPct}%`,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderColor: "rgba(149, 131, 191, 0.3)",
          "--card-delay": `${delayMs}ms`,
        } as React.CSSProperties
      }
    >
      <Image
        src={icon}
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 shrink-0"
      />
      <p className="font-sans text-[15px] font-bold leading-[1.35]">{text}</p>
    </div>
  );
}
