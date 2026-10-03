---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: CLI Authentication
titleTemplate: Slipway
description: Authenticate the Slipway CLI with your Slipway server.
prev:
  text: CLI Installation
  link: /slipway/cli-installation
next:
  text: CLI Workflow
  link: /slipway/cli
editLink: true
---

# CLI Authentication

Authenticate on your own machine with your Slipway instance:

```bash
slipway login --server https://slipway.example.com
slipway whoami
```

Press Enter when prompted to open the authorization page. Sign in, compare the confirmation code, and authorize that request. If the browser does not open, visit the URL printed by the CLI yourself. Requests expire after five minutes; start login again if the request expires.

## Server selection

Login chooses the server in this order:

1. `login --server <url>`.
2. `SLIPWAY_SERVER`.
3. The previously saved server.
4. An interactive prompt.

`--server` is a **login option**, not a global override for deployments. Other commands use saved credentials. To switch servers, run login for the new server and check `whoami` before changing anything. Named profiles are not available.

`whoami` displays saved account, team, and server information. It helps check local configuration; a successful API request is still needed to confirm that the credential remains valid. The unreleased next CLI provides `slipway doctor --json` to check server health and validate the saved CLI token; cached `whoami` output is not that validation.

## Credential storage

The CLI stores credentials in `~/.slipway/config.json`. Keep this file outside Git, shared folders, build artifacts, and screenshots. On POSIX systems current source protects the directory with mode `0700` and the file with `0600`; Windows uses the profile's access controls.

Do not paste credentials, device secrets, or token files into chat or support reports. Share the command, target names, error code, and redacted diagnostics instead. Never publish raw command output without checking it for secrets and private records.

## Log out and revoke access

```bash
slipway logout
```

Logout clears the saved local credential. To invalidate a server credential, revoke it in **Settings → API Keys**. If a login response is lost after approval, start a fresh login and revoke any unused key.

## Automation

Browser login is interactive. These CLI builds read saved credentials; `SLIPWAY_TOKEN` is not an implemented alternative for CLI authentication. Do not put a token in a shell command and assume it will be used.

For automatic deployment, use [Git Integration](/slipway/git-integration). See [Deploy Tokens](/slipway/deploy-tokens) for the current token-management and authentication boundary; do not assume a token authenticates the CLI or deployment API.

## Compatibility errors

Current source uses device authorization protocol 2. Upgrade the server and CLI together when login reports an incompatible authorization protocol. An old client cannot complete the secure flow by reusing the visible confirmation code.

Continue with the [CLI workflow](/slipway/cli).
