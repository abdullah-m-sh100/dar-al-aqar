"use client";

import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  closeLabel: string;
  /** Logical side: `end` is the right edge in LTR and the left edge in RTL. */
  side?: "end" | "bottom";
  className?: string;
  footer?: ReactNode;
  children: ReactNode;
};

/** Accessible drawer built on Radix Dialog (focus trap, Esc, scroll lock). */
export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  closeLabel,
  side = "end",
  className,
  footer,
  children,
}: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/45 backdrop-blur-[2px] data-[state=closed]:animate-[fade-out_200ms_ease-in] data-[state=open]:animate-[fade-in_250ms_ease-out]" />
        <Dialog.Content
          className={cn(
            "fixed z-50 flex flex-col bg-surface shadow-float focus:outline-none",
            side === "end" &&
              "inset-y-0 end-0 w-[min(24rem,88vw)] data-[state=closed]:animate-[sheet-out_220ms_ease-in] data-[state=open]:animate-[sheet-in_320ms_var(--ease-out-expo)]",
            side === "bottom" &&
              "inset-x-0 bottom-0 max-h-[90dvh] rounded-t-[1.75rem] data-[state=closed]:animate-[sheet-down_220ms_ease-in] data-[state=open]:animate-[sheet-up_320ms_var(--ease-out-expo)]",
            className,
          )}
        >
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
            <div>
              <Dialog.Title className="font-display text-lg font-bold text-ink">
                {title}
              </Dialog.Title>
              {description ? (
                <Dialog.Description className="text-sm text-fg-muted">
                  {description}
                </Dialog.Description>
              ) : (
                <Dialog.Description className="sr-only">{title}</Dialog.Description>
              )}
            </div>
            <Dialog.Close
              className="grid size-10 cursor-pointer place-items-center rounded-full text-ink transition-colors hover:bg-ink/5"
              aria-label={closeLabel}
            >
              <X className="size-5" aria-hidden />
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
          {footer && <div className="border-t border-line px-5 py-4">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
