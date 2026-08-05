---
title: Scan
description: Run Durable UI Scan against a modern web application and turn static findings into reproducible browser tests.
---

# Durable UI Scan

Durable UI Scan is a zero-configuration CLI for finding browser and state contracts that may break under refresh, Back and Forward navigation, sign-in interruptions, remounts, slow requests, or unavailable browser storage.

Run it from the root of an existing application:

```sh
npx durable-ui scan .
```

It reads source files and prints possible risks with a file location, the user impact, a browser test, and a recommended implementation direction. It never edits the scanned project.

::: tip Requirements
Version `0.0.1` requires Node.js 20 or newer. `npx` downloads the published `durable-ui` package for the command; no permanent dependency is required.
:::

## Where It Works Best

Scan is designed for client-facing JavaScript and TypeScript codebases, especially:

- React, Vue, and Svelte applications
- Inertia applications backed by Sails or another server framework
- Next.js and Nuxt applications
- applications with substantial forms, multi-step workflows, filters, dialogs, client storage, or live search

It scans `.astro`, `.cjs`, `.ejs`, `.html`, `.js`, `.jsx`, `.mjs`, `.svelte`, `.ts`, `.tsx`, and `.vue` source files. React, Vue, Svelte, Inertia, Next.js, Nuxt, and Sails are named in the report when detected from `package.json` or source extensions. Other applications using the supported file types can still be scanned.

## Choose The Target

The target may be a project, a source directory, or one file:

```sh
# Current project
npx durable-ui scan .

# Client source only
npx durable-ui scan ./resources/js

# One component
npx durable-ui scan ./src/pages/Checkout.vue
```

The `scan` word is optional, so `npx durable-ui ./resources/js` is equivalent. Keeping it makes the command easier to read and leaves room for future Durable UI commands.

## Read A Finding

Every finding answers four questions:

1. Where did Scan see the signal?
2. What can the user lose or misunderstand?
3. How can you reproduce the contract in a browser?
4. What implementation direction should you consider?

`HIGH` and `MEDIUM` indicate stronger static signals. `REVIEW` means the correct behavior depends on the product contract—for example, whether a substantial dialog should survive refresh. These labels prioritize review; they are not quality scores or proof of a bug.

Scan also prints durable signals already present, such as URL-backed state, restorable drafts, guarded storage, keyboard-aware dialogs, and cancelable requests.

## Next Steps

- Learn exactly what is detected in [Checks](/durable-ui/scan/checks).
- See every option in the [CLI reference](/durable-ui/scan/cli-reference).
- Integrate the stable report shape from [Output and JSON](/durable-ui/scan/output).
- Understand the exit codes and static-analysis boundaries in [CI and Limitations](/durable-ui/scan/ci).

For the state-placement framework behind the checks, watch the [Durable UI course](https://sailscasts.com/courses/durable-ui).
