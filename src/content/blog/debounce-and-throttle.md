---
title: 'Debounce and Throttle, from First Principles'
description: 'Two tiny functions that solve the same problem in opposite ways — and how to know which one you need.'
pubDate: 2026-07-08
---

Every frontend engineer eventually meets the same problem: an event fires far more often than you want to respond to it. A search box fires `input` on every keystroke. A window fires `resize` dozens of times per second while the user drags. Responding to every single event is wasteful at best and a performance bug at worst.

Debounce and throttle are the two classic answers. They're often mentioned in the same breath, but they make opposite choices about *which* events survive.

## The problem, concretely

Say we call an API as the user types:

```ts
searchInput.addEventListener('input', async (event) => {
	const results = await searchApi(event.target.value);
	renderResults(results);
});
```

Typing "debounce" fires eight requests, seven of which we throw away. Worse, responses can arrive out of order, so stale results might overwrite fresh ones. We need to *rate-limit our reaction* to the event stream.

## Debounce: wait for silence

Debounce says: **don't do anything until the events stop coming.** Each new event resets a timer; only when the stream goes quiet for a full delay does the function actually run.

```ts
function debounce<T extends (...args: never[]) => void>(
	fn: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timer: ReturnType<typeof setTimeout>;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), delay);
	};
}

const search = debounce((query: string) => searchApi(query), 300);
```

The mental model: an elevator door. Every time someone walks in, the door timer resets. The elevator only moves once people *stop* arriving.

> Debounce collapses a burst of events into a single call at the end. If the burst never ends, the function never runs — that's the property to watch out for.

## Throttle: at most once per interval

Throttle says: **run now, then ignore everything for a while.** It guarantees the function runs at a steady maximum rate no matter how fast events arrive.

```ts
function throttle<T extends (...args: never[]) => void>(
	fn: T,
	interval: number
): (...args: Parameters<T>) => void {
	let ready = true;
	return (...args) => {
		if (!ready) return;
		ready = false;
		fn(...args);
		setTimeout(() => {
			ready = true;
		}, interval);
	};
}

const onScroll = throttle(() => updateProgressBar(), 100);
```

The mental model here is a camera with a flash: press the button as often as you like, it fires at most once per recharge.

## Which one do you need?

- **Debounce** when only the *final* state matters: search-as-you-type, form validation, auto-save, resize handlers that recompute layout.
- **Throttle** when *intermediate* updates matter: scroll progress, drag positions, analytics pings, game input.

A useful test: if the user held the event down forever, should your function run periodically (throttle) or never (debounce)?

---

Both implementations above fit in ten lines, and writing them yourself once is the fastest way to stop confusing them. In production code you'll likely reach for a library version with leading/trailing-edge options — but now those options will actually mean something.
