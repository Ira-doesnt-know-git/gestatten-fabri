import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://gestatten-fabri.de",
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
});
