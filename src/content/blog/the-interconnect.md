---
title: 'The Interconnect: When One Chip Is Not Enough'
description: 'A frontier model does not fit on one accelerator, or ten. Once you spread a computation across thousands of chips, the wires between them stop being plumbing and become the machine.'
pubDate: 2026-08-09
tags: [computing, hardware, ai]
series:
  name: 'Inside the Machine'
  part: 6
---

Everything so far in this series has been about one chip — [the switch it's made of](/blog/what-a-transistor-actually-does/), [how it's arranged](/blog/how-gpus-work/), [what it's waiting on](/blog/how-memory-works/), [what stops it going faster](/blog/why-chips-run-hot/), and [how it's printed](/blog/how-a-chip-gets-made/).

Now the inconvenient fact: for the workload driving all of this, one chip isn't remotely enough.

A large accelerator holds on the order of 100 GB of memory. A frontier model's weights run to hundreds of gigabytes — and *training* one is far worse than storing it, because you also need gradients and optimizer state. With the usual mixed-precision setup that's roughly **16 bytes per parameter**, so a 70-billion-parameter model needs something like **1.1 terabytes** of memory before the first training step. That's a dozen accelerators to hold one model that isn't even especially large by current standards.

So you use many chips. And the moment you do, the interesting engineering leaves the chip entirely and moves into the wires — because [part 4](/blog/why-chips-run-hot/) established the rule that governs everything here: **distance costs time and energy**, and you have just decided to send your data a long way.

## The same ladder, one level up

[Part 3](/blog/how-memory-works/) laid out the memory hierarchy — registers to cache to DRAM, with a cliff where the data leaves the chip. Zoom out one level and the identical shape reappears, with the cliff in a new place.

<figure>
	<img src="/diagrams/interconnect-ladder.svg" alt="A log-scaled bar chart of communication bandwidth against distance: inside the die at microns and tens of terabytes per second, to its own memory at millimetres and about 3 terabytes per second, to the chip beside it at centimetres and about 1 terabyte per second, then a marked boundary where data leaves the server, followed by the next server at metres and about 100 gigabytes per second, and across the hall at hundreds of metres and about 50 gigabytes per second" width="640" height="300" loading="lazy" />
	<figcaption>The same picture as the memory hierarchy, one scale up. The dashed line has moved from the edge of the chip to the edge of the box.</figcaption>
</figure>

Read it and the design constraints write themselves. Talking to a neighbour inside the same server is expensive but survivable. Talking to a different server costs you an order of magnitude, and it's no longer a wire — it's a **network**, with switches, protocols, congestion and queueing. Everything from [how machines talk](/blog/how-machines-talk/) applies, just at absurd speed.

Which produces the central rule of large-scale AI hardware: **keep the chatty things close.** Almost every design decision below is an application of it.

## Even "one chip" isn't one chip

The stitching starts before you leave the package. [Part 5](/blog/how-a-chip-gets-made/) explained why: yield falls exponentially with die area, and on top of that there's a hard ceiling — the **reticle limit**, around 800 mm², the largest area the lithography machine can expose in a single shot. You physically cannot print a bigger contiguous die.

So large processors are increasingly several smaller dies — **chiplets** — bonded onto a shared substrate that carries thousands of very short, very dense connections between them. It's a good trade: much better yield, and the freedom to mix dies made on different processes. But it means the first interconnect problem shows up millimetres from the transistors, and a modern "chip" is really a small network wearing a single lid.

## Three ways to cut up a model

Given many accelerators and one model too big for any of them, you have to split the work. There are three ways, they have very different communication costs, and real systems use all three at once.

| Strategy | What's split | What must cross the wire | Costs |
| -------- | ------------ | ------------------------ | ------ |
| **Data parallel** | The batch | Gradients, once per step | Every chip needs the whole model |
| **Tensor parallel** | Individual weight matrices | Partial results, *inside every layer* | Extremely chatty |
| **Pipeline parallel** | Whole layers | Activations, at stage boundaries | Chips idle in "bubbles" |

