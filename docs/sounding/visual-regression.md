---
title: Visual Regression Testing
editLink: true
---

# Visual regression testing

Visual regression trials catch rendered page changes that are hard to describe
with normal DOM assertions: spacing, responsive layout, empty-state composition,
marketing pages, receipts, invoices, dashboards, and other screens where the
shape of the page matters.

Use visual snapshots deliberately. They are most valuable for stable screens
whose appearance is part of the contract. For behavior, copy, auth, navigation,
and data contracts, prefer normal request, Inertia, or browser assertions.

## Match a screenshot

Visual regression stays under Sounding's browser `expect(page)` surface:

```js
import { test } from 'sounding'

test(
  'pricing page matches approved desktop screenshot',
  { browser: 'desktop' },
  async ({ visit, expect }) => {
    const page = await visit('/pricing')

    await expect(page).toMatchScreenshot('pricing')
  }
)
```

The matcher captures a full-page screenshot and compares it with the approved
baseline for the active browser project.

## Create or update baselines

Run tests in update mode to create the first baseline or intentionally replace
an old one:

```sh
SOUNDING_UPDATE_SNAPSHOTS=1 npx sounding test
```

The CLI flag is equivalent:

```sh
npx sounding test --update-snapshots
```

Update mode overwrites approved baselines. Use it only after reviewing the
rendered change and deciding that the new screenshot is correct.

## Baseline paths

Sounding stores approved screenshots by browser project:

```txt
tests/screenshots/<browser-project>/<name>.png
```

For this trial:

```js
test(
  'pricing page matches approved mobile screenshot',
  { browser: 'mobile' },
  async ({ visit, expect }) => {
    const page = await visit('/pricing')

    await expect(page).toMatchScreenshot('pricing')
  }
)
```

the baseline is:

```txt
tests/screenshots/mobile/pricing.png
```

Project-scoped paths keep desktop, mobile, WebKit, and other named browser
projects from overwriting each other.

## Missing baselines

When a baseline is missing, Sounding fails with the exact path and the update
commands:

```txt
Missing visual baseline for "pricing".

Run with `SOUNDING_UPDATE_SNAPSHOTS=1 npx sounding test` or `npx sounding test --update-snapshots` to create it.
Baseline: tests/screenshots/desktop/pricing.png
```

That failure is intentional. It prevents accidental visual coverage from
silently approving itself.

## Review mismatches

When the current screenshot does not match the baseline, Sounding writes review
artifacts under:

```txt
.tmp/sounding/artifacts/visual/<browser-project>/<name>/
```

The directory includes:

- `expected.png`
- `actual.png`
- `diff.html`

`diff.html` is a side-by-side review page that lets you inspect the approved and
current screenshots together. The terminal failure also includes the SHA-256 hash
of each image so CI logs make it obvious when the bytes changed.

After reviewing the mismatch:

- fix the UI if the change was accidental
- update the baseline if the change was intentional
- keep the updated `tests/screenshots/...` file in source control

## Screenshot options

`toMatchScreenshot()` captures a full-page screenshot by default. Pass Playwright
screenshot options when a trial needs them:

```js
await expect(page).toMatchScreenshot('pricing-dark', {
  animations: 'disabled',
  caret: 'hide'
})
```

Do not pass `path`; Sounding controls the baseline and artifact paths so the
output remains predictable.

## Keep snapshots stable

Visual assertions are sensitive by design. Keep them focused and stable:

- use named browser projects for viewport-specific coverage
- avoid pages with clocks, random IDs, live counters, or third-party embeds
- seed worlds so data, ordering, and empty states are deterministic
- hide or freeze animation when it creates noise
- use DOM assertions for behavior and visual snapshots for layout contracts

## CI workflow

In CI, run visual trials like normal tests. Upload `.tmp/sounding/artifacts` when
the suite fails so reviewers can inspect `actual.png` and `diff.html`.

Do not run CI with `SOUNDING_UPDATE_SNAPSHOTS=1`; baseline updates should happen
locally or in a deliberate maintenance branch.
