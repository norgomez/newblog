---
title: 'What EVs Delete'
description: 'The electric car is not an addition to the automobile — it is a subtraction, and almost everything this series explained is on the cut list.'
pubDate: 2026-07-27
series:
  name: 'Under the Hood'
  part: 6
---

Engineers love to add. More valves, more gears, more sensors, more control. So it's worth savoring the rare technology whose entire story is *subtraction* — because the electric car is one, and everything this series has built so far is exactly what it subtracts.

A combustion drivetrain contains roughly two thousand moving parts. An electric one contains about twenty. That ratio isn't a detail; it *is* the thesis. Let's walk the cut list.

## Deleted: the engine

The [four-stroke engine](/blog/mechanical-systems-that-move-your-car/) was a machine for containing explosions — and nearly everything in it existed to manage that violence. Pistons, valves, camshafts, timing chains: gone. The micron-thick **oil film** and its pump, filter, and change intervals: gone (an EV's reduction gear holds a sealed cupful, for life). The **exhaust system** and catalytic converter: gone. The fuel tank, pump, and injectors — the [air-fuel loop](/blog/the-loops-that-drive-your-car/) itself, the oldest closed loop in the car: gone, along with the narrow power band that made everything downstream necessary.

In their place: [a motor](/blog/how-electric-motors-work/) with one moving part, chasing a rotating magnetic field.

## Deleted: most of the drivetrain

This is the [transmission post's](/blog/what-a-transmission-does/) plot twist, now in full. The motor makes torque from 0 RPM across a band ten times wider than combustion's — so the multi-speed gearbox collapses into a single fixed reduction, and the clutch and torque converter, which existed only to connect a machine that can't stop to wheels that must, vanish entirely.

<figure>
	<img src="/diagrams/ev-vs-ice.svg" alt="Two drivetrain chains compared: the combustion chain of engine, clutch, gearbox, differential, wheels; and the electric chain where a motor and a single-speed reduction replace the first three boxes" width="640" height="300" loading="lazy" />
	<figcaption>The same torque path, before and after. The clutch and gearbox collapse into one fixed ratio; the differential and the four contact patches keep their jobs.</figcaption>
</figure>

No shifting also means no shift *logic* — the sawtooth from the gear-coverage chart flattens into one silent line. It's why an EV's acceleration feels eerie: nothing ever interrupts the torque.

## Demoted: the brakes

The [motor post's](/blog/how-electric-motors-work/) symmetry — every motor is a generator — earns its keep here. Lift off the accelerator and the wheels spin the motor, which pushes energy back into [the battery](/blog/how-batteries-work/), slowing the car. **Regenerative braking** handles most everyday stops; the friction brakes, those megajoule-swallowing heat converters, become an emergency backup that can last the vehicle's life. One-pedal driving is this symmetry surfaced as a feature.

## Promoted: the battery and its keeper

Subtraction isn't the whole story — honesty requires the additions column. The battery pack is heavy, expensive, and, as the [batteries post](/blog/how-batteries-work/) detailed, a consumable with four failure modes. So the EV *adds*: a **battery management system** babying hundreds of cells; serious **thermal management** (the [heat-moving machinery](/blog/how-air-conditioning-works/) is promoted from cabin comfort to core infrastructure — many EVs use a heat pump to condition both you *and* the pack); and an **inverter**, the power-electronics brain converting the pack's DC into precisely-timed three-phase currents for the motor — the electronic commutator, scaled up to hundreds of kilowatts.

Notice the pattern in the additions: **no new mechanisms.** Every added component is electronics, chemistry, or software. The EV trades machined metal for [control loops](/blog/the-loops-that-drive-your-car/) — the exact trade the loops post said the whole industry was making.

## Kept: the parts physics insists on

The suspension still fights to keep tires touching asphalt. The steering rack still walks its pinion. The [differential](/blog/mechanical-systems-that-move-your-car/) still lets the outside wheel outrun the inside one (though dual-motor cars can delete even that, giving each axle — or wheel — its own motor and doing the math in software: *torque vectoring*, the differential as a control loop). And everything, still, ends at four palm-sized contact patches. Chemistry and code from top to bottom, and the last centimeter is still rubber.

## The scorecard

| Component | Fate | Why |
| --------- | ---- | --- |
| Engine, oil, exhaust, fuel system | Deleted | No explosions to manage |
| Clutch / torque converter | Deleted | Torque exists at 0 RPM |
| Multi-speed gearbox | Deleted | One band covers the whole chart |
| Friction brakes | Demoted | The motor brakes by generating |
| Cooling system | Promoted | The battery is the new patient |
| BMS, inverter, software | Added | The new complexity is invisible |
| Suspension, steering, tires | Kept | Physics doesn't take sides |

> Maintenance schedules tell the story best: no oil changes, no timing belts, no spark plugs, no clutch wear, brake pads that die of old age. The EV isn't a better version of the machine this series described — it's the discovery of how much of that machine was workaround.

---

And that closes the arc. Six posts ago, a car was a mysterious whole. Now it's legible: [loops](/blog/the-loops-that-drive-your-car/) for judgment, [machinery](/blog/mechanical-systems-that-move-your-car/) for muscle, [a translator](/blog/what-a-transmission-does/) between engine and road — and finally a technology that keeps the judgment, simplifies the muscle, and fires the translator. Whatever you drive, you now know what it's doing several hundred times a second, all the way home.
