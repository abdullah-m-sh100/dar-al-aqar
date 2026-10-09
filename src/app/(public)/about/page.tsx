import type { Metadata } from "next";
import Image from "next/image";
import {
  Check,
  Eye,
  Gem,
  Hourglass,
  Landmark,
  PenTool,
  Target,
  type LucideIcon,
} from "lucide-react";

import { CTASection } from "@/components/shared/cta-section";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/reveal";
import { siteMedia } from "@/config/site";
import { photoCredit } from "@/features/properties/utils/labels";
import type { Dictionary } from "@/i18n/get-dictionary";
import { getI18n } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

type ValueKey = keyof Dictionary["about"]["values"];

const VALUE_ICONS: Record<ValueKey, LucideIcon> = {
  clarity: Gem,
  respect: Hourglass,
  craft: PenTool,
  local: Landmark,
};

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return pageMetadata({
    title: t.about.metaTitle,
    description: t.about.metaDescription,
    path: "/about",
    locale,
  });
}

export default async function AboutPage() {
  const { t } = await getI18n();
  const a = t.about;

  return (
    <>
      <PageHeader
        eyebrow={a.eyebrow}
        title={a.title}
        subtitle={a.intro}
        breadcrumbLabel={t.common.breadcrumb}
        breadcrumbs={[{ label: t.nav.home, href: "/" }, { label: t.nav.about }]}
      />

      <section className="container-site grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-panel">
            <Image
              src={siteMedia.aboutHeritage.src}
              alt={a.imageAlt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute end-4 -bottom-8 hidden w-48 overflow-hidden rounded-card border-4 border-canvas shadow-lift sm:block lg:-end-8">
            <div className="relative aspect-square">
              <Image
                src={siteMedia.aboutCraft.src}
                alt={a.craftImageAlt}
                fill
                sizes="12rem"
                className="object-cover"
              />
            </div>
          </div>
          <p className="mt-3 text-xs text-fg-muted">
            {photoCredit(siteMedia.aboutHeritage.credit, t)} ·{" "}
            {photoCredit(siteMedia.aboutCraft.credit, t)}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-title font-bold">{a.storyTitle}</h2>
          <p className="mt-5 text-lg leading-loose text-fg/80">{a.story}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { icon: Eye, title: a.visionTitle, body: a.vision },
              { icon: Target, title: a.missionTitle, body: a.mission },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-card border border-line bg-surface p-6">
                <Icon aria-hidden className="size-6 text-primary" />
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-fg-muted">{body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="values-title" className="bg-ink py-16 text-white lg:py-24">
        <div className="container-site">
          <h2 id="values-title" className="text-title font-bold text-white">
            {a.valuesTitle}
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(VALUE_ICONS) as ValueKey[]).map((key, index) => {
              const Icon = VALUE_ICONS[key];
              return (
                <Reveal
                  as="li"
                  key={key}
                  delay={index * 0.08}
                  className="rounded-card border border-white/10 bg-white/5 p-6"
                >
                  <Icon aria-hidden className="size-6 text-mint" />
                  <h3 className="mt-5 text-lg font-bold text-white">{a.values[key].title}</h3>
                  <p className="mt-2 text-white/65">{a.values[key].body}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="benefits-title" className="container-site py-16 lg:py-24">
        <h2 id="benefits-title" className="text-title font-bold">
          {a.benefitsTitle}
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {Object.values(a.benefits).map((benefit) => (
            <li
              key={benefit}
              className="flex items-start gap-3 rounded-card bg-surface p-5 shadow-soft"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-mint text-ink">
                <Check aria-hidden className="size-4" />
              </span>
              <span className="pt-0.5 font-medium">{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      <CTASection
        title={a.ctaTitle}
        body={a.ctaBody}
        primary={{ href: "/properties", label: a.ctaButton }}
        photo={siteMedia.ownerCta}
        credit={photoCredit(siteMedia.ownerCta.credit, t)}
      />
    </>
  );
}
