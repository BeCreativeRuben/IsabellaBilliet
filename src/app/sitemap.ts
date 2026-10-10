import type { MetadataRoute } from "next";
import { SITE_URL, STATIC_PATHS } from "@/lib/seo";
import { works } from "@/lib/works";

const locales = ["en", "nl"] as const;

function languages(path: string) {
  return {
    en: `${SITE_URL}/en${path}`,
    nl: `${SITE_URL}/nl${path}`,
    "x-default": `${SITE_URL}/en${path}`,
  };
}

function entriesFor(path: string): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}${path}`,
    alternates: { languages: languages(path) },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_PATHS.flatMap((path) => entriesFor(path)),
    ...works.flatMap((work) => entriesFor(`/works/${work.slug}`)),
  ];
}
