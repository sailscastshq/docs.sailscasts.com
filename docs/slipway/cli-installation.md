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

Install the CLI on the machine where you keep your application source. The npm package is `slipway-cli`; the executable is `slipway`.

```bash
npm install -g slipway-cli
slipway --version
slipway --help
```

## Requirements

Use Node.js 22 or newer. Source packaging uses Git when the directory is a repository, or `tar` otherwise. You do not need a local Docker daemon to upload source; the Slipway server builds and runs the image.

For a one-off invocation:

```bash
npx slipway-cli --help
```

## Choose a compatible version

The CLI, Slipway server, and application hooks have separate versions. A CLI version number is not the server release number. Check [release compatibility](/slipway/updates#release-compatibility) before using commands from an unreleased build.

The live application logs and remote command examples in this guide require the **unreleased next CLI and server**. Installing the current npm package does not establish that those capabilities are available.

## Update

```bash
npm install -g slipway-cli@latest
```

Verify the installed version and help again, then [authenticate](/slipway/cli-authentication) and follow the [CLI workflow](/slipway/cli).
