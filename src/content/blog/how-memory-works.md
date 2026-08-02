---
title: 'Memory: The Bottleneck Everyone Forgets'
description: 'A bit of RAM is a capacitor so leaky it forgets in milliseconds. Understanding what it takes to keep it remembering explains why AI is limited far less by arithmetic than by moving numbers around.'
pubDate: 2026-08-06
series:
  name: 'Inside the Machine'
  part: 3
---

Ask why AI needs expensive hardware and you'll hear about compute — trillions of operations per second, arithmetic on an industrial scale. [The last post](/blog/how-gpus-work/) was about exactly that machinery.

Now the correction: **most of the time, that machinery is idle, waiting.** When you run a language model on your own machine, the arithmetic units are largely twiddling their thumbs. The thing you're actually waiting on is memory — not because it's slow in any absolute sense, but because compute got so much faster that everything else became the problem.

This post is about why, and it starts with something physically absurd.

## A bit is a leaking bucket

Main memory — the DRAM in your machine — stores each bit as **charge on a tiny capacitor**, guarded by a single transistor. Charged is a 1, empty is a 0. One transistor, one capacitor, per bit. That brutal minimalism is why you can buy billions of them for pocket change.

The capacitor is minuscule — a few tens of femtofarads, which is to say it holds a laughably small dab of charge. And like any real capacitor it leaks. Left alone, a DRAM cell forgets what it was holding in a few dozen milliseconds.

So the memory controller reads every row and writes it straight back, continuously, thousands of times per second, forever. That's the **refresh cycle**, and it's not an optimization or a failure mode — it's the fundamental operating principle. Your computer's memory is a few billion leaking buckets and a frantic bailing operation that never stops. Cut the power and it forgets everything in under a second, which is exactly what "volatile" means.

It gets better. Reading a DRAM cell **destroys** it: opening the transistor dumps the capacitor's charge onto a shared wire, where an amplifier decides whether it saw "some" or "none." The act of asking drains the answer, so every read is followed by a write to put it back.

That's the substrate the entire computing world sits on.

Compare that to **SRAM** — the memory used for the caches inside a CPU or GPU. It stores each bit in a little latch of six transistors that actively holds its own state. No leaking, no refresh, and *far* faster. It also costs six transistors and considerable area per bit, versus one-and-a-bit. That's the whole tradeoff: SRAM is fast and expensive, DRAM is dense and cheap, and every memory system ever built is an argument about how to blend them.

## The hierarchy, in human time

That argument produces a pyramid. Small, fast, expensive memory close to the arithmetic; big, slow, cheap memory further out. The numbers are hard to feel in nanoseconds, so here they are scaled up — with a register access stretched to one second:

<figure>
	<img src="/diagrams/memory-hierarchy.svg" alt="Log-scaled bar chart of memory access latency: registers 0.3 nanoseconds, L1 cache 1 nanosecond, L2 4 nanoseconds, L3 15 nanoseconds, then a marked boundary where data leaves the chip, followed by main memory at 90 nanoseconds and an SSD at 80 microseconds, with each scaled to human time" width="640" height="300" loading="lazy" />
	<figcaption>Grab something from a register and it's in your hand. Go to main memory and you've left for a five-minute errand. The dashed line is where the data stops being on the chip.</figcaption>
</figure>

The important feature isn't the top of the chart, it's the **cliff** — the dashed line. Everything above it is on the same piece of silicon as the arithmetic. Everything below crosses a physical wire, out through a package, along a circuit board, into a different chip and back. That trip is the single most expensive routine event in computing, and roughly all of computer architecture is scheming to avoid it.

The scheming works because of **locality** — real programs reuse the same data repeatedly, and touch neighbours of what they just touched. Caches bet on that, and usually win. The whole pyramid is an elaborate machine for making main memory *seem* fast by rarely actually going there.

## The wall

Here's the historical accident that made memory the story.

For decades, processing speed improved at a ferocious pace. DRAM improved too — enormously in capacity, respectably in bandwidth, and *barely at all in latency*. A memory access took roughly a hundred nanoseconds in the 1990s. It takes roughly eighty now.

Meanwhile the compute on the other end of that wire got thousands of times faster. So the same fixed delay went from costing a handful of wasted cycles to costing hundreds. Architects named this the **memory wall** back in the mid-nineties and it has only steepened since. Processors didn't outrun memory's *speed* so much as they outran its ability to keep up with them.

And that reframes the whole design problem: a modern chip is not primarily an arithmetic machine that occasionally needs data. It's a **data-movement machine** that happens to do arithmetic when the operands arrive.

## Bandwidth is not latency

