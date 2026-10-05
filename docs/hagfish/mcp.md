# MCP preview

Hagfish’s MCP integration is a private repository preview. It is not published as an npm package or available as a hosted connector. Connected-account login and hosted MCP are implemented in the private candidate and await public activation.

The preview exposes read-only tools for the authenticated account, payer clients, invoices, invoice previews, delivery status and usage. It uses a scoped API key and the same API permissions as the CLI. It cannot send email, create invoices or generate a paid PDF.

If you have access to the preview repository, install and launch it locally:

```sh
npm ci --prefix packages/mcp
# Supply HAGFISH_API_KEY through your secret environment.
node packages/mcp/bin/hagfish-mcp.js
```

Configure your MCP host to launch that command from the repository root. Grant only the read scopes needed by your workflow: `clients:read`, `invoices:read` and `usage:read`. Keep the key in the host’s secret environment, never in a shared configuration or prompt.

Tools include `hagfish_account`, `hagfish_clients`, `hagfish_invoices`, `hagfish_invoice`, `hagfish_preview`, `hagfish_delivery` and `hagfish_usage`. Lists accept `limit` and `after`; invoice and delivery reads accept a public `id`. A missing scope returns an authorization error; an ID outside your account returns not found.

Invoice preview shows the reviewed revision, completeness and current credit quotes without changing billing. Delivery status reflects the durable operation: `sent` records provider acceptance and does not guarantee inbox arrival. See [deliveries and billing](./api/deliveries-and-billing).

For the available API-key workflow, follow [authentication](./api/authentication) and the [CLI guide](./cli/). Browser PKCE login and explicit `hagfish auth login --device` are covered in the [CLI guide](./cli/).

## Connected account preview

The configured hosted endpoint is `/mcp`. It requires an OAuth access token approved for that resource; API keys and API-only access tokens do not grant hosted MCP access. A registered assistant application must send you through Hagfish’s browser consent, where you review your account and the exact read permissions. Public application registration and hosted connector availability have not been announced.

The preview offers the same seven read tools over modern and compatible legacy MCP transports. It cannot create or edit invoices, send email, or unlock a paid PDF. Revoking the connection immediately stops access. Your existing account, plan and billing rules remain unchanged.

If a host reports authorization failure, check the intended Hagfish issuer, resource audience, granted scopes and connection expiry. A foreign invoice or delivery ID returns not found. Never paste bearer credentials into a chat or a shared MCP configuration.
