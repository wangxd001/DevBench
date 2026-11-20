import { describe, it, expect, beforeAll, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { initI18n } from "@/i18n";

// jsdom 下 CodeMirror 加载不稳定，mock 成简单 textarea，只测复制反馈逻辑
vi.mock("@/components/editor/CodeEditor", () => ({
  CodeEditor: ({ value, onChange, readOnly }: { value: string; onChange: (v: string) => void; readOnly?: boolean }) => (
    <textarea
      value={value}
      onChange={readOnly ? undefined : (e) => onChange(e.target.value)}
      readOnly={readOnly}
      data-testid={readOnly ? "result-editor" : "input-editor"}
    />
  ),
}));

import { JsonFormatter } from "../index";

describe("JsonFormatter copy feedback", () => {
  let i18n: Awaited<ReturnType<typeof initI18n>>;
  beforeAll(async () => { i18n = await initI18n(); });

  const renderTool = () =>
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <JsonFormatter />
        </I18nextProvider>
      </MemoryRouter>
    );

  it("shows '已复制' after successful copy", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
      writable: true,
    });

    renderTool();
    // 输入合法 JSON 并格式化（"格式化"按钮有两个：mode 切换 + 操作按钮，取后者）
    fireEvent.change(screen.getByTestId("input-editor"), { target: { value: '{"a":1}' } });
    const formatBtns = screen.getAllByRole("button", { name: "格式化" });
    fireEvent.click(formatBtns[formatBtns.length - 1]);

    // 等待结果编辑器出现（复制按钮此时可见）
    const copyBtn = await screen.findByRole("button", { name: "复制" });
    fireEvent.click(copyBtn);

    await waitFor(() => expect(screen.getByRole("status")).toBeDefined());
    expect(screen.getByRole("status").textContent).toBe("已复制");
    expect(writeText).toHaveBeenCalledWith('{\n  "a": 1\n}');
  });

  it("shows '复制失败' when clipboard write throws", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
      writable: true,
    });

    renderTool();
    fireEvent.change(screen.getByTestId("input-editor"), { target: { value: '{"a":1}' } });
    const formatBtns = screen.getAllByRole("button", { name: "格式化" });
    fireEvent.click(formatBtns[formatBtns.length - 1]);

    const copyBtn = await screen.findByRole("button", { name: "复制" });
    fireEvent.click(copyBtn);

    await waitFor(() => expect(screen.getByRole("alert")).toBeDefined());
    expect(screen.getByRole("alert").textContent).toBe("复制失败");
  });
});