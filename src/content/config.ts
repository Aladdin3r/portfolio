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
    /* Cards used to be discipline + title + image + arrow, which answers
       none of the three questions someone actually has. */
    /** What it is, in one line. */
    summary: z.string().optional(),
    /** What she owned on it. */
    role: z.string().optional(),
    /** What happened — shipped, presented, launched. */
    outcome: z.string().optional(),
    /** Year or range, shown on the card. */
    year: z.string().optional(),
  }),
});

export const collections = { projects };
