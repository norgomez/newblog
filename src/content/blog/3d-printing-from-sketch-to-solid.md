---
title: '3D Printing: From a Sketch to a Solid Object on Your Desk'
description: 'How a triangle mesh becomes toolpaths becomes a thing you can hold — and the handful of rules that make prints stop failing.'
pubDate: 2026-07-17
tags: [fabrication, manufacturing, tools]
series:
  name: 'Maker Basics'
  part: 6
---

A desktop 3D printer is, mechanically, a very precise hot glue gun bolted to a robot. It melts plastic filament, extrudes it through a fine nozzle, and draws your object one paper-thin layer at a time, each layer welding onto the one below. This technique — **FDM, fused deposition modeling** — is what almost every printer under a few thousand dollars does.

What makes 3D printing feel like magic isn't the machine, though. It's the pipeline: in one evening, an idea becomes a measured drawing becomes a physical object, with no factory involved. Understanding that pipeline is the difference between printing and *engineering*.

## The pipeline: CAD → STL → slicer → G-code

**1. CAD — design the part.** You model the object in a CAD tool (Tinkercad in the browser for beginners; Fusion 360 or FreeCAD as ambitions grow). The craft here is *designing to dimensions*: real millimeters, measured with calipers, because this bracket has to actually fit that motor.

**2. STL — reduce it to triangles.** The exported `.stl` file is nothing but the object's surface approximated as thousands of triangles. No color, no units, no materials — just a skin of geometry.

**3. Slicer — turn shape into strategy.** The slicer (PrusaSlicer, Cura, OrcaSlicer) cuts the model into horizontal layers and plans the printer's every move: where the nozzle goes, how fast, how hot, where the plastic is solid and where it's hollow lattice. This is where almost all quality decisions live.

**4. G-code — the script the printer obeys.** The output is thousands of lines of embarrassingly literal instructions:

```text
G28            ; home all axes
M104 S210      ; heat nozzle to 210 °C
G1 Z0.2 F300   ; move to first layer height
G1 X60.5 Y42.1 E1.2 F1500  ; draw a line, extruding as we go
```

The printer executes them one by one — and, closing a loop from earlier in this series, the thing executing them is a microcontroller driving a set of [stepper motors](/blog/actuators-how-code-moves-the-world/). A 3D printer is the maker stack eating its own cooking.

## The slicer settings that actually matter

Slicers expose hundreds of knobs. Four of them do most of the work:

- **Layer height** — resolution vs. time. 0.2 mm is the everyday standard; 0.12 mm looks noticeably smoother and takes nearly twice as long.
- **Infill** — parts print mostly hollow, filled with a sparse internal lattice. 15% infill is fine for almost everything; strength comes more from **wall count** than infill percentage anyway.
- **Supports** — printed scaffolding under steep overhangs, snapped off afterward. They work, they scar the surface, and good designers mostly avoid needing them.
- **Orientation** — which face sits on the build plate. It decides where supports go, how strong the part is, and which surface ends up prettiest.

## Design rules the physics will enforce

You can't print arbitrary shapes in midair — molten plastic needs something under it. Three rules cover most failures:

1. **The 45° rule.** Walls that lean out up to ~45° print fine, because each layer still mostly rests on the last. Steeper than that sags into spaghetti — redesign, or add supports. Clever trick: a hole shaped like a teardrop instead of a circle needs no support at all.
2. **Leave clearance.** A 10 mm peg will *not* fit a 10 mm hole; printed holes come out slightly small. Leave 0.2–0.4 mm of gap for parts that must fit together, and test with a small print before committing to the big one.
3. **Layers are grain.** Like wood, a print is strong along its layers and weak between them — parts snap by *delaminating*. Orient the part so mechanical stress runs along the layers, not across the glue joints between them.

> The printer is not a replicator; it's a manufacturing process with a grain, tolerances, and moods. Design for the process and it rewards you; ignore it and it teaches you patience.

## Choosing a filament

| Material | Character | Best for |
| -------- | --------- | -------- |
| PLA | Easy, rigid, low-warp | Prototypes, brackets, most things |
| PETG | Tougher, slightly flexible, outdoor-safe | Functional parts, enclosures |
| ABS | Heat-resistant but warpy, needs enclosure | Car interiors, high-temp parts |
| TPU | Rubber-flexible | Gaskets, tires, phone cases |

Start with PLA. It prints reliably on any machine, and reliability is worth more than specs while you're learning.

## Why this closes the loop

Electronics projects have a universal last problem: the bare circuit board taped to a shelf, wires dangling. 3D printing solves exactly that — the enclosure with mounting bosses, the sensor bracket at the exact angle you need, the gear that doesn't exist in any store, replacement parts for things whose manufacturers vanished.

An [Arduino](/blog/what-an-arduino-actually-is/) gives your project a brain, [sensors](/blog/sensors-how-projects-perceive/) give it perception, [actuators](/blog/actuators-how-code-moves-the-world/) give it muscle — and a printer gives it a body. That's the whole toolkit; the rest is what you choose to build with it.
