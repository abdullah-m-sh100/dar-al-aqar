import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarCheck, Check, MapPin } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { LeafletMap } from "@/components/shared/leaflet-map";
import { Price } from "@/components/shared/price";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getAgentById } from "@/features/agents/services/agent-repository";
import { agentInitials } from "@/features/agents/utils";
import { FavoriteButton } from "@/features/favorites/components/favorite-button";
import { AmenitiesList } from "@/features/properties/components/amenities-list";
import { ContactCard } from "@/features/properties/components/contact-card";
import { PropertyCard } from "@/features/properties/components/property-card";
import { PropertyGallery } from "@/features/properties/components/property-gallery";
import { PropertySpecs } from "@/features/properties/components/property-specs";
import { ShareButton } from "@/features/properties/components/share-button";
import {
  getPropertyBySlug,
  getSimilarProperties,
} from "@/features/properties/services/property-repository";
import { cityName, imageAlt, locationLabel } from "@/features/properties/utils/labels";
import { toMapPoint } from "@/features/properties/utils/map-points";
import { propertiesHref } from "@/features/search/search-params";
import { getI18n } from "@/i18n/locale";
import { pageMetadata, socialImageUrl } from "@/lib/metadata";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { locale, t } = await getI18n();
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: t.property.notFoundTitle };

  return pageMetadata({
    title: property.title[locale],
    description: property.description[locale],
    path: `/properties/${property.slug}`,
    locale,
    image: { url: socialImageUrl(property.images[0].src), alt: imageAlt(property, 0, locale, t) },
  });
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const { locale, t } = await getI18n();
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const [agent, similar] = await Promise.all([
    getAgentById(property.agentId),
    getSimilarProperties(property),
  ]);
  const title = property.title[locale];
  const p = t.property;

  // schema.org RealEstateListing with only fields backed by real data.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: title,
    description: property.description[locale],
    url: new URL(`/properties/${property.slug}`, siteConfig.url).toString(),
    image: property.images.map((image) => image.src),
    datePosted: property.createdAt,
    inLanguage: locale,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "SAR",
      businessFunction:
        property.listingType === "sale"
          ? "http://purl.org/goodrelations/v1#Sell"
          : "http://purl.org/goodrelations/v1#LeaseOut",
    },
  };

  return (
    <>
      <div className="container-site pt-6 pb-16 lg:pt-8">
        <Breadcrumbs
          label={t.common.breadcrumb}
          items={[
            { label: t.nav.home, href: "/" },
            { label: t.nav.properties, href: "/properties" },
            {
              label: cityName(property.city, locale),
              href: propertiesHref({ city: property.city }),
            },
            { label: title },
          ]}
        />

        <header className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <Badge variant={property.listingType === "sale" ? "ink" : "mint"}>
                {t.listingTypes[property.listingType]}
              </Badge>
              <Badge variant="outline">{t.propertyTypes[property.propertyType]}</Badge>
              {property.featured && <Badge variant="sand">{t.common.featured}</Badge>}
              {property.luxury && <Badge variant="sand">{t.common.luxury}</Badge>}
            </div>
            <h1 className="mt-4 text-3xl font-bold md:text-4xl">{title}</h1>
            <p className="mt-3 flex items-center gap-2 text-fg-muted">
              <MapPin aria-hidden className="size-4 text-sand" />
              {locationLabel(property, locale)}
            </p>
          </div>
          <div className="flex items-end justify-between gap-4 lg:flex-col lg:items-end">
            <Price
              amount={property.price}
              listingType={property.listingType}
              locale={locale}
              t={t}
              className="font-display text-3xl font-bold text-ink md:text-4xl"
            />
            <div className="flex gap-2">
              <ShareButton title={title} />
              <FavoriteButton propertyId={property.id} propertyTitle={title} variant="outline" />
            </div>
          </div>
        </header>

        <div className="mt-8">
          <PropertyGallery property={property} />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-14">
          <div className="min-w-0 space-y-12">
            <section aria-labelledby="specs-title">
              <h2 id="specs-title" className="mb-5 text-2xl font-bold">
                {p.overview}
              </h2>
              <PropertySpecs property={property} locale={locale} t={t} />
            </section>

            <section aria-labelledby="description-title">
              <h2 id="description-title" className="mb-4 text-2xl font-bold">
                {p.description}
              </h2>
              <p className="text-lg leading-loose text-fg/85">{property.description[locale]}</p>
              {property.highlights.length > 0 && (
                <>
                  <h3 className="mt-8 mb-4 text-lg font-bold">{p.highlights}</h3>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {property.highlights.map((highlight) => (
                      <li key={highlight.en} className="flex items-start gap-3">
                        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-mint text-ink">
                          <Check aria-hidden className="size-3.5" />
                        </span>
                        {highlight[locale]}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>

            {property.amenities.length > 0 && (
              <section aria-labelledby="amenities-title">
                <h2 id="amenities-title" className="mb-5 text-2xl font-bold">
                  {p.amenities}
                </h2>
                <AmenitiesList amenities={property.amenities} t={t} />
              </section>
            )}

            <section aria-labelledby="location-title">
              <h2 id="location-title" className="mb-2 text-2xl font-bold">
                {p.location}
              </h2>
              <p className="mb-5 text-sm text-fg-muted">{t.common.approxLocation}</p>
              <LeafletMap
                label={p.location}
                points={[toMapPoint(property, locale, t)]}
                zoom={14}
                className="h-80 sm:h-96"
              />
            </section>
          </div>

          <aside id="contact" className="scroll-mt-28">
            <div className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
              {agent && (
                <ContactCard
                  propertyId={property.id}
                  agent={{
                    id: agent.id,
                    name: agent.name[locale],
                    role: agent.role[locale],
                    initials: agentInitials(agent, locale),
                  }}
                />
              )}
            </div>
          </aside>
        </div>
      </div>

      {similar.length > 0 && (
        <section
          aria-labelledby="similar-title"
          className="border-t border-line bg-surface py-16 lg:py-20"
        >
          <div className="container-site">
            <SectionHeading
              id="similar-title"
              title={p.similar}
              subtitle={p.similarSubtitle}
              action={{
                href: propertiesHref({ city: property.city, listing: property.listingType }),
                label: t.common.viewAll,
              }}
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.08} className="h-full">
                  <PropertyCard property={item} locale={locale} t={t} className="h-full" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile quick action bar */}
      <div className="sticky bottom-0 z-30 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur-lg lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Price
            amount={property.price}
            listingType={property.listingType}
            locale={locale}
            t={t}
            className="font-display text-lg font-bold text-ink"
          />
          <Button asChild size="md">
            <Link href="#contact">
              <CalendarCheck aria-hidden />
              {t.property.schedule.title}
            </Link>
          </Button>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
