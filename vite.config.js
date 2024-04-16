import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./setupTests.js"],
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});
