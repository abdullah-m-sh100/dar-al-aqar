import Image from "next/image";
import Link from "next/link";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Logo } from "@/components/layout/logo";
import { siteMedia } from "@/config/site";
import { photoCredit } from "@/features/properties/utils/labels";
import { getI18n } from "@/i18n/locale";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { locale, t } = await getI18n();

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-4 py-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label={t.brand.homeLink} className="rounded-xl">
            <Logo locale={locale} />
          </Link>
          <LanguageSwitcher size="full" />
        </div>
        <main
          id="main"
          className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12"
        >
          {children}
        </main>
      </div>
      <aside className="relative isolate hidden overflow-hidden lg:flex lg:items-end lg:p-14">
        <Image
          src={siteMedia.auth.src}
          alt=""
          fill
          priority
          sizes="50vw"
          className="-z-20 object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/40 to-ink/10"
        />
        <div className="max-w-md text-white">
          <h2 className="text-title font-bold text-white">{t.auth.asideTitle}</h2>
          <p className="mt-4 text-lg text-white/75">{t.auth.asideBody}</p>
        </div>
        <p className="absolute end-4 top-4 text-[0.68rem] text-white/60">
          {photoCredit(siteMedia.auth.credit, t)}
        </p>
      </aside>
    </div>
  );
}
