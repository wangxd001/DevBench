import '@testing-library/jest-dom/vitest';

// jsdom does not implement Web Crypto API (crypto.subtle).
// Polyfill from Node's webcrypto so that hash-generator tests can run in jsdom env.
import { webcrypto } from 'crypto';
if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    writable: true,
    configurable: true,
  });
}
