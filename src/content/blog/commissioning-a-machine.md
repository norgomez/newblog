---
title: 'Commissioning: Where a Machine Stops Being a Drawing'
description: 'A machine that works in the integrator’s workshop is not a machine that works. Walking an ultrasonic heat-staking cell from crate to handover — and the ordered, slightly paranoid process that gets it there without hurting anybody.'
pubDate: 2026-08-18
tags: [manufacturing, control, sensors]
---

A machine arrives on a truck, strapped to a pallet, wrapped in plastic, with a folder of drawings taped to the frame. Somebody built it. Somebody tested it. On paper it works.

It does not work.

Not yet, and not because anyone did a bad job. It works in a workshop three countries away, on that floor, on that supply, with that air pressure, with the person who built it standing next to it knowing which button to avoid. Your building is a different set of conditions, and the machine has not met them.

**Commissioning is the process of closing that gap without hurting anybody.** For a couple of years, bringing automated assembly machines into service was a large part of my job at a battery pack manufacturer, and the thing that surprised me most was how little of it is clever. It's an order of operations. The skill is refusing to break the order when the machine is sitting there looking finished and everyone would like to see it run.

I want to walk through that order using a specific machine, because the general version of this advice is easy to nod along to and hard to use.

## The machine

An automated ultrasonic heat-staking cell.

The product is a battery module component: an injection-moulded plastic carrier with a grid of small pins — **bosses** — standing up out of it, and an aluminium **bus bar** that drops over those bosses so the pins poke up through matching holes in the metal. The bar has to end up mechanically locked to the plastic, flat and captive, with no fasteners.

So you melt the pins. An ultrasonic horn comes down onto each protruding boss and reforms it into a head — a rivet made from the part's own material, formed in place in a fraction of a second. Do that at every pin and the bar is clamped down by a row of plastic heads that didn't exist a moment earlier.

The complication, and the reason the machine is automated rather than a bench press, is that the bus bars come in several lengths — a short one, a medium one, a long one, and so on up the range, each with a different number of pins in a different pattern. The operator loads whichever bar the build calls for, and **the machine works out for itself which one it's looking at** from a set of sensors in the fixture, selects the matching recipe, and stakes the right pattern at the right parameters without being told.

That last sentence is the entire commissioning story in miniature, and I'll come back to it. A machine that decides for itself what it's holding is a machine that can be *confidently wrong*.

## What ultrasonic staking actually is

Worth a paragraph, because the name misleads people. Nothing hot touches the part.

<figure>
	<img src="/diagrams/heat-stake.svg" alt="Top: a chain of four boxes labelled generator, converter, booster and horn, with arrows between them, captioned twenty kilohertz electrical, piezo turns it to motion, amplitude scaled, delivered. Below: a before-and-after cross section. Before, a horn descends toward a plastic boss standing up through a hole in an aluminium bar which sits on a plastic base. After, the boss has been reformed into a domed head that overlaps and clamps the bar down" width="640" height="320" loading="lazy" />
	<figcaption>A rivet made from the part, formed in about a third of a second — then held still while it solidifies.</figcaption>
</figure>

A generator turns mains power into a 20 kHz electrical signal. A converter — a stack of piezoelectric discs — turns that into mechanical vibration at the same frequency. A booster scales the amplitude, and the horn delivers it to the workpiece.

The horn tip is moving only tens of microns, but it's doing it twenty thousand times a second. At a 40 µm amplitude that tip covers about **1.6 metres of travel every second**, in strokes far too small and fast to see. Pressed against the plastic boss, that vibration becomes intermolecular friction *inside the material*, and the plastic reaches melt temperature from within, exactly where the energy is going and nowhere else.

The cycle is: come down, build to a trigger force, run ultrasound for a couple of hundred milliseconds, cut the ultrasound, and then **hold under force** while the plastic freezes. That hold is the step everyone underestimates. The head is formed by the horn's cavity and it keeps that shape only if it solidifies under pressure. Release early and you get a head that relaxes, and a joint that passes inspection and fails a pull test.

