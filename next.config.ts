import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Legacy URLs from the previous un-prefixed site and the old WordPress install.
// English is the default locale, so they all land on /en/... in a single 308 hop.
// The Vercel project also has bulk redirects for the most common ones; these
// patterns cover everything else Google still has in its index.
const legacyRedirects = [
  // Un-prefixed pages from the previous version of this site.
  { source: "/about", destination: "/en/about" },
  { source: "/contact", destination: "/en/contact" },
  { source: "/exhibitions", destination: "/en/exhibitions" },
  { source: "/works", destination: "/en/works" },
  { source: "/works/:slug", destination: "/en/works/:slug" },

  // Old WordPress paths.
  { source: "/isabella-billiet", destination: "/en" },
  { source: "/isabella-billiet/about", destination: "/en/about" },
  { source: "/isabella-billiet/contact", destination: "/en/contact" },
  { source: "/isabella-billiet/exhibition-views", destination: "/en/exhibitions" },
  { source: "/isabella-billiet/works", destination: "/en/works" },
  { source: "/isabella-billiet/:path*", destination: "/en" },
  { source: "/feed", destination: "/en" },
  { source: "/feed/:path*", destination: "/en" },
  { source: "/comments/feed", destination: "/en" },
  { source: "/author/:path*", destination: "/en/about" },
  { source: "/category/:path*", destination: "/en/works" },
  { source: "/tag/:path*", destination: "/en/works" },

  // Old collection pages.
  { source: "/galaxy", destination: "/en/works/galaxy" },
  { source: "/collection", destination: "/en/works" },
  { source: "/drops", destination: "/en/works" },
  { source: "/l-eau", destination: "/en/works" },
  { source: "/le-nuage", destination: "/en/works" },
];

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  experimental: {
    // Root layout is a locale passthrough, so unmatched URLs need their own document.
    globalNotFound: true,
  },
  images: {
    // CVE-2026-96889 is reached by optimizing SVG. Keep the default denial explicit.
    dangerouslyAllowSVG: false,
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return legacyRedirects.map((r) => ({ ...r, permanent: true }));
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/", headers: securityHeaders },
    ];
  },
};

export default withNextIntl(nextConfig);
