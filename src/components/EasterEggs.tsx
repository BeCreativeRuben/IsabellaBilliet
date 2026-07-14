"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const PAINT_COLORS = ["#7d8b6f", "#b8956b", "#c9a962", "#5c564e", "#1a1714"];

export function EasterEggs() {
  const t = useTranslations("easterEgg");
  const [toast, setToast] = useState<string | null>(null);
  const [studioMode, setStudioMode] = useState(false);
  const konamiIndex = useRef(0);
  const nameClicks = useRef(0);
  const typedBuffer = useRef("");

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (key === KONAMI[konamiIndex.current]) {
        konamiIndex.current += 1;
        if (konamiIndex.current === KONAMI.length) {
          konamiIndex.current = 0;
          setStudioMode((prev) => !prev);
          showToast(t("studioMode"));
        }
      } else {
        konamiIndex.current = key === KONAMI[0] ? 1 : 0;
      }

      if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
        typedBuffer.current = (typedBuffer.current + event.key.toLowerCase()).slice(-6);
        if (typedBuffer.current.endsWith("light") || typedBuffer.current.endsWith("licht")) {
          typedBuffer.current = "";
          document.body.classList.add("light-found");
          showToast(t("light"));
          window.setTimeout(() => document.body.classList.remove("light-found"), 2000);
        }
      }
    };

    const onNameClick = (event: Event) => {
      const custom = event as CustomEvent;
      nameClicks.current += 1;
      if (nameClicks.current >= 7) {
        nameClicks.current = 0;
        showToast(custom.detail?.secret ?? t("secret"));
      }
    };

    const onFooterDblClick = () => {
      showToast(t("paintSplash"));
      for (let i = 0; i < 24; i++) {
        const dot = document.createElement("div");
        dot.className = "paint-dot";
        dot.style.left = `${Math.random() * window.innerWidth}px`;
        dot.style.top = `${Math.random() * window.innerHeight * 0.5}px`;
        dot.style.background = PAINT_COLORS[i % PAINT_COLORS.length];
        dot.style.animationDelay = `${Math.random() * 0.4}s`;
        document.body.appendChild(dot);
        window.setTimeout(() => dot.remove(), 1400);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("ib-name-click", onNameClick);
    window.addEventListener("ib-footer-dblclick", onFooterDblClick);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("ib-name-click", onNameClick);
      window.removeEventListener("ib-footer-dblclick", onFooterDblClick);
    };
  }, [showToast, t]);

  useEffect(() => {
    document.body.classList.toggle("studio-mode", studioMode);
  }, [studioMode]);

  return (
    toast && (
      <div
        className={clsx(
          "easter-toast fixed bottom-8 left-1/2 z-[100001] -translate-x-1/2",
          "rounded-full border border-ink/10 bg-cream/95 px-5 py-2.5",
          "font-body text-sm tracking-wide text-ink shadow-lg backdrop-blur-sm",
        )}
        role="status"
      >
        {toast}
      </div>
    )
  );
}

export function triggerNameClick(secret?: string) {
  window.dispatchEvent(new CustomEvent("ib-name-click", { detail: { secret } }));
}

export function triggerFooterDblClick() {
  window.dispatchEvent(new Event("ib-footer-dblclick"));
}
