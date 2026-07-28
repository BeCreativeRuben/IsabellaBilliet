"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const root = rootRef.current;
    if (isTouch || !root) return;

    const dot = root.querySelector<HTMLElement>("[data-cursor-dot]");
    const ring = root.querySelector<HTMLElement>("[data-cursor-ring]");
    const dotInner = root.querySelector<HTMLElement>("[data-cursor-dot-inner]");
    const ringInner = root.querySelector<HTMLElement>("[data-cursor-ring-inner]");
    if (!dot || !ring || !dotInner || !ringInner) return;

    root.hidden = false;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let raf = 0;
    let running = false;
    let hovering = false;
    let clicking = false;
    let visible = false;
    let idleTimer = 0;

    const STOP_THRESHOLD = 0.15;

    const applyClasses = () => {
      dotInner.className = clicking
        ? "h-1.5 w-1.5 rounded-full bg-white transition-[width,height] duration-300"
        : hovering
          ? "h-2 w-2 rounded-full bg-white transition-[width,height] duration-300"
          : "h-2.5 w-2.5 rounded-full bg-white transition-[width,height] duration-300";

      ringInner.className = clicking
        ? "h-6 w-6 rounded-full border border-ink/50 transition-all duration-300 ease-out"
        : hovering
          ? "h-14 w-14 rounded-full border border-sage/60 bg-sage/5 transition-all duration-300 ease-out"
          : "h-10 w-10 rounded-full border border-ink/20 transition-all duration-300 ease-out";
    };

    const setVisible = (next: boolean) => {
      if (visible === next) return;
      visible = next;
      const opacity = next ? "1" : "0";
      dot.style.opacity = opacity;
      ring.style.opacity = opacity;
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

      if (
        Math.abs(mouseX - ringX) < STOP_THRESHOLD &&
        Math.abs(mouseY - ringY) < STOP_THRESHOLD
      ) {
        running = false;
        return;
      }

      raf = requestAnimationFrame(animate);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(animate);
    };

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      setVisible(true);
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      start();

      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => setVisible(false), 2500);
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const next = Boolean(
        target?.closest("a, button, [data-cursor='hover'], input, textarea, select, label"),
      );
      if (next === hovering) return;
      hovering = next;
      applyClasses();
    };

    const onLeave = () => setVisible(false);
    const onDown = () => {
      clicking = true;
      applyClasses();
    };
    const onUp = () => {
      clicking = false;
      applyClasses();
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(idleTimer);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div ref={rootRef} hidden aria-hidden>
      <div
        data-cursor-dot
        className="pointer-events-none fixed top-0 left-0 z-[100000] -translate-x-1/2 -translate-y-1/2 mix-blend-difference opacity-0 transition-opacity duration-300"
      >
        <div
          data-cursor-dot-inner
          className="h-2.5 w-2.5 rounded-full bg-white transition-[width,height] duration-300"
        />
      </div>
      <div
        data-cursor-ring
        className="pointer-events-none fixed top-0 left-0 z-[99999] -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300"
      >
        <div
          data-cursor-ring-inner
          className="h-10 w-10 rounded-full border border-ink/20 transition-all duration-300 ease-out"
        />
      </div>
    </div>
  );
}
