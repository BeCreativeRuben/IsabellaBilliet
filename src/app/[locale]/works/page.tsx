import { getTranslations, setRequestLocale } from "next-intl/server";
import { WorksGrid } from "@/components/WorksGrid";
import { works } from "@/lib/works";

type Props = {
  params: Promise<{ locale: string }>;
};

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
