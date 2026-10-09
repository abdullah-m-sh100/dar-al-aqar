"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, describedBy } from "@/components/ui/form-controls";
import { useI18n } from "@/i18n/i18n-provider";
import { ACCOUNT_TYPES, registerSchema } from "@/lib/validation/schemas";
import { authenticate } from "@/services/mock-submissions";

import { PasswordInput } from "./password-input";

/** Integration point: replace `authenticate` with a real sign-up call. */
export function RegisterForm() {
  const { locale, t } = useI18n();
  const f = t.auth.fields;
  const r = t.auth.register;
  const schema = useMemo(() => registerSchema(t.validation), [t]);
  const [notConnected, setNotConnected] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      accountType: "seeker",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  async function onSubmit(values: z.output<typeof schema>) {
    const result = await authenticate(values);
    if (!result.ok) setNotConnected(true);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {notConnected && (
        <Alert tone="danger" title={t.auth.notConnectedTitle}>
          {t.auth.notConnectedBody}
        </Alert>
      )}
      <Field id="r-name" label={f.name} error={errors.name?.message}>
        <Input
          id="r-name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={describedBy("r-name", errors.name?.message)}
          {...register("name")}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="r-email" label={f.email} error={errors.email?.message}>
          <Input
            id="r-email"
            type="email"
            dir="ltr"
            autoComplete="email"
            className="text-start rtl:text-end"
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("r-email", errors.email?.message)}
            {...register("email")}
          />
        </Field>
        <Field id="r-phone" label={f.phone} error={errors.phone?.message}>
          <Input
            id="r-phone"
            type="tel"
            dir="ltr"
            inputMode="tel"
            autoComplete="tel"
            placeholder="05XXXXXXXX"
            className="text-start rtl:text-end"
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("r-phone", errors.phone?.message)}
            {...register("phone")}
          />
        </Field>
      </div>
      <Field id="r-type" label={f.accountType} error={errors.accountType?.message}>
        <Select id="r-type" {...register("accountType")}>
          {ACCOUNT_TYPES.map((type) => (
            <option key={type} value={type}>
              {f.accountTypes[type]}
            </option>
          ))}
        </Select>
      </Field>
      <Field
        id="r-password"
        label={f.password}
        hint={t.auth.passwordHint}
        error={errors.password?.message}
      >
        <PasswordInput
          id="r-password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          aria-describedby={describedBy(
            "r-password",
            errors.password?.message,
            t.auth.passwordHint,
          )}
          {...register("password")}
        />
      </Field>
      <Field id="r-confirm" label={f.confirmPassword} error={errors.confirmPassword?.message}>
        <PasswordInput
          id="r-confirm"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={describedBy("r-confirm", errors.confirmPassword?.message)}
          {...register("confirmPassword")}
        />
      </Field>
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-1 size-4 accent-primary"
            aria-invalid={!!errors.terms}
            aria-describedby={errors.terms ? "r-terms-error" : undefined}
            {...register("terms")}
          />
          <span>
            {r.termsPrefix}{" "}
            <Link href="/terms" className="font-semibold text-primary hover:underline">
              {r.termsLink}
            </Link>{" "}
            {r.and}
            {/* Arabic attaches "و" to the next word; English needs a space. */}
            {locale === "en" ? " " : ""}
            <Link href="/privacy" className="font-semibold text-primary hover:underline">
              {r.privacyLink}
            </Link>
          </span>
        </label>
        {errors.terms && (
          <p id="r-terms-error" role="alert" className="mt-1.5 text-xs font-medium text-danger-fg">
            {errors.terms.message}
          </p>
        )}
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <LoaderCircle aria-hidden className="animate-spin" />}
        {isSubmitting ? r.submitting : r.submit}
      </Button>
      <p className="text-center text-sm text-fg-muted">
        {r.haveAccount}{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          {t.nav.login}
        </Link>
      </p>
    </form>
  );
}
