---
title: 'From Combustion to Contact Patch: The Mechanical Systems That Move Your Car'
description: 'The control loops get the glory, but they are only issuing orders — here is the machinery that actually obeys, from burning fuel to four patches of rubber.'
pubDate: 2026-07-23
tags: [automotive, mechanical]
series:
  name: 'Under the Hood'
  part: 2
---

The [last post](/blog/the-loops-that-drive-your-car/) toured the feedback loops that drive a car — the nervous system. But a nervous system moves nothing by itself. Every loop terminates in machinery: metal that burns, spins, multiplies, and grips. This post follows the force — from a spark in a cylinder to the road surface — through the mechanical systems a car cannot run without.

## Making torque: the engine

A gasoline engine is a device for turning tiny explosions into smooth rotation, and it does it with a four-beat rhythm that engineers memorize as *suck, squeeze, bang, blow*:

1. **Intake** — the piston slides down, inhaling an air-fuel mist.
2. **Compression** — it rises, squeezing the mixture to a tenth of its volume (this is the "compression ratio," and it's why the bang is worth having — compressed mixtures burn ferociously).
3. **Power** — the spark plug fires, pressure slams the piston down. *This is the only stroke that produces energy.*
4. **Exhaust** — the piston rises again, shoving out the burnt gases.

One power stroke in four means each cylinder pushes only a quarter of the time, which is why engines have multiple cylinders staggered out of phase, plus a **flywheel** — a heavy disc whose inertia smooths the pulses into steady rotation. The **crankshaft** converts the pistons' up-and-down into spin, the same conversion your legs perform on bicycle pedals.

The engine's great weakness sets up everything that follows: it only makes useful torque in a narrow band of RPM. Too slow and it stalls; too fast and it destroys itself. A machine that must operate from 0 to 200 km/h simply cannot be bolted straight to the wheels.

## Shaping torque: the drivetrain

**The gearbox** solves the narrow-band problem the same way your bicycle's gears do: by trading speed for torque. In first gear, the engine spins ~3.5 times for each output turn, and torque is multiplied by the same 3.5 — monstrous force for pulling away, at walking pace. Top gear reverses the trade for relaxed highway cruising. The gearbox's whole job is keeping the engine inside its happy band while the road demands anything from a crawl to a sprint.

**The clutch** (or a torque converter in automatics) exists because an idling engine can't connect rigidly to stationary wheels. It's a friction disc that can *slip* — transmitting force gradually as it engages. Launching from a stop is controlled slipping; that's the skill in a manual's biting point.

**The differential** solves a problem most drivers never notice: in a corner, the outside wheels travel a longer arc than the inside ones, so the driven wheels *must* rotate at different speeds. The differential is a gorgeous little gear cluster that splits torque between the two wheels while letting them spin at whatever ratio the corner requires. (Its famous flaw: send power to the wheel that's easiest to turn, and a tire on ice gets everything. Traction control — [a loop](/blog/the-loops-that-drive-your-car/) — papers over the mechanism's blind spot.)

<figure>
	<img src="/diagrams/torque-path.svg" alt="The torque path: engine to clutch to gearbox to differential to wheels, with torque multiplied at the gearbox and final drive on the way to the contact patches" width="640" height="230" loading="lazy" />
	<figcaption>The torque path. A modest 150 N·m at the crankshaft becomes roughly 2,000 N·m at the axle in first gear — the multiplication is the drivetrain's entire purpose.</figcaption>
</figure>

## Staying alive: cooling and oil

Combustion is thermodynamically brutal: only about a third of the fuel's energy becomes motion; the rest is heat that must be removed *continuously* or the engine dies in minutes. The cooling system pumps liquid through passages in the engine block and out to the **radiator**, where airflow carries the heat away — [moving heat](/blog/how-air-conditioning-works/), again, just downhill this time.

Oil is the quieter miracle. A running engine's metal surfaces — crank bearings, piston skirts, cam lobes — *never actually touch*. They surf on a pressurized oil film a few microns thick, renewed every rotation by the oil pump. Lose oil pressure and metal meets metal at thousands of RPM; the engine doesn't wear out, it welds itself together. When mechanics say oil changes are cheap insurance, this film is what's being insured.

## Stopping and holding on

**Brakes** are a hydraulic force multiplier. Pascal's principle — pressure in a fluid transmits everywhere equally — lets a modest push on a small pedal cylinder become tons of clamping force at wide caliper pistons, squeezing discs that convert your kinetic energy into heat. And note the asymmetry: a stop from highway speed dumps around a megajoule into the discs in a few seconds — your brakes are, in bursts, several times more powerful than your engine. That's the correct priority.

**The suspension**'s real job isn't comfort — it's *contact*. A spring holds the car up and lets each wheel follow bumps; a **damper** (shock absorber) kills the spring's natural urge to bounce forever. Without damping, one pothole sets the car pogoing, and a tire that's airborne — even for a tenth of a second — has zero grip. The suspension exists to keep rubber pressed against asphalt no matter what the road does.

**Steering** is the simplest of the lot: a pinion gear on the steering column walks along a toothed rack, turning wheel rotation into side-to-side motion, with electric assist doing most of the effort in anything modern.

## The contact patch

Here's the punchline the whole machine builds toward. Every force a car experiences — accelerating, braking, cornering — passes through four patches of rubber, each about the size of your palm. That's the entire interface between two tons of engineering and the world.

> The engine makes force, the drivetrain shapes it, the suspension guarantees delivery, and the brakes reclaim it — but all of them are ultimately in service of four palm-prints of grip.

Which reconnects to the [loops post](/blog/the-loops-that-drive-your-car/): ABS, traction control, and stability control are, in the end, software managing those four patches — keeping each one just inside the edge of its grip. The loops are the judgment. This machinery is the muscle. A car needs both, several hundred times a second, all the way home.
