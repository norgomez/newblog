---
title: 'GPUs: How a Graphics Card Ended Up Running the World'
description: 'A GPU is not a faster CPU — it is a chip that gave up on making any single thing fast, in exchange for doing ten thousand things at once. That trade is why AI runs on them.'
pubDate: 2026-08-04
series:
  name: 'Inside the Machine'
  part: 1
---

Twenty years ago a graphics card was a peripheral for gamers. Today it's the most contested industrial commodity on earth, and the reason is a piece of arithmetic that has nothing to do with graphics.

The short version: **a GPU gave up on making any single thing fast, in exchange for doing ten thousand things at once.** That's not a refinement of the CPU. It's the opposite design goal, taken to an extreme — and it happens to be exactly the shape of the math that neural networks are made of.

## Spending the transistor budget

A chip designer gets a budget of transistors and has to spend it. That's the whole design problem, and CPUs and GPUs answer it in opposite directions.

A **CPU** is built for *latency* — finish this one task as soon as physically possible. Most of the code it runs is a sequence of dependent steps: you can't compute step 5 until step 4 lands. So the transistors go into making that single chain fly. Branch predictors guess which way an `if` will go, hundreds of instructions ahead. Out-of-order execution shuffles work to fill idle slots. Enormous caches keep data close. On a modern CPU, the parts that actually *do arithmetic* are a startlingly small slice of the die. Almost everything else exists to keep those few units fed and guessing correctly.

A **GPU** is built for *throughput* — never mind when any individual task finishes, how many can I retire per second? So it deletes almost all of that machinery. Weak branch prediction. No deep out-of-order engine. Small caches. And it spends every transistor it just saved on arithmetic units.

<figure>
	<img src="/diagrams/cpu-vs-gpu.svg" alt="Side-by-side comparison: a CPU with four large cores plus large control logic and cache blocks, versus a GPU with a dense grid of many small arithmetic units and only thin control and cache strips" width="640" height="320" loading="lazy" />
	<figcaption>Same silicon budget, opposite bets. The CPU spends it on being clever about one instruction stream; the GPU spends it on raw arithmetic and shares one control unit across the lot.</figcaption>
</figure>

The scoreboard: a high-end desktop CPU has perhaps 16 cores. A high-end GPU has on the order of **sixteen thousand** arithmetic units. Each one is far dumber and clocked slower than a CPU core. There are just a staggering number of them.

## The catch, which is also the trick

You don't get sixteen thousand independent little computers. That would need sixteen thousand control units, and the control logic is exactly what got deleted to make room.

Instead, the units are yoked together in groups — typically 32 — that must all execute **the same instruction at the same time**, each on its own piece of data. One instruction decoder driving 32 arithmetic units. That's the deal that makes the density possible.

Which means the GPU is only fast if your problem looks like *"do this identical operation to a huge pile of independent numbers."*

Give it that, and it's devastating. Give it a tangle of `if` statements where every element takes a different path, and it falls apart — when the threads in a group disagree about which branch to take, the hardware has to run *both* branches and mask off the units that shouldn't have participated. Divergence is the GPU's version of a stall.

This is why the graphics origin story matters. A million pixels, each shaded by the same program, each independent of its neighbors. That workload didn't just suit the architecture — it *caused* it. The hardware was sculpted around a problem that was already embarrassingly parallel, and then someone noticed what else has that shape.

## Why neural networks fit so well

Here is the thing that ties it together: **a neural network is, almost entirely, matrix multiplication.**

Strip away the terminology and a layer of a network does this — take a list of numbers, multiply it by a big grid of stored numbers (the weights), add them up, apply a simple squashing function, pass it on. That multiply-and-add over a grid is the dominant cost, in training and in inference alike.

And matrix multiplication is the single most GPU-shaped workload ever discovered:

- Every output element is a **dot product** — a pile of multiply-adds.
- Every output element is **independent** of every other. Nothing waits on anything.
- The operation is **identical** for all of them. No branching, no divergence.
- It's **regular** — predictable addresses, marching in step.

That's not "a good fit." That's the exact contract the hardware was built around. When people say AI runs on GPUs, what they mean is that the industry spent thirty years optimizing silicon for shading pixels and accidentally built the perfect matrix-multiply engine.

Chipmakers noticed and stopped leaving it to chance. Modern GPUs carry **tensor cores** — units that don't just multiply two numbers, but chew through a whole small matrix tile of multiply-accumulates as a single instruction. They're useless for general-purpose code. For the one operation that dominates AI, they're worth more than the rest of the chip.

## The precision trick

The other lever is one your [floating point](/blog/floating-point/) intuition already covers.

Scientific computing traditionally uses 32-bit floats: one sign bit, 8 bits of exponent for *range*, 23 bits of mantissa for *precision*. Neural networks turn out not to need anything like that. The weights are approximate, the training is noisy, and being slightly off rarely changes the answer. So the industry started cutting bits.

Halving the bits roughly **doubles** the arithmetic throughput and halves the memory you have to move — and the second of those matters even more than the first, for reasons the next post is entirely about.

The interesting part is *which* bits get cut. There are two competing 16-bit formats, and they split the same 16 bits differently:

| Format | Exponent (range) | Mantissa (precision) | Character |
| ------ | ---------------- | -------------------- | --------- |
| FP32 | 8 bits | 23 bits | The classic |
| FP16 | 5 bits | 10 bits | Precise, but narrow range — values overflow to infinity |
| BF16 | 8 bits | 7 bits | Coarse, but the *same range* as FP32 |

BF16 keeps FP32's full 8-bit exponent and throws away mantissa instead. It's a *less accurate* number that covers the same enormous span of magnitudes — and it turned out that for training, **range matters more than precision**. Gradients that overflow to infinity destroy a training run; gradients that are slightly imprecise just get averaged away over the next thousand steps. Modern training runs largely on BF16, and inference increasingly on 8-bit and smaller.

That's a genuinely unusual thing to discover: an entire industry decided its numbers were *too accurate*, and got faster by making them worse.

## What the GPU is actually waiting for

One last thing, and it's the hinge into the next post.

All those arithmetic units are useless if you can't feed them numbers. Every multiply needs operands, and the operands live in memory. So the honest question about any GPU workload isn't "how many operations does it do" — it's **how many operations does it do per byte it has to fetch.**

Multiply two big matrices together and the answer is excellent: each number you load gets reused across many multiplies, so you do hundreds of operations per byte. The arithmetic units stay busy. That's *training*, and it's genuinely compute-bound.

Multiply a big matrix by a single vector — which is what generating **one token** of text does — and the answer is dismal. Every weight is loaded, used for exactly one multiply-add, and thrown away. Roughly one operation per byte fetched, against hardware that needs a hundred or more to break even.

At that point the sixteen thousand arithmetic units aren't the constraint at all. They're sitting idle, waiting on memory, which is the subject of [part 2](/blog/how-memory-works/).

---

One trick — do the same thing to an enormous pile of numbers at once — and thirty years of arranging silicon around it. The GPU didn't get repurposed for AI so much as AI turned out to be the workload it had been quietly preparing for the entire time.
