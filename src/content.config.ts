import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		series: z
			.object({
				name: z.string(),
				part: z.number(),
			})
			.optional(),
		project: z
			.object({
				cover: z.string(),
				blurb: z.string(),
				stack: z.array(z.string()).default([]),
			})
			.optional(),
		draft: z.boolean().default(false),
	}),
});

export const collections = { blog };
