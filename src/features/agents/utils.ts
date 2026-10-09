import type { Locale } from "@/i18n/config";

import type { Agent } from "./types";

/** Two-letter monogram, ignoring the Arabic definite article "ال". */
export function agentInitials(agent: Agent, locale: Locale): string {
  const words = agent.name[locale].split(/\s+/).filter(Boolean);
  const first = words[0] ?? "";
  const last = (words.at(-1) ?? "").replace(/^ال/, "").replace(/^Al-/i, "");
  return locale === "ar"
    ? `${first[0] ?? ""} ${last[0] ?? ""}`.trim()
    : `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}
