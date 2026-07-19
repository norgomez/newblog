---
title: 'How Electric Motors Work: Magnets, Current, and the Chase'
description: 'One physical fact — a wire in a magnetic field feels a push — and a century of clever geometry for turning that push into spin.'
pubDate: 2026-07-24
series:
  name: 'Under the Hood'
  part: 3
---

Count the motors around you right now. The fan in your laptop, the vibration in your phone, the compressor in your [air conditioner](/blog/how-air-conditioning-works/), a modern car's several dozen — window lifts, seat adjusters, pumps, and possibly the thing that drives it down the road. The electric motor is the most numerous machine ever built, and compared to the [combustion engine](/blog/mechanical-systems-that-move-your-car/) — pistons, valves, oil film, cooling jackets — it's almost insultingly simple: one moving part.

All of it rests on a single physical fact: **a wire carrying current through a magnetic field feels a sideways push.** Current one way, push up; reverse the current, push down. That's the whole trick. Everything else in this post is geometry — a century of arrangements for turning that push into continuous spin.

## The half-turn problem

Bend the wire into a loop between a magnet's north and south poles and the pushes cooperate beautifully: current flows one direction on the loop's left side (push up) and the opposite direction on the right side (push down). Opposite forces on opposite sides — that's a twist. The loop rotates.

For half a turn. Then the loop's sides have swapped places, the same forces now fight the rotation, and the loop rocks to a stop. A motor that turns 180° and quits is a paperweight with ambition.

The classic fix is the **commutator** — a rotating switch built into the shaft itself. Two half-ring contacts spin with the loop while stationary **brushes** press against them, and every half turn the contacts swap, reversing the current through the loop at exactly the moment the geometry flips. The push always points the same way around; the rocking becomes spinning. That's the brushed DC motor — the cheap silver can from the [actuators post](/blog/actuators-how-code-moves-the-world/), invented in the 1830s and still made by the billion.

## Flip it inside out: brushless

Brushes are the brushed motor's weakness — they drag, spark, wear out, and waste power. The modern move is to flip the whole design inside out: put the **permanent magnets on the rotor** and the **coils on the outside**, where they never move. Now nothing needs sliding electrical contacts. But something still has to do the commutator's job of switching current at the right moments — and that something is electronics.

<figure>
	<img src="/diagrams/rotating-field.svg" alt="Six stator coils arranged in a ring around a rotor needle, with the energizing sequence A, B, C shown — the coils create a rotating magnetic field that the rotor chases" width="640" height="320" loading="lazy" />
	<figcaption>The brushless idea: energize the coil pairs in sequence and the magnetic field rotates. The magnet in the middle has no choice but to chase it.</figcaption>
</figure>

Energize coil pair A and the rotor magnet snaps toward it. Switch to B, it chases. Then C, then A again — the coils create a **rotating magnetic field**, and the rotor pursues it forever, like a greyhound after a mechanical rabbit. Spin the field faster and the motor spins faster; the field's rotation rate *is* the speed control.

The electronic controller doing this switching needs to know where the rotor is at every instant — which makes every brushless motor a [feedback loop](/blog/the-loops-that-drive-your-car/): sense rotor position, energize the next coil, repeat, thousands of times a second. The "ESC" on a drone is exactly this. And your [stepper motor](/blog/actuators-how-code-moves-the-world/) is the same idea with the sequencing exposed: each commanded step advances the field one notch, and the rotor clicks after it.

## The no-magnet trick: induction

Tesla's induction motor goes one step stranger: the rotor has *no magnets and no power connection at all* — just a cage of aluminum bars. The rotating stator field sweeps past the cage, induces currents in it (moving fields induce currents — the same law behind [transformers and generators](/blog/how-electricity-actually-works/)), and those induced currents feel the field's push. The rotor drags along slightly slower than the field, living off the difference. No brushes, no magnets, nearly nothing to wear out — which is why induction motors have run the world's factories for a century.

## Two symmetries worth knowing

**A motor is a generator run forwards.** Spin any motor by hand and it *produces* voltage — the same geometry works both directions. This symmetry is why an EV can brake by letting the wheels drive the motor, pushing energy back where it came from. It also explains a quirk: a spinning motor generates a "back-voltage" that opposes its own supply, throttling its current draw. A *stalled* motor generates none — so it gulps maximum current and cooks. That's why blocked fans burn out and why the actuators post nagged you about stall current.

**Torque doesn't wait.** A combustion engine must be spinning to make power; a motor's push depends only on current, so it delivers **maximum torque at zero RPM**. Hold that thought — it's the single fact that will let the next post delete half of a car's drivetrain.

## The lineup

| Motor | Commutation | Personality | Where you'll meet it |
| ----- | ----------- | ----------- | -------------------- |
| Brushed DC | Mechanical (brushes) | Cheap, simple, wears out | Toys, wipers, hobby kits |
| Brushless (BLDC) | Electronic | Efficient, precise, needs a controller | Drones, EVs, laptop fans |
| Induction | Rotating field, induced rotor | Rugged, magnet-free | Factories, some EVs, appliances |
| Stepper | Electronic, discrete | Positions without sensors | Printers, CNC, [3D printers](/blog/3d-printing-from-sketch-to-solid/) |

One moving part, one physical fact, four ways to arrange it. Next stop: what happens when you put the brushless motor and a very large battery in a car — and start deleting components.
