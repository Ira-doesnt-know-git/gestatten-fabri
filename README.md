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

## Deployment

The workflow in `.github/workflows/deploy.yml` builds and deploys the site on every push to `main`.

In the GitHub repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The custom domain is declared in `public/CNAME`.

## Before production

Replace the clearly marked Datenschutz placeholder in `src/pages/impressum.astro` with legal copy.
