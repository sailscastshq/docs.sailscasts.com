# Clients and onboarding links

Release status: client onboarding is available in the coordinated API release and CLI/MCP 0.0.2. Hosted operations require an approved application registration and browser review.

Hagfish lets you create a client with complete billing details, or send a private onboarding link so the client can provide those details. You review submitted details in Hagfish before accepting the client. Creating a link does not send an email.

## Connect with the right permissions

API keys and connected applications use the same account boundary. `clients:read` reads clients, onboarding links and delivery status. `clients:write` creates or edits clients, creates onboarding links and requests onboarding emails. Hosted MCP writes additionally require a separate browser review in Hagfish; connecting or confirming in chat does not approve a send.

For the complete connected workflow, request only the approved permissions: `clients:read clients:write invoices:read usage:read invoices:write invoices:pdf invoices:send`. Connecting is free. Client and onboarding operations do not spend credits or use your invoice email allowance. Invoice PDF/send pricing and included allowances still apply to invoice operations.

## Create or update a client

The API uses `POST /api/v1/clients` and `PATCH /api/v1/clients/CLIENT_ID`. Retain an `Idempotency-Key` for each logical change. Create JSON requires `name`, `email`, `address`, `city_state_postal` and `country`; `tin` is optional. A patch changes only the supplied fields.

```sh
hagfish clients create --input client.json --idempotency-key client-atlas-001 --json
hagfish clients update CLIENT_ID --input client-update.json --idempotency-key client-atlas-edit-001 --json
```

Hosted MCP tools `hagfish_create_client` and `hagfish_update_client` return a review URL. Check the normalized billing details in Hagfish, then approve or cancel. Reading an approval never executes it. If the client changes during review, request a fresh review.

## Create and inspect an onboarding link

`POST /api/v1/client-onboardings` accepts `client_email` and optional `client_name`. It creates a 30-day private link and returns its public ID, status and URL. An active invite already exists if that email has a pending, submitted or changes-requested onboarding in your account. List your onboardings to find it instead of creating another.

```json
{ "client_email": "billing@example.test", "client_name": "Atlas Studio" }
```

```sh
hagfish client-onboardings create --input onboarding.json --idempotency-key atlas-onboard-001 --json
hagfish client-onboardings list --limit 20 --json
hagfish client-onboardings get ONBOARDING_ID --json
```

Use `--after` with `meta.next_cursor` for another page. An expired or completed invite returns no usable URL. Reading a link never renews it. Treat the URL as private: anyone with the link can access its form. Do not put it in public posts or recordings of customer data.

Hosted MCP offers `hagfish_client_onboardings`, `hagfish_client_onboarding` and `hagfish_create_client_onboarding`. Link creation still requires owner review and sends no email.

## Review and send the link

Read `GET /api/v1/client-onboardings/ONBOARDING_ID/send-preview?recipient_email=billing%40example.test` to inspect the fixed email subject, message, recipient and link expiry. It performs no writes or mail.

Send with `POST /api/v1/client-onboardings/ONBOARDING_ID/deliveries`, a retained `Idempotency-Key`, and `{"recipient_email":"billing@example.test"}`. The recipient must match the invite email. The response is `202` with a queued delivery ID.

```sh
hagfish client-onboardings send ONBOARDING_ID --to billing@example.test --dry-run --json
hagfish client-onboardings send ONBOARDING_ID --to billing@example.test --idempotency-key atlas-invite-send-001 --yes --json
hagfish onboarding-deliveries get DELIVERY_ID --json
```

Interactive use shows the recipient and message before asking for confirmation. Automation needs explicit `--yes`. Retrying the same command and key replays its original reservation. A queued response is not a delivered email; inspect its delivery ID for the current outcome.

For an expired pending link, explicitly add `--renew-expired` or API `renew_expired:true` when sending. Review this decision first: approval makes the existing link valid for another 30 days. Active links keep their current expiry. Submitted, accepted and declined invites cannot be resent as pending invites.

`hagfish_send_client_onboarding` returns a Hagfish review URL showing the exact recipient, business, subject, message and renewal intent. Only the signed-in owner can approve it. The model cannot bypass that review.

## Delivery outcomes and troubleshooting

| Outcome                   | Meaning and next step                                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `queued`                  | Persisted for background processing. Read this delivery again.                                                          |
| `sending`                 | A worker claimed the delivery. Do not start another send.                                                               |
| `accepted`                | The provider acknowledged it; Hagfish is finishing its records. No resend is needed.                                    |
| `sent`                    | Provider acceptance was recorded. Inbox arrival is not guaranteed.                                                      |
| `rejected`                | The provider explicitly rejected the attempt. Inspect the invite and request a fresh reviewed send if appropriate.      |
| `cancelled`               | The client submitted, the link expired, or the invite was unavailable before provider contact. Read the current invite. |
| `reconciliation_required` | Acceptance is unknown after a timeout/interruption. Contact support with the delivery ID; do not create another send.   |

`onboarding_delivery_pending` means an earlier queued or unresolved delivery blocks another operation key. Same-key API retries return the original reservation. CLI automation can replay with the same command, `--yes` and the same key even when a fresh preview is blocked. A dry run always remains read-only.

`onboarding_expired` requires explicit renewal review; `recipient_mismatch` requires the invite's current client email. `onboarding_not_pending` requires inspecting the client's submission instead of emailing another invite. `insufficient_scope` requires reviewing your key or connection permissions. A changed, denied, expired or revoked browser approval never executes; request a new review when appropriate.

After your client submits, review and accept their details in Hagfish's Clients → Onboarding page. This workflow does not automatically accept or change billing details on your behalf.
