export type WorkCategory = "painting" | "works-on-paper" | "textile";

export type Work = {
  slug: string;
  title: string;
  series?: string;
  medium: string;
  dimensions: string;
  year: number;
  category: WorkCategory;
  image: string;
  instagramPost: string;
  featured?: boolean;
};

const IG = "https://www.instagram.com/isabella_billiet";

export const works: Work[] = [
  {
    slug: "whispers-green-watercolor",
    title: "Whispers of the Green",
    series: "Whispers of the Green",
    medium: "Watercolor & pencil on Canson paper",
    dimensions: "15 × 20 cm",
    year: 2026,
    category: "works-on-paper",
    image: "/images/whispers-green-watercolor.webp",
    instagramPost: IG,
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
    image: "/images/whispers-green-gouache-1.webp",
    instagramPost: IG,
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
    image: "/images/whispers-green-gouache-2.webp",
    instagramPost: IG,
  },
  {
    slug: "traces",
    title: "Traces",
    series: "Traces",
    medium: "Gouache, pastel & pencil on paper",
    dimensions: "—",
    year: 2023,
    category: "works-on-paper",
    image: "/images/traces.webp",
    instagramPost: IG,
  },
  {
    slug: "golden-morning-light",
    title: "Golden Morning Light",
    series: "Golden Morning Light",
    medium: "Acrylic and oil on linen canvas",
    dimensions: "50 × 60 cm",
    year: 2021,
    category: "painting",
    image: "/images/golden-morning-light.webp",
    instagramPost: IG,
    featured: true,
  },
  {
    slug: "water-energy",
    title: "Water Energy",
    medium: "Oil on linen canvas",
    dimensions: "24 × 30 cm",
    year: 2020,
    category: "painting",
    image: "/images/water-energy.webp",
    instagramPost: IG,
  },
  {
    slug: "water-in-movement-1",
    title: "Water in Movement I",
    series: "Water in Movement",
    medium: "Watercolor on Arches cotton paper",
    dimensions: "—",
    year: 2019,
    category: "works-on-paper",
    image: "/images/water-in-movement-1.webp",
    instagramPost: IG,
  },
  {
    slug: "water-in-movement-2",
    title: "Water in Movement II",
    series: "Water in Movement",
    medium: "Watercolor",
    dimensions: "—",
    year: 2019,
    category: "works-on-paper",
    image: "/images/water-in-movement-2.webp",
    instagramPost: IG,
  },
  {
    slug: "weavings",
    title: "Weavings",
    series: "Weavings",
    medium: "Acrylic on linen canvas",
    dimensions: "100 × 120 cm",
    year: 2019,
    category: "textile",
    image: "/images/weavings.webp",
    instagramPost: IG,
  },
  {
    slug: "galaxy",
    title: "Galaxy",
    series: "Galaxy",
    medium: "Acrylic on linen canvas",
    dimensions: "80 × 120 cm",
    year: 2018,
    category: "painting",
    image: "/images/galaxy.webp",
    instagramPost: IG,
  },
];

export const exhibitionImages = [
  {
    slug: "exhibition-1",
    image: "/images/exhibition-1.webp",
    caption: "Studio view",
  },
  {
    slug: "exhibition-2",
    image: "/images/exhibition-2.webp",
    caption: "Works on paper",
  },
  {
    slug: "exhibition-3",
    image: "/images/exhibition-3.webp",
    caption: "Botanical studies",
  },
  {
    slug: "exhibition-4",
    image: "/images/exhibition-4.webp",
    caption: "Gallery installation",
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
