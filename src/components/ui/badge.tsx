import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap [&_svg]:size-3.5",
  {
    variants: {
      variant: {
        ink: "bg-ink text-white",
        mint: "bg-mint text-ink",
        sand: "bg-sand-soft text-[#7a5532]",
        glass: "bg-white/90 text-ink shadow-sm backdrop-blur",
        outline: "border border-line-strong bg-surface text-fg-muted",
        success: "bg-success/10 text-success",
      },
      size: {
        sm: "px-2.5 py-1 text-[0.7rem]",
        md: "px-3 py-1.5 text-xs",
      },
    },
    defaultVariants: { variant: "mint", size: "md" },
  },
);

export type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
