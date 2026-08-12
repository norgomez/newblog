---
title: 'The Link Budget: Why Your Radio Reaches Exactly As Far As It Does'
description: 'Radio range is not a property of a radio. It is the outcome of an accounting exercise you can do on one sheet of paper — and the only number that matters at the end is the one you have left over.'
pubDate: 2026-08-10
tags: [signals, electronics]
---

Two radios sit on a bench. Same size, same antenna, same battery. One reliably works at 500 metres and the other at 30 kilometres.

The difference isn't power, or not mostly. Range isn't really a property of a radio at all — it's the outcome of a chain of gains and losses running from one transmitter to one receiver in one place on one day. There's a single sheet of arithmetic that captures the whole thing, and once you can do it, RF stops being folklore.

It's called the **link budget**, and it is exactly what it sounds like: an accounting exercise. Money in, money out, and the only figure that actually matters is what's left at the bottom.

## First: why everyone counts in decibels

RF spans an absurd range of magnitudes. A transmitter puts out half a watt; the signal arriving at the far end might be a *ten-billionth of a billionth* of a watt. Writing that arithmetic in watts is miserable.

So the field works in **decibels** — a logarithmic scale — and this turns out to be more than a notational convenience. In dB, **multiplication becomes addition**. Every gain and loss in the chain, whatever its physical cause, becomes a number you simply add up. That's why a link budget fits on one line.

Three conversions carry almost all the intuition:

| Change | In dB | Meaning |
| ------ | ----- | ------- |
| ×2 | +3 dB | double the power |
| ×4 | +6 dB | four times |
| ×10 | +10 dB | ten times |

And they stack: +20 dB is 100×, +30 dB is 1000×. Negative numbers are losses — −3 dB is half.

One more piece of notation: **dBm** is dB relative to one milliwatt, so it's an absolute power, not a ratio. 0 dBm is 1 mW, 30 dBm is 1 W, −100 dBm is a very small number of watts indeed. Gains and losses are in plain dB; power levels are in dBm.

## The budget

Now the chain. Start with what you transmit, add everything that helps, subtract everything that hurts, and see what's left when it arrives.

<figure>
	<img src="/diagrams/link-budget.svg" alt="A waterfall chart accounting for a radio link: starting at 27 dBm transmit power, adding 3 dB of transmit antenna gain, subtracting 1 dB of cable loss, subtracting 120 dB of free-space path loss over 10 km, adding 12 dB of receive antenna gain and subtracting 2 dB of receive cable loss, arriving at minus 81 dBm — well above the minus 98 dBm receiver sensitivity, leaving 17 dB of margin above the noise floor at minus 114 dBm" width="640" height="300" loading="lazy" />
	<figcaption>One column per term. The path loss is the cliff; everything else is small change by comparison.</figcaption>
</figure>

Written out, that's a UAV control link at 2.4 GHz over 10 km:

| Term | Value |
| ---- | ----- |
| Transmit power | **+27 dBm** (half a watt) |
| Transmit antenna gain | +3 dB |
| Cable and connector loss | −1 dB |
| **Free-space path loss** | **−120 dB** |
| Receive antenna gain (directional, at the ground station) | +12 dB |
| Receive cable loss | −2 dB |
| **Power arriving at the receiver** | **−81 dBm** |

Note the shape of it: one term dwarfs everything else.

## The cliff: path loss

Almost the entire budget is spent getting across the gap. Two things drive it.

**Spreading.** A transmitter radiating in all directions puts its energy on the surface of an expanding sphere. Double the distance and that surface is four times larger, so the power passing through any fixed patch is one quarter — the inverse-square law. **Doubling the range costs 6 dB**, always.

That single fact reframes everything. To double your range by brute force you need **four times the transmit power**. Conversely, doubling your power buys only about **41% more range**. Power is the worst lever you have, and it's the first one everyone reaches for.

**Frequency.** Less intuitively, higher frequencies lose more. The usual formula for free-space path loss is

> FSPL (dB) = 20·log₁₀(distance) + 20·log₁₀(frequency) + a constant

