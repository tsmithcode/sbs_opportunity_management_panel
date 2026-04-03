import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import path from "path";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const githubPagesBase =
  process.env.GITHUB_ACTIONS === "true" && repositoryName ? `/${repositoryName}/` : "/";

export default defineConfig({
  base: githubPagesBase,
  build: {
    sourcemap: true, // Required for Sentry source map upload
  },
  plugins: [
    react(),
    // Only active when SENTRY_AUTH_TOKEN is set (CI/prod builds)
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
      silent: true,
    }),
  ],
  resolve: {
    alias: {
      "@monyawn/conversation-adapters": path.resolve(
        __dirname,
        "./packages/conversation-adapters/src",
      ),
      "@monyawn/conversation-core": path.resolve(__dirname, "./packages/conversation-core/src"),
      "@monyawn/conversation-devtools": path.resolve(
        __dirname,
        "./packages/conversation-devtools/src",
      ),
      "@monyawn/conversation-react": path.resolve(__dirname, "./packages/conversation-react/src"),
      "@monyawn/conversation-schema": path.resolve(__dirname, "./packages/conversation-schema/src"),
    },
  },
});
