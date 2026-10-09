import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/reveal";
import { Alert } from "@/components/ui/alert";
import { AgentCard } from "@/features/agents/components/agent-card";
import { getAgents } from "@/features/agents/services/agent-repository";
import { getAllProperties } from "@/features/properties/services/property-repository";
import { getI18n } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return pageMetadata({
    title: t.agents.metaTitle,
    description: t.agents.metaDescription,
    path: "/agents",
    locale,
  });
}

export default async function AgentsPage() {
  const { locale, t } = await getI18n();
  const [agents, properties] = await Promise.all([getAgents(), getAllProperties()]);

  return (
    <>
      <PageHeader
        eyebrow={t.agents.eyebrow}
        title={t.agents.title}
        subtitle={t.agents.subtitle}
        breadcrumbLabel={t.common.breadcrumb}
        breadcrumbs={[{ label: t.nav.home, href: "/" }, { label: t.nav.agents }]}
      />
      <div className="container-site py-10 lg:py-14">
        <Alert className="mb-8">{t.agents.demoNote}</Alert>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent, index) => (
            <Reveal key={agent.id} delay={(index % 3) * 0.08} className="h-full">
              <AgentCard
                agent={agent}
                listingCount={properties.filter((property) => property.agentId === agent.id).length}
                locale={locale}
                t={t}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
