import { TextDecoder, TextEncoder } from "util";

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock crypto.subtle for password hashing tests
Object.defineProperty(global, "crypto", {
  value: {
    subtle: {
      digest: jest
        .fn()
        .mockImplementation((algorithm: string, data: Uint8Array) => {
          // Create a different hash based on input data to make verification work
          const hash = new ArrayBuffer(32);
          const view = new Uint8Array(hash);
          const dataStr = Array.from(data).join("");
          const hashValue = dataStr
            .split("")
            .reduce((acc, char) => acc + char.charCodeAt(0), 0);
          for (let i = 0; i < 32; i++) {
            view[i] = (hashValue + i) % 256;
          }
          return Promise.resolve(hash);
        }),
    },
    getRandomValues: jest.fn().mockReturnValue(new Uint8Array(16)),
  },
});

// Mock Request and Response for API route tests
global.Request = global.Request || class MockRequest {};
global.Response = global.Response || class MockResponse {};
global.fetch = global.fetch || jest.fn();
