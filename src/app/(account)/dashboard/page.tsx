import type { Metadata } from "next";
import Link from "next/link";
import {
  Inbox,
  LayoutDashboard,
  LayoutList,
  PlusSquare,
  Settings,
  type LucideIcon,
} from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Alert } from "@/components/ui/alert";
import { AddPropertyForm } from "@/features/dashboard/components/add-property-form";
import {
  InquiriesPanel,
  ListingsPanel,
  OverviewPanel,
} from "@/features/dashboard/components/dashboard-panels";
import { SettingsForm } from "@/features/dashboard/components/settings-form";
import { getOwnerWorkspace } from "@/features/dashboard/services/dashboard-repository";
import { interpolate } from "@/i18n/format";
import { getI18n } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

const TABS = ["overview", "properties", "add", "inquiries", "settings"] as const;
type Tab = (typeof TABS)[number];

const TAB_ICONS: Record<Tab, LucideIcon> = {
  overview: LayoutDashboard,
  properties: LayoutList,
  add: PlusSquare,
  inquiries: Inbox,
  settings: Settings,
};

function resolveTab(value: string | string[] | undefined): Tab {
  const tab = Array.isArray(value) ? value[0] : value;
  return (TABS as readonly string[]).includes(tab ?? "") ? (tab as Tab) : "overview";
}

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return {
    ...pageMetadata({
      title: t.dashboard.metaTitle,
      description: t.dashboard.demoBanner,
      path: "/dashboard",
      locale,
    }),
    robots: { index: false },
  };
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { locale, t } = await getI18n();
  const tab = resolveTab((await searchParams).tab);
  const workspace = await getOwnerWorkspace();
  const d = t.dashboard;

  return (
    <div className="container-site py-8 lg:py-12">
      <Breadcrumbs
        label={t.common.breadcrumb}
        items={[{ label: t.nav.home, href: "/" }, { label: d.title }]}
      />
      <div className="mt-6 flex flex-col gap-2">
        <h1 className="text-title font-bold">
          {interpolate(d.greeting, { name: workspace.owner.name[locale] })}
        </h1>
        <p className="text-fg-muted">{d.title}</p>
      </div>
      <Alert className="mt-6">{d.demoBanner}</Alert>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <nav
          aria-label={d.sectionsLabel}
          className="-mx-4 scrollbar-none min-w-0 overflow-x-auto px-4 lg:mx-0 lg:px-0"
        >
          <ul className="flex gap-2 lg:flex-col">
            {TABS.map((key) => {
              const Icon = TAB_ICONS[key];
              const active = key === tab;
              return (
                <li key={key} className="shrink-0">
                  <Link
                    href={key === "overview" ? "/dashboard" : `/dashboard?tab=${key}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors",
                      active
                        ? "bg-ink text-white"
                        : "text-fg-muted hover:bg-surface hover:text-ink",
                    )}
                  >
                    <Icon aria-hidden className="size-4" />
                    {d.tabs[key]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <section aria-labelledby="dashboard-section" className="min-w-0">
          <h2 id="dashboard-section" className="mb-5 text-xl font-bold">
            {tab === "add" ? d.add.title : d.tabs[tab]}
          </h2>
          {tab === "overview" && (
            <OverviewPanel
              stats={workspace.stats}
              listings={workspace.listings}
              inquiries={workspace.inquiries}
              locale={locale}
              t={t}
            />
          )}
          {tab === "properties" && (
            <ListingsPanel listings={workspace.listings} locale={locale} t={t} />
          )}
          {tab === "add" && (
            <div className="rounded-card border border-line bg-surface p-6 shadow-soft sm:p-8">
              <p className="mb-6 text-fg-muted">{d.add.subtitle}</p>
              <AddPropertyForm />
            </div>
          )}
          {tab === "inquiries" && (
            <InquiriesPanel inquiries={workspace.inquiries} locale={locale} t={t} />
          )}
          {tab === "settings" && (
            <div className="rounded-card border border-line bg-surface p-6 shadow-soft sm:p-8">
              <SettingsForm
                defaults={{
                  name: workspace.owner.name[locale],
                  email: workspace.owner.email,
                  phone: workspace.owner.phone,
                }}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
