# Reusable invoice templates

Save invoice content once and use it in a fresh draft. Templates preserve ordered line items, column labels, currency, notes, terms, payment instructions, additional business information, discounts and tax inputs. They do not copy a client, recipients, invoice number, dates, payments, delivery history, recurrence or billing.

In the editor, choose **Save as template** after your changes have saved. Use **Create from template** beside New invoice to reuse it. A new draft receives its own number and ID, today's UTC date and a due date fourteen days later. Choose its client explicitly. Editing or deleting a template leaves previously created invoices intact.

Templates reuse your document content with the existing invoice design.

## API

Read permissions require `invoices:read`. Every write requires both `invoices:read` and `invoices:write`, plus an `Idempotency-Key`. Use public IDs and the acknowledged revision from the latest response.

| Request                                       | JSON body                                                                 |
| --------------------------------------------- | ------------------------------------------------------------------------- |
| `GET /api/v1/invoice-templates`               | None; supports `limit` and `after`.                                       |
| `GET /api/v1/invoice-templates/:id`           | None.                                                                     |
| `POST /api/v1/invoice-templates`              | `name`, `source_invoice_id`, `expected_invoice_revision`.                 |
| `PATCH /api/v1/invoice-templates/:id`         | `expected_revision`, plus `name` and/or a complete `content` replacement. |
| `DELETE /api/v1/invoice-templates/:id`        | `expected_revision`.                                                      |
| `POST /api/v1/invoice-templates/:id/invoices` | `expected_revision` and optional `client_id`.                             |

Create example:

```json
{
  "name": "Monthly design work",
  "source_invoice_id": "your_invoice_public_id",
  "expected_invoice_revision": 2
}
```

Deletion returns HTTP 200 with `data.id`, `data.object: "invoice_template"` and `data.deleted: true`. Replay the same key and body after a timeout, including after deletion. A changed revision returns a conflict instead of overwriting newer content. Omitting `client_id` during instantiation creates a draft without a client or recipients.

## CLI

```sh
hagfish invoice-templates list
hagfish invoice-templates get TEMPLATE_ID
hagfish invoice-templates create --input template.json --idempotency-key template-save-001
hagfish invoice-templates update TEMPLATE_ID --input changes.json --idempotency-key template-edit-001
hagfish invoice-templates instantiate TEMPLATE_ID --revision 1 --client-id CLIENT_ID --idempotency-key template-draft-001
hagfish invoice-templates delete TEMPLATE_ID --revision 1 --idempotency-key template-delete-001
```

`--dry-run` reviews a proposed input without writing; it has not been server validated. Keep the same idempotency key and input when retrying a request. Use `--json` for structured responses.

## Agents

Hosted MCP requests owner browser approval for template capture, updates, deletion and instantiation. Review the source or template revision, ordered content and selected client before approving. Template approval authorizes that operation alone. Export and delivery each require their own review. See [MCP](./mcp).
