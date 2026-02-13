---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Initial Setup
titleTemplate: Slipway
description: Configure your Slipway instance after installation.
prev:
  text: Server Installation
  link: /slipway/server-installation
next:
  text: Your First Deploy
  link: /slipway/first-deploy
editLink: true
---

# Initial Setup

After installing Slipway, you'll need to complete the initial setup to create your admin account and configure your instance.

## Access the Dashboard

Open your browser and navigate to:

```
http://YOUR_SERVER_IP:1337
```

You'll see the Slipway welcome screen.

## Create Your Admin Account

On first visit, you'll be prompted to create an admin account:

1. Enter your **email address**
2. Enter your **full name**
3. Create a **password**
4. Click **Create Account**

This account will have full administrative access to your Slipway instance.

## Your Team

After creating your account, Slipway automatically creates a team for you. You can customize your team name and settings later in the dashboard under **Settings → Team**.

Teams help you organize projects and manage access when you have multiple team members.

## Configure Instance URL (Optional)

By default, Slipway uses your server's IP address. For production use, you should configure a custom domain:

1. Go to **Settings** in the dashboard
2. Navigate to **Instance Settings**
3. Set your **Instance URL** (e.g., `https://slipway.yourdomain.com`)

::: tip
See [Custom Domain & SSL](/slipway/custom-domain) for detailed instructions on setting up a custom domain with automatic HTTPS.
:::

## Install the CLI

To deploy applications from your local machine, install the Slipway CLI:

```bash
npm install -g slipway
```

## Authenticate the CLI

Connect your CLI to your Slipway instance:

```bash
slipway login
```

You'll be prompted for:

1. **Server URL** — Your Slipway instance URL (e.g., `http://203.0.113.50:1337`)
2. **Browser Authentication** — Opens a browser window to authenticate

After authenticating in the browser, the CLI will save your credentials locally.

::: info Environment Variable
You can also set the `SLIPWAY_SERVER` environment variable to avoid entering the URL each time:

```bash
export SLIPWAY_SERVER=http://203.0.113.50:1337
slipway login
```

:::

## Verify Setup

Confirm everything is working:

```bash
# Check CLI connection
slipway whoami

# Should output your email and team name
```

## What's Next?

Your Slipway instance is ready. Now you can:

- [Deploy your first application](/slipway/first-deploy)
- [Configure a custom domain](/slipway/custom-domain)
- [Set up additional team members](/slipway/settings)
