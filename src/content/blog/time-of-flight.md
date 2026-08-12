---
title: 'Time of Flight: The Only Way Anything Knows How Far'
description: 'Radar, sonar, lidar, the parking sensor on your bumper and the satellites overhead are all running the same trick — send something at a known speed and time the return. Everything else is a consequence of what you sent.'
pubDate: 2026-08-16
tags: [signals, sensors]
series:
  name: 'Over the Air'
  part: 7
---

Every part of this series so far has treated a radio wave as something you put a *message* on. This last one is about the other use entirely — sending a wave in order to time it.

A bat, an air-traffic radar, the ultrasonic sensor I bolted to a [pick-and-place gantry](/blog/pick-and-place-gantry/), a self-driving car's lidar, and the [GPS receiver](/blog/how-gps-works/) in your pocket are all solving the same problem, and — remarkably — all solving it the same way.

There is essentially **one** way for a machine to measure a distance it can't reach out and touch:

> Send something out at a speed you know. Time how long it takes to come back. Halve it.

That's the entire family. Everything that distinguishes a $2 parking sensor from a $200,000 lidar follows from a single choice: *what* you send.

<figure>
	<img src="/diagrams/time-of-flight.svg" alt="A sensor emits a pulse that travels to a target and returns, with the round-trip time measured by a clock; distance equals speed times time divided by two, halved because the pulse made the trip twice. Below, the same principle listed across ultrasonic at 343 metres per second, sonar at 1480, radar and lidar at the speed of light, and GPS one-way" width="640" height="300" loading="lazy" />
	<figcaption>One equation, five industries. Only <em>v</em> changes.</figcaption>
</figure>

## What changes is the speed — and it changes everything

Sound moves through air at about **343 m/s**. Radio and light move at about **300,000,000 m/s**. That's a factor of roughly **875,000**, and essentially every practical difference between these sensors falls out of it.

**Timing difficulty.** Light travels **30 cm in one nanosecond**. To resolve a metre of range you must measure a round trip to within about **6.7 nanoseconds** — which needs genuinely fast electronics. To resolve a centimetre with *sound*, you have **58 microseconds** to play with. That's ten thousand times easier, and it's why an ultrasonic rangefinder costs a couple of dollars and a lidar does not.

**Reach.** Sound in air gets absorbed quickly and scatters on the slightest breeze; a few metres is a working range. Radio crosses hundreds of kilometres. That's not a subtlety of the technique, it's just what the medium allows.

**Resolution of detail.** Shorter wavelengths see finer structure. Ultrasound at 40 kHz can tell you something is *there*; lidar can tell you it's a cyclist.

## The pulse-length trap

Here's the constraint that shapes every real system, and it isn't obvious.

You can't cleanly separate two objects whose echoes overlap. If your pulse lasts 1 microsecond, its echo is 1 microsecond long, and anything within **150 metres** behind the first target has its reflection smeared into the same return. Range resolution is set by pulse length:

> resolution = speed × pulse duration ÷ 2

So shorten the pulse. A 10-nanosecond pulse gives you 1.5 m resolution. Lovely — except a shorter pulse contains less energy, a weaker echo comes back, and your maximum range collapses. **Resolution and range pull directly against each other**, and for decades that was simply the deal.

The escape is elegant enough to be worth knowing. Instead of a short pulse, send a **long** one whose frequency sweeps across a band as it goes — a *chirp*. On return, slide the known sweep against the echo and look for where they line up. Because every part of the chirp is distinguishable, the correlation peak is far sharper than the pulse is long.

That's **pulse compression**, and it buys you the energy of a long transmission with the resolution of a short one. It's the same underlying idea as [error-correcting structure](/blog/how-machines-talk/) in a data link: build recognisable pattern into what you send, and you can dig the answer out of a much worse signal than the raw waveform should allow.

## Doppler, thrown in for free

If the target is moving, the returning wave is compressed or stretched — the same effect that drops the pitch of a siren as it passes. Measure the frequency shift and you get **closing speed**, from the same echo that gave you range.

This is why radar can catch a speeding car without two measurements, why weather radar sees wind inside a storm, and why medical ultrasound can show blood moving. One pulse, two answers.

It's also the sharpest tool for pulling a target out of clutter. A stationary hillside and an aircraft flying past it may reflect similarly, but only one of them shifts the frequency. Filter on Doppler and the landscape disappears.

## GPS: the one-way case

Now the interesting exception, because it breaks the round trip.

You can't ping a GPS satellite. It doesn't know you exist, and 20,000 km up there's no practical way to get an echo. So instead of timing a round trip, the satellite continuously announces: *this signal left me at exactly this time.* Your receiver compares that against its own clock and multiplies the difference by the speed of light.

Which raises an obvious problem. There's no division by two, so a one-way measurement needs both clocks to agree — and a **1-nanosecond** disagreement is a **30 cm** error. The satellite carries an atomic clock. Your phone carries something worth a few cents.

The fix is genuinely lovely: **stop trying to know the time.** Treat your clock error as a fourth unknown alongside x, y, and z. Four unknowns need four equations, so lock onto four satellites and solve for all of them at once. The receiver doesn't measure time accurately — it *derives* it, as a by-product of solving for position.

That's why a 3D fix needs four satellites, not three. The fourth one isn't buying you geometry. It's buying you a clock.

## The family, side by side

| | Medium | Speed | Typical range | Where you meet it |
| --- | --- | --- | --- | --- |
| **Ultrasonic** | air | 343 m/s | cm to a few m | parking sensors, hobby robots |
| **Sonar** | water | ~1480 m/s | m to km | submarines, depth sounders, fish finders |
| **Radar** | radio | 3×10⁸ m/s | m to hundreds of km | air traffic, weather, speed enforcement |
| **Lidar** | light | 3×10⁸ m/s | m to ~200 m | autonomous vehicles, surveying |
| **GPS** | radio, one-way | 3×10⁸ m/s | 20,000 km | everything |

Read the second column and the rest of the table explains itself. Cheap and short-range at the top, expensive and long-range at the bottom, and the dividing line is whether you chose something that moves at the speed of sound or the speed of light.

---

There's something satisfying about how little of this is separate knowledge. A submarine and a self-driving car are not related technologies in any ordinary sense, but strip both back and you find a pulse, a clock, and a division by two.

The only real question a designer answers is what to send — and once that's chosen, the cost, the reach, the resolution and the difficulty are all decided for them.

Which is where this series lands. [A shaken charge](/blog/what-a-radio-wave-is/), [a rod cut to a quarter wavelength](/blog/antennas/), [a plot of spectrum](/blog/the-spectrum/), [three properties to vary](/blog/modulation/), [an accounting sheet](/blog/the-link-budget/), and [a clear horizon](/blog/line-of-sight/). Put them together and you can either say something, or find out how far away something is — and it turns out those are the same machine.
