---
title: 'The Loops That Drive Your Car'
description: 'Driving is not a skill so much as a feedback loop — and under the hood, your car is running dozens more of them, some a thousand times faster than you.'
pubDate: 2026-07-22
tags: [automotive, control]
series:
  name: 'Under the Hood'
  part: 1
---

Watch a car "driving straight" on the highway from above and you'll see it isn't. It's drifting a few centimeters left, being corrected, drifting right, being corrected — a gentle, endless oscillation around the lane center. Nobody drives straight. Drivers *continuously correct*, and the correction happens so automatically you don't notice you're doing it.

That's not a flaw in human driving. That *is* driving. Eyes measure where the car is, the brain compares it to where the car should be, hands and feet nudge the controls, the road position changes, the eyes measure again. Sense, compare, act, repeat — several times a second, for the entire trip.

If you've read the [PID post](/blog/pid-controllers/), you'll recognize the shape instantly: driving is a feedback control loop, and the driver is the controller.

<figure>
	<img src="/diagrams/driving-loop.svg" alt="Block diagram of the driving loop: intended path is compared against actual position, the driver or computer commands the steering, throttle, and brakes, the car moves, and eyes or sensors feed the result back to the comparison" width="640" height="280" loading="lazy" />
	<figcaption>The driving loop. The profound part: every block can be swapped — including the controller — and the loop doesn't change shape.</figcaption>
</figure>

## Loops all the way down

Here's what makes a car such a beautiful piece of engineering: while you run that outer loop, the machine beneath you is running *dozens of inner ones* — same shape, wildly different speeds.

**The air–fuel loop.** Gasoline burns cleanly at almost exactly 14.7 parts air to 1 part fuel. An oxygen sensor in the exhaust reports whether the last combustion ran rich or lean, and the engine computer trims the fuel injectors accordingly — roughly a hundred corrections per second, rebalancing the mixture continuously as you climb hills and stab the throttle. When mechanics say an engine is "running closed loop," this is the loop they mean. It's been standard since the 1980s; it is the reason emissions dropped an order of magnitude.

**Anti-lock brakes.** A locked, skidding tire has *less* grip than one on the edge of slipping, and a human can't feel the difference fast enough to matter. ABS can: wheel-speed sensors notice a wheel decelerating impossibly fast — locking up — and a valve releases and reapplies that wheel's brake pressure up to ~15 times per second. That growling pulse in the pedal during a panic stop is the loop, running faster than your reflexes ever could.

**Electronic stability control.** The most elegant loop in the car measures *disagreement*. The steering wheel angle says where you're *asking* the car to go; a yaw-rate gyroscope says where it's *actually* rotating. When the two diverge — the rear stepping out on a wet ramp — ESC brakes *individual wheels* to twist the car back onto the path you asked for. It typically intervenes before you've consciously registered the slide. Regulators consider it the biggest life-saver since the seatbelt.

**Cruise control.** The textbook case: error = set speed − actual speed, feed it a [PID controller](/blog/pid-controllers/), actuate the throttle. If your car holds speed downhill, that's the integral term earning its keep.

| Loop | Measures | Actuates | Full cycle |
| ---- | -------- | -------- | ---------- |
| Air–fuel | Exhaust oxygen | Fuel injectors | ~10 ms |
| ABS | Wheel speeds | Brake pressure valves | ~10–70 ms |
| Stability control | Yaw vs. steering angle | Individual brakes | ~20 ms |
| Cruise control | Vehicle speed | Throttle | ~100 ms |
| The driver | Road position | Wheel, pedals | ~300–500 ms |

Read the last column bottom-up: the loops get *faster* as they get closer to the physics. That's the general law of layered control — outer loops set goals, inner loops enforce them, and each layer runs an order of magnitude quicker than the one above.

## The nervous system

None of these loops lives in isolation. The wheel-speed sensors that serve ABS also feed the stability control, the transmission, even the navigation's dead reckoning in tunnels. They can share because every module in the car publishes its measurements on a common network — the **CAN bus**, a two-wire [broadcast protocol](/blog/how-machines-talk/) where messages carry priorities so "brake command" always beats "seat heater status" to the wire. A modern car carries a few dozen computers having a nonstop group chat at a megabit per second, and the loops are its conversation.

## Swapping the controller

Now the punchline the diagram was setting up. Look at each driver-assist feature and ask: *which block did it replace?*

- **Lane keeping** — a camera measures lane position, so the *eyes* block is silicon now; the error feeds a steering motor. That's the outer driving loop with the human removed from steering.
- **Adaptive cruise** — the setpoint changes from "72 mph" to "two seconds behind that bumper," measured by radar. Same loop, smarter reference.
- **Full autonomy** — perception builds the world model, planning chooses the intended path, control tracks it. Sense, compare, act — running at tens of hertz instead of your two.

> Self-driving doesn't add a new kind of loop to the car. It replaces the slowest, most distractible controller in the stack — and every inner loop, from ESC down to fuel trim, keeps running underneath it exactly as before.

---

So the next time ABS growls at you on a wet morning, or you feel ESC nip one brake caliper coming off a slick on-ramp, notice what happened: an inner loop measured reality a few hundred times while you were still forming an opinion, disagreed with the physics, and quietly fixed it. You're not just driving a machine. You're the outermost loop of a tower of them — and the tower is very good at its job.
