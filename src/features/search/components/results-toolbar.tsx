"use client";

import { LayoutGrid, List, Map as MapIcon, SlidersHorizontal, type LucideIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form-controls";
import { Sheet } from "@/components/ui/sheet";
import { plural } from "@/i18n/format";
import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";

import {
  SORT_OPTIONS,
  VIEW_MODES,
  activeFilterKeys,
  type SortOption,
  type ViewMode,
} from "../search-params";
import { ActiveFilterChips } from "./active-filter-chips";
import { SearchFilters } from "./search-filters";
import { useSearchNavigation } from "./search-navigation";

const VIEW_ICONS: Record<ViewMode, LucideIcon> = { grid: LayoutGrid, list: List, map: MapIcon };

type ResultsToolbarProps = { total: number; agentNames: Record<string, string> };

export function ResultsToolbar({ total, agentNames }: ResultsToolbarProps) {
  const { locale, t } = useI18n();
  const { filters, update, pending } = useSearchNavigation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeCount = activeFilterKeys(filters).length;
  const resultLabel = plural(locale, total, t.properties.results);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="font-display text-lg font-bold text-ink">
          {pending ? t.properties.updating : resultLabel}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-haspopup="dialog"
          >
            <SlidersHorizontal aria-hidden />
            {t.properties.filters.open}
            {activeCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-primary text-[0.65rem] text-white">
                {activeCount}
              </span>
            )}
          </Button>

          <label className="sr-only" htmlFor="sort">
            {t.properties.sortLabel}
          </label>
          <Select
            id="sort"
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value as SortOption })}
            className="h-9 min-w-44 rounded-full text-sm"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {t.properties.sort[option]}
              </option>
            ))}
          </Select>

          <div
            role="group"
            aria-label={t.properties.viewLabel}
            className="flex rounded-full border border-line-strong bg-surface p-0.5"
          >
            {VIEW_MODES.map((mode) => {
              const Icon = VIEW_ICONS[mode];
              const active = filters.view === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={active}
                  title={t.properties.view[mode]}
                  onClick={() => update({ view: mode, page: filters.page })}
                  className={cn(
                    "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors",
                    active ? "bg-ink text-white" : "text-fg-muted hover:text-ink",
                  )}
                >
                  <Icon aria-hidden className="size-4" />
                  <span className="hidden sm:inline">{t.properties.view[mode]}</span>
                  <span className="sr-only sm:hidden">{t.properties.view[mode]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <ActiveFilterChips agentNames={agentNames} />

      <Sheet
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={t.properties.filters.title}
        closeLabel={t.common.close}
        side="bottom"
        footer={
          <Button
            size="lg"
            className="w-full"
            onClick={() => setDrawerOpen(false)}
            disabled={pending}
          >
            {t.properties.filters.showResults} · {resultLabel}
          </Button>
        }
      >
        <SearchFilters idPrefix="m" />
      </Sheet>
    </div>
  );
}
