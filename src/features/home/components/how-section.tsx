import { Heart, PhoneCall, Search, type LucideIcon } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Locale } from "@/i18n/config";
import { formatNumber } from "@/i18n/format";
import type { Dictionary } from "@/i18n/get-dictionary";

type StepKey = keyof Dictionary["home"]["how"]["steps"];

const STEPS: { key: StepKey; icon: LucideIcon }[] = [
  { key: "search", icon: Search },
  { key: "compare", icon: Heart },
  { key: "contact", icon: PhoneCall },
];

export function HowSection({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <section aria-labelledby="how-title" className="container-site py-20 lg:py-28">
      <SectionHeading
        id="how-title"
        eyebrow={t.home.how.eyebrow}
        title={t.home.how.title}
        align="center"
      />
      <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
        <span
          aria-hidden
          className="absolute inset-x-[16%] top-8 hidden h-px bg-[repeating-linear-gradient(90deg,var(--color-line-strong)_0_8px,transparent_8px_16px)] md:block"
        />
        {STEPS.map(({ key, icon: Icon }, index) => (
          <Reveal as="li" key={key} delay={index * 0.12} className="relative text-center">
            <span className="relative mx-auto grid size-16 place-items-center rounded-full border border-line bg-surface text-primary shadow-soft">
              <Icon aria-hidden className="size-6" />
              <span className="absolute -end-1 -top-1 grid size-6 place-items-center rounded-full bg-sand text-xs font-bold text-ink">
                {formatNumber(index + 1, locale)}
              </span>
            </span>
            <h3 className="mt-6 text-xl font-bold">{t.home.how.steps[key].title}</h3>
            <p className="mx-auto mt-2 max-w-xs text-fg-muted">{t.home.how.steps[key].body}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
