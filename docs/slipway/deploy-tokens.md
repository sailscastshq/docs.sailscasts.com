---
title: Deploy Tokens
titleTemplate: Slipway
description: Create, scope, and revoke deployment credentials without assuming CLI support.
editLink: true
---

# Deploy Tokens

Manage deploy tokens under **Settings → Git**. Give each token a recognizable name and the narrowest supported project and environment scope. Save the newly created token directly to a private secret store; its complete value is shown only once.

List or revoke tokens through that page. Revocation stops future use of that credential; it does not reverse an operation already started.

## Availability boundary

Token management is implemented, but the inspected server authentication path does not establish deploy-token support for source upload and deployment requests. Do not build a pipeline around a deploy token until the server release's authentication contract explicitly supports those endpoints.

The CLI also does not consume `SLIPWAY_TOKEN`. Setting that variable does not authenticate `slipway slide`. CLI commands use the saved account credential created by [browser login](/slipway/cli-authentication).

For automatic deployments available today, configure [Git Integration](/slipway/git-integration) and [Auto-Deploy](/slipway/auto-deploy) for the chosen app and branch.

## API management reference

An authorized account client can manage tokens using:

| Method   | Path                        | Purpose                                              |
| -------- | --------------------------- | ---------------------------------------------------- |
| `GET`    | `/api/v1/deploy-tokens`     | List active tokens without returning complete values |
| `POST`   | `/api/v1/deploy-tokens`     | Create a token; returns its value once               |
| `DELETE` | `/api/v1/deploy-tokens/:id` | Revoke a token                                       |

Creation accepts `name`, optional `projectId` and `environmentId`, `scopes`, and optional `expiresInDays`. These are token-management endpoints, not a proof that a token is accepted by every deployment or operational API. Protect account authorization and browser CSRF tokens when using these endpoints.
