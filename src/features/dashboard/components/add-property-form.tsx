"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";

import { FormSuccess } from "@/components/shared/form-success";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea, describedBy } from "@/components/ui/form-controls";
import { CITIES, isCitySlug, getCity } from "@/config/locations";
import { LISTING_TYPES, PROPERTY_TYPES } from "@/features/properties/constants";
import { useI18n } from "@/i18n/i18n-provider";
import { listingSchema } from "@/lib/validation/schemas";
import { submitListing } from "@/services/mock-submissions";

/** Integration point: send validated values to a listings API and upload photos. */
export function AddPropertyForm() {
  const { locale, t } = useI18n();
  const a = t.dashboard.add;
  const schema = useMemo(() => listingSchema(t.validation), [t]);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      titleAr: "",
      titleEn: "",
      listingType: "sale",
      propertyType: "apartment",
      city: undefined,
      district: "",
      price: "",
      area: "",
      bedrooms: 0,
      bathrooms: 0,
      description: "",
    },
  });

  const city = useWatch({ control, name: "city" });
  const districts = isCitySlug(city) ? getCity(city).districts : [];

  async function onSubmit(values: z.output<typeof schema>) {
    const result = await submitListing(values);
    if (result.ok) setDone(true);
  }

  if (done) {
    return (
      <FormSuccess
        title={a.successTitle}
        body={a.successBody}
        resetLabel={a.reset}
        onReset={() => {
          reset();
          setDone(false);
        }}
      />
    );
  }

  const err = (name: keyof typeof errors) => errors[name]?.message as string | undefined;
  const aria = (id: string, name: keyof typeof errors) => ({
    "aria-invalid": !!errors[name],
    "aria-describedby": describedBy(id, err(name)),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field id="ap-title-ar" label={a.titleAr} error={err("titleAr")}>
          <Input
            id="ap-title-ar"
            dir="rtl"
            lang="ar"
            {...aria("ap-title-ar", "titleAr")}
            {...register("titleAr")}
          />
        </Field>
        <Field id="ap-title-en" label={a.titleEn} error={err("titleEn")}>
          <Input
            id="ap-title-en"
            dir="ltr"
            lang="en"
            {...aria("ap-title-en", "titleEn")}
            {...register("titleEn")}
          />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field id="ap-listing" label={a.listingType} error={err("listingType")}>
          <Select id="ap-listing" {...register("listingType")}>
            {LISTING_TYPES.map((type) => (
              <option key={type} value={type}>
                {t.listingTypes[type]}
              </option>
            ))}
          </Select>
        </Field>
        <Field id="ap-type" label={a.propertyType} error={err("propertyType")}>
          <Select id="ap-type" {...register("propertyType")}>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {t.propertyTypes[type]}
              </option>
            ))}
          </Select>
        </Field>
        <Field id="ap-city" label={a.city} error={err("city")}>
          <Select
            id="ap-city"
            defaultValue=""
            {...aria("ap-city", "city")}
            {...register("city", { onChange: () => setValue("district", "") })}
          >
            <option value="" disabled>
              {a.choose}
            </option>
            {CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name[locale]}
              </option>
            ))}
          </Select>
        </Field>
        <Field id="ap-district" label={a.district} error={err("district")}>
          <Select
            id="ap-district"
            disabled={!districts.length}
            {...aria("ap-district", "district")}
            {...register("district")}
          >
            <option value="">{districts.length ? a.choose : t.search.selectCityFirst}</option>
            {districts.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name[locale]}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field id="ap-price" label={a.price} hint={a.priceHint} error={err("price")}>
          <Input
            id="ap-price"
            type="number"
            inputMode="numeric"
            min={0}
            {...aria("ap-price", "price")}
            {...register("price")}
          />
        </Field>
        <Field id="ap-area" label={a.area} error={err("area")}>
          <Input
            id="ap-area"
            type="number"
            inputMode="numeric"
            min={0}
            {...aria("ap-area", "area")}
            {...register("area")}
          />
        </Field>
        <Field id="ap-beds" label={a.bedrooms} error={err("bedrooms")}>
          <Input
            id="ap-beds"
            type="number"
            inputMode="numeric"
            min={0}
            max={30}
            {...aria("ap-beds", "bedrooms")}
            {...register("bedrooms")}
          />
        </Field>
        <Field id="ap-baths" label={a.bathrooms} error={err("bathrooms")}>
          <Input
            id="ap-baths"
            type="number"
            inputMode="numeric"
            min={0}
            max={30}
            {...aria("ap-baths", "bathrooms")}
            {...register("bathrooms")}
          />
        </Field>
      </div>
      <Field id="ap-description" label={a.description} error={err("description")}>
        <Textarea
          id="ap-description"
          rows={5}
          {...aria("ap-description", "description")}
          {...register("description")}
        />
      </Field>
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <LoaderCircle aria-hidden className="animate-spin" />
        ) : (
          <Save aria-hidden />
        )}
        {isSubmitting ? a.submitting : a.submit}
      </Button>
    </form>
  );
}
