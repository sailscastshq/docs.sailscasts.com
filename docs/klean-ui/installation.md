---
title: Installation
titleTemplate: Klean UI
description: Add framework-native Klean UI source to a Boring Stack application with one convention-first command.
outline: [2, 3]
---

<script setup>
import KleanInstallation from '../.vitepress/theme/components/KleanInstallation.vue'
import buttonSource from '../.vitepress/theme/components/klean/Button.vue?raw'
</script>

# Installation

Klean installs readable component source into your application. There is no setup wizard, `init` command, `klean-ui.json`, provider, or Klean runtime to retain.

<KleanInstallation id="installation-page" :source="buttonSource" />

## What the command does

`npx klean-ui add button` runs the published Klean CLI for this invocation. The CLI:

1. confirms that the current directory is a Sails application;
2. detects Vue, React, or Svelte from `package.json` and the conventional application entry;
3. resolves the conventional component and stylesheet paths;
4. selects the matching framework-native registry source;
5. checks for an existing or locally edited destination;
6. copies the component and adds only the direct dependencies it imports;
7. reports every file and dependency it changed.

The CLI is a delivery tool. The installed component does not import a Klean runtime, and the application owns the copied file.

Registry items may include prerequisites and more than one source file. Button, Input, and Textarea are deliberately self-contained. Popover installs its focused geometry dependencies, and `npx klean-ui add menu`, `npx klean-ui add select`, or `npx klean-ui add combobox` resolves Popover first before writing the requested component. The full plan stays visible with `--dry-run`; prerequisite handling adds no configuration step.

## Conventional paths

For a Boring Stack application, the framework determines the file—not a prompt:

```text
assets/js/components/ui/button/
  Button.vue       Vue
  Button.jsx       React
  Button.svelte    Svelte
```

Only the detected framework's file is added. `assets/js/components/ui` is the component root, and `assets/css/app.css` is the stylesheet convention when a component genuinely needs CSS.

## Zero configuration

The standard path has no questions because the application already contains the answers:

- Sails identifies the application shape;
- installed framework packages and the application entry identify the framework;
- Boring Stack directories identify component and stylesheet destinations;
- the registry item declares its own files and direct dependencies.

Ambiguous evidence is an error with an explanation. Klean does not guess silently or turn uncertainty into an interactive questionnaire.

## Nonstandard applications

Configuration is an escape hatch expressed at the point of use:

```bash
npx klean-ui add button --components-dir resources/js/ui
```

Use explicit flags for exceptional paths. Klean does not create a permanent project manifest just because one directory differs.

## Safe re-runs

Adding the same unchanged source is idempotent. If the destination was edited, Klean stops and shows the conflict instead of overwriting application-owned work. Use `--dry-run` to inspect the framework, paths, files, dependencies, and planned mutations before writing:

```bash
npx klean-ui add button --dry-run
```

Read the [CLI reference](/klean-ui/cli) for the complete command contract.
