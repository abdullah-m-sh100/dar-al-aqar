import type { Metadata } from "next";
import { Building2, Clock, Mail, type LucideIcon } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/features/contact/components/contact-form";
import { getI18n } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return pageMetadata({
    title: t.contact.metaTitle,
    description: t.contact.metaDescription,
    path: "/contact",
    locale,
  });
}

export default async function ContactPage() {
  const { t } = await getI18n();
  const c = t.contact.channels;

  const channels: { icon: LucideIcon; label: string; value: React.ReactNode; note?: string }[] = [
    {
      icon: Mail,
      label: c.email,
      value: (
        <a
          href={`mailto:${siteConfig.contactEmail}`}
          className="hover:text-primary hover:underline"
        >
          <bdi>{siteConfig.contactEmail}</bdi>
        </a>
      ),
      note: c.emailNote,
    },
    { icon: Clock, label: c.hours, value: c.hoursValue },
    { icon: Building2, label: c.office, value: c.officeValue },
  ];

  return (
    <>
      <PageHeader
        eyebrow={t.contact.eyebrow}
        title={t.contact.title}
        subtitle={t.contact.subtitle}
        breadcrumbLabel={t.common.breadcrumb}
        breadcrumbs={[{ label: t.nav.home, href: "/" }, { label: t.nav.contact }]}
      />
      <div className="container-site grid gap-10 py-12 lg:grid-cols-[1fr_22rem] lg:py-16">
        <div className="rounded-panel border border-line bg-surface p-6 shadow-soft sm:p-10">
          <ContactForm />
        </div>
        <aside aria-labelledby="channels-title" className="rounded-panel bg-ink p-8 text-white">
          <h2 id="channels-title" className="text-xl font-bold text-white">
            {c.title}
          </h2>
          <ul className="mt-8 space-y-7">
            {channels.map(({ icon: Icon, label, value, note }) => (
              <li key={label} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-mint">
                  <Icon aria-hidden className="size-5" />
                </span>
                <div>
                  <p className="text-sm text-white/60">{label}</p>
                  <p className="mt-0.5 font-semibold">{value}</p>
                  {note && <p className="mt-1 text-xs text-white/45">{note}</p>}
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
