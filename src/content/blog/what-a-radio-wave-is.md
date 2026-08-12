---
title: 'What a Radio Wave Actually Is'
description: 'One physical fact — accelerate a charge and part of its field tears loose and leaves at the speed of light. Every antenna, every band, every link in this series is arrangement on top of that.'
pubDate: 2026-08-10
tags: [signals, electricity]
series:
  name: 'Over the Air'
  part: 1
---

You are, right now, being passed through by several hundred conversations. Broadcast radio, a dozen phones, someone's garage door, aircraft transponders overhead, the WiFi in the next building. They occupy the same space as you, arrive simultaneously, and interfere with nothing — including each other.

That should be strange. What *is* the thing passing through you?

The answer is one physical fact, and everything in this series is arrangement on top of it: **accelerate an electric charge, and part of its field tears loose and leaves at the speed of light.**

## Three states of a charge

The cleanest way in is to watch what a single electron's field does under three conditions.

**Sitting still.** A charge has an electric field around it — the thing that would push another charge nearby. It reaches outward forever, getting weaker with distance, and it's *attached*. Nothing propagates; it just sits there.

**Moving steadily.** The field moves along with it, dragged like a wake. Still attached. Still nothing leaving.

**Accelerating.** Now something new happens. The field can't update instantly everywhere — no information travels faster than light — so the far parts of the field don't yet know the charge has changed direction. What you get is a **kink**: a mismatch between the near field, which has updated, and the far field, which hasn't. That kink propagates outward at *c*, and it doesn't come back.

That detached kink is a radio wave. Not a metaphor for one — that's the thing itself.

<figure>
	<img src="/diagrams/radio-wave.svg" alt="A vertical wire with electrons being driven up and down; a decaying sine wave travels outward to the right at the speed of light, with the wavelength marked, illustrating that only an accelerating charge sheds part of its field" width="640" height="300" loading="lazy" />
	<figcaption>An antenna is a place where you deliberately shake charges. Everything downstream is a consequence of how you shake them.</figcaption>
</figure>

So an antenna isn't a mysterious component. It's a piece of metal in which you drive electrons back and forth, and each reversal is an acceleration, and each acceleration throws a bit more field away. Drive them at two and a half billion reversals per second and you're transmitting WiFi.

## Why it needs nothing to travel through

Sound needs air. Waves need water. For a long time physicists assumed light needed *something* too, and spent decades hunting the luminiferous aether before concluding it wasn't there.

Radio needs nothing, and the reason is a feedback loop between two fields.

A **changing electric field creates a magnetic field.** A **changing magnetic field creates an electric field.** In a radio wave, each is continuously regenerating the other — the collapsing electric field builds the magnetic one, whose collapse rebuilds the electric one, over and over, tumbling forward through empty space at a speed set by nothing more than the electric and magnetic properties of the vacuum itself.

That speed is *c*. It isn't a coincidence that light travels at it: **light is this same phenomenon**, just wiggling much faster. That was Maxwell's discovery, and it remains one of the great unifications in physics — electricity, magnetism, and light turned out to be one subject.

## One number decides everything

A wave has a frequency — how many times per second the field reverses — and a wavelength, the physical distance between one crest and the next. They aren't independent:

> **λ = c ÷ f**

Pick either and the other is fixed. And because *c* is enormous, the numbers get startling in both directions:

| Frequency | Wavelength |
| --------- | ---------- |
| 60 Hz (mains hum) | **5,000 km** |
| 20 kHz (submarine comms) | 15 km |
| 1 MHz (AM radio) | 300 m |
| 100 MHz (FM radio) | 3 m |
| 2.4 GHz (WiFi, control links) | 12.5 cm |
| 60 GHz (short-range data) | 5 mm |

Hold on to that table, because **wavelength is the single most consequential number in radio.** It sets how big your antenna has to be, whether the signal bends around a hill or stops at it, how much data you can push, and who else is already using the band. Parts 2 and 3 are both downstream of this one column.

The mains-hum row is worth a second look. Alternating current in your walls *is* an accelerating charge, so it *is* radiating — at 60 Hz, with a wavelength of five thousand kilometres. Your house wiring is a hopelessly undersized antenna for that, which is why it leaks a negligible amount. But it isn't zero. That's why a cheap amplifier picks up mains hum.

## Same phenomenon, all the way up

Keep raising the frequency and nothing fundamental changes. The wave doesn't become a different kind of object. But at some point we stop calling it radio:

**radio → microwave → infrared → visible light → ultraviolet → X-rays → gamma rays**

That's one continuous spectrum with different names for different stretches, and the names are historical accidents of who discovered which part first. The boundaries aren't physics; they're vocabulary.

What *does* change with frequency is how the wave interacts with matter — because matter has structure at particular sizes, and a wave interacts most strongly with things comparable to its wavelength. Long waves sail past small objects. Short ones scatter off them. It's the same reason ocean swell ignores a buoy while ripples don't.

That single idea is most of part 3.

## Polarization: which way it wiggles

One more property, and it's the one that bites people in the field.

The electric field in a radio wave oscillates in a particular *direction* — the same direction the charges in the transmitting antenna were shaken. Shake them vertically and you get a **vertically polarized** wave.

The catch is that a receiving antenna is only sensitive to the component aligned with it. Line them up and you catch everything. Turn one 45° and you lose 3 dB. Turn it a full 90° and you're **cross-polarized** — in theory you receive nothing, and in practice 20 to 30 dB down, which is most of your [link budget](/blog/the-link-budget/) gone for no reason at all.

This is not academic. It's why handheld radios are held upright, why antennas on a mast are mounted parallel, and why an aircraft that banks steeply can drop its link — nothing is broken, the wave just stopped lining up with the antenna waiting for it.

## Never quite zero

The wave spreads over an expanding sphere, so its power falls as the square of distance. What it never does is stop.

Every broadcast ever transmitted is still travelling outward, fading toward — but never quite reaching — nothing. Whether anyone could *detect* it is a different question, and one that turns out to be about noise rather than distance, which is exactly what [the link budget](/blog/the-link-budget/) is for.

---

A charge, shaken. A kink in a field, leaving at the speed of light and never coming back. Two fields taking turns holding each other up, needing no medium and no permission.

Everything else in this series — how you launch one efficiently, which frequency to pick, how to carry information on it, whether it will arrive — is engineering laid on top of that one fact.
