---
title: 'Modulation: Putting Information on a Wave'
description: 'A perfect sine wave carries no information at all. There are exactly three things about it you can change — and every radio system ever built is a choice about which, and how far to push it.'
pubDate: 2026-08-13
tags: [signals, electronics]
series:
  name: 'Over the Air'
  part: 4
---

Here's a fact worth sitting with: **a perfect, unwavering carrier wave conveys nothing.**

Switch on a transmitter emitting a flawless 2.4 GHz sine wave and leave it running. A receiver can confirm it's there — and that's the complete list of what it learns. After the first cycle, every subsequent one is entirely predictable, and something perfectly predictable carries no information by definition.

To send anything, you must **change** something. And a sine wave, mathematically, has exactly three properties available to change:

- how **big** it is — amplitude
- how **fast** it wiggles — frequency
- **where in the cycle** it happens to be — phase

That's not a list of popular options. That's the complete set. Every modulation scheme ever devised, from a spark-gap transmitter to a 5G handset, is some combination of those three.

<figure>
	<img src="/diagrams/modulation.svg" alt="Four stacked waveforms: an unvarying carrier conveying nothing, then amplitude modulation where the envelope swells and shrinks, frequency modulation where the wave compresses and stretches, and phase modulation where the wave abruptly flips mid-cycle" width="640" height="300" loading="lazy" />
	<figcaption>Top: a carrier, saying nothing. Below: the only three things you can do to it.</figcaption>
</figure>

## The three, and their personalities

**Amplitude (AM).** Make the wave bigger and smaller. Dead simple to build — an AM receiver can be a diode, a coil, and an earpiece, with no power supply at all. Its weakness is equally simple: most natural interference *is* amplitude noise. Lightning, motor brushes, and switching supplies all add spikes, and the receiver has no way to tell those from your signal. It's why AM radio crackles under a thunderstorm.

**Frequency (FM).** Speed the wave up and slow it down. The amplitude now carries nothing, so the receiver can simply clip the signal flat and throw amplitude information away — and with it, most of the noise. That's why FM sounds clean where AM hisses. You pay in bandwidth: FM occupies far more spectrum for the same message.

**Phase (PM).** Shift where in the cycle the wave is. Hardest to grasp intuitively — nothing about a snapshot looks different — but it's what nearly all digital radio runs on, because "flip the phase by 180°" is an unambiguous, instantly detectable event.

## Going digital: symbols instead of waves

For digital data, the same three knobs get used in **discrete steps**. Instead of varying smoothly, you pick from a small set of defined states and hop between them. Each state is a **symbol**, and each symbol carries some bits.

- Two phase states → 1 bit per symbol (**BPSK**)
- Four phase states → 2 bits per symbol (**QPSK**)
- Sixteen combined amplitude-and-phase states → 4 bits (**16-QAM**)
- 256 states → **8 bits per symbol** (256-QAM)

Which looks like free money — just add more states and send more data at the same symbol rate. There's a catch, and it's the central tradeoff of digital radio.

The states live in a fixed space. Add more of them and they crowd together. With two states they're at opposite ends and nothing short of catastrophe confuses them. With 256, they're packed tightly, and a modest amount of noise is enough to land a received symbol closer to its neighbour than to the one you sent — a bit error.

**Denser modulation needs a better signal-to-noise ratio.** That's the deal, always.

It's also why your WiFi speed changes as you walk around the house without anything reconfiguring. The link is continuously measuring SNR and re-picking its modulation: dense and fast next to the router, sparse and slow at the end of the garden. That's **adaptive modulation**, and it's why the connection degrades gracefully rather than dropping dead.

## Shannon's ceiling

There's a hard limit on all of this, and it's one of the most important results in engineering:

> **capacity = bandwidth × log₂(1 + signal-to-noise)**

Claude Shannon proved in 1948 that no scheme, however clever, can beat it. It isn't a limit on today's technology; it's a limit on what is possible.

Read the shape of it and the strategy for the whole field falls out:

| | Effect on capacity |
| --- | --- |
| Double the **bandwidth** | **Double** the capacity |
| Add 10 dB of **SNR** | Roughly 3.3 more Mbps per MHz |

Bandwidth enters **linearly**; signal-to-noise only **logarithmically**. Concretely, on a 1 MHz channel:

- at 10 dB SNR → 3.46 Mbps
- at 20 dB SNR → 6.66 Mbps
- at 30 dB SNR → 9.97 Mbps

Ten decibels — a **tenfold** increase in power — buys you less than double. Whereas simply having twice the bandwidth doubles it outright.

This is the mathematical backing for what [part 3](/blog/the-spectrum/) argued: if you need throughput, you go up in frequency where the bandwidth is, and you do *not* try to power your way there. It's the same conclusion the [link budget](/blog/the-link-budget/) reaches from the other direction — power is the weakest lever you have.

## Spending bandwidth on toughness instead

Now the counterintuitive move: sometimes you deliberately use *far more* bandwidth than your data needs, and get nothing back in speed.

**Frequency hopping.** Rather than sitting on one channel, the transmitter and receiver hop together through dozens of them, many times a second, following a sequence both know. A jammer or an interferer sitting on one channel now only corrupts the brief moments you're there. Everything else gets through.

The idea was patented in 1942 by the composer George Antheil and the film actress **Hedy Lamarr**, as a way to stop radio-guided torpedoes being jammed — the hop sequence encoded on a mechanism borrowed from a player piano. It was decades ahead of hardware that could use it, and it's now in Bluetooth and in essentially every drone control link.

**Direct-sequence spreading.** Multiply your data by a much faster pseudo-random code, smearing a narrow signal across a wide band at very low power per hertz. The receiver, knowing the code, correlates and pulls the signal back together — while uncorrelated interference just spreads out and stays flat. It's the same underlying trick as [pulse compression in radar](/blog/time-of-flight/): build recognisable structure into what you send, and you can recover it from a much worse signal than the raw waveform should allow.

Spread-spectrum signals can be received *below the noise floor*, which is how GPS works. The satellite signal reaching your phone is weaker than the thermal noise around it. You cannot hear it, in any ordinary sense. The correlation finds it anyway.

## What the choice actually says

Look at what a system chose and you can read what it feared:

| System | Scheme | What it optimised for |
| ------ | ------ | --------------------- |
| AM broadcast | amplitude | receivers so cheap they need no battery |
| FM broadcast | frequency | audio quality, noise immunity |
| GPS | spread spectrum | recovery from below the noise floor |
| Bluetooth | frequency hopping | surviving a crowded band |
| WiFi | adaptive QAM | maximum throughput at close range |
| Drone control link | narrow, hopping, low rate | never, ever dropping out |
| Drone video link | wide, dense QAM | throughput, accepting it may drop |

The last two rows are the same aircraft. One link is built never to fail and carries almost no data; the other carries a great deal and is allowed to break. Once you can read modulation choices this way, hardware datasheets start telling you what the designers were afraid of.

---

Three properties. That's the whole toolbox: bigger, faster, shifted.

Every radio you've used is a decision about which of those to vary, how many distinct states to attempt, and whether to spend bandwidth on speed or on stubbornness. Shannon set the ceiling in 1948 and nobody has beaten it since — the engineering is entirely about how close you get, and what you're willing to trade to get there.

Next: [whether the signal arrives at all](/blog/the-link-budget/).