Two details matter for a bus bar specifically. The aluminium is a large heat sink sitting right beside the weld, so it pulls energy out of the joint. And the horn must land on plastic, not on metal — a horn ringing against an aluminium bar is a way to destroy an expensive piece of tooling and mark the product at the same time.

## The gap between built and working

Two terms mark where responsibility moves.

**Factory Acceptance Test (FAT)** happens at the builder's site before shipping. You go to them, you run the machine, you confirm it does roughly what the specification said. It's your last cheap chance to reject something.

**Site Acceptance Test (SAT)** happens after installation, in the real building, on real services, with real product and real operators. Almost everything interesting is found here — because almost everything that goes wrong is a property of the *installation*, not the machine.

The machine will have been partly disassembled to fit on a truck, vibrated for a thousand miles, and put back together by people who didn't build it. On an ultrasonic machine that matters more than most: the stack is a tuned mechanical resonator held together by torqued joints, and it does not enjoy being shipped. Assume nothing survived the trip.

## Before anything: know what can kill you

The first job on a new machine isn't electrical or mechanical. It's an inventory of every energy source in it and how to make each one safe.

Electrical is the obvious one and the least likely to surprise you, because everyone respects it. **Lockout/tagout** — isolate, lock the isolator, keep the key on your person, prove dead rather than assume dead — isn't paperwork. It's the specific practice that stops somebody energising the machine while your hands are inside it.

The ones that catch people are the stored energies:

- **Pneumatics.** The staking head is driven down by a cylinder. The machine can be electrically dead and still hold four bar in the receiver, and a cylinder will happily fire when a valve gets bumped. Dump the air and check the gauge reads zero, not "probably fine."
- **Gravity.** Any vertical axis is a suspended mass. If it can drop, block it mechanically — with a bar, not with a brake you didn't design.
- **Drive and generator capacitors.** An ultrasonic generator holds a dangerous DC bus after isolation. The label tells you how long; believe it.
- **Springs and anything preloaded.** Stored energy has no indicator light.
- **The product itself**, if you're handling [cells](/blog/making-batteries-explode-on-purpose/).

Do that inventory on day one, in writing, and everything after it is conducted with the right kind of respect.

## The order of operations

Everything below is sequential. Each step exists to make the next one survivable, and the reason to hold the line is that skipping ahead is how a bad day happens.

### 1. Set it, then service it

Position, level, anchor. A machine that isn't level has axes fighting gravity; a machine that isn't anchored walks. Then bring in the services: three-phase power, control power, compressed air at pressure and **dry**, extraction, network.

Two things reliably bite. **Phase rotation** — get it backwards and every three-phase motor runs the wrong way, which is either an afternoon of confusion or a crash. Check it at the isolator before anything spins. And **earthing and bonding**, which done properly is invisible and done poorly shows up weeks later as sensor noise and comms dropouts nobody connects back to installation day. A 20 kHz generator switching hard is a substantial noise source sitting inside your own cabinet, so this one is not theoretical.

While you're in there, walk the [cable routing](/blog/running-cable/): power segregated from signal, glands tight, strain relief intact. The high-frequency cable from the generator to the converter is not an ordinary cable and should not be run alongside your sensor loom. This is the last time any of it is easy to reach.

### 2. Power up in layers

Do not energise everything at once.

Control power first, with motion and ultrasonics isolated. Confirm the 24 V rails, the PLC booting, the HMI coming up, the drives reporting ready-but-disabled. Look for anything warm, anything humming, any fault on any display. A machine at rest with control power on is the safest useful state it has, and you should spend real time in it.

Only when that's clean do you bring in motion power — still with nothing commanded to move.

### 3. Prove the safety circuit before you prove anything else

This is the step people compress, and it's the one that must not be compressed. **The safety system is the only part of the machine you get to test while it can't hurt you.** Everything after this point relies on it working.

The logic is a hierarchy and it's the same one everywhere: eliminate the hazard if you can; if you can't, guard it; if you can't guard it, interlock it; only then fall back on procedure and signage. PPE is last because it's the only control that depends on a human getting it right every single time.

