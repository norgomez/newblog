---
title: 'Antennas: Why Length Is the Whole Design'
description: 'An antenna is a piece of metal cut to a fraction of a wavelength. That one dimension explains why a car whip is a metre, a WiFi stub is three centimetres, and a submarine needs miles of wire.'
pubDate: 2026-08-11
tags: [signals, electronics]
series:
  name: 'Over the Air'
  part: 2
---

[Part 1](/blog/what-a-radio-wave-is/) ended with a piece of metal you shake charges in. This post is about why that piece of metal is the length it is — because the length is very nearly the entire design.

Look at the evidence. A car's FM whip is about a metre. The stub inside your laptop is a few centimetres. A ground station's directional array is the size of a dinner plate. And a submarine communicating at very low frequency needs an antenna measured in **kilometres** — sometimes towed behind it on a wire.

These aren't arbitrary. Each is a fraction of its own wavelength, and once you see that, antennas stop being mysterious hardware and become something closer to a woodwind instrument.

## Resonance, not transmission

The instinct is that an antenna is a pipe — energy goes in one end and squirts out the other. It isn't. An antenna is a **resonator**, and the right mental model is a guitar string or an organ pipe.

Drive current into a rod and it runs to the end and reflects back. Those forward and reflected waves interfere. At most frequencies they fight each other and very little happens. But at the frequency where the rod's length matches the wave in the right way, the reflection arrives back in step with the next push, and the current sloshes up and down the rod in a **standing wave**, building to a large amplitude for a small input.

That's resonance, and it's why a specific length matters. Off-resonance, you're pushing a swing at the wrong moment.

The classic case is the **quarter-wave** element. A rod one quarter of a wavelength long, worked against a ground plane, gives you a current maximum at the feed point and a voltage maximum at the tip — exactly the arrangement that radiates efficiently.

<figure>
	<img src="/diagrams/antenna-quarter-wave.svg" alt="Left: a quarter-wave whip above a ground plane, with current distribution greatest at the base and the length marked as a quarter wavelength. Right: its radiation pattern shown as a donut with the strongest signal out to the sides and a null straight off the tip" width="640" height="300" loading="lazy" />
	<figcaption>Current is largest at the feed point and zero at the tip. The pattern that produces is a donut — with nothing at all off the end.</figcaption>
</figure>

Run the numbers from part 1's table and the whole zoo makes sense at once:

| Band | Wavelength | Quarter-wave element |
| ---- | ---------- | -------------------- |
| VLF, 20 kHz | 15 km | **3.7 km** |
| AM, 1 MHz | 300 m | 75 m |
| FM, 100 MHz | 3 m | **75 cm** |
| 900 MHz | 33 cm | 8.3 cm |
| 2.4 GHz | 12.5 cm | **3.1 cm** |
| 5.8 GHz | 5.2 cm | 1.3 cm |

Your car's FM whip is 75 cm because a quarter wave at 100 MHz is 75 cm. The WiFi antenna is 3 cm for the same reason. The submarine's problem is now obvious too: a proper quarter-wave antenna for VLF is nearly four kilometres long, so submarines make do with something drastically too short, which is desperately inefficient — and they accept it, because at those frequencies almost nothing else gets through seawater.

**The physical size of the hardware is dictated by a number you don't control.** That's the fundamental awkwardness of radio engineering.

## Gain is focusing, not amplification

The most misread spec on any datasheet. An antenna with "12 dBi of gain" contains no amplifier and adds no energy. It's passive metal.

What it does is **concentrate** the energy it's given. Take the donut in the diagram and squash it into a beam, and along that beam the signal is far stronger — not because there's more of it, but because you took it from every other direction and pointed it one way.

Which means gain always has a bill attached:

- A **12 dBi directional** antenna is 12 dB better where it's aimed and considerably *worse* everywhere else.
- An **omnidirectional** antenna is mediocre in every direction, and never surprises you.

For a fixed link between two known points, gain is close to free money — it's the cheapest way to add margin to a [link budget](/blog/the-link-budget/). For anything that moves unpredictably, high gain is a liability: you're building a narrow beam that a moving aircraft will fly straight out of.

One convenient property: antennas are **reciprocal**. An antenna that transmits well in a direction receives equally well from it. A better ground-station antenna improves the uplink *and* the downlink, which is why upgrading one end often beats upgrading both.

## The null is where things go wrong

Look again at the donut on the right of the diagram, and specifically at what's *missing*.

A vertical whip radiates outward in all horizontal directions — and essentially **nothing straight off its tip**. There's a null directly above it. That's not a flaw; it falls out of the geometry, because the charges are oscillating along that axis and an accelerating charge doesn't radiate along its own direction of motion.

The practical consequences are constant and unforgiving:

- **Fly directly over your ground station** and the aircraft can end up in the antenna's null. Maximum signal at the horizon, a hole overhead — the opposite of the intuition that closer is better.
- **A handheld radio held sideways** is aiming its null at half the people it's trying to reach.
- **Mounting an antenna flat under a fuselage** points its strongest lobe at the sky and the ground, and its nulls fore and aft.

Antenna *placement* is as much of the design as antenna *choice*, and it's a place where the intuition that "closer must be better" fails outright.

## Matching, and where the power actually goes

One more piece, because it explains a lot of poor performance.

A transmitter expects to see a particular impedance — conventionally 50 ohms. If the antenna doesn't present that, some of the power you send up the cable **reflects back down it** instead of radiating. The measure of this is SWR, and a bad match can send a large fraction of your transmit power straight back into the amplifier, where it becomes heat rather than signal.

This is why antennas are cut for a band and why sticking a 900 MHz antenna on a 2.4 GHz radio doesn't just work slightly worse — it can work almost not at all, while the amplifier gets hot. The rod isn't resonant, the match is bad, and the energy has nowhere to go.

It's also why **cable matters more than people expect**. Coax at 2.4 GHz can lose several dB over a few metres of the cheap stuff. Those decibels are gone before your carefully chosen antenna sees them, and they come straight out of the margin.

## Polarization, again

Part 1 introduced polarization; antennas are where you pay for it. A vertical antenna makes and hears vertically polarized waves. Two antennas aligned catch everything; **90° apart they're cross-polarized** and lose 20–30 dB.

This is the single most common self-inflicted RF injury: a well-specified link, ample margin on paper, one antenna horizontal and the other vertical.

Circular polarization is the escape hatch — the field rotates as it travels, so orientation stops mattering. You pay about 3 dB for the privilege, which is why it's popular on anything that tumbles, banks, or spins.

---

A rod cut to a quarter of a wavelength, resonating like an organ pipe, radiating in a donut with a hole off its tip.

The rest of the choices — how much gain, which pattern, which polarization, where to bolt it — are all answering the same question: *given that I cannot change the wavelength, what shape do I want the energy to be?*

Next: [why you'd pick one wavelength over another](/blog/the-spectrum/) in the first place.
