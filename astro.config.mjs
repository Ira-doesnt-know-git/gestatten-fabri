import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const deployTarget =
  process.env.DEPLOY_TARGET ||
  (process.env.GITHUB_ACTIONS === "true" ? "github-preview" : "production");

if (!["github-preview", "production"].includes(deployTarget)) {
  throw new Error(`Unknown DEPLOY_TARGET: ${deployTarget}`);
}

const isGitHubPreview = deployTarget === "github-preview";

export default defineConfig({
  site: isGitHubPreview
    ? "https://ira-doesnt-know-git.github.io"
    : "https://gestatten-fabri.de",
  base: isGitHubPreview ? "/gestatten-fabri" : undefined,
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
});
