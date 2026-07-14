"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-ink/5 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          onClick={() => triggerNameClick()}
          className="font-display text-xl tracking-[0.18em] text-ink uppercase md:text-2xl"
          data-cursor="hover"
        >
          Isabella Billiet
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.key}
                href={item.href}
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
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((prev) => !prev)}
          data-cursor="hover"
        >
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
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-ink/5 bg-cream px-6 py-6 md:hidden"
          data-lenis-prevent
        >
          <div className="flex flex-col gap-5">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-display text-2xl text-ink"
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

  return (
    <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase">
      <Link
        href={pathname}
        locale="en"
        className="text-ink-muted transition-colors hover:text-ink data-[active=true]:text-ink"
        data-cursor="hover"
      >
        EN
      </Link>
      <span className="text-ink/20">/</span>
      <Link
        href={pathname}
        locale="nl"
        className="text-ink-muted transition-colors hover:text-ink"
        data-cursor="hover"
      >
        NL
      </Link>
    </div>
  );
}
