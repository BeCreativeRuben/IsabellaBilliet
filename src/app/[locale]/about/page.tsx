import { setRequestLocale } from "next-intl/server";
import { AboutPageSections } from "@/components/about/AboutPageSections";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutPageSections locale={locale} />;
}
