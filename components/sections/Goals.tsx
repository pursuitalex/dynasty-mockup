"use client";

/**
 * Section 3 — "Наши цели" (Goals)
 *
 * Figma node 101:179. 1240px container, 12-col grid, gap-x-24.
 *   • Eyebrow:  "НАШИ ЦЕЛИ" + 10px gold dot, SemiBold 18 / tracking -0.18
 *   • 5 rows:    col-1 → number (Bold 18, opacity 50)
 *                col-6/span-7 → goal text (Regular 24 / leading 1.3 / tracking -0.24)
 *                top-border 1px white/20 between rows
 *
 * Background continues bg-deep from Section 2.
 *
 * Alive touches:
 *   • Gold dot pulses gently
 *   • Each row reveals on view (CSS, no JS) with stagger
 *   • Row hover: number turns gold + slight slide of text + brighter divider
 */

const goals = [
  "Cтруктурировать обширный список услуг и направлений",
  "Упростить восприятие сложных бизнес-процессов",
  "Усилить доверие к компании через контент",
  "Построить понятную навигацию",
  "Повысить конверсию в заявки",
];

export function Goals() {
  return (
    <section
      className="relative w-full overflow-hidden bg-bg-deep py-[40px] sm:py-[80px]"
      aria-label="Наши цели"
    >
      <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-10 lg:px-8">
        {/* Eyebrow */}
        <div className="text-fade-in mb-10 flex items-center gap-3">
          <h2 className="font-sans text-[18px] font-semibold uppercase leading-[1.3] tracking-[-0.18px] text-white">
            Наши цели
          </h2>
          <span
            aria-hidden
            className="relative inline-flex h-2.5 w-2.5"
          >
            <span className="absolute inset-0 rounded-full bg-accent motion-safe:animate-ping" />
            <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_18px_rgba(251,221,28,0.7)]" />
          </span>
        </div>

        {/* Goals list */}
        <ol className="flex flex-col">
          {goals.map((goal, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <li
                key={num}
                className="text-fade-in group relative grid grid-cols-12 gap-x-6 border-t border-white/20 pt-5 pb-2 transition-colors duration-500 hover:border-white/40 sm:pb-3 lg:pb-5"
                style={
                  {
                    "--reveal-delay": `${i * 90}ms`,
                  } as React.CSSProperties
                }
              >
                {/* Number */}
                <span
                  className="col-span-2 self-start font-sans text-[18px] font-bold leading-[1.35] tracking-[-0.36px] text-white/50 transition-colors duration-500 group-hover:text-accent sm:col-span-1"
                  aria-hidden
                >
                  {num}.
                </span>

                {/* Goal text */}
                <p className="col-span-10 self-start py-2.5 pr-2.5 font-sans text-[clamp(18px,1.8vw,24px)] font-normal leading-[1.3] tracking-[-0.01em] text-white transition-transform duration-500 group-hover:translate-x-1 sm:col-start-6 sm:col-end-13">
                  <span className="sr-only">Цель {num}: </span>
                  {goal}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
