---
title: Durable UI
titleTemplate: Klean UI
description: How Klean UI implements resilient state, focus, navigation, and async interaction patterns.
outline: [2, 3]
---

# Durable UI

Klean UI is the canonical source-owned implementation of Durable UI for The Boring JavaScript Stack. Components should not merely look correct in a screenshot; useful state, navigation context, focus, and in-progress work should survive the real conditions of an application.

Vue, React, and Svelte preserve the same outcomes with framework-native source.

## Two kinds of resilience

**State resilience** puts state in the right durable home so preferences survive, useful views are shareable, and work can recover.

**Interaction resilience** makes overlays dismiss predictably, restores focus, cancels stale work, rolls failed optimistic changes back, and keeps feedback perceivable through navigation.

## Where state belongs

| State                              | Conventional home         | Examples                                          |
| ---------------------------------- | ------------------------- | ------------------------------------------------- |
| Ephemeral interaction              | Local component state     | open disclosure, active drag, transient hover     |
| Browser-only preference            | Versioned browser storage | density, dismissed coach mark, sidebar preference |
| Shareable navigation context       | URL query or path         | filters, search, sort, selected tab, pagination   |
| Recoverable local work             | Expiring draft storage    | long form, multi-step progress                    |
| Authoritative or cross-device data | Server                    | account settings, permissions, billing state      |

Sensitive or server-owned data does not belong in browser storage. A durable value also needs a lifecycle: namespace, schema version, expiry where appropriate, migration or invalidation, and a clear success path.

## The Klean durability surface

Klean components, state utilities, and blocks cover:

- SSR-safe, namespaced, versioned storage with cross-tab synchronization;
- typed URL state with clean defaults and deliberate push/replace history;
- expiring form drafts with restore, discard, dirty-state honesty, and clear-on-success behavior;
- multi-step recovery with schema evolution and intentional navigation;
- Escape, outside-click, and backdrop dismissal with listener cleanup and scroll locking;
- focus entry, containment, return, and recovery after destructive list changes;
- optimistic toggles and list changes only when rollback is safe;
- window and container scroll restoration plus asynchronous hash navigation;
- accessible toast queues with deduplication, hover pause, manual dismissal, and Inertia flash integration;
- debounced client or server search with URL synchronization and stale-request cancellation.

## Durable does not mean global

Zero configuration does not mean every pattern runs globally without being invoked. A toast queue still needs a host in the application layout. A controlled Dialog still needs open state. A draft needs an intentional key and lifecycle.

Those are semantic integration points. Klean supplies one opinionated source implementation and safe conventions without requiring a provider hierarchy, registry manifest, state library, or parallel configuration language.

## Accessibility and recovery

Durability is observable:

- Back and Forward restore the view a URL represents.
- Reloading does not destroy explicitly recoverable work.
- Closing a layered surface returns focus to a sensible place.
- Removing a focused row moves focus to a nearby stable target.
- A rejected optimistic update restores both data and announcement state.
- A stale search response cannot replace a newer result.
- Navigation does not make a success or error message disappear before it can be perceived.

Each Klean component page documents the durability behaviors that apply. Button has a small contract; Dialog, Toast, Combobox, forms, and state utilities will carry more.
