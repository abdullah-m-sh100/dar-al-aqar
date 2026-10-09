import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  align?: "start" | "center";
  tone?: "default" | "inverse";
  action?: { href: string; label: string };
  as?: "h1" | "h2";
  id?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "start",
  tone = "default",
  action,
  as: Heading = "h2",
  id,
  className,
}: SectionHeadingProps) {
  const inverse = tone === "inverse";

  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p
            className={cn(
              "mb-3 inline-flex items-center gap-2 text-sm font-semibold",
              inverse ? "text-mint" : "text-primary",
            )}
          >
            <span aria-hidden className={cn("h-px w-6", inverse ? "bg-mint" : "bg-sand")} />
            {eyebrow}
          </p>
        )}
        <Heading
          id={id}
          className={cn("text-title font-bold", inverse ? "text-white" : "text-ink")}
        >
          {title}
        </Heading>
        {subtitle && (
          <p
            className={cn("mt-3 text-base md:text-lg", inverse ? "text-white/70" : "text-fg-muted")}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className={cn(
            "group inline-flex shrink-0 items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline",
            inverse ? "text-mint" : "text-primary",
          )}
        >
          {action.label}
          <ArrowRight
            aria-hidden
            className="size-4 flip-rtl transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}
