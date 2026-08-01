---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Ingress and Firewall
titleTemplate: Slipway
description: Understand Slipway's public Caddy, raw IP access, and optional Cloudflare Tunnel modes.
prev:
  text: Instance URL
  link: /slipway/instance-url
next:
  text: Custom Domain & SSL
  link: /slipway/custom-domain
editLink: true
---

# Ingress and Firewall

Slipway has one default public traffic path:

```text
Internet → Caddy (80/443) → Slipway dashboard or app container
```

Fresh installations publish only Caddy. The dashboard binds to
`127.0.0.1:1337`, deployed apps bind to loopback ports in `1338–1500`, and
Caddy reaches them over the private `slipway` Docker network.

## What loopback means

`127.0.0.1` is the server's loopback interface: a service bound there accepts
connections originating on that same server only. It is not the server's
public IP and it is not a private LAN address.

If you open `127.0.0.1` on your laptop, it refers to your laptop—not the VPS.
This is why Slipway can keep internal ports available to Caddy and health
checks without exposing those ports to the internet.

## Default public VPS mode

| Port        | Default binding      | Purpose                               |
| ----------- | -------------------- | ------------------------------------- |
| `22`        | Provider/host choice | SSH; Slipway does not change it       |
| `80`        | `0.0.0.0`            | Caddy HTTP and certificate challenges |
| `443`       | `0.0.0.0`            | Caddy HTTPS                           |
| `1337`      | `127.0.0.1`          | Slipway dashboard behind Caddy        |
| `1338–1500` | `127.0.0.1`          | App containers behind Caddy           |

The installer aligns active UFW or firewalld rules with these bindings. It
does not enable a firewall or change SSH policy. At the VPS provider, allow
inbound TCP `80` and `443`, retain your chosen SSH rule, and deny the rest.

Inspect the effective bindings:

```bash
sudo docker ps --format 'table {{.Names}}\t{{.Ports}}'
sudo ss -lntp
```

`slipway-proxy` should show public `80` and `443`. The `slipway` dashboard and
deployed apps should show `127.0.0.1` bindings.

## Headless or private-network dashboard access

Headless describes how the server is operated, not how its ports must be
published. From another machine on the same network, first open:

```text
http://SERVER_IP
```

This is the recommended path. The browser reaches Caddy on port `80`, and
Caddy reaches the private dashboard over Docker. Dashboard port `1337` does not
need to be public.

If your network design specifically requires direct `http://SERVER_IP:1337`
access, opt in to publishing only that port:

```bash
curl -fsSL https://raw.githubusercontent.com/sailscastshq/slipway/main/install.sh -o /tmp/install-slipway.sh
sudo env SLIPWAY_DASHBOARD_HOST=0.0.0.0 bash /tmp/install-slipway.sh
```

This does not publish deployed-app ports. The installer persists the setting
in `/etc/slipway/.env`, and future installer runs keep it until changed.

Direct port `1337` bypasses Caddy and its TLS termination. Limit inbound TCP
`1337` to the trusted LAN or VPN CIDR in both the host firewall and the VPS
provider firewall. Avoid exposing it to the public internet.

To return the dashboard to the Caddy-only path:

```bash
sudo env SLIPWAY_DASHBOARD_HOST=127.0.0.1 bash /tmp/install-slipway.sh
```

## Explicit raw IP and port access

Direct `http://SERVER_IP:PORT` URLs can help when diagnosing a deployment
without DNS, but they bypass Caddy TLS and enlarge the public attack surface.
Enable them deliberately:

```bash
curl -fsSL https://raw.githubusercontent.com/sailscastshq/slipway/main/install.sh -o /tmp/install-slipway.sh
sudo env SLIPWAY_APP_PORT_HOST=0.0.0.0 bash /tmp/install-slipway.sh
```

`SLIPWAY_APP_PORT_HOST` controls the deployed-app range independently from
`SLIPWAY_DASHBOARD_HOST`. Do not set it merely to reach the Slipway dashboard.

Redeploy the app so Docker recreates its binding, then allow TCP `1338–1500`
in the provider firewall. Verify from another network:

```bash
curl -I --connect-timeout 5 http://SERVER_IP:ALLOCATED_PORT/health
```

Return to private app ports by rerunning the installer with
`SLIPWAY_APP_PORT_HOST=127.0.0.1`, redeploying existing apps, and closing the
range in the provider firewall.

## Upgrading an older installation

The first upgraded installer preserves missing dashboard and app host settings
as public. This prevents a security release from silently breaking an existing
raw URL. Harden the host explicitly when you are ready:

```bash
curl -fsSL https://raw.githubusercontent.com/sailscastshq/slipway/main/install.sh -o /tmp/install-slipway.sh
sudo env \
  SLIPWAY_DASHBOARD_HOST=127.0.0.1 \
  SLIPWAY_APP_PORT_HOST=127.0.0.1 \
  bash /tmp/install-slipway.sh
```

Redeploy existing apps, then remove `1337` and `1338–1500` from the provider
firewall. Existing app containers keep their previous Docker binding until
they are replaced.

## Optional Cloudflare Tunnel mode

Tunnel mode changes the path to:

```text
Internet → Cloudflare → outbound cloudflared tunnel → loopback Caddy → container
```

Install with a real dashboard hostname:

```bash
curl -fsSL https://raw.githubusercontent.com/sailscastshq/slipway/main/install.sh -o /tmp/install-slipway.sh
sudo env \
  SLIPWAY_INGRESS=cloudflare-tunnel \
  SLIPWAY_URL=https://slipway.example.com \
  bash /tmp/install-slipway.sh
```

This binds Caddy, the dashboard, and app ports to loopback. Point the tunnel at
`http://127.0.0.1:80` and preserve the incoming hostname so Caddy can choose the
correct Slipway route:

```yaml
tunnel: YOUR_TUNNEL_UUID
credentials-file: /etc/cloudflared/YOUR_TUNNEL_UUID.json

ingress:
  - hostname: slipway.example.com
    service: http://127.0.0.1:80
  - hostname: '*.apps.example.com'
    service: http://127.0.0.1:80
  - service: http_status:404
```

Do not set `httpHostHeader`. Add each custom app domain as a tunnel public
hostname, or use a wildcard for the generated app domain. Webhooks, SSE,
telemetry, and CLI requests use the same HTTP route.

Cloudflare Tunnel makes outbound connections, so the provider firewall can
deny all inbound Slipway ports. Restrictive egress firewalls must permit
Cloudflare Tunnel on TCP/UDP `7844`. See Cloudflare's
[tunnel firewall guide](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/tunnel-with-firewall/)
and [ingress configuration reference](https://developers.cloudflare.com/tunnel/advanced/local-management/configuration-file/).
Tunnel mode adds Cloudflare as an availability and DNS dependency; default
public VPS mode has fewer moving parts and remains the recommended starting
point.
