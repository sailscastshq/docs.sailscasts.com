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

| Port      | Purpose                                    | Required                      |
| --------- | ------------------------------------------ | ----------------------------- |
| 80        | HTTP traffic and certificate provisioning  | Yes in the default mode       |
| 443       | HTTPS traffic                              | Yes in the default mode       |
| 1337      | Slipway dashboard loopback binding         | No public access              |
| 1338–1500 | Optional direct application `IP:port` URLs | Only after explicitly enabled |
| 22        | SSH access                                 | Recommended                   |

Public bindings may need to be allowed at two separate network boundaries:

1. **The host firewall** running on the server, such as UFW or firewalld. The installer aligns Slipway's public bindings when either firewall is already active. It does not enable a firewall or change SSH rules.
2. **The provider firewall or security group** managed by Hetzner, DigitalOcean, AWS, or your VPS provider. Slipway cannot change these rules, so you must configure them in your provider's control panel.

Fresh installations expose only Caddy on ports `80` and `443`. The dashboard
and deployed applications bind to `127.0.0.1`, which means they are reachable
from the server itself but not directly from the internet. Open `1338–1500`
only after explicitly enabling raw `IP:port` access. Cloudflare Tunnel mode can
keep every Slipway origin port private. See [Ingress and Firewall](/slipway/ingress-and-firewall)
for each supported mode.

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
