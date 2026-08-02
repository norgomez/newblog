---
title: 'Why Chips Run Hot: The Limit Behind Every Other Limit'
description: 'Clock speeds stopped climbing twenty years ago and never restarted. Not because we ran out of transistors — because everything a computer does turns into heat, and getting rid of it is the hardest problem on the die.'
pubDate: 2026-08-07
series:
  name: 'Inside the Machine'
  part: 4
---

Here's a fact that should be stranger than it is. In 2004 you could buy a desktop processor that ran at about 3.5 GHz. Two decades later — after roughly a thousandfold increase in the number of transistors on a chip — you can buy one that runs at about 5 GHz.

Everything else went exponential. Clock speed went sideways.

That plateau wasn't a failure of transistor design. [The switches themselves](/blog/what-a-transistor-actually-does/) kept getting faster the entire time. The wall the industry hit is thermal: **everything a computer does turns into heat, and heat is far harder to remove than it is to make.** Every architectural choice in this series — why [GPUs went wide instead of fast](/blog/how-gpus-work/), why [memory sits millimetres from the arithmetic](/blog/how-memory-works/), why your laptop slows down when it's warm — traces back to this one constraint.

## Where the watts come from

Recall the virtue of CMOS logic: at rest, one of its two switches is always off, so there's no path from the supply rail to ground and it draws almost nothing. A circuit that isn't changing is nearly free.

Power gets burned in the *transition*. Flipping a gate means charging or draining a tiny capacitance, and each flip dumps that charge to ground as heat. Do it billions of times a second across billions of gates and the arithmetic is unforgiving:

> **Power ≈ (how much capacitance) × (voltage)² × (how often you flip it)**

Three knobs, and note that voltage is **squared**. Halving the voltage doesn't halve the power — it quarters it. That squared term is the most important number in chip design, and for thirty years it was also the industry's free lunch.

## The free lunch, and why it ended

The lunch had a name: **Dennard scaling**. Shrink a transistor's dimensions and you could also lower the voltage it needed, roughly proportionally. Run the numbers and the effect is remarkable — each generation packed in twice as many transistors, ran them faster, *and* the total power per square millimetre stayed about the same.

That's why clock speeds doubled and doubled again through the 80s and 90s without anything melting. Chips got denser and faster while power density held still. Nobody had to make a hard choice.

It stopped around 2005, and it stopped because **voltage hit a floor.** A transistor needs a certain minimum gate voltage to switch on decisively. Push the supply too close to that threshold and two things happen: the switch gets sluggish and unreliable, and — worse — it stops turning fully *off*. Current leaks through a transistor that's supposed to be shut. That leakage is pure waste heat, burned continuously whether the chip is doing anything or not, and as gates got smaller it grew from a rounding error into a large fraction of the budget. (The [quantum tunnelling](/blog/what-a-transistor-actually-does/) through gate insulators only a few atoms thick is part of the same story.)

So voltage stopped falling. And with V pinned, the formula above turns brutal: more transistors or a higher clock now means proportionally more heat, with no offsetting discount. The free lunch was over. Power became the budget you design against.

## The pivot that produced the GPU

Faced with a hard power ceiling, the industry made the only move available.

If you can't make one core meaningfully faster, put more cores on the chip and run them all slower. It works because of that squared term: two cores at 70% clock and reduced voltage can do more total work, for the same watts, than one core flat out. **Parallelism is a power-efficiency strategy long before it's a performance strategy.**

This is why your CPU has sixteen cores instead of one impossibly fast one. And it's the commercial origin of everything in this series — the [GPU's design](/blog/how-gpus-work/), thousands of slow simple units instead of a few fast complex ones, is that same trade taken to its logical extreme. GPUs didn't win because the industry found parallelism elegant. They won because after 2005 it was the only direction left.

Even that has a limit. Modern chips have more transistors than they can afford to switch simultaneously — power the whole die at full tilt and it cooks. So parts sit idle or slowed by design, a phenomenon with the excellent name **dark silicon**. It's also why "boost clocks" exist: a chip will happily run one core fast for a few seconds, right up until the heat catches up with it.

## Getting the heat out

Now the part that's a physics problem rather than a design choice — and it's a problem this blog has already covered from the other end.

Your air conditioner [doesn't make cold](/blog/how-air-conditioning-works/); it moves heat from where you don't want it to where you don't mind it. Cooling a chip is exactly the same job, at a smaller scale and with no refrigerant. You cannot destroy a watt. You can only push it somewhere cooler.

And it only flows downhill. Every stage of the journey — silicon to package, package through thermal paste to heatsink, heatsink to air, air to room — is a thermal resistance, and shoving heat across each one costs you a temperature difference.

<figure>
	<img src="/diagrams/thermal-chain.svg" alt="A chain of five stages carrying heat from a transistor at 100 degrees Celsius through the package at 80, heatsink at 60, case air at 40, and finally the room at 22, with an arrow between each stage and a temperature drop of roughly 20 degrees paid at every step" width="640" height="300" loading="lazy" />
	<figcaption>The transistor's temperature isn't set by the transistor. It's set by the room, plus every temperature drop between here and there.</figcaption>
</figure>

Read that diagram backwards and you see the real constraint. The silicon has a hard temperature limit — around 100 °C, past which it stops being reliable. The room is 22 °C. Everything in between is a fixed budget of about 78 degrees, and the watts you're allowed to dissipate are however many you can push through the chain without spending more than that. **Improve any link and you can run faster; that's all a better cooler ever does.**

It's worth appreciating the density involved. A high-end accelerator dissipates several hundred watts from a die of a few square centimetres. That's a heat flux several times higher than a kitchen stovetop element — except the stove is allowed to glow, and the chip has to stay below the boiling point of water.

Scale that up and you get the modern datacenter, which is best understood not as a building full of computers but as **an industrial refrigeration plant that happens to contain computers**. The metric the industry uses, PUE, is just total facility power divided by the power actually reaching the servers; a good site lands near 1.1, meaning a tenth of everything drawn from the grid goes to moving heat around. When people say AI is constrained by electricity, this is a large part of what they mean — the power to compute, plus the power to undo the computing's thermal side effects.

## The energy cost of moving a number

One last connection, and it's the one that ties the whole series shut.

The [memory post](/blog/how-memory-works/) argued that data movement, not arithmetic, is what limits performance. The same is true of energy, and even more starkly: **fetching a number from main memory costs hundreds of times more energy than doing arithmetic on it once it arrives.**

That's not a quirk of implementation, it's geometry. Arithmetic happens in a structure microns across. A trip to DRAM means driving a signal across the die, off the chip, through package pins, along a circuit board and back — charging and discharging every millimetre of conductor on the way. Distance costs energy, and the gap between "next door" and "across the board" is enormous.

So the memory wall and the power wall are the same wall seen from two sides. Both say: *the expensive thing is moving data, not transforming it.* Which explains a great deal of what modern hardware looks like — why HBM is stacked on the same package instead of socketed across the board, why chip designers fight over cache placement, why the whole field is drifting toward keeping computation physically next to the data instead of ferrying data to a distant computer.

---

Every logical operation your machine performs ends as a small quantity of heat in a room. The chip is, thermodynamically, a very sophisticated electric heater that produces answers as a side effect — and the answer rate is capped not by how fast the switches can flip, but by how fast the building can take the warmth away.

That's the limit behind every other limit in this series. The [transistor](/blog/what-a-transistor-actually-does/) is the ingredient, the [GPU](/blog/how-gpus-work/) is the arrangement, [memory](/blog/how-memory-works/) is the bottleneck — and heat is the reason all three ended up shaped the way they are.
