import type { Metadata, Viewport } from "next";
import { Alexandria, IBM_Plex_Sans_Arabic, Manrope } from "next/font/google";

import { Providers } from "@/components/providers";
import { siteConfig } from "@/config/site";
import { getDirection, localeSettings } from "@/i18n/config";
import { getI18n } from "@/i18n/locale";
import { cn } from "@/lib/utils";

import "./globals.css";

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["arabic", "latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#102d35",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t.meta.title, template: `%s | ${t.brand.name}` },
    description: t.meta.description,
    applicationName: t.brand.name,
    // Both languages share one URL (language is a cookie preference), so pages
    // set a canonical path but deliberately emit no hreflang alternates that
    // would point at non-existent /ar or /en routes. See README → SEO.
    openGraph: {
      type: "website",
      siteName: t.brand.name,
      locale: localeSettings[locale].og,
      title: t.meta.title,
      description: t.meta.description,
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description },
    formatDetection: { telephone: false },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, t } = await getI18n();

  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      className={cn(plexArabic.variable, alexandria.variable, manrope.variable)}
    >
      <body className="min-h-dvh">
        <Providers locale={locale} dictionary={t}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
