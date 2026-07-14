import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="mx-auto max-w-4xl px-6 pt-36 pb-24 md:px-10 md:pt-44">
      <h1 className="font-display text-5xl text-ink md:text-6xl">{t("title")}</h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-muted">
        {t("subtitle")}
      </p>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <p className="text-xs tracking-[0.22em] text-ink-muted uppercase">
              {t("email")}
            </p>
            <a
              href="mailto:info@isabellabilliet.com"
              className="mt-2 block font-display text-2xl text-ink transition-colors hover:text-sage"
              data-cursor="hover"
            >
              info@isabellabilliet.com
            </a>
          </div>
          <div>
            <p className="text-xs tracking-[0.22em] text-ink-muted uppercase">
              {t("instagram")}
            </p>
            <a
              href="https://www.instagram.com/isabella_billiet"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block font-display text-2xl text-ink transition-colors hover:text-sage"
              data-cursor="hover"
            >
              @isabella_billiet
            </a>
          </div>
          <div>
            <p className="text-xs tracking-[0.22em] text-ink-muted uppercase">
              {t("location")}
            </p>
            <p className="mt-2 font-display text-2xl text-ink">Ghent, Belgium</p>
          </div>
        </div>

        <form className="space-y-5 border border-ink/10 bg-cream-dark/30 p-6 md:p-8">
          <div>
            <label htmlFor="name" className="text-xs tracking-[0.18em] text-ink-muted uppercase">
              {t("formName")}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="mt-2 w-full border-b border-ink/15 bg-transparent py-2 text-ink outline-none focus:border-ink"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-xs tracking-[0.18em] text-ink-muted uppercase">
              {t("formEmail")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="mt-2 w-full border-b border-ink/15 bg-transparent py-2 text-ink outline-none focus:border-ink"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="text-xs tracking-[0.18em] text-ink-muted uppercase"
            >
              {t("formMessage")}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="mt-2 w-full resize-none border-b border-ink/15 bg-transparent py-2 text-ink outline-none focus:border-ink"
            />
          </div>
          <button
            type="button"
            className="rounded-full border border-ink bg-ink px-6 py-3 text-xs tracking-[0.22em] text-cream uppercase transition-colors hover:bg-ink/90"
            data-cursor="hover"
          >
            {t("formSend")}
          </button>
          <p className="text-xs leading-relaxed text-ink-muted">{t("formNote")}</p>
        </form>
      </div>
    </div>
  );
}
