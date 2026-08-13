---
title: 'Making Batteries Explode on Purpose'
description: 'For two years part of my job was wrapping heater wire around lithium cells and cooking them until they let go, with sensors and cameras watching. Here is what that test is actually asking, and why the answer is almost never "it stopped the fire."'
pubDate: 2026-08-17
tags: [electricity, sensors, manufacturing]
---

There is a category of engineering test where success looks like a fire.

For a stretch of my time as a machine build technician at a battery pack manufacturer, a recurring part of the job was destructive safety validation: take a lithium cell, wrap resistance wire around it with more care than the outcome seems to deserve, and heat it until it fails catastrophically — while a lot of instrumentation watches it happen. Then do the same thing to a cell buried inside a module. Then to a module buried inside a full pack, with the coolant loop filled and the potting foam in place, to find out whether any of that changes what happens next.

It sounds like the fun part of the job. It is mostly patience, wiring, and cable management, punctuated by about ninety seconds of extremely expensive event.

But the reason the test exists is worth understanding even if you never do one, because it explains something about lithium batteries that spec sheets never quite say out loud.

## The thing you are provoking

[A battery is a chemical argument held apart](/blog/how-batteries-work/) — two materials that want to react, separated by a thin polymer film, with the electrons forced to detour through your device. Everything good about lithium-ion comes from how much energy that argument stores in how little mass. Everything dangerous comes from the same sentence.

Under normal use the reaction is metered out slowly. **Thermal runaway** is what happens when it stops being metered.

The cascade is disappointingly ordinary at every individual step:

<figure>
	<img src="/diagrams/thermal-runaway.svg" alt="Four stacked stages of thermal runaway with rising temperatures: around 90 degrees the SEI layer breaks down and the cell begins self-heating; around 140 degrees the separator melts causing an internal short; around 210 degrees the cathode releases oxygen, supplying its own oxidiser; above 600 degrees the cell vents and flames and begins heating its neighbours. A dashed line between the second and third stages marks the point of no return, above which heat is supplied externally and below which the cell generates its own" width="640" height="320" loading="lazy" />
	<figcaption>No single step is exotic. The problem is entirely that each one pays for the next.</figcaption>
</figure>

Warm the cell past roughly 90 °C and the passivation layer on the anode — the same [SEI crust](/blog/how-batteries-work/) that slowly eats your phone's capacity over two years — starts decomposing exothermically. That releases heat, which raises the temperature, which decomposes more of it.

Near 140 °C the polymer separator melts. The one physical barrier keeping anode from cathode is now a puddle, and the cell shorts internally — dumping its stored charge as heat, inside itself, in seconds.

Past about 210 °C the cathode begins breaking down and **releasing oxygen**.

That last one is the whole story, and it is the fact most people are missing when they reason about battery fires. A burning lithium cell is not a fire in the ordinary sense of fuel meeting air. It carries its own oxidiser. You can put it in a nitrogen atmosphere and it will keep going. You can dunk it and it will keep going. Smothering is a strategy for fires that need something from the outside, and this one does not.

> Below about 140 °C you are heating the cell. Above it, the cell is heating you. The entire discipline of battery safety is arithmetic about which side of that line you are on and how fast you crossed it.

## Why you heat it rather than stab it

There are three standard ways to trigger a runaway on purpose, and the choice tells you what question you are asking.

**Nail penetration** drives a spike through the cell to force an internal short. It is fast, dramatic, and honestly represents a crash. It is also poorly repeatable — the result depends on nail geometry, speed, exactly which layers it bridges, and whether the nail itself conducts heat away. Two identical cells give you two different tests.

**Overcharge** pushes current in past full and lets plated lithium and gas generation do the work. Realistic for a charger fault, slow, and it changes the cell's state before the event.

**External heating** wraps a resistive element around the cell and raises its temperature at a controlled rate until it goes. And that is usually the one you want, for an unglamorous reason: **it is the only trigger where you know exactly how much energy you put in and when.**

