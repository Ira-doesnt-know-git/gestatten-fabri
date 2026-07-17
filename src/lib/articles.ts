import type { CollectionEntry } from "astro:content";

export type Article = CollectionEntry<"articles">;

export function byNewest(a: Article, b: Article) {
  return b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
