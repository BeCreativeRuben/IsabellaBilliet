"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;
    setEnabled(true);

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let raf = 0;

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      setVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`;
      }

      raf = requestAnimationFrame(animate);
    };

    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest(
        "a, button, [data-cursor='hover'], input, textarea, select, label",
      );
      setHovering(Boolean(interactive));
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className={clsx(
          "pointer-events-none fixed top-0 left-0 z-[100000] -translate-x-1/2 -translate-y-1/2 mix-blend-difference",
          "transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0",
        )}
      >
        <div
          className={clsx(
            "rounded-full bg-white transition-all duration-300",
            clicking ? "h-1.5 w-1.5" : hovering ? "h-2 w-2" : "h-2.5 w-2.5",
          )}
        />
      </div>
      <div
        ref={ringRef}
        aria-hidden
        className={clsx(
          "pointer-events-none fixed top-0 left-0 z-[99999] -translate-x-1/2 -translate-y-1/2",
          "transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0",
        )}
      >
        <div
          className={clsx(
            "rounded-full border border-ink/30 transition-all duration-400 ease-out",
            clicking
              ? "h-6 w-6 border-ink/50"
              : hovering
                ? "h-14 w-14 border-sage/60 bg-sage/5"
                : "h-10 w-10 border-ink/20",
          )}
        />
      </div>
    </>
  );
}
