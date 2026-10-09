import { ChevronDown } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

const controlBase =
  "w-full rounded-xl border border-line-strong bg-surface text-fg transition-[border-color,box-shadow] duration-150 placeholder:text-fg-muted/80 hover:border-fg-muted/50 focus:border-primary focus:shadow-[0_0_0_4px_rgb(27_85_92/0.12)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-danger aria-invalid:focus:shadow-[0_0_0_4px_rgb(220_85_85/0.14)]";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlBase, "h-12 px-4 text-[0.95rem]", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(controlBase, "min-h-32 resize-y px-4 py-3 text-[0.95rem]", className)}
      {...props}
    />
  );
}

/** Native select: fully accessible, keyboard-friendly and uses the OS picker on mobile. */
export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          controlBase,
          "h-12 cursor-pointer appearance-none ps-4 pe-10 text-[0.95rem]",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute end-3.5 top-1/2 size-4 -translate-y-1/2 text-fg-muted"
      />
    </div>
  );
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label className={cn("mb-1.5 block text-sm font-semibold text-ink", className)} {...props} />
  );
}

type FieldProps = {
  id: string;
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  optionalLabel?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Label + control + hint/error wrapper. The control must use `id`, and
 * `aria-describedby={describedBy(id, error, hint)}` to link messages.
 */
export function Field({ id, label, error, hint, optionalLabel, className, children }: FieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={id}>
        {label}
        {optionalLabel && (
          <span className="ms-1.5 text-xs font-normal text-fg-muted">({optionalLabel})</span>
        )}
      </Label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-fg-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-danger-fg">
          {error}
        </p>
      )}
    </div>
  );
}

export function describedBy(id: string, error?: string, hint?: ReactNode): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}
