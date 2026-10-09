"use client";

import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { propertiesHref } from "@/features/search/search-params";
import { useI18n } from "@/i18n/i18n-provider";

import { ScheduleViewingForm } from "./schedule-viewing-form";

type ContactCardProps = {
  propertyId: string;
  agent: { id: string; name: string; role: string; initials: string };
};

/**
 * Representative card. Demo listings have no real phone numbers, so the
 * call/WhatsApp actions explain that instead of opening fake tel: links.
 */
export function ContactCard({ propertyId, agent }: ContactCardProps) {
  const { t } = useI18n();
  const c = t.property.contact;
  const [showDemoNotice, setShowDemoNotice] = useState(false);

  return (
    <div className="space-y-5 rounded-panel border border-line bg-surface p-5 shadow-soft sm:p-6">
      <div>
        <h2 className="font-display text-lg font-bold">{c.title}</h2>
        <div className="mt-4 flex items-center gap-3">
          <span
            aria-hidden
            className="grid size-12 shrink-0 place-items-center rounded-full bg-ink font-display font-bold text-mint"
          >
            {agent.initials}
          </span>
          <div className="min-w-0">
            <p className="text-xs text-fg-muted">{c.agentLabel}</p>
            <p className="truncate font-semibold text-ink">{agent.name}</p>
            <p className="truncate text-xs text-fg-muted">{agent.role}</p>
          </div>
          <Badge variant="sand" size="sm" className="ms-auto">
            {t.common.demo}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowDemoNotice(true)}
          aria-expanded={showDemoNotice}
        >
          <Phone aria-hidden />
          {c.call}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowDemoNotice(true)}
          aria-expanded={showDemoNotice}
        >
          <MessageCircle aria-hidden />
          {c.whatsapp}
        </Button>
      </div>
      {showDemoNotice && <Alert title={c.demoTitle}>{c.demoBody}</Alert>}

      <div className="border-t border-line pt-5">
        <h3 className="font-display text-base font-bold">{t.property.schedule.title}</h3>
        <p className="mt-1 mb-4 text-sm text-fg-muted">{t.property.schedule.subtitle}</p>
        <ScheduleViewingForm propertyId={propertyId} />
      </div>

      <Link
        href={propertiesHref({ agent: agent.id })}
        className="block text-center text-sm font-semibold text-primary hover:underline"
      >
        {c.agentListings}
      </Link>
    </div>
  );
}
