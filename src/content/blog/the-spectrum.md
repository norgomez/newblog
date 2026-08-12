---
title: 'The Spectrum Is Real Estate'
description: 'Why AM radio crosses an ocean at night while your WiFi cannot cross a hallway. Choosing a frequency decides your range, your data rate, your antenna size, and who you have to share with — all at once.'
pubDate: 2026-08-12
tags: [signals, electronics]
series:
  name: 'Over the Air'
  part: 3
---

Two facts that sit badly together.

An AM broadcast at 1 MHz can, on a good night, be heard across an ocean — from a transmitter putting out a few kilowatts. Your WiFi router, in the same room, gives up somewhere around the second interior wall.

The WiFi router is not worse engineering. It's a different piece of real estate, and the whole of radio design comes down to which plot you build on. Frequency isn't one parameter among many — it decides your reach, your data rate, your antenna size, and your neighbours, simultaneously and mostly against your wishes.

## Wavelength versus the world

[Part 1](/blog/what-a-radio-wave-is/) noted that a wave interacts most strongly with objects comparable to its own wavelength. That single principle drives nearly everything below.

A 300-metre AM wave meets a house and barely notices it. The house is a thousandth of a wavelength — effectively a speck. The wave **diffracts** around it, the way ocean swell rolls past a buoy without caring.

A 12.5-centimetre WiFi wave meets the same house and the house is *enormous* by comparison. Walls are a meaningful fraction of a wavelength. They absorb, reflect, and scatter. The wave does not roll past; it gets chewed up.

Same physics, same house, opposite outcome — because the ruler changed.

<figure>
	<img src="/diagrams/spectrum-ladder.svg" alt="A ladder of frequency bands from VLF at 20 kilohertz through AM, FM, 900 megahertz, 2.4 gigahertz, 5.8 gigahertz and 60 gigahertz, with wavelength and typical use for each, and bars showing data capacity growing as frequency rises" width="640" height="300" loading="lazy" />
	<figcaption>Everything improves in one direction and gets worse in the other. There is no band that is simply better.</figcaption>
</figure>

## Going up buys capacity

The reason anyone climbs the spectrum at all is bandwidth, and the argument is almost embarrassingly simple.

Usable bandwidth is roughly proportional to carrier frequency — a channel is some percentage of where it sits. Take 10% as a rough figure:

| Carrier | 10% of it |
| ------- | --------- |
| 100 MHz | 10 MHz |
| 2.4 GHz | 240 MHz |
| 60 GHz | **6,000 MHz** |

And bandwidth converts *directly* into data rate. [Shannon's theorem](/blog/the-link-budget/) — the hard ceiling on any channel — says capacity scales **linearly** with bandwidth but only **logarithmically** with signal-to-noise. Doubling your bandwidth doubles your throughput. Doubling your transmit power buys you a few percent.

So if you need to move a lot of data, you go up. There is no realistic way to stream video over a band 10 kHz wide, no matter how much power you have. The room simply isn't there.

Going up also shrinks the antennas — a quarter wave at 60 GHz is about a millimetre — which is why high-frequency gear can be small, and why a *high-gain* antenna at high frequency can still fit in your hand. That's the second reason to climb.

## Going down buys reach

The other direction buys everything the first one gives away.

**Diffraction.** Low frequencies bend around hills and buildings. There's still usable signal in the shadow. High frequencies cast sharp shadows — behind an obstacle you get essentially nothing.

**Penetration.** Long waves pass through walls, foliage, and to a limited extent seawater. This is why submarines use VLF despite needing absurd antennas: it's one of very few things that gets through water at all.

**Absorption.** The atmosphere is nearly transparent at low frequencies and progressively less so as you climb. Rain attenuates seriously above about 10 GHz. Oxygen has an absorption peak near 60 GHz, which is why that band is excellent for short links you *want* to keep local — the air itself stops your signal from becoming someone else's interference.

**Free-space path loss.** From the [link budget](/blog/the-link-budget/): for simple antennas, higher frequencies lose more over the same distance. At 10 km, moving from 2.4 GHz down to 900 MHz gains you **8.5 dB** — most of a doubling in range, for nothing but a band change.

That last one is why long-range telemetry lives low and video downlink lives high, often on the same aircraft. They aren't competing choices; they're different jobs.

## The ionosphere, and why night is different

The oddity that explains the ocean-crossing AM signal.

Sunlight ionizes the upper atmosphere, creating charged layers that **reflect** certain radio frequencies back toward the ground. Below roughly 30 MHz, a signal aimed skyward can bounce off the ionosphere, return to earth hundreds of kilometres away, bounce off the ground, and go up again. It's called **skip**, and it lets modest shortwave transmitters reach around the planet.

At night the lowest ionospheric layer — the one that mostly *absorbs* AM broadcasts during the day — largely disappears, and the reflecting layers above it take over. Distant stations that were inaudible at noon come booming in after dark.

Above about 30 MHz the ionosphere stops reflecting and the signal punches straight through into space, which is exactly what you need for satellites and GPS, and exactly why FM doesn't skip. The same property that lets shortwave circle the globe would make satellite communication impossible.

## Who else is here

The final constraint isn't physics at all. Spectrum is finite, so it's regulated, allocated, and in the profitable parts, auctioned for enormous sums.

Which is why so much unlicensed equipment is crowded into a few **ISM bands** — slices set aside for industrial, scientific and medical use where you can transmit without a licence, provided you accept interference from everyone else doing the same. 2.4 GHz is the busiest: WiFi, Bluetooth, cordless phones, drone control links, wireless mice, baby monitors, and microwave ovens all in one room, all shouting.

Worth killing a myth here, since it's repeated constantly: **microwave ovens do not use 2.45 GHz because it's the resonant frequency of water.** Water has no such sharp resonance in that region — if it did, the energy would all be absorbed in the outer millimetre and your food would burn outside and freeze inside. 2.45 GHz was chosen largely because it was an available ISM allocation with a penetration depth that cooks food evenly. The oven is in your WiFi band for regulatory reasons, not physical ones.

Part 4 is partly about how you survive a neighbourhood like that.

## There is no best band

Set it out plainly:

| | Low frequency | High frequency |
| --- | --- | --- |
| Range | far | short |
| Obstacles | bends around | stopped by |
| Bandwidth | tiny | enormous |
| Antenna size | large | small |
| Rain and foliage | ignores | attenuated |
| Congestion | crowded, valuable | more room |

Every row trades against another. A system that needs range, penetration, and high data rate cannot have all three, and the engineering is in deciding which one to give up.

That's why a modern drone carries **two** radios: a low, narrow, stubborn link for control and telemetry that must never drop, and a high, wide, fragile one for video that can afford to. Not redundancy — two different plots of real estate, bought for two different purposes.

---

You don't choose a frequency the way you choose a component. You choose a set of physical behaviours that come bundled, and then design around whichever one hurts.

Next: [how you get information onto the wave](/blog/modulation/) once you've picked where to put it.
