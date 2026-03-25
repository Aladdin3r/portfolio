import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tags: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    url: z.string(),
    visible: z.boolean().default(true),
    order: z.number(),
  }),
});

export const collections = { projects };
