import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { FEATURED_CITY_SLUGS, getCity, type CitySlug } from "@/config/locations";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

import { CityCard } from "./city-card";

type CitiesSectionProps = { counts: Record<CitySlug, number>; locale: Locale; t: Dictionary };

/** Bento layout: the capital leads, the other cities follow. */
export function CitiesSection({ counts, locale, t }: CitiesSectionProps) {
  const [lead, ...rest] = FEATURED_CITY_SLUGS.map(getCity);

  return (
    <section aria-labelledby="cities-title" className="bg-surface py-20 lg:py-28">
      <div className="container-site">
        <SectionHeading
          id="cities-title"
          eyebrow={t.home.cities.eyebrow}
          title={t.home.cities.title}
          subtitle={t.home.cities.subtitle}
        />
        <Reveal className="mt-10 grid grid-cols-2 gap-4 lg:auto-rows-[15rem] lg:grid-cols-3">
          <CityCard
            city={lead}
            count={counts[lead.slug]}
            locale={locale}
            t={t}
            size="large"
            className="col-span-2 lg:row-span-2"
          />
          {rest.map((city, index) => (
            <CityCard
              key={city.slug}
              city={city}
              count={counts[city.slug]}
              locale={locale}
              t={t}
              className={index === rest.length - 1 ? "col-span-2 lg:col-span-1" : undefined}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