What a staking cell needs proven:

**Every emergency stop, individually.** Not "the e-stop works" — *each* one, pressed, confirming the machine drops to a safe state. Then confirm that releasing it does **not** restart anything. Reset has to be a separate deliberate act, and the reset button must sit where whoever presses it can see the whole cell. A reset you can press while somebody is inside the guarding is a design fault, not a preference.

**Every guard interlock, one at a time.** Open the door, confirm the stop. Then the more important test: confirm it cannot be started with that door open, or with the door *nearly* closed. Tongue-actuator and coded switches exist because a plain magnetic reed can be defeated with a spare magnet, and every plant has a drawer of spare magnets.

**Dual-channel wiring, and why safety inputs are normally closed.** Safety circuits run two independent channels into a safety relay or safety PLC, and the relay watches both. If they disagree, or one closes without the other, that's a cross-fault and the system latches out rather than shrugging. Every safety contact is wired **normally closed**, so a cut wire, a pulled connector, or a corroded terminal reads as *stop*. The failure mode of the wiring is the safe state. That one convention prevents more injuries than any other detail in the panel.

**The load/unload opening**, which on this machine is the interesting one. An operator has to put a bus bar in and take an assembly out, many times an hour, and a staking head is a press — a descending tool with real force behind it. Whatever protects that opening, whether a light curtain or a two-hand control, has to be proven against somebody who is bored, fast, and working with both hands.

**Then measure the stopping time — don't look it up.**

<figure>
	<img src="/diagrams/safety-distance.svg" alt="A plan view of a hand approaching a hazard: an arrow moves right toward a dashed vertical line representing a light curtain with four beams, and beyond it a box marked hazard. A dimension line marks the distance S between the curtain and the hazard, annotated with the formula S equals K times T plus C, where K is the 2000 millimetres per second approach speed, T is the measured stopping time and C is a reach allowance" width="640" height="300" loading="lazy" />
	<figcaption>At 14 mm resolution and a 0.25 s stop, S = 500 mm. Let the stop drift to 0.4 s and the same guard needs 800 mm — while sitting exactly where it was.</figcaption>
</figure>

A light curtain doesn't stop anything. It detects an interruption and *asks* the machine to stop, and the machine takes time to comply — valve response, deceleration, brake engagement. The guard has to sit far enough back that the stop finishes before a hand arrives. The standard formula is

> **S = K × T + C**

where K is a 2000 mm/s assumed approach speed, T is the *total* system stopping time, and C is an allowance for how far a finger reaches through before it's detected — zero for a 14 mm curtain, 128 mm for a 30 mm one.

The term that matters is T, and it's the one nobody has actually measured. It includes the sensor's response, the safety relay, the valve, and the mechanics — and it degrades as seals and brakes age. Measure it with a stopping-time instrument, on this machine, on this day, and re-measure it periodically. A guard positioned from a datasheet is a guard positioned from a guess.

**And the hazard nobody puts on the risk assessment: noise.** 20 kHz sits just above most adult hearing, which tempts people into thinking an ultrasonic cell is quiet. The parts themselves resonate and radiate audible subharmonics, and the sound pressure at the operator position can be substantial. Measure it. That's what the acoustic enclosure is for, and it's also an interlocked guard, so it has to be closed for the cell to run — which means it has to be proven like any other.

### 4. Prove the I/O before you trust the logic

Now, still with nothing moving, go through the machine input by input and output by output.

For every sensor: actuate it by hand and watch the bit change in the controller. Not the HMI graphic — the actual input bit. You're checking three things at once, and on a machine of any size you'll find all three: that it's landed on the terminal the drawing claims, that its polarity is right, and that it's *mounted* somewhere it will keep working when the machine is warm, dirty, and full of product.

Then force outputs one at a time, with a hand near the stop, and confirm each drives the thing it's labelled as driving. This is where you discover the two pneumatic valves plumbed to each other's cylinders — trivial now, genuinely dangerous once it's buried under sequence logic. Same reason you'd [check a sensor in isolation](/blog/sensors-how-projects-perceive/) before wiring it into anything that acts on it.

