import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

// Astro config runs before Vite loads .env; production also uses this file.
const envFile = new URL("./.env", import.meta.url);
if (existsSync(envFile)) loadEnvFile(envFile);

export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  publicDir: "../public",
  // Keep the blog's Tailwind 3 PostCSS config out of EmDash's bundled admin CSS.
  vite: { css: { postcss: { plugins: [] } } },
  integrations: [
    react(),
    emdash({
      database: sqlite({ url: process.env.EMDASH_DATABASE_URL || "file:./data.db" }),
      storage: local({
        directory: process.env.EMDASH_UPLOADS_DIR || "./uploads",
        baseUrl: "/_emdash/api/media/file",
      }),
      // The public Next.js origin when /_emdash is proxied through ReLog.
      siteUrl: process.env.EMDASH_SITE_URL,
      mcp: false,
    }),
  ],
  devToolbar: { enabled: false },
});
