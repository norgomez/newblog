---
title: 'Running Cable: A Field Guide to Getting Wires from A to B'
description: 'Every project ends with “now I just need to get a cable over there.” The planning, physics, and tools that make that sentence honest.'
pubDate: 2026-07-30
tags: [electricity, tools]
---

Every hardware project has a final boss nobody plans for: the cable run. The camera works, the access point works, the workbench has power — *on the bench*. Getting the wire from where it is to where it needs to be, through walls and ceilings and that one impossible corner, is its own discipline. Electricians and network installers spend careers on it, and the difference between their runs and a weekend bodge isn't strength or luck — it's planning, a little physics, and about six specific tools.

This is the field guide I wish I'd had before my first pull.

## Plan the run before you touch a drill

**Define what's actually being carried.** Data, power, or both? How far, and how many? Answers change the cable: a short patch is forgiving; a 40 m run to a garage camera wants Cat6 and maybe **Power over Ethernet** — one cable delivering both the network and up to ~25 W of power, which regularly deletes half the problem. For mains-level power, the answer may legally be "an electrician does this part" depending on where you live; low-voltage data and DC are generally fair game everywhere.

**Choose the path, not the shortest line.** Cable routes are like hiking trails: the good ones follow existing features. Where does plumbing already pass between floors? Is there a chase beside the chimney, a soffit, an attic or crawl space that gets you 90% of the way? Vertical runs inside walls are easy; horizontal runs through studs are misery. Route around heat (flues, hot water pipes) and damp, and if the run goes outside, use cable rated for UV and burial — ordinary PVC jackets crack in sunlight.

**Pull two.** Whatever you're pulling, the marginal cost of a second cable in the same pull is a few pounds of copper and zero extra labor. The cost of *re-doing the pull* next year because you need a second line is the entire job again. Copper is cheap; access is expensive.

## The physics that bites

**Power and data are bad roommates.** A mains cable is a 50 Hz radiator, and a data cable running parallel beside it is an antenna — the [noise that checksums exist for](/blog/how-machines-talk/) gets injected along every parallel centimeter. The rules of cohabitation: keep separation on parallel runs (∼300 mm is the classic guideline), never share a conduit between mains and data, and when they must meet, **cross at 90°** — a perpendicular crossing offers almost no coupling length.

<figure>
	<img src="/diagrams/cable-separation.svg" alt="Diagram of cable cohabitation rules: a mains cable and data cable running parallel with a minimum 300 millimeter gap, and a data cable crossing the mains at 90 degrees marked as fine" width="640" height="260" loading="lazy" />
	<figcaption>The cohabitation rules: distance when parallel, perpendicular when crossing. Every parallel centimeter is coupling length.</figcaption>
</figure>

**Long thin wire is a resistor.** For power runs, [Ohm's law](/blog/how-electricity-actually-works/) collects a toll proportional to distance:

```text
20 m run of 0.75 mm² wire feeding a 5 A load:
R ≈ 2 × 20 m × 0.024 Ω/m ≈ 0.96 Ω        (current goes out AND back)
V_drop = 5 A × 0.96 Ω ≈ 4.8 V             — 40% of a 12 V supply, gone as heat
```

The fix is fatter wire, higher voltage (this is why PoE runs at ~48 V), or a shorter run. Size the conductor for the *distance*, not just the current.

**Cables have a minimum bend radius.** Roughly four times the cable's diameter for Cat6, more for coax and much more for fiber. Kink a data cable around a sharp corner and it may still "work" while quietly failing the crosstalk performance it was rated for. If a corner in your route demands a sharp bend, the route is wrong.

**Conduit has a speed limit.** The guideline is to fill conduit to about **40% of its cross-section**, not 100% — friction rises brutally with fill, and the pull that slides at three cables seizes at five. Relatedly: pull smoothly, never jerk. Terminations and jackets die from the snatch loads, not the steady ones.

## The toolkit

| Tool | What it's actually for |
| ---- | ---------------------- |
| Stud/scan detector | Finding studs, pipes, and *live cables* before the drill does |
| Fish tape | A steel ribbon that pushes through conduit and short wall bays |
| Glow rods | Rigid, connectable rods for spanning ceilings, crawl spaces, insulation |
| Pull string + cable lube | The actual workhorses — see below |
| Auger / spade bits (+ long flex bit) | Clean holes through studs and plates |
| Magnetic pull kit | A magnet and steel leader for fishing cables down inside finished walls |
| Borescope (or phone on a stick) | Seeing inside the wall before committing to it |
| Cable tester | Continuity and wiremap the moment the run is terminated |
| Label maker | The tool that pays off in five years |

Nothing on that list is exotic, and the whole kit costs less than one call-out fee.

## The pull itself

The professional sequence is nearly a ritual, and every step exists because of a ruined afternoon:

1. **Establish a pull string first.** Push the fish tape or rods through the empty route, attach a strong line, pull it back through. The string is now your route made physical — everything else follows it.
2. **Dress the head.** Stagger the cable ends, tape them into a smooth streamlined bundle onto the string with no square shoulders to snag. Most stuck pulls are snagged heads, not friction.
3. **Lube generously.** Proper cable lube feels like cheating — it can cut pulling tension by half on a long conduit run.
4. **Two people, and talk.** One feeds, one pulls, and the words "stop" and "slack" prevent the yank that stretches a cable past its rating.
5. **Pull a new string through with the cables.** This is the rule that separates professionals from everyone else: every pull *leaves a string behind* for the next pull. The route stays conquered forever. It's [infrastructure for future-you](/blog/pick-and-place-gantry/), the same instinct as a labeled terminal block.

## Terminate, test, label — then document

Terminate data runs onto keystone jacks or a patch panel rather than bare plugs — solid-core cable wants punch-downs, and wall-plate terminations survive being yanked. Then test *immediately*, while the tools are out and the wall is open: a £15 wiremap tester catches the swapped pair in thirty seconds that would otherwise become an evening of mystery.

Finally, the cheapest step with the longest payoff: **label both ends** with the same name, and keep a note of what runs where — a text file is fine, photos of the open wall before it closes are gold. Every run you document is a wall you never have to open on faith again.

---

Routing cable well is infrastructure engineering in miniature: survey the terrain, respect the physics, use the boring tools correctly, and leave the route better than you found it. The signal doesn't care how elegant the pull was — but the next person to touch that wall will know exactly what kind of engineer came before them. Make the string say something good about you.
