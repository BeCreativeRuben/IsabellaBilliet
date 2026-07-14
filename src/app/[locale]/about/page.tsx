import { getTranslations, setRequestLocale } from "next-intl/server";
import { exhibitions } from "@/lib/works";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const current = exhibitions.filter((item) => item.current);
  const past = exhibitions.filter((item) => !item.current);

  return (
    <div className="mx-auto max-w-4xl px-6 pt-36 pb-24 md:px-10 md:pt-44">
      <h1 className="font-display text-5xl text-ink md:text-6xl">{t("title")}</h1>

      <div className="mt-12 space-y-6 text-base leading-relaxed text-ink-muted md:text-lg">
        <p>{t("bio1")}</p>
        <p>{t("bio2")}</p>
      </div>

      <section className="mt-16 border-t border-ink/10 pt-16">
        <h2 className="font-display text-3xl text-ink">{t("mediumsTitle")}</h2>
        <p className="mt-6 leading-relaxed text-ink-muted">{t("mediums")}</p>
      </section>

      <section className="mt-16 border-t border-ink/10 pt-16">
        <h2 className="font-display text-3xl text-ink">{t("approachTitle")}</h2>
        <p className="mt-6 leading-relaxed text-ink-muted">{t("approach")}</p>
      </section>

      <section className="mt-16 border-t border-ink/10 pt-16">
        <h2 className="font-display text-3xl text-ink">{t("exhibitionsTitle")}</h2>

        {current.length > 0 && (
          <div className="mt-8">
            <p className="text-xs tracking-[0.25em] text-sage uppercase">{t("current")}</p>
            <ul className="mt-4 space-y-4">
              {current.map((item) => (
                <li key={item.title} className="border-l-2 border-sage pl-4">
                  <p className="font-display text-xl text-ink">{item.title}</p>
                  <p className="text-sm text-ink-muted">
                    {item.location} · {item.period}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10">
          <p className="text-xs tracking-[0.25em] text-ink-muted uppercase">{t("past")}</p>
          <ul className="mt-4 space-y-4">
            {past.map((item) => (
              <li key={`${item.title}-${item.period}`} className="border-l border-ink/10 pl-4">
                <p className="font-display text-lg text-ink">{item.title}</p>
                <p className="text-sm text-ink-muted">
                  {item.location} · {item.period}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
