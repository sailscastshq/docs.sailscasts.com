---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: What is Slipway?
titleTemplate: Slipway
description: Slipway is an open-source, self-hostable deployment platform purpose-built for Sails.js and The Boring JavaScript Stack applications.
prev:
  text: Overview
  link: /slipway/
next:
  text: Why Slipway
  link: /slipway/why-slipway
editLink: true
---

# What is Slipway?

Slipway is an open-source, self-hostable deployment platform purpose-built for **Sails.js** and **The Boring JavaScript Stack** applications. Think Coolify meets Laravel Forge meets Nova meets Tinkerwell—but designed from the ground up to understand Sails applications deeply.

## The Goal

**One platform to deploy, manage, monitor, and administrate all your Sails applications and their databases.**

Slipway provides:

- **Deployment** — Deploy Sails apps with a single command
- **Database management** — Provision PostgreSQL, MySQL, Redis with one click
- **Admin panel** — Auto-generated CRUD for your Sails models (Bridge)
- **Production REPL** — Query your production data safely (Helm)
- **Queue monitoring** — Sails Quest integration (Quest Dashboard)

## The Slipway Suite

Slipway isn't just a deployment tool—it's a suite of integrated tools that work together:

| Component           | Equivalent To   | Description                      |
| ------------------- | --------------- | -------------------------------- |
| **Slipway Deploy**  | Forge/Coolify   | Deployment & infrastructure      |
| **Slipway Helm**    | Tinkerwell      | Production REPL for Sails        |
| **Slipway Bridge**  | Nova/AdminJS    | Auto-generated data management   |
| **Quest Dashboard** | Laravel Horizon | Queue monitoring for Sails Quest |

### Helm

Named after the ship's **helm**—where you steer and command the vessel. Helm is a production REPL accessible from the Slipway dashboard that understands your Sails environment:

```javascript
// Query models directly
await User.find({ role: 'admin' })
// → [{ id: 1, email: 'admin@example.com', role: 'admin' }]

// Use helpers
await sails.helpers.email.send({ to: 'test@example.com', subject: 'Test' })
// → { success: true }

// Check config
sails.config.custom.stripeKey
// → 'sk_live_xxx...'
```

### Bridge

Named after the ship's **bridge**—the command center where the captain navigates and controls the vessel. Bridge auto-generates an admin panel from your Sails models:

- CRUD operations for all your models
- Relationship management (hasMany, belongsTo)
- Customizable list views with filtering and sorting
- File upload handling
- Role-based access control

### Quest Dashboard

If your app uses [Sails Quest](https://docs.sailscasts.com/sails-quest) for job queues, Slipway automatically provides a queue dashboard:

- View job status (pending, processing, completed, failed)
- Retry failed jobs with one click
- Monitor worker status
- Queue throughput metrics

## How It Works

1. **Install Slipway on your VPS** — One command to bootstrap
2. **Connect your Sails app** — Via Git or CLI deploy
3. **Slipway detects your app** — Reads your models, config, and hooks
4. **Deploy with one command** — `slipway slide` deploys your app
5. **Manage everything from the dashboard** — Bridge, Helm, logs, domains

## Architecture

Under the hood, Slipway uses:

- **Docker** for container isolation
- **Caddy** for automatic HTTPS and reverse proxying
- **SQLite** for Slipway's own data (lightweight)
- **Sails.js + Vue + Inertia** for the dashboard

```
┌─────────────────────────────────────────────────────────┐
│                    SLIPWAY PLATFORM                       │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   Web UI    │  │   CLI Tool  │  │    REST API     │  │
│  │ (Dashboard) │  │  (slipway)  │  │  (Sails Actions)│  │
│  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘  │
│         │                │                   │           │
│  ┌──────────────────────────────────────────────────┐   │
│  │                 SLIPWAY CORE                      │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │   │
│  │  │ Deployer│ │Database │ │  Proxy  │ │ Monitor │  │   │
│  │  │ Service │ │ Manager │ │ Manager │ │ Service │  │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘  │   │
│  └──────────────────────────────────────────────────┘   │
│                          │                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │           CONTAINER RUNTIME (Docker)              │   │
│  │                                                    │   │
│  │  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────────┐   │   │
│  │  │ caddy │  │ myapp │  │ redis │  │ postgres  │   │   │
│  │  └───────┘  └───────┘  └───────┘  └───────────┘   │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## When to Use Slipway

Slipway is great for:

- **Sails.js applications** — Purpose-built for the Sails ecosystem
- **The Boring JavaScript Stack** — Vue/React + Inertia + Sails
- **Self-hosted deployments** — Run on your own VPS or bare metal
- **Small to medium teams** — No Kubernetes complexity needed
- **Developers who want control** — Own your infrastructure and data

Slipway is _not_ for:

- **Non-Sails applications** — Use Coolify or Dokku for generic apps
- **Serverless-first architectures** — Use Vercel or Railway
- **Large-scale enterprise** — Consider Kubernetes for massive scale
