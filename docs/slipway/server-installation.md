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
7. Display your access URL

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
Server URL: http://203.0.113.50:1337
Generating secrets...
Secrets generated and saved to /etc/slipway/.env
Starting Caddy proxy...
Caddy proxy running
Pulling latest Slipway image...
Starting Slipway dashboard...
Slipway dashboard running

Waiting for Slipway to start...

========================================================
  Slipway installed successfully!
========================================================

  Dashboard: http://203.0.113.50:1337

  Next steps:
  1. Open the dashboard URL above to complete setup
  2. Point a domain to this server (e.g., slipway.yourdomain.com)
  3. SSL will be configured automatically when you add a domain

  To deploy apps, install the CLI:
    npm install -g slipway-cli
    slipway login --server http://203.0.113.50:1337

========================================================
```

::: tip
The actual output uses colored text to highlight status messages. Green indicates success, yellow indicates warnings.
:::

## Accessing Slipway

After installation, access your Slipway dashboard at:

```
http://YOUR_SERVER_IP:1337
```

::: warning Before Custom Domain
Until you configure a custom domain, Slipway runs on port 1337 with HTTP. For production use, you should [configure a custom domain](/slipway/custom-domain) to enable HTTPS.
:::

## Manual Installation

If you prefer to install manually or customize the setup:

### 1. Install Docker

```bash
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker
```

### 2. Create Network

```bash
docker network create slipway
```

### 3. Generate Secrets

```bash
SESSION_SECRET=$(openssl rand -hex 32)
DATA_ENCRYPTION_KEY=$(openssl rand -base64 32)

# Persist secrets for future updates
sudo mkdir -p /etc/slipway
echo "SESSION_SECRET=$SESSION_SECRET" | sudo tee /etc/slipway/.env
echo "DATA_ENCRYPTION_KEY=$DATA_ENCRYPTION_KEY" | sudo tee -a /etc/slipway/.env
sudo chmod 600 /etc/slipway/.env
```

### 4. Start Caddy

```bash
docker run -d \
  --name slipway-proxy \
  --network slipway \
  --restart unless-stopped \
  -p 80:80 \
  -p 443:443 \
  -p 1337:1337 \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -v slipway-certs:/data \
  -e CADDY_INGRESS_NETWORKS=slipway \
  lucaslorentz/caddy-docker-proxy:latest
```

### 5. Start Slipway

```bash
docker run -d \
  --name slipway \
  --network slipway \
  --restart unless-stopped \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v slipway-db:/app/db \
  -e NODE_ENV=production \
  -e PORT=1337 \
  -e SLIPWAY_URL="http://YOUR_SERVER_IP:1337" \
  -e SESSION_SECRET="$SESSION_SECRET" \
  -e DATA_ENCRYPTION_KEY="$DATA_ENCRYPTION_KEY" \
  -l "caddy=:1337" \
  ghcr.io/sailscastshq/slipway:latest
```

## Troubleshooting

### Docker Permission Denied

If you see permission errors, add your user to the docker group:

```bash
sudo usermod -aG docker $USER
# Log out and back in for changes to take effect
```

### Port Already in Use

If port 1337, 80, or 443 is already in use:

```bash
# Find what's using the port
sudo lsof -i :1337

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
