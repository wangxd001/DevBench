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

export function createWorker(
  workerFactory: () => Worker,
): WorkerManager {
  let worker: Worker | null = null;
  let pendingResolve: ((value: unknown) => void) | null = null;
  let pendingReject: ((reason: Error) => void) | null = null;
  let currentTaskId: number | null = null;
  let cancelled = false;

  function getWorker(): Worker {
    if (!worker) {
      worker = workerFactory();
      worker.onmessage = (event: MessageEvent) => {
        const { id, result, error } = event.data as { id: number; result?: unknown; error?: string };
        if (id !== currentTaskId) return; // 旧结果不覆盖
        if (error) {
          pendingReject?.(new Error(error));
        } else {
          pendingResolve?.(result);
        }
        currentTaskId = null;
        pendingResolve = null;
        pendingReject = null;
      };
      worker.onerror = () => {
        pendingReject?.(new Error("Worker error"));
        currentTaskId = null;
        pendingResolve = null;
        pendingReject = null;
      };
    }
    return worker;
  }

  return {
    execute(input: unknown, timeoutMs = 5000): Promise<unknown> {
      cancelled = false;
      const id = ++taskId;
      currentTaskId = id;

      return new Promise((resolve, reject) => {
        pendingResolve = resolve;
        pendingReject = reject;

        const w = getWorker();
        w.postMessage({ id, input });

        const timer = setTimeout(() => {
          const task = currentTaskId;
          if (task === id) {
            w.terminate();
            worker = null;
            reject(new Error("Worker timeout"));
            pendingResolve = null;
            pendingReject = null;
          }
        }, timeoutMs);

        // 存储 timer 以便 cancel 时清除
        w.onmessage = (event: MessageEvent) => {
          clearTimeout(timer);
          const { id: msgId, result, error } = event.data as { id: number; result?: unknown; error?: string };
          if (msgId === id && !cancelled) {
            if (error) reject(new Error(error));
            else resolve(result);
          }
        };
      });
    },

    cancel(): void {
      cancelled = true;
      if (worker) {
        worker.terminate();
        worker = null;
      }
      pendingReject?.(new Error("Cancelled"));
      pendingResolve = null;
      pendingReject = null;
      currentTaskId = null;
    },

    terminate(): void {
      if (worker) {
        worker.terminate();
        worker = null;
      }
    },
  };
}
