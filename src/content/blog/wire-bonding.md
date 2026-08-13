---
title: 'Wire Bonding: Welding Without Melting Anything'
description: 'A joint made in milliseconds, with no heat, no solder and no flux — by vibrating one metal against another until their oxide skins shatter and the atoms simply agree to be one piece.'
pubDate: 2026-08-19
tags: [fabrication, manufacturing, electricity]
---

Almost every way of joining two metals involves melting something. You melt the parent metal, or you melt a filler, or you melt a solder that wets both sides. Heat is the whole strategy.

Wire bonding is the exception, and it's the reason it exists.

Inside every integrated circuit you've ever used, the silicon die is connected to the outside world by wires finer than a hair, attached at both ends without a trace of solder. Inside a lot of battery packs, the cells are connected to their bus bars the same way, with much heavier wire. In both cases the joint is made in a few milliseconds by pressing the wire down and **vibrating it** until the two metals give up and become one piece.

No melting. No flux. No consumables except the wire. And — the part that matters most for a battery — almost no heat into the thing you're bonding to.

## Why you'd want a joint that doesn't get hot

Start with the constraint, because it explains the whole technique.

A lithium cell is a sealed chemical system with a strong opinion about temperature. [Everything that degrades it and everything that endangers it](/blog/how-batteries-work/) is accelerated by heat, and its safety vent and seals live a few millimetres from wherever you're trying to make a connection. Soldering a heavy conductor to a cell terminal means parking a large thermal load right there for seconds. That is, at best, a way to quietly damage every cell you touch.

Silicon has the same problem for different reasons: aluminium bond pads sit on top of delicate structures that don't want to be cooked or cratered.

So you need a joint that is **electrically excellent, mechanically strong, fast, repeatable, and thermally almost free.** That's a demanding list, and ultrasonic wire bonding is the answer to it.

## The trick: break the skin, then let physics do it

Here's the thing that makes it work, and it's genuinely elegant.

Two clean metal surfaces pressed together will bond. Not "stick" — actually bond, atom to atom, because at that range the metals have no way of telling where one ends and the other begins. This is cold welding, and the only reason your spoons don't fuse together in the drawer is that no metal surface in air is clean. Aluminium in particular grows a hard oxide skin within milliseconds of meeting the atmosphere, and it never stops wearing one.

Wire bonding is a machine for defeating that skin.

<figure>
	<img src="/diagrams/wedge-bond-cycle.svg" alt="Four framed stages of a wedge bond. First, a wedge tool descends toward a wire lying across a pad. Second, the tool presses the wire down while a horizontal double-headed arrow shows ultrasonic scrubbing. Third, the tool lifts and travels, drawing the wire into a loop. Fourth, a completed loop sits between two pads with the tail broken off" width="640" height="300" loading="lazy" />
	<figcaption>Force, vibration, time. Three knobs, one weld, and nothing anywhere near melting point.</figcaption>
</figure>

The tool presses the wire against the pad with a controlled **force**, then vibrates it sideways — typically around 60 kHz, through a few microns of travel. That scrubbing does two jobs at once. It fractures and sweeps aside the oxide on both surfaces, and it deforms the wire so fresh, unoxidised metal is pushed into intimate contact with fresh metal underneath.

At that point the bond just happens. Atoms diffuse across the interface, and within a couple of milliseconds you have a continuous piece of metal where there were two. The joint reaches maybe a third of the melting temperature at most — warm, not hot.

It is the closest thing in [joining metal](/blog/learning-to-weld/) to a magic trick: no arc, no puddle, no filler, no shielding gas, and a joint that will typically outlast the wire attached to it.

## Two families: ball and wedge

There are two ways to do this, and which one you meet depends on what industry you're in.

**Ball bonding** is what packages microchips. A spark melts the tip of the wire into a tiny ball, the tool — a capillary with the wire threaded through it — presses that ball onto the pad, and heat plus ultrasound makes the joint. Because the wire comes down the middle of the tool, the machine can then move in *any* direction to make the second bond. That freedom is why ball bonders are fast, and why they place many bonds per second in IC assembly. The catch is that they usually want the part heated to 125–175 °C, and they're limited to fairly fine gold or copper wire.

