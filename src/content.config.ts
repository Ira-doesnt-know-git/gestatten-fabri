import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const publishedDate = z
  .string()
  .regex(/^\d{2}-\d{2}-\d{4}$/, "Use dd-mm-yyyy, for example 08-12-2025")
  .transform((value, context) => {
    const [day, month, year] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, 12));

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      context.addIssue({ code: "custom", message: "publishedAt is not a valid calendar date" });
      return z.NEVER;
    }

    return date;
  });

const articles = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: publishedDate,
    updatedAt: z.coerce.date().optional(),
    slug: z.string(),
    category: z.string().default("beitraege"),
    tags: z.array(z.string()).default([]),
    author: z.string().default("Team"),
    coverImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
