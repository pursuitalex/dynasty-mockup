"use client";

import Image from "next/image";

/**
 * Sticky top header — fixed at top of viewport, fully transparent at all
 * times. No background change on scroll.
 */
export function Header() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 bg-transparent"
      style={{
        animation: "headerIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1700px] items-center justify-between px-6 py-6 sm:px-10 sm:py-8 lg:px-16 lg:py-10">
        <a
          href="#"
          aria-label="Design Planet — главная"
          className="inline-flex items-center transition-opacity duration-300 hover:opacity-80"
        >
          <Image
            src="/img/DP-logo.svg"
            alt="Design Planet"
            width={174}
            height={36}
            className="h-8 w-auto lg:h-9"
            priority
          />
        </a>

        <button
          type="button"
          aria-label="Открыть меню"
          className="grid h-12 w-12 place-items-center rounded-full transition-opacity duration-300 hover:opacity-80 lg:h-14 lg:w-14"
        >
          <Image
            src="/img/menu-burger.svg"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8"
          />
        </button>
      </div>
    </header>
  );
}
