import type { ListingType } from "@/features/properties/types";
import type { Locale } from "@/i18n/config";
import { formatCompactNumber, interpolate } from "@/i18n/format";
import type { Dictionary } from "@/i18n/get-dictionary";

export type PriceRange = { min?: number; max?: number };

/** Presets tuned to Saudi market bands; rent is annual. */
export const PRICE_PRESETS: Record<ListingType, PriceRange[]> = {
  sale: [
    { max: 1_000_000 },
    { min: 1_000_000, max: 2_000_000 },
    { min: 2_000_000, max: 4_000_000 },
    { min: 4_000_000, max: 8_000_000 },
    { min: 8_000_000 },
  ],
  rent: [
    { max: 50_000 },
    { min: 50_000, max: 100_000 },
    { min: 100_000, max: 200_000 },
    { min: 200_000 },
  ],
};

export const ROOM_OPTIONS = [1, 2, 3, 4, 5] as const;

export function encodeRange(range: PriceRange): string {
  return `${range.min ?? ""}-${range.max ?? ""}`;
}

export function decodeRange(value: string): PriceRange {
  const [min, max] = value.split("-").map((part) => (part ? Number(part) : undefined));
  return {
    min: Number.isFinite(min) ? min : undefined,
    max: Number.isFinite(max) ? max : undefined,
  };
}

export function rangeLabel(range: PriceRange, locale: Locale, t: Dictionary): string {
  const fmt = (n: number) => formatCompactNumber(n, locale);
  if (range.min !== undefined && range.max !== undefined) {
    return interpolate(t.search.priceBetween, { min: fmt(range.min), max: fmt(range.max) });
  }
  if (range.max !== undefined) return interpolate(t.search.priceUpTo, { value: fmt(range.max) });
  if (range.min !== undefined) return interpolate(t.search.priceFrom, { value: fmt(range.min) });
  return t.search.anyPrice;
}
