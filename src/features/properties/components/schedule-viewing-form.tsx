"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck, LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { FormSuccess } from "@/components/shared/form-success";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea, describedBy } from "@/components/ui/form-controls";
import { useI18n } from "@/i18n/i18n-provider";
import { VIEWING_TIMES, todayInRiyadh, viewingSchema } from "@/lib/validation/schemas";
import { submitViewingRequest } from "@/services/mock-submissions";

export function ScheduleViewingForm({ propertyId }: { propertyId: string }) {
  const { t } = useI18n();
  const s = t.property.schedule;
  const schema = useMemo(() => viewingSchema(t.validation), [t]);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", date: "", time: undefined, message: "" },
  });

  async function onSubmit(values: z.output<typeof schema>) {
    const result = await submitViewingRequest({ propertyId, ...values });
    if (result.ok) setDone(true);
  }

  if (done) {
    return (
      <FormSuccess
        title={s.successTitle}
        body={s.successBody}
        resetLabel={s.again}
        onReset={() => {
          reset();
          setDone(false);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Field id="sv-name" label={s.name} error={errors.name?.message}>
        <Input
          id="sv-name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={describedBy("sv-name", errors.name?.message)}
          {...register("name")}
        />
      </Field>
      <Field id="sv-phone" label={s.phone} error={errors.phone?.message}>
        <Input
          id="sv-phone"
          type="tel"
          dir="ltr"
          inputMode="tel"
          autoComplete="tel"
          placeholder={s.phonePlaceholder}
          className="text-start rtl:text-end"
          aria-invalid={!!errors.phone}
          aria-describedby={describedBy("sv-phone", errors.phone?.message)}
          {...register("phone")}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field id="sv-date" label={s.date} error={errors.date?.message}>
          <Input
            id="sv-date"
            type="date"
            min={todayInRiyadh()}
            aria-invalid={!!errors.date}
            aria-describedby={describedBy("sv-date", errors.date?.message)}
            {...register("date")}
          />
        </Field>
        <Field id="sv-time" label={s.time} error={errors.time?.message}>
          <Select
            id="sv-time"
            defaultValue=""
            aria-invalid={!!errors.time}
            aria-describedby={describedBy("sv-time", errors.time?.message)}
            {...register("time")}
          >
            <option value="" disabled>
              —
            </option>
            {VIEWING_TIMES.map((slot) => (
              <option key={slot} value={slot}>
                {s.times[slot]}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field
        id="sv-message"
        label={s.message}
        optionalLabel={t.common.optional}
        error={errors.message?.message}
      >
        <Textarea
          id="sv-message"
          rows={3}
          className="min-h-24"
          placeholder={s.messagePlaceholder}
          {...register("message")}
        />
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <LoaderCircle aria-hidden className="animate-spin" />
        ) : (
          <CalendarCheck aria-hidden />
        )}
        {isSubmitting ? s.submitting : s.submit}
      </Button>
    </form>
  );
}
