import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert, CircleCheck, Info } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const alertVariants = cva("flex gap-3 rounded-2xl border p-4 text-sm leading-relaxed", {
  variants: {
    tone: {
      info: "border-primary/15 bg-mint-soft text-ink",
      success: "border-success/20 bg-success/8 text-ink",
      danger: "border-danger/25 bg-danger/8 text-ink",
    },
  },
  defaultVariants: { tone: "info" },
});

const icons = { info: Info, success: CircleCheck, danger: CircleAlert } as const;

const iconTone = { info: "text-primary", success: "text-success", danger: "text-danger-fg" };

type AlertProps = ComponentProps<"div"> & VariantProps<typeof alertVariants> & { title?: string };

export function Alert({ tone = "info", title, className, children, ...props }: AlertProps) {
  const Icon = icons[tone ?? "info"];
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn(alertVariants({ tone }), className)}
      {...props}
    >
      <Icon aria-hidden className={cn("mt-0.5 size-5 shrink-0", iconTone[tone ?? "info"])} />
      <div>
        {title && <p className="mb-0.5 font-semibold text-ink">{title}</p>}
        <div className="text-fg-muted">{children}</div>
      </div>
    </div>
  );
}
