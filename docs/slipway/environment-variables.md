---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Environment Variables
titleTemplate: Slipway
description: Manage environment and app runtime configuration in Slipway.
prev:
  text: Rollbacks
  link: /slipway/rollbacks
next:
  text: Global Environment Variables
  link: /slipway/global-environment-variables
editLink: true
---

# Environment Variables

Environment variables configure an application without putting credentials or deployment-specific settings in its source code. Slipway stores them as deployment-native configuration and injects the resolved values when it starts a container.

## Set environment variables

### Dashboard

1. Open a project and select the environment.
2. Expand **Environment variables**.
3. Enter a key and value, then click **Add**.

For an app-only override, open the app from the environment's Apps list and use its **Environment variables** section.

Each new variable starts as a secret with an **Omit** preview policy. Open **•••** beside it to change its type, preview policy, or optional description.

Use the bulk editor when you already have `KEY=value` lines. Existing metadata is retained for keys that remain in the list; new keys receive the safe secret defaults.

### CLI

The CLI manages environment-scoped values for the linked project:

```bash
# Production is the default environment
slipway env:set SESSION_SECRET=replace-me LOG_LEVEL=info

# Target another environment
slipway env:set LOG_LEVEL=debug --env staging

# Remove values
slipway env:unset OLD_TOKEN

# List values; secrets are masked
slipway env
```

Use the dashboard to configure app-level overrides and metadata.

## Configuration cascade

Slipway resolves configuration in this order; later scopes win:

```text
global < environment < app < Slipway-managed runtime values
```

| Scope           | Use it for                                                         |
| --------------- | ------------------------------------------------------------------ |
| **Global**      | Values shared by every application on the Slipway instance         |
| **Environment** | Values shared by apps in one production, staging, or other context |
| **App**         | Values required by only one app, such as a worker                  |
| **Managed**     | Service and runtime values owned by Slipway                        |

For example, an environment `LOG_LEVEL=debug` overrides a global `LOG_LEVEL=info`. An app can then use `LOG_LEVEL=warn` without changing its sibling apps.

Service connection variables such as `DATABASE_URL` and `REDIS_URL` are Slipway-managed. They are visible at environment scope but cannot be edited, removed, or shadowed by an app override. Change or remove the service that owns them.

## Secret and plain values

- **Secret** values are masked in the UI and CLI and default to **Omit** for copied environments. This is the default type.
- **Plain config** is intended for non-sensitive values such as public URLs, regions, feature modes, and log levels.

All global, environment, and app values are encrypted at rest. The type classification controls display and the safe default for copied environments: secrets default to **Omit**, while plain config defaults to **Inherit**.

See [Config & Secrets](/slipway/secrets) for audit history, managed values, preview policy, and deployment fingerprints.

## Preview policy

When an environment is explicitly created from another environment, every value follows its own policy:

| Policy                 | Result                                                        |
| ---------------------- | ------------------------------------------------------------- |
| **Omit**               | Do not copy the value                                         |
| **Inherit**            | Copy the current value                                        |
| **Generate new value** | Create a new cryptographically random value for the new scope |

Generated values are attributed to Slipway. Existing environments keep their values until you change them.

Use `--from` to create an environment through that policy boundary:

```bash
slipway environment:create preview-42 --from production
```

## When changes take effect

Changing configuration does not mutate a running container. Redeploy the app to apply the new effective values:

```bash
slipway slide
```

The deployment page shows a keyed config fingerprint and variable count. This helps distinguish a code-only redeploy from a release whose effective configuration changed, without storing secret values in deployment logs.

## Variable references

Values may reference another effective variable with `$NAME` or `${NAME}`:

```bash
HOST=app.internal
ORIGIN=http://$HOST:${PORT}
HEALTH_URL=${ORIGIN}/health
```

At container start this becomes:

```text
HOST=app.internal
ORIGIN=http://app.internal:1337
HEALTH_URL=http://app.internal:1337/health
```

`PORT` is the internal application port assigned by Slipway. Use `$$` for a literal dollar sign:

```bash
TEMPLATE=literal=$$PORT resolved=$PORT
```

Expansion is performed without a shell. Command substitutions, backticks, and shell-like text are treated as literal data. Unknown and cyclic references remain unchanged. Expanded values are limited to 1 MiB, so keep reference chains short and legible.

## Common Sails values

### Application

| Variable         | Purpose                              |
| ---------------- | ------------------------------------ |
| `NODE_ENV`       | Select production behavior           |
| `SESSION_SECRET` | Sign or encrypt application sessions |
| `LOG_LEVEL`      | Configure application logging        |
| `PORT`           | Internal port; injected by Slipway   |

### Services

| Variable       | Purpose                                      |
| -------------- | -------------------------------------------- |
| `DATABASE_URL` | Primary database connection, usually managed |
| `REDIS_URL`    | Redis connection, usually managed            |

Creating a service with `slipway db:create` or the dashboard injects its managed connection URL automatically.

### External providers

Values such as `RESEND_API_KEY`, `SENTRY_DSN`, storage credentials, payment keys, and webhook secrets should normally be marked as secrets. Public endpoints, bucket names, regions, and feature modes can be plain config when they contain no credential material.

## Operational guidance

- Never commit `.env`, credentials, private keys, or production URLs containing passwords.
- Use a separate value for production and non-production providers.
- Put a value at the narrowest scope that needs it.
- Leave production secrets on **Omit** unless copying is explicitly safe.
- Generate secrets with a cryptographically secure source such as `openssl rand -hex 32`.
- Keep an accurate `.env.example` with keys but no real values.
- Never log `process.env` from the application.

## Troubleshooting

### A new value is not visible in the app

1. Redeploy with `slipway slide`.
2. Confirm you edited the intended environment and app.
3. Check whether a narrower scope overrides the key.
4. Verify the application reads the same key name.

### A managed value cannot be edited

This is intentional. Change, repair, or remove the database or Redis service that owns the value. Slipway prevents direct edits so its service state and runtime configuration cannot diverge.

### A copied environment is missing a secret

Secret values default to **Omit**. Open the source variable's **•••** menu and deliberately choose **Inherit** or **Generate new value**, then create the environment again.

## What's next?

- Read [Config & Secrets](/slipway/secrets)
- Configure [Global Environment Variables](/slipway/global-environment-variables)
- Add [Database Services](/slipway/database-services)
