import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-(--ease-standard) select-none focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55 [&_svg]:size-[1.15em] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white shadow-[0_8px_20px_-10px_rgb(27_85_92/0.8)] hover:bg-primary-hover focus-visible:outline-primary",
        ink: "bg-ink text-white hover:bg-ink-soft focus-visible:outline-ink",
        secondary:
          "border border-line-strong bg-surface text-ink hover:border-primary hover:text-primary focus-visible:outline-primary",
        mint: "bg-mint text-ink hover:bg-[#a6dec6] focus-visible:outline-mint",
        ghost: "text-ink hover:bg-ink/5 focus-visible:outline-primary",
        "ghost-light": "text-white hover:bg-white/10 focus-visible:outline-white",
        "outline-light":
          "border border-white/40 bg-white/5 text-white backdrop-blur-sm hover:bg-white/15 focus-visible:outline-white",
        link: "rounded-none px-0 text-primary underline-offset-4 hover:underline focus-visible:outline-primary",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-7 text-base",
        icon: "size-10",
        "icon-sm": "size-9",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render the child element (e.g. a Link) with button styling. */
    asChild?: boolean;
  };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Component = asChild ? Slot.Root : "button";
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
