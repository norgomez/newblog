# Engineering Notes

A personal engineering blog built with [Astro](https://astro.build). Minimal, typographic, fast: posts are Markdown files, pages ship zero JavaScript (except the ~10-line theme toggle), and code blocks are highlighted at build time with Shiki.

## Commands

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Start the dev server at `localhost:4321`     |
| `npm run build`   | Build the production site to `./dist/`       |
| `npm run preview` | Preview the production build locally         |

## Writing a post

Add a Markdown file to `src/content/blog/`. The filename becomes the URL slug (`my-post.md` → `/blog/my-post/`).

```markdown
---
title: 'My Post Title'
description: 'One-sentence summary shown on the index and as the post lede.'
pubDate: 2026-07-15
series:                        # optional — shows a "Part N of M" box with links
  name: 'Maker Basics'
  part: 7
draft: true                    # optional — hides the post until removed
---

Your post content here. Code blocks get syntax highlighting automatically.
```

## Making it yours

- **Site title & description** — edit `src/consts.ts`
- **About page** — edit `src/pages/about.astro`
- **Colors, fonts, spacing** — design tokens at the top of `src/styles/global.css`
- **Code block themes** — `markdown.shikiConfig` in `astro.config.mjs`

## Structure

```
src/
├── components/     Header, Footer, ThemeToggle
├── content/blog/   Posts (Markdown)
├── layouts/        BaseLayout (shell) and PostLayout (article)
├── pages/          index, about, blog/[...slug]
├── styles/         global.css — the whole design system
├── consts.ts       Site title and description
└── content.config.ts   Post frontmatter schema
```
