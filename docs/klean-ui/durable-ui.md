---
title: Durable UI
titleTemplate: Klean UI
description: How Klean UI implements resilient state, focus, navigation, and async interaction patterns.
outline: [2, 3]
---

<script setup>
import KleanFrameworkCode from '../.vitepress/theme/components/KleanFrameworkCode.vue'
import formDraftVue from './snippets/durable-ui/form-draft.vue?raw'
import formDraftReact from './snippets/durable-ui/form-draft.jsx?raw'
import formDraftSvelte from './snippets/durable-ui/form-draft.svelte?raw'

const formDraftExamples = [
  { id: 'vue', label: 'Vue', code: formDraftVue, filename: 'NewInvoice.vue' },
  { id: 'react', label: 'React', code: formDraftReact, filename: 'NewInvoice.jsx' },
  { id: 'svelte', label: 'Svelte', code: formDraftSvelte, filename: 'NewInvoice.svelte' }
]
</script>

# Durable UI

Klean UI is the canonical source-owned implementation of Durable UI for The Boring JavaScript Stack. Components should not merely look correct in a screenshot; useful state, navigation context, focus, and in-progress work should survive the real conditions of an application.

Vue, React, and Svelte preserve the same outcomes with framework-native source.

## Installation

Add the complete resilience layer from any conventional Boring Stack application:

```bash
npx klean-ui add durable-ui
```

Klean detects Vue, React, or Svelte and writes eight readable files to `assets/js/components/ui/durable-ui`: seven focused framework-native utilities and their small browser core. There is no Durable UI runtime dependency, provider, initializer, manifest, or setup questionnaire.

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

## The APIs

| Need                       | Vue / React            | Svelte                    | Durable default                                       |
| -------------------------- | ---------------------- | ------------------------- | ----------------------------------------------------- |
| Browser preference         | `useStoredState`       | `createStoredState`       | namespaced, versioned, SSR-safe, cross-tab            |
| Shareable navigation state | `useQueryState`        | `createQueryState`        | inferred type, clean default, Back/Forward            |
| Recoverable form           | `useFormDraft`         | `createFormDraft`         | explicit restore/discard, expiry, native unload guard |
| Multi-step work            | `useWizardDraft`       | `createWizardDraft`       | step recovery, merged schema defaults, clear success  |
| Return position            | `useScrollRestoration` | `createScrollRestoration` | session storage, window/container/hash restoration    |
| Reversible async change    | `useOptimistic`        | `createOptimistic`        | inflight guard, server resync, rollback, error        |
| Remote or local search     | `useSearch`            | `createSearch`            | debounce, minimum query, abort, stale-result guard    |

The names follow each framework. The behavior does not drift. Install the bundle once, then import only the focused source a flow needs.

### A recoverable form

The draft key is the only required durability decision. The application still owns its fields, submission, messages, and server state.

<KleanFrameworkCode
  id="durable-form-draft"
  :frameworks="formDraftExamples"
  label="Recoverable form framework"
/>

The saved draft expires after 24 hours by default. It is offered for deliberate restore or discard, ignores empty work, and is cleared after the application confirms success. A dirty form uses the browser's native unsaved-change guard; `clear()` updates the clean baseline after a successful submission.

### URL state and server visits

`useQueryState('page', 1)` and `createQueryState('page', 1)` infer a number from the default, remove `page=1` from the URL, and follow Back and Forward navigation. Use `{ history: 'replace' }` for rapid filters or search and the default push history for meaningful view changes.

For server-owned collections, compose URL state with the framework's Inertia router or use [Data Table](/klean-ui/components/data-table), whose query helper already preserves scroll, restores focus, cleans defaults, and makes partial visits. Klean does not hide a server visit inside every state value.

### Optimistic work and search

`useOptimistic` / `createOptimistic` updates visible state immediately only when a rejected operation can restore the previous value. It blocks accidental duplicate work, accepts the server's confirmed value, exposes the failure, and calls the application's error handler so a Toast or inline Alert can make rollback perceivable.

`useSearch` / `createSearch` debounces by default, passes an `AbortSignal` to the application search function, and prevents an older result from replacing a newer query. Compose its query with URL state when the search should survive reload or be shareable. Keep transient picker searches out of the URL.

### Scroll restoration

Scroll state uses `sessionStorage`, not `localStorage`: returning within one browser tab is useful, while reopening an old tab days later should not jump to stale coordinates. Window and scroll-container targets are supported. Hash destinations take priority and are retried while asynchronously rendered content arrives.

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

## Related components

- [Dialog](/klean-ui/components/dialog), [Sheet](/klean-ui/components/sheet), [Popover](/klean-ui/components/popover), and [Menu](/klean-ui/components/menu) own dismissal, focus, and cleanup.
- [Toast](/klean-ui/components/toast) owns perceivable queued feedback and survives page swaps through its provider-free controller.
- [Data Table](/klean-ui/components/data-table), [Filter Bar](/klean-ui/components/filter-bar), [Pagination](/klean-ui/components/pagination), and [Tabs](/klean-ui/components/tabs) demonstrate durable URL navigation.
- [Combobox](/klean-ui/components/combobox) and [Command](/klean-ui/components/command) demonstrate keyboard-safe search and focus recovery.
