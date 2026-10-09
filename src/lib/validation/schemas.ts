import { z } from "zod";

import { CITY_SLUGS } from "@/config/locations";
import { LISTING_TYPES, PROPERTY_TYPES } from "@/features/properties/constants";
import { interpolate } from "@/i18n/format";
import type { Dictionary } from "@/i18n/get-dictionary";

type Messages = Dictionary["validation"];

/** Saudi mobile: 05XXXXXXXX, +9665XXXXXXXX or 009665XXXXXXXX (spaces/dashes ignored). */
export const SAUDI_MOBILE = /^(?:\+966|00966|0)5\d{8}$/;

export function normalizePhone(value: string): string {
  return value.replace(/[\s-]/g, "").replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

const text = (m: Messages, min = 1, max = 120) =>
  z
    .string()
    .trim()
    .min(1, m.required)
    .min(min, interpolate(m.minLength, { min }))
    .max(max, interpolate(m.maxLength, { max }));

const email = (m: Messages) => z.string().trim().min(1, m.required).pipe(z.email(m.email));

const phone = (m: Messages) =>
  z
    .string()
    .min(1, m.required)
    .transform(normalizePhone)
    .refine((value) => SAUDI_MOBILE.test(value), m.phone);

const password = (m: Messages) =>
  z
    .string()
    .min(1, m.required)
    .regex(/^(?=.*[A-Za-z؀-ۿ])(?=.*\d).{8,}$/, m.password);

/** Today in Riyadh as YYYY-MM-DD, for date-input minimums and validation. */
export function todayInRiyadh(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Riyadh" }).format(new Date());
}

export const VIEWING_TIMES = ["morning", "afternoon", "evening"] as const;
export const CONTACT_SUBJECTS = ["general", "listing", "partnership", "support"] as const;
export const ACCOUNT_TYPES = ["seeker", "owner", "agent"] as const;

export function viewingSchema(m: Messages) {
  return z.object({
    name: text(m, 3, 80),
    phone: phone(m),
    date: z
      .string()
      .min(1, m.required)
      .refine((value) => value >= todayInRiyadh(), m.futureDate),
    time: z.enum(VIEWING_TIMES, { error: m.required }),
    message: z
      .string()
      .trim()
      .max(500, interpolate(m.maxLength, { max: 500 }))
      .optional(),
  });
}

export function contactSchema(m: Messages) {
  return z.object({
    name: text(m, 2, 80),
    email: email(m),
    subject: z.enum(CONTACT_SUBJECTS, { error: m.required }),
    message: text(m, 20, 2000),
  });
}

export function loginSchema(m: Messages) {
  return z.object({
    email: email(m),
    password: z.string().min(1, m.required),
  });
}

export function registerSchema(m: Messages) {
  return z
    .object({
      name: text(m, 3, 80),
      email: email(m),
      phone: phone(m),
      accountType: z.enum(ACCOUNT_TYPES, { error: m.required }),
      password: password(m),
      confirmPassword: z.string().min(1, m.required),
      terms: z.boolean().refine(Boolean, m.terms),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: m.passwordMatch,
      path: ["confirmPassword"],
    });
}

const count = (m: Messages) =>
  z.coerce
    .number({ error: m.integer })
    .int(m.integer)
    .min(0, m.positive)
    .max(30, interpolate(m.maxLength, { max: 30 }));

export function listingSchema(m: Messages) {
  return z.object({
    titleAr: text(m, 10, 120).refine((value) => /[؀-ۿ]/.test(value), m.arabicText),
    titleEn: text(m, 10, 120),
    listingType: z.enum(LISTING_TYPES, { error: m.required }),
    propertyType: z.enum(PROPERTY_TYPES, { error: m.required }),
    city: z.enum(CITY_SLUGS, { error: m.required }),
    district: z.string().min(1, m.required),
    price: z.coerce.number({ error: m.positive }).positive(m.positive),
    area: z.coerce.number({ error: m.positive }).positive(m.positive),
    bedrooms: count(m),
    bathrooms: count(m),
    description: text(m, 30, 2000),
  });
}

export function settingsSchema(m: Messages) {
  return z.object({
    name: text(m, 3, 80),
    email: email(m),
    phone: phone(m),
    notifications: z.boolean(),
  });
}
