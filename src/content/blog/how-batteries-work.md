---
title: 'Batteries: Why They Work and Why They Die'
description: 'A battery is a chemical reaction that desperately wants to happen, held apart — with the electrons forced to commute through your device.'
pubDate: 2026-07-25
series:
  name: 'Under the Hood'
  part: 4
---

A battery doesn't store electricity. There are no volts sloshing around in a tank. What a battery stores is a **chemical argument**: two materials that badly want to react with each other, deliberately kept apart — with exactly one path between them, routed through your phone.

Get that picture right and everything else about batteries — voltage, capacity, charging, degradation, fires — follows almost automatically.

## The setup

Every cell has the same three-part anatomy:

- An **anode** (the − side): a material that holds electrons loosely and would love to hand them off.
- A **cathode** (the + side): a material that greedily wants electrons.
- An **electrolyte** between them, with a thin **separator**: this is the clever part. It lets *ions* — charged atoms — swim across, but it's an absolute wall to *electrons*.

The reaction can only proceed if electrons get from anode to cathode. The electrolyte blocks them. So the electrons take the only route available: **out the terminal, through your device, and back in the other side.** That detour is the entire product. Your flashlight is a toll road on a chemical reaction's commute.

<figure>
	<img src="/diagrams/battery-cell.svg" alt="A battery cell: anode and cathode separated by electrolyte with a separator; lithium ions cross inside the cell while electrons travel the external circuit through the device" width="640" height="300" loading="lazy" />
	<figcaption>Discharge: ions swim across the inside, electrons take the long way around — and only the electrons do useful work.</figcaption>
</figure>

Meanwhile, ions cross the electrolyte to keep the charges balanced. Both migrations happen together or not at all — which is why a battery does nothing until the circuit closes, and why it can sit on a shelf for months holding its argument in suspense.

## Voltage is desire, capacity is supply

Two numbers describe every battery, and they come from different places:

**Voltage** is how *badly* the chemistry wants to run — fixed by the choice of materials, not the size. Every alkaline AA is 1.5 V whether it's fresh from the pack or built like a keg; every lithium-ion cell sits near 3.7 V. It's a chemical constant, like water's boiling point.

**Capacity** is how *much* reactant is on board — and this one does scale with size. More material, more electron-hours.

Need more of either? Stack cells, using the [series/parallel rules](/blog/how-electricity-actually-works/): series adds voltages (a 9 V block is six 1.5 V cells in a trench coat; a 400 V EV pack is ~100 lithium cells in series), parallel adds capacity. Every "battery" bigger than one cell is just arithmetic.

## Lithium-ion: the rocking chair

The cell in your phone doesn't consume its electrodes the way a cheap alkaline does. It's something more elegant, nicknamed the *rocking-chair battery*. Both electrodes are lattices — graphite on one side, a metal oxide on the other — and lithium ions simply **park inside one lattice or the other**, like guests moving between two hotels. Discharge: ions check out of the graphite and into the oxide, electrons commuting around the outside. Charging is the same trip in reverse, with your wall charger paying to pump every ion back uphill.

Nothing is consumed; the guests just shuttle. In principle it could rock forever.

## In practice: the four horsemen

Your phone's battery is measurably worse after two years. In principle nothing is consumed — so what's dying? Four things, all at once:

1. **The crust (SEI layer).** The electrolyte isn't perfectly stable against the electrodes; a thin film of decomposed gunk grows on the graphite with every cycle. Each layer permanently imprisons some lithium — capacity you never get back. It grows fastest when the battery is hot and full.
2. **Cracking.** Electrodes physically swell and shrink as ions check in and out — thousands of micro-flexes that slowly crumble the lattice, disconnecting chunks of it.
3. **Dendrites.** Charge too fast — especially when cold — and lithium doesn't park neatly; it plates onto surfaces as metallic spikes. Grow one long enough to pierce the separator and the argument short-circuits *inside* the cell. That's the battery-fire failure mode.
4. **Plain time.** Even unused, side reactions creep along — faster when the cell is stored full and warm.

Notice the shared villains: **heat, high charge, and speed**. Which is why the folk advice is real: keep it between roughly 20% and 80%, avoid charging in the heat, and don't fast-charge when you don't need to. It's also why your phone's "optimized charging" pauses at 80% overnight, and why an EV's most protected [control loop](/blog/the-loops-that-drive-your-car/) is the battery-management system — a computer whose entire job is babying these four failure modes cell by cell.

## Why cold mornings shrink your range

Chemistry is temperature. Cold electrolyte is syrup — ions swim slower, internal resistance climbs, and the voltage sags under load. The energy is still there; the battery just can't hand it over quickly. This is why a phone at a ski lift dies at "40%," why EVs quote winter range separately, and why EVs heat their packs before fast-charging (see: dendrites, above).

> A battery is the rare machine that is also a consumable. Every design is a bargain between energy, power, lifespan, and safety — and every spec sheet is a confession about which one was sacrificed.

---

So now you have both halves: [a motor](/blog/how-electric-motors-work/) that makes full torque from a standstill with one moving part, and a battery that's really a hundred chemical arguments in series with a computer for a chaperone. Put them in a car and you can start deleting components — which is exactly where this thread goes next.
