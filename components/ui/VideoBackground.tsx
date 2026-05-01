"use client";

import { useEffect, useRef, useState } from "react";

interface VideoBackgroundProps {
  /** Desktop / large-screen source (>= 768px) */
  desktopSrc: string;
  /** Mobile source (< 768px). If omitted, desktop is used everywhere. */
  mobileSrc?: string;
  /** Optional MP4 fallbacks for Safari (same breakpoint logic). */
  desktopMp4?: string;
  mobileMp4?: string;
  /** Optional poster image shown until video can play */
  poster?: string;
  className?: string;
  /** Match queryList against the *mobile* source. Defaults to (max-width: 767px). */
  mobileQuery?: string;
  /** Object-fit value, defaults to "cover". */
  fit?: "cover" | "contain";
}

/**
 * Full-bleed background <video> that swaps between mobile/desktop sources
 * based on a media query, autoplays muted+inline, and falls back to a poster.
 *
 * - Loads only the source that matches the current viewport
 * - Re-mounts the <video> when the breakpoint flips (so the right file loads)
 * - Cross-browser: webm primary, optional mp4 fallback for Safari
 */
export function VideoBackground({
  desktopSrc,
  mobileSrc,
  desktopMp4,
  mobileMp4,
  poster,
  className = "",
  mobileQuery = "(max-width: 767px)",
  fit = "cover",
}: VideoBackgroundProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mql = window.matchMedia(mobileQuery);
    const update = () => setIsMobile(mql.matches);
    update();
    setMounted(true);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [mobileQuery]);

  // Force an explicit load() when sources change
  useEffect(() => {
    if (mounted && videoRef.current) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          /* autoplay may be blocked — poster covers it */
        });
      }
    }
  }, [mounted, isMobile]);

  const webm = isMobile && mobileSrc ? mobileSrc : desktopSrc;
  const mp4 = isMobile && mobileMp4 ? mobileMp4 : desktopMp4;

  return (
    <video
      ref={videoRef}
      key={webm}
      className={`pointer-events-none absolute inset-0 h-full w-full ${
        fit === "cover" ? "object-cover" : "object-contain"
      } ${className}`}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      aria-hidden="true"
    >
      <source src={webm} type="video/webm" />
      {mp4 ? <source src={mp4} type="video/mp4" /> : null}
    </video>
  );
}
