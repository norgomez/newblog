// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
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
