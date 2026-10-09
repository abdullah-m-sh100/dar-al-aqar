import { Bath, BedDouble, Ruler } from "lucide-react";

import type { Locale } from "@/i18n/config";
import { formatNumber } from "@/i18n/format";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

import type { Property } from "../types";

type PropertyFactsProps = {
  property: Pick<Property, "bedrooms" | "bathrooms" | "area">;
  locale: Locale;
  t: Dictionary;
  className?: string;
};

/** Compact bed / bath / area row. Zero counts (land, offices) are omitted. */
export function PropertyFacts({ property, locale, t, className }: PropertyFactsProps) {
  const facts = [
    {
      icon: BedDouble,
      value: property.bedrooms,
      label: t.property.bedrooms,
      show: property.bedrooms > 0,
    },
    {
      icon: Bath,
      value: property.bathrooms,
      label: t.property.bathrooms,
      show: property.bathrooms > 0,
    },
  ].filter((fact) => fact.show);

  return (
    <ul
      className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fg-muted", className)}
    >
      {facts.map(({ icon: Icon, value, label }) => (
        <li key={label} className="inline-flex items-center gap-1.5" title={label}>
          <Icon aria-hidden className="size-4 text-primary" />
          <span className="font-semibold text-fg tabular-nums">{formatNumber(value, locale)}</span>
          <span className="sr-only">{label}</span>
        </li>
      ))}
      <li className="inline-flex items-center gap-1.5" title={t.property.area}>
        <Ruler aria-hidden className="size-4 text-primary" />
        <span className="sr-only">{t.property.area}</span>
        <span className="font-semibold text-fg tabular-nums">
          {formatNumber(property.area, locale)}
        </span>
        <span>{t.common.sqm}</span>
      </li>
    </ul>
  );
}
