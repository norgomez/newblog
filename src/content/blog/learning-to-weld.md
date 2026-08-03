---
title: 'Learning to Weld: Controlled Lightning for Beginners'
description: 'Welding is the only joint that turns two pieces of metal into one piece — here is what the arc actually is, which process to learn first, and how to practice.'
pubDate: 2026-08-01
tags: [fabrication, tools]
---

Every other way of joining metal is an arrangement. Bolts clamp, rivets pinch, adhesives grip, and [solder](/blog/tools-everyone-should-own/) sticks two parents together with a third, weaker metal. Welding is different in kind: the parent metals themselves melt, flow together, and freeze as **one continuous piece**. Done right, the joint isn't attached to the part — it *is* the part, with crystals of metal growing straight across where the boundary used to be.

That's why welding sits at the top of the maker skill tree, and why it intimidates: the tool is an electric arc a third as hot as the sun's surface, worn about forty centimeters from your face. But like most intimidating skills, it decomposes into understandable physics, one genuinely non-negotiable safety section, and a hand skill you build exactly the way you built handwriting.

## What the arc actually is

A welder is not a heater — it's a **current machine**. Strike an arc between an electrode and the workpiece and the air gap ionizes into plasma at roughly 6,000 °C, comfortably above steel's 1,500 °C melting point. Everything from the [electricity post](/blog/how-electricity-actually-works/) applies literally here: the machine holds the current you dialed in (that's your heat), the arc itself is a resistor whose voltage depends on its length, and the power dissipated — V × I, easily 3–5 kW — pours into a spot the size of your fingertip. Welders even have a **duty cycle** rating ("200 A at 30%") because the machine, like the joint, must survive its own heat.

There's one enemy: **air**. Molten steel exposed to oxygen and nitrogen instantly forms oxides and traps gas, leaving a joint full of holes with the strength of a biscuit. Every welding process is, at heart, a different answer to the question *"how do we keep air away from the puddle?"*

<figure>
	<img src="/diagrams/weld-arc.svg" alt="Cross-section of a MIG weld: the nozzle feeds a wire electrode, the arc melts a puddle in the base metal, a cone of shielding gas surrounds the arc, and a rippled solidified bead trails behind the direction of travel" width="640" height="290" loading="lazy" />
	<figcaption>The scene under the helmet: the arc melts a puddle, shielding gas holds the air back, and the bead is just the puddle you left behind, frozen.</figcaption>
</figure>

## The processes, and which to learn first

| Process | Air defense | Character | Learn it when |
| ------- | ----------- | --------- | ------------- |
| MIG | Gas from the nozzle | Point-and-go, wire feeds itself | **First.** Most forgiving |
| Flux-core | Flux inside the wire | MIG without a gas bottle; works in wind | First, if outdoors |
| Stick (MMA) | Flux coating on the rod | Cheap, rugged, loves dirty steel | Second — more art |
| TIG | Gas + separate filler rod | Both hands + a foot pedal; jewelry-grade | The endgame |

**Start with MIG on mild steel.** The machine feeds the wire, the gas handles shielding, and your entire job reduces to steering — which is exactly the right amount of difficulty for building the one skill that transfers to every process: reading the puddle.

## Safety — the section you don't skim

Welding's dangers are real but *specific*, and every one has a standard defense:

- **The arc is a UV floodlight.** It sunburns skin through a t-shirt and burns corneas — "arc eye" feels like sand under your eyelids and arrives hours later. The defense: an **auto-darkening helmet** (this is the one place the [buy-cheap-first rule](/blog/tools-everyone-should-own/) is suspended — buy a decent one), plus gloves and a closed-collar cotton or leather jacket. No gaps, no synthetic fabrics that melt.
- **Fumes are not smoke.** Ventilation always; and never, *ever* weld **galvanized (zinc-coated) steel** without stripping the coating and using serious extraction — zinc fumes cause metal fume fever. If a coating is a mystery, grind it off.
- **Sparks are patient.** They roll into corners and smolder in sawdust for an hour before flaming. Clear the area, know where the extinguisher is, and linger after you finish — professionals call it fire watch.
- **You're holding a live circuit.** Dry gloves, dry ground, and clamp the earth lead close to the work so current takes the short path — through the joint, not through anything else.

None of this is exotic. It's a checklist, and after a week it's muscle memory.

## The skill itself: steering a puddle

Here's the reframe that makes practice make sense: **you are not aiming a torch; you are steering a puddle of liquid metal.** The arc creates the puddle; your hands control three things:

1. **Travel speed** — too fast and the bead is a thin, weak rope; too slow and you overheat, sag, or blow a hole through thin stock.
2. **Distance** (stickout) — closer means a stiffer, hotter arc; the machine's hiss changes pitch and, with MIG, a good weld famously sounds like *frying bacon*.
3. **Angle** — a slight tilt in the direction of travel, like the follow-through of a pen stroke.

The puddle tells you everything in real time: its width, its brightness, how it wets into the edges of the joint. Which is why the practice progression is unglamorous and completely reliable — **beads on flat plate** until they're straight and even, then **T-joints and corner joints**, then the graduation exercise: **break your welds on purpose.** Clamp the T-joint and hammer it over. A good weld tears the surrounding steel before the joint lets go; a bad one pops clean off and shows you exactly which failure you produced:

- **Porosity** (holes like a sponge) — air got in: bad gas coverage, dirty metal, or wind.
- **Undercut** (a groove gnawed beside the bead) — too hot or too fast.
- **Cold lap** (bead sitting *on* the metal instead of *in* it) — too cold. This is the sneaky one: it can look beautiful and hold nothing. Pretty ≠ strong, and only destructive testing teaches your eye the difference.

## The starter kit

A 140–180 A MIG machine, the auto-darkening helmet, leather gloves and jacket, welding pliers, a wire brush, clamps ("you can never have too many clamps" is not a joke, it's a law), scrap mild steel from any metal supplier's offcut bin — and an **angle grinder**, which nobody mentions and everybody needs. Welding is half grinding: preparing clean, bright metal before the arc (the single biggest beginner upgrade is simply *cleaning the steel*) and dressing the bead after.

And take a class if one exists nearby — an evening course at a local college compresses months of solo trial-and-error, because an instructor watching your puddle gives you the [feedback loop](/blog/pid-controllers/) that YouTube can't close.

---

What welding ultimately unlocks is the same thing every tool on this blog unlocks, at higher stakes: repairs and objects that didn't exist before you made them — a trailer hitch fixed, a workbench frame, [a gantry](/blog/pick-and-place-gantry/) whose next version is steel instead of aluminum extrusion. Plastic from the [3D printer](/blog/3d-printing-from-sketch-to-solid/), signals from the bench, and now structure from the steel rack. The puddle takes a few weekends to learn to read. The capability is permanent.
