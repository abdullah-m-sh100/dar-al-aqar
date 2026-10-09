import { getCity } from "@/config/locations";
import type { Property } from "@/features/properties/types";

import { PAGE_SIZE, type SearchFilters, type SortOption } from "./search-params";

function normalize(text: string): string {
  return text
    .toLocaleLowerCase()
    .normalize("NFKD") // splits hamza/madda carriers: أ → ا + ٔ
    .replace(/[ً-ٰٟـ]/g, "") // Arabic marks and tatweel
    .replace(/[̀-ͯ]/g, "") // Latin accents
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي");
}

function searchableText(property: Property): string {
  const city = getCity(property.city);
  const district = city.districts.find((d) => d.slug === property.district);
  return normalize(
    [
      property.id,
      property.title.ar,
      property.title.en,
      city.name.ar,
      city.name.en,
      district?.name.ar ?? "",
      district?.name.en ?? "",
    ].join(" "),
  );
}

function inRange(value: number, min?: number, max?: number): boolean {
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  return true;
}

export function matchesFilters(property: Property, filters: SearchFilters): boolean {
  if (filters.listing && property.listingType !== filters.listing) return false;
  if (filters.city && property.city !== filters.city) return false;
  if (filters.district && property.district !== filters.district) return false;
  if (filters.type && property.propertyType !== filters.type) return false;
  if (filters.luxury && !property.luxury) return false;
  if (filters.agent && property.agentId !== filters.agent) return false;
  if (!inRange(property.price, filters.minPrice, filters.maxPrice)) return false;
  if (!inRange(property.area, filters.minArea, filters.maxArea)) return false;
  if (filters.beds !== undefined && property.bedrooms < filters.beds) return false;
  if (filters.baths !== undefined && property.bathrooms < filters.baths) return false;
  if (filters.q) {
    const terms = normalize(filters.q).split(/\s+/).filter(Boolean);
    const haystack = searchableText(property);
    if (!terms.every((term) => haystack.includes(term))) return false;
  }
  return true;
}

const comparators: Record<SortOption, (a: Property, b: Property) => number> = {
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "area-desc": (a, b) => b.area - a.area,
};

export function sortProperties(properties: Property[], sort: SortOption): Property[] {
  return properties.toSorted(comparators[sort]);
}

export type Page<T> = {
  items: T[];
  total: number;
  page: number;
  pageCount: number;
};

export function paginate<T>(items: T[], page: number, pageSize = PAGE_SIZE): Page<T> {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  const start = (current - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page: current,
    pageCount,
  };
}

export function filterAndSort(properties: Property[], filters: SearchFilters): Property[] {
  return sortProperties(
    properties.filter((property) => matchesFilters(property, filters)),
    filters.sort,
  );
}
