---
title: 'Project: A Pick-and-Place Gantry Built from a Dead 3D Printer'
description: 'My mechatronics final project — two axes, a servo gripper, an industrial-style control panel, and every part of this series bolted into one machine.'
pubDate: 2026-07-28
series:
  name: 'Maker Basics'
  part: 7
project:
  cover: /images/gantry/gantry.jpg
  blurb: A two-axis automated pick-and-place machine built from a salvaged 3D printer — industrial control panel, servo gripper, and Arduino state-machine firmware.
  stack: [Arduino, 'C++', 3D printing, Steppers, Control panel]
---

The [Maker Basics series](/blog/how-electricity-actually-works/) ended with a claim: electricity, communication, a microcontroller, sensors, actuators, and 3D printing — *"that's the whole toolkit; the rest is what you choose to build with it."* This post is me putting that claim to the test, because my mechatronics final project used every single part of it.

The machine is an **automated pick-and-place gantry**: it homes itself, waits until an ultrasonic sensor sees an object arrive at the pickup station, drives a servo gripper down to grab it, carries it along the X axis, and sets it down at one of two drop platforms — alternating between them automatically, or on command in manual mode, while counting every drop. Pick-and-place is the bread and butter of real manufacturing automation; this is the desktop-scale version, built from salvage and 3D printed parts.

<figure>
	<img src="/images/gantry/gantry.jpg" alt="The finished two-axis gantry: a vertical Z axis with lead screw and servo gripper riding on a horizontal X axis, above a work surface with 3D-printed platforms and white pickup objects" width="900" height="1200" loading="lazy" />
	<figcaption>The finished machine: X axis salvaged from a 3D printer, Z axis built up from extrusion, and 3D-printed everything else.</figcaption>
</figure>

## The frame: a printer's second life

The [3D printing post](/blog/3d-printing-from-sketch-to-solid/) pointed out that a printer is just stepper motors, rails, and lead screws with a hot end attached. Take away the hot end and what's left is a motion platform — so when I found myself with a salvaged 3D printer, its X-axis assembly became the backbone of the build. The rails and lead screws were already sized to work together, which simplified the design and cut the cost dramatically compared to buying belt-and-pulley or rack-and-pinion hardware new.

A 20×40 mm aluminum extrusion bolted vertically to the X carriage became the Z axis, carrying its own stepper, lead screw, limit switches, and the gripper. Motion on both axes works exactly as the [actuators post](/blog/actuators-how-code-moves-the-world/) described: **NEMA17 steppers** turn **T8 lead screws**, trading speed for precision and holding torque, while **V-slot wheels** keep the carriages snug on the rails with adjustable tension. Lead screws are slower than belts — that trade-off shows up in the results later — but for a pick-and-place task, their step-counted precision and refusal to backdrive were exactly right.

Everything that connects one part to another was modeled in Fusion 360 and printed on a Bambu printer: motor brackets, limit-switch mounts, the two drop platforms, a housing to hold the ultrasonic sensor at a repeatable angle, and even the demonstration object itself, shaped so the gripper can grab it without tipping it. When a bracket was a millimeter off, I revised the CAD and reprinted — the rapid-iteration loop that makes 3D printing the natural companion to projects like this.

<figure>
	<img src="/images/gantry/printed-parts.jpg" alt="CAD renders of the 3D-printed parts: T-nut housing, stepper bracket, gripper bracket, drop platform, pickup object, ultrasonic sensor platform, limit switch bracket, and the assembled gripper" width="730" height="1200" loading="lazy" />
	<figcaption>The printed cast: brackets, platforms, the sensor housing, the pickup object, and the gripper.</figcaption>
</figure>

For the gripper itself I surveyed the options — vacuum cups, magnets, pneumatics, soft silicone fingers — and landed on the open-source **AR4 servo gripper from Annin Robotics**: a two-finger clamp driven by an MG996R hobby servo, compact enough for the gantry's workspace and printable from published CAD files.

<figure>
	<img src="/images/gantry/gripper.jpg" alt="Close-up of the 3D-printed AR4 servo gripper mounted on the Z carriage, with the red servo horn visible" width="901" height="1200" loading="lazy" />
	<figcaption>The AR4 gripper on the Z carriage — one servo, two printed fingers.</figcaption>
</figure>

## The electrical panel: no breadboards allowed

This is the part of the project I'm proudest of. Most Arduino builds live as a nest of jumper wires; I wanted mine wired like the industrial control panels I'd seen at work — and a knowledgeable team there generously coached me on the practices that make a panel professional.

Mains enters through a 13 A fused UK plug into a **main isolator switch**, then a **residual-current breaker (RCBO)** guarding the whole system. Two DIN-rail supplies split the power rails: a Mean Well unit providing **24 V** for the stepper drivers and motors, and a **5 V / 3 A** supply for the Arduino, sensors, and servo — each rail protected by its own 2 A fuse. A red two-position **safety switch** can kill both DC rails at once for troubleshooting without touching the mains side, and an indicator lamp confirms the panel is live. Every wire lands on a labeled **terminal block**, grouped into four sections: mains in (X1), 24 V distribution (X2), 5 V distribution (X3), and all field I/O — limit switches, ultrasonic sensor, servo (X4).

<figure>
	<img src="/images/gantry/terminal-blocks.jpg" alt="The terminal block rows inside the panel, labeled Mains, 24VDC, 5VDC, and Inputs/Outputs, with numbered wires landing on each block" width="1200" height="906" loading="lazy" />
	<figcaption>The terminal block sections. Every conductor is numbered and labeled — future-me can trace any wire in seconds.</figcaption>
