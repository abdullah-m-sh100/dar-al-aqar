"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input, describedBy } from "@/components/ui/form-controls";
import { useI18n } from "@/i18n/i18n-provider";
import { loginSchema } from "@/lib/validation/schemas";
import { authenticate } from "@/services/mock-submissions";

import { PasswordInput } from "./password-input";

/**
 * Integration point: replace `authenticate` with your auth provider
 * (e.g. Auth.js, Clerk or a custom API) and redirect on success.
 */
export function LoginForm() {
  const { t } = useI18n();
  const schema = useMemo(() => loginSchema(t.validation), [t]);
  const [notice, setNotice] = useState<"none" | "not-connected" | "forgot">("none");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.output<typeof schema>) {
    const result = await authenticate(values);
    if (!result.ok) setNotice("not-connected");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {notice === "not-connected" && (
        <Alert tone="danger" title={t.auth.notConnectedTitle}>
          {t.auth.notConnectedBody}
        </Alert>
      )}
      {notice === "forgot" && <Alert>{t.auth.forgotNote}</Alert>}
      <Field id="l-email" label={t.auth.fields.email} error={errors.email?.message}>
        <Input
          id="l-email"
          type="email"
          dir="ltr"
          autoComplete="email"
          className="text-start rtl:text-end"
          aria-invalid={!!errors.email}
          aria-describedby={describedBy("l-email", errors.email?.message)}
          {...register("email")}
        />
      </Field>
      <Field id="l-password" label={t.auth.fields.password} error={errors.password?.message}>
        <PasswordInput
          id="l-password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          aria-describedby={describedBy("l-password", errors.password?.message)}
          {...register("password")}
        />
      </Field>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setNotice("forgot")}
          className="cursor-pointer text-sm font-semibold text-primary hover:underline"
        >
          {t.auth.login.forgot}
        </button>
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <LoaderCircle aria-hidden className="animate-spin" />}
        {isSubmitting ? t.auth.login.submitting : t.auth.login.submit}
      </Button>
      <p className="text-center text-sm text-fg-muted">
        {t.auth.login.noAccount}{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          {t.nav.register}
        </Link>
      </p>
    </form>
  );
}
