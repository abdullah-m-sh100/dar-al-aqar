import Link from "next/link";
import { ArrowRight, EyeOff, Languages, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cityName } from "@/features/properties/utils/labels";
import { propertiesHref } from "@/features/search/search-params";
import type { Locale } from "@/i18n/config";
import { plural } from "@/i18n/format";
import type { Dictionary } from "@/i18n/get-dictionary";

import type { Agent } from "../types";
import { agentInitials } from "../utils";

type AgentCardProps = { agent: Agent; listingCount: number; locale: Locale; t: Dictionary };

/** Demo representative profile. Uses a monogram, never a photo of a real person. */
export function AgentCard({ agent, listingCount, locale, t }: AgentCardProps) {
  const sep = locale === "ar" ? "، " : ", ";

  return (
    <article className="flex h-full flex-col rounded-panel border border-line bg-surface p-6 shadow-soft transition-shadow hover:shadow-lift">
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className="grid size-16 shrink-0 place-items-center rounded-2xl bg-ink font-display text-xl font-bold text-mint"
        >
          {agentInitials(agent, locale)}
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-bold">{agent.name[locale]}</h2>
          <p className="text-sm text-fg-muted">{agent.role[locale]}</p>
          <Badge variant="sand" size="sm" className="mt-2">
            {t.common.demo}
          </Badge>
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-fg/80">{agent.bio[locale]}</p>

      <dl className="mt-5 space-y-3 text-sm">
        <div>
          <dt className="sr-only">{t.agents.specialties}</dt>
          <dd className="flex flex-wrap gap-1.5">
            {agent.specialties.map((specialty) => (
              <Badge key={specialty.en} variant="mint" size="sm">
                {specialty[locale]}
              </Badge>
            ))}
          </dd>
        </div>
        <div className="flex items-center gap-2 text-fg-muted">
          <dt>
            <MapPin aria-hidden className="size-4 text-sand" />
            <span className="sr-only">{t.agents.cities}</span>
          </dt>
          <dd>{agent.cities.map((city) => cityName(city, locale)).join(sep)}</dd>
        </div>
        <div className="flex items-center gap-2 text-fg-muted">
          <dt>
            <Languages aria-hidden className="size-4 text-sand" />
            <span className="sr-only">{t.agents.languages}</span>
          </dt>
          <dd>{agent.languages.map((language) => t.agents.languageNames[language]).join(sep)}</dd>
        </div>
      </dl>

      <p className="mt-5 flex items-center gap-2 rounded-xl bg-canvas px-3 py-2 text-xs text-fg-muted">
        <EyeOff aria-hidden className="size-4 shrink-0" />
        {t.agents.contactHidden}
      </p>

      <Button asChild variant="secondary" className="mt-5 w-full">
        <Link href={propertiesHref({ agent: agent.id })}>
          {t.agents.viewListings} · {plural(locale, listingCount, t.common.properties)}
          <ArrowRight aria-hidden className="flip-rtl" />
        </Link>
      </Button>
    </article>
  );
}
