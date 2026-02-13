---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Why Slipway?
titleTemplate: Slipway
description: Learn why Slipway is the best choice for deploying Sails.js applications compared to generic deployment platforms.
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

Developers building with Sails.js and The Boring JavaScript Stack have to cobble together multiple tools:

- **Coolify/Dokploy** for deployment (generic, not Sails-aware)
- **AdminJS/Forest Admin** for admin panels (separate setup, not integrated)
- **A REPL workaround** for production debugging (no elegant Tinkerwell equivalent)
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

**Sails developers deserve the same integrated experience.**

## What Slipway Provides

A **single, unified platform** that:

- Deploys Sails apps with one command
- Manages databases (PostgreSQL, MySQL, Redis)
- Provides a Sails-aware admin panel (like Nova)
- Offers a production REPL (like Tinkerwell)
- Monitors queues (Sails Quest integration)
- All with a **slick, modern dashboard** inspired by Linear and Resend

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

## What Makes Slipway Different

### 1. Sails-Native, Not Generic

Slipway **understands** Sails applications:

- Auto-detects `config/models.js`, `config/datastores.js`, `api/models/`
- Knows about Sails lifecycle, hooks, and policies
- Integrates with Sails Quest for job queues
- Provides a REPL where `await User.find()` just works

### 2. The Full Suite

Instead of piecing together separate tools:

- Deploy tool (Coolify)
- Admin panel (AdminJS)
- REPL (custom scripts)
- Queue monitor (custom dashboard)

You get one integrated platform where everything works together.

### 3. Lightweight

| Component      | Memory     |
| -------------- | ---------- |
| Slipway Server | ~80MB      |
| Caddy Proxy    | ~40MB      |
| **Total**      | **~120MB** |

Compare to Coolify's ~800MB-1GB footprint.

### 4. Beautiful Dashboard

Inspired by Linear and Resend:

- Dark mode first
- Keyboard shortcuts everywhere
- Command palette (Cmd+K)
- Clean, modern design

## The Bottom Line

If you're building with Sails.js, Slipway is purpose-built for you. No more cobbling together generic tools. No more separate setups for admin panels, REPLs, and queue monitoring.

**One platform. One command. Zero complexity.**
