import { getCity, getDistrict, type CitySlug } from "@/config/locations";
import type { Locale } from "@/i18n/config";
import { interpolate } from "@/i18n/format";
import type { Dictionary } from "@/i18n/get-dictionary";

import { RESIDENTIAL_TYPES } from "../constants";
import type { Property, PropertyType } from "../types";

const LIST_SEPARATOR: Record<Locale, string> = { ar: "، ", en: ", " };

export function cityName(slug: CitySlug, locale: Locale): string {
  return getCity(slug).name[locale];
}

export function districtName(city: CitySlug, district: string, locale: Locale): string {
  return getDistrict(city, district)?.name[locale] ?? district;
}

/** "Al Malqa, Riyadh" / "الملقا، الرياض" */
export function locationLabel(place: { city: CitySlug; district: string }, locale: Locale): string {
  return [districtName(place.city, place.district, locale), cityName(place.city, locale)].join(
    LIST_SEPARATOR[locale],
  );
}

export function isResidential(type: PropertyType): boolean {
  return (RESIDENTIAL_TYPES as readonly string[]).includes(type);
}

/** Descriptive alt text: "Kitchen — Contemporary villa in Al Malqa". */
export function imageAlt(property: Property, index: number, locale: Locale, t: Dictionary): string {
  const image = property.images[index];
  if (!image) return property.title[locale];
  return `${t.imageKinds[image.kind]} — ${property.title[locale]}`;
}

export function photoCredit(credit: string, t: Dictionary): string {
  return interpolate(t.common.photoBy, { name: credit });
}
