import { Alert } from "@/components/ui/alert";
import { formatDate, interpolate } from "@/i18n/format";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

import { PageHeader } from "./page-header";

const LAST_UPDATED = "2026-10-01";

type LegalPageProps = {
  doc: Dictionary["legal"]["terms"] | Dictionary["legal"]["privacy"];
  locale: Locale;
  t: Dictionary;
};

export function LegalPage({ doc, locale, t }: LegalPageProps) {
  return (
    <>
      <PageHeader
        title={doc.title}
        subtitle={interpolate(t.legal.updated, { date: formatDate(LAST_UPDATED, locale) })}
        breadcrumbLabel={t.common.breadcrumb}
        breadcrumbs={[{ label: t.nav.home, href: "/" }, { label: doc.title }]}
      />
      <article className="container-site max-w-3xl space-y-10 py-12 lg:py-16">
        <Alert>{t.legal.draftNotice}</Alert>
        {Object.values(doc.sections).map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-bold">{section.title}</h2>
            <p className="mt-3 leading-loose text-fg/80">{section.body}</p>
          </section>
        ))}
      </article>
    </>
  );
}
