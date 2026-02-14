---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Custom Domain & SSL
titleTemplate: Slipway
description: Configure custom domains and automatic SSL certificates for your Slipway applications.
prev:
  text: Instance URL
  link: /slipway/instance-url
next:
  text: Settings
  link: /slipway/settings
editLink: true
---

# Custom Domain & SSL

Give your applications professional, branded URLs with automatic HTTPS.

## How It Works

Slipway uses **Caddy** as its reverse proxy, which provides:

- **Automatic HTTPS** via Let's Encrypt
- **Automatic certificate renewal**
- **HTTP/2 and HTTP/3 support**
- **WebSocket proxying** (critical for Sails real-time features)

When you add a domain, Caddy automatically:

1. Obtains an SSL certificate from Let's Encrypt
2. Configures HTTPS redirection
3. Sets up the reverse proxy to your app

## Adding a Domain

### Via CLI

```bash
slipway domain:add myapp example.com
```

### Via Dashboard

1. Go to your project and select an environment
2. Click the app name from the Apps list to go to the app detail page
3. Click the ellipsis dropdown menu and select **Custom domain**
4. Enter your domain name
5. Click **Add**

## DNS Configuration

Before adding a domain in Slipway, configure your DNS:

### A Record (Recommended)

Point your domain directly to your Slipway server's IP:

| Type | Name | Value        | TTL |
| ---- | ---- | ------------ | --- |
| A    | @    | 203.0.113.50 | 300 |
| A    | www  | 203.0.113.50 | 300 |

### CNAME Record

If your DNS provider doesn't support A records at the apex, use a CNAME:

| Type  | Name | Value                  | TTL |
| ----- | ---- | ---------------------- | --- |
| CNAME | www  | slipway.yourdomain.com | 300 |

::: warning Root Domain CNAME
Most DNS providers don't allow CNAME records on the root domain (e.g., `example.com`). Use an A record for the root, or check if your provider supports CNAME flattening (Cloudflare calls this "CNAME at apex").
:::

## SSL Certificates

### Automatic Provisioning

SSL certificates are provisioned automatically when you add a domain. This typically takes 30-60 seconds.

```bash
$ slipway domain:add myapp example.com

Adding domain example.com to myapp...
✓ Domain added
✓ SSL certificate provisioned
✓ HTTPS enabled

Your app is now available at:
  https://example.com
```

### Certificate Status

Check certificate status:

```bash
slipway domain:info myapp example.com
```

Output:

```
Domain: example.com
App: myapp
SSL: ✓ Valid
  Issuer: Let's Encrypt
  Expires: 2024-04-20
  Auto-renew: Enabled
```

### Certificate Renewal

Certificates are renewed automatically 30 days before expiration. No action required.

### Troubleshooting SSL

If SSL provisioning fails:

1. **Verify DNS is correct**:

   ```bash
   dig example.com +short
   # Should return your server's IP
   ```

2. **Check port 80 is accessible**:
   Let's Encrypt validates via HTTP. Ensure port 80 is open.