Expect [contact bounce](/blog/debounce-and-throttle/) on mechanical switches, sensors that read cleanly on a good part and ambiguously on a marginal one, and at least one place where the cable schedule and the physical wire disagree. Mark the drawings up as you go. They are now a hypothesis and you're the one testing it.

### 5. First motion, and how to survive it

The first time the head moves under power is the sharpest moment of the job.

- **One person at the controls.** Everyone else has hands off and eyes on. Announce every move before you make it.
- **Manual jog only**, at the slowest speed the drive will accept.
- **Soft limits before homing**, so the axis can't run into a hard stop while it's still working out where it is.
- **Hand on the stop**, and know where it is without looking down.
- **Check direction and count.** Command 10 mm, measure that it moved 10 mm and not 100. An encoder scaling error is common, expensive, and cheapest to catch right here.

On a staking head there's one more, and it's specific: **prove the down stroke with no ultrasound enabled and no part in the fixture**, then with a sacrificial part, and confirm the horn lands where the boss is and nowhere near the aluminium. A horn is a precision resonator with a price tag to match, and a mis-taught position finds that out in one cycle.

### 6. Dry cycle, then dummy, then real

Run the sequence empty. Then with sacrificial parts you don't mind destroying. Then real product, one at a time, with someone watching the station rather than the HMI.

Run at reduced speed first. Plenty of faults are purely timing: a clamp that releases before the plastic has frozen, a sensor read that happens 20 ms too early. At half speed the machine forgives you, and you can see what happened.

### 7. Rate last, then repeatability

Only once it runs correctly do you care how fast. Push to cycle time, then let it run — because the failures that matter now are the *intermittent* ones, and they only appear over hundreds of cycles. A machine that completes 20 cycles is not proven. A machine that runs a full shift and logs every stoppage is starting to be.

Then the real question, which isn't "does it work" but **"does it work the same way every time."** Run a capability study, look at the spread, and find out whether the process sits comfortably inside tolerance or scrapes past it on a good day. A machine that's just barely capable during commissioning will not be capable in February.

### 8. It isn't done until someone else can run it

The last step is the one that gets skipped when the schedule is tight, and it's the difference between a machine that stays working and one that quietly degrades.

- **Marked-up drawings** reflecting what's installed, not what was designed.
- **Software backed up and versioned**, off the machine. The PLC program that exists only on the PLC will be lost.
- **A punch list** with owners, written honestly — an item hidden at handover becomes a breakdown later.
- **Spares** for the long-lead parts, identified now rather than during a line stoppage. On this machine that means a spare horn, and knowing its lead time before you need it.
- **Operator and maintenance training**, on the machine, by the people who commissioned it.

> A machine is commissioned when someone who wasn't there can run it, and someone who wasn't there can fix it. Anything less is a machine that only works while you're standing next to it.

## The part it decides for itself

Back to the interesting bit. This cell identifies the loaded bus bar automatically and picks its own recipe, and that convenience quietly changes what "tested" has to mean.

Length detection is usually a small array of sensors down the fixture — inductive proximity sensors work well here, since the target is a metal bar sitting at a known height. Each sensor is one bit; the pattern of made and unmade sensors is a code; the code selects the recipe. Simple, robust, no vision system.

Three things about that have to be proven during commissioning, and none of them appear in a normal cycle test.

**The codes must not be subsets of one another.** If the short bar makes sensors 1 and 2, and the long bar makes 1, 2, 3 and 4, then a *long bar that isn't seated* — nose down, tail lifted — makes 1 and 2 and reads as a perfectly valid short bar. The machine then runs a short-bar recipe on a long part, stakes half of it, and hands you a defect that inspection has to catch downstream. The fix is either a code set where no valid pattern is a subset of another, or an independent "fully seated" sensor that has to be true before any code is accepted. Either way, it's a thing you check on purpose.

