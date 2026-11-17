import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { initI18n } from "@/i18n";
import { AppRoutes } from "@/app/router";

describe("routes", () => {
  let i18n: Awaited<ReturnType<typeof initI18n>>;
  beforeAll(async () => { i18n = await initI18n(); });

  const renderAt = (path: string) =>
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={[path]}>
          <AppRoutes />
        </MemoryRouter>
      </I18nextProvider>
    );

  it("renders home page", () => {
    renderAt("/");
    const h1s = screen.getAllByRole("heading");
    expect(h1s.some((el) => el.textContent === "DevBench")).toBe(true);
  });

  it("unknown tool ID shows not implemented", () => {
    renderAt("/tools/unknown-id");
    expect(screen.getByText("\u5de5\u5177\u5c1a\u672a\u5b9e\u73b0")).toBeDefined();
  });

  it("404 page renders", () => {
    renderAt("/nonexistent");
    expect(screen.getByText("\u9875\u9762\u672a\u627e\u5230")).toBeDefined();
  });

  it("privacy page renders", () => {
    renderAt("/privacy");
    const matches = screen.getAllByText("\u9690\u79c1\u4e0e\u5b89\u5168");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("tools page renders", () => {
    renderAt("/tools");
    const matches = screen.getAllByText("\u5de5\u5177\u76ee\u5f55"); expect(matches.length).toBeGreaterThanOrEqual(1);
  });
});
