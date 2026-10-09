import type { Locale } from "./config";
import ar from "./dictionaries/ar.json";
import en from "./dictionaries/en.json";

/** Arabic is the source of truth; English must provide exactly the same keys. */
export type Dictionary = typeof ar;

const dictionaries: Record<Locale, Dictionary> = { ar, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
