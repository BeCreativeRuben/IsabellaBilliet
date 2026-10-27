import type { Metadata } from "next";
import { displayWorkTitle, getFeaturedWorks, type Work } from "./works.ts";

export const SITE_URL = "https://isabellabilliet.com";
export const SITE_NAME = "Isabella Billiet";
export const PRODUCTION_HOST = "isabellabilliet.com";

/** Facts published on the site. Keep contact copy, JSON-LD and llms.txt aligned with these. */
export const ARTIST = {
  email: "isabella.billiet@gmail.com",
  phoneDisplay: "+32 474 09 51 77",
  phoneTel: "+32474095177",
  street: "Oude Houtlei",
  postalCode: "9000",
  localityEn: "Ghent",
  localityNl: "Gent",
  countryEn: "Belgium",
  countryNl: "België",
  instagram: "https://www.instagram.com/isabella_billiet",
  instagramHandle: "@isabella_billiet",
  portrait: "/images/isabella-portrait.webp",
} as const;

export function studioLine(locale: string): string {
  const city = locale === "nl" ? ARTIST.localityNl : ARTIST.localityEn;
  return `${ARTIST.street}, ${ARTIST.postalCode} ${city}`;
}

const featured = getFeaturedWorks()[0];

export const DEFAULT_OG_IMAGE =
  featured?.image ?? "/images/whispers-green-watercolor.webp";
export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 1600;
export const DEFAULT_OG_IMAGE_ALT = SITE_NAME;

export function featuredOgAlt(untitledLabel: string): string {
  if (!featured?.title) return SITE_NAME;
  return displayWorkTitle(featured.title, untitledLabel);
}

export const STATIC_PATHS = ["", "/about", "/works", "/exhibitions", "/contact"] as const;

type PageMetadataInput = {
  locale: string;
  path: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
  image?: string;
  imageAlt?: string;
};

export function ogLocale(locale: string): "nl_BE" | "en_GB" {
  return locale === "nl" ? "nl_BE" : "en_GB";
}

export function pagePath(locale: string, path: string): string {
  return `/${locale}${path}`;
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
  image = DEFAULT_OG_IMAGE,
  imageAlt = DEFAULT_OG_IMAGE_ALT,
}: PageMetadataInput): Metadata {
  const pathname = pagePath(locale, path);
  const fullTitle = absoluteTitle ? title : `${title} — ${SITE_NAME}`;
  const ogImage =
    image === DEFAULT_OG_IMAGE
      ? {
          url: image,
          alt: imageAlt,
          width: DEFAULT_OG_IMAGE_WIDTH,
          height: DEFAULT_OG_IMAGE_HEIGHT,
        }
      : { url: image, alt: imageAlt };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: pathname,
      languages: {
        en: pagePath("en", path),
        nl: pagePath("nl", path),
        "x-default": pagePath("en", path),
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: pathname,
      siteName: SITE_NAME,
      locale: ogLocale(locale),
      alternateLocale: locale === "nl" ? "en_GB" : "nl_BE",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export function hreflangLinkHeader(pathname: string): string | null {
  const match = pathname.match(/^\/(en|nl)(\/.*)?$/);
  if (!match) return null;

  const suffix = match[2] ?? "";
  const en = `${SITE_URL}/en${suffix}`;
  const nl = `${SITE_URL}/nl${suffix}`;

  return [
    `<${en}>; rel="alternate"; hreflang="en"`,
    `<${nl}>; rel="alternate"; hreflang="nl"`,
    `<${en}>; rel="alternate"; hreflang="x-default"`,
  ].join(", ");
}

export function siteJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Person", "VisualArtist"],
        "@id": `${SITE_URL}/#isabella-billiet`,
        name: SITE_NAME,
        url: SITE_URL,
        image: `${SITE_URL}${ARTIST.portrait}`,
        email: ARTIST.email,
        telephone: ARTIST.phoneDisplay,
        description,
        birthDate: "1966",
        birthPlace: {
          "@type": "Place",
          name: "Tielt",
        },
        sameAs: [ARTIST.instagram],
        address: {
          "@type": "PostalAddress",
          streetAddress: ARTIST.street,
          postalCode: ARTIST.postalCode,
          addressLocality: ARTIST.localityEn,
          addressCountry: "Belgium",
        },
        alumniOf: [
          { "@type": "CollegeOrUniversity", name: "Ghent University" },
          { "@type": "CollegeOrUniversity", name: "KASK, Ghent" },
          {
            "@type": "EducationalOrganization",
            name: "Royale Académie Internationale d’Été de Wallonie",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description,
        inLanguage: ["en", "nl"],
        publisher: { "@id": `${SITE_URL}/#isabella-billiet` },
      },
    ],
  };
}

