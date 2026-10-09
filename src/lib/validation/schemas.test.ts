import { describe, expect, it } from "vitest";

import ar from "@/i18n/dictionaries/ar.json";

import {
  contactSchema,
  normalizePhone,
  registerSchema,
  SAUDI_MOBILE,
  viewingSchema,
} from "./schemas";

describe("Saudi mobile numbers", () => {
  it.each(["0501234567", "+966501234567", "00966501234567"])("accepts %s", (value) => {
    expect(SAUDI_MOBILE.test(value)).toBe(true);
  });

  it.each(["0401234567", "050123456", "+966401234567", "12345"])("rejects %s", (value) => {
    expect(SAUDI_MOBILE.test(value)).toBe(false);
  });

  it("normalizes spaces, dashes and Arabic-Indic digits", () => {
    expect(normalizePhone("٠٥٠ ١٢٣-٤٥٦٧")).toBe("0501234567");
  });
});

describe("form schemas", () => {
  it("returns localized messages", () => {
    const result = contactSchema(ar.validation).safeParse({
      name: "",
      email: "bad",
      subject: "general",
      message: "short",
    });
    expect(result.success).toBe(false);
    const messages = result.error?.issues.map((issue) => issue.message) ?? [];
    expect(messages).toContain(ar.validation.required);
    expect(messages).toContain(ar.validation.email);
  });

  it("rejects viewing dates in the past", () => {
    const result = viewingSchema(ar.validation).safeParse({
      name: "سارة أحمد",
      phone: "0501234567",
      date: "2000-01-01",
      time: "morning",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(ar.validation.futureDate);
  });

  it("requires matching passwords and accepted terms", () => {
    const result = registerSchema(ar.validation).safeParse({
      name: "سارة أحمد",
      email: "sara@example.com",
      phone: "0501234567",
      accountType: "seeker",
      password: "abcd1234",
      confirmPassword: "abcd12345",
      terms: false,
    });
    const messages = result.error?.issues.map((issue) => issue.message) ?? [];
    expect(messages).toContain(ar.validation.passwordMatch);
    expect(messages).toContain(ar.validation.terms);
  });
});
