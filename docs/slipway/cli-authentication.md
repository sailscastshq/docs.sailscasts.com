---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: CLI Authentication
titleTemplate: Slipway
description: Authenticate the Slipway CLI with your Slipway server.
prev:
  text: CLI Installation
  link: /slipway/cli-installation
next:
  text: Commands Reference
  link: /slipway/cli-commands
editLink: true
---

# CLI Authentication

Before you can deploy applications, you need to authenticate the CLI with your Slipway server.

## Login

Run the login command:

```bash
slipway login
```

### Server URL

You'll be prompted for your Slipway server URL:

```
$ slipway login

  Slipway CLI

  Server URL: http://203.0.113.50:1337
```

The CLI looks for the server URL in this order:

1. `--server` flag (e.g., `slipway login --server http://...`)
2. `SLIPWAY_SERVER` environment variable
3. Previously saved server URL
4. Prompt the user

### Browser Authentication

After entering the server URL, your browser will open to complete authentication:

```
  Opening browser for authentication...

  If the browser doesn't open, visit:
  http://203.0.113.50:1337/cli/authorize?code=abc123

  Waiting for authorization...
```

In your browser:

1. Log in to Slipway (if not already logged in)
2. Review the CLI authorization request
3. Click **Authorize**

The CLI will detect the successful authorization:

```
  ✓ Authenticated as you@example.com
  ✓ Team: Acme Inc
  ✓ Credentials saved to ~/.slipway/credentials.json
```

## Environment Variable

For CI/CD or automation, set the server URL as an environment variable:

```bash
export SLIPWAY_SERVER=https://slipway.example.com
slipway login
```

This skips the server URL prompt.

## Credentials Storage

The CLI stores credentials in `~/.slipway/credentials.json`:

```json
{
  "server": "https://slipway.example.com",
  "token": "your-api-token",
  "email": "you@example.com",
  "team": "Acme Inc"
}
```

::: warning Security
Keep this file secure. It contains your authentication token which grants access to your Slipway server.
:::

## Check Current Session

Verify your authentication status:

```bash
slipway whoami
```

Output:

```
  Logged in as you@example.com
  Team: Acme Inc
  Server: https://slipway.example.com
```

## Logout

To remove saved credentials:

```bash
slipway logout
```

This removes the credentials file and logs you out.

## Multiple Servers

If you work with multiple Slipway servers (e.g., staging and production), you can specify the server for each command:

```bash
# Deploy to staging
slipway slide --server https://slipway-staging.example.com

# Deploy to production
slipway slide --server https://slipway.example.com
```

Or use environment variables:

```bash
# In your staging environment
export SLIPWAY_SERVER=https://slipway-staging.example.com

# In your production environment
export SLIPWAY_SERVER=https://slipway.example.com
```

## CI/CD Authentication

For automated deployments, use API tokens instead of browser authentication:

```bash
# Generate a token in the dashboard
# Settings → API Tokens → Generate

# Use in CI/CD
export SLIPWAY_TOKEN=your-api-token
export SLIPWAY_SERVER=https://slipway.example.com
slipway slide
```

::: info Coming Soon
API token authentication is coming in a future release.
:::

## Troubleshooting

### Browser Doesn't Open

If the browser doesn't open automatically, copy the authorization URL and open it manually:

```
If the browser doesn't open, visit:
http://203.0.113.50:1337/cli/authorize?code=abc123
```

### Authorization Timeout

If authorization times out, run `slipway login` again. The authorization code expires after a few minutes.

### Invalid Credentials

If you see "Invalid credentials" errors, try logging out and in again:

```bash
slipway logout
slipway login
```

## What's Next?

Now that you're authenticated, explore the [CLI Commands Reference](/slipway/cli-commands) to learn what you can do.
