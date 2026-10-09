"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, use, useMemo, useTransition, type ReactNode } from "react";

import {
  parseSearchParams,
  serializeFilters,
  updateFilters,
  type SearchFilters,
} from "../search-params";

type SearchNavigationValue = {
  /** Filters derived from the URL — the single source of truth. */
  filters: SearchFilters;
  /** True while the server renders new results. */
  pending: boolean;
  /** Merge a patch into the filters and update the URL. */
  update: (patch: Partial<SearchFilters>, options?: { scroll?: boolean }) => void;
  /** Replace the filters entirely. */
  replace: (filters: SearchFilters, options?: { scroll?: boolean }) => void;
  hrefFor: (filters: SearchFilters) => string;
};

const SearchNavigationContext = createContext<SearchNavigationValue | null>(null);

/**
 * URL-driven search state. Updates run inside a transition so current results
 * stay visible (dimmed) while the server renders the next set, instead of
 * flashing a full-page skeleton.
 */
export function SearchNavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const value = useMemo<SearchNavigationValue>(() => {
    const filters = parseSearchParams(new URLSearchParams(searchParams.toString()));
    const hrefFor = (next: SearchFilters) => {
      const query = serializeFilters(next).toString();
      return query ? `${pathname}?${query}` : pathname;
    };
    const replace: SearchNavigationValue["replace"] = (next, options) => {
      startTransition(() => router.replace(hrefFor(next), { scroll: options?.scroll ?? false }));
    };
    return {
      filters,
      pending,
      hrefFor,
      replace,
      update: (patch, options) => replace(updateFilters(filters, patch), options),
    };
  }, [pathname, router, searchParams, pending]);

  return <SearchNavigationContext value={value}>{children}</SearchNavigationContext>;
}

export function useSearchNavigation(): SearchNavigationValue {
  const value = use(SearchNavigationContext);
  if (!value) throw new Error("useSearchNavigation must be used inside <SearchNavigationProvider>");
  return value;
}
