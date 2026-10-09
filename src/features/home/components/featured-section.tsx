import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { PropertyCard } from "@/features/properties/components/property-card";
import type { Property } from "@/features/properties/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

type FeaturedSectionProps = { properties: Property[]; locale: Locale; t: Dictionary };

export function FeaturedSection({ properties, locale, t }: FeaturedSectionProps) {
  return (
    <section aria-labelledby="featured-title" className="container-site py-20 lg:py-28">
      <SectionHeading
        id="featured-title"
        eyebrow={t.home.featured.eyebrow}
        title={t.home.featured.title}
        subtitle={t.home.featured.subtitle}
        action={{ href: "/properties", label: t.common.viewAll }}
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {properties.map((property, index) => (
          <Reveal key={property.id} delay={(index % 3) * 0.08} className="h-full">
            <PropertyCard property={property} locale={locale} t={t} className="h-full" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
