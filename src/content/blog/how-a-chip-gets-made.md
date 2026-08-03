---
title: 'How a Chip Gets Made: Printing with Light You Cannot See'
description: 'A hundred billion transistors, essentially all of them working, for a few hundred dollars. You could never build that one at a time — so nobody does. You print it, about a hundred times over, with light that no lens can focus.'
pubDate: 2026-08-08
tags: [computing, hardware, manufacturing]
series:
  name: 'Inside the Machine'
  part: 5
---

[Part 1](/blog/what-a-transistor-actually-does/) ended with a number worth sitting with: around a hundred billion transistors on a chip the size of a fingernail, essentially every one of them working, for a few hundred dollars.

Take that seriously as a manufacturing problem and it should be impossible. Assemble one transistor per second and you'd finish the chip in about three thousand years. Get 99.9999% of them right and you'd still have a hundred thousand broken ones — plenty to render the whole thing useless.

So they aren't made one at a time. **They're printed, all at once, in layers — with light.** And the reason a leading-edge fab costs more than an aircraft carrier is that the light in question is very difficult to have.

## Start with a perfect crystal

The wafer comes first. Sand is refined to silicon of roughly **nine-nines purity** — one stray atom per billion — then melted, and a seed crystal is dipped in and slowly withdrawn while rotating. Silicon freezes onto the seed in perfect register with its lattice, and you pull out a cylindrical ingot that is a **single continuous crystal**, 300 mm across and a couple of metres long.

That matters because a crystal boundary is an electrical defect. The whole edifice needs the atoms lined up in one unbroken arrangement across the entire wafer. The ingot gets sliced into discs and polished until they're flat to within a few atoms.

That's the canvas: a mirror-flat slice of a single crystal, big enough to yield dozens of chips at once. Everything after this is done to *all* of them simultaneously, which is the first half of the answer to the impossible-manufacturing problem.

## The cycle

The other half is that you never build a structure. You print a pattern, then use the pattern as a stencil.

<figure>
	<img src="/diagrams/litho-cycle.svg" alt="A five-step cycle: coat the wafer with a film and light-sensitive resist, expose it by projecting a mask through a lens, develop away the exposed resist, etch the material left uncovered, then strip the remaining resist — with an arrow looping back to indicate the cycle repeats roughly a hundred times" width="640" height="320" loading="lazy" />
	<figcaption>One trip round the loop builds one layer. A finished chip is about a hundred of these, stacked and aligned.</figcaption>
</figure>

Each pass goes: lay down a film of whatever this layer is made of; coat it in **photoresist**, a polymer that changes solubility where light strikes it; project the layer's pattern onto the resist; wash away the parts that were exposed; **etch** the material now left uncovered; strip the leftover resist.

You've transferred a drawing into physical structure. Do it again for the next layer. And again — roughly a hundred times, working up from the transistors at the bottom to a dozen-odd storeys of copper wiring above them, every layer aligned to the one beneath it within a few nanometres, across a disc the size of a dinner plate.

The genius of it is that **printing a billion shapes costs the same as printing one.** The exposure doesn't care how complicated the pattern is. That single fact is why transistors are effectively free and why chip economics look nothing like the economics of building anything else.

## The wavelength problem

Step 2 is where it gets hard, and the reason is a limit that photography ran into a century ago.

You cannot project detail much finer than the wavelength of the light you're using. Push past it and diffraction smears the pattern into mush. For decades, chipmakers stayed ahead by moving to shorter and shorter wavelengths — visible, then ultraviolet, arriving eventually at **193 nm** deep-ultraviolet lasers.

And then they got stuck there for nearly twenty years, while features kept shrinking to a small fraction of that wavelength. Printing 30 nm features with 193 nm light is like drawing a hairline with a paint roller. The tricks that made it work are extraordinary:

- **Immersion** — flood the gap between lens and wafer with ultrapure water, which bends light more sharply than air and effectively shortens the wavelength.
- **Multi-patterning** — give up on printing the fine pattern in one go. Print a coarser one, then print a second offset pattern, and let the two interleave into something finer. Each extra pass means another full trip round the loop, with its own cost, time, and alignment error.

By the mid-2010s some layers needed *four* exposures to make one pattern. The industry was running out of road.

## Light no lens can focus

The escape was **EUV** — extreme ultraviolet, at **13.5 nm**. Fourteen times shorter than what came before, and enough resolution to print a modern layer in a single pass again.

There's a catch, and it's a serious one: EUV is absorbed by essentially everything. Air absorbs it. Glass absorbs it. There is no such thing as an EUV lens, because any material you'd make a lens from is opaque at that wavelength.

So the machine that does it is arguably the most complex object ever manufactured:

- The whole optical path runs in **hard vacuum**, since air alone would swallow the beam.
- There are no lenses — only **mirrors**, and not ordinary ones. Each is a stack of dozens of alternating molybdenum and silicon layers a few atoms thick, engineered so that the faint reflections from each interface add up. Even so, each mirror only returns about 70% of what hits it, and there are roughly ten of them in a row. Do the arithmetic and a small fraction of the light you generate ever reaches the wafer. These mirrors are the flattest objects humans make; scaled to the size of a country, the bumps would be millimetres.
- The **light source** is the part that sounds invented. Molten tin is squirted out as droplets, tens of thousands per second. Each droplet is hit in flight by a laser pulse that flattens it into a pancake, then by a second, far more powerful pulse that blows it into a plasma hot enough to radiate at 13.5 nm. That happens about fifty thousand times a second, continuously, for years.

Vaporising tin droplets with a two-stage laser to make light that only mirrors can steer, in a vacuum, to print circuits — this is the load-bearing step of the modern economy. A single machine costs a couple of hundred million dollars, weighs as much as two buses, and effectively one company on earth makes them. That's the real reason leading-edge chips are a geopolitical concern: the bottleneck isn't knowing how, it's the machines.

## Yield, and why your GPU is missing pieces

Now the part that shapes the products you can actually buy.

Fabs are cleaner than operating theatres by orders of magnitude, but not perfectly clean. A stray particle, a flaw in the crystal, a hiccup in one of a thousand process steps — each can kill whatever die it lands on. **Yield** is the fraction of dies on a wafer that come out working, and it's the number that governs the whole business.

Here's the consequence that isn't obvious: because defects are scattered roughly at random, the odds of a die escaping all of them fall **exponentially with its area.** Double the die size and you don't lose twice as many — you lose far more than twice as many. Big chips are punitively expensive for reasons that have nothing to do with the silicon they consume.

The industry's responses are all visible in the market:

**Binning.** A die with one broken block often works perfectly if you switch that block off. So chipmakers test each die, disable what's faulty, and sell it as a lower tier. The mid-range GPU is frequently the same silicon as the flagship with some units fused off. The product ladder is partly a marketing decision and partly a map of manufacturing defects.

**Chiplets.** Rather than one huge die, build several small ones — each with much better odds of coming out clean — and bond them together in one package. You trade a yield problem for a *communication* problem: those separate dies now have to talk to each other at something approaching on-chip speed.

Which is where this stops being a manufacturing story. Once the answer to "make it bigger" becomes "use more pieces," the interesting engineering moves to the wires between them — and that's [the next post](/blog/the-interconnect/).

---

Sand purified to one impurity per billion atoms, frozen into a single crystal the width of a dinner plate, then printed a hundred times over with light generated by shooting molten tin with a laser fifty thousand times a second — bounced off the flattest mirrors ever made, inside a vacuum, because nothing transparent exists at that wavelength.

The astonishing part isn't that it works. It's that it works well enough, often enough, that the resulting object is a commodity.
