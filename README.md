# Gestatten: Fabri

Static Astro rebuild of `gestatten-fabri.de`, intended for GitHub Pages.

## Development

```sh
npm install
npm run dev
```

## Articles

Create Markdown files in `src/content/articles/`. Use the existing article as the frontmatter and formatting template.

Required frontmatter:

```yaml
---
title: "Article title"
description: "Excerpt and SEO description"
publishedAt: 01-01-2026
slug: article-slug
category: beitraege
tags:
  - Storytelling
author: Team
draft: false
---
```

The article is generated at `/<slug>/`. Tags automatically generate archive pages at `/tag/<tag>/`.

Enter `publishedAt` in `dd-mm-yyyy` format.

Set `draft: true` to exclude an article from generated pages, listings, tag archives, and the RSS feed until it is ready to publish.

Store article images alongside the Markdown file or under `src/assets/` and reference them with relative Markdown paths. Avoid root-relative image paths such as `/images/example.jpg`, because they bypass Astro's deployment base path.

## Deployment

The workflow in `.github/workflows/deploy.yml` builds and deploys the site on every push to `main`. Internal links and static assets use Astro's base URL so the same code works at both deployment targets.

In the GitHub repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

### Deployment targets

The deployment target is controlled by the `DEPLOY_TARGET` repository variable under **Settings → Secrets and variables → Actions → Variables**.

- If the variable is absent or set to `github-preview`, GitHub Actions deploys to `https://ira-doesnt-know-git.github.io/gestatten-fabri/`.
- If the variable is set to `production`, GitHub Actions builds for `https://gestatten-fabri.de/` with no repository base path.

Local development defaults to the production-style root path. To run locally with the GitHub Pages base path instead:

```sh
DEPLOY_TARGET=github-preview npm run dev
```

When adding internal links or files from `public/` in Astro components, pass their root-relative path through `withBase()` from `src/lib/urls.ts`.

### Switching to the custom domain

1. Set the `DEPLOY_TARGET` repository variable to `production`.
2. Rerun the **Deploy to GitHub Pages** workflow and verify that it succeeds.
3. Under **Settings → Pages**, set the custom domain to `gestatten-fabri.de`.
4. Point the domain's DNS records to GitHub Pages.
5. Enable **Enforce HTTPS** after GitHub has provisioned the certificate.

`public/CNAME` records the intended production domain, but custom GitHub Actions deployments must also configure the domain under **Settings → Pages**.

## Before production

Replace the clearly marked Datenschutz placeholder in `src/pages/impressum.astro` with legal copy.
