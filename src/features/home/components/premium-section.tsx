import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { Price } from "@/components/shared/price";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import type { Property } from "@/features/properties/types";
import { imageAlt, locationLabel } from "@/features/properties/utils/labels";
import { propertiesHref } from "@/features/search/search-params";
import type { Locale } from "@/i18n/config";
import { interpolate } from "@/i18n/format";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

type PremiumSectionProps = { properties: Property[]; locale: Locale; t: Dictionary };

function PremiumTile({
  property,
  locale,
  t,
  large = false,
}: {
  property: Property;
  locale: Locale;
  t: Dictionary;
  large?: boolean;
}) {
  const title = property.title[locale];
  return (
    <Link
      href={`/properties/${property.slug}`}
      aria-label={interpolate(t.property.cardLink, { title })}
      className={cn(
        "group relative isolate flex h-full flex-col justify-end overflow-hidden rounded-panel p-6 text-white",
        large ? "min-h-[26rem] lg:min-h-[38rem] lg:p-9" : "min-h-72",
      )}
    >
      <Image
        src={property.images[0].src}
        alt={imageAlt(property, 0, locale, t)}
        fill
        sizes={large ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 34vw, 100vw"}
        className="-z-20 object-cover transition-transform duration-1000 ease-(--ease-out-expo) group-hover:scale-105"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent"
      />
      <p className="flex items-center gap-1.5 text-sm text-white/75">
        <MapPin aria-hidden className="size-4 text-sand" />
        {locationLabel(property, locale)}
      </p>
      <h3
        className={cn(
          "mt-2 font-display font-bold text-white",
          large ? "text-2xl lg:text-3xl" : "text-base leading-snug",
        )}
      >
        {title}
      </h3>
      <Price
        amount={property.price}
        listingType={property.listingType}
        locale={locale}
        t={t}
        className={cn("mt-3 font-display font-semibold text-sand", large ? "text-2xl" : "text-lg")}
      />
    </Link>
  );
}

/** Editorial, asymmetric showcase of the luxury collection on a deep-teal canvas. */
export function PremiumSection({ properties, locale, t }: PremiumSectionProps) {
  const [lead, ...others] = properties;
  if (!lead) return null;

  return (
    <section
      aria-labelledby="premium-title"
      className="relative overflow-hidden bg-ink py-20 text-white lg:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -start-32 top-1/3 size-96 rounded-full bg-primary/50 blur-3xl"
      />
      <div className="relative container-site">
        <div className="grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <PremiumTile property={lead} locale={locale} t={t} large />
          </Reveal>
          <div className="flex flex-col gap-6 lg:col-span-5">
            <Reveal delay={0.1} className="py-2 lg:py-6">
              <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-sand">
                <span aria-hidden className="h-px w-8 bg-sand" />
                {t.home.premium.eyebrow}
              </p>
              <h2 id="premium-title" className="text-title font-bold text-white">
                {t.home.premium.title}
              </h2>
              <p className="mt-4 max-w-md text-lg text-white/70">{t.home.premium.subtitle}</p>
              <Button asChild variant="outline-light" size="lg" className="mt-8">
                <Link href={propertiesHref({ luxury: true })}>
                  {t.home.premium.cta}
                  <ArrowRight aria-hidden className="flip-rtl" />
                </Link>
              </Button>
            </Reveal>
            <div className="grid flex-1 gap-6 sm:grid-cols-2">
              {others.map((property, index) => (
                <Reveal key={property.id} delay={0.15 + index * 0.08}>
                  <PremiumTile property={property} locale={locale} t={t} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
