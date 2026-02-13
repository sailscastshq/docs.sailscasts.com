---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: The Name
titleTemplate: Slipway
description: Learn why we chose the name Slipway and how it connects to the Sails.js nautical theme.
prev:
  text: Why Slipway
  link: /slipway/why-slipway
next:
  text: Philosophy & Architecture
  link: /slipway/philosophy-and-architecture
editLink: true
---

# The Name

## What is a Slipway?

A **slipway** is a ramp that slopes into water, used for:

- **Building ships** — Where ships are constructed before launch
- **Launching ships** — Ships slide smoothly into the water
- **Maintenance** — Ships are pulled up for repairs and servicing

## The Metaphor

This perfectly captures what a deployment platform does:

| Ship Building                  | Software Deployment                  |
| ------------------------------ | ------------------------------------ |
| Ships are built on the slipway | Your app is prepared for deployment  |
| Ships slide into the water     | Apps slide smoothly into production  |
| Ships return for maintenance   | Apps are monitored, updated, managed |

## The Nautical Theme

The name fits naturally with the Sails.js ecosystem:

| Term        | What It Represents                              |
| ----------- | ----------------------------------------------- |
| **Sails**   | The framework powering your app                 |
| **Slipway** | Where your Sails app launches into production   |
| **Helm**    | The production REPL—where you steer and command |
| **Bridge**  | The admin panel—the command center              |

## The Command

The primary deploy command reflects this metaphor:

```bash
# Slide your app into production
$ slipway slide

  ▶ Building image...
  ▶ Pushing to registry...
  ▶ Starting new container...
  ▶ Updating proxy routes...

  ✓ Deployed myapp (v1.2.3) in 42s
    https://myapp.example.com
```

Your app doesn't just deploy—it **slides** smoothly into production.

## Why This Name?

- **Nautical** — Fits with Sails.js theming
- **Memorable** — Unique, not commonly used in tech
- **Evocative** — Implies smooth, effortless deployment
- **Searchable** — No major conflicts with other projects
- **Action-oriented** — "Slide into production" is satisfying

## The Tagline

> **Where Sails apps slide into production.**

or

> **The Sails-native deployment platform.**
