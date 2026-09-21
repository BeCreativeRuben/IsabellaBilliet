import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/ContactForm";

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
              href="mailto:isabella.billiet@gmail.com"
              className="mt-2 block font-display text-2xl text-ink transition-colors hover:text-sage"
              data-cursor="hover"
            >
              isabella.billiet@gmail.com
            </a>
          </div>
          <div>
            <p className="text-xs tracking-[0.22em] text-ink-muted uppercase">
              {t("phone")}
            </p>
            <a
              href="tel:+32474095177"
              className="mt-2 block font-display text-2xl text-ink transition-colors hover:text-sage"
              data-cursor="hover"
            >
              +32 474 09 51 77
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
            <p className="mt-2 font-display text-2xl text-ink">
              Oude Houtlei, 9000 Ghent
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
