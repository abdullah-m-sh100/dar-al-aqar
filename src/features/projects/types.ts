import type { CitySlug } from "@/config/locations";
import type { PropertyType } from "@/features/properties/types";
import type { LocalizedText } from "@/i18n/format";
import type { Photo } from "@/lib/media";

export const PROJECT_STATUSES = ["ready", "under-construction", "off-plan"] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type Project = {
  id: string;
  slug: string;
  name: LocalizedText;
  developer: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  city: CitySlug;
  district: string;
  status: ProjectStatus;
  /** SAR. */
  startingPrice: number;
  propertyTypes: PropertyType[];
  units: number;
  /** Expected or actual completion year. */
  completionYear: number;
  features: LocalizedText[];
  photos: Photo[];
  coordinates: { lat: number; lng: number };
};
