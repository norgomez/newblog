---
title: 'How Generators Work: Where Every Watt Comes From'
description: 'Move a wire through a magnetic field and a voltage appears — the single fact behind almost every watt you have ever used, and why drawing power makes the engine work harder.'
pubDate: 2026-07-21
---

Almost every watt of electricity you have ever used came out of a spinning magnet. The grid that lights your house, the system that keeps your car's battery topped up, the roaring box someone rolls out during a blackout — all the same machine, at wildly different sizes. Batteries and solar panels are the honorable exceptions; everything else is a magnet going around and around.

And it is the [electric motor](/blog/how-electric-motors-work/) from last time, run backwards.

The motor rested on one physical fact: a wire carrying current through a magnetic field feels a sideways push. The generator rests on that same fact read in the mirror: **move a wire through a magnetic field and a voltage appears across it.** The field shoves the free charges in the wire sideways, piling them up at one end — that pile-up *is* voltage. Move the wire the other way and the voltage flips. Motors take current and give you motion; generators take motion and give you current. Same copper, same magnets, arrow reversed.

## The loop makes a wave

Bend the wire into a loop, hang it between a magnet's north and south poles, and spin it. Each side of the loop sweeps through the field, and a voltage is pushed along it — but not a constant one. The voltage is largest when the wires are slicing *straight across* the field lines, and it falls to nothing for an instant when they are gliding *along* them, cutting nothing. Around the loop goes: swelling to a peak, sinking through zero, reversing, swelling the other way. A sine wave.

<figure>
	<img src="/diagrams/generator-loop.svg" alt="A coil spinning between a north and south magnetic pole, with its output drawn as a sine wave: the voltage peaks when the coil cuts straight across the field and falls to zero when it slides along the field" width="640" height="320" loading="lazy" />
	<figcaption>Spin a loop in a field and the voltage rises, falls, and reverses with the angle. Alternating current isn't a design decision — it's simply what a rotating loop naturally makes.</figcaption>
</figure>

There's a lovely counterintuitive twist hiding here. The voltage peaks not when the most magnetic field is passing *through* the loop, but when the field through it is momentarily zero and changing fastest. It is never the *amount* of field that generates voltage — only the **rate at which it changes**. A loop held still between the poles, however strong the magnet, produces exactly nothing. Motion is the whole point, which is why a generator that stops turning stops making power the same instant.

## Folding it into DC: the dynamo

A sine wave is what the loop wants to give you, but the earliest electrical world ran on steady [direct current](/blog/how-batteries-work/) — the kind a battery makes. So the first generators borrowed the brushed motor's trick in reverse: a **commutator**, that little rotating switch of split rings and dragging brushes. In the motor it fed current into the loop in the right direction twice a turn; in a generator it does the opposite job, flipping the *output* connection every half turn so the wave's negative humps get folded up to join the positive ones. The result is bumpy, one-directional DC. That machine is a **dynamo**, and its brushes are exactly the weakness they were in the motor — they spark, wear, and waste power.

## Flip it inside out: the alternator

The modern move is the same one that gave us the [brushless motor](/blog/how-electric-motors-work/): stop dragging power through sliding contacts. Keep the heavy power-carrying windings *stationary* on the outside, and spin a **magnet** past them instead. The output comes off fixed terminals — no commutator in the high-current path — and you turn the raw AC into DC afterward with a handful of diodes, which are just one-way valves for current with no moving parts at all.

That is an **alternator**, and it is why your car has one instead of a dynamo. But notice the sleight of hand: the thing spinning is now an electromagnet, and an electromagnet needs its own current. A small current is fed to the spinning rotor through modest slip rings to make its field — and because that current is small, controlling *it* is an easy way to control the whole machine's output. Turn the rotor's current up, the output climbs; ease it down, the output sags. That little dial is the **voltage regulator**, holding your car's electrical system at a steady ~14 volts whether the engine is idling or screaming. (The very first spin cheats, too: a trace of leftover magnetism in the iron generates just enough to bootstrap the field, which then builds itself up — a generator pulling itself up by its own magnetic bootstraps.)

## The part that answers "why": it pushes back

Here is the question the whole post is really about. When you pull power out of a generator, where does that energy *come from*? It cannot come from nowhere.

It comes from your hand — or the engine, or the falling water. Watch what happens the moment you draw current: that current now flows through the very windings sitting in the magnetic field. And a current-carrying wire in a magnetic field feels a push — *that was the motor's fact.* So the loop you are turning suddenly feels a force, and by an iron rule of physics ([Lenz's law](/blog/how-electricity-actually-works/), nature stubbornly resisting the change) that force points **against your rotation.** The generator fights you back.

Drive it with nothing connected and it spins almost freely. Connect a bigger and bigger load and it gets harder and harder to turn — until, at a dead short, it nearly locks. The mechanical work you put in reappears as the electrical energy you take out, watt for watt, minus friction and heat. A generator is not a source of energy; it is an exquisitely honest converter of it.

Once you feel that, three everyday things click at once:

- A backup **generator's engine bogs down** and its note drops the instant the refrigerator's compressor kicks on — you just handed it a bigger load, and it pushed back harder against the engine.
- An [EV brakes by regeneration](/blog/what-evs-delete/): the wheels drive the motor *as a generator*, and the push-back is what slows the car — with the bonus that the energy of stopping refills the battery instead of cooking a brake disc.
- **Wind turbines** feel the wind get "heavier" on the blades as they generate more; the electrical load is literally what harvests the wind's energy.

## One machine, two names

You can hold the whole idea in a single sentence: **a generator is a motor run backwards, and a motor is a generator run forwards.** This is not a poetic comparison — it is the same iron and copper. Every motor, spun by hand, produces a voltage (the "back-EMF" that quietly throttles its own appetite for current). Every generator, fed a voltage, tries to spin up as a motor. The line between *using* electricity and *making* it turns out to be almost nothing — just which way the energy happens to be flowing through the same object.

Scale that spinning loop up to the size of a locomotive and you have the machines in every power plant: a giant electromagnet turned by steam, or falling water, or wind, inside a ring of stationary windings. They all turn in lockstep so their sine waves line up — and **60 Hz** (or 50, elsewhere) is nothing more mysterious than how many times that magnet comes around each second. Plug a new generator into the grid and it has to match the rhythm of every other, or the grid will yank it into step hard enough to shear a shaft.

| Generator | How it's built | Output | Where you'll meet it |
| --------- | -------------- | ------ | -------------------- |
| Dynamo | Commutator + brushes | Bumpy DC | Old cars, bike lights, hand cranks |
| Alternator | Spinning field, fixed coils, diodes | Rectified DC | Every modern car |
| Synchronous AC | Spinning electromagnet, fixed windings | Clean AC | Power plants, standby gensets |
| Induction | Magnet-free cage, driven above sync speed | AC (needs the grid) | Wind turbines |

One physical fact, run backwards. The motor turns current into motion; the generator turns motion into current; and because it is literally the same machine, a spinning rotor pushes back on you exactly as hard as you ask it to give.
