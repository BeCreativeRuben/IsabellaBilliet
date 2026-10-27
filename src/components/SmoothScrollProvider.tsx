"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function SmoothScrollProvider({ children }: Props) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        duration: reduceMotion ? 0 : 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: !reduceMotion,
        touchMultiplier: reduceMotion ? 1 : 1.5,
        syncTouch: false,
        autoRaf: !reduceMotion,
      }}
    >
      {children}
    </ReactLenis>
  );
}
