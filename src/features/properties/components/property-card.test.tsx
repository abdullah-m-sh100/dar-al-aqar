import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { rawProperties } from "@/data/properties";
import { getDictionary } from "@/i18n/get-dictionary";
import { renderWithI18n } from "@/test/render";

import { propertySchema } from "../schema";
import { PropertyCard } from "./property-card";

const villa = propertySchema.parse(rawProperties.find((p) => p.id === "DA-1001"));
const rental = propertySchema.parse(rawProperties.find((p) => p.id === "DA-1004"));

describe("PropertyCard", () => {
  it("renders Arabic content with SAR price and a link to the details page", () => {
    renderWithI18n(<PropertyCard property={villa} locale="ar" t={getDictionary("ar")} />);

    const link = screen.getByRole("link", { name: /فيلا عصرية/ });
    expect(link).toHaveAttribute("href", "/properties/riyadh-al-malqa-contemporary-villa");
    expect(screen.getByText("4,850,000")).toBeInTheDocument();
    expect(screen.getByText("ر.س")).toBeInTheDocument();
    expect(screen.getByText("الملقا، الرياض")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAccessibleName(/الواجهة الخارجية/);
  });

  it("shows the annual period for rentals in English", () => {
    renderWithI18n(<PropertyCard property={rental} locale="en" t={getDictionary("en")} />, "en");

    expect(screen.getByText("SAR")).toBeInTheDocument();
    expect(screen.getByText("95,000")).toBeInTheDocument();
    expect(screen.getByText("/ per year")).toBeInTheDocument();
    expect(screen.getByText("For rent")).toBeInTheDocument();
  });
});
