import { describe, it, expect, beforeAll, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { initI18n } from "@/i18n";
import { RandomStringGenerator } from "../index";

describe("RandomStringGenerator copy feedback", () => {
  let i18n: Awaited<ReturnType<typeof initI18n>>;
  beforeAll(async () => { i18n = await initI18n(); });

  const renderTool = () =>
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <RandomStringGenerator />
        </I18nextProvider>
      </MemoryRouter>
    );

  it("copy button switches to '已复制' after successful copy", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
      writable: true,
    });

    renderTool();
    fireEvent.click(screen.getByRole("button", { name: "生成" }));

    const copyBtn = await screen.findByRole("button", { name: "复制全部" });
    fireEvent.click(copyBtn);

    await waitFor(() => expect(screen.getByRole("button", { name: "已复制" })).toBeDefined());
    expect(writeText).toHaveBeenCalledTimes(1);
  });

  it("shows '复制失败' alert when clipboard write throws", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
      writable: true,
    });

    renderTool();
    fireEvent.click(screen.getByRole("button", { name: "生成" }));

    const copyBtn = await screen.findByRole("button", { name: "复制全部" });
    fireEvent.click(copyBtn);

    await waitFor(() => expect(screen.getByRole("alert")).toBeDefined());
    expect(screen.getByRole("alert").textContent).toBe("复制失败");
  });
});