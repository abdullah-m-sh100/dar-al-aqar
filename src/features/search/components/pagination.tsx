"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MouseEvent } from "react";

import { formatNumber, interpolate } from "@/i18n/format";
import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";

import { useSearchNavigation } from "./search-navigation";

/**
 * Real links (crawlable, open-in-new-tab friendly) that navigate inside the
 * search transition on a plain click.
 */
export function Pagination({ page, pageCount }: { page: number; pageCount: number }) {
  const { locale, t } = useI18n();
  const { filters, hrefFor, replace } = useSearchNavigation();
  if (pageCount <= 1) return null;

  const go = (target: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    replace({ ...filters, page: target }, { scroll: true });
  };

  const linkBase =
    "inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-full px-3 text-sm font-semibold transition-colors";

  return (
    <nav
      aria-label={t.properties.pagination.label}
      className="mt-12 flex flex-col items-center gap-3"
    >
      <ul className="flex flex-wrap items-center justify-center gap-1.5">
        <li>
          {page > 1 ? (
            <Link
              href={hrefFor({ ...filters, page: page - 1 })}
              onClick={go(page - 1)}
              className={cn(linkBase, "text-ink hover:bg-ink/5")}
            >
              <ChevronLeft aria-hidden className="size-4 flip-rtl" />
              {t.properties.pagination.previous}
            </Link>
          ) : (
            <span aria-disabled className={cn(linkBase, "text-fg-muted/50")}>
              <ChevronLeft aria-hidden className="size-4 flip-rtl" />
              {t.properties.pagination.previous}
            </span>
          )}
        </li>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            <Link
              href={hrefFor({ ...filters, page: n })}
              onClick={go(n)}
              aria-current={n === page ? "page" : undefined}
              aria-label={interpolate(t.properties.pagination.page, {
                page: formatNumber(n, locale),
              })}
              className={cn(
                linkBase,
                n === page
                  ? "bg-ink text-white"
                  : "border border-line-strong bg-surface text-ink hover:border-primary",
              )}
            >
              {formatNumber(n, locale)}
            </Link>
          </li>
        ))}
        <li>
          {page < pageCount ? (
            <Link
              href={hrefFor({ ...filters, page: page + 1 })}
              onClick={go(page + 1)}
              className={cn(linkBase, "text-ink hover:bg-ink/5")}
            >
              {t.properties.pagination.next}
              <ChevronRight aria-hidden className="size-4 flip-rtl" />
            </Link>
          ) : (
            <span aria-disabled className={cn(linkBase, "text-fg-muted/50")}>
              {t.properties.pagination.next}
              <ChevronRight aria-hidden className="size-4 flip-rtl" />
            </span>
          )}
        </li>
      </ul>
      <p className="text-xs text-fg-muted">
        {interpolate(t.properties.pagination.summary, {
          page: formatNumber(page, locale),
          total: formatNumber(pageCount, locale),
        })}
      </p>
    </nav>
  );
}
