"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/i18n-provider";

export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  return (
    <div
      role="alert"
      className="container-site flex min-h-[60vh] flex-col items-center justify-center py-20 text-center"
    >
      <span className="grid size-16 place-items-center rounded-2xl bg-danger/10 text-danger-fg">
        <TriangleAlert aria-hidden className="size-7" />
      </span>
      <h1 className="mt-6 text-3xl font-bold">{t.error.title}</h1>
      <p className="mt-3 max-w-md text-fg-muted">{t.error.body}</p>
      <Button className="mt-8" onClick={reset}>
        <RotateCcw aria-hidden />
        {t.error.retry}
      </Button>
    </div>
  );
}
