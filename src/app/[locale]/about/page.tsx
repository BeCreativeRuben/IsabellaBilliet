import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutPageSections } from "@/components/about/AboutPageSections";
import { featuredOgAlt, pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const worksT = await getTranslations({ locale, namespace: "works" });

  return pageMetadata({
    locale,
    path: "/about",
    title: t("title"),
    description: `${t("quote")} ${t("born")}. ${t("location")}.`,
    imageAlt: featuredOgAlt(worksT("untitled")),
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutPageSections locale={locale} />;
}
