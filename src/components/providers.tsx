"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

import { FavoritesHydrator } from "@/features/favorites/components/favorites-hydrator";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { I18nProvider } from "@/i18n/i18n-provider";

export function Providers({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
}) {
  return (
    <I18nProvider locale={locale} dictionary={dictionary}>
      <MotionConfig reducedMotion="user">
        <FavoritesHydrator />
        {children}
      </MotionConfig>
    </I18nProvider>
  );
}
