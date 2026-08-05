---
title: CLI
titleTemplate: Klean UI
description: The zero-configuration Klean UI source installer command and its framework, path, dependency, and conflict rules.
outline: [2, 3]
---

# CLI

The Klean CLI is a source installer for conventional Boring Stack applications:

```bash
npx klean-ui add button
```

It has one job: place the right framework-native source in the right application path safely.

## How `npx klean-ui add` works

The published `klean-ui` npm package exposes a `klean-ui` executable. `npx` resolves and runs that executable for the command; it does not add Klean as an application runtime dependency.

The CLI performs a deterministic pipeline:

1. **Locate the application root.** Walk upward to the Sails `package.json`.
2. **Detect the framework.** Inspect dependencies and the conventional frontend entry for reliable Vue, React, or Svelte evidence.
3. **Resolve conventions.** Use `assets/js/components/ui` and, when needed, `assets/css/app.css`.
4. **Resolve the registry item.** Read Button's manifest from the registry bundled with that CLI version.
5. **Build a mutation plan.** Select only the detected framework's file and any direct dependencies it imports.
6. **Check safety.** Compare an existing destination before any write.
7. **Apply atomically where practical.** Create missing directories, copy source, add missing dependencies, and avoid partial state.
8. **Report the result.** Print the detected framework, resolved paths, added files, dependencies, skips, or conflicts.

Bundling versioned registry metadata with the CLI keeps one invocation deterministic: the executable and the source it installs come from the same package version.

## Detection

Klean does not ask questions that the project can answer.

| Evidence                                        | Resolution                     |
| ----------------------------------------------- | ------------------------------ |
| Sails package and conventional app shape        | Application root               |
| Framework dependency plus matching entry source | Vue, React, or Svelte          |
| Boring Stack directory conventions              | Component and stylesheet paths |
| Registry item metadata                          | Files and direct dependencies  |

When evidence conflicts or is incomplete, the command exits with the evidence it found and the relevant explicit override. It does not guess silently.

## Command surface

```bash
# Add a component
npx klean-ui add button

# Inspect the full plan without writing
npx klean-ui add button --dry-run

# Use a nonstandard component destination
npx klean-ui add button --components-dir resources/js/ui

# Override a stylesheet path for an item that needs CSS
npx klean-ui add button --css resources/css/app.css
```

Exceptional paths are flags, not permanent consumer configuration.

## Example output

```text
Klean UI detected a Boring Stack application.

  Framework    React
  Components   assets/js/components/ui
  Styles       assets/css/app.css

✓ Added button/Button.jsx
✓ Added tailwind-merge
```

Vue installs `Button.vue`; React installs `Button.jsx`; Svelte installs `Button.svelte`. Only one framework implementation lands in the application.

## Conflict and re-run rules

- Re-running against unchanged installed source is a no-op.
- A locally edited destination is never silently overwritten.
- Conflicts show a useful diff or require an explicit overwrite decision.
- `--dry-run` prints files, dependencies, and mutations without writing.
- A partial failure returns a non-zero exit code and rolls back where practical.
- Missing destination directories are created safely.

Source ownership begins at installation, so an update command cannot assume the local file still matches upstream.

## What the CLI does not create

The installer does not create:

- `klean-ui.json` or another project manifest;
- an `init` result;
- a generated `cn.js` or shared class helper;
- a theme provider, preset, or token file;
- a Klean component runtime;
- a framework selection prompt;
- telemetry or an account requirement.

Registry manifests are maintainer metadata inside the published package. They describe files and dependencies without becoming configuration that every consuming application must keep.
