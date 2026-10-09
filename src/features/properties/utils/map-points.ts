import type { MapPoint } from "@/components/shared/leaflet-map";
import type { Locale } from "@/i18n/config";
import { formatCompactNumber } from "@/i18n/format";
import type { Dictionary } from "@/i18n/get-dictionary";

import type { Property } from "../types";
import { locationLabel } from "./labels";

/** Serializable, localized marker data prepared on the server. */
export function toMapPoint(property: Property, locale: Locale, t: Dictionary): MapPoint {
  return {
    id: property.id,
    lat: property.coordinates.lat,
    lng: property.coordinates.lng,
    label: formatCompactNumber(property.price, locale),
    title: property.title[locale],
    subtitle: `${t.propertyTypes[property.propertyType]} · ${locationLabel(property, locale)}`,
    href: `/properties/${property.slug}`,
  };
}
