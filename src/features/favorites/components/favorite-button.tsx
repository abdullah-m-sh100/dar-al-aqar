"use client";

import { Heart } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";

import { useFavoritesStore, useIsFavorite } from "../favorites-store";

type FavoriteButtonProps = {
  propertyId: string;
  /** Property title, so screen readers know which listing is affected. */
  propertyTitle: string;
  variant?: "overlay" | "outline";
  className?: string;
};

export function FavoriteButton({
  propertyId,
  propertyTitle,
  variant = "overlay",
  className,
}: FavoriteButtonProps) {
  const { t } = useI18n();
  const active = useIsFavorite(propertyId);
  const toggle = useFavoritesStore((state) => state.toggle);
  const reduceMotion = useReducedMotion();
  const label = active ? t.property.favorite.remove : t.property.favorite.add;

  return (
    <motion.button
      type="button"
      onClick={() => toggle(propertyId)}
      aria-pressed={active}
      aria-label={`${label}: ${propertyTitle}`}
      title={label}
      whileTap={reduceMotion ? undefined : { scale: 0.86 }}
      className={cn(
        "relative z-10 grid size-10 cursor-pointer place-items-center rounded-full transition-colors duration-200",
        variant === "overlay" && "bg-white/90 text-ink shadow-sm backdrop-blur hover:bg-white",
        variant === "outline" &&
          "border border-line-strong bg-surface text-ink hover:border-primary",
        className,
      )}
    >
      <motion.span
        key={active ? "on" : "off"}
        initial={reduceMotion ? false : { scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 18 }}
        className="grid place-items-center"
      >
        <Heart
          aria-hidden
          className={cn(
            "size-[1.15rem] transition-colors",
            active ? "fill-danger text-danger" : "text-ink",
          )}
        />
      </motion.span>
    </motion.button>
  );
}
