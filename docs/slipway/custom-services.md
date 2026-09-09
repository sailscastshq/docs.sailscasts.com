---
title: Custom Services
titleTemplate: Slipway
description: Run custom images with private connections, reviewed HTTP routes and stateless updates.
editLink: true
---

# Custom-image services

Custom images run one private container alongside an environment's existing services. Use them for a trusted container that needs a private endpoint or background process. PostgreSQL, MySQL, Redis and MongoDB keep their existing managed workflows; external PostgreSQL also remains available.

## Create and review

In an environment, open **Services → Add service → Custom image**. Enter an image with an explicit version tag or SHA-256 digest. Slipway suggests the service name. **Review** pulls and inspects the image, then shows the exact image ID, private port, data paths, resource limits, environment keys and selected apps. **Create** uses that saved definition. Going back and changing fields requires another review. Reviews expire after ten minutes and belong to the administrator who made them. Retrying the same review returns the same service.

The default is the image's startup command, its sole declared TCP port (when there is one), its declared volumes, 0.5 CPU and 256 MiB memory. Advanced fields allow an internal port, explicit environment variables, additional application data paths, startup/health command arguments and bounded resources. Command overrides replace Docker CMD and preserve the image ENTRYPOINT. Enter one argument per line; put secrets in environment variables, not commands.

Every declared data volume is tracked as a Slipway-owned named volume. Data paths must be absolute, non-overlapping application paths outside system directories. There is no host directory, Docker socket, published port, privileged mode, device, GPU, extra capability or host-namespace option. Images requiring those privileges are incompatible with this service type. Containers use `unless-stopped`, drop all capabilities, forbid privilege escalation and have a 256-process limit.

## Private connections

Select the apps that should receive `<SERVICE_NAME>_HOST` and `<SERVICE_NAME>_PORT`, with hyphens converted to underscores. For `private-search`, those are `PRIVATE_SEARCH_HOST` and `PRIVATE_SEARCH_PORT`. Slipway rejects collisions with existing app, environment or global variables. Only explicit service environment variables are supplied; project or app secrets are not inherited.

Connections can be changed from the service detail page. Redeploy affected apps to apply the change. Unlinking removes only variables still owned by this connection with their expected values, preserving unrelated and externally changed values. These links configure apps; they do not provide service authentication or network isolation between containers on Slipway's network. Configure the image's own authentication using explicit service variables and app credentials where required.

## Health, logs and lifecycle

Docker health checks report healthy, checking or unhealthy. A running image without a health check is **Unverified**. Refresh status reads Docker again; a missing container or repeated restart has an explanatory alert. Start/restart keeps the immutable image and saved definition. If the container is missing, Start recreates it using the same image ID and owned volumes. If that image is no longer available locally, creation fails safely instead of substituting a newer tag.

Environment values and saved definitions are encrypted in Slipway's database. Reviews, API responses and audit records omit the values. Values are supplied through a private temporary file (in shared memory on Linux), removed immediately after container creation, and exact occurrences of explicit service values are redacted in service logs. Images still control their own output; transformed or encoded credentials cannot be reliably identified. Docker administrators can inspect container environment values.

Removing a custom service uses Slipway's resumable cleanup. Data is retained by default; explicitly choosing purge removes its owned volumes. Container and volume ownership are checked before removal. A failed launch remains visible for diagnosis and cleanup.

Custom images have logs, private connections, health, start/stop/restart and removal. They do not gain Sails-specific Bridge, Helm, Quest or database schema tooling. Generic backup/restore is not available. Stateless image and configuration updates use the reviewed workflow below; persistent services remain excluded.

## Public HTTP access

Services stay private until an owner or administrator opens **Public HTTP access → Add public route** on the service page. Enter one hostname and the internal HTTP port, review the exact endpoint, then publish. This uses the existing Caddy ingress; it never binds a Docker host port. Publishing does not add authentication: configure access controls in the underlying service before exposing private data. Raw TCP/UDP ingress is not supported.

Reviews belong to the operator, expire after ten minutes, and become invalid when the service endpoint or saved route changes. Domains are claimed across service, app/environment and dashboard routes. A candidate route must be accepted by Caddy before the previous route is retired. Route acceptance, DNS propagation and TLS issuance remain distinct: the UI reports DNS/TLS as unverified and directs the operator to check the HTTPS URL. Cloudflare Tunnel keeps TLS at the existing edge boundary.

**Remove route** is also reviewed and returns the service to private networking without changing its volumes or app connections. A failed change restores the previous route when possible. If recovery cannot finish, the operation and both domain claims remain saved; **Recover previous route** retries recovery. After an interrupted process restart, the operation remains visible and recoverable. Do not manually delete candidate/previous route containers while recovery is pending. Service/environment/project cleanup removes these routing artifacts before removing service records and preserves data according to the chosen retention policy.

Publishing, removal, failure recovery and the initiating operator are recorded in the audit log. No DNS provider credentials or TLS guarantees are implied by a successful route review.

## Reviewed stateless updates

Open **Image and configuration → Update image**. Existing configuration is kept unless explicitly replaced. The review pins the image ID and shows resource changes, environment keys and whether startup/health commands changed. Values and command contents never appear in the review or audit trail. Replacing environment variables supplies the complete set: omitted variables are removed. Coordinate credential changes with the connected apps and external systems; Slipway does not rotate their credentials automatically.

The candidate runs separately with the same Docker restrictions, no host ports and no shared writable volume. It may contact external systems while its health check runs, so choose a check and startup command appropriate for that behavior. A Docker health check is required and must become healthy within 30 seconds. A running process alone is not readiness. An unhealthy candidate leaves the active service in place. Cutover briefly interrupts connections; it stops and disconnects the old container, switches the stable hostname, and checks the new container again. Existing app connection variables and public-route ports remain unchanged.

**Revert image** reviews the immediately previous image and configuration, including previous credentials, and runs the same candidate health checks. It does not restore external data or undo side effects. Previous stopped containers are tracked and retained until service removal; each update can consume additional disk space. After an interrupted cutover, **Recover previous image** restores the saved runtime. Other mutations stay blocked while recovery is pending. Cleanup explicitly includes active, candidate and retained containers and checks ownership before removing them.

Services with declared volumes or existing mounts cannot use automated updates, including when a new image introduces a volume. An application-consistent backup/restore contract is required before stateful updates can be supported. No generic live-volume copy, database migration rollback, zero-downtime promise or universal recovery is implied.

## Instance policy

Only team owners and administrators may create or change custom services. Docker Hub (`docker.io`) is the default allowed registry. An instance operator can configure `sails.config.custom.customServices` in server configuration:

```js
customServices: {
  registries: ['docker.io', 'ghcr.io'],
  // Optional exact reference allowlist; omit to allow images in those registries.
  images: ['ghcr.io/example/private-search:1.4'],
  maxCpus: 4,
  maxMemoryMiB: 4096
}
```

Registry credentials come from the Docker client's existing configuration. Slipway does not accept registry credentials in this form. Registry and image restrictions apply at review and start. Untagged images and `latest` are rejected.

## CLI

From a linked Slipway project:

```sh
slipway service:review example/private-search:1.4 --env production
slipway service:create <review-id>
```

Optional review flags are `--name`, `--port`, `--app` (comma-separated app IDs), `--definition` (a local JSON definition file) and `--json`. A definition file accepts `image`, `name`, `port`, `env`, `volumes`, `command`, `healthCommand`, `cpus`, `memoryMiB` and `appIds`. Protect files containing credentials; the CLI prints only the server's redacted review. Existing `slipway services` lists both managed and custom services.
