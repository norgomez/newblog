---
title: 'PID Controllers: The Sixty-Year-Old Algorithm Keeping Drones in the Air'
description: 'Three terms and one loop run your thermostat, your car, and every quadcopter — here is the intuition behind each letter.'
pubDate: 2026-07-18
---

Here's a deceptively hard problem: keep a drone hovering at exactly two meters. You have a sensor that measures altitude and a motor you can throttle up or down. Easy, right? If you're too low, add power; too high, cut it.

Try that literal strategy and the drone bounces like a yo-yo — full throttle up, overshoot, cut power, plummet, repeat. The naive approach fails because it only knows *which side* of the target it's on, not *how far off* it is, *how long* it's been off, or *how fast* things are changing.

The fix has been running the industrial world since before the moon landing: the **PID controller**. It's maybe fifteen lines of code, and once you see it, you'll recognize it everywhere — cruise control, espresso machines, 3D-printer hotends, chemical plants, camera gimbals.

## The loop

Everything starts from one number, computed over and over, many times per second:

```text
error = setpoint − measured
```

The **setpoint** is where you want to be (2 m altitude). The **measured** value comes from a [sensor](/blog/sensors-how-projects-perceive/). The controller's whole job is turning that error into a command for an [actuator](/blog/actuators-how-code-moves-the-world/) — and PID does it by adding together three views of the same error.

<figure>
	<img src="/diagrams/pid-loop.svg" alt="Block diagram of a PID control loop: setpoint enters a comparison node, the error feeds parallel P, I, and D blocks, their sum drives the system, and the sensor reading feeds back to the comparison" width="640" height="300" loading="lazy" />
	<figcaption>The loop: compare, correct, measure, repeat — dozens to thousands of times per second.</figcaption>
</figure>

## P — Proportional: react to the present

Push harder the further you are from the target:

```text
output = Kp × error
```

Twice as far below the setpoint, twice as much throttle. This alone flies better than bang-bang control, but it has two flaws. Push `Kp` high and the correction is so aggressive it overshoots and oscillates. Keep it modest and you get the stranger failure: the drone settles *slightly below* the target forever — because as the error shrinks toward zero, so does the output, until the correction exactly cancels gravity's pull and progress stops. That permanent little gap is called **steady-state error**.

## I — Integral: react to the past

The integral term fixes the gap by accumulating error over time:

```text
integral += error × dt
output += Ki × integral
```

If a small error persists, the accumulator quietly grows, adding more and more push until the error is *actually* zero — it has institutional memory. Its dark side: during a large maneuver the accumulator can wind up to an absurd value and then take ages to unwind, blowing past the target. Real implementations clamp it (**anti-windup**).

## D — Derivative: react to the future

The derivative term watches how fast the error is *changing* and pushes against rapid change:

```text
derivative = (error − lastError) / dt
output += Kd × derivative
```

Rising toward the setpoint quickly? The D term throttles back *before* you overshoot — it's the only term that acts like brakes. The cost: differentiating a noisy sensor amplifies the noise, so the D input is usually low-pass filtered first.

> P is a spring pulling you to the target. I is a slow hand correcting persistent bias. D is a damper resisting sudden motion. Tuning a PID is choosing the stiffness of each.

## The whole controller

All three, in the shape you'd actually run on a microcontroller:

```cpp
float kp = 2.0, ki = 0.5, kd = 1.0;
float integral = 0, lastError = 0;

float pidStep(float setpoint, float measured, float dt) {
	float error = setpoint - measured;

	integral += error * dt;
	float derivative = (error - lastError) / dt;
	lastError = error;

	return kp * error + ki * integral + kd * derivative;
}
```

Call it at a fixed rate, feed the return value to your motor or heater, and that's genuinely it — that's the algorithm holding the drone steady.

## Tuning, the honest version

The gains `Kp`, `Ki`, `Kd` are where the craft lives. Formal methods exist (Ziegler–Nichols is the classic), but the folk procedure covers most hobby projects:

1. Zero everything. Raise `Kp` until the system responds briskly and just starts to oscillate, then back it off ~30%.
2. Add a little `Kd` to calm the overshoot.
3. Add the smallest `Ki` that erases the steady-state gap.

Watch a first-person-view drone pilot describe a badly tuned quad as "floaty" or "twitchy" and you now know exactly which gain they're complaining about.

---

What makes PID beautiful is its ignorance: it contains no model of aerodynamics, thermodynamics, or anything else. It just measures, compares, and corrects — and that turns out to be enough to run most of the physical automation on Earth.
