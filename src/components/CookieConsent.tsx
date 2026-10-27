"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useEffect, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

const STORAGE_KEY = "ib-consent";
const CHANGE_EVENT = "ib-consent-change";

type Choice = "accepted" | "rejected";
type StoredChoice = Choice | null | "unknown";

type Props = {
  gaId: string;
};

type Gtag = (...args: unknown[]) => void;

function updateAnalyticsConsent(granted: boolean) {
  const gtag = (window as Window & { gtag?: Gtag }).gtag;
  if (!gtag) return;
  gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}

let memoryChoice: Choice | null = null;

function readChoice(): Choice | null {
  if (memoryChoice) return memoryChoice;
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "accepted" || value === "rejected") return value;
  } catch {
    return null;
  }
  return null;
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function CookieConsent({ gaId }: Props) {
  const t = useTranslations("consent");
  const stored = useSyncExternalStore<StoredChoice>(subscribe, readChoice, () => null);

  useEffect(() => {
    if (stored === "accepted") updateAnalyticsConsent(true);
  }, [stored]);

  function choose(next: Choice) {
    memoryChoice = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Preference still applies for this page view.
    }
    updateAnalyticsConsent(next === "accepted");
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return (
    <>
      {stored === "accepted" ? <GoogleAnalytics gaId={gaId} /> : null}
      {stored === null ? (
        <div
          role="region"
          aria-label={t("label")}
          className="cookie-banner fixed inset-x-0 bottom-0 z-[60] border-t border-ink/10 bg-cream/95 px-6 py-4 backdrop-blur-md md:px-10"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl text-sm leading-relaxed text-ink-muted">{t("message")}</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="min-h-11 rounded-full border border-ink/20 px-5 text-xs tracking-[0.18em] text-ink uppercase"
                onClick={() => choose("rejected")}
              >
                {t("reject")}
              </button>
              <button
                type="button"
                className="min-h-11 rounded-full border border-ink bg-ink px-5 text-xs tracking-[0.18em] text-cream uppercase"
                onClick={() => choose("accepted")}
              >
                {t("accept")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
