import { localeSettings, type Locale } from "./config";

/** Localized text stored side by side in data files. */
export type LocalizedText = Record<Locale, string>;

export function localize(text: LocalizedText, locale: Locale): string {
  return text[locale];
}

/** Replaces `{name}` placeholders in a dictionary string. */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

/** Picks the grammatically correct plural form (Arabic has six) and fills `{count}`. */
export function plural(locale: Locale, count: number, forms: PluralForms): string {
  const rule = new Intl.PluralRules(localeSettings[locale].intl).select(count);
  return interpolate(forms[rule] ?? forms.other, { count: formatNumber(count, locale) });
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(localeSettings[locale].intl).format(value);
}

export function formatCompactNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(localeSettings[locale].intl, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(
  value: string | Date,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
): string {
  return new Intl.DateTimeFormat(localeSettings[locale].intl, {
    timeZone: "Asia/Riyadh",
    ...options,
  }).format(new Date(value));
}
