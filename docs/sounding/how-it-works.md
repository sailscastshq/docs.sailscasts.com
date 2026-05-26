---
title: How Sounding Works
editLink: true
---

# How Sounding works

A **trial** is one named behavior check in a real Sails runtime.

Sounding keeps the standard `test()` API. The docs use **trial** as the term for one test case.

If you want the full concept model, read [Trials](/sounding/trials).

Sounding works by booting a real Sails app, creating deterministic setup for the current trial, and exposing the helpers that match the layer under test.

## The runtime in five steps

### 1. Sounding boots your app

When a trial starts, Sounding boots your Sails app in test mode and exposes its public testing runtime on `sails.sounding`.

The hook is intentionally conservative about when it activates. By default, Sounding only boots when `sounding.environments` includes the current Sails environment, and the default list is `['test']`.

That runtime is where the rest of the system hangs together:

- app lifecycle
- world loading
- auth helpers
- mailbox capture
- request and browser orchestration

### 2. Sounding resolves a datastore strategy

Sounding supports three datastore modes:

- `managed` provisions a temporary `sails-sqlite` datastore under `.tmp/db`
- `inherit` uses the app's existing test datastore config
- `external` validates and uses a separately managed test datastore

Tests keep the same helper, request, and browser APIs regardless of the selected mode.

### 3. Sounding loads a world

Sounding loads a named world from `tests/factories` and `tests/scenarios`.

If you want those layers in detail, read [Factories](/sounding/factories), [Scenarios](/sounding/scenarios), and [Worlds](/sounding/worlds).

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

Use readable handles like `current.users.subscriber` and `current.issues.gatedIssue`, not vague keys like `user1` or `record2`.

### 4. Sounding furnishes the right test surface

Each trial receives the real Sails runtime plus the helpers that match the layer under test.

One part of that surface is transport:

- virtual requests through `sails.request()` when we want fast, app-aware trials
- real HTTP requests when parity with the live HTTP stack matters more

If you want the full request and visit surface, read [Request clients and transport](/sounding/request-clients).

Transport selection resolves in this order:

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
- browser-capable trials can additionally destructure `page`

### 5. Sounding reports what mattered

When a trial fails, the output should identify:

- which world was loaded
- which actor was in play
- which request or browser step failed
- which part of app state was relevant

## As a hook, Sounding can access

As a Sails hook, Sounding can understand and expose:

- helpers
- actions
- policies
- routes
- Waterline models
- sessions and auth
- Inertia responses
- mail
- jobs and realtime over time

## What a trial context means

A **trial** is the behavior being proved.
A **trial context** is the single object Sounding passes into `test()` so a behavior can be proved inside a real app runtime.

It is the environment the current trial runs inside:

- `sails` is the real app runtime
- `sails.helpers`, `sails.models`, `sails.config`, and `sails.hooks` stay canonical
- `sails.sounding` exposes Sounding-specific capabilities like the world engine, mailbox, and request orchestration
- top-level aliases like `get()`, `post()`, and `visit()` exist only as ergonomic shortcuts
- `expect` is always available for assertions

When the docs say “trial context,” they mean the real Sails runtime plus a small set of testing helpers.

## Core conventions

Sounding is built around a few simple conventions:

- `sails` is the real runtime object in every trial
- `sails.sounding` is where Sounding-specific capabilities live
- top-level aliases like `get()` and `post()` are conveniences, not a separate system
- worlds describe business situations, not random fixtures
- heavier tools should only appear when a trial really needs them
