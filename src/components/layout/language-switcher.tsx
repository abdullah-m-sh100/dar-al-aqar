"use client";

import { Languages, LoaderCircle } from "lucide-react";
import { useTransition } from "react";

import { otherLocale } from "@/i18n/config";
import { setLocaleAction } from "@/i18n/actions";
import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  tone?: "default" | "inverse";
  /** `full` shows the target language name; `compact` shows a short code. */
  size?: "compact" | "full";
  className?: string;
};

/**
 * Switches language without navigation: the Server Action stores the cookie
 * and Next.js re-renders the current route in place, so the path, query
 * string, filters and scroll position are all preserved.
 */
export function LanguageSwitcher({
  tone = "default",
  size = "compact",
  className,
}: LanguageSwitcherProps) {
  const { locale, t } = useI18n();
  const [pending, startTransition] = useTransition();
  const target = otherLocale(locale);

  return (
    <button
      type="button"
      lang={target}
      onClick={() => startTransition(() => setLocaleAction(target))}
      disabled={pending}
      aria-label={t.language.switchToLabel}
      aria-busy={pending}
      className={cn(
        "inline-flex h-10 cursor-pointer items-center gap-2 rounded-full px-3 text-sm font-semibold transition-colors disabled:cursor-wait",
        tone === "default" ? "text-ink hover:bg-ink/5" : "text-white hover:bg-white/10",
        className,
      )}
    >
      {pending ? (
        <LoaderCircle aria-hidden className="size-4 animate-spin" />
      ) : (
        <Languages aria-hidden className="size-4" />
      )}
      <span className={cn(target === "ar" && "font-[family-name:var(--font-plex-arabic)]")}>
        {size === "full" ? t.language.switchTo : t.language.switchToShort}
      </span>
      {pending && <span className="sr-only">{t.language.switching}</span>}
    </button>
  );
}
