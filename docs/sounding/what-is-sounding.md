---
title: What is Sounding?
editLink: true
---

# What is Sounding?

Sounding is a Sails-native testing framework for Sails applications and The Boring JavaScript Stack.

It covers:

- helper and business-logic tests
- endpoint and JSON API tests
- Inertia response tests
- browser and end-to-end flows
- mail assertions

Sounding provides one runtime for these test types so they can share the same app boot, request helpers, world setup, and assertion surface.

## Where the name comes from

In maritime navigation, **sounding** means measuring the depth of water beneath a ship before it moves forward.

The name matches the rest of the ecosystem and the role of checking an application before release.

## Why Sounding exists

The current Sails testing pieces work well on their own:

- `node:test` is excellent for lightweight tests
- Playwright is excellent for browser flows
- `inertia-sails/test` gives us useful response assertions
- `getSails()` patterns work, but they still ask every app to invent its own ceremony

Sounding adds a Sails-aware runtime that ties these pieces together under one hook and one `test()` API.

## What Sounding means by a trial

Sounding uses the standard `test()` API. The docs use **trial** to mean one named behavior check inside a real Sails app, such as:

- _guest is redirected from dashboard_
- _subscriber can read a members-only issue_
- _requesting a magic link sends a usable email_

If you want the full concept model, read [Trials](/sounding/trials).

## What makes Sounding Sails-native

Sounding is implemented as a Sails hook and exposed on `sails.sounding`.

The canonical surfaces are:

- optional `config/sounding.js` when you need overrides
- `sails.sounding`

By default, the hook only activates in the environments listed under `sounding.environments`, which starts as `['test']`.

## What Sounding covers

Sounding covers the places Sails developers commonly test.

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

## Common problems it helps avoid

Sounding helps avoid:

- adding product-code test routes just to seed data
- booting shadow app instances that fight over the same datastore
- scattering fixtures across app code and test code
- treating browser, API, and Inertia tests as unrelated worlds