That matters more than it sounds. If you are trying to answer "does the foam delay propagation," you need cell number one to fail the same way every time, or you are measuring your trigger's variance rather than your pack's behaviour. Heater wire gives you a known watts-in, a known ramp rate, and a clean baseline to subtract when the cell starts producing its own heat. The moment the measured temperature rises faster than your heater can account for, the cell has taken over. That divergence *is* the onset, and you cannot see it cleanly with a nail.

Hence the care in the wrapping, which is the part that reads as fussy from outside:

- **Even contact.** A gap under the wire means a cold spot and a hot spot, and the cell fails wherever the hot spot is instead of where the physics says. Uniform pitch, uniform tension, full contact along the can.
- **Electrical isolation.** The heater is wrapped around a conductive steel can holding several volts. Compromised insulation gives you a short circuit and a completely different experiment.
- **Thermocouple placement, agreed before anything is wrapped.** Whatever you tape to the can gets buried under the heater; a sensor sitting under a hot wire reads the wire, not the cell. Where the junction goes and what sits between it and the heater is a decision, not a detail.
- **Strain relief on everything.** The cell will vent violently. Every wire you care about needs to be anchored somewhere that will still exist afterwards.

Nothing here is difficult. It is all just the kind of thing that, done casually, produces a day of data that means nothing and a cell you cannot get back.

## Instrumenting something that is about to destroy your instruments

This is the genuinely interesting engineering problem, and it is one that almost no other kind of [sensing work](/blog/sensors-how-projects-perceive/) forces on you.

Every measurement you want is *inside* the thing that is about to burn. Your sensors are consumables. Your wiring is consumable. The event lasts a few seconds and cannot be repeated, because both the article and half the fixture are gone afterwards. There is no second take.

Which leads to a specific set of habits:

**Thermocouples, lots of them, and thin.** Type K, because it survives the range — a fine-gauge junction reads fast enough to catch a hundred-degree-per-second climb, whereas a chunky probe averages away the very transient you flew everyone in to see. You place them at the trigger cell, at each of its immediate neighbours, at the module wall, on the coolant line, and outside the enclosure. Propagation is a question about *where the heat went*, so the answer only exists if you instrumented the path.

**Voltage taps on individual cells.** Temperature tells you the cell got hot. Voltage collapse tells you the moment the separator failed, usually a beat before the thermal signature arrives. Two independent views of the same instant, which is how you tell a real event from a sensor artefact.

**Pressure and gas.** A venting cell releases a large volume of hot, flammable gas very quickly. In an enclosed pack, whether that gas escapes through a designed vent or finds its own path through the housing is a structural question with safety consequences, and you only answer it with pressure transducers and a sealed test volume.

**Cameras, plural, and different kinds.** A high-speed camera gives you the mechanics of the vent and the direction the ejecta travelled. A thermal camera gives you the field — where heat spread across a surface between the points you happened to instrument. A plain camera at normal frame rate gives you the thing you will actually show people, which matters more than engineers like to admit. All of them behind something, all of them looking through something sacrificial.

**Everything logged remotely, fast, and redundantly.** High sample rate, because a runaway is a millisecond-scale event living inside a minutes-long test. Off-board, because the logger cannot be in the room. Redundant, because the single worst outcome in destructive testing is a clean event with no data — you have spent the hardware and bought nothing.

That last point drives the [cable routing](/blog/running-cable/) more than anything else. Sensor leads get bundled away from the expected vent path, sleeved, and anchored, not for the sensor's sake but so the wire survives the extra two seconds it takes to record what happened after the cell let go. The most valuable data in the whole test is the last half-second, and it is exactly the half-second most likely to be lost to a melted lead.

## Cell, module, pack — three different questions

The tests look similar and ask completely different things.

**One cell, on its own.** This is characterisation. How much energy comes out, how fast, in which direction, how much gas, at what onset temperature. You are building a number to design against. A 21700 cell holding around 18 Wh releases considerably more than its stored electrical energy when it goes — the chemical decomposition contributes too — so a rough working figure is on the order of 130 kJ from a cell you can hold in your hand.

