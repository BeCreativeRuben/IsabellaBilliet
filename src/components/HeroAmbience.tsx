"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type Props = {
  imageSrc: string;
};

export function HeroAmbience({ imageSrc }: Props) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const layer = layerRef.current;
    if (!layer) return;

    let targetX = 0.5;
    let targetY = 0.5;
    let smoothX = 0.5;
    let smoothY = 0.5;
    let raf = 0;
    let running = false;

    const STOP_THRESHOLD = 0.0004;

    const tick = () => {
      smoothX += (targetX - smoothX) * 0.05;
      smoothY += (targetY - smoothY) * 0.05;

      const dx = (smoothX - 0.5) * 18;
      const dy = (smoothY - 0.5) * 14;

      layer.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;

      const settled =
        Math.abs(targetX - smoothX) < STOP_THRESHOLD &&
        Math.abs(targetY - smoothY) < STOP_THRESHOLD;

      if (settled) {
        running = false;
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (event: MouseEvent) => {
      targetX = event.clientX / window.innerWidth;
      targetY = event.clientY / window.innerHeight;
      start();
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-cream">
      <div className="hero-ken-burns absolute -inset-[8%]">
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.18] saturate-[0.85]"
        />
      </div>

      <div ref={layerRef} className="hero-light-layer absolute inset-0 will-change-transform">
        <div className="hero-orb hero-orb-a" />
        <div className="hero-orb hero-orb-b" />
        <div className="hero-orb hero-orb-c" />
      </div>

      <div className="hero-grain pointer-events-none absolute inset-0 opacity-[0.03]" />
      <div className="absolute inset-0 bg-gradient-to-br from-cream/75 via-cream/55 to-cream/88" />
      <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-cream/40" />
    </div>
  );
}
