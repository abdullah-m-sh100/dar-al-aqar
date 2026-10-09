import type { Metadata } from "next";

import { CTASection } from "@/components/shared/cta-section";
import { CITY_SLUGS } from "@/config/locations";
import { siteConfig, siteMedia } from "@/config/site";
import { CitiesSection } from "@/features/home/components/cities-section";
import { FeaturedSection } from "@/features/home/components/featured-section";
import { HeroSection } from "@/features/home/components/hero-section";
import { HowSection } from "@/features/home/components/how-section";
import { PremiumSection } from "@/features/home/components/premium-section";
import { TypesSection } from "@/features/home/components/types-section";
import { WhySection } from "@/features/home/components/why-section";
import { PROPERTY_TYPES } from "@/features/properties/constants";
import {
  getAllProperties,
  getCityCounts,
  getFeaturedProperties,
  getLuxuryProperties,
  getTypeCounts,
} from "@/features/properties/services/property-repository";
import { photoCredit } from "@/features/properties/utils/labels";
import { getI18n } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return {
    ...pageMetadata({ title: t.meta.title, description: t.meta.description, path: "/", locale }),
    title: { absolute: t.meta.title },
  };
}

export default async function HomePage() {
  const { locale, t } = await getI18n();
  const [all, featured, luxury, cityCounts, typeCounts] = await Promise.all([
    getAllProperties(),
    getFeaturedProperties(6),
    getLuxuryProperties(3),
    getCityCounts(),
    getTypeCounts(),
  ]);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", name: t.brand.name, url: siteConfig.url },
      { "@type": "WebSite", name: t.brand.name, url: siteConfig.url, inLanguage: locale },
    ],
  };

  return (
    <>
      <HeroSection
        locale={locale}
        t={t}
        stats={{
          listings: all.length,
          cities: CITY_SLUGS.filter((slug) => cityCounts[slug] > 0).length,
          types: PROPERTY_TYPES.length,
        }}
      />
      <FeaturedSection properties={featured} locale={locale} t={t} />
      <CitiesSection counts={cityCounts} locale={locale} t={t} />
      <TypesSection counts={typeCounts} locale={locale} t={t} />
      <PremiumSection properties={luxury} locale={locale} t={t} />
      <WhySection t={t} />
      <HowSection locale={locale} t={t} />
      <CTASection
        eyebrow={t.home.ownerCta.eyebrow}
        title={t.home.ownerCta.title}
        body={t.home.ownerCta.subtitle}
        primary={{ href: "/dashboard?tab=add", label: t.home.ownerCta.button }}
        secondary={{ href: "/dashboard", label: t.home.ownerCta.secondary }}
        photo={siteMedia.ownerCta}
        credit={photoCredit(siteMedia.ownerCta.credit, t)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
