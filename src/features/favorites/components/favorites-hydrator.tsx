"use client";

import { useEffect } from "react";

import { useFavoritesStore } from "../favorites-store";

/**
 * Loads persisted favorites after the first client render, keeping SSR and
 * hydration output identical. Also keeps multiple tabs in sync.
 */
export function FavoritesHydrator() {
  useEffect(() => {
    void useFavoritesStore.persist.rehydrate();

    const onStorage = (event: StorageEvent) => {
      if (event.key === useFavoritesStore.persist.getOptions().name) {
        void useFavoritesStore.persist.rehydrate();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return null;
}
