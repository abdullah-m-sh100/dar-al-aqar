import {
  Armchair,
  Bath,
  BedDouble,
  CalendarDays,
  Compass,
  Hash,
  Home,
  Hourglass,
  MoveHorizontal,
  Ruler,
  Tag,
  type LucideIcon,
} from "lucide-react";

import type { Locale } from "@/i18n/config";
import { formatDate, formatNumber, interpolate, plural } from "@/i18n/format";
import type { Dictionary } from "@/i18n/get-dictionary";

import type { Property } from "../types";

type Spec = { icon: LucideIcon; label: string; value: string };

export function PropertySpecs({
  property,
  locale,
  t,
}: {
  property: Property;
  locale: Locale;
  t: Dictionary;
}) {
  const p = t.property;
  const n = (value: number) => formatNumber(value, locale);

  const specs: (Spec | false)[] = [
    { icon: Hash, label: p.id, value: property.id },
    { icon: Tag, label: p.listing, value: t.listingTypes[property.listingType] },
    { icon: Home, label: p.type, value: t.propertyTypes[property.propertyType] },
    { icon: Ruler, label: p.area, value: `${n(property.area)} ${t.common.sqm}` },
    property.bedrooms > 0 && { icon: BedDouble, label: p.bedrooms, value: n(property.bedrooms) },
    property.bathrooms > 0 && { icon: Bath, label: p.bathrooms, value: n(property.bathrooms) },
    property.furnishing !== null && {
      icon: Armchair,
      label: p.furnishing,
      value: t.furnishing[property.furnishing],
    },
    { icon: Compass, label: p.facade, value: t.facades[property.facade] },
    {
      icon: MoveHorizontal,
      label: p.streetWidth,
      value: interpolate(p.meters, { value: n(property.streetWidth) }),
    },
    property.age !== null && {
      icon: Hourglass,
      label: p.age,
      value: property.age === 0 ? p.ageNew : plural(locale, property.age, p.ageYears),
    },
    { icon: CalendarDays, label: p.posted, value: formatDate(property.createdAt, locale) },
  ];

  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
      {specs
        .filter((spec): spec is Spec => Boolean(spec))
        .map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3 bg-surface p-4">
            <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <dt className="text-xs text-fg-muted">{label}</dt>
              <dd className="mt-0.5 font-semibold text-ink">
                <bdi>{value}</bdi>
              </dd>
            </div>
          </div>
        ))}
    </dl>
  );
}
