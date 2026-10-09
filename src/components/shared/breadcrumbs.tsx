import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

type BreadcrumbsProps = {
  items: Crumb[];
  label: string;
  tone?: "default" | "inverse";
  className?: string;
};

/** Visible breadcrumb trail plus schema.org BreadcrumbList structured data. */
export function Breadcrumbs({ items, label, tone = "default", className }: BreadcrumbsProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: new URL(item.href, siteConfig.url).toString() } : {}),
    })),
  };

  return (
    <nav aria-label={label} className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className={cn(
                    "transition-colors hover:underline",
                    tone === "inverse"
                      ? "text-white/75 hover:text-white"
                      : "text-fg-muted hover:text-primary",
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn(
                    "line-clamp-1 font-medium",
                    tone === "inverse" ? "text-white" : "text-ink",
                  )}
                >
                  {item.label}
                </span>
              )}
              {!last && (
                <ChevronRight
                  aria-hidden
                  className={cn(
                    "size-3.5 flip-rtl",
                    tone === "inverse" ? "text-white/50" : "text-fg-muted/60",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </nav>
  );
}
