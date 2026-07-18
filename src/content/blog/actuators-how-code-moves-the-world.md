---
title: 'Actuators: How Code Moves the Physical World'
description: 'Motors, servos, steppers, and solenoids — what each one is actually good at, and the one rule that keeps them from frying your board.'
pubDate: 2026-07-14
series:
  name: 'Maker Basics'
  part: 5
---

If sensors are how a project perceives the world, **actuators are how it acts on it** — anything that converts an electrical signal into physical motion or force. Motors that spin, servos that point, solenoids that push, relays that click bigger things on and off. Every robot, printer, lock, and vending machine is a pile of actuators with opinions.

Before touring the options, one rule that saves boards and weekends:

> A microcontroller pin is a *messenger*, not a *power source*. It can supply a few milliamps — enough to light an LED or whisper to a driver chip. Motors want hundreds to thousands of milliamps. Connect a motor directly to a pin and the pin loses.

So the pattern is always the same: the Arduino sends a small control signal to a **driver** (a transistor or driver board), and the driver switches the real power. Signal and muscle are separate circuits. Once that clicks, every actuator below is a variation on the theme.

## PWM: how digital chips fake "medium"

A digital pin knows only ON and OFF — so how do you run a motor at half speed? You switch it on and off very fast, hundreds of times per second, and vary the *proportion* of on-time. On 50% of the time: half power. On 80%: strong. This is **pulse-width modulation (PWM)**, and it's the workhorse trick of embedded control:

```cpp
analogWrite(9, 128); // ~50% duty cycle — half speed
analogWrite(9, 255); // full speed
analogWrite(9, 40);  // gentle crawl
```

Despite the name, `analogWrite` outputs no in-between voltage — just fast pulses. The motor's inertia (or your eye, for an LED) does the averaging.

<figure>
	<img src="/diagrams/pwm-duty-cycle.svg" alt="Three square waveforms at 25, 50, and 75 percent duty cycle, each with a dashed line marking the average voltage level" width="640" height="300" loading="lazy" />
	<figcaption>Three duty cycles. The switching is far too fast to perceive — what the motor (or your eye) responds to is the average, shown dashed.</figcaption>
</figure>

## The cast of characters

### DC motors: fast and simple

Apply voltage, it spins; reverse the voltage, it spins backward; PWM it, you control speed. Wheels, fans, pumps. To reverse a motor from code you use an **H-bridge** — four electronic switches arranged so software can flip which way current flows. You'll usually buy this as a small driver board (the L298N is the classic starter) rather than build it.

<figure>
	<img src="/diagrams/h-bridge.svg" alt="H-bridge schematic: a battery, four switches arranged around a motor, with switches S1 and S4 closed so current flows left to right through the motor" width="640" height="320" loading="lazy" />
	<figcaption>An H-bridge. Close S1 + S4 and current crosses the motor left-to-right; close S2 + S3 instead and it flows the other way — the motor reverses.</figcaption>
</figure>

What DC motors can't do is *hold a position*. They spin; that's the whole résumé.

### Servos: motors that know where they're pointing

A hobby servo is a DC motor plus a gearbox plus a position sensor plus a control circuit, all in one box the size of a matchbox. You don't tell it "spin" — you tell it "**go to 90 degrees**," and it goes there and pushes back against anything that tries to move it.

The command is a timed pulse (1–2 ms encodes 0–180°), but a library hides the details:

```cpp
#include <Servo.h>
Servo arm;

void setup() {
	arm.attach(9);
}

void loop() {
	arm.write(0);    // swing to 0°
	delay(1000);
	arm.write(140);  // swing to 140°
	delay(1000);
}
```

Robot arms and joints, camera gimbals, steering — anywhere "an angle" is the thing you want to control.

### Stepper motors: motion in precise ticks

A stepper moves in fixed increments — commonly 200 steps per revolution, 1.8° each. Command 400 steps, get exactly two turns. This makes position control *open-loop*: no sensor needed, just count your steps. The trade-off is complexity (they need a driver board and four wires) and they're power-hungry even standing still.

If you've watched a 3D printer lay down a perfect grid, you've watched steppers work: nearly every axis of every printer and CNC machine is one.

### Solenoids and relays: the on/off world

- A **solenoid** is an electromagnet that yanks a metal plunger — a push or pull lasting a fraction of a second. Door locks, valves, pinball flippers.
- A **relay** is a switch operated by an electromagnet: your 5 V signal closes a contact that can carry mains-level power. It's how a microcontroller safely turns on a lamp, a pump, or a heater — the Arduino never touches the big voltage.

One physics footnote: coils (motors, solenoids, relays) release a voltage spike when switched off. The standard fix is a **flyback diode** across the coil, giving that spike somewhere to go that isn't your transistor. Driver boards include it; wire your own transistor and it's on you.

## Choosing at a glance

| Actuator | Motion | Superpower | Typical use |
| -------- | ------ | ---------- | ----------- |
| DC motor | Continuous spin | Speed, simplicity | Wheels, fans, pumps |
| Servo | Rotation to an angle | Holds position | Joints, steering, gimbals |
| Stepper | Discrete steps | Repeatable precision | Printers, CNC, camera sliders |
| Solenoid | Short push/pull | Fast, decisive | Locks, valves |
| Relay | Switch contact | Controls big loads | Lamps, heaters, appliances |

---

Sense, decide, act — with [sensors](/blog/sensors-how-projects-perceive/) on the input side and actuators on the output, you have the full control loop. What's left is giving your project a body: mounts, gears, enclosures, and brackets. That's where [3D printing](/blog/3d-printing-from-sketch-to-solid/) enters the story.
