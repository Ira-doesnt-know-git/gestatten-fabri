import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { byNewest } from "../lib/articles";
import { withBase } from "../lib/urls";

export async function GET(context: { site: URL }) {
  const articles = (await getCollection("articles", ({ data }) => !data.draft)).sort(byNewest);
  const site = new URL(withBase("/"), context.site);

  return rss({
    title: "Gestatten: Fabri",
    description: "Artikel über Film, Serie, Storytelling und Medien.",
    site,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.publishedAt,
      link: withBase(`/${article.data.slug}/`),
    })),
  });
}
