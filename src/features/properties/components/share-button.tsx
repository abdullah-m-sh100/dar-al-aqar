"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/i18n-provider";

type ShareState = "idle" | "copied" | "failed";

/** Native share sheet where available; otherwise copies the link. */
export function ShareButton({ title }: { title: string }) {
  const { t } = useI18n();
  const [state, setState] = useState<ShareState>("idle");

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2500);
  }

  const label =
    state === "copied"
      ? t.property.share.copied
      : state === "failed"
        ? t.property.share.failed
        : t.property.share.label;

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      onClick={share}
      aria-label={label}
      title={label}
    >
      {state === "copied" ? <Check aria-hidden className="text-success" /> : <Share2 aria-hidden />}
      <span role="status" className="sr-only">
        {state === "idle" ? "" : label}
      </span>
    </Button>
  );
}
