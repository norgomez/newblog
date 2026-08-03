---
title: 'What a Transistor Actually Does'
description: 'A switch with no moving parts, controlled by a voltage instead of a finger. Everything else — logic, memory, arithmetic, the entire machine — is that one component repeated a hundred billion times.'
pubDate: 2026-08-04
tags: [electronics, computing, hardware]
series:
  name: 'Inside the Machine'
  part: 1
---

Every chip in your life is made of one component. Not mostly — essentially entirely. The arithmetic units, the caches, the memory cells, the control logic: all of it is the same part, wired into different shapes and repeated until the numbers stop making sense.

A modern processor has on the order of **a hundred billion transistors** on a piece of silicon the size of a fingernail. That's more transistors on one chip than there are stars in the Milky Way, manufactured for a few hundred dollars, with essentially every one of them working.

So it's worth knowing what the thing actually does. The answer is almost disappointingly small: **a transistor is a switch that's operated by a voltage instead of a finger.**

That's it. Everything in this series is built on that sentence.

## A switch you flip with electricity

A light switch has three relevant parts: two contacts and something that connects them. Your finger provides the control.

A transistor has three terminals too. Two of them — the **source** and the **drain** — are the contacts that current might flow between. The third is the **gate**, and it's the control. Put a voltage on the gate and current can flow from source to drain. Remove it and the path shuts off.

The trick is *how* the gate does it, and it's genuinely clever.

<figure>
	<img src="/diagrams/transistor-switch.svg" alt="Left: a cross-section of a MOSFET showing source and drain regions in a silicon body, with an insulated gate above and a dashed conducting channel forming between them. Right: two such switches stacked between a 1 rail and a 0 rail, one conducting when the input is 0 and the other when the input is 1, producing an output that is always the opposite of the input" width="640" height="320" loading="lazy" />
	<figcaption>One transistor is a voltage-operated switch. Two of them, wired so exactly one is ever on, is a NOT gate — and from NOT gates you can build everything else.</figcaption>
</figure>

The gate sits on top of the silicon, separated from it by an **insulating layer** — a whisker of glass a few atoms thick. The gate doesn't touch the silicon. No current flows into it. It's electrically isolated from the thing it controls.

What it does instead is make an electric field. Put a positive voltage on the gate and that field reaches down through the insulator and yanks electrons in the silicon underneath toward the surface. Enough of them gather that a thin conducting **channel** forms, bridging source and drain. Current can cross. Take the voltage away and the electrons disperse, the channel evaporates, and the bridge is gone.

It's a switch made by summoning and dismissing a wire.

That's what the "field effect" in *field-effect transistor* means, and the full name — MOSFET, for metal-oxide-semiconductor field-effect transistor — is just the sandwich read out loud: a metal gate, an oxide insulator, a semiconductor body.

Three properties fall out of this, and each one is load-bearing:

**It costs almost nothing to hold.** Because the gate is insulated, keeping a transistor on doesn't require a continuous supply of current — just a maintained voltage on what is essentially a tiny capacitor. You pay to *change* the state, not to hold it. That fact is the whole economics of modern chips, and the next post is about what happens when you change state a few billion times a second.

**One output can drive many inputs.** A gate draws essentially no current, so a single transistor's output can control the gates of many others downstream. Without that, you couldn't build anything deep — every layer of logic would sag under the load of the next.

**There's nothing to wear out.** No contacts, no arc, no bounce. A [mechanical switch](/blog/debounce-and-throttle/) chatters for milliseconds when it closes, which is why that post exists at all. A transistor switches cleanly in picoseconds and does it a quintillion times without degrading.

## Why silicon

A metal conducts. Glass doesn't. Neither is useful, because a switch has to be *both*, on command.

Silicon is a **semiconductor**: in its pure form it barely conducts at all, but its conductivity can be tuned — enormously — by adding trace impurities. Salt an area with atoms that carry a spare electron and you get a region with mobile negative charge (**n-type**). Salt it with atoms that are one electron short and you get mobile positive vacancies (**p-type**).

