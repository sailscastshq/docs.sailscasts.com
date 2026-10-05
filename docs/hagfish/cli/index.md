---
title: Hagfish CLI
titleTemplate: Hagfish
description: Create, review, export, and deliberately deliver invoices from the terminal.
---

# Hagfish CLI

Create a draft, review its exact totals, and export the invoice without leaving your terminal. A send requires an explicit recipient, schedule, revision, credit ceiling, and approval.

::: info Developer preview
The package is not published yet. These commands describe the upcoming CLI. Use the reviewed local package until the release is announced.
:::

## Install the preview

Requires Node.js 22.12 or newer. From a Hagfish checkout:

```sh
npm pack ./packages/cli
npm install -g ./sailscastshq-hagfish-cli-0.1.0.tgz
hagfish --version
```

Set `HAGFISH_API_KEY` in your secret environment. The CLI never accepts a token flag. `HAGFISH_BASE_URL` defaults to `https://hagfish.app`; HTTP is allowed only for loopback development.

```sh
hagfish auth status --json
hagfish clients create --input client.json --idempotency-key client-project-001 --json
hagfish invoices create --input invoice.json --idempotency-key invoice-project-001 --json
hagfish invoices preview INVOICE_ID --json
```

The JSON files use the same fields as the [API quickstart](/hagfish/api/getting-started). For piped JSON, use `--input -`. The invoice response provides its `id` and `revision`.

## Connect your account

Browser and device login are implemented in the private candidate. Public activation is pending. On a configured Hagfish issuer:

```sh
hagfish auth login
hagfish auth status --json
hagfish auth logout
```

The browser shows your signed-in account, application, requested permissions and expiry. Default permissions are `clients:read`, `invoices:read` and `usage:read`. Additional permissions require an explicit `--scopes` request and fresh consent. Log out before switching accounts or permissions.

Use `hagfish auth login --device` when you cannot open a browser on the terminal machine. Open the displayed verification URL yourself and compare the code before approving. The CLI waits for your approval and reports failure if you decline or the code expires.

Connected login stores credentials in macOS Keychain or Linux Secret Service. Windows connected login is not yet verified; use a scoped `HAGFISH_API_KEY` on Windows. A locked or unavailable vault fails closed; the CLI never saves refresh credentials in plaintext. Logout revokes the server connection before clearing the vault. API keys remain available for automation and take precedence when `HAGFISH_API_KEY` is set.

Access tokens expire after 10 minutes. A connection can renew access for up to 7 days. Revoke it at any time in Connected applications. Sending still requires the explicit revision, recipients, schedule, credit ceiling and command approval described below.

## Export and retrieve

Review the preview, then explicitly approve generation:

```sh
hagfish invoices pdf INVOICE_ID --revision 1 --max-credits 20 \
  --idempotency-key pdf-project-001 --yes --json
hagfish pdf download ARTIFACT_ID --output invoice.pdf --json
```

Generation returns the artifact ID; download retrieves its existing bytes. Downloads refuse to overwrite a file. `--dry-run` never writes, generates, reserves credits, or sends.

## Send deliberately

```sh
hagfish invoices send INVOICE_ID --to billing@example.test --send-at now \
  --revision 1 --max-credits 20 --idempotency-key send-project-001 --dry-run --json
```

After reviewing the recipient, schedule, and cost, remove `--dry-run`. An interactive terminal asks for confirmation. Automation must pass `--yes`; without it a noninteractive send fails before committing.

Use an ISO timestamp with an explicit timezone instead of `now` to schedule. A successful command returns the accepted delivery ID and current status. It does not claim the email arrived.

```sh
hagfish deliveries get DELIVERY_ID --json
hagfish usage list --limit 20 --json
```

The send after PDF unlock costs up to 20 credits on a credit account; email-first can cost 40. Active plan entitlement may reduce the applicable cost to zero. See [billing](/hagfish/api/deliveries-and-billing).

## Commands and pagination

Clients and invoices support `list`, `get`, `create`, and `update`. Updates use `--input`; invoice updates must include `expected_revision`. Use `--query` for client search and `--status` or `--client-id` for invoice filters. Lists return one bounded page, with `--limit` from 1 to 100. Pass `meta.next_cursor` using `--after`.

The client retries transient network errors, rate limits, and gateway failures within a bounded window, preserving the original body and operation key. If it reports an unknown write outcome, retain that key and inspect or replay the operation before making another one.

| Exit code | Meaning                                         |
| --------- | ----------------------------------------------- |
| 0         | Command completed or review completed           |
| 1         | Server or unexpected error                      |
| 2         | Input, options, or approval error               |
| 3         | Authentication or permission error              |
| 4         | Billing required                                |
| 5         | Network, rate limit, or unknown write outcome   |
| 6         | Revision, operation, or credit-ceiling conflict |

JSON output goes to stdout. Diagnostics go to stderr and redact API keys and webhook secrets. Keep credential environment values out of terminal recordings.
