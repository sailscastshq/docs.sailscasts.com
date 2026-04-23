---
title: What is Durable UI?
description: The philosophy behind Durable UI and why it exists.
---

# What is Durable UI?

Durable UI is state placement for interfaces that survive refreshes, navigation, and real users.

It gives client-side state a clear survival contract: where the state lives, when it restores, when it becomes shareable, and when it should be cleaned up.

The question is simple:

> If the user refreshes, navigates away, opens another tab, or shares the link, what should this interface remember?

Most durability bugs come from not answering that question. A form draft lives only in component state when it should survive a refresh. A multi-step import flow stores the visible step, but loses the parsed rows. A filtered table cannot be shared because its filters never made it into the URL.

Durable UI exists to make those state-placement decisions boring to use.

## Durable UI Categories

Durable UI is organized by the kind of state being protected. The category tells you where that state should live, how long it should survive, and what should happen when the user returns.

**Progress** is private work the user has already done but has not submitted yet. It should survive refreshes and browser restarts, but it should not become a shared URL or an authoritative database record.

**URL** durability is state that should be shareable, bookmarkable, and reproducible from a link. It belongs in the address bar because another person, tab, or future visit should be able to land on the same view.

## What It Is Not

- Durable UI is not a state management framework.
- Durable UI is not a replacement for your server.
- Durable UI is not permission to store everything forever.

It is a small utility layer for UI state that has a real reason to survive and a clear place to live.

## Learn The Full Model

The [Durable UI course](https://sailscasts.com/courses/durable-ui) walks through the philosophy, tradeoffs, and real app patterns behind these primitives.
