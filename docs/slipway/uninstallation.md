---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Uninstallation
titleTemplate: Slipway
description: Completely remove Slipway from your server.
prev:
  text: Your First Deploy
  link: /slipway/first-deploy
editLink: true
---

# Uninstallation

Completely remove Slipway from your server.

::: warning Deployed Apps Keep Running
Uninstalling Slipway does **not** stop or remove your deployed applications. They will continue running as standalone Docker containers. See [Cleaning Up Deployed Apps](#cleaning-up-deployed-apps) below if you want to remove those too.
:::

## Step 1: Stop and Remove Containers

Stop the Slipway dashboard and Caddy reverse proxy:

```bash
docker rm -f slipway slipway-proxy
```

## Step 2: Remove Docker Volumes

Remove the database and certificate volumes:

```bash
docker volume rm slipway-db slipway-certs
```

::: danger Data Loss
This permanently deletes your Slipway database (projects, deployments, settings) and SSL certificates. Make sure you have any data you need before proceeding.
:::

## Step 3: Remove Docker Network

Remove the Slipway network:

```bash
docker network rm slipway
```

::: tip
This will fail if any deployed app containers are still connected to the network. Stop those containers first, or see [Cleaning Up Deployed Apps](#cleaning-up-deployed-apps) below.
:::

## Step 4: Remove Secrets File

Remove the secrets file created during installation:

```bash
sudo rm -rf /etc/slipway
```

## Step 5: Remove Docker Images

Remove the Slipway and Caddy images:

```bash
docker rmi ghcr.io/sailscastshq/slipway:latest
docker rmi lucaslorentz/caddy-docker-proxy:latest
```

## Cleaning Up Deployed Apps

If you also want to remove all applications that were deployed through Slipway:

### 1. List Slipway-managed Containers

```bash
docker ps -a --filter "network=slipway" --format "{{.Names}}"
```

### 2. Stop and Remove App Containers

```bash
# Remove a specific app
docker rm -f <container-name>

# Or remove all containers on the slipway network
docker ps -a --filter "network=slipway" -q | xargs -r docker rm -f
```

### 3. Remove App Volumes and Images

```bash
# List and remove volumes for your apps
docker volume ls | grep <app-name>
docker volume rm <volume-name>

# Remove unused images
docker image prune -a
```

## Verify Clean Removal

Confirm everything has been removed:

```bash
# Should return nothing Slipway-related
docker ps -a | grep slipway
docker volume ls | grep slipway
docker network ls | grep slipway
```
