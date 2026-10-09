import {
  Compass,
  FileText,
  MessagesSquare,
  SlidersHorizontal,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

type WhyKey = keyof Dictionary["home"]["why"]["items"];

const ITEMS: { key: WhyKey; icon: LucideIcon }[] = [
  { key: "discovery", icon: Compass },
  { key: "details", icon: FileText },
  { key: "contact", icon: MessagesSquare },
  { key: "filters", icon: SlidersHorizontal },
  { key: "experience", icon: Smartphone },
];

export function WhySection({ t }: { t: Dictionary }) {
  return (
    <section aria-labelledby="why-title" className="bg-surface py-20 lg:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <SectionHeading
          id="why-title"
          eyebrow={t.home.why.eyebrow}
          title={t.home.why.title}
          subtitle={t.home.why.subtitle}
          className="lg:sticky lg:top-28 lg:self-start"
        />
        <ul className="grid gap-4 sm:grid-cols-2">
          {ITEMS.map(({ key, icon: Icon }, index) => (
            <Reveal
              as="li"
              key={key}
              delay={(index % 2) * 0.08}
              className={cn(
                "rounded-card border border-line bg-canvas p-6 transition-colors hover:border-primary/25",
                index === ITEMS.length - 1 && "sm:col-span-2",
              )}
            >
              <span className="mb-5 grid size-11 place-items-center rounded-xl bg-ink text-mint">
                <Icon aria-hidden className="size-5" />
              </span>
              <h3 className="text-lg font-bold">{t.home.why.items[key].title}</h3>
              <p className="mt-2 text-fg-muted">{t.home.why.items[key].body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
