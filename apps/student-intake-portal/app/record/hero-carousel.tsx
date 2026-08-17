"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The header photograph, cycling slowly through a few frames of the same programme.
 *
 * Crossfades rather than slides, because the name and programme sit on top of it and
 * anything that moves under type makes the type hard to read. Pauses while the pointer
 * is over it, and stands still entirely for anyone who has asked for reduced motion.
 */
export default function HeroCarousel({
  images,
  alt,
  interval = 6000,
}: {
  images: string[];
  alt: string;
  interval?: number;
}) {
  const [shown, set_shown] = useState(0);
  const [paused, set_paused] = useState(false);
  const still = useRef(false);

  useEffect(() => {
    still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (images.length < 2 || paused || still.current) return;
    const id = window.setInterval(
      () => set_shown((i) => (i + 1) % images.length),
      interval
    );
    return () => window.clearInterval(id);
  }, [images.length, paused, interval]);

  if (images.length === 0) return null;

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => set_paused(true)}
      onMouseLeave={() => set_paused(false)}
    >
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={i === 0 ? alt : ""}
          aria-hidden={i === 0 ? undefined : true}
          className={i === shown ? "on" : ""}
          // All eager: a lazy frame fades in before it has downloaded and the header
          // goes blank mid-crossfade. Four local files is a cheap price for never
          // showing an empty header.
          loading="eager"
          fetchPriority={i === 0 ? "high" : "low"}
          decoding="async"
        />
      ))}

      {images.length > 1 ? (
        <div className="hero-dots">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Show photograph ${i + 1} of ${images.length}`}
              aria-current={i === shown ? "true" : undefined}
              onClick={() => set_shown(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