so the frequency term behaves exactly like the distance term. The physical reason isn't that high frequencies are "weaker" in flight — it's that a *simple antenna of a given type* has a smaller effective catching area at a shorter wavelength. A dipole for 2.4 GHz is physically tiny, and it intercepts correspondingly less of the passing wave.

The practical consequence is worth internalising: at 10 km, moving from 2.4 GHz down to 900 MHz gains you **8.5 dB** for free. That's most of a doubling of range for nothing but a band change — which is why long-range telemetry tends to live low and high-bandwidth video links live high.

## The floor: noise

Now, is −81 dBm enough? That question has no answer on its own, because a receiver isn't limited by how faint a signal it can detect. It's limited by how faint a signal it can detect **against the hiss**.

Every resistor, every antenna, every component above absolute zero generates thermal noise. At room temperature this works out to a floor of about **−174 dBm per hertz** of bandwidth. That's the noise in every receiver ever built, and no amount of engineering removes it.

Note the *per hertz*. Noise scales with the width of the window you listen through:

- Listen across **1 MHz** → −174 + 60 = **−114 dBm** of noise.
- Listen across **100 kHz** → **−124 dBm** — ten decibels quieter.

Which gives one of the most useful facts in all of radio: **narrow your bandwidth and you hear further.** A slow link goes further than a fast one on identical hardware, because it's listening through a narrower slit and less noise gets in. Every long-range telemetry system is a trade of data rate for distance, and this is the mechanism.

Add the receiver's own noise figure — the noise the electronics adds, say 6 dB — and the signal-to-noise ratio the demodulator needs to actually recover bits, say 10 dB, and you get a **sensitivity** of roughly −98 dBm for a 1 MHz link.

## The only number that matters

> Received −81 dBm − sensitivity −98 dBm = **17 dB of margin**

That's the whole point of the exercise. Not "does it work" — on a clear day pointed straight at each other, almost anything works. Margin is what you have left when the day is not clear.

And it gets spent, constantly:

- **Rain and foliage** absorb, and increasingly so with frequency.
- **Multipath** — the same signal arriving twice by different routes — can partially cancel itself. Fades of 10–20 dB are routine.
- **Antenna orientation.** Aircraft bank. An antenna that was pointed at you is now edge-on, and a null in the pattern can cost you 20 dB in an instant.
- **Bodies and vehicles** between the antennas.
- **Other transmitters** raising the effective noise floor in a crowded band.

A link with 3 dB of margin works on the bench and fails in the field. A link with 20 dB works in the rain, at an angle, with somebody standing in front of the antenna. The margin *is* the reliability.

## What the budget tells you to do

Once the numbers are written down, the ranking of your options stops being a matter of opinion:

**1. Raise the antennas.** Almost always the cheapest decibels available — not because height changes the formula, but because path loss above assumes a clear path, and a hill or the horizon isn't a loss, it's a wall. Getting line of sight beats every other intervention.

**2. Improve the antennas.** Gain is free power, and it's *reciprocal* — a better ground-station antenna helps both directions. The catch is that antenna gain comes from focusing: a 12 dB antenna is 12 dB better only where it's pointed, and worse everywhere else. You are trading coverage for reach.

**3. Slow down.** Halving the data rate narrows the bandwidth and lowers the noise floor. Free range, paid for in throughput.

**4. Move down in frequency**, if the band is available and you don't need the bandwidth.

**5. Fix the plumbing.** Cheap coax at 2.4 GHz can eat several dB over a few metres. That's a chunk of margin lost to a cable nobody thought about.

**6. Finally, add power.** Last, because of the 6 dB rule: quadrupling your transmit power doubles your range, drains your battery, heats your amplifier, and may put you over a legal limit — while a better antenna might have handed you the same 6 dB for the price of a bracket.

---

None of this is difficult mathematics. It's addition, once you've agreed to count in decibels. But it converts a question that sounds like it needs experience — *will this link hold?* — into one sheet of arithmetic with a number at the bottom.

And that number is never "yes." It's how much room you have before the answer becomes no.
