"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { triggerNameClick } from "@/components/EasterEggs";
import clsx from "clsx";

const navItems = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/works", key: "works" },
  { href: "/exhibitions", key: "exhibitions" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-ink/5 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          onClick={() => triggerNameClick()}
          className="shrink-0 whitespace-nowrap font-display text-xl tracking-[0.18em] text-ink uppercase md:text-2xl"
          data-cursor="hover"
        >
          Isabella Billiet
        </Link>

        <nav className="hidden items-center gap-5 xl:gap-8 xl:flex" aria-label={t("primary")}>
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "text-xs tracking-[0.22em] uppercase transition-colors duration-300",
                  active ? "text-ink" : "text-ink-muted hover:text-ink",
                )}
                data-cursor="hover"
              >
                {t(item.key)}
              </Link>
            );
          })}
          <LanguageSwitcher />
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center xl:hidden"
          aria-label={open ? t("closeMenu") : t("openMenu")}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((prev) => !prev)}
          data-cursor="hover"
        >
          <span className="flex flex-col gap-1.5">
            <span
              className={clsx(
                "block h-px w-6 bg-ink transition-transform",
                open && "translate-y-[7px] rotate-45",
              )}
            />
            <span
              className={clsx(
                "block h-px w-6 bg-ink transition-opacity",
                open && "opacity-0",
              )}
            />
            <span
              className={clsx(
                "block h-px w-6 bg-ink transition-transform",
                open && "-translate-y-[7px] -rotate-45",
              )}
            />
          </span>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-ink/5 bg-cream px-6 py-6 xl:hidden"
          aria-label={t("mobile")}
          data-lenis-prevent
        >
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="inline-flex min-h-11 items-center font-display text-2xl text-ink"
                data-cursor="hover"
              >
                {t(item.key)}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>
        </nav>
      )}
    </header>
  );
}

function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase">
      <Link
        href={pathname}
        locale="en"
        hrefLang="en"
        aria-current={locale === "en" ? "page" : undefined}
        className={clsx(
          "inline-flex min-h-11 items-center px-1 transition-colors hover:text-ink xl:min-h-0",
          locale === "en" ? "text-ink" : "text-ink-muted",
        )}
        data-cursor="hover"
      >
        EN
      </Link>
      <span className="text-ink/20" aria-hidden>
        /
      </span>
      <Link
        href={pathname}
        locale="nl"
        hrefLang="nl"
        aria-current={locale === "nl" ? "page" : undefined}
        className={clsx(
          "inline-flex min-h-11 items-center px-1 transition-colors hover:text-ink xl:min-h-0",
          locale === "nl" ? "text-ink" : "text-ink-muted",
        )}
        data-cursor="hover"
      >
        NL
      </Link>
    </div>
  );
}
