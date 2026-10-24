---
title: Decoys
titleTemplate: Slipway
description: Observe requests to deliberately unused paths without adding application instrumentation.
editLink: true
---

# Decoys

Decoys return a fixed inert response at selected unused paths and record the resulting signals in Lookout. They help you notice scanning; a hit is not proof of malicious intent, and Decoys are not a firewall or rate limiter.

## Enable deliberately

Decoys are off by default. A team owner or admin enables them in the app's settings after acknowledging that the exact effective paths are unused by the application. No app hook is required: Caddy handles the responses at the edge.

Slipway checks for conflicts with application routes and health paths. Review the effective path list before enabling it. Disable Decoys before changing mounts or introducing routes at those paths.

## What visitors receive

Selected paths respond to **GET** and **HEAD** with fixed JSON and HTTP 200, with `no-store` and `nosniff`. Other methods, paths and alternate encodings continue through normal routing. Decoys do not imitate a real leaked credential or expose application data.

If the route update fails, Slipway retains the previous configuration. Resolve the reported conflict rather than assuming the new settings took effect.

## Read the signals

Open **Lookout → Decoys**. The view groups sampled events by application, path, method and status over the last hour, bounded to 1,000 samples. The underlying events use the existing seven-day retention.

Decoy events are excluded from normal application request latency and success statistics. They do not collect query strings, request bodies, headers or IP addresses. Interpret them alongside other operational evidence, not as an identity or intrusion verdict.

See [Lookout](/slipway/lookout) for application telemetry.
