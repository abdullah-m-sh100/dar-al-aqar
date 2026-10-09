"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { NAV_LINKS } from "@/config/site";
import { useI18n } from "@/i18n/i18n-provider";
import { isActivePath } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import { LanguageSwitcher } from "./language-switcher";

const SECONDARY_LINKS = [
  { href: "/agents", key: "agents" },
  { href: "/favorites", key: "favorites" },
  { href: "/dashboard", key: "dashboard" },
] as const;

export function MobileNavigation({ tone }: { tone: "default" | "inverse" }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.nav.openMenu}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          "grid size-10 cursor-pointer place-items-center rounded-full transition-colors lg:hidden",
          tone === "default" ? "text-ink hover:bg-ink/5" : "text-white hover:bg-white/10",
        )}
      >
        <Menu aria-hidden className="size-5" />
      </button>

      <Sheet
        open={open}
        onOpenChange={setOpen}
        title={t.nav.menu}
        closeLabel={t.nav.closeMenu}
        footer={
          <div className="grid gap-2">
            <Button asChild size="lg">
              <Link href="/dashboard?tab=add" onClick={close}>
                <Plus aria-hidden />
                {t.nav.addProperty}
              </Link>
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="secondary">
                <Link href="/login" onClick={close}>
                  {t.nav.login}
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/register" onClick={close}>
                  {t.nav.register}
                </Link>
              </Button>
            </div>
          </div>
        }
      >
        <nav aria-label={t.nav.primary}>
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-lg font-semibold transition-colors",
                      active ? "bg-mint-soft text-ink" : "text-ink hover:bg-canvas",
                    )}
                  >
                    {t.nav[link.key]}
                    {active && <span aria-hidden className="size-2 rounded-full bg-sand" />}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ul className="mt-4 space-y-1 border-t border-line pt-4">
            {SECONDARY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={close}
                  className="flex items-center justify-between rounded-xl px-4 py-2.5 text-fg-muted transition-colors hover:bg-canvas hover:text-ink"
                >
                  {t.nav[link.key]}
                  <ArrowUpRight aria-hidden className="size-4 flip-rtl" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-6 flex items-center justify-between rounded-2xl bg-canvas px-4 py-2">
          <span className="text-sm text-fg-muted">{t.language.label}</span>
          <LanguageSwitcher size="full" />
        </div>
      </Sheet>
    </>
  );
}
