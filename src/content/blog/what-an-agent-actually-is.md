---
title: 'What an AI Agent Actually Is (and When You Should Not Build One)'
description: 'A language model can only produce text. Give that text somewhere to land and a loop to run in, and it becomes action — that is the whole idea, and everything else is plumbing.'
pubDate: 2026-08-03
tags: [ai, software]
---

"Agent" is the most overloaded word in software right now. It gets used for a chatbot with a search box, for a scripted pipeline that calls a model three times, and for something that refactors a codebase overnight while you sleep. Those are three genuinely different machines, and the difference between them is not how smart the model is. It's who decides what happens next.

Here's the whole idea in one sentence: **a language model can only produce text — but if you let some of that text be a request to do something, and you feed the result back in, the model can act.** Not metaphorically. That's the entire mechanism.

Everything after this is plumbing.

## The model can't do anything

Start with the uncomfortable part, because it's the thing most explanations skip.

A language model takes text and produces text. That's the complete list of its abilities. It cannot read your files, call an API, or run a command. It has no hands. When an "agent" reads a file, what actually happened is this: the model emitted a structured chunk of text that means *"please run `read` on `src/config.ts`"* — and then **your** code, sitting outside the model, read the file and handed the contents back as more text.

The model asks. Something else obeys. That something else is usually called the **harness**, and it's the part that actually touches the world.

This matters more than it sounds. Every safety property, every permission prompt, every "are you sure?" lives in the harness, not the model — because the harness is the only thing with hands. It's the same division you'd recognize from [any microcontroller project](/blog/actuators-how-code-moves-the-world/): the code decides, but nothing moves until something with a motor in it agrees.

## The loop

Give the model tools, and one round trip looks like: goal in → model picks a step → harness runs it → result back to the model.

Now do that again. And again. Stop when the model says it's finished.

<figure>
	<img src="/diagrams/agent-loop.svg" alt="A cycle: a goal enters the model, which emits a tool call; the harness executes it against tools like files, shell, and web; the result returns to the model, and the cycle repeats until the model finishes and emits an answer" width="640" height="300" loading="lazy" />
	<figcaption>The loop is the agent. Strip out the loop and you have a chatbot that occasionally looks things up.</figcaption>
</figure>

That's it. That's an agent. A model, a set of tools, and a `while` loop that keeps going until the work is done.

And if that shape looks familiar, it should — it's a [feedback loop](/blog/the-loops-that-drive-your-car/), the same one your car and your thermostat are running. Sense the current state, decide on a correction, act, observe what actually happened, repeat. A [PID controller](/blog/pid-controllers/) does this a thousand times a second with three multiplications. An agent does it a few times a minute with a few billion. The structure is identical; only the cost per iteration changed by twelve orders of magnitude.

The important consequence is the same in both cases: **the loop is what makes it robust.** A single model call is open-loop — it guesses and you live with the guess. An agent gets to find out it was wrong. It runs the test, sees the failure, and tries something else. Not because it's clever, but because the error signal came back around.

## Three tiers, not one

Once you see the loop, the vocabulary sorts itself out. The real question is *who decides the sequence of steps.*

| Tier | Who picks the steps | Good for |
| ---- | ------------------- | -------- |
| **One call** | Nobody — there's one step | Summarize, classify, extract, translate |
| **Workflow** | **You**, in advance, in code | Pipelines where you already know the recipe |
| **Agent** | **The model**, at runtime | Tasks you can't fully specify up front |

A workflow is a model in a script you wrote: fetch the doc, summarize it, extract the fields, write the row. You control the order. It's predictable, cheap, and debuggable, and it is the right answer far more often than the discourse suggests.

An agent is what you reach for when *you can't write the recipe in advance* — because the right third step depends on what the second step turned up. "Extract the invoice total" is a single call. "Find out why the nightly build started failing on Tuesday" is an agent, because nobody knows which log to read until they've read the last one.

## What the tools actually are

The tool list is where an agent's real capabilities live, and it's shorter and more boring than you'd think:

