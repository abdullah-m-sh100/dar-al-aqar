import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

type LogoMarkProps = {
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Brand mark: a Najdi-inspired doorway. The outer arch is the threshold of a
 * home, the inner door is the "dar", and the keystone dot marks discovery.
 * `light` is for light backgrounds; `dark` for teal/photographic ones.
 */
export function LogoMark({ tone = "light", className }: LogoMarkProps) {
  const tile = tone === "light" ? "var(--color-ink)" : "rgb(255 255 255 / 0.1)";
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={cn("size-10 shrink-0", className)}>
      <rect width="40" height="40" rx="12" fill={tile} />
      {tone === "dark" && (
        <rect
          x="0.5"
          y="0.5"
          width="39"
          height="39"
          rx="11.5"
          fill="none"
          stroke="rgb(255 255 255 / 0.22)"
        />
      )}
      <path
        d="M11.5 30.5V18.75a8.5 8.5 0 0 1 17 0V30.5"
        fill="none"
        stroke="var(--color-mint)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="M16.75 30.5v-8.25a3.25 3.25 0 0 1 6.5 0v8.25z" fill="var(--color-sand)" />
      <path d="M8.5 30.5h23" stroke="var(--color-mint)" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="20" cy="13.25" r="1.6" fill="var(--color-sand)" />
    </svg>
  );
}

type LogoProps = LogoMarkProps & { locale: Locale };

/** Mark + bilingual wordmark. The active language leads; the other supports. */
export function Logo({ locale, tone = "light", className }: LogoProps) {
  const primary = locale === "ar" ? "دار العقار" : "DAR AL AQAR";
  const secondary = locale === "ar" ? "DAR AL AQAR" : "دار العقار";

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark tone={tone} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.15rem] font-bold",
            locale === "en" && "tracking-[0.08em]",
            tone === "light" ? "text-ink" : "text-white",
          )}
        >
          {primary}
        </span>
        <span
          className={cn(
            "mt-1 text-[0.62rem] font-semibold",
            locale === "ar"
              ? "font-[family-name:var(--font-manrope)] tracking-[0.28em]"
              : "font-[family-name:var(--font-plex-arabic)]",
            tone === "light" ? "text-primary" : "text-mint",
          )}
        >
          {secondary}
        </span>
      </span>
    </span>
  );
}
