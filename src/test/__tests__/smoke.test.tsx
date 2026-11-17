import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { initI18n } from "@/i18n";
import { HomePage } from "@/features/home";

describe("smoke", () => {
  let i18n: Awaited<ReturnType<typeof initI18n>>;
  beforeAll(async () => { i18n = await initI18n(); });

  it("renders home page title", () => {
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <HomePage />
        </I18nextProvider>
      </MemoryRouter>
    );
    expect(screen.getByText("DevBench")).toBeDefined();
  });
});