**One cell inside a module.** Now the question changes to: *does it take its neighbours with it?* A single cell failing is a manageable event. A module going as a unit is not. What you are measuring is time-to-propagation, or ideally the absence of propagation — and the design levers are spacing, the thermal path between cells, the barriers between them, and where the vent gas is allowed to go.

**A module inside a full pack.** The realistic case, with coolant in the loop and foam in the voids. Here you are asking whether the pack as an assembled system contains the event, and for how long.

The scaling is what makes anyone care. A hundred of those cells is a modest 1.8 kWh pack — and if every one of them runs away, that is around **13 megajoules** of energy release. Vehicle packs are much larger. The difference between "one cell failed" and "the pack failed" is several orders of magnitude, and it is decided in the first sixty seconds by whether cell number two got hot enough.

## What the coolant and the foam actually do

Here is where the test earns its cost, and where the answer is more interesting than the one people expect.

**Liquid coolant has real thermal capacity, and it is not enough on its own.** Run the numbers: around 130 kJ from one cell dumped into a litre of water-glycol raises it about 40 °C. Which sounds encouraging until you notice the two assumptions hidden in it — that the heat actually reaches the coolant, and that there is only one cell. A runaway is fast and local; the coolant channel is a couple of millimetres of aluminium away, and heat transfer takes time the event does not give you. What coolant genuinely does well is pull heat out of the *neighbouring* cells, the ones sitting at 100 °C and climbing, deciding whether to join in. It is a propagation intervention, not a fire extinguisher.

**And it has a second-order behaviour you have to test rather than reason about.** A coolant line that ruptures into a runaway does something. It may quench locally, it may flash to steam and pressurise the enclosure, it may do nothing useful at all. Whichever it is, that outcome is a property of your specific geometry, and no simulation will tell you as convincingly as the transducer trace will.

**Foam is a barrier, not a heat sink.** Potting and intumescent materials work by blocking the conduction and convection paths between cells and by charring into an insulating layer that holds position under flame. They add mass and they cost money and they make the pack harder to service, and the case for them lives entirely in whether the propagation time changes.

And here is the honest finding that the whole exercise usually converges on:

> Mitigation rarely prevents the fire. It buys minutes. Minutes are the product.

That is not a disappointing result — it is the actual design target. Battery safety regulation is largely written in units of time: the requirement is that occupants get sufficient warning and sufficient time to get out before the hazard reaches them. Nobody has promised that a pack subjected to a cell-level failure will be fine. The promise is that it will not go from fine to lethal without warning.

So the number that comes out of a good propagation test is not pass or fail. It is *how long*, and where the heat went while that clock ran.

## Why it has to be physical

The reasonable question is why any of this is still done with real hardware and real fire when thermal simulation is as good as it is.

Because the models are calibrated against these tests, for one. But more importantly, because the interesting failures are the ones nobody modelled. Vent gas finding an unintended path through a seam. A busbar softening and shifting. A sensor lead acting as a heat pipe and quietly ruining a channel. A foam that behaves beautifully in a coupon test and shrinks away from the surface at rate. Every one of those is geometry- and assembly-specific, and every one shows up as a surprise in the video, not as a term in the equation.

It is the same reason you [test a machine after you build it](/blog/pick-and-place-gantry/) rather than trusting the CAD. The model contains what someone thought of.

---

The strange part of that work was how procedural it became. You are deliberately destroying something expensive in a way that is genuinely hazardous, and the way you make that acceptable is by making it *boring* — checklists, exclusion zones, a wrap done the same way every time, a sensor map agreed in advance, a dry run of the data acquisition before anything is energised. The drama is a sign you got the preparation wrong.

And the underlying trade never goes away. We want [energy density](/blog/how-batteries-work/), and energy density means a lot of stored chemical potential in a small package with a thin film keeping it civil. Nobody has found a way to have the first thing without accepting the second. What you can do is understand precisely how it fails, how fast, and how much time you can buy — which is why somebody, somewhere, spends their week carefully wrapping wire around a cell that is not going to survive the afternoon.
