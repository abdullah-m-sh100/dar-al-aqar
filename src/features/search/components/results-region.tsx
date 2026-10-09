"use client";

import { LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";

import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";

import { useSearchNavigation } from "./search-navigation";

/** Keeps current results visible but dimmed while new ones are rendering. */
export function ResultsRegion({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const { pending } = useSearchNavigation();

  return (
    <div aria-busy={pending} className="relative">
      <div
        className={cn(
          "transition-opacity duration-200",
          pending && "pointer-events-none opacity-45",
        )}
      >
        {children}
      </div>
      {pending && (
        <div className="pointer-events-none absolute inset-x-0 top-10 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white shadow-lift">
            <LoaderCircle aria-hidden className="size-4 animate-spin" />
            {t.properties.updating}
          </span>
        </div>
      )}
    </div>
  );
}
