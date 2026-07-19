---
title: 'What a Transmission Actually Does (and Why Cars Cannot Live Without One)'
description: 'It is not just a box of gears — it is a translator between an engine that only speaks one narrow dialect and a road that demands everything.'
pubDate: 2026-07-26
series:
  name: 'Under the Hood'
  part: 5
---

Ask what a transmission does and you'll usually hear "it changes gears" — which is true the way "a kitchen changes food" is true. It describes the activity and misses the point entirely.

Here's the point: **a combustion engine and a car's wheels fundamentally cannot agree on a speed.** The [mechanical systems post](/blog/mechanical-systems-that-move-your-car/) introduced the problem — an engine only produces useful power in a narrow band, roughly 1,500–6,500 RPM. It can't push below that band and it grenades above it. Meanwhile the wheels need to turn anywhere from 0 RPM (stopped at a light) to ~1,800 RPM (highway). One machine speaks a single narrow dialect; the other demands the whole language. The transmission is the translator sitting between them, and it's arguably the reason the gasoline automobile was viable at all.

## The lever, made round

A gear pair is just a lever bent into a circle, and it makes the same trade a lever does. Mesh a small gear driving a large one and the output turns *slower* — but with proportionally *more torque*. A 3.5:1 first gear multiplies the engine's twist by 3.5 while dividing its speed by 3.5. Power (speed × torque) passes through nearly unchanged; the gearbox just **re-denominates it**, like breaking a hundred into twenties.

Stack first gear (3.5:1) onto the final drive (say 4:1) and the engine's modest 150 N·m becomes roughly 2,000 N·m at the axle — enough to get two tons rolling uphill. That's the multiplication the [torque-path diagram](/blog/mechanical-systems-that-move-your-car/) waved at; the transmission is where most of it happens, *selectably*.

Why not one fixed ratio? Because any single choice is a bad compromise. Gear it for launching and the engine screams past redline at 60 km/h. Gear it for cruising and it can't pull away from a stop. A single-speed bicycle has exactly this problem — fine on flat ground, miserable on hills — and your legs are a far more flexible engine than any crankshaft.

## Why "gears," plural

Plot engine RPM against road speed and each gear is a straight line — a fixed exchange rate between the two. The engine's usable band (idle to redline) means each line only covers one *slice* of road speed. Multiple gears tile the slices so that, at any speed, some gear can put the engine inside its happy band:

<figure>
	<img src="/diagrams/gear-coverage.svg" alt="Chart of engine RPM versus road speed: five gear lines of decreasing steepness, each usable between idle and redline, with the accented shift path sawtoothing up through the gears" width="640" height="320" loading="lazy" />
	<figcaption>Each gear is a fixed exchange rate between engine and road speed. Accelerating is climbing one line to redline, then hopping down to the next — the sawtooth is what you hear as an engine "running up through the gears."</figcaption>
</figure>

That sawtooth is the sound signature of every accelerating car you've ever heard: rise, drop, rise, drop. Each drop is the translator switching dictionaries.

## Four ways to shift

The hard part of a transmission isn't the gears — it's *changing* them while thousands of newton-meters flow through. Every design is a different answer to that problem:

- **Manual.** The driver is the shift controller: clutch in (disconnect the engine), move the lever, clutch out. Inside, brass **synchromesh** rings — tiny friction clutches — drag each gear to matching speed before it engages, which is why you don't hear 1920s grinding.
- **Automatic.** A **torque converter** — two fans facing each other in a sealed donut of fluid — replaces the clutch; the engine fan drives the fluid, the fluid drives the wheel-side fan, and slip is graceful by nature (it even multiplies torque at a standstill). Behind it, **planetary gearsets** change ratios by grabbing and releasing elements with internal clutches, under [computer control](/blog/the-loops-that-drive-your-car/). Modern ones lock the converter solid when cruising to stop wasting energy stirring fluid.
- **Dual-clutch.** Two gearboxes woven together — one holding the odd gears, one the even — each with its own clutch. While you drive in third, fourth is already engaged and waiting; the "shift" is one clutch opening as the other closes, in tens of milliseconds. It's the transmission as a pipeline processor.
- **CVT.** A belt running between two variable-width cones, giving a *continuously* variable ratio — no gears at all. It can hold the engine at its single most efficient RPM while speed changes underneath, which is maximally clever and slightly eerie: the engine drones at constant pitch while the car accelerates, which is exactly the sawtooth *not* happening.

## The EV plot twist

Now apply the lens of the [electric motor post](/blog/how-electric-motors-work/). A motor makes **full torque at 0 RPM** and stays useful to 15,000+ — its happy band covers nearly the whole chart in one line. So most EVs carry no multi-speed transmission at all: just one fixed ~9:1 reduction gear, permanently in "first." No clutch, no torque converter, no shifting, nothing to interrupt torque. The component this entire post celebrates is largely *deleted* — not because it was bad engineering, but because it was a brilliant workaround for an engine limitation the motor simply doesn't have.

> A transmission is an impedance matcher: it exists to couple a source that's only strong in one narrow regime to a load that wanders everywhere. Improve the source enough, and the matcher withers away.

(A few exceptions prove the rule — some performance EVs add a second gear for top speed, and heavy trucks keep a few ratios — but the direction is unmistakable.)

That's the transmission: not a box of gears but a negotiation, conducted continuously between combustion's stubbornness and the road's demands — and the first major casualty when the stubbornness goes away. The full inventory of what else the electric drivetrain deletes is the next post in this thread.
