import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  title: `Page not found — ${SITE_NAME}`,
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-full flex-col bg-cream text-ink antialiased">
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-24">
          <p className="text-xs tracking-[0.28em] text-ink-muted uppercase">404</p>
          <h1 className="font-display mt-4 text-5xl text-ink md:text-6xl">Page not found</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-muted">
            This page does not exist. Pagina niet gevonden.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/en"
              className="inline-flex min-h-11 items-center rounded-full border border-ink bg-ink px-6 text-xs tracking-[0.22em] text-cream uppercase"
            >
              English
            </Link>
            <Link
              href="/nl"
              className="inline-flex min-h-11 items-center rounded-full border border-ink/20 px-6 text-xs tracking-[0.22em] text-ink uppercase"
            >
              Nederlands
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
