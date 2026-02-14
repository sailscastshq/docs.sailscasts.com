---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Commands Reference
titleTemplate: Slipway
description: Complete reference for all Slipway CLI commands.
prev:
  text: Authentication
  link: /slipway/cli-authentication
next:
  text: Creating Projects
  link: /slipway/creating-projects
editLink: true
---

# Commands Reference

Complete reference for all Slipway CLI commands.

## Command Pattern

Most commands operate on the project linked in the current directory (via `.slipway.json` created by `slipway init` or `slipway link`).

```bash
slipway <command> [options]
slipway <resource>:<action> [target] [options]
```

## Authentication

### login

Authenticate with a Slipway server. Opens your browser for login, then polls for confirmation.

```bash
slipway login [--server <url>]
```

The server URL can also be set via the `SLIPWAY_SERVER` environment variable. Credentials are stored in `~/.slipway/config.json`.

### logout

Remove saved credentials.

```bash
slipway logout
```

### whoami

Show current authentication status — email, name, team, role, and server.

```bash
slipway whoami
```

## Projects

### init

Initialize a new Slipway project in the current directory. Creates the project on the server and saves a `.slipway.json` config file locally.

```bash
slipway init [--name <name>]
```

Checks for a Dockerfile and warns if missing. Auto-detects the project name from `package.json` or the directory name.

### link

Link the current directory to an existing Slipway project.

```bash
slipway link <project-slug>
```

Use this when the project already exists (e.g., created via the dashboard) and you want to deploy from a different machine.

### projects

List all projects.

```bash
slipway projects
```

Shows name, slug, environment count, and last updated date.

### project:update

Update a project's details.

```bash
slipway project:update <slug> [--name <name>] [--description <desc>] [--repo <url>]
```

## Environments

### environments

List environments for the current project.

```bash
slipway environments
```

Shows name, slug, type (production/staging), domain, app status, and created date.

### environment:create

Create a new environment.

```bash
slipway environment:create <name> [--production] [--domain <domain>]
```

### environment:update

Update an environment's settings.

```bash
slipway environment:update <slug> [--name <name>] [--domain <domain>] [--production]
```

## Deployments

### slide

Deploy your application. This is the **primary deploy command**.

```bash
slipway slide [--env <environment>] [--app <slug>] [--message <message>]
```

Aliases: `deploy`, `launch`

Packages your source code (via `git archive` if in a git repo), pushes it to the server, and triggers a deployment. Watches the deployment via Server-Sent Events with live status updates.

**Options:**

| Option      | Description                                                                                                |
| ----------- | ---------------------------------------------------------------------------------------------------------- |
| `--env`     | Environment to deploy to (default: production)                                                             |
| `--app`     | Target a specific app by slug (default: the default app). See [Multi-App Environments](/slipway/multi-app) |
| `--message` | Deployment message/note                                                                                    |

**Examples:**

```bash
# Deploy to production
slipway slide

# Deploy to staging
slipway slide --env staging

# Deploy with a message
slipway slide --message "Fix login bug"

# Deploy a specific app in a multi-app environment
slipway slide --app api
```

### push

Push source code to the server **without** deploying.

```bash
slipway push [--env <environment>]
```

Useful when you want to upload code separately from triggering a deployment.

### deployments

List recent deployments.

```bash
slipway deployments [--env <environment>] [--limit <n>]
```

Shows deployment ID, status, environment, branch, commit hash, and date. Default limit is 10.

### logs

View deployment or application logs.

```bash
slipway logs [--env <environment>] [--app <slug>] [--follow] [--tail <n>] [--deployment <id>]
```

**Options:**

| Option         | Description                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| `--env`        | Environment (default: production)                                                                          |
| `--app`        | Target a specific app by slug (default: the default app). See [Multi-App Environments](/slipway/multi-app) |
| `--follow`     | Stream logs in real-time                                                                                   |
| `--tail`       | Number of lines to show (default: 100)                                                                     |
| `--deployment` | View logs for a specific deployment                                                                        |

## Environment Variables

### env

List environment variables for the current project.

```bash
slipway env [--env <environment>]
```

Sensitive values (containing PASSWORD, SECRET, KEY, TOKEN, etc.) are automatically masked.

### env:set

Set one or more environment variables.

```bash
slipway env:set KEY=value [KEY2=value2...] [--env <environment>]
```

**Examples:**

```bash
slipway env:set DATABASE_URL=postgres://...
slipway env:set STRIPE_KEY=sk_live_... SESSION_SECRET=abc123 --env staging
```

::: tip Redeploy Required
Changes take effect on the next deployment. Run `slipway slide` after setting variables.
:::

### env:unset

Remove one or more environment variables.

```bash
slipway env:unset KEY1 [KEY2...] [--env <environment>]
```

## Database Services

### db:create

Create a new database service.

```bash
slipway db:create <name> [--type <type>] [--version <version>] [--env <environment>]
```

**Options:**

| Option      | Description                                                         |
| ----------- | ------------------------------------------------------------------- |
| `--type`    | Database type: `postgresql`, `mysql`, `redis` (default: postgresql) |
| `--version` | Database version (default: latest)                                  |
| `--env`     | Environment (default: production)                                   |

The connection URL (e.g., `DATABASE_URL`) is automatically injected into your environment.

### db:url

Get the connection URL for a database service.

```bash
slipway db:url <name> [--env <environment>]
```

### services

List all services for the current project.

```bash
slipway services [--env <environment>]
```

Shows name, type, version, environment, and status.

## Backups

### backup:create

Create a manual database backup.

```bash
slipway backup:create <service-name> [--env <environment>]
```

### backup:list

List backups for a service.

```bash
slipway backup:list <service-name> [--env <environment>]
```

Shows backup ID, status, type, size, duration, and date.

### backup:restore

Restore a database from a backup.

```bash
slipway backup:restore <backup-id>
```

## Container Access

### terminal

Open a terminal session in the running container.

```bash
slipway terminal [--env <environment>] [--app <slug>]
```

Shows the container name and `docker exec` command to run on your server. Use `--app` to target a specific app in [multi-app environments](/slipway/multi-app).

### run

Run a command in the running container.

```bash
slipway run <command...> [--env <environment>] [--app <slug>]
```

Shows the container name and `docker exec` command. Use `--app` to target a specific app in [multi-app environments](/slipway/multi-app).

## Administration

### audit-log

View audit log entries.

```bash
slipway audit-log [--page <n>] [--limit <n>]
```

Shows date, action, resource type, user, and IP address. Default limit is 20.

## Global Options

These options work with all commands:

| Option           | Description        |
| ---------------- | ------------------ |
| `--server <url>` | Slipway server URL |
| `--help`         | Show help          |
| `--version`      | Show version       |
