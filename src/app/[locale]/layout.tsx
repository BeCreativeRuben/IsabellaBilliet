import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { routing } from "@/i18n/routing";
import { SITE_NAME, siteJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { CookieConsent } from "@/components/CookieConsent";
import { ClientEffects } from "@/components/ClientEffects";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  adjustFontFallback: true,
  variable: "--font-cormorant",
  preload: true,
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  adjustFontFallback: true,
  variable: "--font-outfit",
  preload: true,
});

const CONSENT_BOOTSTRAP = `
window.dataLayer = window.dataLayer || [];
window.gtag = function gtag(){window.dataLayer.push(arguments);};
(function () {
  var stored = "";
  try { stored = localStorage.getItem("ib-consent") || ""; } catch (e) {}
  if (stored === "accepted" || stored === "rejected") {
    document.documentElement.setAttribute("data-consent", stored);
  }
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: stored === "accepted" ? "granted" : "denied",
    wait_for_update: 500
  });
  window.gtag("set", "ads_data_redaction", true);
  window.gtag("set", "url_passthrough", true);
})();
`;

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const gaMeasurementId =
  GA_MEASUREMENT_ID && /^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID)
    ? GA_MEASUREMENT_ID
    : undefined;

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: {
      default: t("title"),
      template: `%s — ${SITE_NAME}`,
    },
    description: t("description"),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "nl")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "meta" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  return (
    <html lang={locale} className={`${cormorant.variable} ${outfit.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased">
        {gaMeasurementId ? (
          <script id="ga-consent-default" dangerouslySetInnerHTML={{ __html: CONSENT_BOOTSTRAP }} />
        ) : null}
        <JsonLd data={siteJsonLd(t("description"))} />
        <NextIntlClientProvider messages={messages}>
          <SmoothScrollProvider>
            <a href="#content" className="skip-link">
              {nav("skip")}
            </a>
            <ClientEffects />
            <Header />
            <main id="content" className="flex-1">
              {children}
            </main>
            <Footer />
            {gaMeasurementId ? <CookieConsent gaId={gaMeasurementId} /> : null}
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
