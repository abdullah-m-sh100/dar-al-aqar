"use client";

import { Search, X } from "lucide-react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/form-controls";
import { CITIES, getCity, isCitySlug } from "@/config/locations";
import { PROPERTY_TYPES } from "@/features/properties/constants";
import type { PropertyType } from "@/features/properties/types";
import { interpolate } from "@/i18n/format";
import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";

import { ROOM_OPTIONS } from "../options";
import { activeFilterKeys, defaultFilters, serializeFilters } from "../search-params";
import { ListingTypeToggle } from "./listing-type-toggle";
import { useSearchNavigation } from "./search-navigation";

function toNumber(value: FormDataEntryValue | null): number | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const n = Number(value.replace(/[,\s٬]/g, ""));
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : undefined;
}

/**
 * Filter panel used in the desktop sidebar and the mobile drawer. Selects
 * apply immediately; free-text and number fields apply on Enter or blur.
 * The form is keyed on the URL so inputs always reflect the current search.
 */
export function SearchFilters({
  className,
  idPrefix = "f",
}: {
  className?: string;
  idPrefix?: string;
}) {
  const { locale, t } = useI18n();
  const { filters, update, replace } = useSearchNavigation();
  const districts = filters.city ? getCity(filters.city).districts : [];
  const hasActive = activeFilterKeys(filters).length > 0;
  const id = (name: string) => `${idPrefix}-${name}`;

  function applyTextFields(form: HTMLFormElement) {
    const data = new FormData(form);
    const patch = {
      q: (data.get("q") as string | null)?.trim() || undefined,
      minPrice: toNumber(data.get("minPrice")),
      maxPrice: toNumber(data.get("maxPrice")),
      minArea: toNumber(data.get("minArea")),
      maxArea: toNumber(data.get("maxArea")),
    };
    const changed = (Object.keys(patch) as (keyof typeof patch)[]).some(
      (key) => patch[key] !== filters[key],
    );
    if (changed) update(patch);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applyTextFields(event.currentTarget);
  }

  return (
    <form
      key={serializeFilters(filters).toString()}
      onSubmit={onSubmit}
      onBlur={(event) => {
        if (event.target instanceof HTMLInputElement) applyTextFields(event.currentTarget);
      }}
      aria-label={t.properties.filters.title}
      className={cn("space-y-5", className)}
    >
      <div>
        <Label htmlFor={id("q")}>{t.search.keyword}</Label>
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-fg-muted"
          />
          <Input
            id={id("q")}
            name="q"
            type="search"
            defaultValue={filters.q ?? ""}
            placeholder={t.search.keywordPlaceholder}
            className="ps-10"
            enterKeyHint="search"
          />
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-sm font-semibold text-ink">{t.search.listingType}</p>
        <ListingTypeToggle
          allowAll
          value={filters.listing}
          onChange={(listing) => update({ listing, minPrice: undefined, maxPrice: undefined })}
          className="flex w-full"
        />
      </div>

      <div>
        <Label htmlFor={id("city")}>{t.search.city}</Label>
        <Select
          id={id("city")}
          value={filters.city ?? ""}
          onChange={(e) =>
            update({ city: isCitySlug(e.target.value) ? e.target.value : undefined })
          }
        >
          <option value="">{t.search.anyCity}</option>
          {CITIES.map((city) => (
            <option key={city.slug} value={city.slug}>
              {city.name[locale]}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor={id("district")}>{t.search.district}</Label>
        <Select
          id={id("district")}
          value={filters.district ?? ""}
          disabled={!filters.city}
          onChange={(e) => update({ district: e.target.value || undefined })}
        >
          <option value="">{filters.city ? t.search.anyDistrict : t.search.selectCityFirst}</option>
          {districts.map((district) => (
            <option key={district.slug} value={district.slug}>
              {district.name[locale]}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor={id("type")}>{t.search.type}</Label>
        <Select
          id={id("type")}
          value={filters.type ?? ""}
          onChange={(e) =>
            update({ type: (e.target.value || undefined) as PropertyType | undefined })
          }
        >
          <option value="">{t.search.anyType}</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {t.propertyTypes[type]}
            </option>
          ))}
        </Select>
      </div>

      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold text-ink">
          {t.search.price} <span className="font-normal text-fg-muted">({t.common.currency})</span>
        </legend>
        <div className="grid grid-cols-2 gap-2">
          <Input
            name="minPrice"
            type="number"
            inputMode="numeric"
            min={0}
            defaultValue={filters.minPrice ?? ""}
            placeholder={t.search.minPrice}
            aria-label={t.search.minPrice}
          />
          <Input
            name="maxPrice"
            type="number"
            inputMode="numeric"
            min={0}
            defaultValue={filters.maxPrice ?? ""}
            placeholder={t.search.maxPrice}
            aria-label={t.search.maxPrice}
          />
        </div>
        {filters.listing === "rent" && (
          <p className="mt-1.5 text-xs text-fg-muted">{t.search.rentNote}</p>
        )}
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor={id("beds")}>{t.search.bedrooms}</Label>
          <Select
            id={id("beds")}
            value={filters.beds ?? ""}
            onChange={(e) => update({ beds: e.target.value ? Number(e.target.value) : undefined })}
          >
            <option value="">{t.search.anyRooms}</option>
            {ROOM_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {interpolate(t.search.roomsMin, { count: n })}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor={id("baths")}>{t.search.bathrooms}</Label>
          <Select
            id={id("baths")}
            value={filters.baths ?? ""}
            onChange={(e) => update({ baths: e.target.value ? Number(e.target.value) : undefined })}
          >
            <option value="">{t.search.anyRooms}</option>
            {ROOM_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {interpolate(t.search.roomsMin, { count: n })}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold text-ink">{t.search.area}</legend>
        <div className="grid grid-cols-2 gap-2">
          <Input
            name="minArea"
            type="number"
            inputMode="numeric"
            min={0}
            defaultValue={filters.minArea ?? ""}
            placeholder={t.search.minArea}
            aria-label={t.search.minArea}
          />
          <Input
            name="maxArea"
            type="number"
            inputMode="numeric"
            min={0}
            defaultValue={filters.maxArea ?? ""}
            placeholder={t.search.maxArea}
            aria-label={t.search.maxArea}
          />
        </div>
      </fieldset>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-canvas px-4 py-3 text-sm font-medium">
        <input
          type="checkbox"
          checked={filters.luxury}
          onChange={(e) => update({ luxury: e.target.checked })}
          className="size-4 accent-primary"
        />
        {t.properties.filters.luxuryOnly}
      </label>

      {/* Lets Enter in any text field submit the form. */}
      <button type="submit" className="sr-only">
        {t.search.submit}
      </button>

      {hasActive && (
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => replace({ ...defaultFilters, sort: filters.sort, view: filters.view })}
        >
          <X aria-hidden />
          {t.properties.filters.clearAll}
        </Button>
      )}
    </form>
  );
}
