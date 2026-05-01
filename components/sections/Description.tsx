"use client";

import Image from "next/image";

/**
 * Section 2 — Project description + client gold logo
 *
 * Figma node 101:160. Background continues the dark-blue from Hero (#002057),
 * 12-col grid (1240px container, 24px gutter):
 *   • cols 1–8 → long description, Euclid Medium 32 / leading 1.25 / tracking -0.32px
 *   • cols 11–12 → gold round monogram + "DYNASTY business adviser" wordmark
 *
 * Subtle "alive" touches that don't fight the layout:
 *   • Soft gold glow + slow rotating ring around the logo
 *   • Atmospheric BLUR shapes drifting (matches hero language)
 *   • Per-word fade-up reveal on the description (CSS only, GSAP layer comes later)
 */
export function Description() {
  const text =
    "Dynasty Business Adviser — консалтинговая компания, специализирующаяся на открытии и сопровождении бизнеса в ОАЭ. Компания предоставляет услуги по регистрации компаний, лицензированию, открытию банковских счетов, визовой поддержке и юридическому сопровождению. Сайт должен был стать инструментом для привлечения клиентов и удобной презентации большого количества услуг.";

  // Split into words but keep punctuation glued to the preceding word
  const words = text.split(" ");

  return (
    <section
      className="relative isolate w-full overflow-hidden bg-bg-deep py-[80px]"
      aria-label="О проекте Dynasty Business Adviser"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-6 sm:px-10 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-6">
          {/* Description text — col-span-8 */}
          <div className="min-w-0 lg:col-span-8">
            <p
              className="font-sans text-[clamp(20px,2.4vw,32px)] font-medium leading-[1.28] tracking-[-0.01em] text-white"
              aria-label={text}
            >
              {words.map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  className="word-reveal"
                  style={
                    {
                      "--word-delay": `${Math.min(i * 28, 1400)}ms`,
                    } as React.CSSProperties
                  }
                  aria-hidden
                >
                  {word}
                  {i < words.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
          </div>

          {/* Gold client mark — cols 11-12 */}
          <div className="flex justify-start lg:col-span-4 lg:justify-end">
            <Image
              src="/img/logo-gold.svg"
              alt="Dynasty Business Adviser"
              width={180}
              height={180}
              className="h-[clamp(80px,14vw,176px)] w-[clamp(80px,14vw,176px)] transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
