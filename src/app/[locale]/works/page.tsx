import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { WorksGrid } from "@/components/WorksGrid";
import { displayWorkTitle, works } from "@/lib/works";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "works" });

  return pageMetadata({
    locale,
    path: "/works",
    title: t("title"),
    description: t("subtitle"),
    image: works[0]?.image,
    imageAlt: works[0]
      ? displayWorkTitle(works[0].title, t("untitled"))
      : undefined,
  });
}

export default async function WorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("works");

  return (
    <div className="mx-auto max-w-7xl px-6 pt-36 pb-24 md:px-10 md:pt-44">
      <div className="max-w-2xl">
        <h1 className="font-display text-5xl text-ink md:text-6xl">{t("title")}</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">{t("subtitle")}</p>
      </div>

      <div className="mt-14">
        <WorksGrid works={works} />
      </div>
    </div>
  );
}
