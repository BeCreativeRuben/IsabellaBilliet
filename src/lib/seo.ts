import type { Metadata } from "next";
import { getFeaturedWorks, type Work } from "@/lib/works";

export const SITE_URL = "https://isabellabilliet.com";
export const SITE_NAME = "Isabella Billiet";
export const PRODUCTION_HOST = "isabellabilliet.com";

const featured = getFeaturedWorks()[0];

export const DEFAULT_OG_IMAGE =
  featured?.image ?? "/images/whispers-green-watercolor.webp";
export const DEFAULT_OG_IMAGE_ALT = featured?.title ?? SITE_NAME;

export const STATIC_PATHS = ["", "/about", "/works", "/exhibitions", "/contact"] as const;

const INSTAGRAM = "https://www.instagram.com/isabella_billiet";

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
      images: [{ url: image, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
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
        "@type": "Person",
        "@id": `${SITE_URL}/#isabella-billiet`,
        name: SITE_NAME,
        url: SITE_URL,
        email: "isabella.billiet@gmail.com",
        telephone: "+32 474 09 51 77",
        birthDate: "1966",
        birthPlace: {
          "@type": "Place",
          name: "Tielt",
        },
        sameAs: [INSTAGRAM],
        address: {
          "@type": "PostalAddress",
          streetAddress: "Oude Houtlei",
          postalCode: "9000",
          addressLocality: "Ghent",
          addressCountry: "Belgium",
        },
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

export function llmsTxt(): string {
  const page = (locale: "en" | "nl", path: string) => `${SITE_URL}/${locale}${path}`;

  return `# Isabella Billiet

> Paintings, works on paper and textile — observing light and ever-changing shadows. Based in Ghent, Belgium. Creating in dialogue with nature.

> Schilderijen, werken op papier en textiel — licht en steeds veranderende schaduwen observeren. Gevestigd in Gent, België. Creëren in dialoog met de natuur.

Isabella Billiet. Born in Tielt, 1966. Studio: Oude Houtlei, 9000 Ghent. Paintings, works on paper and textile — creating in dialogue with nature.

Isabella Billiet. Geboren in Tielt, 1966. Atelier: Oude Houtlei, 9000 Ghent. Schilderijen, werken op papier en textiel — creëren in dialoog met de natuur.

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

Instagram: ${INSTAGRAM}
Email: isabella.billiet@gmail.com
`;
}
