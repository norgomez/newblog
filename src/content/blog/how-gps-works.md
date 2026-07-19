---
title: 'How GPS Knows Where You Are'
description: 'Atomic clocks, a lot of geometry, and a correction for Einstein — the engineering inside the most casually magical thing you own.'
pubDate: 2026-07-20
---

Your phone finds its position anywhere on Earth, for free, using satellites it never talks to. That last part surprises people: **GPS is receive-only.** The satellites don't know you exist. Twenty-four-plus spacecraft simply broadcast, nonstop, and any receiver that can hear four of them can compute where it is. Here's how that trick actually works.

## The broadcast: a clock reading and an orbit

Each GPS satellite carries atomic clocks and continuously transmits, in essence, one sentence:

```text
"This is satellite 17. The time is EXACTLY 14:02:07.000000000.
 Here is my precise orbital position."
```

That's the entire signal. No maps, no processing on the satellite's side, no channel back. The intelligence is all in your receiver.

## Step one: turn time into distance

Radio travels at the speed of light — about 300,000 km/s, or more usefully: **30 centimeters per nanosecond**. Your receiver compares the timestamp in the signal against its own clock:

```text
signal says:        14:02:07.000000000
received at:        14:02:07.067000000
flight time:        0.067 s
distance = c × t ≈  20,100 km
```

Now you know you're exactly 20,100 km from satellite 17 — which places you somewhere on the surface of a giant sphere centered on it. One sphere narrows you down barely at all. Two spheres intersect in a circle. Three spheres intersect at just two points — and one of them is usually out in space or moving at absurd speed, so it's discarded. Three satellites, in principle, pin you down.

## Step two: the fourth satellite, or why your watch is a liar

There's a fraud in that calculation. The satellite's clock is atomic — stable to nanoseconds. Your phone's clock is a cheap quartz crystal, and at 30 cm per nanosecond, being off by *one millisecond* puts you **300 kilometers** from where you think you are.

The solution is one of the most elegant moves in engineering. Your receiver treats its own clock error as a fourth unknown, alongside x, y, z. Four unknowns need four equations — so it listens to a **fourth satellite** and solves the system:

```text
unknowns:   x, y, z, clock_error
equations:  distance to sat 1 = f(x, y, z, clock_error)
            distance to sat 2 = …
            distance to sat 3 = …
            distance to sat 4 = …
```

The numbers only reconcile for one combination of position *and* clock error. A side effect: every GPS fix also disciplines your phone's clock to atomic accuracy. GPS isn't just a positioning system — it's how cell towers, power grids, and stock exchanges get their time.

## Step three: apologize to Einstein

Here's the part that sounds like trivia and is actually load-bearing. The satellite clocks run at a *measurably different rate* than clocks on the ground:

- **Special relativity:** the satellites orbit at ~14,000 km/h, and moving clocks tick slower — about 7 microseconds per day.
- **General relativity:** they sit higher in Earth's gravity well, where clocks tick *faster* — about 45 microseconds per day.

Net effect: satellite clocks gain **~38 microseconds per day**. At 30 cm per nanosecond, ignoring that would corrupt positions by roughly **10 kilometers per day** — the system would be useless by lunchtime. So the clocks are deliberately manufactured to run slightly "wrong" on the ground, such that they run exactly right in orbit. Relativity isn't a theory GPS engineers debate; it's a line item in the spec.

> Every time your phone draws that blue dot, it has solved a four-dimensional geometry problem using signals fainter than a light bulb seen from 20,000 km — and corrected for the curvature of spacetime along the way.

## Why it's meters, not millimeters

The error budget is a stack of small insults: signals bend as they cross the ionosphere, bounce off buildings before reaching you (*multipath* — the reason your dot drifts downtown), and the satellite geometry isn't always favorable. Consumer receivers land within a few meters. When engineers need centimeters — surveying, self-driving tractors — they add a second receiver at a known location broadcasting corrections (RTK), which cancels most shared errors.

Your phone also cheats pleasantly: it downloads satellite orbits over the internet instead of the satellites' glacial 50-bits-per-second broadcast, and fuses in Wi-Fi and cell-tower positions. That's why the dot appears in seconds rather than the minutes a bare GPS cold start actually takes.

---

The receive-only design is the quiet masterpiece. Because satellites never answer anyone, the system serves one user or eight billion identically, anonymously, at zero marginal cost. It's one of the best pieces of infrastructure engineering ever shipped — and it fits in your pocket, next to your keys.
