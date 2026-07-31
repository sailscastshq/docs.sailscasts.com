---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Server Installation
titleTemplate: Slipway
description: Install Slipway on your VPS with a single command.
prev:
  text: Requirements
  link: /slipway/requirements
next:
  text: Initial Setup
  link: /slipway/initial-setup
editLink: true
---

# Server Installation

Install Slipway on your VPS with a single command.

## One-Line Install

SSH into your server and run:

```bash
curl -fsSL https://raw.githubusercontent.com/sailscastshq/slipway/main/install.sh | bash
```

This script will:

1. Check for Docker (install if missing)
2. Create the `slipway` Docker network
3. Detect your server's public IP
4. Generate secrets (`SESSION_SECRET` and `DATA_ENCRYPTION_KEY`) and save them to `/etc/slipway/.env`
5. Start the Caddy reverse proxy
6. Pull and start the Slipway dashboard
7. Align active UFW or firewalld rules with the selected public bindings
8. Display your access URL

## What Gets Installed

| Component          | Purpose                                        |
| ------------------ | ---------------------------------------------- |
| **Caddy**          | Reverse proxy with automatic HTTPS             |
| **Slipway**        | The dashboard application                      |
| **Docker Network** | Isolated network for Slipway and deployed apps |

## Installation Output

After running the install script, you'll see something like:

```
Installing Slipway...

Docker already installed
Creating Docker network...
Network ready
Detecting server IP...
Generating secrets...
Configuration saved to /etc/slipway/.env
Server URL: http://203.0.113.50
Starting Caddy proxy...
Caddy proxy running
Pulling latest Slipway image...
Starting Slipway dashboard...
Slipway dashboard running

Waiting for Slipway to start...

========================================================
  Slipway installed successfully!
========================================================

  Dashboard: http://203.0.113.50
  Public ingress: TCP 80 and 443 through Caddy
  Direct app ports: private (set SLIPWAY_APP_PORT_HOST=0.0.0.0 to opt in)

  Next steps:
  1. Open the dashboard URL above to complete setup
  2. Point a domain to this server (e.g., slipway.yourdomain.com)
  3. SSL will be configured automatically when you add a domain

  To deploy apps, install the CLI:
    npm install -g slipway-cli
    slipway login --server http://203.0.113.50

========================================================
```

::: tip
The actual output uses colored text to highlight status messages. Green indicates success, yellow indicates warnings.
:::

## Accessing Slipway

After installation, access your Slipway dashboard at:

```
http://YOUR_SERVER_IP
```

::: info One public HTTP path
The request enters through Caddy on port 80. The Slipway dashboard listens on
`127.0.0.1:1337`, so it cannot be reached directly from another machine. For
production, [configure a custom domain](/slipway/custom-domain) to enable HTTPS.
:::

::: warning Provider Firewall
The installer can configure an active firewall on the server, but it cannot change a firewall or security group managed by your VPS provider. Allow the required ports in the provider's control panel too. See [Network Requirements](/slipway/requirements#network-requirements) for the complete port list.
:::

## Choose another ingress mode

The default is the smallest production setup: public Caddy, private dashboard,
and private app ports. Raw `IP:port` access and Cloudflare Tunnel are explicit
installer modes because they change the server's public boundary. Read
[Ingress and Firewall](/slipway/ingress-and-firewall) for the exact commands,
upgrade behavior, and verification steps.

## Troubleshooting

### Docker Permission Denied

If you see permission errors, add your user to the docker group:

```bash
sudo usermod -aG docker $USER
# Log out and back in for changes to take effect
```

### Port Already in Use

If port 80 or 443 is already in use:

```bash
# Find what's using the port
sudo lsof -i :80
sudo lsof -i :443

# Stop the conflicting service or change Slipway's port
```

### Container Won't Start

Check the logs:

```bash
docker logs slipway
docker logs slipway-proxy
```

## What's Next?

Once Slipway is installed, proceed to [Initial Setup](/slipway/initial-setup) to create your admin account and configure your instance.
