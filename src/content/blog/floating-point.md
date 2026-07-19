---
title: 'Why 0.1 + 0.2 ≠ 0.3 (and Why Your Computer Is Right)'
description: 'Floating point is not broken — it is a brilliant compromise that every programmer eventually has to make peace with.'
pubDate: 2026-07-19
---

Open any JavaScript console and type the most famous arithmetic bug that isn't one:

```js
> 0.1 + 0.2
0.30000000000000004
```

Python, Java, C, Rust — same answer. This isn't a language quirk; it's the IEEE 754 floating-point standard, which nearly every computer on Earth implements in silicon. And once you understand *why* it happens, a whole family of mysterious bugs becomes predictable.

## The root cause: 0.1 doesn't exist in binary

Some fractions can't be written exactly in some bases. You already know one: 1/3 in decimal is 0.3333… forever — no finite number of digits nails it.

Binary has the same problem with different victims. A binary fraction can only exactly represent numbers built from halves: 0.5, 0.25, 0.75, 0.625… **One tenth is not one of them.** In binary, 0.1 is:

```text
0.0001100110011001100110011… (the "0011" repeats forever)
```

Your computer stores 64 bits of that infinite tail and rounds the rest. So the moment you type `0.1`, before any math happens, the value in memory is already a near-miss: 0.1000000000000000055511… Add two near-misses and the rounding residue occasionally becomes visible. That's the whole mystery — `0.1 + 0.2` is `wrong₁ + wrong₂ = visibly wrong₃`.

## What a float actually is

IEEE 754 is scientific notation in base 2. A 64-bit double splits into three fields:

| Field | Bits | Role |
| ----- | ---- | ---- |
| Sign | 1 | Positive or negative |
| Exponent | 11 | Where the point sits (the magnitude) |
| Mantissa | 52 | The significant digits |

It's the same idea as writing 6.022 × 10²³ — a fixed budget of significant digits, slid up or down by an exponent. Which leads to the property that explains almost every float bug in the wild:

> Floats are not evenly spaced. There are as many floats between 1 and 2 as between 1,048,576 and 2,097,152. The number line gets sparser as you go up — precision is a percentage, not an amount.

Near 1.0, adjacent doubles are about 0.0000000000000002 apart. Near 10¹⁶, adjacent doubles are **2 apart** — whole odd numbers stop existing:

```js
> 10000000000000001
10000000000000000
> 9007199254740992 + 1
9007199254740992          // adding 1 does nothing
```

That last number, 2⁵³, is why JavaScript has `Number.MAX_SAFE_INTEGER` — beyond it, the gaps between floats exceed 1 and integers silently merge.

## The rules of self-defense

Fifty years of floating-point scar tissue condenses to four habits:

1. **Never compare floats with `==`.** Compare against a tolerance instead: `Math.abs(a - b) < 1e-9`. Two mathematically equal expressions can round differently along the way.
2. **Never store money as floats.** Ten cents doesn't exist in binary, and finance departments frown on vanishing pennies. Store integer cents (`1050`, not `10.50`), or use a decimal type.
3. **Beware subtracting nearly equal numbers.** `(a + b) - a` when `b` is tiny can wipe out every significant digit of `b` — the classic *catastrophic cancellation*.
4. **Sum small-to-large when it matters.** Adding a tiny number to a huge running total rounds the tiny one away; sorting first (or using compensated summation) preserves it.

## Why not just fix it?

Because the compromise is spectacular. In 64 bits — the width of one CPU register — a double spans from 10⁻³⁰⁸ to 10³⁰⁸ with ~16 significant digits, and your processor adds two of them in a fraction of a nanosecond. Exact decimal arithmetic exists (Python's `decimal`, SQL's `NUMERIC`) and it's the right tool for invoices — but it's software, ten to a hundred times slower, which is why the fast hardware path is the default.

Floating point isn't broken math. It's engineering: a fixed budget of bits spent to cover an absurd range at ferocious speed, with the rounding error documented and bounded. The computer did exactly what it promised — it's the promise that's worth reading.
