import type { ReactNode } from "react";

import { getI18n } from "@/i18n/locale";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/** Header + main landmark + footer, shared by public and account pages. */
export async function SiteShell({ children }: { children: ReactNode }) {
  const { t } = await getI18n();

  return (
    <>
      <a
        href="#main"
        className="fixed start-4 top-3 z-[60] -translate-y-24 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-transform focus:translate-y-0"
      >
        {t.nav.skipToContent}
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
