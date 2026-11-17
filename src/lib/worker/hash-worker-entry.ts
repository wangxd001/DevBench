// Worker 入口：Vite 会将此文件打包为独立 Worker 脚本
// 接收 { id, input: { text, algorithm } }，返回 { id, result }

export interface HashWorkerInput {
  text: string;
  algorithm: string;
}

export interface HashWorkerOutput {
  value: string;
  error?: string;
}

import { computeHash, type HashAlgorithm } from "../../tools/encoding/hash-generator/core";

self.onmessage = (event: MessageEvent) => {
  const { id, input } = event.data as { id: number; input: HashWorkerInput };
  computeHash(input.text, input.algorithm as HashAlgorithm)
    .then((result) => {
      self.postMessage({ id, result });
    })
    .catch((e) => {
      self.postMessage({
        id,
        result: { value: "", error: e instanceof Error ? e.message : String(e) },
      });
    });
};
