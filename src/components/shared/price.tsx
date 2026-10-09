import type { ListingType } from "@/features/properties/types";
import type { Locale } from "@/i18n/config";
import { formatNumber } from "@/i18n/format";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

type PriceProps = {
  amount: number;
  locale: Locale;
  t: Dictionary;
  /** Rent is quoted per year, the Saudi norm. */
  listingType?: ListingType;
  className?: string;
  periodClassName?: string;
};

/**
 * Locale-aware SAR price. Arabic reads "4,850,000 ر.س"; English reads
 * "SAR 4,850,000". The number is isolated so it never reorders in RTL.
 */
export function Price({ amount, locale, t, listingType, className, periodClassName }: PriceProps) {
  const currency = (
    <span className="text-[0.7em] font-semibold opacity-80">{t.common.currency}</span>
  );

  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-1.5", className)}>
      {locale === "en" && currency}
      <bdi className="tabular-nums">{formatNumber(amount, locale)}</bdi>
      {locale === "ar" && currency}
      {listingType === "rent" && (
        <span className={cn("text-[0.62em] font-medium opacity-70", periodClassName)}>
          / {t.common.perYear}
        </span>
      )}
    </span>
  );
}
