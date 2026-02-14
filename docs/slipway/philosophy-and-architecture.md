---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Philosophy & Architecture
titleTemplate: Slipway
description: The design decisions and technical architecture behind Slipway.
prev:
  text: The Name
  link: /slipway/the-name
next:
  text: Requirements
  link: /slipway/requirements
editLink: true
---

# Philosophy & Architecture

The design decisions behind Slipway and how all the pieces fit together.

## Philosophy

### Own Your Infrastructure

Slipway is **self-hosted by design**. Your code, your data, your servers. There's no SaaS middleman between you and your infrastructure. You install Slipway on a VPS you control — like a [Hetzner Cloud](https://www.hetzner.com/cloud/) server — and everything runs there.

This means:

- **No vendor lock-in** — Move your server anytime
- **No usage-based pricing** — Pay only for your VPS
- **No data leaving your network** — Your database backups, logs, and secrets stay on your machine
- **Full transparency** — Every Docker command Slipway runs is visible to you

### Sails-Native, Not Generic

Generic deployment platforms treat every app the same. Slipway is different — it **understands** Sails.js applications:

- It detects your models and lets you manage data visually (Bridge)
- It connects to your running app's environment for live debugging (Helm)
- It reads your `sails-quest` jobs and lets you manage them (Quest)
- It integrates with `sails-content` for content editing (Content)
- It auto-injects `DATABASE_URL` and `REDIS_URL` when you attach services

This Sails-awareness means less configuration and more integrated tooling.

### Simple Over Complex

Slipway makes deliberate choices to stay simple:

- **Docker, not Kubernetes** — Containers are powerful enough for most applications. K8s adds operational complexity that small-to-medium teams don't need.
- **SQLite, not PostgreSQL** — Slipway's own data (projects, deployments, settings) is stored in SQLite. No separate database server to manage. One file, backed up easily.
- **Caddy, not Nginx** — Automatic HTTPS with zero configuration. No cert renewal cron jobs, no manual certificate management.
- **Single server** — One VPS runs everything. When you need to scale, add another Slipway instance on another server.

### Transparent Docker

You should always know what's happening on your server. Slipway doesn't hide Docker behind abstractions — it uses Docker directly and shows you what it's doing:

- Container names are predictable (`myapp-production`, `myapp-postgres`)
- You can `docker logs`, `docker exec`, and `docker inspect` anything Slipway creates
- All Docker operations use `execFile()` — no shell wrappers, no injection risk

## Architecture

### The Big Picture

