import Image from "next/image";
import Link from "next/link";
import { MapPin, Sparkles } from "lucide-react";

import { Price } from "@/components/shared/price";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/features/favorites/components/favorite-button";
import type { Locale } from "@/i18n/config";
import { interpolate } from "@/i18n/format";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

import type { Property } from "../types";
import { imageAlt, locationLabel } from "../utils/labels";
import { PropertyFacts } from "./property-facts";

type PropertyCardProps = {
  property: Property;
  locale: Locale;
  t: Dictionary;
  layout?: "grid" | "list";
  /** Eager-load the image (above-the-fold cards). */
  priority?: boolean;
  className?: string;
};

/**
 * Presentational listing card, usable from Server and Client Components.
 * The whole card is clickable through a stretched title link; the favorite
 * button sits above it so both remain independently focusable.
 */
export function PropertyCard({
  property,
  locale,
  t,
  layout = "grid",
  priority = false,
  className,
}: PropertyCardProps) {
  const title = property.title[locale];
  const href = `/properties/${property.slug}`;
  const isList = layout === "list";

  return (
    <article
      className={cn(
        "group relative flex overflow-hidden rounded-card border border-line bg-surface shadow-soft transition-[box-shadow,transform,border-color] duration-300 ease-(--ease-standard) focus-within:border-primary/40 hover:-translate-y-1 hover:shadow-lift",
        isList ? "flex-col sm:flex-row" : "flex-col",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-line",
          isList
            ? "aspect-[4/3] sm:aspect-auto sm:min-h-60 sm:w-[42%] sm:shrink-0"
            : "aspect-[4/3]",
        )}
      >
        <Image
          src={property.images[0].src}
          alt={imageAlt(property, 0, locale, t)}
          fill
          priority={priority}
          sizes={
            isList
              ? "(min-width: 640px) 40vw, 100vw"
              : "(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
          }
          className="object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.06]"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/35 to-transparent"
        />
        <div className="absolute start-3 top-3 flex flex-wrap gap-1.5">
          <Badge variant={property.listingType === "sale" ? "ink" : "mint"} size="sm">
            {t.listingTypes[property.listingType]}
          </Badge>
          {property.featured && (
            <Badge variant="glass" size="sm">
              <Sparkles aria-hidden className="text-sand" />
              {t.common.featured}
            </Badge>
          )}
        </div>
        <FavoriteButton
          propertyId={property.id}
          propertyTitle={title}
          className="absolute end-3 top-3"
        />
      </div>

      <div className={cn("flex flex-1 flex-col p-5", isList && "sm:p-6")}>
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold tracking-wide text-primary">
            {t.propertyTypes[property.propertyType]}
          </span>
          {property.luxury && (
            <span className="text-xs font-semibold text-[#8a6034]">{t.common.luxury}</span>
          )}
        </div>
        <Price
          amount={property.price}
          listingType={property.listingType}
          locale={locale}
          t={t}
          className="font-display text-xl font-bold text-ink"
        />
        <h3 className="mt-2 line-clamp-2 font-sans text-[1.02rem] leading-snug font-semibold text-fg">
          <Link
            href={href}
            aria-label={interpolate(t.property.cardLink, { title })}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {title}
          </Link>
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-fg-muted">
          <MapPin aria-hidden className="size-4 shrink-0 text-sand" />
          <span className="line-clamp-1">{locationLabel(property, locale)}</span>
        </p>
        {isList && (
          <p className="mt-3 line-clamp-2 text-sm text-fg-muted">{property.description[locale]}</p>
        )}
        <PropertyFacts
          property={property}
          locale={locale}
          t={t}
          className="mt-auto border-t border-line pt-4"
        />
      </div>
    </article>
  );
}
