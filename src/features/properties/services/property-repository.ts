import "server-only";

import { cache } from "react";

import { CITY_SLUGS, type CitySlug } from "@/config/locations";
import { rawProperties } from "@/data/properties";
import { filterAndSort, paginate, type Page } from "@/features/search/filter-properties";
import type { SearchFilters } from "@/features/search/search-params";

import { PROPERTY_TYPES } from "../constants";
import { propertySchema } from "../schema";
import type { Property, PropertyType } from "../types";

/**
 * Data-access boundary for listings. Every function is async so the mock
 * implementation can be swapped for an API or database client without
 * touching the UI. Records are validated against the shared schema once.
 */
const properties: Property[] = propertySchema.array().parse(rawProperties);

export type PropertySearchResult = Page<Property> & {
  /** Every match across all pages, for the map view. */
  all: Property[];
};

export const searchProperties = cache(
  async (filters: SearchFilters): Promise<PropertySearchResult> => {
    const matches = filterAndSort(properties, filters);
    return { ...paginate(matches, filters.page), all: matches };
  },
);

export const getAllProperties = cache(async (): Promise<Property[]> => properties);

export const getPropertyBySlug = cache(async (slug: string): Promise<Property | undefined> =>
  properties.find((property) => property.slug === slug),
);

export async function getPropertiesByIds(ids: string[]): Promise<Property[]> {
  return properties.filter((property) => ids.includes(property.id));
}

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  return properties
    .filter((property) => property.featured)
    .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export async function getLuxuryProperties(limit = 3): Promise<Property[]> {
  return properties
    .filter((property) => property.luxury)
    .toSorted((a, b) => b.price - a.price)
    .slice(0, limit);
}

/** Same city or type, closest in price first. */
export async function getSimilarProperties(property: Property, limit = 3): Promise<Property[]> {
  return properties
    .filter(
      (candidate) =>
        candidate.id !== property.id &&
        candidate.listingType === property.listingType &&
        (candidate.city === property.city || candidate.propertyType === property.propertyType),
    )
    .toSorted((a, b) => Math.abs(a.price - property.price) - Math.abs(b.price - property.price))
    .slice(0, limit);
}

export async function getPropertiesByAgent(agentId: string): Promise<Property[]> {
  return properties.filter((property) => property.agentId === agentId);
}

export async function getCityCounts(): Promise<Record<CitySlug, number>> {
  const counts = Object.fromEntries(CITY_SLUGS.map((slug) => [slug, 0])) as Record<
    CitySlug,
    number
  >;
  for (const property of properties) counts[property.city] += 1;
  return counts;
}

export async function getTypeCounts(): Promise<Record<PropertyType, number> & { luxury: number }> {
  const counts = {
    ...(Object.fromEntries(PROPERTY_TYPES.map((type) => [type, 0])) as Record<
      PropertyType,
      number
    >),
    luxury: 0,
  };
  for (const property of properties) {
    counts[property.propertyType] += 1;
    if (property.luxury) counts.luxury += 1;
  }
  return counts;
}
