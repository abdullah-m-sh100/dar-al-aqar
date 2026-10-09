import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import ar from "@/i18n/dictionaries/ar.json";
import { renderWithI18n } from "@/test/render";

import { ContactForm } from "./contact-form";

describe("ContactForm", () => {
  it("shows localized validation errors and links them to the fields", async () => {
    const user = userEvent.setup();
    renderWithI18n(<ContactForm />);

    await user.click(screen.getByRole("button", { name: ar.contact.form.submit }));

    const name = screen.getByLabelText(ar.contact.form.name);
    await waitFor(() => expect(name).toHaveAttribute("aria-invalid", "true"));
    expect(name).toHaveAccessibleDescription(ar.validation.required);
  });

  it("submits valid input to the mock handler and shows a demo confirmation", async () => {
    const user = userEvent.setup();
    renderWithI18n(<ContactForm />);

    await user.type(screen.getByLabelText(ar.contact.form.name), "سارة أحمد");
    await user.type(screen.getByLabelText(ar.contact.form.email), "sara@example.com");
    await user.type(
      screen.getByLabelText(ar.contact.form.message),
      "أرغب في معرفة المزيد عن إضافة عقاري إلى المنصة.",
    );
    await user.click(screen.getByRole("button", { name: ar.contact.form.submit }));

    expect(
      await screen.findByText(ar.contact.form.successTitle, {}, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(screen.getByText(ar.contact.form.successBody)).toBeInTheDocument();
  });
});
