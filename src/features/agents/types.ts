import type { CitySlug } from "@/config/locations";
import type { Locale } from "@/i18n/config";
import type { LocalizedText } from "@/i18n/format";

export type Agent = {
  id: string;
  name: LocalizedText;
  role: LocalizedText;
  specialties: LocalizedText[];
  cities: CitySlug[];
  languages: Locale[];
  bio: LocalizedText;
};
