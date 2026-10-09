import type { Metadata } from "next";

import { LegalPage } from "@/components/shared/legal-page";
import { getI18n } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return pageMetadata({
    title: t.legal.terms.metaTitle,
    description: t.legal.draftNotice,
    path: "/terms",
    locale,
  });
}

export default async function TermsPage() {
  const { locale, t } = await getI18n();
  return <LegalPage doc={t.legal.terms} locale={locale} t={t} />;
}
