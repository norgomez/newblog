---
title: 'Sensors: How Your Projects Learn to See, Hear, and Feel'
description: 'Every sensor is a translator from physics to numbers — here is how to read them, and how to handle the fact that they all lie a little.'
pubDate: 2026-07-15
series:
  name: 'Maker Basics'
  part: 4
---

A microcontroller without sensors is deaf and blind — it can only do what it was going to do anyway. Sensors are what turn a program into something that *responds*: lights that react to darkness, fans that react to heat, robots that stop before hitting the wall.

Under all the variety, every sensor does the same job: **it converts some physical quantity — light, heat, distance, motion — into an electrical signal a chip can measure.** The engineering is in how that signal gets to you, and how much you can trust it.

## The three ways sensors talk

### 1. Analog: a voltage you measure

The simplest sensors just output a voltage proportional to what they sense. A photoresistor changes resistance with light; wire it into a voltage divider and brightness becomes a voltage between 0 and 5 V. The microcontroller's **analog-to-digital converter (ADC)** turns that into a number:

```cpp
void setup() {
	Serial.begin(9600);
}

void loop() {
	int light = analogRead(A0); // 0 (dark) … 1023 (bright)
	Serial.println(light);
	delay(200);
}
```

<figure>
	<img src="/diagrams/voltage-divider.svg" alt="Schematic of a voltage divider: 5 volts feeds a photoresistor, the midpoint taps off to pin A0, and a 10 kilo-ohm resistor leads to ground" width="640" height="300" loading="lazy" />
	<figcaption>The voltage divider: light changes the LDR's resistance, which moves the voltage at the midpoint — and that midpoint is exactly what A0 measures.</figcaption>
</figure>

The value 0–1023 exists because the Uno's ADC has 10-bit resolution: it chops the 0–5 V range into 2¹⁰ = 1024 steps. That's the entire mystery of that magic number.

### 2. Digital: the sensor does the measuring for you

More sophisticated sensors contain their own tiny chip that does the measurement internally and hands you finished numbers over a communication protocol — commonly **I2C** or **SPI**. A DHT22 temperature/humidity sensor, a barometric pressure sensor, an accelerometer: all of these are less "a component" and more "a very small appliance."

This is why the Arduino library ecosystem matters so much. Speaking these protocols by hand is fiddly; in practice you install the sensor's library and write:

```cpp
#include "DHT.h"
DHT dht(2, DHT22);

void setup() {
	Serial.begin(9600);
	dht.begin();
}

void loop() {
	float celsius = dht.readTemperature();
	float humidity = dht.readHumidity();
	Serial.print(celsius);
	Serial.print(" °C, ");
	Serial.print(humidity);
	Serial.println(" %");
	delay(2000);
}
```

### 3. Timing: measuring with a stopwatch

Some sensors encode their answer in *time*. The classic is the HC-SR04 ultrasonic rangefinder — the pair of metal "eyes" on every beginner robot. It sends a click of ultrasound and raises a pin for exactly as long as the echo takes to return. Distance is then just the speed of sound:

```cpp
long readDistanceCm() {
	digitalWrite(TRIG, HIGH); // send a 10 µs ping
	delayMicroseconds(10);
	digitalWrite(TRIG, LOW);

	long microseconds = pulseIn(ECHO, HIGH); // round-trip time
	return microseconds / 29 / 2;            // sound ≈ 29 µs per cm, halved
}
```

Divide by two because the sound travels out *and* back. Physics, one line at a time.

## All sensors lie a little

The uncomfortable truth of working with real hardware:

> A sensor never tells you the temperature. It tells you a number that is *usually close* to the temperature, jittering with electrical noise, drifting with age, and occasionally just wrong.

Three habits handle ninety percent of it:

- **Average your readings.** Take 10 samples and use the mean — noise cancels out, signal stays. For a stream of values, a running average smooths without much lag.
- **Debounce anything mechanical.** A pressed button physically bounces, closing and opening dozens of times in a few milliseconds. Ignore changes that happen within ~50 ms of the last one, or your "one press" becomes seven.
- **Calibrate against reality.** Compare your sensor to a known-good reference once, store the offset, apply it in code. Cheap sensor + calibration often beats expensive sensor + blind trust.

## A starter shelf

| Sensor | Measures | Interface |
| ------ | -------- | --------- |
| Photoresistor (LDR) | Light level | Analog |
| DHT22 | Temperature & humidity | Digital (one-wire) |
| HC-SR04 | Distance (2–400 cm) | Timing |
| PIR module | Human motion | Digital (HIGH/LOW) |
| MPU-6050 | Acceleration & rotation | Digital (I2C) |

Any one of these plus [an Arduino](/blog/what-an-arduino-actually-is/) is an afternoon project with a satisfying payoff.

---

Sensing is only half the conversation, though. Once your project knows the room is dark or the plant is dry, it needs to *do* something about it — and that's the job of [actuators](/blog/actuators-how-code-moves-the-world/).
