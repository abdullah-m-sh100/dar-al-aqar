import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";

import { LOCALE_COOKIE, resolveLocale, type Locale } from "./config";
import { getDictionary } from "./get-dictionary";

/** Reads the active locale from the request cookie (deduplicated per request). */
export const getLocale = cache(async (): Promise<Locale> => {
  const store = await cookies();
  return resolveLocale(store.get(LOCALE_COOKIE)?.value);
});

/** Locale + dictionary for Server Components. */
export const getI18n = cache(async () => {
  const locale = await getLocale();
  return { locale, t: getDictionary(locale) };
});
