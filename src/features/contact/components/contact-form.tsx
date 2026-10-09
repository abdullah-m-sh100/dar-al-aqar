"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { FormSuccess } from "@/components/shared/form-success";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea, describedBy } from "@/components/ui/form-controls";
import { useI18n } from "@/i18n/i18n-provider";
import { CONTACT_SUBJECTS, contactSchema } from "@/lib/validation/schemas";
import { submitContactMessage } from "@/services/mock-submissions";

export function ContactForm() {
  const { t } = useI18n();
  const f = t.contact.form;
  const schema = useMemo(() => contactSchema(t.validation), [t]);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", subject: "general", message: "" },
  });

  async function onSubmit(values: z.output<typeof schema>) {
    const result = await submitContactMessage(values);
    if (result.ok) setDone(true);
  }

  if (done) {
    return (
      <FormSuccess
        title={f.successTitle}
        body={f.successBody}
        resetLabel={f.again}
        onReset={() => {
          reset();
          setDone(false);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="c-name" label={f.name} error={errors.name?.message}>
          <Input
            id="c-name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={describedBy("c-name", errors.name?.message)}
            {...register("name")}
          />
        </Field>
        <Field id="c-email" label={f.email} error={errors.email?.message}>
          <Input
            id="c-email"
            type="email"
            dir="ltr"
            autoComplete="email"
            className="text-start rtl:text-end"
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("c-email", errors.email?.message)}
            {...register("email")}
          />
        </Field>
      </div>
      <Field id="c-subject" label={f.subject} error={errors.subject?.message}>
        <Select id="c-subject" aria-invalid={!!errors.subject} {...register("subject")}>
          {CONTACT_SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>
              {f.subjects[subject]}
            </option>
          ))}
        </Select>
      </Field>
      <Field id="c-message" label={f.message} error={errors.message?.message}>
        <Textarea
          id="c-message"
          rows={6}
          placeholder={f.messagePlaceholder}
          aria-invalid={!!errors.message}
          aria-describedby={describedBy("c-message", errors.message?.message)}
          {...register("message")}
        />
      </Field>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? (
          <LoaderCircle aria-hidden className="animate-spin" />
        ) : (
          <Send aria-hidden className="flip-rtl" />
        )}
        {isSubmitting ? f.submitting : f.submit}
      </Button>
    </form>
  );
}
