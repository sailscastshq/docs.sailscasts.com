---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Global Environment Variables
titleTemplate: Slipway
description: Configure encrypted instance-wide runtime values shared by deployed applications.
prev:
  text: Environment Variables
  link: /slipway/environment-variables
next:
  text: Config & Secrets
  link: /slipway/secrets
editLink: true
---

# Global Environment Variables

Global environment variables are the lowest, instance-wide layer of configuration injected into applications deployed by Slipway. They are useful for values deliberately shared across projects, such as storage settings, email provider credentials, or a common public region.

## Add a global value

1. Open **Settings → Global Environment**.
2. Enter the key and value.
3. Click **Add**.

New values default to **Secret** and are omitted when an environment is copied. Open **•••** beside a variable to set:

- **Value type** — Secret or Plain config.
- **Preview environments** — Omit, Inherit, or Generate a new value.
- **Description** — an optional note explaining what consumes the value.

The row also shows who last changed the value and when. Use the bulk editor for `KEY=value` input; metadata remains attached to keys that already exist.

There is no separate `config:set` CLI command. Manage global values in the dashboard so their type and preview policy are explicit.

## Precedence

Global values are resolved first:

```text
global < environment < app < Slipway-managed runtime values
```

An environment value with the same key overrides the global value for every app in that environment. An app value then overrides both for that app. Slipway-managed runtime values take final precedence.

Use global scope only when broad inheritance is intentional. A payment credential needed by one app is safer at app scope; shared R2 settings used by backups and Bridge may belong globally.

## Storage settings

The **Settings → File Uploads** form writes its selected provider settings into this encrypted global configuration layer. It also creates value metadata and audit events automatically.

For Cloudflare R2, the conventional values are:

```text
R2_ACCESS_KEY
R2_SECRET_KEY
R2_BUCKET
R2_ENDPOINT
R2_PUBLIC_URL
```

Credentials are marked as secrets and omitted from copied environments. Bucket, endpoint, region, and public URL values are plain config and inheritable unless you later choose another policy.

Bridge can reuse conventional `R2_` or `S3_` values. App- or environment-scoped values override global storage values; within a scope, explicit `BRIDGE_` values override the conventional names. See [File Uploads](/slipway/file-uploads) and [Bridge](/slipway/bridge).

## Encryption and audit history

The complete global value map is encrypted at rest with Slipway's `DATA_ENCRYPTION_KEY`. Metadata remains value-free so it can explain ownership and policy without exposing credentials.

Creating, updating, rotating, or deleting a key writes a configuration audit event containing the key, operation, actor, scope, type, and policy—never the value. Review these events in **Settings → Audit Log** or run:

```bash
slipway audit-log
```

## Apply changes

Global configuration is resolved at deployment time. Redeploy each affected app after a change:

```bash
slipway slide
```

The deployment's config fingerprint changes when its effective key/value set changes, even if the Git commit is the same.

## Operational guidance

- Prefer environment or app scope unless every deployed application truly needs the value.
- Treat access keys, secret keys, passwords, tokens, private connection URLs, and signing material as secrets.
- Keep public URLs, regions, bucket names, and non-sensitive feature modes as plain config only when they contain no credentials.
- Rotate a provider credential at the provider, update it in Slipway, then redeploy affected apps.
- Removing a global key may expose an environment or app value with the same name; review the cascade before deleting it.

## What's next?

- Learn the complete [environment variable cascade](/slipway/environment-variables)
- Understand [Config & Secrets](/slipway/secrets)
- Configure [File Uploads](/slipway/file-uploads)
