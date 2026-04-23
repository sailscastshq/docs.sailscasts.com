---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Why Slipway?
titleTemplate: Slipway
description: Why Slipway exists for deploying and operating Sails.js applications.
prev:
  text: What is Slipway
  link: /slipway/what-is-slipway
next:
  text: The Name
  link: /slipway/the-name
editLink: true
---

# Why Slipway?

## The Problem Today

Deploying and operating a Sails.js app often requires separate tools for deployment, administration, debugging, and monitoring:

- **Coolify/Dokploy** for deployment (generic, not Sails-aware)
- **AdminJS/Forest Admin** for admin panels (separate setup, not integrated)
- **A REPL workaround** for production debugging (no dedicated Sails REPL equivalent)
- **Separate job queue monitoring** (no Horizon equivalent)
- **Multiple dashboards** for different concerns

## What Laravel Developers Have

| Tool            | Purpose                          |
| --------------- | -------------------------------- |
| Laravel Forge   | Server provisioning & deployment |
| Laravel Nova    | Admin panel                      |
| Laravel Tinker  | Production REPL                  |
| Laravel Horizon | Queue monitoring                 |
| Laravel Pulse   | Application monitoring           |

Slipway combines similar concerns in one platform for Sails applications.

## What Slipway Provides

Slipway provides one platform that:

- Deploys Sails apps with one command
- Manages databases (PostgreSQL, MySQL, Redis)
- Provides a Sails-aware admin panel (like Nova)
- Offers a production REPL (like Tinkerwell)
- Monitors queues (Sails Quest integration)
- Provides a web dashboard for the same operational tasks

## Learning from the Best

Slipway combines the best ideas from existing tools:

### From Kamal (37signals)

| Principle              | How Slipway Applies                             |
| ---------------------- | ----------------------------------------------- |
| **Transparency**       | Show users the actual Docker commands being run |
| **No Agents**          | Direct Docker, minimal server footprint         |
| **Single Config File** | `.slipway.json` for project linking             |
| **Zero-Downtime**      | Caddy-based blue-green deployments              |

### From Dokku

| Principle               | How Slipway Applies                       |
| ----------------------- | ----------------------------------------- |
| **Git Push Deploy**     | Support git push alongside CLI deploy     |
| **Service Linking**     | Creating a service auto-sets DATABASE_URL |
| **Plugin Architecture** | Extensible service system                 |

## The Comparison

| Feature                | Coolify | Dokku     | Kamal       | Slipway           |
| ---------------------- | ------- | --------- | ----------- | ----------------- |
| **Focus**              | Generic | Generic   | Rails-first | Sails-native      |
| **Web Dashboard**      | Yes     | Pro only  | No          | Yes               |
| **CLI**                | Basic   | Excellent | Excellent   | Excellent         |
| **Git Push Deploy**    | Yes     | Yes       | No          | Yes               |
| **Service Linking**    | Manual  | Auto      | Manual      | Auto              |
| **Admin Panel**        | No      | No        | No          | Built-in (Bridge) |
| **Framework REPL**     | No      | No        | `exec` only | Sails Helm        |
| **Monitoring**         | Basic   | No        | No          | Lookout           |
| **Queue Dashboard**    | No      | No        | No          | Quest integration |
| **Transparent Docker** | Hidden  | Hidden    | Yes         | Yes               |

## Slipway-specific behavior

### 1. Sails-native behavior

Slipway understands Sails applications:

- Auto-detects `config/models.js`, `config/datastores.js`, `api/models/`
- Knows about Sails lifecycle, hooks, and policies
- Integrates with Sails Quest for job queues
- Provides a REPL with direct model and helper access

### 2. Integrated tooling

Instead of piecing together separate tools:

- Deploy tool (Coolify)
- Admin panel (AdminJS)
- REPL (custom scripts)
- Queue monitor (custom dashboard)

You get one platform for these tasks instead of separate products.

### 3. Lightweight

| Component      | Memory     |
| -------------- | ---------- |
| Slipway Server | ~80MB      |
| Caddy Proxy    | ~40MB      |
| **Total**      | **~120MB** |

Compare to Coolify's ~800MB-1GB footprint.

### 4. Dashboard features

- Dark mode first
- Keyboard shortcuts everywhere
- Command palette (Cmd+K)

## Summary

Slipway groups deployment, admin access, REPL access, service management, and Quest monitoring into one Sails-focused platform.
