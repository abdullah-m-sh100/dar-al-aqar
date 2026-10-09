"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/config/site";
import { FavoritesLink } from "@/features/favorites/components/favorites-link";
import { useI18n } from "@/i18n/i18n-provider";
import { isActivePath } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";
import { MobileNavigation } from "./mobile-navigation";

/** Sticky header. Transparent over the home hero, solid once the page scrolls. */
export function SiteHeader() {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Subscribing to scroll is a genuine external-system sync.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overlay = pathname === "/" && !scrolled;
  const tone = overlay ? "inverse" : "default";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-(--header-height) transition-[background-color,box-shadow,border-color] duration-300",
        overlay
          ? "border-b border-transparent bg-transparent"
          : "border-b border-line/80 bg-canvas/85 shadow-[0_1px_0_rgb(16_45_53/0.02)] backdrop-blur-xl",
      )}
    >
      <div className="container-site flex h-full items-center justify-between gap-4">
        <Link href="/" aria-label={t.brand.homeLink} className="rounded-xl">
          <Logo locale={locale} tone={overlay ? "dark" : "light"} />
        </Link>

        <nav aria-label={t.nav.primary} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-[0.92rem] font-medium transition-colors",
                      overlay ? "text-white/85 hover:text-white" : "text-fg-muted hover:text-ink",
                      active && (overlay ? "text-white" : "text-ink"),
                    )}
                  >
                    {t.nav[link.key]}
                    {active && (
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full",
                          overlay ? "bg-mint" : "bg-sand",
                        )}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitcher tone={tone} className="hidden sm:inline-flex" />
          <FavoritesLink tone={tone} />
          <Button
            asChild
            variant={overlay ? "ghost-light" : "ghost"}
            size="sm"
            className="hidden xl:inline-flex"
          >
            <Link href="/login">{t.nav.login}</Link>
          </Button>
          <Button
            asChild
            variant={overlay ? "mint" : "primary"}
            size="sm"
            className="ms-1 hidden lg:inline-flex"
          >
            <Link href="/dashboard?tab=add">
              <Plus aria-hidden />
              {t.nav.addProperty}
            </Link>
          </Button>
          <MobileNavigation tone={tone} />
        </div>
      </div>
    </header>
  );
}