One distinction does most of the work in the rest of this post.

- **Latency** is how long you wait for the first byte. A round trip.
- **Bandwidth** is how many bytes per second you can sustain once things are flowing.

They're independent. A cargo ship has appalling latency and magnificent bandwidth. Latency is set by physics and protocol overhead and is stubbornly hard to improve. Bandwidth is set by how many wires you have and how fast you clock them — and you can always add wires.

For most everyday software, latency is what hurts: a program chases a pointer, waits, chases another. But for the workload in question here, the access pattern is enormous, predictable, sequential reads — and for that, **bandwidth is everything.** You can hide latency if you know what you'll need next. You cannot conjure bandwidth you don't have.

Which is why the memory attached to an AI accelerator looks nothing like the sticks in a desktop. **HBM** — High Bandwidth Memory — stacks DRAM dies vertically, drills connections straight down through the silicon, and sits on the same package as the processor, millimetres away. Instead of a 64-bit channel it presents a bus over a thousand bits wide. A good desktop manages perhaps 100 GB/s. An AI accelerator with HBM is in the multiple-terabytes-per-second range — call it thirty times more. HBM is also expensive, hot, and manufacturing-constrained, which is a large part of why these chips cost what they do. You are mostly buying memory bandwidth.

## The calculation that explains everything

Now the payoff. Here's why a language model generates text at the speed it does.

A model's weights are just numbers in memory. To produce **one token**, a dense model must read **every single weight** — each one gets multiplied by something and contributes to the result. Not some of them. All of them, once, per token.

So take a 70-billion-parameter model at 2 bytes per weight: **140 GB** that must be pulled out of memory to emit one token. On an accelerator with roughly 3 TB/s of bandwidth:

> 140 GB ÷ 3,000 GB/s ≈ **47 milliseconds per token** — about 21 tokens per second, and that's a hard ceiling.

Notice what's absent from that calculation: the arithmetic. It doesn't appear, because it isn't the constraint. As [the last post](/blog/how-gpus-work/) put it, generating a token is a matrix-times-vector operation — each weight is loaded, used for a single multiply-add, and discarded. About one operation per byte fetched, on hardware that wants a hundred. The arithmetic units are idle better than 90% of the time, waiting on the bus.

Run the same sum on a 7B model and you get ~14 GB per token, ~5 ms, a couple of hundred tokens per second. **That ratio — not any difference in "thinking" — is why the small model feels fast.**

Three consequences fall straight out of this, and together they explain most of what's confusing about running models:

**Why VRAM is the constraint.** If the weights don't fit in the accelerator's memory, they have to stream in from system RAM or disk on every single token, across a bus that's an order of magnitude slower. Performance doesn't degrade gracefully — it collapses. "Does it fit?" is a more important question than "how fast is the chip?"

**Why quantization is such a big win.** Squeezing weights from 16 bits to 8 or 4 doesn't merely save space. It halves or quarters *the bytes you must move per token*, and in a bandwidth-bound regime that translates almost directly into speed. Quantization is a memory optimization that shows up disguised as a compute one.

**Why the context window costs you.** Beyond the weights, a model caches intermediate results for every token it has already seen — the **KV cache** — so it doesn't recompute the whole conversation each time. That cache grows linearly with conversation length, consumes precious memory the weights were using, and must itself be read every token. A long conversation is slower than a short one for a straightforwardly physical reason: there's more to haul.

## The fix, and why your chatbot is fast

If reading 140 GB gets you exactly one token, the economics look grim. The escape is one idea: **read the weights once, use them for many things at the same time.**

Serve fifty users concurrently and you can load each weight once and multiply it against fifty different inputs while it's sitting there. The memory traffic barely changes; the useful work multiplies by fifty. The matrix-times-*vector* becomes a matrix-times-*matrix* — and that, as we saw, is the operation GPUs are actually good at. **Batching converts a memory-bound problem into a compute-bound one**, which is precisely the conversion you want, because compute is the thing you have in abundance.

This is why a hosted model answering thousands of people at once is dramatically more efficient per token than the same model on your desk answering only you. Alone, you pay the full 140 GB to get your one token. Shared, everyone splits the bill.

---

Every bit is a leaking bucket, refreshed thousands of times a second. Stack billions of them, wire them a millimetre from the arithmetic, and you can move terabytes per second — and it is *still* the slow part, because the compute on the other end grew faster than the wire ever could.

The lesson generalizes past AI. Once arithmetic became nearly free, the interesting engineering stopped being about calculating and started being about **moving** — which is why the most valuable chips on the planet are, in the end, mostly elaborate plumbing for numbers.
