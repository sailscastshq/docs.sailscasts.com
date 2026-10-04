---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: What is Slipway?
titleTemplate: Slipway
description: Slipway is an open-source, self-hosted deployment platform for Sails.js and The Boring JavaScript Stack applications.
prev:
  text: Overview
  link: /slipway/
next:
  text: Why Slipway
  link: /slipway/why-slipway
editLink: true
---

# What is Slipway?

Slipway is an open-source, self-hosted platform for deploying and operating Sails.js and The Boring JavaScript Stack applications. It runs on your server and brings source deployment, databases, application inspection, and operational tools into one dashboard.

## Start with one deployed app

Install Slipway, complete the instance setup, then deploy the committed source from your application directory:

```bash
slipway login --server https://slipway.example.com
slipway init --name harbor
slipway push
slipway readiness --env production
slipway slide --env production
```

Follow [Your First Deploy](/slipway/first-deploy) for the Dockerfile, listening address, health path, and verification. The server builds and runs the container; the CLI packages and uploads source.

## Choose a tool for the task

| Need                                                      | Tool                                           |
| --------------------------------------------------------- | ---------------------------------------------- |
| Deploy code, configure routes, or recover an app revision | App deployment history and [CLI](/slipway/cli) |
| Query Sails models and call helpers                       | [Helm](/slipway/helm)                          |
| Query a database, inspect schema, or review a migration   | [Dock](/slipway/dock)                          |
| Manage model data through an app-owned interface          | [Bridge](/slipway/bridge)                      |
| Inspect background jobs and operational compatibility     | [Quest](/slipway/quest)                        |
| Inspect resources, failures, and telemetry                | [Lookout](/slipway/lookout)                    |
| Collect feedback, publish a roadmap, and share updates    | [Bearing](/slipway/bearing)                    |
| Understand product activity and revenue                   | [Wake](/slipway/wake)                          |

These tools have different runtime and permission requirements. Opening Helm or Dock does not make a query read-only; review the target and side effects before executing it. Quest is a job scheduler integration, not a queue dashboard with automatic retry guarantees.

## Your infrastructure

Docker runs applications and services. Caddy handles public routes and automatic HTTPS when DNS and network access are configured correctly. Slipway stores its own state in SQLite and serves its dashboard with Sails, Vue, and Inertia.

You operate the host, its capacity, database recovery, encryption keys, DNS, and provider firewall. Start with [Requirements](/slipway/requirements) and [Ingress and Firewall](/slipway/ingress-and-firewall).

## Check release availability

Documentation may describe development capabilities beyond the latest public release. Use [Updates](/slipway/updates#release-compatibility) to distinguish released deployment features from the next CLI, Helm command workspace, and resident Quest controls. The tools do not have complete dashboard/CLI parity.

Continue with [Server Installation](/slipway/server-installation) or the [operations guide](/slipway/operations).
