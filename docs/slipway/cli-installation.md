---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: CLI Installation
titleTemplate: Slipway
description: Install the Slipway CLI to deploy and manage your Sails applications from the command line.
prev:
  text: Settings
  link: /slipway/settings
next:
  text: Authentication
  link: /slipway/cli-authentication
editLink: true
---

# CLI Installation

The Slipway CLI lets you deploy and manage your Sails applications from the command line.

## Installation

### Using npm (Global)

```bash
npm install -g slipway
```

After installation, the `slipway` command is available globally:

```bash
slipway --help
```

### Using npx (No Installation)

You can use the CLI without installing it globally:

```bash
npx slipway-cli --help
```

This downloads and runs the CLI once. For regular use, we recommend installing globally.

## Requirements

| Requirement | Version      |
| ----------- | ------------ |
| Node.js     | 22 or higher |
| npm         | 10 or higher |

::: info Zero Dependencies
The Slipway CLI has **zero npm dependencies**. It uses only Node.js built-in modules, which means:

- **Instant startup** — No node_modules to load
- **No supply chain risk** — Nothing to audit
- **Simpler maintenance** — No dependency updates
  :::

## Verify Installation

Check that the CLI is installed correctly:

```bash
slipway --version
```

You should see the version number:

```
slipway v0.0.1
```

## Update the CLI

To update to the latest version:

```bash
npm update -g slipway
```

## Shell Completions

The CLI supports shell completions for faster command entry. Coming soon.

## What's Next?

After installing the CLI, [authenticate with your Slipway server](/slipway/cli-authentication).
