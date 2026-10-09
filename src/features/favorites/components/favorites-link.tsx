"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { formatNumber, interpolate } from "@/i18n/format";
import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";

import { useFavoritesStore } from "../favorites-store";

export function FavoritesLink({ tone = "default" }: { tone?: "default" | "inverse" }) {
  const { locale, t } = useI18n();
  const count = useFavoritesStore((state) => state.ids.length);
  const label = count
    ? interpolate(t.nav.favoritesWithCount, { count: formatNumber(count, locale) })
    : t.nav.favorites;

  return (
    <Link
      href="/favorites"
      aria-label={label}
      title={t.nav.favorites}
      className={cn(
        "relative grid size-10 place-items-center rounded-full transition-colors",
        tone === "default" ? "text-ink hover:bg-ink/5" : "text-white hover:bg-white/10",
      )}
    >
      <Heart aria-hidden className="size-5" />
      {count > 0 && (
        <span
          aria-hidden
          className="absolute -end-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-sand px-1 text-[0.65rem] leading-5 font-bold text-ink tabular-nums"
        >
          {formatNumber(count, locale)}
        </span>
      )}
    </Link>
  );
}
