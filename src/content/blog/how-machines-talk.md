---
title: 'Data Communications: How Machines Actually Talk'
description: 'From a voltage on a wire to bits, frames, and protocols — the same handful of ideas runs everything from I2C to the internet.'
pubDate: 2026-07-13
tags: [electronics, signals]
series:
  name: 'Maker Basics'
  part: 2
---

Strip away every acronym, and data communication is one problem: **two devices share a wire, and a wire can only be at one voltage at a time. How do you turn that into conversation?**

Answer that for two chips three centimeters apart and you've answered it for two computers on opposite sides of the planet — the ideas genuinely don't change, only the engineering around them. So let's build it up from the wire.

## A bit is a voltage with a schedule

Digital devices already agree that high voltage means `1` and low voltage means `0`. To send a *sequence* of bits, the sender holds the wire high or low, bit by bit. But here's the first real problem: if I send `1 1 1 1`, the wire just… stays high. How does the receiver know it saw four ones and not three, or five?

**Timing.** Both sides agree in advance on a rate — say 9600 bits per second — and the receiver checks the wire every 1/9600th of a second. That agreed rate is the **baud rate**, and now this familiar line means something concrete:

```cpp
Serial.begin(9600); // "I will change the wire at most 9600 times per second.
                    //  Check it on that schedule."
```

Every physical channel is a variation on this move. Wi-Fi wiggles a radio wave instead of a wire, fiber optics blinks light down glass — but underneath it's always *a physical quantity changing on a schedule that both sides agreed to*.

## Framing: where does a message start?

A receiver that tunes in mid-stream sees `...0110100010110...` — a firehose with no punctuation. So protocols add **framing**: a fixed structure around each chunk of data.

Classic serial (UART — the protocol behind the Arduino's `Serial`) frames every byte like this: the idle wire rests high; a **start bit** (a drop to low) shouts "byte incoming!"; then come the 8 data bits on schedule; then a **stop bit** returns the line to rest. Ten bit-slots to deliver eight bits of payload — the two-bit overhead is the cost of punctuation.

<figure>
	<img src="/diagrams/uart-frame.svg" alt="Timing diagram of one UART frame: the line idles high, drops for a start bit, carries eight data bits spelling 0x4B least-significant-bit first, then returns high for the stop bit" width="640" height="260" loading="lazy" />
	<figcaption>One UART frame carrying the byte 0x4B. The receiver hears the start bit drop, then samples the line on the agreed schedule.</figcaption>
</figure>

That overhead ratio is a theme you'll now notice everywhere: every protocol taxes the payload with structure — headers, addresses, checksums. It's not waste; it's what makes the payload *findable*.

## The three wiring philosophies

Between chips, three protocols cover nearly everything, and they differ by how they solve the timing problem:

| Protocol | Wires | Timing solved by | Personality |
| -------- | ----- | ---------------- | ----------- |
| UART ("serial") | 2 (one per direction) | Agreed baud rate | Two friends who synchronized watches |
| SPI | 4 | Sender ships a clock wire | Fast, bossy, point-to-point |
| I2C | 2 (shared by all) | Shared clock wire | A polite meeting with name tags |

- **UART** is asynchronous — no shared clock, just the appointment book. Simple, but both sides must keep good time.
- **SPI** adds a dedicated clock wire: "read the data wire *now*… now… now." No timing guesswork, so it can run very fast — the choice for displays and SD cards.
- **I2C** puts many devices on the same two wires and gives each an **address**. Every message opens with the address of the intended listener; everyone else ignores it. This is why you can hang a dozen [sensors](/blog/sensors-how-projects-perceive/) off two pins, and why every I2C tutorial begins with "find your device's address."

## Trusting a noisy wire

Real wires pick up interference — a motor kicks on nearby and a `0` arrives bruised into a `1`. Real protocols therefore assume corruption and check for it.

The simplest check is a **checksum**: the sender sums its bytes and appends the result; the receiver re-sums and compares.

```cpp
uint8_t checksum(const uint8_t* data, size_t len) {
	uint8_t sum = 0;
	for (size_t i = 0; i < len; i++) sum += data[i];
	return sum; // receiver recomputes this and compares
}
```

A mismatch doesn't say *where* the damage is — just "discard this frame." Which raises the next question: discard, then what? The sender needs to know. So reliable protocols add **acknowledgment**: the receiver confirms each frame, and the sender re-sends anything unconfirmed. Corruption detection plus retry equals reliability — that loop, plus decades of refinement, is essentially what TCP is.

## The ladder of abstraction

Notice what we just built, layer by layer:

1. **Physical** — a voltage changing on a schedule
2. **Bits** — the schedule turns wiggles into `1`s and `0`s
3. **Frames** — start/stop structure turns bits into bytes and messages
4. **Addressing** — name tags say *who* a message is for
5. **Reliability** — checksums and acknowledgments survive a noisy world

Networking professionals formalize this as the OSI model and argue about layer numbers, but the intuition is the important part: **each layer consumes the service below and offers a better promise above.** The wire offers "voltages, probably." The top of the stack offers "your message will arrive, in order, or you'll know."

> USB, Wi-Fi, Bluetooth, Ethernet, CAN bus in your car — every one of them is this same ladder with different rungs emphasized. Learn the ladder once and new protocols become variations, not new subjects.

---

There's something satisfying about the fact that the [$25 board](/blog/what-an-arduino-actually-is/) on your desk and the backbone of the internet are answering the same question with the same ideas — just at different scales of paranoia. Next time a datasheet says "I2C, address 0x68," you'll know exactly which rungs of the ladder it's handing you, and which ones are your job.
