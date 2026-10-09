import type { Metadata } from "next";
import Link from "next/link";

import { LogoMark } from "@/components/layout/logo";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { getI18n } from "@/i18n/locale";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.notFound.metaTitle, robots: { index: false } };
}

export default async function NotFound() {
  const { t } = await getI18n();

  return (
    <SiteShell>
      <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <LogoMark className="size-16" />
        <p className="mt-8 font-display text-7xl font-bold text-mint">404</p>
        <h1 className="mt-4 text-3xl font-bold">{t.notFound.title}</h1>
        <p className="mt-3 max-w-md text-fg-muted">{t.notFound.body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/">{t.notFound.home}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/properties">{t.notFound.browse}</Link>
          </Button>
        </div>
      </div>
    </SiteShell>
  );
}