**Inductive sensors read aluminium differently.** A proximity sensor's rated sensing distance is quoted against mild steel; on aluminium it's derated substantially — very roughly a third to a half of the steel figure, depending on the sensor. Set up on the wrong target during a bench test and it works beautifully on the bench and marginally on the machine. Set the gap against the real material, then confirm the margin on both sides: it must make reliably with the bar present and must not make with it absent.

**The test matrix is misloads, not part numbers.** This is the point. It's tempting to run one of each bar, see the right recipe come up each time, and call the feature proven. But the failure you care about isn't "does it recognise the 18-inch bar." It's everything else the operator can physically do:

| What you load | What must happen |
| --- | --- |
| Each valid bar, correctly seated | Correct recipe, every time, several times each |
| No bar at all | Refuses to start — never stakes into an empty fixture |
| A bar not fully seated | Refuses, or faults — never reads as a shorter valid bar |
| A bar loaded backwards or offset | Refuses |
| A bar in the wrong nest | Refuses |
| Bar present, carrier missing | Refuses |
| A bar removed mid-cycle | Safe stop, no head movement |

Every row of that table is a real thing a real operator will do on a night shift, and the machine's answer to all of it must be *stop*, not *guess*. Where the fixture can be made to physically reject a wrong load — a keyed pocket, an asymmetric datum, a lid that won't close — that's better than any sensor, because it removes the decision instead of automating it.

And once the recipes are proven, **lock them**. Parameters per part number, under version control, behind a password. Amplitude and weld time are exactly the settings a well-meaning person adjusts at 2 a.m. to clear a fault, and the whole validation rests on them not changing.

## Proving the process, not just the machine

One last distinction that heat staking makes unusually clear: the machine finishing its cycle without faulting is not evidence that the joint is any good.

A stake can look perfect and hold nothing. So the acceptance criteria are physical — head geometry within spec, and **pull or push-off testing** on first-off samples, destructively, until you know the joint's actual strength and how much margin the parameters leave. Cross-section a few if the geometry is doubtful.

It also shapes how you set the machine up. Ultrasonic controllers can terminate a weld on elapsed **time**, delivered **energy**, or **collapse distance** — how far the boss actually compressed. Time is the least repeatable of the three, because it assumes every incoming part behaves identically, and moulded parts vary in height, moisture and batch. Energy and distance modes respond to what's actually happening in front of the horn, which is why validated processes tend to live there.

Then re-prove it when anything upstream changes: a new mould tool, a different resin batch, a re-cut horn. The parameters were tuned against a specific set of inputs, and none of that is visible from inside the machine.

## What actually goes wrong

After enough of these, the failures stop being surprising:

| What you find | Why it wasn't caught earlier |
| --- | --- |
| Drawings don't match the build | Last-minute changes made at the builder, never redlined |
| Sensor works on a good part, not a marginal one | Only good parts were available at FAT |
| Recipe misselects on a partly seated part | Nobody tried loading it wrong |
| Weak stakes after a resin batch change | Process was tuned in time mode against one batch |
| Intermittent fault every few hundred cycles | Nobody ran it that long before |
| Timing failure only at full rate | Everything was proven at jog speed |
| Comms dropout when the generator fires | Earthing, or the HF cable sharing a tray with signal |
| Sequence assumes a sensor is true at start | The machine was never powered up mid-cycle before |

Notice how many are about *conditions* rather than components. Nothing is broken in most of them. The machine is simply meeting reality for the first time.

---

The thing I took from that work, and still use, is that commissioning is a discipline of order rather than intelligence. The temptation is always identical — the machine is here, it's assembled, people are waiting, and there is enormous pressure to press cycle-start and see what happens.

The whole craft is not doing that. Prove the stop before the go. Prove the wire before the logic. Prove the motion before the sequence. Prove it slow before you prove it fast. Prove that it refuses the wrong part before you trust it with the right one. Every one of those exists because someone, somewhere, did it in the other order.

And when it finally runs — a machine you unwrapped from plastic, recognising its own part, forming a hundred rivets that didn't exist a second ago, at rate, safely, with an operator who isn't you standing at the panel — that's a specific and slightly underrated kind of satisfaction. You didn't design it. You're the reason it works.
