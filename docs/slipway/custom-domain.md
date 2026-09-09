---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Custom Domain & SSL
titleTemplate: Slipway
description: Configure custom domains and automatic SSL certificates for your Slipway applications.
prev:
  text: Ingress and Firewall
  link: /slipway/ingress-and-firewall
next:
  text: Settings
  link: /slipway/settings
editLink: true
---

# Custom Domain & SSL

Slipway supports one custom hostname per **environment**. Routed apps in that
environment share the hostname and use their configured paths. Saving a new
hostname replaces the previous custom hostname. A generated hostname, when
configured, remains available as a fallback.

## Set an environment domain

Run these commands from the project directory linked to Slipway:

```bash
slipway link my-project
slipway environment:update production --domain app.example.com
```

In the dashboard, open the app's domain menu and choose **Custom domain**.
The hostname applies to its environment, not just that app.

Use a hostname only, without a scheme, port, or path. Deploy a routed app before
assigning its custom domain. Multiple custom hostnames, wildcard custom domains,
primary-domain selection, domain redirects, and certificate inspection commands
are not currently supported.

## Configure DNS and HTTPS

Create an A record pointing your hostname to the server's public IPv4 address.
Use an AAAA record only when the server is reachable over IPv6. For a subdomain,
a CNAME can instead point to a hostname that resolves to the same server.

Allow inbound TCP ports 80 and 443 for standard public Caddy ingress. Configure
the certificate email under **Settings → Instance**. Caddy requests and renews
certificates automatically when DNS and ingress permit it.

Saving verifies the proxy route; it does not prove public DNS propagation or
certificate issuance. Treat DNS and TLS as unverified until you check the public
hostname. Open its HTTPS URL and inspect the browser's certificate information.
If the connection fails, check DNS records, ingress/firewall rules, and certificate
issuance errors on your server before retrying. Do not assume a saved domain
means its certificate is ready.

For Cloudflare Tunnel or deliberate raw-port access, follow
[Ingress and Firewall](/slipway/ingress-and-firewall). Edge TLS and direct HTTP
access have different readiness requirements from standard Caddy ingress.

## Change or remove a domain

Replace the custom hostname with the same command:

```bash
slipway environment:update production --domain new.example.com
```

Remove it by passing an empty string:

```bash
slipway environment:update production --domain ""
```

The dashboard supports removal by clearing the hostname field and saving.
The environment then uses its generated hostname when configured. If no hostname
is configured, check the app's access link; raw-port access requires its explicit
ingress configuration and is not automatically public.

If the proxy cannot apply a domain change, the operation fails and attempts to
restore the previous route and domain. Follow the returned recovery instructions
before retrying if restoration also fails.

## Dashboard domain

The Slipway dashboard's own hostname is separate from an environment hostname.
Configure it in **Settings → Instance**, point DNS at the server, and verify its
HTTPS connection after saving.

## Troubleshooting

- **DNS does not resolve:** check the authoritative records and allow caches to expire.
- **TLS is not ready:** check DNS, ports 80/443, certificate email, and server issuance errors.
- **The hostname opens but the app fails:** check the app's deployment status and logs.

```bash
slipway deployments --env production
slipway logs --env production --follow
```

See [CLI Commands](/slipway/cli-commands) for supported commands.