const DIMENSIONS = /^(\d+(?:\.\d+)?)\s*×\s*(\d+(?:\.\d+)?)\s*cm$/;

export function visualArtworkJsonLd(work: Work, locale: string) {
  const size = work.dimensions.match(DIMENSIONS);
  const artwork: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: work.title,
    artMedium: work.medium,
    dateCreated: String(work.year),
    image: `${SITE_URL}${work.image}`,
    url: `${SITE_URL}${pagePath(locale, `/works/${work.slug}`)}`,
    creator: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  if (work.series) {
    artwork.isPartOf = {
      "@type": "CreativeWorkSeries",
      name: work.series,
    };
  }

  if (size) {
    artwork.width = {
      "@type": "QuantitativeValue",
      value: Number(size[1]),
      unitText: "cm",
    };
    artwork.height = {
      "@type": "QuantitativeValue",
      value: Number(size[2]),
      unitText: "cm",
    };
  }

  if (work.instagramPost.includes("/p/")) {
    artwork.sameAs = work.instagramPost;
  }

  return artwork;
}

export function workMetaDescription(
  work: Work,
  labels: { details: string; dimensions: string; year: string },
): string {
  const parts = [`${labels.details}: ${work.medium}`];
  if (work.dimensions !== "—") {
    parts.push(`${labels.dimensions}: ${work.dimensions}`);
  }
  parts.push(`${labels.year}: ${work.year}`);
  const series = work.series ? `${work.series}. ` : "";
  return `${work.title}. ${series}${parts.join(". ")}.`;
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function llmsTxt(): string {
  const page = (locale: "en" | "nl", path: string) => `${SITE_URL}/${locale}${path}`;
  const studioEn = studioLine("en");
  const studioNl = studioLine("nl");

  return `# Isabella Billiet

> Paintings, works on paper and textile — observing light and ever-changing shadows. Based in Ghent, Belgium. Creating in dialogue with nature.

> Schilderijen, werken op papier en textiel — licht en steeds veranderende schaduwen observeren. Gevestigd in Gent, België. Creëren in dialoog met de natuur.

Isabella Billiet. Born in Tielt, 1966. Lives and works in Ghent, Belgium. Studio: ${studioEn}, ${ARTIST.countryEn}. Fine art: paintings, works on paper and textile.

Isabella Billiet. Geboren in Tielt, 1966. Woont en werkt in Gent, België. Atelier: ${studioNl}, ${ARTIST.countryNl}. Beeldende kunst: schilderijen, werken op papier en textiel.

## Contact
- Studio: ${studioEn}, ${ARTIST.countryEn}
- Atelier: ${studioNl}, ${ARTIST.countryNl}
- Email: ${ARTIST.email}
- Phone: ${ARTIST.phoneDisplay}
- Instagram: ${ARTIST.instagram}

## Practice
- Paintings, works on paper and textile.
- Schilderijen, werken op papier en textiel.
- Inquiries about works, commissions, studio visits or collaborations: ${page("en", "/contact")}
- Vragen over werken, opdrachten, atelierbezoek of samenwerkingen: ${page("nl", "/contact")}

## Prices
Prices are not published on this website.
Prijzen staan niet op deze website.

## Education
- MA Art History — Ghent University
- Textile Design — KASK, Ghent
- Royale Académie Internationale d’Été de Wallonie

## English
- ${page("en", "")}
- ${page("en", "/about")}
- ${page("en", "/works")}
- ${page("en", "/exhibitions")}
- ${page("en", "/contact")}

## Nederlands
- ${page("nl", "")}
- ${page("nl", "/about")}
- ${page("nl", "/works")}
- ${page("nl", "/exhibitions")}
- ${page("nl", "/contact")}
`;
}
