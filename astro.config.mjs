// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/consts.ts';

// https://astro.build/config
export default defineConfig({
	// Required for canonical URLs, RSS, the sitemap, and social cards.
	// Set the real domain in src/consts.ts.
	site: SITE_URL,
	integrations: [sitemap()],
	markdown: {
		shikiConfig: {
			// Dual themes: light is the default; dark applies via CSS when
			// [data-theme="dark"] is set on <html> (see global.css)
			themes: {
				light: 'github-light',
				dark: 'github-dark-dimmed',
			},
		},
	},
});