Lay those regions out in the right pattern and you get a material where a chunk of silicon is normally an insulator, but becomes a conductor when a field pulls the right carriers into place. Silicon isn't used because it's the best semiconductor — it isn't. It's used because it's abundant, it can be purified to absurd degrees, and it grows a near-perfect insulating oxide on its own surface when you heat it in oxygen. That last accident of chemistry is why the industry is called Silicon Valley and not Germanium Valley.

## From switch to logic

Now build something. Take two transistors, wired so they're complementary — one conducts when the input is high, the other when the input is low. Stack them between a "1" rail and a "0" rail, tie both gates to the same input, and take the output from the middle (that's the right-hand panel of the diagram above).

Feed in a 1: the bottom switch closes, the top opens, the output is pulled down to 0. Feed in a 0: the reverse — output pulled up to 1. The output is always the opposite of the input. **That's a NOT gate**, and it's two transistors.

This arrangement is called **CMOS** (complementary MOS), and it's the basis of essentially all digital electronics. Its defining virtue is visible in the picture: *exactly one of the two switches is ever on.* There's never a conducting path straight from the 1 rail to the 0 rail, so the circuit draws almost no current while it's sitting still. It only burns energy in the instant it flips, when both are briefly partway. Idle CMOS is nearly free — a property that will matter enormously in [part 4](/blog/why-chips-run-hot/).

Add a couple more transistors in series and parallel and you get AND, OR, NAND. And here's the mathematical punchline: **NAND is universal.** Any logical function whatsoever — any computation that can be described at all — can be built from NAND gates alone. Nothing else is needed. Ever.

So the chain is:

> voltage-controlled switch → logic gate → adder → arithmetic unit → processor

with no conceptual leaps in it. Just arrangement, repeated, at scale.

## From switch to memory

Logic that forgets isn't much use, and memory comes from the same part with one addition: **feedback**.

Wire two NOT gates in a ring — the output of each feeding the input of the other. If the first holds a 1, it forces the second to 0, which forces the first back to 1. The pair is self-consistent. It will sit there holding that state indefinitely, because each half is continuously reasserting the other.

That's a **latch**: four transistors that remember one bit. Add two more to write into it and you have the six-transistor SRAM cell that [the caches](/blog/how-memory-works/) are built from. Storage isn't a different kind of component — it's logic wired into a [loop that holds its own output](/blog/the-loops-that-drive-your-car/).

And the alternative from that same post — DRAM's one transistor guarding one leaky capacitor — is the other way to do it: don't build a loop that reasserts the bit, just store the charge and go back to refresh it before it drains. Six transistors and no maintenance, or one transistor and constant upkeep. Every memory system is a bet on which of those you'd rather pay for.

## Why smaller kept being better

For fifty years the industry shrank transistors, and shrinking used to improve nearly everything at once:

- **More of them** in the same area — the cost per transistor falls.
- **Faster** — a smaller gate has less capacitance, so it charges and discharges more quickly.
- **Less energy per switch** — less charge to move each time.

Cheaper, faster, *and* more efficient, all from the same change. That compounding is what people mean by Moore's Law, and it is the most sustained run of exponential improvement in industrial history.

One caveat about the numbers, since they get quoted constantly: **a "3-nanometre" process does not mean anything on the chip is 3 nanometres.** The node names stopped corresponding to physical dimensions well over a decade ago and are now essentially marketing labels for a generation. Real features are larger, and modern transistors aren't the flat structure in the diagram anyway — the channel has been folded up into a vertical fin and, more recently, wrapped by the gate on all four sides, all to get better control of a channel too small for a flat gate to switch off cleanly.

Which points at the real problem. As gates got tiny, the insulator got thin enough that electrons **tunnel straight through it** — quantum mechanically appearing on the other side of a barrier they don't have the energy to cross. Transistors began leaking while switched off. The "free" part of the shrink ended, and what replaced it is the subject of the last post in this series.

---

A switch with no moving parts, thrown by a field reaching through a few atoms of glass, summoning a wire into existence and dismissing it again — a hundred billion times over, a billion times a second each.

Everything else in computing is arrangement. The [sixteen thousand arithmetic units](/blog/how-gpus-work/) in a graphics card and the [billions of leaking buckets](/blog/how-memory-works/) in its memory are the same component, wired two different ways. There is no second ingredient.
