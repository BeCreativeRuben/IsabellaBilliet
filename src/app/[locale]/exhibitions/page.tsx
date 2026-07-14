import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getFeaturedWorks } from "@/lib/works";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ExhibitionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("exhibitions");
  const featured = getFeaturedWorks().slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-6 pt-36 pb-24 md:px-10 md:pt-44">
      <div className="max-w-2xl">
        <h1 className="font-display text-5xl text-ink md:text-6xl">{t("title")}</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">{t("subtitle")}</p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {featured.map((work, index) => (
          <div
            key={work.slug}
            className="group relative aspect-[3/4] overflow-hidden bg-cream-dark"
            data-cursor="hover"
          >
            <Image
              src={work.imageUrl}
              alt={work.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="image-hover object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-5">
              <p className="font-display text-xl text-cream">{work.title}</p>
              <p className="text-xs text-cream/80">{work.year}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-12 text-sm text-ink-muted">{t("comingSoon")}</p>
    </div>
  );
}
