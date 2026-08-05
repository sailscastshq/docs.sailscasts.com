---
title: Scan Checks
description: The complete set of durability checks included in Durable UI Scan 0.0.1 and how to verify each finding.
---

# Scan Checks

Version `0.0.1` runs eight source rules. Dialog inspection can produce two separate findings, so a report may contain nine finding types. Checks are intentionally conservative and should lead to a browser reproduction before a code change.

## Progress Without A Draft

`progress-without-draft` looks for a form with at least three visible or registered fields, or a multi-step signal such as `currentStep`, without a visible draft strategy.

- `HIGH` for a likely multi-step workflow
- `MEDIUM` for another substantial form
- Verify by entering data, advancing if applicable, then refreshing and using Back and Forward.

Visible uses of Durable UI draft primitives, browser storage, or common save, persist, restore, and autosave names suppress this check. A custom server autosave may not be recognizable.

## View State Outside The URL

`view-state-outside-url` looks for React, Vue, or Svelte state with common names such as `activeTab`, `filter`, `sort`, `page`, `query`, or `searchTerm` when no URL-state signal is visible.

- `MEDIUM` for tabs, filters, sorting, and pagination
- `REVIEW` for generic `query` or `searchTerm` state, which may be a transient lookup or command-palette interaction
- Verify by changing the view, copying the URL into a new tab, and using Back and Forward.

This is intended for navigational state. Private edits and brief interaction state usually should not go in the URL.

## Navigation Rendered As A Button

`navigation-rendered-as-button` looks for a `<button>` click handler that changes destinations through a router, `navigate`, SvelteKit `goto`, or `location`.

- `HIGH`
- Verify open-in-new-tab, copy-link, keyboard activation, and Back behavior.

Destination changes should normally be anchors or framework Link components. Buttons remain correct for actions on the current page.

## Auth Redirect Loses Intent

`auth-redirect-loses-intent` looks for navigation to a sign-in or login route without a visible return destination in the same redirect expression.

- `HIGH`
- Verify by starting at a protected deep link, signing in, and checking that the exact destination is restored.

Return destinations must also be validated by the application to avoid open redirects.

## Incomplete Dialog Contract

`incomplete-dialog-contract` looks for a custom dialog without visible Escape dismissal or focus-entry and focus-return behavior. Native `<dialog>` elements and recognized dialog libraries are treated differently from hand-built dialog markup.

- `HIGH`
- Verify opening, dismissing, and restoring focus using only the keyboard.

## Dialog State Outside The URL

`dialog-state-outside-url` looks for common in-memory open-state names inside a dialog implementation when no URL state is visible.

- `REVIEW`
- Verify refresh, Back, and Forward while the dialog is open on a specific record.

A brief confirmation should usually disappear. A substantial create, edit, or inspect workflow may need its open state and record identity in the URL.

## Unguarded Browser Storage

`unguarded-browser-storage` looks for direct `localStorage` or `sessionStorage` operations without a visible `try` and `catch` boundary.

- `HIGH`
- Verify with storage blocked and with malformed or stale stored data.

Storage access, quota, and JSON parsing can fail. The screen should remain usable and have a recovery path.

## Lifecycle Cleanup

`event-listener-without-cleanup` looks for `addEventListener` without a visible `removeEventListener`. `interval-without-cleanup` looks for `setInterval` without a visible `clearInterval`.

- `MEDIUM`
- Verify by navigating away and back repeatedly, then confirming the handler or timer acts only once and stops after unmount.

Recognized application bootstrap and service-worker modules live for the browser process rather than a component mount, so Scan excludes them from this cleanup rule.

## Debounced Request Without Cancellation

`debounced-request-without-cancellation` looks for a debounced or delayed request without a visible `AbortController`, signal, or cancellation token.

- `MEDIUM`
- Verify by delaying an older response, issuing a newer query, and navigating away while a request is active.

The latest request should win, and a superseded response should not update a stale screen.

## Positive Signals

The report can also recognize and count files with:

- restorable form progress through `useFormDraft` or `useWizardDraft`
- URL-backed view state
- guarded browser storage
- native or Escape-aware dialogs
- cancelable browser requests

Positive signals are evidence of useful patterns, not a guarantee that every browser path is durable.
