import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, Inbox, LayoutList, Plus, type LucideIcon } from "lucide-react";

import { Price } from "@/components/shared/price";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { locationLabel } from "@/features/properties/utils/labels";
import type { Locale } from "@/i18n/config";
import { formatDate, formatNumber, interpolate } from "@/i18n/format";
import type { Dictionary } from "@/i18n/get-dictionary";

import type { InquiryRow, OwnerListingRow } from "../services/dashboard-repository";

type Common = { locale: Locale; t: Dictionary };

type Stats = { active: number; views: number; newInquiries: number; saves: number };

export function OverviewPanel({
  stats,
  listings,
  inquiries,
  locale,
  t,
}: Common & { stats: Stats; listings: OwnerListingRow[]; inquiries: InquiryRow[] }) {
  const o = t.dashboard.overview;
  const cards: { icon: LucideIcon; label: string; value: number; demo?: boolean }[] = [
    { icon: LayoutList, label: o.activeListings, value: stats.active },
    { icon: Eye, label: o.totalViews, value: stats.views, demo: true },
    { icon: Inbox, label: o.newInquiries, value: stats.newInquiries },
    { icon: Heart, label: o.saves, value: stats.saves, demo: true },
  ];
  const maxViews = Math.max(...listings.map((listing) => listing.views), 1);

  return (
    <div className="space-y-8">
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ icon: Icon, label, value, demo }) => (
          <li key={label} className="rounded-card border border-line bg-surface p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="grid size-10 place-items-center rounded-xl bg-mint-soft text-primary">
                <Icon aria-hidden className="size-5" />
              </span>
              {demo && (
                <Badge variant="outline" size="sm">
                  {o.demoFigures}
                </Badge>
              )}
            </div>
            <p className="mt-4 text-sm text-fg-muted">{label}</p>
            <p className="font-display text-3xl font-bold text-ink tabular-nums">
              {formatNumber(value, locale)}
            </p>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-card border border-line bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-bold">{o.topListings}</h2>
          <ul className="mt-5 space-y-4">
            {listings
              .toSorted((a, b) => b.views - a.views)
              .map((listing) => (
                <li key={listing.propertyId}>
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="line-clamp-1 font-medium">
                      {listing.property.title[locale]}
                    </span>
                    <span className="shrink-0 text-fg-muted tabular-nums">
                      {interpolate(o.views, { count: formatNumber(listing.views, locale) })}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-canvas">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(listing.views / maxViews) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
          </ul>
        </section>

        <section className="rounded-card border border-line bg-surface p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{o.recentInquiries}</h2>
            <Link
              href="/dashboard?tab=inquiries"
              className="text-sm font-semibold text-primary hover:underline"
            >
              {o.viewAllInquiries}
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {inquiries.slice(0, 3).map((inquiry) => (
              <li key={inquiry.id} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{inquiry.from[locale]}</p>
                  <InquiryStatus status={inquiry.status} t={t} />
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-fg-muted">{inquiry.message[locale]}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export function ListingsPanel({ listings, locale, t }: Common & { listings: OwnerListingRow[] }) {
  const p = t.dashboard.properties;
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild size="sm">
          <Link href="/dashboard?tab=add">
            <Plus aria-hidden />
            {p.addNew}
          </Link>
        </Button>
      </div>
      <div className="relative overflow-x-auto rounded-card border border-line bg-surface shadow-soft">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="bg-canvas text-start text-xs text-fg-muted">
            <tr>
              <th scope="col" className="px-5 py-3 text-start font-semibold">
                {p.property}
              </th>
              <th scope="col" className="px-5 py-3 text-start font-semibold">
                {p.status}
              </th>
              <th scope="col" className="px-5 py-3 text-start font-semibold">
                {p.price}
              </th>
              <th scope="col" className="px-5 py-3 text-start font-semibold">
                {p.views}
              </th>
              <th scope="col" className="px-5 py-3 text-start font-semibold">
                <span className="sr-only">{p.actions}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {listings.map(({ property, status, views }) => (
              <tr key={property.id}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-line">
                      <Image
                        src={property.images[0].src}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-1 font-semibold">{property.title[locale]}</p>
                      <p className="text-xs text-fg-muted">
                        {property.id} · {locationLabel(property, locale)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Badge variant={status === "active" ? "success" : "outline"} size="sm">
                    {p.statuses[status]}
                  </Badge>
                </td>
                <td className="px-5 py-4 font-semibold">
                  <Price
                    amount={property.price}
                    listingType={property.listingType}
                    locale={locale}
                    t={t}
                  />
                </td>
                <td className="px-5 py-4 tabular-nums">{formatNumber(views, locale)}</td>
                <td className="px-5 py-4 text-end">
                  <Link
                    href={`/properties/${property.slug}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {p.view}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function InquiriesPanel({ inquiries, locale, t }: Common & { inquiries: InquiryRow[] }) {
  const q = t.dashboard.inquiries;
  return (
    <ul className="space-y-3">
      {inquiries.map((inquiry) => (
        <li key={inquiry.id} className="rounded-card border border-line bg-surface p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{inquiry.from[locale]}</p>
              <p className="text-xs text-fg-muted">
                {q.date}: {formatDate(inquiry.date, locale)}
              </p>
            </div>
            <InquiryStatus status={inquiry.status} t={t} />
          </div>
          <p className="mt-3">{inquiry.message[locale]}</p>
          {inquiry.property && (
            <p className="mt-3 text-sm text-fg-muted">
              {q.property}:{" "}
              <Link
                href={`/properties/${inquiry.property.slug}`}
                className="font-medium text-primary hover:underline"
              >
                {inquiry.property.title[locale]}
              </Link>
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

function InquiryStatus({ status, t }: { status: InquiryRow["status"]; t: Dictionary }) {
  return (
    <Badge variant={status === "new" ? "mint" : "outline"} size="sm">
      {t.dashboard.inquiries.statuses[status]}
    </Badge>
  );
}
