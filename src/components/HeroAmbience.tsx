"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";

type Props = {
  imageSrc: string;
};

export function HeroAmbience({ imageSrc }: Props) {
  const layerRef = useRef<HTMLDivElement>(null);
  const cursor = useRef({ x: 0.5, y: 0.5, smoothX: 0.5, smoothY: 0.5 });

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let raf = 0;

    const onMove = (event: MouseEvent) => {
      cursor.current.x = event.clientX / window.innerWidth;
      cursor.current.y = event.clientY / window.innerHeight;
    };

    const tick = () => {
      const layer = layerRef.current;
      if (layer) {
        cursor.current.smoothX += (cursor.current.x - cursor.current.smoothX) * 0.04;
        cursor.current.smoothY += (cursor.current.y - cursor.current.smoothY) * 0.04;

        const dx = (cursor.current.smoothX - 0.5) * 28;
        const dy = (cursor.current.smoothY - 0.5) * 22;

        layer.style.setProperty("--parallax-x", `${dx}px`);
        layer.style.setProperty("--parallax-y", `${dy}px`);
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-cream">
      {/* Slow Ken Burns on artwork */}
      <div className="hero-ken-burns absolute -inset-[10%]">
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.2] saturate-[0.85]"
        />
      </div>

      {/* Drifting light pools — parallax on mouse move */}
      <div
        ref={layerRef}
        className="hero-light-layer absolute inset-0"
        style={{ "--parallax-x": "0px", "--parallax-y": "0px" } as CSSProperties}
      >
        <div className="hero-orb hero-orb-a" />
        <div className="hero-orb hero-orb-b" />
        <div className="hero-orb hero-orb-c" />
      </div>

      {/* Paper grain + readibility gradient */}
      <div className="hero-grain pointer-events-none absolute inset-0 opacity-[0.035]" />
      <div className="absolute inset-0 bg-gradient-to-br from-cream/75 via-cream/55 to-cream/88" />
      <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-cream/40" />
    </div>
  );
}
