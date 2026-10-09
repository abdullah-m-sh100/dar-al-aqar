import type { Metadata } from "next";

import { RegisterForm } from "@/features/auth/components/register-form";
import { getI18n } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return {
    ...pageMetadata({
      title: t.auth.register.metaTitle,
      description: t.auth.register.subtitle,
      path: "/register",
      locale,
    }),
    robots: { index: false },
  };
}

export default async function RegisterPage() {
  const { t } = await getI18n();
  return (
    <>
      <h1 className="text-3xl font-bold">{t.auth.register.title}</h1>
      <p className="mt-2 mb-8 text-fg-muted">{t.auth.register.subtitle}</p>
      <RegisterForm />
    </>
  );
}
