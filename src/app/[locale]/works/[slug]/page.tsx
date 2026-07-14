import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getWorkBySlug, works } from "@/lib/works";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

export default async function WorkDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("works");
  const work = getWorkBySlug(slug);

  if (!work) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 pt-36 pb-24 md:px-10 md:pt-44">
      <Link
        href="/works"
        className="text-xs tracking-[0.22em] text-ink-muted uppercase transition-colors hover:text-ink"
        data-cursor="hover"
      >
        ← {t("title")}
      </Link>

      <div className="mt-10 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
            <Image
              src={work.imageUrl}
              alt={work.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-4 lg:pt-8">
          <h1 className="font-display text-4xl text-ink md:text-5xl">{work.title}</h1>
          {work.series && (
            <p className="mt-2 text-sm tracking-[0.18em] text-sage uppercase">
              {work.series}
            </p>
          )}
          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="text-ink-muted">{t("details")}</dt>
              <dd className="mt-1 text-ink">{work.medium}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">{t("dimensions")}</dt>
              <dd className="mt-1 text-ink">{work.dimensions}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">{t("year")}</dt>
              <dd className="mt-1 text-ink">{work.year}</dd>
            </div>
          </dl>

          <a
            href={work.instagramPost}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex rounded-full border border-ink px-5 py-3 text-xs tracking-[0.2em] text-ink uppercase transition-colors hover:bg-ink hover:text-cream"
            data-cursor="hover"
          >
            {t("viewOnInstagram")}
          </a>
        </div>
      </div>
    </div>
  );
}