</figure>

Motion is driven by two **TB6600 stepper drivers** — chosen over the smaller A4988/DRV8825 modules for their 4 A capacity, DIP-switch configuration, and enclosure-friendly form factor — set to 1/8 microstepping with a 1–1.2 A current limit, which keeps the motors smooth *and* safely under the fuse rating. An **Arduino Mega 2560** on a screw-terminal shield runs the show. I drew the full schematic set in Excalidraw, one page per subsystem, with every wire number matching the physical labels in the panel.

<figure>
	<img src="/images/gantry/control-panel.jpg" alt="The finished control panel: RCBO and Mean Well 24V supply on the top DIN rail, fuses, Arduino Mega on a terminal shield, TB6600 drivers, and labeled terminal blocks below, all connected through wire duct" width="900" height="1200" loading="lazy" />
	<figcaption>The panel: breaker and supplies up top, terminal blocks and drivers below, everything routed through duct. My favorite deliverable of the whole project.</figcaption>
</figure>

If the [electricity post](/blog/how-electricity-actually-works/) made fuses, breakers, and grounds feel abstract, this box is where all of it became load-bearing — including a note on the schematic to common the two supplies' grounds so the 5 V logic and 24 V power sides agree on what zero volts means.

## The software: one loop, four jobs

The firmware is a state machine in the classic [sense → decide → act](/blog/the-loops-that-drive-your-car/) shape, written in C++ with **AccelStepper** handling motion profiles and the Servo library driving the gripper:

<figure>
	<img src="/images/gantry/state-machine.png" alt="Flowchart of the firmware: home system, check serial commands and emergency stop, detect object, then run pick-and-hold followed by a drop sequence in auto or manual mode, incrementing drop counters" width="1101" height="1200" loading="lazy" />
	<figcaption>The control flow: home once, then loop — listen for commands, watch for an object, pick, drop, count, repeat.</figcaption>
</figure>

On every pass, the loop checks the serial port for commands (`start`, `stop`, `home`, `auto`, `manual`, `drop1`, `drop2`), homes both axes against their limit switches if needed, and then polls the **HC-SR04** — the same time-of-flight measurement from the [sensors post](/blog/sensors-how-projects-perceive/), echo microseconds divided by 29 and halved. When something sits within 4 cm of the pickup station, the machine acts:

```cpp
// pickAndHold(): move to the pick location and grab the object
void pickAndHold() {
	if (emergencyStop) return;

	moveXTo(X_PICK_POSITION);   // 1) travel to the pickup station
	if (emergencyStop) return;

	moveZTo(Z_PICK_POS);        // 2) lower the gripper around the object
	if (emergencyStop) return;

	closeGripper();             // 3) clamp
	if (emergencyStop) return;

	moveZTo(Z_SAFE_POS);        // 4) lift clear
	objectHeld = true;
}
```

Two details I'd defend in a code review. First, the `if (emergencyStop) return;` after *every* action: limit switches double as crash detection after homing, and any unexpected trigger or a `stop` command halts the sequence at the next boundary rather than plowing on. Second, steppers are **open-loop** — the code believes `currentPosition()` because it counted the steps itself — so homing against physical switches is the only moment the software's beliefs are checked against reality. That asymmetry is exactly what the [actuators post](/blog/actuators-how-code-moves-the-world/) meant by steppers "positioning without sensors," and it's also where the project bit me (see below).

## Results

The numbers, measured rather than hoped for:

| Metric | Result |
| ------ | ------ |
| Homing consistency | 20+ consecutive cycles, no overshoot |
| Positional repeatability | ±0.5 mm (caliper-measured, both axes) |
| Endurance run | 50 pick-and-place cycles, no stalls or misfires |
| Cycle time (detect → pick → drop) | 17–19 s |

The cycle time is honest lead-screw pacing — belts or coarser microstepping would speed it up, but the proof-of-concept goal didn't need it.

The failures taught more than the metrics. **The overtravel incident:** after an emergency stop, I re-homed the machine — and the axis, starting from an unexpected position, drove past its limit and physically destroyed a limit switch, leaving the machine with three instead of four. The fix was procedural (a mandatory reset sequence after any e-stop) rather than the full homing-logic rework I'd have liked; the lesson — that recovery paths deserve as much design as the happy path — was worth a switch. **The lying sensor:** the ultrasonic readings were erratic until I realized the first printed housing was interfering with the echo; a reprint with a wider opening fixed it — the [sensors post's](/blog/sensors-how-projects-perceive/) "all sensors lie a little," experienced firsthand. **The slipping grip:** solved by tuning the servo's close angle and adding friction material to the printed jaws.

## What's next

The roadmap writes itself: a Y axis to make it a full three-axis Cartesian robot, a beefier supply and fuses so both motors can run simultaneously instead of sequentially, a grip-pressure sensor so the machine *knows* it's holding something rather than assumes it, and eventually camera-based detection so it can find objects instead of waiting for them at a fixed station.

---

Here's the accounting that makes this the right capstone for the series: the power panel is [part 1](/blog/how-electricity-actually-works/), the serial commands and sensor timing are [part 2](/blog/how-machines-talk/), the Mega is [part 3](/blog/what-an-arduino-actually-is/), the HC-SR04 and limit switches are [part 4](/blog/sensors-how-projects-perceive/), the steppers and servo are [part 5](/blog/actuators-how-code-moves-the-world/), and the printed skeleton is [part 6](/blog/3d-printing-from-sketch-to-solid/). Nothing in this machine goes beyond what those six posts cover — which was the series' promise all along. The toolkit is real. Go build something with it.
