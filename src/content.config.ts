import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const newsletterCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/newsletter" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string(),
    issueNumber: z.string(),
    author: z.string().default('theinfra staff'),
    tags: z.array(z.string()).optional()
  })
});

const podcastCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/podcast" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string(),
    episodeNumber: z.string(),
    duration: z.string(),
    audioUrl: z.string(),
    tags: z.array(z.string()).optional()
  })
});

export const collections = {
  'newsletter': newsletterCollection,
  'podcast': podcastCollection
};
