import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Guest favorites, persisted to localStorage. The store exposes only IDs and
 * intent-level actions, so a future authenticated adapter can sync the same
 * actions to an API without changing any component.
 */
type FavoritesState = {
  ids: string[];
  hydrated: boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const FAVORITES_STORAGE_KEY = "dar-favorites";

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      ids: [],
      hydrated: false,
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id) ? state.ids.filter((x) => x !== id) : [id, ...state.ids],
        })),
      remove: (id) => set((state) => ({ ids: state.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
    }),
    {
      name: FAVORITES_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ ids: state.ids }),
      // Rehydrate manually after mount so server and first client render match.
      skipHydration: true,
      onRehydrateStorage: () => () => useFavoritesStore.setState({ hydrated: true }),
    },
  ),
);

export function useIsFavorite(id: string): boolean {
  return useFavoritesStore((state) => state.ids.includes(id));
}
