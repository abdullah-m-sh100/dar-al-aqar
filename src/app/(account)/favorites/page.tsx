import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { Alert } from "@/components/ui/alert";
import { FavoritesView } from "@/features/favorites/components/favorites-view";
import { getAllProperties } from "@/features/properties/services/property-repository";
import { getI18n } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return {
    ...pageMetadata({
      title: t.favorites.metaTitle,
      description: t.favorites.subtitle,
      path: "/favorites",
      locale,
    }),
    robots: { index: false },
  };
}

export default async function FavoritesPage() {
  const { t } = await getI18n();
  const catalogue = await getAllProperties();

  return (
    <>
      <PageHeader
        eyebrow={t.favorites.eyebrow}
        title={t.favorites.title}
        subtitle={t.favorites.subtitle}
        breadcrumbLabel={t.common.breadcrumb}
        breadcrumbs={[{ label: t.nav.home, href: "/" }, { label: t.nav.favorites }]}
      />
      <div className="container-site space-y-8 py-10 lg:py-14">
        <Alert>{t.favorites.storageNote}</Alert>
        <FavoritesView catalogue={catalogue} />
      </div>
    </>
  );
}
