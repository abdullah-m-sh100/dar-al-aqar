import { describe, expect, it } from "vitest";

import {
  activeFilterKeys,
  clearFilter,
  defaultFilters,
  parseSearchParams,
  propertiesHref,
  serializeFilters,
  updateFilters,
} from "./search-params";

describe("parseSearchParams", () => {
  it("returns defaults for an empty query", () => {
    expect(parseSearchParams({})).toMatchObject({
      sort: "newest",
      view: "grid",
      page: 1,
      luxury: false,
    });
  });

  it("parses valid values from URLSearchParams and record inputs", () => {
    const fromUrl = parseSearchParams(
      new URLSearchParams("listing=rent&city=jeddah&beds=3&minPrice=50000"),
    );
    expect(fromUrl).toMatchObject({ listing: "rent", city: "jeddah", beds: 3, minPrice: 50000 });

    const fromRecord = parseSearchParams({ type: ["villa", "land"], luxury: "1", page: "2" });
    expect(fromRecord).toMatchObject({ type: "villa", luxury: true, page: 2 });
  });

  it("silently drops invalid values instead of throwing", () => {
    const filters = parseSearchParams({
      listing: "lease",
      city: "paris",
      beds: "-2",
      sort: "random",
      page: "zero",
    });
    expect(filters.listing).toBeUndefined();
    expect(filters.city).toBeUndefined();
    expect(filters.beds).toBeUndefined();
    expect(filters.sort).toBe("newest");
    expect(filters.page).toBe(1);
  });

  it("keeps a district only when it belongs to the selected city", () => {
    expect(parseSearchParams({ city: "riyadh", district: "al-malqa" }).district).toBe("al-malqa");
    expect(parseSearchParams({ city: "jeddah", district: "al-malqa" }).district).toBeUndefined();
    expect(parseSearchParams({ district: "al-malqa" }).district).toBeUndefined();
  });

  it("never contains locale information", () => {
    expect(propertiesHref({ city: "riyadh" })).toBe("/properties?city=riyadh");
    expect(propertiesHref()).toBe("/properties");
  });
});

describe("serializeFilters", () => {
  it("omits default sort, view and page", () => {
    expect(serializeFilters(defaultFilters).toString()).toBe("");
  });

  it("round-trips through parse", () => {
    const filters = parseSearchParams({
      listing: "sale",
      city: "riyadh",
      district: "hittin",
      sort: "price-asc",
      view: "map",
      page: "3",
      luxury: "1",
    });
    expect(parseSearchParams(serializeFilters(filters))).toEqual(filters);
  });
});

describe("updateFilters / clearFilter", () => {
  const base = parseSearchParams({ city: "riyadh", district: "hittin", page: "3" });

  it("resets to page 1 when a filter changes", () => {
    expect(updateFilters(base, { type: "villa" }).page).toBe(1);
    expect(updateFilters(base, { page: 2 }).page).toBe(2);
  });

  it("clears the district when the city changes", () => {
    expect(updateFilters(base, { city: "jeddah" }).district).toBeUndefined();
  });

  it("clearing the city also clears the district", () => {
    const cleared = clearFilter(base, "city");
    expect(cleared.city).toBeUndefined();
    expect(cleared.district).toBeUndefined();
    expect(activeFilterKeys(cleared)).toEqual([]);
  });
});
