import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { LeafletMap } from "@/components/shared/leaflet-map";
import { Button } from "@/components/ui/button";
import { getAgents } from "@/features/agents/services/agent-repository";
import { PropertyCard } from "@/features/properties/components/property-card";
import { searchProperties } from "@/features/properties/services/property-repository";
import { cityName } from "@/features/properties/utils/labels";
import { toMapPoint } from "@/features/properties/utils/map-points";
import { Pagination } from "@/features/search/components/pagination";
import { ResultsRegion } from "@/features/search/components/results-region";
import { ResultsToolbar } from "@/features/search/components/results-toolbar";
import { SearchFilters } from "@/features/search/components/search-filters";
import { SearchNavigationProvider } from "@/features/search/components/search-navigation";
import { parseSearchParams, propertiesHref } from "@/features/search/search-params";
import { interpolate } from "@/i18n/format";
import { getI18n } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { locale, t } = await getI18n();
  const filters = parseSearchParams(await searchParams);
  const title = filters.city
    ? interpolate(t.properties.titleIn, { place: cityName(filters.city, locale) })
    : t.properties.metaTitle;
  return pageMetadata({
    title,
    description: t.properties.metaDescription,
    // Filtered views canonicalize to the city-level page to avoid near-duplicate URLs.
    path: filters.city ? propertiesHref({ city: filters.city }) : "/properties",
    locale,
  });
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const { locale, t } = await getI18n();
  const filters = parseSearchParams(await searchParams);
  const [result, agents] = await Promise.all([searchProperties(filters), getAgents()]);
  const agentNames = Object.fromEntries(agents.map((agent) => [agent.id, agent.name[locale]]));
  const heading = filters.city
    ? interpolate(t.properties.titleIn, { place: cityName(filters.city, locale) })
    : t.properties.title;

  return (
    <SearchNavigationProvider>
      <div className="border-b border-line bg-surface">
        <div className="container-site py-8 lg:py-10">
          <Breadcrumbs
            label={t.common.breadcrumb}
            items={[{ label: t.nav.home, href: "/" }, { label: t.nav.properties }]}
          />
          <h1 className="mt-4 text-title font-bold">{heading}</h1>
          <p className="mt-2 max-w-2xl text-fg-muted">{t.properties.subtitle}</p>
        </div>
      </div>

      <div className="container-site grid gap-8 py-8 lg:grid-cols-[18.5rem_1fr] lg:py-10">
        <aside className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-height)+1.5rem)] max-h-[calc(100dvh-var(--header-height)-3rem)] overflow-y-auto rounded-card border border-line bg-surface p-5 shadow-soft">
            <h2 className="mb-5 font-display text-lg font-bold">{t.properties.filters.title}</h2>
            <SearchFilters idPrefix="d" />
          </div>
        </aside>

        <div className="min-w-0">
          <ResultsToolbar total={result.total} agentNames={agentNames} />

          <div className="mt-6">
            <ResultsRegion>
              {result.total === 0 ? (
                <EmptyState
                  icon={SearchX}
                  title={t.properties.empty.title}
                  body={t.properties.empty.body}
                  action={
                    <Button asChild variant="secondary">
                      <Link href="/properties">{t.properties.empty.action}</Link>
                    </Button>
                  }
                />
              ) : filters.view === "map" ? (
                <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
                  <LeafletMap
                    label={t.properties.mapTitle}
                    points={result.all.map((property) => toMapPoint(property, locale, t))}
                    className="h-[60vh] min-h-96 xl:sticky xl:top-[calc(var(--header-height)+1.5rem)] xl:h-[calc(100dvh-var(--header-height)-3rem)]"
                  />
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                    {result.all.map((property) => (
                      <PropertyCard key={property.id} property={property} locale={locale} t={t} />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className={
                      filters.view === "list"
                        ? "grid gap-5"
                        : "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                    }
                  >
                    {result.items.map((property, index) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        locale={locale}
                        t={t}
                        layout={filters.view === "list" ? "list" : "grid"}
                        priority={index < 3}
                      />
                    ))}
                  </div>
                  <Pagination page={result.page} pageCount={result.pageCount} />
                </>
              )}
            </ResultsRegion>
          </div>
        </div>
      </div>
    </SearchNavigationProvider>
  );
}
