import Link from "next/link";
import { Mail } from "lucide-react";

import { socialIcons } from "@/components/shared/social-icons";
import { siteConfig } from "@/config/site";
import { propertiesHref } from "@/features/search/search-params";
import { interpolate } from "@/i18n/format";
import { getI18n } from "@/i18n/locale";

import { Logo } from "./logo";

export async function SiteFooter() {
  const { locale, t } = await getI18n();

  const columns = [
    {
      title: t.footer.explore,
      links: [
        { href: "/properties", label: t.nav.properties },
        { href: "/projects", label: t.nav.projects },
        { href: "/agents", label: t.nav.agents },
        { href: "/favorites", label: t.nav.favorites },
      ],
    },
    {
      title: t.footer.categories,
      links: [
        { href: propertiesHref({ type: "villa" }), label: t.propertyTypesPlural.villa },
        { href: propertiesHref({ type: "apartment" }), label: t.propertyTypesPlural.apartment },
        { href: propertiesHref({ type: "land" }), label: t.propertyTypesPlural.land },
        { href: propertiesHref({ type: "commercial" }), label: t.propertyTypesPlural.commercial },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { href: "/about", label: t.nav.about },
        { href: "/contact", label: t.nav.contact },
        { href: "/dashboard", label: t.nav.dashboard },
        { href: "/terms", label: t.footer.terms },
        { href: "/privacy", label: t.footer.privacy },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute end-[-10rem] -top-40 size-[28rem] rounded-full bg-primary/40 blur-3xl"
      />
      <div className="relative container-site py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Link href="/" aria-label={t.brand.homeLink} className="inline-block rounded-xl">
              <Logo locale={locale} tone="dark" />
            </Link>
            <p className="mt-5 leading-relaxed text-white/65">{t.footer.summary}</p>
            <div className="mt-6">
              <p className="text-xs font-semibold tracking-wide text-white/50 uppercase">
                {t.footer.contact}
              </p>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="mt-2 inline-flex items-center gap-2 text-white/85 hover:text-mint"
              >
                <Mail aria-hidden className="size-4" />
                <bdi>{siteConfig.contactEmail}</bdi>
              </a>
              <p className="mt-1 text-xs text-white/45">{t.footer.emailNote}</p>
            </div>
            <ul aria-label={t.footer.social} className="mt-6 flex gap-2">
              {siteConfig.social.map(({ id, href }) => {
                const Icon = socialIcons[id];
                return (
                  <li key={id}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t.footer.socialNames[id]}
                      className="grid size-10 place-items-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-mint hover:text-mint"
                    >
                      <Icon className="size-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="font-sans text-sm font-semibold text-mint">{column.title}</h2>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-white/70 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>{interpolate(t.footer.rights, { year: new Date().getFullYear() })}</p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <span>{t.footer.demoNotice}</span>
            <span>{t.footer.photoCredit}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