3. **Wait for DNS propagation**:
   DNS changes can take up to 48 hours. Use [DNS Checker](https://dnschecker.org) to verify.

4. **Check rate limits**:
   Let's Encrypt has [rate limits](https://letsencrypt.org/docs/rate-limits/). If you've requested too many certificates, wait and try again.

## Multiple Domains

You can add multiple domains to a single app:

```bash
slipway domain:add myapp example.com
slipway domain:add myapp www.example.com
slipway domain:add myapp app.example.com
```

All domains will point to the same application.

### Primary Domain

The first domain added becomes the primary domain. To change it:

```bash
slipway domain:set-primary myapp www.example.com
```

## Subdomains

### Wildcard Subdomains

For apps that need dynamic subdomains (e.g., `tenant1.example.com`, `tenant2.example.com`):

```bash
slipway domain:add myapp "*.example.com"
```

::: warning DNS Wildcard Required
You'll need a wildcard DNS record:

| Type | Name | Value        |
| ---- | ---- | ------------ |
| A    | \*   | 203.0.113.50 |

:::

### Specific Subdomains

```bash
slipway domain:add myapp api.example.com
slipway domain:add myapp admin.example.com
```

## Removing Domains

```bash
slipway domain:remove myapp example.com
```

This removes the domain from routing but doesn't affect your DNS records. Update DNS separately.

## Domain Verification

For security, Slipway verifies domain ownership before provisioning SSL:

1. **DNS Verification** (automatic): Slipway checks if the domain points to your server
2. **HTTP Verification** (automatic): Let's Encrypt verifies via HTTP challenge

## Redirects

### WWW to Non-WWW

Redirect `www.example.com` to `example.com`:

```bash
slipway domain:redirect www.example.com example.com
```

### Non-WWW to WWW

Redirect `example.com` to `www.example.com`:

```bash
slipway domain:redirect example.com www.example.com
```

### Custom Redirects

For other redirects, use environment variables in your Sails app or configure in `config/routes.js`.

## Using Cloudflare

If you're using Cloudflare as a DNS proxy:

### Recommended Settings

1. **SSL/TLS Mode**: Set to **Full (Strict)**
   - Cloudflare → HTTPS → Your Server → HTTPS → App

2. **Disable Cloudflare Proxy Initially**:
   - Set DNS to "DNS only" (gray cloud) first
   - Once SSL is working, enable proxy (orange cloud)

3. **Page Rules**:
   - Create a rule to always use HTTPS

### Cloudflare + Slipway SSL

With Cloudflare proxy enabled, you get:

- Cloudflare's edge SSL (browser → Cloudflare)
- Slipway's origin SSL (Cloudflare → your server)

This is the most secure configuration.

## Slipway Dashboard Domain

To add a custom domain for the Slipway dashboard itself:

### 1. Add DNS Record

Point your domain to your Slipway server:

| Type | Name    | Value        |
| ---- | ------- | ------------ |
| A    | slipway | 203.0.113.50 |

### 2. Update Slipway Configuration

SSH into your server and update the Slipway container:

```bash
docker stop slipway

docker run -d \
  --name slipway \
  --network slipway \
  --restart unless-stopped \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v slipway-data:/app/data \
  -e NODE_ENV=production \
  -e PORT=1337 \
  -e SLIPWAY_URL="https://slipway.yourdomain.com" \
  -e SLIPWAY_SECRET=$SLIPWAY_SECRET \
  -l "caddy=slipway.yourdomain.com" \
  -l "caddy.reverse_proxy={{upstreams 1337}}" \
  ghcr.io/sailscastshq/slipway:latest
```

The Caddy labels tell the proxy to route `slipway.yourdomain.com` to the Slipway container.

### 3. Access via HTTPS

Your Slipway dashboard is now available at:

```
https://slipway.yourdomain.com
```

## Best Practices

### 1. Always Use HTTPS

Slipway enforces HTTPS by default. HTTP requests are automatically redirected.

### 2. Use Separate Domains for Environments

```
myapp.com           → production
staging.myapp.com   → staging
dev.myapp.com       → development
```

### 3. Set Up Both WWW and Non-WWW

Add both domains and set up a redirect:

```bash
slipway domain:add myapp example.com
slipway domain:add myapp www.example.com
slipway domain:redirect www.example.com example.com
```

### 4. Monitor Certificate Expiration

While auto-renewal should work, monitor your certificates:

```bash
slipway domain:list myapp
```

## Troubleshooting

### "Domain Not Resolving"

1. Check DNS propagation: https://dnschecker.org
2. Verify A record points to correct IP
3. Wait up to 48 hours for propagation

### "SSL Certificate Error"

1. Ensure port 80 is open (Let's Encrypt needs it)
2. Check rate limits if you've made many requests
3. Verify domain ownership

### "502 Bad Gateway"

1. Ensure your app is running: `slipway app:status myapp`
2. Check app logs: `slipway logs myapp`
3. Verify the app is listening on the correct port

### "Mixed Content Warnings"

If your browser shows mixed content warnings:

1. Ensure all assets use HTTPS URLs
2. Update hardcoded HTTP URLs in your code
3. Use protocol-relative URLs: `//example.com/asset.js`

## What's Next?

- Configure [Environment Variables](/slipway/environment-variables) for your domains
- Set up [Auto-Deploy](/slipway/auto-deploy) for continuous deployment
- Learn about [Database Services](/slipway/database-services) for your app
