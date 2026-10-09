import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteMedia } from "@/config/site";
import { HeroSearch } from "@/features/search/components/hero-search";
import type { Locale } from "@/i18n/config";
import { formatNumber } from "@/i18n/format";
import type { Dictionary } from "@/i18n/get-dictionary";
import { photoCredit } from "@/features/properties/utils/labels";

type HeroStats = { listings: number; cities: number; types: number };

type HeroSectionProps = { locale: Locale; t: Dictionary; stats: HeroStats };

/**
 * Cinematic hero. Entrance motion is pure CSS (no JS needed, no layout
 * shift) and is disabled automatically under prefers-reduced-motion.
 */
export function HeroSection({ locale, t, stats }: HeroSectionProps) {
  const statItems = [
    { value: stats.listings, label: t.home.hero.statListings },
    { value: stats.cities, label: t.home.hero.statCities },
    { value: stats.types, label: t.home.hero.statTypes },
  ];

  return (
    <section aria-labelledby="hero-title" className="relative -mt-(--header-height)">
      <div className="relative isolate flex min-h-[640px] items-end overflow-hidden pt-(--header-height) pb-40 sm:min-h-[720px] lg:min-h-[min(92svh,900px)] lg:pb-48">
        <Image
          src={siteMedia.hero.src}
          alt={t.home.hero.imageAlt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={78}
          className="-z-20 animate-hero-zoom object-cover object-[60%_50%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(16_45_53/0.55)_0%,rgb(16_45_53/0.25)_35%,rgb(16_45_53/0.85)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(16_45_53/0.7)_0%,transparent_65%)] rtl:bg-[linear-gradient(270deg,rgb(16_45_53/0.7)_0%,transparent_65%)]"
        />

        <div className="container-site">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex animate-rise items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-md">
              <span aria-hidden className="size-1.5 rounded-full bg-mint" />
              {t.home.hero.eyebrow}
            </p>
            <h1
              id="hero-title"
              className="animate-rise text-display font-bold text-white [animation-delay:120ms]"
            >
              {t.home.hero.title}
            </h1>
            <p className="mt-6 max-w-xl animate-rise text-lg leading-relaxed text-white/80 [animation-delay:240ms] md:text-xl">
              {t.home.hero.subtitle}
            </p>
            <div className="mt-9 flex animate-rise flex-wrap gap-3 [animation-delay:360ms]">
              <Button asChild size="lg" variant="mint">
                <Link href="/properties">
                  {t.home.hero.primaryCta}
                  <ArrowRight aria-hidden className="flip-rtl" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline-light">
                <Link href="/dashboard?tab=add">
                  <Plus aria-hidden />
                  {t.home.hero.secondaryCta}
                </Link>
              </Button>
            </div>
            <dl className="mt-12 hidden animate-rise gap-10 [animation-delay:480ms] sm:flex">
              {statItems.map((item) => (
                <div key={item.label} className="border-s border-white/25 ps-4">
                  <dt className="text-sm text-white/65">{item.label}</dt>
                  <dd className="font-display text-3xl font-bold text-white tabular-nums">
                    {formatNumber(item.value, locale)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <p className="absolute end-4 top-[calc(var(--header-height)+0.75rem)] hidden text-[0.68rem] text-white/50 sm:end-6 sm:block">
          {photoCredit(siteMedia.hero.credit, t)}
        </p>
      </div>

      <div className="relative z-10 container-site -mt-28 animate-rise [animation-delay:560ms] lg:-mt-32">
        <HeroSearch />
      </div>
    </section>
  );
}
