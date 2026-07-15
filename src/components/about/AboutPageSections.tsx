import Image from "next/image";
import clsx from "clsx";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { exhibitions } from "@/lib/works";

type Props = {
  locale: string;
};

export async function AboutPageSections({ locale }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const current = exhibitions.filter((item) => item.current);
  const past = exhibitions.filter((item) => !item.current);

  const mediums = [
    {
      key: "painting",
      title: t("mediumPainting"),
      description: t("mediumPaintingDesc"),
      image: "/images/golden-morning-light.webp",
    },
    {
      key: "photography",
      title: t("mediumPhotography"),
      description: t("mediumPhotographyDesc"),
      image: "/images/water-in-movement-1.webp",
    },
    {
      key: "textile",
      title: t("mediumTextile"),
      description: t("mediumTextileDesc"),
      image: "/images/weavings.webp",
    },
  ] as const;

  const highlights = [
    { label: t("born") },
    { label: t("location") },
    { label: t("education1") },
    { label: t("education2") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-32">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/whispers-green-watercolor.webp"
            alt=""
            fill
            priority
            className="object-cover opacity-20"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cream/80 via-cream to-cream" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-12 md:items-end md:gap-10 md:px-10">
          <div className="md:col-span-7">
            <p className="reveal text-xs tracking-[0.35em] text-ink-muted uppercase">
              {t("eyebrow")}
            </p>
            <h1 className="reveal reveal-delay-1 font-display mt-5 text-6xl text-ink md:text-8xl">
              {t("title")}
            </h1>
            <blockquote className="reveal reveal-delay-2 font-display mt-8 max-w-xl text-2xl leading-snug text-ink md:text-3xl">
              &ldquo;{t("quote")}&rdquo;
            </blockquote>
            <div className="reveal reveal-delay-3 mt-10 flex flex-wrap gap-2">
              {highlights.map((item) => (
                <span
                  key={item.label}
                  className="rounded-full border border-ink/10 bg-cream/60 px-4 py-2 text-xs tracking-wide text-ink-muted backdrop-blur-sm"
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className="reveal reveal-delay-2 relative md:col-span-5 md:pb-4">
            <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark shadow-2xl shadow-ink/10">
              <Image
                src="/images/whispers-green-gouache-1.webp"
                alt={t("portraitAlt")}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -right-4 -bottom-8 hidden w-2/5 overflow-hidden border-4 border-cream shadow-xl md:block">
              <div className="relative aspect-[3/4]">
                <Image
                  src="/images/traces.webp"
                  alt=""
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="border-t border-ink/5 bg-cream py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-12 md:px-10">
          <RevealOnScroll className="md:col-span-5">
            <div className="sticky top-36">
              <div className="relative aspect-[3/4] overflow-hidden bg-cream-dark">
                <Image
                  src="/images/water-energy.webp"
                  alt={t("studioAlt")}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-4 text-xs tracking-[0.22em] text-ink-muted uppercase">
                {t("studioCaption")}
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="md:col-span-6 md:col-start-7">
            <p className="text-xs tracking-[0.28em] text-sage uppercase">{t("storyLabel")}</p>
            <div className="mt-6 space-y-6 text-lg leading-relaxed text-ink-muted md:text-xl md:leading-relaxed">
              <p className="text-ink">{t("bio1")}</p>
              <p>{t("bio2")}</p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Mediums */}
      <section className="border-t border-ink/5 bg-cream-dark/40 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <RevealOnScroll>
            <div className="max-w-2xl">
              <p className="text-xs tracking-[0.28em] text-ink-muted uppercase">
                {t("practiceLabel")}
              </p>
              <h2 className="font-display mt-4 text-4xl text-ink md:text-5xl">
                {t("mediumsTitle")}
              </h2>
            </div>
          </RevealOnScroll>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {mediums.map((medium, index) => (
              <RevealOnScroll key={medium.key} className={index === 1 ? "md:mt-12" : ""}>
                <article
                  className="group flex h-full flex-col"
                  data-cursor="hover"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-cream">
                    <Image
                      src={medium.image}
                      alt={medium.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="image-hover object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                  <div className="mt-5 flex flex-1 flex-col border-t border-ink/10 pt-5">
                    <h3 className="font-display text-2xl text-ink">{medium.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted md:text-base">
                      {medium.description}
                    </p>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="relative overflow-hidden border-t border-ink/5 py-24 md:py-32">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/exhibition-1.webp"
            alt=""
            fill
            className="object-cover opacity-[0.07]"
            sizes="100vw"
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <RevealOnScroll>
            <div className="grid gap-12 md:grid-cols-12 md:items-center">
              <div className="md:col-span-5">
                <p className="text-xs tracking-[0.28em] text-sage uppercase">
                  {t("approachTitle")}
                </p>
                <p className="font-display mt-6 text-4xl leading-tight text-ink md:text-5xl lg:text-6xl">
                  {t("approachQuote")}
                </p>
              </div>
              <div className="md:col-span-6 md:col-start-7">
                <p className="text-lg leading-relaxed text-ink-muted md:text-xl">
                  {t("approach")}
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/works"
                    className="rounded-full border border-ink bg-ink px-6 py-3 text-xs tracking-[0.22em] text-cream uppercase transition-colors hover:bg-ink/90"
                    data-cursor="hover"
                  >
                    {t("ctaWorks")}
                  </Link>
                  <Link
                    href="/contact"
                    className="rounded-full border border-ink/20 px-6 py-3 text-xs tracking-[0.22em] text-ink uppercase transition-colors hover:border-ink/50"
                    data-cursor="hover"
                  >
                    {t("ctaContact")}
                  </Link>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Exhibitions timeline */}
      <section className="border-t border-ink/5 bg-ink py-24 text-cream md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <RevealOnScroll>
            <p className="text-xs tracking-[0.28em] text-cream/50 uppercase">
              {t("exhibitionsTitle")}
            </p>
            <h2 className="font-display mt-4 max-w-lg text-4xl md:text-5xl">
              {t("exhibitionsSubtitle")}
            </h2>
          </RevealOnScroll>

          <div className="mt-16">
            {current.length > 0 && (
              <RevealOnScroll className="mb-12">
                <p className="text-xs tracking-[0.25em] text-sage uppercase">{t("current")}</p>
                {current.map((item) => (
                  <div
                    key={item.title}
                    className="mt-6 border-l-2 border-sage pl-6 md:grid md:grid-cols-12 md:gap-8"
                  >
                    <p className="font-display text-3xl text-cream md:col-span-2">{item.year}</p>
                    <div className="md:col-span-10">
                      <p className="font-display text-2xl text-cream">{item.title}</p>
                      <p className="mt-2 text-sm text-cream/60">
                        {item.location} · {item.period}
                      </p>
                    </div>
                  </div>
                ))}
              </RevealOnScroll>
            )}

            <div className="relative">
              <div className="absolute top-0 bottom-0 left-[3.25rem] hidden w-px bg-cream/10 md:block" />
              <ul className="space-y-0">
                {past.map((item, index) => (
                  <RevealOnScroll key={`${item.title}-${item.period}`}>
                    <li
                      className={clsx(
                        "group border-t border-cream/10 py-8 md:grid md:grid-cols-12 md:gap-8 md:py-10",
                        index === 0 && "border-t-0 md:border-t md:border-cream/10",
                      )}
                    >
                      <div className="flex items-start gap-6 md:col-span-2 md:gap-0">
                        <span className="relative z-10 font-display text-2xl text-cream/40 transition-colors group-hover:text-sage md:text-3xl">
                          {item.year}
                        </span>
                      </div>
                      <div className="mt-2 md:col-span-10 md:mt-0">
                        <p className="font-display text-xl text-cream transition-colors group-hover:text-sage md:text-2xl">
                          {item.title}
                        </p>
                        <p className="mt-2 text-sm text-cream/50">
                          {item.location} · {item.period}
                        </p>
                      </div>
                    </li>
                  </RevealOnScroll>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