**Wedge bonding** feeds the wire in at an angle under a grooved tool. Both ends are wedge bonds, no ball involved, and no heat is required at all. The trade-off is direction: because the wire feeds from behind the tool, the bond head has to be rotated to align with the wire path before each bond, which makes it slower. In exchange it works at room temperature and it scales up to heavy wire.

| | Ball bonding | Wedge bonding |
| --- | --- | --- |
| Wire | gold, copper, fine | aluminium, fine to very heavy |
| Heat | 125–175 °C typical | none |
| Second bond direction | any | must align with the wire |
| Speed | very fast | slower |
| Where you meet it | IC packaging | power modules, battery packs |

For anything involving cells, that table decides itself. **Heavy aluminium wedge bonding**, at room temperature, is the one that doesn't cook the product.

## The bond wire is also a fuse

This is the part that surprises people who know wire bonding from semiconductors, and it's the reason packs use it rather than welding a solid tab.

A bond wire is a deliberately small cross-section in an otherwise fat conductor. A 400 µm aluminium wire has a cross-section of about 0.13 mm² — hundreds of times less metal than the bus bar it connects to. Put enough current through it and it becomes the hottest thing in the circuit and vaporises.

That's not a weakness. That's a **safety feature you get for free**, and packs are designed around it. If one cell in a parallel group goes internally short, its neighbours will try to dump their energy into it. You'd very much like something to disconnect that cell from the group before that turns into [a thermal event](/blog/making-batteries-explode-on-purpose/). Sizing the bond wires so they open first turns every single cell connection into its own fuse — thousands of them, with no extra components.

The classic rule of thumb for fusing current is Preece's equation, `I = a·d^1.5`, which for aluminium in free air gives roughly:

| Wire diameter | Rough fusing current |
| --- | --- |
| 250 µm | ~7 A |
| 300 µm | ~10 A |
| 400 µm | ~15 A |
| 500 µm | ~21 A |

Treat those as orientation, not design values. Preece assumes a long wire in still air at steady state, and a bond wire is short with a substantial heat sink clamped to each end, so the real figure is higher and the real behaviour is a transient — how much `I²t` the wire absorbs before it opens, not what current it survives forever. Actual fusing characteristics get established by testing the real geometry, which is exactly the kind of thing that gets characterised on a bench with a lot of sacrificial samples.

The consequence for the person making the bonds is worth stating plainly: **on a pack, wire diameter, wire count and loop length are electrical design parameters, not assembly preferences.** You do not add a wire to make a connection feel more solid, and you do not substitute a spool of something similar.

## Three knobs, and how to read the result

A wedge bonder gives you force, ultrasonic power, and time. That's essentially it. Every recipe is a point in that three-dimensional space, and every failure is a direction you've gone too far in.

The useful thing is that you can read the settings back out of the bond, because the visible **deformation** of the wire is the proxy for how much energy went in. A properly bonded heavy wire ends up squashed to something like 1.3 to 1.8 times its original diameter, and there is a whole grammar in that number:

- **Too little** — narrow footprint, shiny wire, bond looks barely touched. The oxide never fully broke and the weld is partial. It will pass a gentle test and fail in service.
- **Too much** — wire flattened out wide and thin, with a sharp transition where it leaves the bond. You've made an excellent weld and simultaneously created a stress riser at the **heel**, which is now the weakest point of the whole joint.

That second one is the trap. Overbonding doesn't look like a defect. It looks like enthusiasm, and it produces joints that survive the pull test on the bench and crack at the heel three months into a vibration life.

## The pull test, and why "it broke" isn't the answer

Bonds get graded destructively: a hook goes under the loop, pulls upward, and the machine records the force and — critically — *where it failed*.

