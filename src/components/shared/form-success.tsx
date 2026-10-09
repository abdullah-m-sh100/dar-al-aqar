"use client";

import { CircleCheck, RotateCcw } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

type FormSuccessProps = { title: string; body: string; resetLabel: string; onReset: () => void };

/** Confirmation panel shown after a (mock) submission succeeds. */
export function FormSuccess({ title, body, resetLabel, onReset }: FormSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      role="status"
      className="flex flex-col items-center rounded-card bg-mint-soft px-6 py-10 text-center"
    >
      <span className="grid size-14 place-items-center rounded-full bg-success text-white">
        <CircleCheck aria-hidden className="size-7" />
      </span>
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-fg-muted">{body}</p>
      <Button type="button" variant="secondary" size="sm" className="mt-6" onClick={onReset}>
        <RotateCcw aria-hidden />
        {resetLabel}
      </Button>
    </motion.div>
  );
}
