# MCP preview

Hagfish’s MCP integration is a private repository preview. It is not published as an npm package or available as a hosted connector. Browser login and connected-account consent are still being prepared.

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

For the available API-key workflow, follow [authentication](./api/authentication) and the [CLI guide](./cli/). `hagfish auth login` and a device login command are not implemented in this candidate.
