"use client";

import Link from "next/link";
import { HeartOff, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { EmptyState } from "@/components/shared/empty-state";
import { PropertyGridSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/features/properties/components/property-card";
import type { Property } from "@/features/properties/types";
import { plural } from "@/i18n/format";
import { useI18n } from "@/i18n/i18n-provider";

import { useFavoritesStore } from "../favorites-store";

/**
 * Renders saved listings from the guest store. The server passes the
 * catalogue; once accounts exist, the server can pass only the user's saved
 * properties and this component stays unchanged.
 */
export function FavoritesView({ catalogue }: { catalogue: Property[] }) {
  const { locale, t } = useI18n();
  const ids = useFavoritesStore((state) => state.ids);
  const hydrated = useFavoritesStore((state) => state.hydrated);
  const clear = useFavoritesStore((state) => state.clear);

  if (!hydrated) return <PropertyGridSkeleton count={3} label={t.common.loading} />;

  const saved = ids
    .map((id) => catalogue.find((property) => property.id === id))
    .filter((property): property is Property => Boolean(property));

  if (saved.length === 0) {
    return (
      <EmptyState
        icon={HeartOff}
        title={t.favorites.emptyTitle}
        body={t.favorites.emptyBody}
        action={
          <Button asChild>
            <Link href="/properties">{t.favorites.emptyAction}</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p aria-live="polite" className="font-display text-lg font-bold">
          {plural(locale, saved.length, t.common.properties)}
        </p>
        <Button variant="ghost" size="sm" onClick={clear}>
          <Trash2 aria-hidden />
          {t.favorites.clearAll}
        </Button>
      </div>
      <motion.ul layout className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence initial={false}>
          {saved.map((property) => (
            <motion.li
              key={property.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.25 }}
            >
              <PropertyCard property={property} locale={locale} t={t} className="h-full" />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
