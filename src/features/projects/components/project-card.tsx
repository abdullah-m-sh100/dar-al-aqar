import Image from "next/image";
import Link from "next/link";
import { Building, CalendarClock, MapPin } from "lucide-react";

import { Price } from "@/components/shared/price";
import { Badge } from "@/components/ui/badge";
import { locationLabel } from "@/features/properties/utils/labels";
import type { Locale } from "@/i18n/config";
import { formatNumber } from "@/i18n/format";
import type { Dictionary } from "@/i18n/get-dictionary";

import type { Project, ProjectStatus } from "../types";

export const STATUS_VARIANT: Record<ProjectStatus, "success" | "mint" | "sand"> = {
  ready: "success",
  "under-construction": "mint",
  "off-plan": "sand",
};

export function ProjectCard({
  project,
  locale,
  t,
}: {
  project: Project;
  locale: Locale;
  t: Dictionary;
}) {
  const name = project.name[locale];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-panel border border-line bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden bg-line">
        <Image
          src={project.photos[0].src}
          alt={`${name} — ${project.tagline[locale]}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-105"
        />
        <Badge
          variant={STATUS_VARIANT[project.status]}
          className="absolute start-4 top-4 bg-white/95"
        >
          {t.projects.status[project.status]}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold text-primary">
          {t.projects.developer}: {project.developer[locale]}
        </p>
        <h2 className="mt-2 text-xl font-bold">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
            {name}
          </Link>
        </h2>
        <p className="mt-1 text-sm text-fg-muted">{project.tagline[locale]}</p>
        <p className="mt-3 flex items-center gap-1.5 text-sm text-fg-muted">
          <MapPin aria-hidden className="size-4 text-sand" />
          {locationLabel(project, locale)}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.propertyTypes.map((type) => (
            <Badge key={type} variant="outline" size="sm">
              {t.propertyTypesPlural[type]}
            </Badge>
          ))}
        </div>
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-line pt-4">
          <div>
            <p className="text-xs text-fg-muted">{t.projects.startingFrom}</p>
            <Price
              amount={project.startingPrice}
              locale={locale}
              t={t}
              className="font-display text-lg font-bold text-ink"
            />
          </div>
          <div className="flex gap-4 text-xs text-fg-muted">
            <span className="inline-flex items-center gap-1" title={t.projects.units}>
              <Building aria-hidden className="size-4 text-primary" />
              <span className="sr-only">{t.projects.units}</span>
              {formatNumber(project.units, locale)}
            </span>
            <span className="inline-flex items-center gap-1" title={t.projects.completion}>
              <CalendarClock aria-hidden className="size-4 text-primary" />
              <span className="sr-only">{t.projects.completion}</span>
              {project.completionYear}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
