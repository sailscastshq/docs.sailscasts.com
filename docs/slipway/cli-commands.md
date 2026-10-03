---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Commands Reference
titleTemplate: Slipway
description: Complete reference for all Slipway CLI commands.
prev:
  text: CLI Workflow
  link: /slipway/cli
next:
  text: Creating Projects
  link: /slipway/creating-projects
editLink: true
---

# Commands Reference

Use this reference after the [CLI workflow](/slipway/cli). Use `slipway --help` to list commands on your installed CLI. The current dispatcher handles help and version globally even when invoked after a command; the reference below follows the registered source contract.

Most commands require saved credentials and a linked `.slipway.json` project. `--env` selects an environment; it does not select a server. `--project` is currently limited to the next `logs` and `run` commands. `--server` belongs to `login` only.

::: info Release compatibility
This reference describes the inspected CLI source. The npm CLI version and server version are independent. Live app logs, remote command execution, and their machine flags below require the **unreleased next CLI and server**, beyond server v0.0.86. Earlier app `logs`, `run`, and `terminal` print Docker instructions. See [Updates](/slipway/updates#release-compatibility).
:::

Global flags are `--help` (`-h`) and `--version` (`-v`). Flags listed below are command-specific.

## Authentication

### login

Authenticate with your Slipway server.

```bash
slipway login [--server <server>]
```

### logout

Clear stored credentials.

```bash
slipway logout
```

### whoami

Show current authenticated user.

```bash
slipway whoami
```

Displays saved identity; it does not check the credential against the server.

## Projects

### projects

List all projects.

```bash
slipway projects
```

### project:update

Update a project.

```bash
slipway project:update <slug> [--name <name>] [--description <description>] [--repo <repo>]
```

### init

Initialize a new Slipway project.

```bash
slipway init [--name <name>]
```

### link

Link current directory to an existing project.

```bash
slipway link <project>
```

## Environments

### environments

List environments for the current project.

```bash
slipway environments
```

### environment:create

Create a new environment.

```bash
slipway environment:create <name> [--production] [--domain <domain>] [--from <from>]
```

### environment:update

Update an environment.

```bash
slipway environment:update <slug> [--name <name>] [--domain <domain>] [--production]
```

## Deployments

### push

Push source code without deploying.

```bash
slipway push
```

Uploads source only; there is no `--env` option. In a Git repository, packages committed HEAD.

### slide

Push and deploy the current project.

```bash
slipway slide [--env <env>] [--app <app>] [--message <message>]
```

Aliases: `deploy`, `launch`. Watches the deployment; verify the final state and app health.

`--env` defaults to `production`.

### readiness

Inspect server-owned deployment readiness for the current source.

```bash
slipway readiness [--env <env>] [--app <app>] [--json]
```

Required readiness failures produce a nonzero exit. Recommendations do not block deployment.

`--env` defaults to `production`.

### deployments

List recent deployments.

```bash
slipway deployments [--env <env>] [--limit <limit>]
```

`--limit` defaults to `10`.

## Variables

### env

List environment variables.

```bash
slipway env [--env <env>]
```

Masks values using name-based heuristics. Review output before sharing it.

`--env` defaults to `production`.

### env:set

Set environment variables (KEY=value).

```bash
slipway env:set <pairs...> [--env <env>]
```

`--env` defaults to `production`.

### env:unset

Remove environment variables.

```bash
slipway env:unset <keys...> [--env <env>]
```

`--env` defaults to `production`.

## Services

### services

List all services.

```bash
slipway services [--env <env>]
```

### db:create

Create a new database service.

```bash
slipway db:create <name> [--type <type>] [--env <env>]
```

`--type` defaults to `postgresql`. `--env` defaults to `production`. The registered `--version` option is intercepted by the current global dispatcher; select a specific database version in the dashboard instead.

### db:url

Get database connection URL.

```bash
slipway db:url <name> [--env <env>]
```

Prints a credential-bearing connection URL; keep output private.

`--env` defaults to `production`.

### service:review

Review a private custom image before creation.

```bash
slipway service:review <image> [--env <env>] [--name <name>] [--port <port>] [--app <app>] [--definition <definition>] [--json]
```

Returns a redacted review. Protect local definition files containing credentials.

`--env` defaults to `production`.

### service:create

Create exactly the previously reviewed custom service.

```bash
slipway service:create <review-id>
```

Creates the previously reviewed service; review again after a definition change.

## Backups

### backup:create

Create a manual database backup.

```bash
slipway backup:create <service-name> [--env <env>]
```

`--env` defaults to `production`.

### backup:list

List backups for a database service.

```bash
slipway backup:list <service-name> [--env <env>]
```

`--env` defaults to `production`.

### backup:restore

Restore a database backup.

```bash
slipway backup:restore <backup-id> [--writes-paused]
```

Requires `--writes-paused`. Polls the restore operation; keep writers paused until the database is verified.

`--writes-paused` defaults to `False`.

## Administration

### audit-log

View audit log entries.

```bash
slipway audit-log [--page <page>] [--limit <limit>]
```

`--page` defaults to `1`. `--limit` defaults to `20`.

## Logs and command execution (unreleased)

### logs

```bash
slipway logs [--project <slug>] [--env <slug>] [--app <slug>] [--tail <n>] [--follow] [--deployment <id>] [--json] [--ndjson]
```

Environment defaults to `production`; tail defaults to 100 and accepts 0–10000. Short forms: `-p`, `-e`, `-a`, `-n`, `-f`, `-d`. Use one of JSON or NDJSON; following requires human output or NDJSON. `--deployment` reads stored build and deploy logs for an actual deployment ID.

### run

```bash
slipway run [<command...>] [--project <slug>] [--env <slug>] [--app <slug>] [--stdin] [--file <path>] [--write-arm-file <path>] [--json] [--ndjson]
```

Environment defaults to `production`. Short targeting forms: `-p`, `-e`, `-a`. Provide one command source: positionals, stdin, or a file. The command source is bounded to 128 KiB. Every production command requires a valid exact-command/deployment arm; this CLI cannot create one.

Read the [workflow](/slipway/cli#wait-for-an-outcome) for completion receipts, structured errors, exit codes, and unconfirmed interruptions. There is no automatic replay, idempotency option, execution lookup, resume, or cancel command.

### terminal

```bash
slipway terminal [--env <slug>] [--app <slug>]
```

This command **does not open an interactive session**. It looks up the container and prints a Docker instruction to use on the server. Do not treat it as a working remote terminal.

## Operations outside the CLI

Use the dashboard for app lifecycle controls, rollback, team management, and tool-specific Dock and Quest operations. A command name is available only when it appears in your installed CLI help. Deployment `--dry-run`, `--no-cache`, `--canary`, global `--server`, profiles, and `doctor` are not supported by this contract.
