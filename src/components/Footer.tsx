"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { triggerFooterDblClick } from "@/components/EasterEggs";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/5 bg-cream">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <p className="font-display text-2xl text-ink">Isabella Billiet</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
            {t("tagline")}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <a
            href="https://www.instagram.com/isabella_billiet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm tracking-[0.18em] text-ink uppercase transition-colors hover:text-sage"
            data-cursor="hover"
          >
            {t("instagram")}
          </a>
          <button
            type="button"
            onDoubleClick={() => triggerFooterDblClick()}
            className="text-xs text-ink-muted"
            data-cursor="hover"
          >
            © {year} Isabella Billiet — {t("rights")}
          </button>
        </div>
      </div>

      <div className="border-t border-ink/5 px-6 py-4 text-center md:px-10">
        <Link
          href="/contact"
          className="text-xs tracking-[0.25em] text-ink-muted uppercase transition-colors hover:text-ink"
          data-cursor="hover"
        >
          isabellabilliet.com
        </Link>
      </div>
    </footer>
  );
}
