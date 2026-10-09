import { describe, expect, it } from "vitest";

import { getDirection, isLocale, otherLocale, resolveLocale } from "./config";
import ar from "./dictionaries/ar.json";
import en from "./dictionaries/en.json";
import { formatNumber, interpolate, plural } from "./format";

function keyPaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    keyPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe("locale config", () => {
  it("defaults to Arabic for missing or unknown values", () => {
    expect(resolveLocale(undefined)).toBe("ar");
    expect(resolveLocale("fr")).toBe("ar");
    expect(resolveLocale("en")).toBe("en");
  });

  it("maps locales to direction", () => {
    expect(getDirection("ar")).toBe("rtl");
    expect(getDirection("en")).toBe("ltr");
    expect(otherLocale("ar")).toBe("en");
    expect(isLocale("ar")).toBe(true);
    expect(isLocale("/ar")).toBe(false);
  });
});

describe("dictionaries", () => {
  it("English and Arabic expose exactly the same keys", () => {
    expect(keyPaths(en).sort()).toEqual(keyPaths(ar).sort());
  });

  it("contain no empty strings", () => {
    for (const dict of [ar, en]) {
      const empty = keyPaths(dict).filter((path) => {
        const value = path
          .split(".")
          .reduce<unknown>((node, key) => (node as Record<string, unknown>)[key], dict);
        return typeof value === "string" && value.trim() === "";
      });
      expect(empty).toEqual([]);
    }
  });
});

describe("formatting", () => {
  it("uses Latin digits with grouping in Arabic, the Saudi digital convention", () => {
    expect(formatNumber(4850000, "ar")).toBe("4,850,000");
    expect(formatNumber(4850000, "en")).toBe("4,850,000");
  });

  it("picks the correct Arabic plural form", () => {
    const forms = ar.common.properties;
    expect(plural("ar", 0, forms)).toBe("لا توجد عقارات");
    expect(plural("ar", 1, forms)).toBe("عقار واحد");
    expect(plural("ar", 2, forms)).toBe("عقاران");
    expect(plural("ar", 5, forms)).toBe("5 عقارات");
    expect(plural("ar", 11, forms)).toBe("11 عقاراً");
    expect(plural("ar", 100, forms)).toBe("100 عقار");
  });

  it("picks English plural forms", () => {
    expect(plural("en", 1, en.common.properties)).toBe("1 property");
    expect(plural("en", 24, en.common.properties)).toBe("24 properties");
  });

  it("interpolates placeholders and leaves unknown ones intact", () => {
    expect(interpolate("{a} – {b}", { a: 1 })).toBe("1 – {b}");
  });
});
