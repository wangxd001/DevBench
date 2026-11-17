import { regexWorkerHandler, type RegexWorkerInput, type RegexWorkerOutput } from "./regex-worker";

// Worker 入口：接收 { id, input }，返回 { id, result }
self.onmessage = (event: MessageEvent) => {
  const { id, input } = event.data as { id: number; input: RegexWorkerInput };
  const result: RegexWorkerOutput = regexWorkerHandler(input);
  (self as unknown as Worker).postMessage({ id, result });
};
