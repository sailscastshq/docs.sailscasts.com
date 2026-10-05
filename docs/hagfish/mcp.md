# Hagfish MCP

Connect your agent to your Hagfish account to review clients and invoices, prepare a draft, export a PDF, and request delivery. You choose the permissions and approve each write in your browser. Your account remains the owner of the invoice and its billing.

The package is currently private and unpublished. Hosted connections require an approved, registered application and an activated Hagfish issuer. Do not install a similarly named package or paste credentials into a chat.

## Local read tools

If you have access to the repository, launch the local stdio server:

```sh
npm ci --prefix packages/mcp
# Supply HAGFISH_API_KEY through your secret environment.
node packages/mcp/bin/hagfish-mcp.js
```

Configure your MCP host to run this command from the repository root. Grant the read scopes needed by your workflow: `clients:read`, `invoices:read` and `usage:read`. Keep the key in the host's secret environment.

Nine local tools read your account, payer clients, invoices, previews, delivery status and usage: `hagfish_account`, `hagfish_clients`, `hagfish_invoices`, `hagfish_invoice`, `hagfish_preview`, `hagfish_delivery` `hagfish_usage`, `hagfish_invoice_templates` and `hagfish_invoice_template`. Lists accept `limit` (1–100) and `after`; invoice and delivery reads accept a public `id`. Local stdio cannot create invoices, unlock a PDF or send email.

## Connect through your browser

A registered assistant application connects to `https://hagfish.app/mcp` using browser consent and PKCE. Review the account, application and permissions before allowing access. Hosted MCP requires a token approved for the MCP resource; API keys and API-only access tokens cannot access it. Revoke a connection in Connected applications whenever you need.

The hosted connection adds these tools:

| Tool                   | Required permission | Review                                                               |
| ---------------------- | ------------------- | -------------------------------------------------------------------- |
| `hagfish_create_draft` | `invoices:write`    | Client, line items and draft details.                                |
| `hagfish_update_draft` | `invoices:write`    | Current revision and proposed edits.                                 |
| `hagfish_export_pdf`   | `invoices:pdf`      | Invoice revision and maximum credits.                                |
| `hagfish_send_invoice` | `invoices:send`     | Invoice revision, explicit recipients, schedule and maximum credits. |
| `hagfish_approval`     | `invoices:read`     | Read approval status and the completed result.                       |

These are in addition to the nine read tools. Request only the permissions you need. `invoices:read` lets the agent review invoices and retrieve approval results.

## Review a requested operation

Write tools require a stable `request_key` and a `payload`. Update, export and send also require the invoice `id`. Unknown fields, including model-supplied confirmation flags, are rejected.

For example, a send request includes:

```json
{
  "request_key": "invoice_ns_001_send",
  "id": "your_invoice_public_id",
  "payload": {
    "expected_revision": 2,
    "recipient_emails": ["billing@example.test"],
    "send_at": "now",
    "max_credits": 20
  }
}
```

Sending requires explicit recipients and either `now` or a future ISO timestamp with a timezone. Review the current quote with `hagfish_preview` before choosing the credit ceiling; the example assumes the PDF was already unlocked.

The tool returns a pending approval and a `review_url`. It has not created an invoice, consumed credits or sent email. Open the link in your browser and check the account, application, invoice, resulting draft total, recipients, schedule and cost. Approve or cancel in Hagfish. An agent saying “confirmed” does not approve the operation.

After approval, the agent reads the result with `hagfish_approval`. PDF results include an account-protected browser download URL. Delivery results identify the durable delivery operation; use `hagfish_delivery` to check its progress. `sent` means provider acceptance and does not guarantee inbox arrival. See [deliveries and billing](./api/deliveries-and-billing).

## Retries and troubleshooting

Reviews expire after ten minutes. Changes to the invoice revision, ordered items, client details, business profile or credit quote require a new review. A schedule that has passed cannot silently become an immediate send. Revoking the application prevents execution.

Retry a timed-out request with the same `request_key` and unchanged payload. It returns the same review. Retrying browser approval replays the original completed operation without another charge or email. Changing a request requires a new key and a new review. An expired or unresolved result never executes again automatically; inspect its resource before starting another operation.

A missing scope returns an authorization error. An ID outside your account returns not found. For connection failures, check the intended issuer, resource audience, permissions and expiry. Never share bearer credentials in a prompt or a configuration file. See [API authentication](./api/authentication) and [CLI account login](./cli/#connect-your-account).

## Reusable invoice templates

Read templates with `hagfish_invoice_templates` and `hagfish_invoice_template`. Hosted tools `hagfish_create_invoice_template`, `hagfish_update_invoice_template`, `hagfish_delete_invoice_template` and `hagfish_instantiate_invoice_template` request browser review and require both `invoices:read` and `invoices:write`.

Each request has a stable `request_key` and the strict [template API payload](./templates). Update, delete and instantiate also require the template `id`. Capture binds the source invoice revision and ordered content. Update and delete bind the template revision. Instantiation reviews the copied content, fresh dates and explicitly selected client before creating a separate draft. Changes to those details invalidate the review. Template operations do not consume credits, export a PDF or send email.
