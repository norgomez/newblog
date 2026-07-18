---
title: 'How Electricity Actually Works (No Hand-Waving, No Calculus)'
description: 'Voltage, current, and resistance form one single intuition — and with it, every circuit you meet starts making sense.'
pubDate: 2026-07-16
series:
  name: 'Maker Basics'
  part: 1
---

Every electronics project — every microcontroller, sensor, and motor — runs on three quantities: **voltage, current, and resistance**. Most explanations either drown them in physics or wave them away with a rushed water metaphor. The truth is you need exactly one good mental model, taken seriously, and one equation. That's the whole entry fee.

## What's actually moving

Metals are full of electrons that aren't strongly attached to any particular atom — a sort of electron gas drifting between them. Electricity is what happens when something *pushes* that gas so it drifts in one direction. The push is voltage; the resulting flow is current.

A detail that surprises everyone: the electrons themselves crawl through the wire slower than honey — fractions of a millimeter per second. But the *push* propagates near the speed of light, like a pipe already full of water: push one end, water leaves the other end immediately, even though no single drop traveled the length. That's why the light turns on the instant you flip the switch.

## The water model, taken seriously

Picture a water tank feeding a pipe:

- **Voltage (volts, V)** is the *pressure* — how hard the tank pushes. A 9 V battery pushes harder than a 1.5 V battery. Crucially, pressure is always a *difference between two points*: water flows because pressure here is higher than there. Same with voltage — which is why every circuit needs a return path back to the battery. No loop, no flow.
- **Current (amperes, A)** is the *flow rate* — how much water actually passes per second. In wire terms: how many electrons per second flow past a point.
- **Resistance (ohms, Ω)** is the *narrowness of the pipe* — how much the path fights the flow. A thick copper wire is a fire hose; a resistor is a deliberately thin straw.

These three aren't independent. Squeeze the pipe (more resistance) and less water flows. Raise the pressure (more voltage) and more flows. That relationship has a name:

## Ohm's law: the one equation

```text
V = I × R        voltage = current × resistance

…rearranged for whatever you're missing:
I = V / R        R = V / I
```

This is not an approximation or a rule of thumb — for ordinary resistive circuits it's just how the universe behaves. And it answers real questions immediately.

**The classic example: why does an LED need a resistor?** An LED drops about 2 V across itself and wants roughly 15 mA of current. Connect it straight to an Arduino's 5 V pin and there's 3 "leftover" volts across almost zero resistance — Ohm's law says the current tries to spike enormous, and the LED dies in a flash of regret. Add a resistor to soak up those 3 V at the right flow:

```text
R = V / I = (5 V − 2 V) / 0.015 A = 200 Ω  →  use a standard 220 Ω
```

That calculation — leftover voltage divided by desired current — is the single most-performed piece of arithmetic in hobby electronics.

## Power: why things get warm

Push current through resistance and the energy has to go somewhere — it becomes heat (or light, or motion). The rate is **power**:

```text
P = V × I        watts = volts × amps
```

This one equation explains the ratings on everything you own. A phone charger marked 5 V / 2 A can deliver 10 W. A 60 W laptop charger at 20 V supplies 3 A. And it explains sizing: a resistor asked to dissipate 2 W while rated for a quarter watt doesn't fail politely — it cooks.

> Voltage is potential, current is what actually flows, power is what you pay for. When a device "draws" power, it means the voltage stays fixed and the device takes the current it needs.

## Series and parallel: the only two arrangements

Components chain together in two ways, and each splits one quantity while sharing the other:

| Arrangement | What's shared | What divides |
| ----------- | ------------- | ------------ |
| Series (one after another) | Same current through all | Voltage splits across them |
| Parallel (side by side) | Same voltage across all | Current splits between them |

Two water wheels on one stream take the same flow but each extracts part of the pressure — that's series. Two pipes from one tank feel the same pressure but split the flow — that's parallel. Your house is wired in parallel, which is why every outlet offers the same voltage regardless of what its neighbors are doing.

## AC, DC, and ground

**DC (direct current)** flows steadily in one direction — batteries, USB, everything a microcontroller touches. **AC (alternating current)** reverses direction 50–60 times per second — it's what comes out of the wall, because AC is far easier to transform between voltages and ship across a country. Every wall adapter you own is a translator: AC from the grid in, tame DC out.

And **ground**? It's simply the point in a circuit everyone agrees to call *zero volts* — the reference altitude, sea level for voltage. When a pin reads "5 V," that means five volts *above ground*. It's also why every wiring tutorial repeats the same mantra: all the grounds in a system must be connected, or the devices are quoting altitudes from different sea levels.

---

One practical note: everything in this series — Arduinos, sensors, servos — lives at 5 volts and small currents, a regime that's safe to touch, experiment with, and get wrong. Mains voltage is a different sport with different rules; keep projects on the low-voltage side of a proper adapter.

With pressure, flow, and pipe-width installed as instincts, circuits stop being mysterious — and you're ready for the next trick: wiggling those voltages fast enough to [carry information between machines](/blog/how-machines-talk/).
