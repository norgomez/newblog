---
title: 'Commissioning: Where a Machine Stops Being a Drawing'
description: 'A machine that works in the integrator’s workshop is not a machine that works. Commissioning is the ordered, slightly paranoid process of finding out the difference — safely, and before anybody trusts it.'
pubDate: 2026-08-18
tags: [manufacturing, control, sensors]
---

A machine arrives on a truck, strapped to a pallet, wrapped in plastic, with a folder of drawings taped to the frame. Somebody built it. Somebody tested it. On paper it works.

It does not work.

Not yet, and not because anyone did a bad job. It works in a workshop three countries away, on that floor, on that supply, with that air pressure, with the person who built it standing next to it knowing which button to avoid. Your building is a different set of conditions, and the machine has not met them.

**Commissioning is the process of closing that gap without hurting anybody.** For a couple of years, bringing automated assembly and test machines into service was a large part of my job at a battery pack manufacturer, and the thing that surprised me most was how little of it is clever. It's an order of operations. The skill is refusing to break the order when the machine is sitting there looking finished and everyone would like to see it run.

## The gap between built and working

Two terms get used for the two halves of this, and they're worth knowing because they mark where responsibility moves.

**Factory Acceptance Test (FAT)** happens at the builder's site, before shipping. You go to them, you run the machine, you confirm it does roughly what the specification said. It's your last cheap chance to reject something.

**Site Acceptance Test (SAT)** happens after installation, in the real building, on real services, with real product and the real operators. Almost everything interesting is found here — because almost everything that goes wrong is a property of the *installation*, not the machine.

The machine will have been disassembled to fit on a truck, vibrated for a thousand miles, and put back together by people who did not build it. Assume nothing survived the trip.

## Before anything: know what can kill you

The first job on a new machine isn't electrical or mechanical. It's an inventory of every source of energy in it, and how to make each one safe.

Electrical is the obvious one, and the least likely to surprise you because everyone respects it. **Lockout/tagout** — isolate, lock the isolator, keep the key on your person, and prove dead rather than assume dead — is not paperwork. It is the specific practice that stops somebody else energising the machine while your hands are inside it.

The ones that catch people out are the stored energies:

- **Pneumatics.** A machine can be electrically dead and still have four bar of stored air in the receiver. Cylinders can and will fire when a valve gets bumped. Dump the air and check the gauge reads zero, not "probably fine."
- **Gravity.** Any vertical axis is a suspended mass. If it can drop, block it mechanically — with a bar, not with a brake you didn't design.
- **Springs, and anything preloaded.** Stored energy has no indicator light.
- **Drive capacitors.** Servo drives hold a dangerous DC bus for minutes after isolation. The label tells you how long; believe it.
- **Thermal and chemical**, depending on the process — and if the machine handles [cells](/blog/making-batteries-explode-on-purpose/), the product itself is a stored-energy source.

Do that inventory on day one, in writing, and the rest of the commissioning is conducted with the right kind of respect.

## The order of operations

Everything below is sequential. Each step exists to make the next one survivable, and the reason to hold the line is that skipping ahead is how a bad day happens.

### 1. Set it, then service it

Position, level, anchor. A machine that isn't level has axes fighting gravity and drains that don't drain; a machine that isn't anchored walks. Then bring in the services: three-phase power, control power, compressed air at the right pressure and *dry*, extraction, cooling, network.

Two things here reliably bite. **Phase rotation** — get it backwards and every three-phase motor runs the wrong way, which is either an afternoon of confusion or a crash. Check it at the isolator before anything spins. And **earthing and bonding** — done properly it's invisible, done poorly it shows up weeks later as inexplicable sensor noise and comms dropouts that nobody connects back to installation day.

While you're in there, walk the [cable routing](/blog/running-cable/). Segregate power from signal, check the glands, confirm the strain relief survived the shipping. This is the last time it's easy to reach.

### 2. Power up in layers

Do not energise everything at once.

Control power first, with motion power isolated. Confirm the 24 V rails are where they should be, the PLC boots, the HMI comes up, the drives report ready-but-disabled. Look for anything warm, anything humming, any fault on any display. A machine at rest with control power on is the safest useful state it has, and you should spend real time in it.