<figure>
	<img src="/diagrams/bond-pull-test.svg" alt="A wire loop between two pads with a hook under its apex pulling upward. Three numbered locations are marked: at the foot of the first bond, at the heel just above it, and mid-span along the loop. A key below rates them: lift-off at the foot is a reject because the weld never really formed, a crack at the heel is marginal because the bend was overstressed, and the wire parting mid-span is what you want because the weld outlasted the wire" width="640" height="320" loading="lazy" />
	<figcaption>The number tells you how strong. The failure location tells you what you actually built.</figcaption>
</figure>

The failure mode carries more information than the force does:

- **Lift-off** — the bond peels cleanly off the pad, leaving little or nothing behind. The weld never properly formed. This is a reject regardless of what the gauge said, because a partial weld can be surprisingly strong in tension and still be a bad joint electrically and in fatigue.
- **Heel break** — the wire cracks at the bend just past the bond. The weld was fine; the geometry was the problem. Usually overbonding, a loop shape that's too tight, or tool damage.
- **Wire break mid-span** — the wire itself parts somewhere along the loop. This is the goal. It means the weakest thing in the assembly is the wire, which is precisely what you designed for and the only failure mode that says the welds are stronger than the conductor.

So the acceptance criterion is two-part: a force above a minimum, *and* an acceptable failure mode. A high number with a lift-off is a worse result than a lower number with a clean wire break.

In production you pair that with a **non-destructive pull** — tugging every bond, or a sample, to a fraction of the minimum, which finds the grossly bad ones without harming the good ones — plus destructive testing on first-offs and at intervals. Same philosophy as [proving a machine's process rather than its cycle](/blog/commissioning-a-machine/): the equipment reporting success is not evidence the joint is good.

## What actually ruins bonds

After enough of them, the causes narrow down to a short list, and almost none of them are the bonder's fault.

**Contamination.** The number one cause, by a distance. This is a process that depends entirely on two surfaces getting genuinely intimate, and anything in between — oils, fingerprints, mould release, oxidation from parts sitting around too long, residue from an upstream cleaning step — prevents it. Handling discipline isn't fussiness here; it's the process.

**The surface underneath.** Bonding needs a solid backing. If the pad sits on something compliant — an unsupported tab, a part not clamped properly into the fixture, a gap under a bus bar — the ultrasonic energy goes into wobbling the assembly instead of scrubbing the interface. The bond comes out weak and nothing about the machine settings looks wrong. Fixturing is genuinely half of bond quality.

**Plating and finish.** Bonds are sensitive to what's on the surface, in ways that don't always show up until later. Aluminium onto aluminium is the happy case. Dissimilar metals can form brittle intermetallics over time, especially with heat — the classic being gold-aluminium "purple plague," where a joint that tested fine degrades over months.

**Tool wear.** The wedge has a textured face that grips the wire so it can scrub it rather than slide over it. That texture wears smooth, and as it does, bond quality drifts down gradually rather than failing outright. Tools are consumables with a bond count, and tracking that count is real maintenance work.

**Loop shape.** Loop height and length aren't cosmetic. Too tight and the heel is loaded in bending. Too tall or too long and the loop can sag, resonate, or touch something it shouldn't. In a pack that spends its life on a road, the loop is a spring that has to absorb both thermal expansion and constant vibration for years, so its geometry is part of the design and is reproduced by the machine on every cycle.

**Machine setup.** Bond head parallelism, wire clamp tension, feed alignment, and fixture flatness all shift what a given recipe produces. Which is why a recipe is validated on a specific machine, with specific tooling, against a specific part — and re-validated when any of those change.

---

What I like about wire bonding is that it inverts the intuition you build up everywhere else in fabrication. Normally, joining metal means adding energy until something liquefies and hoping it solidifies in the right shape. Here you add barely any energy at all. You simply remove the one thing standing between two pieces of metal — a few nanometres of oxide — and they do the rest themselves, because that's what metals want to do when you finally let them touch.

And on a battery pack it does three jobs in one motion: it carries the current, it holds the assembly together, and it stands ready to sacrifice itself the moment a cell starts behaving badly. A hair of aluminium, welded at room temperature in a few milliseconds, doing all of that a few thousand times over.
