import { describe, expect, it } from "vitest";

import { parseSearchParams } from "@/features/search/search-params";

import {
  getCityCounts,
  getFeaturedProperties,
  getPropertyBySlug,
  getSimilarProperties,
  searchProperties,
} from "./property-repository";

describe("property repository", () => {
  it("resolves a listing by slug and returns undefined for unknown slugs", async () => {
    expect((await getPropertyBySlug("jeddah-north-obhur-beachfront-villa"))?.id).toBe("DA-1010");
    expect(await getPropertyBySlug("does-not-exist")).toBeUndefined();
  });

  it("paginates search results while exposing every match for the map", async () => {
    const result = await searchProperties(parseSearchParams({ page: "2" }));
    expect(result.page).toBe(2);
    expect(result.items).toHaveLength(9);
    expect(result.all).toHaveLength(result.total);
  });

  it("derives city counts from the dataset", async () => {
    const counts = await getCityCounts();
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    expect(total).toBeGreaterThanOrEqual(24);
    expect(counts.riyadh).toBeGreaterThan(0);
  });

  it("returns featured listings and similar listings of the same offer type", async () => {
    const featured = await getFeaturedProperties(6);
    expect(featured.every((p) => p.featured)).toBe(true);

    const base = await getPropertyBySlug("riyadh-hittin-signature-villa");
    const similar = await getSimilarProperties(base!);
    expect(similar.length).toBeGreaterThan(0);
    expect(similar.every((p) => p.id !== base!.id && p.listingType === base!.listingType)).toBe(
      true,
    );
  });
});
