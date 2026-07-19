---
title: 'How Air Conditioning Works: The Art of Moving Heat Uphill'
description: 'Your AC does not make cold air — it pumps heat out of your house using a fluid with a very convenient boiling point.'
pubDate: 2026-07-21
---

Here's the mental flip that makes air conditioning make sense: **there is no such thing as cold.** Cold isn't a substance you can create or blow into a room — it's just the absence of heat, the way dark is the absence of light. An air conditioner doesn't manufacture cold. It's a pump. It grabs heat from inside your house and throws it outside, and what's left behind *feels* cold.

That reframe matters because of a physics rule with no exceptions: heat flows from hot things to cold things, never the reverse. On a 35 °C day, heat is constantly leaking *into* your 24 °C house. To cool the house, you must move heat in the direction it refuses to go — uphill, from cooler inside to hotter outside. Doing that takes machinery and energy, and the machinery is more elegant than it has any right to be.

## The magic fluid

The whole system is built around one substance: the **refrigerant** — a fluid chemically engineered to boil at absurdly convenient temperatures. Water boils at 100 °C; common refrigerants boil around −26 °C at atmospheric pressure.

Why does boiling matter? Because phase changes move enormous amounts of heat. Evaporating a liquid absorbs energy — it's why sweat cools you and why rubbing alcohol feels cold on your skin: the liquid steals your body heat to fuel its escape into vapor. Condensing a vapor back to liquid releases all that energy again.

So the trick, in one sentence: **make the refrigerant evaporate inside your house (absorbing heat) and condense outside it (releasing heat), over and over, in a loop.**

## The loop

Four components, one closed circuit, the same fluid going around forever:

<figure>
	<img src="/diagrams/refrigeration-cycle.svg" alt="The vapor-compression cycle: refrigerant flows from the evaporator inside, through the compressor, to the condenser outside, through the expansion valve, and back — absorbing room heat on the cold side and dumping it outdoors on the hot side" width="640" height="320" loading="lazy" />
	<figcaption>The vapor-compression cycle. Gray is the cold, low-pressure side; sienna is the hot, high-pressure side. The refrigerant just goes in circles — the heat is what travels.</figcaption>
</figure>

**1. The evaporator (inside, cold).** Cold liquid refrigerant — colder than your room — flows through a coil while a fan blows room air across it. Heat pours from the air into the refrigerant (hot → cold, physics is happy), boiling it into vapor. The air comes out the other side stripped of heat. This is the only part of the system your house ever feels.

**2. The compressor (the part that hums).** The vapor now carries your room's heat, but there's a problem: it's maybe 15 °C, and outdoors it's 35 °C. You can't dump heat from a cooler thing to a hotter one. The compressor solves this by brute force — squeezing the vapor to high pressure, which slams its temperature up to 60–80 °C. This is where nearly all the electricity goes.

**3. The condenser (outside, hot).** Now the refrigerant is far hotter than the outdoor air, so heat flows out of it and into the world — that's the scorching air blasting from the outdoor unit. Losing heat, the vapor condenses back into liquid. Your room's heat has officially left the building.

**4. The expansion valve.** The warm, high-pressure liquid squeezes through a tiny orifice into the low-pressure side. Pressure plummets, and with it temperature — the fluid flashes into a frigid mist, colder than your room again. It re-enters the evaporator, and the cycle repeats, a few kilograms of refrigerant lapping the circuit endlessly.

> The compressor and expansion valve are a matched pair of pressure tricks: one raises pressure so the refrigerant runs hotter than the outdoors, the other drops pressure so it runs colder than your room. Temperature difference is manufactured on demand, on both sides, from the same fluid.

## Why your AC drips

The evaporator coil sits well below the *dew point* of room air, so water vapor condenses on it — exactly like a cold drink sweating on a summer day. That water collects in a pan and drains away, which is the puddle under a window unit and the little pipe dripping off the outdoor wall. It's a feature: drier air feels several degrees cooler at the same temperature, and roughly a third of an AC's work on humid days goes into wringing out water rather than lowering the thermometer.

## Better than 100% efficient

Here's the delightful accounting. A good AC moves **3 to 4 joules of heat for every 1 joule of electricity** it consumes — a *coefficient of performance* of 3–4. That sounds like a thermodynamics violation, but it isn't: the machine isn't *creating* energy, just *transporting* it. The electricity pays for the pumping, not the heat. A space heater converting 1 J of electricity into 1 J of heat is the thing that should feel inefficient.

This is also why a **heat pump** is just an air conditioner with a reversing valve. Flip the valve, the roles of the two coils swap, and the same machine pumps outdoor heat *into* your house — yes, even cold winter air contains heat to harvest — delivering 3–4× more warmth per joule than any resistive heater can. Same loop, run backwards.

---

One last connection for readers of this blog's [maker series](/blog/what-an-arduino-actually-is/): your thermostat is a textbook control loop — a [temperature sensor](/blog/sensors-how-projects-perceive/), a setpoint, and an [actuator](/blog/actuators-how-code-moves-the-world/) (the compressor relay), usually with deliberate hysteresis rather than a [PID controller](/blog/pid-controllers/) so the compressor isn't switched madly on and off. Sense, decide, act — the loop that keeps drones aloft is also the one keeping your living room at 24 °C.
