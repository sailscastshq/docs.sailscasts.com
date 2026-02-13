---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Requirements
titleTemplate: Slipway
description: System requirements for running Slipway on your VPS or server.
prev:
  text: Philosophy & Architecture
  link: /slipway/philosophy-and-architecture
next:
  text: Server Installation
  link: /slipway/server-installation
editLink: true
---

# Requirements

Before installing Slipway, make sure your server meets these requirements.

## Server Requirements

### Minimum

| Requirement | Specification                                       |
| ----------- | --------------------------------------------------- |
| CPU         | 1 core                                              |
| RAM         | 1GB                                                 |
| Disk        | 10GB                                                |
| OS          | Ubuntu 20.04+, Debian 11+, or any Linux with Docker |

### Recommended

| Requirement | Specification    |
| ----------- | ---------------- |
| CPU         | 2+ cores         |
| RAM         | 4GB+             |
| Disk        | 50GB+ SSD        |
| OS          | Ubuntu 22.04 LTS |

## Software Requirements

Slipway's install script will automatically install Docker if it's not already present. However, if you prefer to set things up manually:

| Software       | Version | Notes                             |
| -------------- | ------- | --------------------------------- |
| Docker         | 20.10+  | Required for container management |
| Docker Compose | v2+     | Included with Docker Desktop      |

## Network Requirements

| Port | Purpose                                  | Required    |
| ---- | ---------------------------------------- | ----------- |
| 80   | HTTP traffic                             | Yes         |
| 443  | HTTPS traffic                            | Yes         |
| 1337 | Slipway dashboard (before custom domain) | Yes         |
| 22   | SSH access                               | Recommended |

Make sure these ports are open in your firewall/security group.

## CLI Requirements

To use the Slipway CLI on your local machine:

| Software | Version | Notes              |
| -------- | ------- | ------------------ |
| Node.js  | 22+     | Required for CLI   |
| npm      | 10+     | Comes with Node.js |

The CLI has **zero npm dependencies** — it uses only Node.js built-ins.

## Supported Platforms

### VPS Providers (Tested)

- [Hetzner Cloud](https://www.hetzner.com/cloud/) (Recommended — great performance/price ratio)
- [DigitalOcean Droplets](https://www.digitalocean.com/products/droplets)
- [Linode](https://www.linode.com/)
- [Vultr](https://www.vultr.com/)
- AWS EC2
- Google Cloud Compute Engine

::: tip Getting a VPS
If you're new to self-hosting, we recommend starting with a [Hetzner Cloud](https://www.hetzner.com/cloud/) server. Their CX22 plan (2 vCPU, 4GB RAM, 40GB SSD) is an excellent starting point for running Slipway and a few applications.
:::

### Other Platforms

Slipway should work on any Linux server with Docker support. If you encounter issues on a specific platform, please [open an issue](https://github.com/sailscastshq/slipway/issues).

## What's Next?

Once you've confirmed your server meets these requirements, proceed to [Server Installation](/slipway/server-installation).
