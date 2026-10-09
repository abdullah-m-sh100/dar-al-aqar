import type { z } from "zod";

import type {
  AMENITIES,
  FACADES,
  FURNISHING_STATUSES,
  IMAGE_KINDS,
  LISTING_TYPES,
  PROPERTY_TYPES,
} from "./constants";
import type { propertyImageSchema, propertySchema } from "./schema";

export type ListingType = (typeof LISTING_TYPES)[number];
export type PropertyType = (typeof PROPERTY_TYPES)[number];
export type FurnishingStatus = (typeof FURNISHING_STATUSES)[number];
export type Facade = (typeof FACADES)[number];
export type Amenity = (typeof AMENITIES)[number];
export type ImageKind = (typeof IMAGE_KINDS)[number];

export type PropertyImage = z.infer<typeof propertyImageSchema>;
export type Property = z.infer<typeof propertySchema>;
