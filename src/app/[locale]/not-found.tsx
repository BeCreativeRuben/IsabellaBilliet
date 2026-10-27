import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col justify-center px-6 py-36">
      <p className="text-xs tracking-[0.28em] text-ink-muted uppercase">404</p>
      <h1 className="font-display mt-4 text-5xl text-ink md:text-6xl">{t("title")}</h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-muted">{t("body")}</p>
      <Link
        href="/"
        className="mt-10 inline-flex min-h-11 w-fit items-center rounded-full border border-ink bg-ink px-6 text-xs tracking-[0.22em] text-cream uppercase"
      >
        {t("home")}
      </Link>
    </div>
  );
}