- **A shell.** One `bash` tool is a skeleton key — it covers most of what a computer can do.
- **File operations** — read, write, edit, search. The difference between an agent that can *discuss* your codebase and one that can *change* it.
- **Web search and fetch**, for anything past the model's training cutoff.
- **Code execution** in a sandbox — the escape hatch for arithmetic, data munging, and anything the model shouldn't be doing in its head.
- **Your own APIs.** A `refund_order` function is a tool. So is `send_email`.
- **A screen.** Computer use — screenshots in, mouse and keyboard out — for systems with no API at all.

Two design notes that took the industry a while to learn. First, prefer a **narrow, specific tool** over a general one for anything dangerous: `send_email` can be gated behind a confirmation prompt, while `bash -c "curl -X POST ..."` cannot, because the harness can't tell what a shell string is about to do. Second, a tool's *description* is real code — it's the only thing the model reads when deciding whether to call it. Half of "prompt engineering" for agents is just writing honest documentation.

## What they're actually good at

Concretely, and limited to things that work today:

**Coding.** The flagship case, and the one where the loop pays off most visibly — because code comes with a built-in oracle. The agent writes, runs the tests, reads the failure, and fixes it. It's checking its own work against reality, which is exactly what the [feedback loop](/blog/the-loops-that-drive-your-car/) is for. Tools like Claude Code work this way.

**Research and synthesis.** Search, read, follow the interesting thread, come back with a cited answer. Multi-hop questions where you don't know the second query until you've read the first result.

**Operations and triage.** Read the alert, pull the logs, correlate with the last deploy, write up what probably broke. The unglamorous work that is mostly navigation.

**Document and data work.** Take a directory of messy spreadsheets, reconcile them, produce a report. Tedious, well-specified, verifiable.

**Long-horizon delegation.** The genuinely new thing: hand over a task described in a paragraph and get back a finished branch an hour later. This is where the current frontier models — Claude Opus 5 and its peers — improved most, and it's also where the failure modes are least forgiving.

## When you should not build one

This section matters more than the last one.

Agents are slower, more expensive, and less predictable than the alternatives. Before reaching for one, four questions are worth being honest about:

1. **Is the task actually open-ended?** If you can write the steps down, write the steps down. A workflow you can debug beats an agent you have to interrogate.
2. **Is the outcome worth it?** An agent may run for minutes and burn a hundred model calls. Fine for a code migration. Absurd for classifying a support ticket.
3. **Can the model actually do this?** Not "in principle" — on your data, today.
4. **What happens when it's wrong?** This is the one that decides it. Agents *will* take wrong steps; the loop is what recovers from them. That only works if errors are **catchable and reversible** — tests, code review, git, a staging environment. An agent that can send irreversible emails to customers has no error signal and no undo, and the loop cannot save it.

Rule of thumb: **agents work best where verification is cheap.** That's the real reason coding went first. Not because code is easy, but because `npm test` is an oracle you can call a hundred times for free. If your domain has no equivalent — no cheap way to check the work — you don't have a loop. You have an expensive open-ended guess.

## The hard parts nobody puts in the demo

**Context fills up.** Every tool result is more text piled onto the conversation. A long-running agent will exhaust the window, and the fixes are all lossy: summarize the history, prune old tool results, or write notes to a file it can re-read later. That last one is just an agent inventing a filesystem for its own memory, which is either elegant or bleak depending on your mood.

**Errors compound.** In a twenty-step task, a 5% per-step error rate is not a 5% failure rate — it's a **64% chance that something goes wrong somewhere**, and only about a one-in-three chance of a clean run start to finish. Per-step reliability is the whole ballgame, and it's why "it worked in the demo" and "it works in production" are separated by a year of engineering.

**Verification is the bottleneck.** An agent that does an hour of work and produces a plausible-looking summary of that work has moved your problem, not solved it. Now you have to check an hour of work. The teams getting real value are the ones who invested in *automatic* checking — tests, schemas, diffs, linters — not the ones with the cleverest prompt.

---

Strip everything decorative away and an agent is a model, a list of tools, and a loop that closes the gap between them. The model contributes judgment about what to try next; the harness contributes the ability to actually try it; and the loop contributes the only thing that makes any of it reliable — finding out what happened, and getting another turn.

The [thermostat and the drone](/blog/pid-controllers/) figured this out decades ago. It's a strange kind of progress that the most advanced software we've ever built turns out to be shaped like a control loop with a very expensive comparator — but that's the shape, and knowing it tells you exactly when to reach for one and when to just write the script.