Only when that's clean do you bring in motion power — and still with nothing commanded to move.

### 3. Prove the safety circuit before you prove anything else

This is the step people compress, and it is the one that must not be compressed. **The safety system is the only part of the machine you test while it is incapable of hurting you.** Everything after this point relies on it working.

The logic is a hierarchy, and it's the same one everywhere: eliminate the hazard if you can; if you can't, guard it; if you can't guard it, interlock it; only then fall back on procedure and signage. PPE is last because it's the only control that depends on a human getting it right every single time.

What you're checking:

**Every emergency stop, individually.** Not "the e-stop works" — *each* one, by pressing it and confirming the machine drops to a safe state. Then confirm that releasing it does **not** restart anything. A reset has to be a separate, deliberate act, and the reset button must be positioned where whoever presses it can see the whole cell. A reset you can press while somebody is inside the guarding is a design fault, not a preference.

**Every guard interlock, one at a time.** Open the door, confirm the stop. Then the more important test: confirm the machine cannot be started with that door open, and cannot be started with the door *nearly* closed. Tongue-actuator and coded switches exist because a simple magnetic reed can be defeated with a spare magnet, and every plant has a drawer of spare magnets.

**Dual-channel wiring, and why safety inputs are normally closed.** Safety circuits run two independent channels into a safety relay or safety PLC, and the relay watches both. If the channels disagree, or one closes without the other, that's a cross-fault and the system latches out rather than shrugging. Every safety contact is wired **normally closed**, so that a cut wire, a pulled connector, or a corroded terminal reads as *stop*. The failure mode of the wiring is the safe state. That single convention prevents more injuries than any other detail in the panel.

**Then measure the stopping time — don't look it up.**

<figure>
	<img src="/diagrams/safety-distance.svg" alt="A plan view of a hand approaching a hazard: an arrow moves right toward a dashed vertical line representing a light curtain with four beams, and beyond it a box marked hazard. A dimension line marks the distance S between the curtain and the hazard, annotated with the formula S equals K times T plus C, where K is the 2000 millimetres per second approach speed, T is the measured stopping time and C is a reach allowance" width="640" height="300" loading="lazy" />
	<figcaption>At 14 mm resolution and a 0.25 s stop, S = 500 mm. Let the stop drift to 0.4 s and the same guard now needs 800 mm — while sitting exactly where it was.</figcaption>
</figure>

A light curtain doesn't stop anything. It detects an interruption and asks the machine to stop, and the machine takes time to comply — valve response, deceleration, brake engagement. The guard has to sit far enough back that the stop completes before a hand can arrive. The standard formula is

> **S = K × T + C**

where K is a 2000 mm/s assumed approach speed, T is the *total* system stopping time, and C is an allowance for how far a finger can reach through before it's detected — zero for a 14 mm curtain, 128 mm for a 30 mm one.

The number that matters is T, and it is the one nobody has actually measured. It includes the sensor's response, the safety relay, the drive, and the mechanics — and it degrades as brakes wear and valves age. Measure it with a stopping-time instrument, on this machine, on this day, and re-measure it periodically. A guard positioned from a datasheet is a guard positioned from a guess.

Also worth confirming: light curtain **muting**, if the cell has it. Muting deliberately blinds the guard so product can pass through, and a muting circuit that can be fooled into staying muted is an open door with a green light over it.

### 4. Prove the I/O before you trust the logic

Now, still with nothing moving, go through the machine input by input and output by output.

For every sensor: actuate it by hand and watch the bit change in the controller. Not the HMI graphic — the actual input bit. You are checking three things at once, and you'll find all three across a machine of any size: that it's wired to the terminal the drawing says, that its polarity is right, and that it's *mounted* somewhere it will keep working when the machine is dirty, hot, and full of product.

Then force outputs one at a time, with a hand near the stop, and confirm each one drives the thing it's labelled as driving. This is where you discover the two pneumatic valves that were plumbed to each other's cylinders — a mistake that is trivial now and genuinely dangerous once it's buried under sequence logic. It's the same reason you'd [check a sensor in isolation](/blog/sensors-how-projects-perceive/) before wiring it into anything that acts on it.

