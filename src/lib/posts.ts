import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** All published posts, newest first. */
export async function allPosts(): Promise<Post[]> {
	return (await getCollection('blog', ({ data }) => !data.draft)).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
	);
}

/** Tag -> posts, sorted by count then name. */
export function tagIndex(posts: Post[]) {
	const map = new Map<string, Post[]>();
	for (const post of posts) {
		for (const tag of post.data.tags) {
			map.set(tag, [...(map.get(tag) ?? []), post]);
		}
	}
	return [...map.entries()]
		.map(([tag, items]) => ({ tag, posts: items, count: items.length }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Series name -> parts in reading order, derived from content. */
export function seriesIndex(posts: Post[]) {
	const map = new Map<string, Post[]>();
	for (const post of posts) {
		const name = post.data.series?.name;
		if (name) map.set(name, [...(map.get(name) ?? []), post]);
	}
	return [...map.entries()]
		.map(([name, items]) => ({
			name,
			posts: items.sort(
				(a, b) => (a.data.series?.part ?? 0) - (b.data.series?.part ?? 0)
			),
		}))
		.sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name));
}

/** Posts sharing the most tags with the given one. */
export function relatedPosts(post: Post, posts: Post[], limit = 3): Post[] {
	const tags = new Set(post.data.tags);
	if (tags.size === 0) return [];
	return posts
		.filter((p) => p.id !== post.id)
		.map((p) => ({
			post: p,
			shared: p.data.tags.filter((t) => tags.has(t)).length,
			// Prefer posts from the same series when tags tie.
			sameSeries: p.data.series?.name && p.data.series.name === post.data.series?.name ? 1 : 0,
		}))
		.filter((x) => x.shared > 0)
		.sort(
			(a, b) =>
				b.shared - a.shared ||
				b.sameSeries - a.sameSeries ||
				b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf()
		)
		.slice(0, limit)
		.map((x) => x.post);
}
