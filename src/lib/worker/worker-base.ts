export interface WorkerTask {
  id: number;
  input: unknown;
  timeoutMs: number;
}

export interface WorkerManager {
  execute(input: unknown, timeoutMs?: number): Promise<unknown>;
  cancel(): void;
  terminate(): void;
}

let taskId = 0;

/**
 * WorkerManager：每个任务使用独立 Worker。
 * 超时/取消/终止后 Worker 不复用，避免旧任务残留结果覆盖新结果。
 * 结果通过 task.id 校验，仅接受当前任务的消息。
 */
export function createWorker(
  workerFactory: () => Worker,
): WorkerManager {
  let activeWorker: Worker | null = null;
  let pendingReject: ((reason: Error) => void) | null = null;

  return {
    execute(input: unknown, timeoutMs = 5000): Promise<unknown> {
      const id = ++taskId;

      return new Promise((resolve, reject) => {
        pendingReject = reject;

        const w = workerFactory();
        activeWorker = w;
        let settled = false;

        function cleanup(): void {
          clearTimeout(timer);
          w.terminate();
          if (activeWorker === w) {
            activeWorker = null;
            pendingReject = null;
          }
        }

        w.onmessage = (event: MessageEvent) => {
          const { id: msgId, result, error } = event.data as { id: number; result?: unknown; error?: string };
          if (msgId !== id || settled) return; // 旧结果不覆盖
          settled = true;
          cleanup();
          if (error) reject(new Error(error));
          else resolve(result);
        };

        w.onerror = () => {
          if (settled) return;
          settled = true;
          cleanup();
          reject(new Error("Worker error"));
        };

        const timer = setTimeout(() => {
          if (settled) return;
          settled = true;
          cleanup();
          reject(new Error("Worker timeout"));
        }, timeoutMs);

        w.postMessage({ id, input });
      });
    },

    cancel(): void {
      const w = activeWorker;
      if (w) {
        w.terminate();
        activeWorker = null;
      }
      pendingReject?.(new Error("Cancelled"));
      pendingReject = null;
    },

    terminate(): void {
      const w = activeWorker;
      if (w) w.terminate();
      activeWorker = null;
      pendingReject = null;
    },
  };
}
