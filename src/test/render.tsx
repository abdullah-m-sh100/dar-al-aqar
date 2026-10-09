import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";

import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { I18nProvider } from "@/i18n/i18n-provider";

/** Renders inside the i18n provider for the given locale. */
export function renderWithI18n(ui: ReactElement, locale: Locale = "ar", options?: RenderOptions) {
  return render(
    <I18nProvider locale={locale} dictionary={getDictionary(locale)}>
      <div dir={locale === "ar" ? "rtl" : "ltr"}>{ui}</div>
    </I18nProvider>,
    options,
  );
}
