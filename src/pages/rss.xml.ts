import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { byNewest } from "../lib/articles";

export async function GET(context: { site: URL }) {
  const articles = (await getCollection("articles", ({ data }) => !data.draft)).sort(byNewest);

  return rss({
    title: "Gestatten: Fabri",
    description: "Artikel über Film, Serie, Storytelling und Medien.",
    site: context.site,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.publishedAt,
      link: `/${article.data.slug}/`,
    })),
  });
}
