import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { initI18n } from "@/i18n";
import { HttpStatusCodes } from "../index";

describe("HttpStatusCodes rendering", () => {
  let i18n: Awaited<ReturnType<typeof initI18n>>;
  beforeAll(async () => { i18n = await initI18n(); });

  const renderTool = () =>
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <HttpStatusCodes />
        </I18nextProvider>
      </MemoryRouter>
    );

  // Regression: grouped map key was built as "200x" while CATEGORIES uses "2xx",
  // so map.get() always returned undefined and the list never rendered
  // (only the "match count" line showed). See index.tsx grouping logic.
  it("renders status code items when filtering by '200'", () => {
    renderTool();
    const input = screen.getByLabelText("搜索状态码（编码、名称或关键词）");
    input.setAttribute("value", "200");
    // React controlled input: dispatch input event so state updates
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;
    setter?.call(input, "200");
    input.dispatchEvent(new Event("input", { bubbles: true }));

    // 200 / 201 / 202 / 204 / 206 should all be visible in the 2xx group
    expect(screen.getByText("200")).toBeDefined();
    expect(screen.getByText("201")).toBeDefined();
    expect(screen.getByText("No Content")).toBeDefined();
  });

  it("shows the match count line when filtering", () => {
    renderTool();
    const input = screen.getByLabelText("搜索状态码（编码、名称或关键词）") as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;
    setter?.call(input, "404");
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect(screen.getByText(/匹配 \d+ 条/)).toBeDefined();
    // exact match ranked first
    expect(screen.getByText("Not Found")).toBeDefined();
  });
});