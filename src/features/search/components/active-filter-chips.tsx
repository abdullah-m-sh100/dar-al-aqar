"use client";

import { X } from "lucide-react";

import { getDistrict } from "@/config/locations";
import { cityName } from "@/features/properties/utils/labels";
import { formatNumber, interpolate } from "@/i18n/format";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { useI18n } from "@/i18n/i18n-provider";

import {
  activeFilterKeys,
  clearFilter,
  type NarrowingKey,
  type SearchFilters,
} from "../search-params";
import { useSearchNavigation } from "./search-navigation";

export function filterChipLabel(
  key: NarrowingKey,
  filters: SearchFilters,
  locale: Locale,
  t: Dictionary,
  agentNames: Record<string, string>,
): string {
  const f = t.properties.filters;
  const num = (n: number | undefined) => formatNumber(n ?? 0, locale);
  switch (key) {
    case "listing":
      return filters.listing ? t.listingTypes[filters.listing] : "";
    case "city":
      return filters.city ? cityName(filters.city, locale) : "";
    case "district":
      return (
        (filters.city &&
          filters.district &&
          getDistrict(filters.city, filters.district)?.name[locale]) ||
        ""
      );
    case "type":
      return filters.type ? t.propertyTypes[filters.type] : "";
    case "minPrice":
      return interpolate(f.minPrice, { value: `${num(filters.minPrice)} ${t.common.currency}` });
    case "maxPrice":
      return interpolate(f.maxPrice, { value: `${num(filters.maxPrice)} ${t.common.currency}` });
    case "minArea":
      return interpolate(f.minArea, { value: num(filters.minArea) });
    case "maxArea":
      return interpolate(f.maxArea, { value: num(filters.maxArea) });
    case "beds":
      return interpolate(f.beds, { count: num(filters.beds) });
    case "baths":
      return interpolate(f.baths, { count: num(filters.baths) });
    case "q":
      return interpolate(f.keyword, { value: filters.q ?? "" });
    case "agent":
      return interpolate(f.agent, { name: agentNames[filters.agent ?? ""] ?? filters.agent ?? "" });
    case "luxury":
      return f.luxuryOnly;
  }
}

export function ActiveFilterChips({ agentNames }: { agentNames: Record<string, string> }) {
  const { locale, t } = useI18n();
  const { filters, replace } = useSearchNavigation();
  const keys = activeFilterKeys(filters);
  if (keys.length === 0) return null;

  return (
    <ul aria-label={t.properties.filters.active} className="flex flex-wrap gap-2">
      {keys.map((key) => {
        const label = filterChipLabel(key, filters, locale, t, agentNames);
        return (
          <li key={key}>
            <button
              type="button"
              onClick={() => replace(clearFilter(filters, key))}
              aria-label={interpolate(t.properties.filters.remove, { label })}
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-primary/20 bg-mint-soft ps-3 pe-2 text-xs font-semibold text-ink transition-colors hover:border-primary/50"
            >
              <bdi>{label}</bdi>
              <X aria-hidden className="size-3.5" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
