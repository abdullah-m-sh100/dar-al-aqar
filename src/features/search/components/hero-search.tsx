"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form-controls";
import { CITIES, getCity, isCitySlug, type CitySlug } from "@/config/locations";
import { PROPERTY_TYPES } from "@/features/properties/constants";
import type { ListingType, PropertyType } from "@/features/properties/types";
import { interpolate } from "@/i18n/format";
import { useI18n } from "@/i18n/i18n-provider";

import { PRICE_PRESETS, ROOM_OPTIONS, decodeRange, encodeRange, rangeLabel } from "../options";
import { propertiesHref } from "../search-params";
import { ListingTypeToggle } from "./listing-type-toggle";

/** Homepage search. Builds a shareable `/properties?…` URL and navigates. */
export function HeroSearch() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [listing, setListing] = useState<ListingType>("sale");
  const [city, setCity] = useState<CitySlug | "">("");
  const [district, setDistrict] = useState("");
  const [type, setType] = useState<PropertyType | "">("");
  const [price, setPrice] = useState("");
  const [beds, setBeds] = useState("");

  const districts = city ? getCity(city).districts : [];

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const range = price ? decodeRange(price) : {};
    router.push(
      propertiesHref({
        listing,
        city: city || undefined,
        district: district || undefined,
        type: type || undefined,
        minPrice: range.min,
        maxPrice: range.max,
        beds: beds ? Number(beds) : undefined,
      }),
    );
  }

  const fieldLabel = "mb-1.5 block text-xs font-semibold text-fg-muted";

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      aria-label={t.search.title}
      className="rounded-panel border border-white/60 bg-surface/95 p-4 shadow-float backdrop-blur-xl sm:p-5"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <ListingTypeToggle
          value={listing}
          onChange={(value) => {
            setListing(value ?? "sale");
            setPrice("");
          }}
        />
        {listing === "rent" && <p className="text-xs text-fg-muted">{t.search.rentNote}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-[repeat(5,minmax(0,1fr))_auto]">
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="hs-city" className={fieldLabel}>
            {t.search.city}
          </label>
          <Select
            id="hs-city"
            value={city}
            onChange={(e) => {
              setCity(isCitySlug(e.target.value) ? e.target.value : "");
              setDistrict("");
            }}
          >
            <option value="">{t.search.anyCity}</option>
            {CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name[locale]}
              </option>
            ))}
          </Select>
        </div>
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="hs-district" className={fieldLabel}>
            {t.search.district}
          </label>
          <Select
            id="hs-district"
            value={district}
            disabled={!city}
            onChange={(e) => setDistrict(e.target.value)}
          >
            <option value="">{city ? t.search.anyDistrict : t.search.selectCityFirst}</option>
            {districts.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name[locale]}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="hs-type" className={fieldLabel}>
            {t.search.type}
          </label>
          <Select
            id="hs-type"
            value={type}
            onChange={(e) => setType(e.target.value as PropertyType | "")}
          >
            <option value="">{t.search.anyType}</option>
            {PROPERTY_TYPES.map((pt) => (
              <option key={pt} value={pt}>
                {t.propertyTypes[pt]}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="hs-price" className={fieldLabel}>
            {t.search.price}
          </label>
          <Select id="hs-price" value={price} onChange={(e) => setPrice(e.target.value)}>
            <option value="">{t.search.anyPrice}</option>
            {PRICE_PRESETS[listing].map((range) => (
              <option key={encodeRange(range)} value={encodeRange(range)}>
                {rangeLabel(range, locale, t)}
              </option>
            ))}
          </Select>
        </div>
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="hs-beds" className={fieldLabel}>
            {t.search.bedrooms}
          </label>
          <Select id="hs-beds" value={beds} onChange={(e) => setBeds(e.target.value)}>
            <option value="">{t.search.anyRooms}</option>
            {ROOM_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {interpolate(t.search.roomsMin, { count: n })}
              </option>
            ))}
          </Select>
        </div>
        <div className="col-span-2 flex items-end md:col-span-1">
          <Button type="submit" size="lg" className="h-12 w-full xl:w-auto xl:px-8">
            <Search aria-hidden />
            {t.search.submit}
          </Button>
        </div>
      </div>
    </form>
  );
}
