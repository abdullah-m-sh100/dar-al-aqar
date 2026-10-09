import type { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/login-form";
import { getI18n } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return {
    ...pageMetadata({
      title: t.auth.login.metaTitle,
      description: t.auth.login.subtitle,
      path: "/login",
      locale,
    }),
    robots: { index: false },
  };
}

export default async function LoginPage() {
  const { t } = await getI18n();
  return (
    <>
      <h1 className="text-3xl font-bold">{t.auth.login.title}</h1>
      <p className="mt-2 mb-8 text-fg-muted">{t.auth.login.subtitle}</p>
      <LoginForm />
    </>
  );
}
