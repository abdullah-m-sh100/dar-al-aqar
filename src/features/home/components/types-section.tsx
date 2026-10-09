import Link from "next/link";
import { ArrowRight, Building2, Crown, Home, LandPlot, Store, type LucideIcon } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import type { PropertyType } from "@/features/properties/types";
import { propertiesHref, type SearchFilters } from "@/features/search/search-params";
import type { Locale } from "@/i18n/config";
import { plural } from "@/i18n/format";
import type { Dictionary } from "@/i18n/get-dictionary";

type CategoryKey = "villa" | "apartment" | "land" | "commercial" | "luxury";

const CATEGORIES: { key: CategoryKey; icon: LucideIcon; filters: Partial<SearchFilters> }[] = [
  { key: "villa", icon: Home, filters: { type: "villa" } },
  { key: "apartment", icon: Building2, filters: { type: "apartment" } },
  { key: "land", icon: LandPlot, filters: { type: "land" } },
  { key: "commercial", icon: Store, filters: { type: "commercial" } },
  { key: "luxury", icon: Crown, filters: { luxury: true } },
];

type TypesSectionProps = {
  counts: Record<PropertyType, number> & { luxury: number };
  locale: Locale;
  t: Dictionary;
};

export function TypesSection({ counts, locale, t }: TypesSectionProps) {
  return (
    <section aria-labelledby="types-title" className="container-site py-20 lg:py-28">
      <SectionHeading
        id="types-title"
        eyebrow={t.home.types.eyebrow}
        title={t.home.types.title}
        subtitle={t.home.types.subtitle}
        align="center"
      />
      <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {CATEGORIES.map(({ key, icon: Icon, filters }, index) => {
          const item = t.home.types.items[key];
          const featured = key === "luxury";
          return (
            <Reveal
              as="li"
              key={key}
              delay={index * 0.06}
              className={featured ? "col-span-2 md:col-span-1" : undefined}
            >
              <Link
                href={propertiesHref(filters)}
                className={
                  featured
                    ? "group flex h-full flex-col rounded-card bg-ink p-6 text-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                    : "group flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift"
                }
              >
                <span
                  className={
                    featured
                      ? "mb-8 grid size-12 place-items-center rounded-2xl bg-sand/20 text-sand"
                      : "mb-8 grid size-12 place-items-center rounded-2xl bg-mint-soft text-primary transition-colors group-hover:bg-mint"
                  }
                >
                  <Icon aria-hidden className="size-6" />
                </span>
                <h3 className={featured ? "text-lg font-bold text-white" : "text-lg font-bold"}>
                  {item.title}
                </h3>
                <p
                  className={featured ? "mt-1 text-sm text-white/65" : "mt-1 text-sm text-fg-muted"}
                >
                  {item.body}
                </p>
                <span
                  className={
                    featured
                      ? "mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-mint"
                      : "mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                  }
                >
                  {plural(locale, counts[key], t.common.properties)}
                  <ArrowRight
                    aria-hidden
                    className="size-4 flip-rtl transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                  />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
