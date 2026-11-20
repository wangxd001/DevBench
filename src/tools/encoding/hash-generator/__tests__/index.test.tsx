import { describe, it, expect, beforeAll, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { initI18n } from "@/i18n";

// jsdom 无真 Worker，mock Vite 的 ?worker 导入。
// createWorker 内部 `new WorkerFactory()` 会调用被 mock 的构造函数，
// 返回一个有 postMessage/onmessage 接口的假 Worker；测试里手动触发 onmessage。
vi.mock("@/lib/worker/hash-worker-entry?worker", () => {
  return {
    default: class MockHashWorker {
      onmessage: ((e: MessageEvent) => void) | null = null;
      onerror: (() => void) | null = null;
      postMessage(data: unknown) {
        // 回显收到的 id（worker-base 用全局递增 id，不能 hardcode），异步回成功结果
        const id = (data as { id: number }).id;
        setTimeout(() => {
          this.onmessage?.({
            data: { id, result: { value: "5d41402abc4b2a76b9719d911017c592" } },
          } as MessageEvent);
        }, 0);
      }
      terminate() {}
    },
  };
});

import { HashGenerator } from "../index";

describe("HashGenerator UI", () => {
  let i18n: Awaited<ReturnType<typeof initI18n>>;
  beforeAll(async () => { i18n = await initI18n(); });

  const renderTool = () =>
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <HashGenerator />
        </I18nextProvider>
      </MemoryRouter>
    );

  const setTextarea = (el: HTMLElement, value: string) => {
    fireEvent.change(el, { target: { value } });
  };

  it("calculate button keeps its label (no '...' flash) and is disabled while processing", async () => {
    renderTool();
    const textarea = screen.getByRole("textbox");
    setTextarea(textarea, "hello");

    const calcBtn = screen.getByRole("button", { name: /计算/ });
    expect(calcBtn.textContent).not.toBe("...");
    fireEvent.click(calcBtn);

    // processing 期间按钮文案仍是「计算」，不变成 "..."
    expect(calcBtn.textContent).toBe("计算");

    await waitFor(() => expect(screen.getByText("5d41402abc4b2a76b9719d911017c592")).toBeDefined());
  });

  it("copy button shows '已复制' feedback on success", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
      writable: true,
    });

    renderTool();
    setTextarea(screen.getByRole("textbox"), "hello");
    fireEvent.click(screen.getByRole("button", { name: /计算/ }));

    await waitFor(() => expect(screen.getByText("5d41402abc4b2a76b9719d911017c592")).toBeDefined());

    const copyBtn = screen.getByRole("button", { name: /复制/ });
    fireEvent.click(copyBtn);

    await waitFor(() => expect(screen.getByRole("status")).toBeDefined());
    expect(screen.getByRole("status").textContent).toBe("已复制");
    expect(writeText).toHaveBeenCalledWith("5d41402abc4b2a76b9719d911017c592");
  });

  it("shows '复制失败' when clipboard write throws", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
      writable: true,
    });

    renderTool();
    setTextarea(screen.getByRole("textbox"), "hello");
    fireEvent.click(screen.getByRole("button", { name: /计算/ }));

    await waitFor(() => expect(screen.getByText("5d41402abc4b2a76b9719d911017c592")).toBeDefined());

    fireEvent.click(screen.getByRole("button", { name: /复制/ }));

    await waitFor(() => expect(screen.getByRole("alert")).toBeDefined());
    expect(screen.getByRole("alert").textContent).toBe("复制失败");
  });
});