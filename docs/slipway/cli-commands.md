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

Use this reference after the [CLI workflow](/slipway/cli). Use `slipway --help` to list commands on your installed CLI. In the unreleased next CLI, `slipway <command> --help` shows command-specific flags without authentication or prompts, including for aliases. Earlier clients show global help instead. Unknown commands and options in the next CLI exit 1, with structured stderr when a machine-output flag is requested.

Most commands require saved credentials and a linked `.slipway.json` project. `--env` selects an environment; it does not select a server. `--project` is supported by the next operational commands listed below, including `logs` and `run`; older commands still use a linked project. `--server` belongs to `login` only.

::: info Release compatibility
This reference describes the inspected CLI source. The npm CLI version and server version are independent. Live app logs, remote command execution, app inspection/restart, doctor, cancellation, history, arming, private receipts, and their machine flags below require the **unreleased next CLI and server**, beyond server v0.0.86. Earlier app `logs`, `run`, and `terminal` print Docker instructions. See [Updates](/slipway/updates#release-compatibility).
:::

Use `slipway --help` (`-h`) and `slipway --version` (`-v`) for global help and version. Next-release command flags are parsed separately; `db:create --version` selects a database version. Flags listed below are command-specific.

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
slipway db:create <name> [--type <type>] [--version <version>] [--env <env>]
```

`--type` defaults to `postgresql`. `--env` defaults to `production`. The next CLI correctly parses `--version` as a database option. Earlier clients intercept it as the CLI version flag; use dashboard service creation on those clients.

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
slipway run [<command...>] [--project <slug>] [--env <slug>] [--app <slug>] [--stdin] [--file <path>] [--write-arm-file <path>] [--receipt-file <path>] [--json] [--ndjson]
```

Alias: `exec` (next CLI). Environment defaults to `production`. Short targeting forms: `-p`, `-e`, `-a`. Provide one command source: positionals, stdin, or a file. The command source is bounded to 64 KiB. Every production command requires a valid exact-command/deployment arm; review and request it explicitly with `run:arm`. `--receipt-file` exclusively creates a private local metadata snapshot before submission, without command source, output, or arm tokens.

Read the [workflow](/slipway/cli#wait-for-an-outcome) for completion receipts, structured errors, exit codes, and unconfirmed interruptions. There is no automatic replay, idempotency option, durable execution lookup, or resume command. `run:cancel` requests confirmed cancellation of an owned active execution; `run:history` returns retained metadata, not execution lookup.

## App and command operations (unreleased)

The following commands accept mutually exclusive `--json` and `--ndjson`, each producing one JSON result on stdout and structured errors on stderr. Their environment defaults to `production`; target short forms are `-p`, `-e`, and `-a`. `app:inspect`, `app:restart`, `run:history`, and `run:arm` require an explicit app. Unknown apps fail rather than falling back.

### doctor

```bash
slipway doctor [--project <slug>] [--env <slug>] [--app <slug>] [--json] [--ndjson]
```

Checks server health and saved CLI authentication. With a selected project, also checks deployment readiness; readiness succeeds only when `canDeploy` is true. Any failed check exits 1. This does not prove app availability.

### apps

```bash
slipway apps [--project <slug>] [--env <slug>] [--app <slug>] [--json] [--ndjson]
```

Lists app metadata and resource limits without environment variables or credentials. `--app` filters one exact app.

### app:inspect

```bash
slipway app:inspect [--project <slug>] [--env <slug>] --app <slug> [--json] [--ndjson]
```

Inspects one explicit app, omitting environment variables and credentials.

### app:restart

```bash
slipway app:restart [--project <slug>] [--env <slug>] --app <slug> --approve-target <project/env/app> [--json] [--ndjson]
```

Requires exact target approval and calls the synchronous restart endpoint. A lost response produces `RESTART_UNCONFIRMED`; inspect before retrying.

### run:arm

```bash
slipway run:arm [<command>] [--project <slug>] [--env <slug>] --app <slug> --approve-target <project/env/app> --output <private-file> [--stdin] [--file <path>] [--json] [--ndjson]
```

Requests an owner/admin-approved, exact-command/deployment write arm. Command input is bounded to 64 KiB and uses one of positionals, stdin, or file. Exclusively creates a mode-0600 file; refuses existing files and symlinks. Tokens are never printed. The configured expiry is 60 seconds; the token is single-use. A failed request can leave an empty private file. See the [production workflow](/slipway/cli#make-a-reviewed-change).

### run:cancel

```bash
slipway run:cancel <execution-uuid> [--json] [--ndjson]
```

Exits 0 only for server-confirmed termination (`cancelled: true`). A false result exits 1 and does not distinguish unknown, completed, unavailable, unowned, or unconfirmed executions. Server live lookup is process-local.

### run:history

```bash
slipway run:history [--project <slug>] [--env <slug>] --app <slug> [--json] [--ndjson]
```

Lists retained per-user app command metadata with `executionLookup: false`. Row IDs are not execution UUIDs. Source, output, and results are omitted; history does not provide a durable ledger or replay.

## Manual container connection

### terminal

```bash
slipway terminal [--env <slug>] [--app <slug>]
```

This command **does not open an interactive session**. It looks up the container and prints a Docker instruction to use on the server. Do not treat it as a working remote terminal.

## Operations outside the CLI

Use the dashboard for lifecycle controls beyond the next CLI restart command, rollback, team management, and tool-specific Dock and Quest operations. A command name is available only when it appears in your installed CLI help. Deployment `--dry-run`, `--no-cache`, `--canary`, global `--server`, and profiles are not supported by this contract.
