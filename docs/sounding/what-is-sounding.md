---
title: What is Sounding?
editLink: true
---

# What is Sounding?

Sounding is a Sails-native testing framework for Sails applications and The Boring JavaScript Stack.

It brings the full testing story under one roof:

- helper and business-logic tests
- endpoint and JSON API tests
- Inertia response tests
- browser and end-to-end flows
- mail assertions

Instead of stitching together a runner, a browser harness, ad hoc seeding code, and test-only app hooks, Sounding gives your app one coherent testing runtime.

## Where the name comes from

In maritime navigation, **sounding** means measuring the depth of water beneath a ship before it moves forward.

Historically, sailors used a sounding line with a weighted lead to test the seabed and make sure it was safe to proceed.

That metaphor is unusually good for testing:

- before you ship, you test the waters
- you check what is underneath the surface
- you make sure the ground beneath the code is safe
- a failing trial is a warning that the water is shallower than it looked

That is why the name fits this ecosystem so naturally.

Alongside names like Slipway, Quest, Lookout, Wish, and Clearance, Sounding feels like the thing you do before committing the ship to the voyage.

In software terms, that is exactly what a test suite should be.

## Why Sounding exists

The current Sails testing story has all the right pieces, but they still feel too separate:

- `node:test` is excellent for lightweight tests
- Playwright is excellent for browser flows
- `inertia-sails/test` gives us useful response assertions
- `getSails()` patterns work, but they still ask every app to invent its own ceremony

What is missing is the elegant middle layer: a Sails-aware runtime that makes realistic tests easy to write and easy to trust.

## What Sounding means by a trial

Sounding uses the familiar `test()` API, but it talks about each test as a **trial**.

A trial is one named product truth you are proving inside a real Sails app:

- _guest is redirected from dashboard_
- _subscriber can read a members-only issue_
- _requesting a magic link sends a usable email_

That language matters because it keeps the framework focused on behavior, not plumbing.
If you want the full concept model, read [Trials](/sounding/trials).

## What makes Sounding Sails-native

Sounding is designed as a **Sails hook first** and a **CLI second**.

That means the canonical surfaces are:

- optional `config/sounding.js` when you need overrides
- `sails.sounding`

Not `config/test.js`, and not `sails.test`.

That choice matters because Sounding should feel like every other serious Sails subsystem in your app. You configure it once, lower the app once, and let the hook give you a clean public runtime.

## What Sounding covers

Sounding should feel natural wherever Sails developers actually spend time testing.

### Helpers and business logic

Use `test()` with `sails.helpers` when you want to exercise helpers, policies in isolation, or model-adjacent business rules without bootstrapping a browser flow.

### Endpoints and JSON APIs

Use `test()` with request helpers like `get()`, `post()`, or `sails.sounding.request` for:

- guest vs authenticated access
- redirects
- status codes and JSON bodies
- webhook handlers

### Inertia responses

Use `test()` with `visit()` and Inertia-aware matchers for assertions on:

- component names
- props and nested prop paths
- validation errors
- redirects and partial reload behavior

### Browser journeys

Use `test()` with `page` when a flow is truly about the browser:

- sign in
- onboarding
- editor flows
- gated content
- checkout handoff
- mobile navigation

### Mail

Use `test()` and `sails.sounding.mailbox` to assert on outgoing transactional email like magic links, invites, password resets, and billing notifications.

## What Sounding does not want you to do

Sounding should reduce ceremony, not push you into awkward compromises.

It should help you avoid:

- adding product-code test routes just to seed data
- booting shadow app instances that fight over the same datastore
- scattering fixtures across app code and test code
- treating browser, API, and Inertia tests as unrelated worlds

## Sounding in one sentence

Sounding is the test home for everything Sails already does well.
