import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { WorkCard } from "@/components/WorkCard";
import { HeroAmbience } from "@/components/HeroAmbience";
import { getFeaturedWorks, getRecentWorks } from "@/lib/works";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const featured = getFeaturedWorks()[0];
  const recent = getRecentWorks(3);

  return (
    <>
      <section className="relative flex min-h-0 flex-col justify-center overflow-hidden pt-28 pb-12 md:min-h-screen md:pb-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <HeroAmbience imageSrc={featured?.image ?? "/images/whispers-green-watercolor.webp"} />
        </div>

        <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 md:grid-cols-12 md:gap-12 md:px-10">
          <div className="md:col-span-7">
            <p className="reveal text-xs tracking-[0.35em] text-ink-muted uppercase">
              {t("eyebrow")}
            </p>
            <h1 className="reveal reveal-delay-1 font-display mt-6 text-4xl leading-[1.05] text-ink sm:text-5xl md:text-7xl lg:text-8xl">
              {t("headline")}
            </h1>
            <p className="reveal reveal-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              {t("subline")}
            </p>
            <div className="reveal reveal-delay-3 mt-10 flex flex-wrap gap-4">
              <Link
                href="/works"
                className="rounded-full border border-ink bg-ink px-6 py-3 text-xs tracking-[0.22em] text-cream uppercase transition-colors hover:bg-ink/90"
                data-cursor="hover"
              >
                {t("ctaWorks")}
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-ink/20 px-6 py-3 text-xs tracking-[0.22em] text-ink uppercase transition-colors hover:border-ink/50"
                data-cursor="hover"
              >
                {t("ctaAbout")}
              </Link>
            </div>
          </div>

          {featured && (
            <div className="reveal reveal-delay-2 md:col-span-5">
              <p className="mb-3 text-xs tracking-[0.28em] text-ink-muted uppercase md:mb-4">
                {t("featured")}
              </p>
              <Link
                href={`/works/${featured.slug}`}
                className="group flex items-start gap-4 md:block"
                data-cursor="hover"
              >
                <div className="relative aspect-[3/4] w-[38%] shrink-0 overflow-hidden bg-cream-dark shadow-lg shadow-ink/10 sm:w-[42%] md:aspect-[4/5] md:w-full md:shadow-2xl">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 40vw, 40vw"
                    className="image-hover object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1 md:mt-4">
                  <p className="font-display text-xl text-ink md:text-2xl">{featured.title}</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {featured.medium} · {featured.year}
                  </p>
                </div>
              </Link>
            </div>
          )}
        </div>

        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.4em] text-ink-muted uppercase">
          {t("scroll")}
        </p>
      </section>

      <section className="border-t border-ink/5 bg-cream py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-12 flex items-end justify-between gap-6">
            <h2 className="font-display text-4xl text-ink md:text-5xl">{t("recent")}</h2>
            <Link
              href="/works"
              className="text-xs tracking-[0.22em] text-ink-muted uppercase transition-colors hover:text-ink"
              data-cursor="hover"
            >
              {t("viewAll")}
            </Link>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {recent.map((work, index) => (
              <WorkCard
                key={work.slug}
                work={work}
                viewLabel={t("viewAll")}
                priority={index === 0}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
