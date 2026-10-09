import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MapPin } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { LeafletMap } from "@/components/shared/leaflet-map";
import { Price } from "@/components/shared/price";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STATUS_VARIANT } from "@/features/projects/components/project-card";
import { getProjectBySlug } from "@/features/projects/services/project-repository";
import { locationLabel, photoCredit } from "@/features/properties/utils/labels";
import { formatCompactNumber, formatNumber } from "@/i18n/format";
import { getI18n } from "@/i18n/locale";
import { pageMetadata, socialImageUrl } from "@/lib/metadata";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { locale, t } = await getI18n();
  const project = await getProjectBySlug(slug);
  if (!project) return { title: t.projects.notFoundTitle };
  return pageMetadata({
    title: project.name[locale],
    description: project.description[locale],
    path: `/projects/${project.slug}`,
    locale,
    image: { url: socialImageUrl(project.photos[0].src), alt: project.name[locale] },
  });
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const { locale, t } = await getI18n();
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const name = project.name[locale];
  const facts = [
    { label: t.projects.developer, value: project.developer[locale] },
    { label: t.projects.units, value: formatNumber(project.units, locale) },
    { label: t.projects.completion, value: String(project.completionYear) },
    {
      label: t.projects.types,
      value: project.propertyTypes
        .map((type) => t.propertyTypesPlural[type])
        .join(locale === "ar" ? "، " : ", "),
    },
  ];

  return (
    <>
      <section className="relative isolate -mt-(--header-height) flex min-h-[520px] items-end overflow-hidden pt-(--header-height) pb-12 lg:min-h-[620px]">
        <Image
          src={project.photos[0].src}
          alt={`${name} — ${project.tagline[locale]}`}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/50 to-ink/40"
        />
        <div className="container-site">
          <Breadcrumbs
            tone="inverse"
            label={t.common.breadcrumb}
            items={[
              { label: t.nav.home, href: "/" },
              { label: t.nav.projects, href: "/projects" },
              { label: name },
            ]}
          />
          <Badge variant={STATUS_VARIANT[project.status]} className="mt-6 bg-white/95">
            {t.projects.status[project.status]}
          </Badge>
          <h1 className="mt-4 text-display font-bold text-white">{name}</h1>
          <p className="mt-3 max-w-2xl text-xl text-white/80">{project.tagline[locale]}</p>
          <p className="mt-4 flex items-center gap-2 text-white/75">
            <MapPin aria-hidden className="size-4 text-sand" />
            {locationLabel(project, locale)}
          </p>
        </div>
        <p className="absolute end-4 top-[calc(var(--header-height)+0.75rem)] hidden text-[0.68rem] text-white/50 sm:block">
          {photoCredit(project.photos[0].credit, t)}
        </p>
      </section>

      <div className="container-site grid gap-12 py-12 lg:grid-cols-[1fr_22rem] lg:py-16">
        <div className="min-w-0 space-y-12">
          <Alert>{t.projects.demoNote}</Alert>
          <section aria-labelledby="about-project">
            <h2 id="about-project" className="mb-4 text-2xl font-bold">
              {t.projects.about}
            </h2>
            <p className="text-lg leading-loose text-fg/85">{project.description[locale]}</p>
          </section>
          <section aria-labelledby="project-features">
            <h2 id="project-features" className="mb-5 text-2xl font-bold">
              {t.projects.features}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-3">
              {project.features.map((feature) => (
                <li
                  key={feature.en}
                  className="flex items-start gap-3 rounded-card bg-surface p-4 shadow-soft"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-mint text-ink">
                    <Check aria-hidden className="size-3.5" />
                  </span>
                  {feature[locale]}
                </li>
              ))}
            </ul>
          </section>
          {project.photos[1] && (
            <figure className="relative aspect-[16/9] overflow-hidden rounded-panel">
              <Image
                src={project.photos[1].src}
                alt={name}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
              <figcaption className="absolute end-3 bottom-2 text-[0.68rem] text-white/80">
                {photoCredit(project.photos[1].credit, t)}
              </figcaption>
            </figure>
          )}
          <section aria-labelledby="project-location">
            <h2 id="project-location" className="mb-2 text-2xl font-bold">
              {t.projects.location}
            </h2>
            <p className="mb-5 text-sm text-fg-muted">{t.common.approxLocation}</p>
            <LeafletMap
              label={t.projects.location}
              zoom={14}
              className="h-80"
              points={[
                {
                  id: project.id,
                  lat: project.coordinates.lat,
                  lng: project.coordinates.lng,
                  label: formatCompactNumber(project.startingPrice, locale),
                  title: name,
                  subtitle: locationLabel(project, locale),
                },
              ]}
            />
          </section>
        </div>

        <aside>
          <div className="space-y-5 rounded-panel border border-line bg-surface p-6 shadow-soft lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
            <div>
              <p className="text-sm text-fg-muted">{t.projects.startingFrom}</p>
              <Price
                amount={project.startingPrice}
                locale={locale}
                t={t}
                className="font-display text-3xl font-bold text-ink"
              />
            </div>
            <dl className="divide-y divide-line border-y border-line">
              {facts.map((fact) => (
                <div key={fact.label} className="flex justify-between gap-4 py-3 text-sm">
                  <dt className="text-fg-muted">{fact.label}</dt>
                  <dd className="text-end font-semibold text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <div>
              <h2 className="font-display text-base font-bold">{t.projects.interestTitle}</h2>
              <p className="mt-1 text-sm text-fg-muted">{t.projects.interestBody}</p>
            </div>
            <Button asChild size="lg" className="w-full">
              <Link href="/contact">{t.projects.interestCta}</Link>
            </Button>
            <Button asChild variant="link" className="w-full justify-center">
              <Link href="/projects">{t.projects.allProjects}</Link>
            </Button>
          </div>
        </aside>
      </div>
    </>
  );
}