**Data parallel** is the simplest: give every accelerator a complete copy of the model and a different slice of the training data. They compute independently — beautifully parallel — and then must agree on the combined gradient before the next step. One synchronisation per step, but the message is the size of the entire model.

**Tensor parallel** splits the matrices themselves: each chip holds a vertical slice of a layer's weights and computes a partial result. Since a partial result isn't an answer, the chips must combine results *within every single layer*, dozens of times per forward pass. This is by far the most communication-hungry option, which is exactly why it's confined to accelerators inside one server, wired with the fastest links available.

**Pipeline parallel** puts different layers on different chips, like stations on an assembly line. Only the activations at each boundary cross the wire — far less data. The cost is idle time: station 4 has nothing to do until stations 1–3 have handed something down. You hide it by keeping many micro-batches in flight, the same way a factory line stays busy.

Real clusters nest these. Tensor parallelism *within* a server where links are fat, pipeline parallelism *across* servers in a rack, data parallelism across the whole fleet. The topology of the machine and the decomposition of the math are designed against each other.

## The operation the whole thing rests on

Data parallelism needs every chip to end up with the *sum* of everyone's gradients. That collective operation is called **all-reduce**, and how you implement it decides whether your cluster scales.

The naive version — everyone sends to one coordinator, which adds it all up and sends the result back — has an obvious flaw: the coordinator's link carries N times the traffic. Add chips and it gets worse, fast.

The fix is the **ring all-reduce**, and it's genuinely elegant. Arrange the chips in a logical ring. Split each chip's gradient into N chunks. Now pass chunks around the ring, each chip adding its own contribution to what it receives before passing it on. After a lap, each chip holds the finished sum for one chunk; after a second lap distributing those, everyone has everything.

The payoff is in the accounting: each chip sends roughly **2× the data size, no matter how many chips there are.** The per-chip cost is constant. That single algorithm is a large part of why training across thousands of accelerators is possible at all, and it's the sort of result that looks obvious only after someone has shown it to you.

Getting it to run at full speed is a topology problem — you want a network where any half of the machine can talk to the other half at full rate, which is why AI clusters are wired in fat, expensive, deliberately over-provisioned trees rather than the oversubscribed networks that suit ordinary datacenter traffic.

## Where it stops scaling

Every one of these strategies has the same ceiling. The computation you're splitting gets smaller as you add chips. **The communication doesn't.**

Split a job across twice as many accelerators and each does half the work — but the gradients that must be exchanged are the same size as before. Keep going and you reach the point where the chips spend more time talking than computing, and adding hardware makes the job slower. That's the wall every large training run is engineered against, and it's why the interconnect budget in a modern cluster is a serious fraction of the total cost. You aren't buying accelerators; you're buying a machine whose wiring happens to have accelerators attached.

Serving models has a related but distinct problem. Here it's **latency**, not bandwidth, that bites. If a model is spread across eight chips with tensor parallelism, then generating a single token means those eight chips synchronise at every layer — dozens of round trips, all inside the few tens of milliseconds a user is willing to wait. The interconnect's *delay* lands directly in the per-token budget from [part 3](/blog/how-memory-works/). It's the strongest practical argument for making models small enough to fit on one chip: not the arithmetic saved, but the conversations avoided.

---

The unit of computing has kept getting larger. It was a chip, then a board, then a server. For this workload it's now a rack, and increasingly a building — tens of thousands of accelerators wired together tightly enough to be programmed, some of the time, as though they were one enormous processor.

Which brings the series full circle. We started with [a single switch](/blog/what-a-transistor-actually-does/) throwing a field across a few atoms of glass, and ended with a warehouse of them coordinating across hundreds of metres of fibre. The same rule held at every scale in between: computing is cheap, and **moving the answer to where it's needed is what you actually pay for.**
