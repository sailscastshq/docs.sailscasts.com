---
layout: home
title: Hagfish
titleTemplate: Sailscasts
description: Professional invoicing for creators, with an API for products, automations, and agents.
sidebar: false
hero:
  name: Hagfish
  text: The invoice transaction layer for modern work.
  tagline: Create polished invoices, track the business around them, and let your software handle the repetitive parts.
  actions:
    - theme: brand
      text: Use Hagfish
      link: https://hagfish.app
    - theme: alt
      text: Build with the API
      link: /hagfish/api/
features:
  - icon: ✦
    title: Invoice beautifully
    details: Create professional invoices in global currencies, apply discounts, VAT, and withholding tax, then schedule or send them.
  - icon: ◫
    title: Know the business
    details: Keep clients, expenses, payment information, recurring work, invoice status, and your send entitlement in one place.
  - icon: ↗
    title: Build it into your workflow
    details: Use scoped API keys, idempotent REST resources, exact server-calculated totals, and signed webhooks for reliable integrations.
  - icon: ⚡
    title: Ready for conversational banking
    details: The same transaction layer can power Telegram, WhatsApp, banking, and agent experiences without creating parallel invoice logic.
---

## One Hagfish, two ways to use it

Hagfish is a complete invoicing product for professional creators and a
transaction layer for software that needs to invoice on their behalf. The web
app and public API share the same client records, invoice lifecycle, PDF and
email delivery, plan quota, and credit ledger.

### Run the work from Hagfish

Use the product when you want a focused place to create clients and invoices,
track expenses, schedule or send invoices, share public invoice links, manage
recurring work, and follow payment status.

[Open Hagfish →](https://hagfish.app)

### Bring Hagfish into your product

Use the REST API when a SaaS product, internal tool, workflow automation, bot,
or agent should turn “invoice this client” into a safe transaction. Hagfish
handles tenant isolation, fixed-point currency math, idempotency, billing
reservation, asynchronous delivery, and signed outcome events.

[Read the API documentation →](/hagfish/api/)

## Built for retries, not demos

Real integrations time out, submit twice, and receive events out of order.
Hagfish requires idempotency keys for mutations, calculates totals on the
server, reserves entitlement atomically, queues outbound work, and exposes
delivery history and replay. That makes it useful behind a product interface,
not only in a one-off script.

## Start where you are

- If you send invoices yourself, [start with Hagfish](https://hagfish.app).
- If your application sends them, [create your first API invoice](/hagfish/api/getting-started).
- If you need reliable status updates, [implement Hagfish webhooks](/hagfish/api/webhooks).
