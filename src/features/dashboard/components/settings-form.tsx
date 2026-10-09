"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input, describedBy } from "@/components/ui/form-controls";
import { useI18n } from "@/i18n/i18n-provider";
import { settingsSchema } from "@/lib/validation/schemas";
import { saveAccountSettings } from "@/services/mock-submissions";

type SettingsFormProps = { defaults: { name: string; email: string; phone: string } };

export function SettingsForm({ defaults }: SettingsFormProps) {
  const { t } = useI18n();
  const s = t.dashboard.settings;
  const schema = useMemo(() => settingsSchema(t.validation), [t]);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaults, notifications: true },
  });

  async function onSubmit(values: z.output<typeof schema>) {
    setSaved(false);
    const result = await saveAccountSettings(values);
    if (result.ok) setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-xl space-y-5">
      {saved && <Alert tone="success">{s.saved}</Alert>}
      <Field id="s-name" label={s.name} error={errors.name?.message}>
        <Input
          id="s-name"
          aria-invalid={!!errors.name}
          aria-describedby={describedBy("s-name", errors.name?.message)}
          {...register("name")}
        />
      </Field>
      <Field id="s-email" label={s.email} error={errors.email?.message}>
        <Input
          id="s-email"
          type="email"
          dir="ltr"
          className="text-start rtl:text-end"
          aria-invalid={!!errors.email}
          aria-describedby={describedBy("s-email", errors.email?.message)}
          {...register("email")}
        />
      </Field>
      <Field id="s-phone" label={s.phone} error={errors.phone?.message}>
        <Input
          id="s-phone"
          type="tel"
          dir="ltr"
          inputMode="tel"
          className="text-start rtl:text-end"
          aria-invalid={!!errors.phone}
          aria-describedby={describedBy("s-phone", errors.phone?.message)}
          {...register("phone")}
        />
      </Field>
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-canvas px-4 py-3 text-sm font-medium">
        <input type="checkbox" className="size-4 accent-primary" {...register("notifications")} />
        {s.notifications}
      </label>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <LoaderCircle aria-hidden className="animate-spin" />}
        {isSubmitting ? s.saving : s.submit}
      </Button>
    </form>
  );
}
