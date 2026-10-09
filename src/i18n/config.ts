export const locales = ["ar", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

/** Cookie that stores the visitor's language. URLs never carry a locale. */
export const LOCALE_COOKIE = "dar_locale";

/** One year, in seconds. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type Direction = "rtl" | "ltr";

type LocaleSettings = {
  dir: Direction;
  /** BCP 47 tag used for Intl formatting. Latin digits are the Saudi digital norm. */
  intl: string;
  /** Open Graph locale. */
  og: string;
  /** Native language name, used by the switcher. */
  nativeName: string;
};

export const localeSettings: Record<Locale, LocaleSettings> = {
  ar: { dir: "rtl", intl: "ar-SA-u-nu-latn-ca-gregory", og: "ar_SA", nativeName: "العربية" },
  en: { dir: "ltr", intl: "en-SA-u-ca-gregory", og: "en_US", nativeName: "English" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function resolveLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function getDirection(locale: Locale): Direction {
  return localeSettings[locale].dir;
}

export function otherLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}
