import { z } from "zod";

import { CITY_SLUGS, getCity } from "@/config/locations";
import { LISTING_TYPES, PROPERTY_TYPES } from "@/features/properties/constants";

export const SORT_OPTIONS = ["newest", "price-asc", "price-desc", "area-desc"] as const;
export const VIEW_MODES = ["grid", "list", "map"] as const;
export const PAGE_SIZE = 9;

export type SortOption = (typeof SORT_OPTIONS)[number];
export type ViewMode = (typeof VIEW_MODES)[number];

const optionalCount = z.coerce.number().int().min(0).optional().catch(undefined);
const optionalMin = z.coerce.number().int().min(1).max(10).optional().catch(undefined);
const optionalText = z
  .string()
  .trim()
  .max(80)
  .optional()
  .catch(undefined)
  .transform((value) => value || undefined);

/**
 * Every value is validated independently and falls back silently, so a
 * hand-edited or stale URL never breaks the listing page.
 */
const searchSchema = z.object({
  listing: z.enum(LISTING_TYPES).optional().catch(undefined),
  city: z.enum(CITY_SLUGS).optional().catch(undefined),
  district: optionalText,
  type: z.enum(PROPERTY_TYPES).optional().catch(undefined),
  minPrice: optionalCount,
  maxPrice: optionalCount,
  minArea: optionalCount,
  maxArea: optionalCount,
  beds: optionalMin,
  baths: optionalMin,
  q: optionalText,
  agent: optionalText,
  luxury: z
    .literal("1")
    .optional()
    .catch(undefined)
    .transform((value) => value === "1"),
  sort: z.enum(SORT_OPTIONS).catch("newest"),
  view: z.enum(VIEW_MODES).catch("grid"),
  page: z.coerce.number().int().min(1).catch(1),
});

export type SearchFilters = z.infer<typeof searchSchema>;

export type RawSearchParams = URLSearchParams | Record<string, string | string[] | undefined>;

function toRecord(params: RawSearchParams): Record<string, string | undefined> {
  if (params instanceof URLSearchParams) return Object.fromEntries(params.entries());
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  );
}

export function parseSearchParams(params: RawSearchParams): SearchFilters {
  const filters = searchSchema.parse(toRecord(params));

  // A district is only meaningful inside its city.
  if (filters.district) {
    const valid =
      filters.city && getCity(filters.city).districts.some((d) => d.slug === filters.district);
    if (!valid) filters.district = undefined;
  }
  return filters;
}

export const defaultFilters: SearchFilters = parseSearchParams({});

/** Serializes filters, omitting defaults so URLs stay short and shareable. */
export function serializeFilters(filters: Partial<SearchFilters>): URLSearchParams {
  const params = new URLSearchParams();
  const entries: [keyof SearchFilters, unknown][] = [
    ["listing", filters.listing],
    ["city", filters.city],
    ["district", filters.district],
    ["type", filters.type],
    ["minPrice", filters.minPrice],
    ["maxPrice", filters.maxPrice],
    ["minArea", filters.minArea],
    ["maxArea", filters.maxArea],
    ["beds", filters.beds],
    ["baths", filters.baths],
    ["q", filters.q],
    ["agent", filters.agent],
    ["luxury", filters.luxury ? "1" : undefined],
    ["sort", filters.sort === "newest" ? undefined : filters.sort],
    ["view", filters.view === "grid" ? undefined : filters.view],
    ["page", filters.page && filters.page > 1 ? filters.page : undefined],
  ];
  for (const [key, value] of entries) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  }
  return params;
}

/** Builds a `/properties` href from a partial filter set. */
export function propertiesHref(filters: Partial<SearchFilters> = {}): string {
  const query = serializeFilters(filters).toString();
  return query ? `/properties?${query}` : "/properties";
}

/**
 * Applies a patch to the current filters. Any change other than paging
 * resets to the first page; changing city clears an incompatible district.
 */
export function updateFilters(
  current: SearchFilters,
  patch: Partial<SearchFilters>,
): SearchFilters {
  const next: SearchFilters = { ...current, ...patch };
  if (!("page" in patch)) next.page = 1;
  if ("city" in patch && patch.city !== current.city && !("district" in patch)) {
    next.district = undefined;
  }
  return next;
}

/** Filter keys that narrow results (excludes sort, view and page). */
export const NARROWING_KEYS = [
  "listing",
  "city",
  "district",
  "type",
  "minPrice",
  "maxPrice",
  "minArea",
  "maxArea",
  "beds",
  "baths",
  "q",
  "agent",
  "luxury",
] as const satisfies readonly (keyof SearchFilters)[];

export type NarrowingKey = (typeof NARROWING_KEYS)[number];

export function activeFilterKeys(filters: SearchFilters): NarrowingKey[] {
  return NARROWING_KEYS.filter((key) => {
    const value = filters[key];
    return value !== undefined && value !== false;
  });
}

export function clearFilter(filters: SearchFilters, key: NarrowingKey): SearchFilters {
  const patch: Partial<SearchFilters> = { [key]: key === "luxury" ? false : undefined };
  if (key === "city") patch.district = undefined;
  return updateFilters(filters, patch);
}