```
┌─────────────────────────────────────────────────────────────┐
│                        YOUR VPS                             │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  SLIPWAY PLATFORM                   │    │
│  │                                                     │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │    │
│  │  │  Web UI  │  │   CLI    │  │    REST API      │  │    │
│  │  │(Vue 3 +  │  │(slipway- │  │ (Sails Actions)  │  │    │
│  │  │ Inertia) │  │  cli)    │  │                  │  │    │
│  │  └────┬─────┘  └────┬─────┘  └───────┬──────────┘  │    │
│  │       └──────────────┼────────────────┘             │    │
│  │                      │                              │    │
│  │  ┌───────────────────┴──────────────────────────┐   │    │
│  │  │              SLIPWAY CORE (Sails.js)         │   │    │
│  │  │                                              │   │    │
│  │  │  ┌─────────┐ ┌──────────┐ ┌──────────────┐  │   │    │
│  │  │  │ Deploy  │ │ Service  │ │    Caddy     │  │   │    │
│  │  │  │ Engine  │ │ Manager  │ │   Routing    │  │   │    │
│  │  │  └─────────┘ └──────────┘ └──────────────┘  │   │    │
│  │  │  ┌─────────┐ ┌──────────┐ ┌──────────────┐  │   │    │
│  │  │  │ Backup  │ │ Metrics  │ │    Audit     │  │   │    │
│  │  │  │ System  │ │ & Logs   │ │    Logs      │  │   │    │
│  │  │  └─────────┘ └──────────┘ └──────────────┘  │   │    │
│  │  └──────────────────────────────────────────────┘   │    │
│  │                      │                              │    │
│  │  ┌───────────────────┴──────────────────────────┐   │    │
│  │  │           SQLite (app.db + observability.db)  │   │    │
│  │  └──────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
│                         │                                   │
│  ┌──────────────────────┴──────────────────────────────┐    │
│  │              CONTAINER RUNTIME (Docker)              │    │
│  │                                                      │    │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌──────────┐   │    │
│  │  │ caddy  │  │ myapp  │  │ redis  │  │ postgres │   │    │
│  │  │ proxy  │  │        │  │        │  │          │   │    │
│  │  └────────┘  └────────┘  └────────┘  └──────────┘   │    │
│  └──────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Two Containers, One Network

When you install Slipway, only **two containers** start:

| Container       | Image                             | Purpose                                   |
| --------------- | --------------------------------- | ----------------------------------------- |
| `slipway`       | `ghcr.io/sailscastshq/slipway`    | The dashboard, API, and deployment engine |
| `slipway-proxy` | `lucaslorentz/caddy-docker-proxy` | Reverse proxy with automatic HTTPS        |

Both sit on the `slipway` Docker network. When you deploy apps or create services, their containers join the same network — so everything can communicate.

### How Caddy Routes Traffic

Slipway uses [caddy-docker-proxy](https://github.com/lucaslorentz/caddy-docker-proxy) which reads Docker labels to auto-configure routes. When you deploy an app and assign a domain:

1. Slipway allocates a port (from the 1338–1500 range)
2. Your app container starts on that port
3. Slipway updates Caddy's routes via its admin API (`localhost:2019`)
4. Caddy provisions an SSL certificate automatically (via Let's Encrypt)
5. Traffic flows: `yourdomain.com → Caddy → your-app:port`

No Nginx config files. No manual cert renewal. No `certbot` cron jobs.

### How Deployments Work

Slipway uses **blue-green deployments** for zero downtime:

```
1. Build image from your Dockerfile
2. Start NEW container (old one still serving traffic)
3. Health-check the new container
4. Switch Caddy route to new container
5. Stop old container
6. Rename new container to canonical name
```

If the health check fails, Slipway stops the new container and the old one keeps running. Your users never see downtime.

### Data Storage

Slipway uses **two SQLite databases**, both stored in the `slipway-db` Docker volume:

| Database           | Purpose                                                              |
| ------------------ | -------------------------------------------------------------------- |
| `app.db`           | Projects, environments, deployments, users, teams, settings, backups |
| `observability.db` | Application logs, telemetry spans, exceptions, metrics               |

Separating observability data prevents high-volume logs from affecting the core application database.

### Secrets Management

Slipway stores two secrets on your server at `/etc/slipway/.env`:

| Secret                | Purpose                                                                 |
| --------------------- | ----------------------------------------------------------------------- |
| `SESSION_SECRET`      | Signs session cookies                                                   |
| `DATA_ENCRYPTION_KEY` | Encrypts sensitive fields (database passwords, deploy tokens, API keys) |

These are generated once during installation and reused on updates. Sensitive model fields (like service passwords) are encrypted at rest using `DATA_ENCRYPTION_KEY`.

## The Platform

Slipway includes a suite of built-in tools that work with your deployed Sails apps:

### Helm — Production REPL

Connect to your running app and execute code in its context. Query models, run helpers, inspect configuration — all from the browser.

**Named after** the ship's helm, where you steer and command.

### Bridge — Data Management

Auto-generated CRUD interface for your Waterline models. Browse records, create entries, edit data, manage relationships — without writing admin panels.

**Named after** the ship's bridge, the command center.

### Dock — Database Explorer

Direct SQL access to your backing databases. Execute queries, browse schemas, view table data, export databases, and even generate migration diffs.

**Named after** the dock, where ships are serviced and maintained.

### Quest — Job Dashboard

Monitor and manage background jobs from [sails-quest](https://docs.sailscasts.com/sails-quest). View schedules, pause/resume jobs, trigger manual runs, and see job history.

**Named after** quests — the missions your app carries out in the background.

### Content — Content Editor

Edit static content files managed by [sails-content](https://docs.sailscasts.com/content). Browse collections, edit markdown and JSON files — a built-in CMS for your content-driven pages.

**Named after** the content (cargo) a ship carries.

## Backup Architecture

Slipway backs up your database services (PostgreSQL, MySQL, MongoDB) to S3-compatible storage:

1. Executes native dump commands inside the service container (`pg_dump`, `mysqldump`, `mongodump`)
2. Uploads the dump to your configured S3 bucket (supports AWS S3, Cloudflare R2, DigitalOcean Spaces)
3. Tracks backup metadata (size, duration, storage location) for one-click restore

Backup storage is configured via [global environment variables](/slipway/global-environment-variables) — set your S3 credentials once and all projects can use them.

## Technology Choices

| Choice                 | Why                                                                               |
| ---------------------- | --------------------------------------------------------------------------------- |
| **Sails.js**           | Slipway is built with Sails because it's for Sails — dogfooding the framework     |
| **Vue 3 + Inertia.js** | Server-driven SPA — fast page transitions without a separate API layer            |
| **SQLite**             | Zero-config database, single file backup, perfect for a self-hosted dashboard     |
| **Caddy**              | Automatic HTTPS, Docker-native routing via labels, minimal config                 |
| **Docker**             | Universal container runtime, no vendor lock-in, works on any Linux VPS            |
| **`node:22-slim`**     | Debian-based for glibc compatibility with native modules like `better-sqlite3`    |
| **`tini`**             | Proper init process for signal handling — containers stop cleanly                 |
| **`execFile()`**       | All Docker commands use `execFile()` instead of shell for security (no injection) |
