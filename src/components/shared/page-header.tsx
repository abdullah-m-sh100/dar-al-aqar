import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Breadcrumbs, type Crumb } from "./breadcrumbs";

type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  subtitle?: ReactNode;
  breadcrumbs: Crumb[];
  breadcrumbLabel: string;
  children?: ReactNode;
  className?: string;
};

/** Standard inner-page header band with breadcrumbs and a subtle brand motif. */
export function PageHeader({
  title,
  eyebrow,
  subtitle,
  breadcrumbs,
  breadcrumbLabel,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("relative overflow-hidden border-b border-line bg-surface", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -end-24 -top-24 size-80 rounded-full bg-mint-soft blur-2xl"
      />
      <div className="relative container-site py-10 lg:py-14">
        <Breadcrumbs label={breadcrumbLabel} items={breadcrumbs} />
        {eyebrow && <p className="mt-6 text-sm font-semibold text-primary">{eyebrow}</p>}
        <h1 className={cn("text-title font-bold", eyebrow ? "mt-2" : "mt-6")}>{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-lg text-fg-muted">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
