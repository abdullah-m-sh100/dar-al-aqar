"use client";

import { LISTING_TYPES } from "@/features/properties/constants";
import type { ListingType } from "@/features/properties/types";
import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";

type ListingTypeToggleProps = {
  value: ListingType | undefined;
  onChange: (value: ListingType | undefined) => void;
  /** Include an "All" option (listing page) or not (hero search). */
  allowAll?: boolean;
  className?: string;
};

/** Segmented toggle for Buy / Rent. */
export function ListingTypeToggle({
  value,
  onChange,
  allowAll = false,
  className,
}: ListingTypeToggleProps) {
  const { t } = useI18n();
  const options: { value: ListingType | undefined; label: string }[] = [
    ...(allowAll ? [{ value: undefined, label: t.listingTabs.all }] : []),
    ...LISTING_TYPES.map((type) => ({ value: type, label: t.listingTabs[type] })),
  ];

  return (
    <div
      role="group"
      aria-label={t.search.listingType}
      className={cn("inline-flex rounded-full bg-canvas p-1", className)}
    >
      {options.map((option) => {
        const checked = option.value === value;
        return (
          <button
            key={option.label}
            type="button"
            aria-pressed={checked}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-9 min-w-20 flex-1 cursor-pointer rounded-full px-4 text-sm font-semibold transition-all duration-200",
              checked ? "bg-ink text-white shadow-sm" : "text-fg-muted hover:text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
