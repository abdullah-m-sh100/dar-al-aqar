import { describe, expect, it } from "vitest";

import { rawProperties } from "@/data/properties";
import { propertySchema } from "@/features/properties/schema";

import { filterAndSort, paginate } from "./filter-properties";
import { parseSearchParams } from "./search-params";

const properties = propertySchema.array().parse(rawProperties);
const run = (query: Record<string, string>) => filterAndSort(properties, parseSearchParams(query));

describe("mock data", () => {
  it("has at least 24 valid listings with unique ids and slugs", () => {
    expect(properties.length).toBeGreaterThanOrEqual(24);
    expect(new Set(properties.map((p) => p.id)).size).toBe(properties.length);
    expect(new Set(properties.map((p) => p.slug)).size).toBe(properties.length);
  });

  it("never reuses a photo across listings", () => {
    const srcs = properties.flatMap((p) => p.images.map((image) => image.src));
    expect(new Set(srcs).size).toBe(srcs.length);
  });
});

describe("filterAndSort", () => {
  it("filters by listing type and city", () => {
    const results = run({ listing: "sale", city: "riyadh" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((p) => p.listingType === "sale" && p.city === "riyadh")).toBe(true);
  });

  it("applies price, area and room minimums", () => {
    const results = run({ minPrice: "1000000", maxPrice: "3000000", beds: "4", minArea: "200" });
    expect(results.length).toBeGreaterThan(0);
    for (const p of results) {
      expect(p.price).toBeGreaterThanOrEqual(1_000_000);
      expect(p.price).toBeLessThanOrEqual(3_000_000);
      expect(p.bedrooms).toBeGreaterThanOrEqual(4);
      expect(p.area).toBeGreaterThanOrEqual(200);
    }
  });

  it("matches Arabic keywords regardless of hamza and taa marbuta spelling", () => {
    const withHamza = run({ q: "أبحر" });
    const withoutHamza = run({ q: "ابحر" });
    expect(withHamza.map((p) => p.id)).toEqual(["DA-1010"]);
    expect(withoutHamza.map((p) => p.id)).toEqual(["DA-1010"]);
    expect(run({ q: "جده" }).every((p) => p.city === "jeddah")).toBe(true);
  });

  it("matches English keywords and listing ids", () => {
    expect(run({ q: "obhur" }).map((p) => p.id)).toEqual(["DA-1010"]);
    expect(run({ q: "da-1004" }).map((p) => p.id)).toEqual(["DA-1004"]);
  });

  it("filters luxury listings and listings by agent", () => {
    expect(run({ luxury: "1" }).every((p) => p.luxury)).toBe(true);
    expect(run({ agent: "ag-02" }).every((p) => p.agentId === "ag-02")).toBe(true);
  });

  it("sorts by price and area", () => {
    const asc = run({ sort: "price-asc" }).map((p) => p.price);
    expect(asc).toEqual(asc.toSorted((a, b) => a - b));
    const desc = run({ sort: "price-desc" }).map((p) => p.price);
    expect(desc).toEqual(asc.toReversed());
    const area = run({ sort: "area-desc" }).map((p) => p.area);
    expect(area).toEqual(area.toSorted((a, b) => b - a));
  });

  it("sorts newest first by default", () => {
    const dates = run({}).map((p) => p.createdAt);
    expect(dates).toEqual(dates.toSorted().toReversed());
  });

  it("returns nothing for impossible combinations", () => {
    expect(run({ type: "land", beds: "3" })).toEqual([]);
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 20 }, (_, i) => i);

  it("slices pages and reports totals", () => {
    expect(paginate(items, 1, 9)).toMatchObject({
      items: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      total: 20,
      pageCount: 3,
    });
    expect(paginate(items, 3, 9).items).toEqual([18, 19]);
  });

  it("clamps out-of-range pages", () => {
    expect(paginate(items, 99, 9).page).toBe(3);
    expect(paginate([], 4, 9)).toMatchObject({ page: 1, pageCount: 1, items: [] });
  });
});
