import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['AI & Automation', 'Managed IT', 'Infrastructure', 'Industry News']),
    excerpt: z.string(),
    author: z.string().default('Max Gregori'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
