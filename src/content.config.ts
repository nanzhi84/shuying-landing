import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("树影团队"),
    tags: z.array(z.string()).default([]),
    /** public/ 下的封面路径，如 /covers/frame-exact.svg */
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    draft: z.boolean().default(false),
    readingTime: z.string().optional(),
  }),
});

export const collections = { blog };