Expect to find [contact bounce](/blog/debounce-and-throttle/) on mechanical switches, sensors that read correctly on a good part and ambiguously on a marginal one, and at least one item where the cable schedule and the physical wire disagree. Mark the drawings up as you go. The drawings are now a hypothesis and you are the one testing it.

### 5. First motion, and how to survive it

The first time an axis moves under power is the sharpest moment of the whole job. Treat it accordingly.

- **One person at the controls.** Everybody else has hands off and eyes on. Announce every move before you make it.
- **Manual jog only**, at the slowest speed the drive will accept.
- **Soft limits before homing**, so the axis can't run into a hard stop while you're finding out where it thinks it is.
- **Hand on the stop, and know where it is** without looking down.
- **Check direction and count.** Command 10 mm, measure that it went 10 mm and not 100 — an encoder scaling error is a very common, very expensive fault, and this is the cheap moment to catch it.

Then move outward: each axis alone, then interacting axes, watching for interference. Only when every axis is proven individually does anything run a sequence.

### 6. Dry cycle, then dummy, then real

Run the full sequence empty. Then with dummy product — sacrificial parts you don't mind destroying. Then with real product, one at a time, with someone watching each station rather than the HMI.

And run it at reduced speed first. Plenty of faults are purely timing: a gripper that closes before the part has finished settling, a sensor read that happens 20 ms too early. At half speed the machine forgives you. At full speed it doesn't, and it's much harder to see what happened.

### 7. Rate last, and then repeatability

Only once it runs correctly do you care how fast. Push to cycle time, then let it run — because the failures that matter at this stage are the *intermittent* ones, and they only appear over hundreds of cycles. A machine that completes 20 cycles is not proven. A machine that completes a full shift and logs every stoppage is starting to be.

Then the real question, which is not "does it work" but **"does it work the same way every time."** Run a capability study, look at the spread, and find out whether the process sits comfortably inside tolerance or scrapes past it on a good day. A machine that's just barely capable during commissioning will not be capable in February.

### 8. It isn't done until someone else can run it

The last step is the one that gets skipped when the schedule is tight, and it's the difference between a machine that stays working and one that quietly degrades.

- **Marked-up drawings** reflecting what's actually installed, not what was designed.
- **Final software backed up and versioned**, off the machine. The PLC program that exists only on the PLC will be lost.
- **A punch list** of everything outstanding, with owners — and honestly, because an item hidden at handover becomes a breakdown later.
- **Spares** for the parts with lead times, identified now rather than during a line stoppage.
- **Operator and maintenance training**, run on the machine, by the people who commissioned it.

> A machine is commissioned when someone who wasn't there can run it, and someone who wasn't there can fix it. Anything less is a machine that only works while you're standing next to it.

## What actually goes wrong

After enough of these, the failures stop being surprising:

| What you find | Why it wasn't caught earlier |
| --- | --- |
| Drawings don't match the build | Last-minute changes made at the builder, never redlined |
| Sensor works on a good part, not a marginal one | Only good parts were available at FAT |
| Intermittent fault every few hundred cycles | Nobody ran it that long before |
| Timing failure only at full rate | Everything was proven at jog speed |
| Comms dropout in the afternoon | Earthing, or a VFD sharing a tray with a signal cable |
| Sequence assumes a sensor is true at start | The machine was never powered up mid-cycle before |

Notice how many of those are about *conditions* rather than components. Nothing is broken in most of them. The machine is simply meeting reality for the first time.

---

The thing I took from that work, and still use, is that commissioning is a discipline of order rather than intelligence. The temptation is always the same — the machine is here, it's assembled, people are waiting, and there is enormous pressure to press cycle-start and see what happens.

The whole craft is not doing that. Prove the stop before the go. Prove the wire before the logic. Prove the motion before the sequence. Prove it slow before you prove it fast. Every one of those steps is there because someone, somewhere, did it in the other order.

And when it does finally run — a machine you unwrapped from plastic doing a real job at rate, safely, with an operator who wasn't you standing at the panel — that's a specific and slightly underrated kind of satisfaction. You didn't design it. You're the reason it works.
