"use client";

import { RevealLines } from "@/components/motion/RevealLines";

/**
 * Section 5 — "Подход к разработке"
 *
 * Figma node 101:196. Two-column layout in a 1240px / 12-col grid:
 *   • cols 1–4 → eyebrow "ПОДХОД К РАЗРАБОТКЕ" + 10px gold dot
 *   • cols 6–12 → body paragraph (Regular 24 / leading 1.45 / tracking -0.24)
 *   • thin bottom divider (white @ 20%, 1px) under the row, with 120px of pb
 *     between the text and the divider — this matches the rhythm in Figma.
 *
 * Background continues bg-deep from Section 4.
 *
 * Alive touches:
 *   • Gold dot pulses (same idiom as Goals section)
 *   • Body text fades up on first paint
 */

const body =
  "Основной вызов — большое количество услуг и вложенных страниц. Мы выстроили структуру так, чтобы пользователь быстро находил нужное решение и легко переходил к консультации. Каждая услуга вынесена на отдельную страницу, что усиливает SEO и позволяет масштабировать проект. Интерфейс дополнен легкой анимацией, повышающей качество восприятия и взаимодействия.";

export function Approach() {
  return (
    <section
      className="relative w-full overflow-hidden bg-bg-deep py-[40px] sm:py-[80px]"
      aria-label="Подход к разработке"
    >
      <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-10 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-y-10 border-b border-white/20 pb-[120px] lg:grid-cols-12 lg:gap-x-6 lg:gap-y-0">
          {/* Eyebrow — col-span-4 */}
          <div className="text-fade-in flex items-center gap-3 lg:col-span-4">
            <h2 className="font-sans text-[18px] font-semibold uppercase leading-[1.3] tracking-[-0.18px] text-white">
              Подход к разработке
            </h2>
            <span aria-hidden className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inset-0 rounded-full bg-accent motion-safe:animate-ping" />
              <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_18px_rgba(251,221,28,0.7)]" />
            </span>
          </div>

          {/* Body — cols 6-12 */}
          <div className="min-w-0 lg:col-span-7 lg:col-start-6">
            <RevealLines
              text={body}
              className="font-sans text-[clamp(18px,1.6vw,24px)] font-normal leading-[1.45] tracking-[-0.01em] text-white"
              staggerSec={0.16}
              durationSec={0.4}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
