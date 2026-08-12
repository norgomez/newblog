---
title: 'Line of Sight and the Bulge of the Earth'
description: 'Your link budget says fifty kilometres and you get twelve. Usually nothing is broken — the planet is simply in the way, and no amount of transmit power argues with geometry.'
pubDate: 2026-08-15
tags: [signals, electronics]
series:
  name: 'Over the Air'
  part: 6
---

You do the arithmetic from [part 5](/blog/the-link-budget/). Transmit power, antenna gains, path loss, noise floor. The numbers say the link should hold out to fifty kilometres with margin to spare.

In the field you get twelve, and then it falls off a cliff.

Nothing is broken and the budget wasn't wrong. It just quietly assumed something that isn't true: that there's a clear path. The free-space path loss formula describes free space — a straight, unobstructed run through vacuum. The moment terrain, buildings, or the curve of the planet intrude, you aren't losing decibels any more. You've hit a wall.

**This is the difference between a loss and an obstruction, and it's the thing that catches people out.** You can buy your way out of a loss. You cannot buy your way out of a hill.

## The horizon is a hard edge

The earth curves away beneath a radio path at a rate that becomes significant surprisingly quickly. There's a tidy approximation for how far you can see — where "see" already accounts for the slight downward bending of radio in the atmosphere, which extends the geometric horizon by about a third:

> **distance (km) ≈ 4.12 × √height (m)**

Run it and the numbers are sobering:

| Antenna height | Radio horizon |
| -------------- | ------------- |
| 2 m (person, tripod) | **5.8 km** |
| 10 m (small mast) | 13.0 km |
| 30 m (tall mast) | 22.6 km |
| 122 m (aircraft at 400 ft) | **45.5 km** |

Both ends contribute — the total is the sum of the two horizons. So a ground station on a tripod talking to an aircraft at 400 feet gets 5.8 + 45.5 ≈ **51 km**, which is respectable. But *two* tripods talking to each other get 5.8 + 5.8 ≈ 12 km, and that is a wall no transmitter defeats.

<figure>
	<img src="/diagrams/line-of-sight.svg" alt="A curved earth with a 2-metre ground station on the left and an aircraft at 400 feet on the right, their horizons marked at 5.8 km and 45.5 km, a direct path between them, and a dashed ellipse around that path marking the first Fresnel zone with an obstacle intruding into it from below" width="640" height="300" loading="lazy" />
	<figcaption>Height buys range as a square root — so quadrupling the height doubles the horizon. Nothing else in radio behaves that generously.</figcaption>
</figure>

That square root is why *raise the antenna* was the first recommendation in [the link budget](/blog/the-link-budget/) and adding power was the last. Quadrupling your transmit power gains you 6 dB and doubles your range in free space — but only if the geometry allows it. Quadrupling your **height** doubles your horizon outright, usually for the cost of a mast.

It's also why altitude is the single biggest advantage an aircraft has as a radio platform. A drone at 120 m isn't a better transmitter than one on the ground. It can just see 45 km further.

## A sightline isn't enough

Now the part that surprises people who've done everything else right: **you can have a clear visual line of sight and still lose most of your signal.**

Radio doesn't travel as a pencil-thin ray. The energy occupies a three-dimensional region around the direct path — a stretched ellipsoid running between the two antennas, called the **first Fresnel zone**. Waves passing through different parts of that volume arrive having travelled slightly different distances, and they combine at the receiver. Block part of the zone and you're removing contributions that were adding constructively.

The zone is fattest in the middle, and it's bigger than people expect:

> **radius (m) ≈ 17.32 × √( distance_km ÷ (4 × frequency_GHz) )**

For a 10 km hop at 2.4 GHz, the first Fresnel zone is about **18 metres in radius** at the midpoint. The rule of thumb is to keep **60%** of it clear, so you want roughly 11 metres of clearance above any obstruction — not 11 metres above the ground, 11 metres above whatever is in the way, *in addition to* the sightline.

A treeline you can comfortably see over can still be sitting inside the zone and costing you real signal. And lower frequencies need *more* clearance, not less — at 900 MHz the same hop wants nearly 29 m of zone.

## Multipath: the signal that fights itself

The other consequence of radio not being a ray.

Signals reflect — off the ground, off water, off buildings, off the aircraft's own airframe. The receiver gets the direct wave plus one or more delayed copies, and they add. Sometimes they add constructively and you get a boost. Sometimes they arrive out of step and **partially cancel**.

Fades of 10 to 20 dB from multipath are routine, and this is a large part of what your [link margin](/blog/the-link-budget/) is actually for.

Two things about it are worth knowing because they look like magic in the field:

**Position matters at the scale of a wavelength.** At 2.4 GHz the wavelength is 12.5 cm, so the difference between a deep fade and a strong signal can be a few centimetres. This is why nudging an antenna slightly fixes a link, and why a stationary link can be flaky in a way that seems to have no cause.

**Reflections off water are the worst.** A flat sea or lake is close to a perfect mirror at grazing angles, and gives you a strong, well-formed second path. Over-water links are notorious, and the standard fix is to raise or lower one antenna to move the reflection point somewhere less cooperative.

The general defence is **diversity**: two antennas a fraction of a wavelength apart are unlikely to be in a fade simultaneously, so the receiver picks whichever is healthier. That's what the second antenna on your router is doing.

## When the atmosphere misbehaves

Occasionally the atmosphere hands you range you didn't pay for, and it's worth recognising so you don't design around it.

Under a temperature inversion — warm air sitting over cool, common over water at dawn — the atmosphere can form a **duct** that traps radio and guides it far beyond the normal horizon. Links reach hundreds of kilometres. VHF stations appear from impossible distances.

It's real, it's unreliable, and it's seasonal. **Never plan a link on it.** Do expect it to occasionally deliver interference from a transmitter you've never had to think about, which is one more reason to hold margin.

## What this means when you're standing in a field

The whole post collapses into a short list, in order:

1. **Get height.** Both ends. It's a square-root return and it's usually the cheapest thing you can change.
2. **Walk the path if you can.** A ridge that doesn't appear on the map will end your link, and no amount of budget arithmetic reveals it.
3. **Clear the Fresnel zone, not just the sightline.** Skimming an obstacle is not clearance.
4. **Move the antenna a few centimetres** before concluding anything is broken. At 2.4 GHz that's a meaningful fraction of a wavelength.
5. **Treat water in the path as a warning.**
6. **Only then** think about power.

---

The link budget tells you whether a signal is strong enough. This post is about whether it has anywhere to go — and it's the more common failure by a distance. Most links that disappoint in the field aren't short of decibels. They're short of geometry.

Which is a slightly humbling place for radio engineering to end up: after all the arithmetic about noise floors and modulation and antenna gain, the most useful thing you can usually do is climb higher.

Next, and last: [the other thing you can do with a wave](/blog/time-of-flight/) — not carry a message on it, but time it.
