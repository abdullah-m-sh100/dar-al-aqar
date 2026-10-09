import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon, title, body, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-panel border border-dashed border-line-strong bg-surface px-6 py-16 text-center",
        className,
      )}
    >
      <span className="mb-5 grid size-16 place-items-center rounded-2xl bg-mint-soft text-primary">
        <Icon aria-hidden className="size-7" />
      </span>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 max-w-md text-fg-muted">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
