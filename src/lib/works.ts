export type WorkCategory = "painting" | "works-on-paper" | "textile";

export type Work = {
  slug: string;
  title: string;
  series?: string;
  medium: string;
  dimensions: string;
  year: number;
  category: WorkCategory;
  /** Temporary: path to Instagram post — replace with local assets before launch */
  instagramPost: string;
  /** Fallback image from current site or Instagram CDN */
  imageUrl: string;
  featured?: boolean;
};

const WP = "https://isabellabilliet.com/wp-content/uploads";
const IG = "https://www.instagram.com/isabella_billiet";

/**
 * Instagram post paths are placeholders until specific post URLs are added.
 * Replace `instagramPost` with real post paths like `/p/ABC123xyz/`.
 */
export const works: Work[] = [
  {
    slug: "whispers-green-watercolor",
    title: "Whispers of the Green",
    series: "Whispers of the Green",
    medium: "Watercolor & pencil on Canson paper",
    dimensions: "15 × 20 cm",
    year: 2026,
    category: "works-on-paper",
    instagramPost: `${IG}/`,
    imageUrl: `${WP}/2022/06/klein_0070a-1024x766.jpg`,
    featured: true,
  },
  {
    slug: "whispers-green-gouache-1",
    title: "Whispers of the Green I",
    series: "Whispers of the Green",
    medium: "Gouache on Arches paper",
    dimensions: "76 × 56 cm",
    year: 2025,
    category: "works-on-paper",
    instagramPost: `${IG}/`,
    imageUrl: `${WP}/2022/06/klein_0070a-1024x766.jpg`,
    featured: true,
  },
  {
    slug: "whispers-green-gouache-2",
    title: "Whispers of the Green II",
    series: "Whispers of the Green",
    medium: "Gouache on Arches paper",
    dimensions: "76 × 56 cm",
    year: 2025,
    category: "works-on-paper",
    instagramPost: `${IG}/`,
    imageUrl: `${WP}/2022/06/klein_0070a-1024x766.jpg`,
  },
  {
    slug: "traces",
    title: "Traces",
    series: "Traces",
    medium: "Gouache, pastel & pencil on paper",
    dimensions: "—",
    year: 2023,
    category: "works-on-paper",
    instagramPost: `${IG}/`,
    imageUrl: `${WP}/2022/06/klein_0070a-1024x766.jpg`,
  },
  {
    slug: "golden-morning-light",
    title: "Golden Morning Light",
    series: "Golden Morning Light",
    medium: "Acrylic and oil on linen canvas",
    dimensions: "50 × 60 cm",
    year: 2021,
    category: "painting",
    instagramPost: `${IG}/`,
    imageUrl: `${WP}/2022/06/klein_0070a-1024x766.jpg`,
    featured: true,
  },
  {
    slug: "water-energy",
    title: "Water Energy",
    medium: "Oil on linen canvas",
    dimensions: "24 × 30 cm",
    year: 2020,
    category: "painting",
    instagramPost: `${IG}/`,
    imageUrl: `${WP}/2022/06/klein_0070a-1024x766.jpg`,
  },
  {
    slug: "water-in-movement-1",
    title: "Water in Movement I",
    series: "Water in Movement",
    medium: "Watercolor on Arches cotton paper",
    dimensions: "—",
    year: 2019,
    category: "works-on-paper",
    instagramPost: `${IG}/`,
    imageUrl: `${WP}/2022/06/klein_0070a-1024x766.jpg`,
  },
  {
    slug: "water-in-movement-2",
    title: "Water in Movement II",
    series: "Water in Movement",
    medium: "Watercolor",
    dimensions: "—",
    year: 2019,
    category: "works-on-paper",
    instagramPost: `${IG}/`,
    imageUrl: `${WP}/2022/06/klein_0070a-1024x766.jpg`,
  },
  {
    slug: "weavings",
    title: "Weavings",
    series: "Weavings",
    medium: "Acrylic on linen canvas",
    dimensions: "100 × 120 cm",
    year: 2019,
    category: "textile",
    instagramPost: `${IG}/`,
    imageUrl: `${WP}/2022/06/klein_0070a-1024x766.jpg`,
  },
  {
    slug: "galaxy",
    title: "Galaxy",
    series: "Galaxy",
    medium: "Acrylic on linen canvas",
    dimensions: "80 × 120 cm",
    year: 2018,
    category: "painting",
    instagramPost: `${IG}/`,
    imageUrl: `${WP}/2022/06/klein_0070a-1024x766.jpg`,
  },
];

export const exhibitions = [
  {
    year: 2025,
    title: "Group exhibition at Delen Private Bank",
    location: "BP tower, Antwerp, Belgium",
    period: "Aug 2025 — Aug 2026",
    current: true,
  },
  {
    year: 2025,
    title: "Open Studios Tarifa Facinas",
    location: "Tarifa, Spain — duo with Gaëtane Hermans",
    period: "Sep 18 — 21, 2025",
  },
  {
    year: 2025,
    title: "Mirrors of Reality",
    location: "Campo Santo, Ghent, Belgium",
    period: "May 28 — Jun 1, 2025",
  },
  {
    year: 2024,
    title: "Offspace",
    location: "Gallery Ben Benaouisse, Ghent, Belgium",
    period: "Mar 2 — 3, 2024",
  },
  {
    year: 2024,
    title: "Vitrines d'Amour",
    location: "Ghent, Belgium",
    period: "Feb 9 — 18, 2024",
  },
  {
    year: 2023,
    title: "Aqua di Sale",
    location: "Ziso Art, Gallery Charlotte van Lorreinen, Tervuren",
    period: "Sep 29 — Oct 8, 2023",
  },
];

export function getWorkBySlug(slug: string): Work | undefined {
  return works.find((work) => work.slug === slug);
}

export function getFeaturedWorks(): Work[] {
  return works.filter((work) => work.featured);
}

export function getRecentWorks(limit = 4): Work[] {
  return [...works].sort((a, b) => b.year - a.year).slice(0, limit);
}
