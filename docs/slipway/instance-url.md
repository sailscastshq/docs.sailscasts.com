---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Instance URL
titleTemplate: Slipway
description: Configure your Slipway instance URL for webhooks and external access.
prev:
  text: Configuration
  link: /slipway/configuration
next:
  text: Custom Domain & SSL
  link: /slipway/custom-domain
editLink: true
---

# Instance URL

The instance URL is the public address of your Slipway server. It's used for:

- GitHub webhooks (auto-deploy)
- CLI authentication
- Email links (password reset, etc.)
- API access

## Setting the Instance URL

### During Installation

The install script prompts for the URL, or you can set it via environment variable:

```bash
docker run -d \
  --name slipway \
  -e SLIPWAY_URL="https://slipway.yourdomain.com" \
  ...
```

### After Installation

Update via the dashboard:

1. Go to **Settings → Instance**
2. Enter your **Instance URL**
3. Click **Save**

Or update the Docker container:

```bash
docker stop slipway
docker rm slipway
docker run -d \
  --name slipway \
  -e SLIPWAY_URL="https://slipway.yourdomain.com" \
  ...
```

## URL Formats

### IP Address (Development)

```
http://203.0.113.50:1337
```

- No SSL
- Uses port number
- Fine for testing

### Domain with Port (Not Recommended)

```
http://slipway.example.com:1337
```

- No SSL
- Requires port in URL
- Not recommended for production

### Domain with SSL (Recommended)

```
https://slipway.example.com
```

- SSL enabled
- Standard HTTPS port (443)
- Professional appearance

## Verifying Your URL

### Check Current URL

```bash
slipway whoami
```

Output includes the server URL:

```
Logged in as admin@example.com
Server: https://slipway.example.com
```

### Test URL Accessibility

```bash
curl https://slipway.example.com/health
```

Expected response:

```json
{ "status": "healthy" }
```

## Common Issues

### URL Not Accessible

1. **Check DNS** points to your server:

   ```bash
   dig slipway.example.com
   ```

2. **Check firewall** allows traffic:
   - Port 80 (HTTP)
   - Port 443 (HTTPS)
   - Port 1337 (if using IP)

3. **Check Slipway is running**:
   ```bash
   docker ps | grep slipway
   ```

### Webhooks Failing

1. **Verify URL is public**:
   - GitHub must be able to reach your server
   - Can't use `localhost` or private IPs

2. **Check the URL in webhook settings**:
   - Must match exactly what's configured in Slipway
   - Must use HTTPS for GitHub webhooks

3. **Test with curl**:
   ```bash
   curl -X POST https://slipway.example.com/api/v1/webhook/github/test
   ```

### CLI Authentication Failing

1. **Check URL matches**:

   ```bash
   cat ~/.slipway/credentials.json
   ```

2. **Re-authenticate**:
   ```bash
   slipway logout
   slipway login --server https://slipway.example.com
   ```

## Changing the URL

When changing your instance URL:

### 1. Update DNS

Point the new domain to your server.

### 2. Update Slipway

```bash
docker stop slipway
docker rm slipway
docker run -d \
  --name slipway \
  -e SLIPWAY_URL="https://new-slipway.example.com" \
  ...
```

### 3. Update Webhooks

For each connected repository:

1. Go to GitHub → Settings → Webhooks
2. Update the payload URL

### 4. Re-authenticate CLI

```bash
slipway logout
slipway login --server https://new-slipway.example.com
```

## Multiple URLs (Not Supported)

Slipway uses a single instance URL. If you need multiple access points:

1. Use a load balancer in front of Slipway
2. All URLs should resolve to the same Slipway instance
3. Set `SLIPWAY_URL` to the primary/canonical URL

## What's Next?

- Set up a [Custom Domain](/slipway/custom-domain) with SSL
- Configure [Settings](/slipway/settings) for your team
- Set up [Auto-Deploy](/slipway/auto-deploy) with webhooks
