import { z } from "zod";

import { CITY_SLUGS } from "@/config/locations";

import {
  AMENITIES,
  FACADES,
  FURNISHING_STATUSES,
  IMAGE_KINDS,
  LISTING_TYPES,
  PROPERTY_TYPES,
} from "./constants";

const localizedText = z.object({ ar: z.string().min(1), en: z.string().min(1) });

export const propertyImageSchema = z.object({
  src: z.url().startsWith("https://images.unsplash.com/photo-"),
  credit: z.string().min(1),
  kind: z.enum(IMAGE_KINDS),
});

/** Runtime contract for every listing, whether it comes from mock data or a future API. */
export const propertySchema = z.object({
  id: z.string().regex(/^DA-\d{4}$/),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: localizedText,
  description: localizedText,
  highlights: z.array(localizedText),
  listingType: z.enum(LISTING_TYPES),
  propertyType: z.enum(PROPERTY_TYPES),
  city: z.enum(CITY_SLUGS),
  district: z.string().min(1),
  /** SAR. Rent listings are priced per year, as is customary in Saudi Arabia. */
  price: z.number().int().positive(),
  /** Square meters. */
  area: z.number().positive(),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  furnishing: z.enum(FURNISHING_STATUSES).nullable(),
  facade: z.enum(FACADES),
  /** Street width in meters, a standard Saudi listing attribute. */
  streetWidth: z.number().positive(),
  /** Building age in years; 0 means new. Null for land. */
  age: z.number().int().min(0).nullable(),
  amenities: z.array(z.enum(AMENITIES)),
  images: z.array(propertyImageSchema).min(1),
  /** Approximate district-level coordinates, never an exact address. */
  coordinates: z.object({ lat: z.number().min(16).max(33), lng: z.number().min(34).max(56) }),
  createdAt: z.iso.date(),
  featured: z.boolean(),
  luxury: z.boolean(),
  agentId: z.string().min(1),
});
