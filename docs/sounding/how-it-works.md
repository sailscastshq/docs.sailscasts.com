---
title: How Sounding Works
editLink: true
---

# How Sounding works

Before we talk about the runtime, it helps to define Sounding's core word:

A **trial** is one named behavior check proving something true about your app in a real Sails runtime.

Sounding keeps the familiar `test()` API, but it uses **trial** as the conceptual word because the framework is built around product behaviors, worlds, actors, and the conditions a system must safely pass before you ship.

If you want the full concept model, read [Trials](/sounding/trials).

Sounding is built around a simple idea:

**Boot a real Sails app, create a deterministic world for the current trial, then give the test the right tools for the layer it is exercising.**

## The runtime in five steps

### 1. Sounding boots your app

When a trial starts, Sounding boots your Sails app in test mode and exposes its public testing runtime on `sails.sounding`.

That runtime is where the rest of the system hangs together:

- app lifecycle
- world loading
- auth helpers
- mailbox capture
- request and browser orchestration

### 2. Sounding resolves a datastore strategy

Sounding should respect normal Sails test configuration before it does anything clever.

By default, Sounding manages a temporary `sails-sqlite` datastore for the run or the worker and stores those files under `.tmp/db`.

That gives us a clean, Sails-native story:

- managed by default for zero-ceremony installation
- inherit when the app already has a solid test setup it needs to preserve
- external when a team wants to bring its own dedicated test datastore
- keep tests written against helpers, Waterline, requests, and browser flows either way

### 3. Sounding loads a world

This is where Sounding should feel different from a generic test runner.

It does not just create rows. It loads a named business situation from `tests/factories` and `tests/scenarios`.

That means:

- factories define the primitive record shapes
- traits express meaningful variants like `publisher` or `subscriber`
- scenarios compose those pieces into a situation like `issue-access` or `publisher-editor`
- the resolved world is what the trial actually uses

A world includes:

- actors such as guests, publishers, subscribers, or admins
- records like issues, subscriptions, teams, or unlocks
- the relationships between them
- the current business situation the trial cares about

A good world gives the trial readable handles like `current.users.subscriber` and `current.issues.gatedIssue`, not vague keys like `user1` or `record2`. It should feel like a product situation, not a fixture dump.

### 4. Sounding furnishes the right test surface

Every trial starts from the same calm context.

One important part of that surface is transport.

Sounding should keep one request story in user land while choosing the right transport underneath:

- virtual requests through `sails.request()` when we want fast, app-aware trials
- real HTTP requests when parity with the live HTTP stack matters more

That gives us one stable API without pretending every kind of request behaves the same way.

The transport choice should resolve calmly in this order:

1. a per-call override like `get('/health', { transport: 'http' })`
2. a per-trial override like `test('...', { transport: 'http' }, ...)`
3. the default from `config/sounding.js`

And when a trial wants to stay explicit without changing every alias, it should be able to scope a client with `sails.sounding.request.using('http')`.

From there, the furnished context stays simple:

- `sails` is the real app runtime
- `sails.helpers`, `sails.models`, and `sails.config` stay canonical
- `sails.sounding` exposes worlds, mailbox capture, and request orchestration
- top-level aliases like `get()`, `post()`, and `visit()` exist for the most common flows
- `visit()` understands Inertia-specific request headers like partial reloads without introducing a second testing API
- browser-capable trials can additionally destructure `page` when the browser really matters

### 5. Sounding reports what mattered

When a trial fails, the output should help you understand the failure quickly:

- which world was loaded
- which actor was in play
- which request or browser step failed
- which part of app state was relevant

## Why the hook matters

Because Sounding is a Sails hook, it can speak the native language of a Sails app without asking you to bolt on a second mental model.

It can understand and expose:

- helpers
- actions
- policies
- routes
- Waterline models
- sessions and auth
- Inertia responses
- mail
- jobs and realtime over time

That is the difference between tests that merely run and a testing story that actually feels at home in Sails.

## What a trial context means

A **trial** is the behavior being proved.
A **trial context** is the single object Sounding passes into `test()` so a behavior can be proved inside a real app runtime.

It is the environment the current trial lives inside.

That context should feel calm and familiar:

- `sails` is the real app runtime
- `sails.helpers`, `sails.models`, `sails.config`, and `sails.hooks` stay canonical
- `sails.sounding` exposes Sounding-specific capabilities like the world engine, mailbox, and request orchestration
- top-level aliases like `get()`, `post()`, and `visit()` exist only as ergonomic shortcuts
- `expect` is always available for assertions

So when we say “trial context,” we do **not** mean a second fake app abstraction.
We mean: **the real Sails runtime, plus a small set of testing capabilities shaped around it.**

## The design patterns behind Sounding

Sounding should stay grounded in a few simple patterns:

- `sails` is the real runtime object in every trial
- `sails.sounding` is where Sounding-specific capabilities live
- top-level aliases like `get()` and `post()` are conveniences, not a separate system
- worlds describe business situations, not random fixtures
- calm defaults come first; heavier tools should only appear when a trial really needs them

That is how Sounding stays elegant instead of turning into a bag of special cases.
