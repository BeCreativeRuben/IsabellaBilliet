import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { ARTIST, faqJsonLd, featuredOgAlt, pageMetadata, studioLine } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const worksT = await getTranslations({ locale, namespace: "works" });

  return pageMetadata({
    locale,
    path: "/contact",
    title: t("title"),
    description: t("subtitle"),
    imageAlt: featuredOgAlt(worksT("untitled")),
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const home = await getTranslations("home");
  const address = studioLine(locale);
  const faqs = [
    { question: t("faqStudioQ"), answer: t("faqStudioA", { address }) },
    {
      question: t("faqReachQ"),
      answer: t("faqReachA", { email: ARTIST.email, phone: ARTIST.phoneDisplay }),
    },
    { question: t("faqInquiryQ"), answer: t("subtitle") },
    { question: t("faqPracticeQ"), answer: home("subline") },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 pt-36 pb-24 md:px-10 md:pt-44">
      <JsonLd data={faqJsonLd(faqs)} />
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
              href={`mailto:${ARTIST.email}`}
              className="mt-2 block font-display text-2xl text-ink transition-colors hover:text-sage-ink"
              data-cursor="hover"
            >
              {ARTIST.email}
            </a>
          </div>
          <div>
            <p className="text-xs tracking-[0.22em] text-ink-muted uppercase">
              {t("phone")}
            </p>
            <a
              href={`tel:${ARTIST.phoneTel}`}
              className="mt-2 block font-display text-2xl text-ink transition-colors hover:text-sage-ink"
              data-cursor="hover"
            >
              {ARTIST.phoneDisplay}
            </a>
          </div>
          <div>
            <p className="text-xs tracking-[0.22em] text-ink-muted uppercase">
              {t("instagram")}
            </p>
            <a
              href={ARTIST.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block font-display text-2xl text-ink transition-colors hover:text-sage-ink"
              data-cursor="hover"
            >
              {ARTIST.instagramHandle}
            </a>
          </div>
          <div>
            <p className="text-xs tracking-[0.22em] text-ink-muted uppercase">
              {t("location")}
            </p>
            <p className="mt-2 font-display text-2xl text-ink">{address}</p>
          </div>
        </div>

        <ContactForm />
      </div>

      <section className="mt-20 border-t border-ink/10 pt-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="font-display text-4xl text-ink">
          {t("faqTitle")}
        </h2>
        <div className="mt-8 space-y-8">
          {faqs.map((item) => (
            <div key={item.question}>
              <h3 className="font-display text-2xl text-ink">{item.question}</h3>
              <p className="mt-2 max-w-2xl leading-relaxed text-ink-muted">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
