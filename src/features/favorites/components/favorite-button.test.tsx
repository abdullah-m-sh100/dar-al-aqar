import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { renderWithI18n } from "@/test/render";

import { FAVORITES_STORAGE_KEY, useFavoritesStore } from "../favorites-store";
import { FavoriteButton } from "./favorite-button";

describe("FavoriteButton", () => {
  beforeEach(() => useFavoritesStore.setState({ ids: [], hydrated: true }));

  it("toggles the favorite state, label and persisted storage", async () => {
    const user = userEvent.setup();
    renderWithI18n(<FavoriteButton propertyId="DA-1001" propertyTitle="فيلا الملقا" />);

    const button = screen.getByRole("button", { name: /إضافة إلى المفضلة: فيلا الملقا/ });
    expect(button).toHaveAttribute("aria-pressed", "false");

    await user.click(button);
    expect(useFavoritesStore.getState().ids).toEqual(["DA-1001"]);
    expect(screen.getByRole("button", { name: /إزالة من المفضلة/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(localStorage.getItem(FAVORITES_STORAGE_KEY)).toContain("DA-1001");

    await user.click(screen.getByRole("button", { name: /إزالة من المفضلة/ }));
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  it("uses English labels in the English locale", () => {
    renderWithI18n(<FavoriteButton propertyId="DA-1001" propertyTitle="Malqa villa" />, "en");
    expect(
      screen.getByRole("button", { name: "Add to favorites: Malqa villa" }),
    ).toBeInTheDocument();
  });
});
