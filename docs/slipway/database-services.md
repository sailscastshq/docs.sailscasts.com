---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Database Services
titleTemplate: Slipway
description: Provision and manage PostgreSQL, MySQL, Redis, and MongoDB databases with Slipway.
prev:
  text: File Uploads
  link: /slipway/file-uploads
next:
  text: Helm
  link: /slipway/helm
editLink: true
---

# Database Services

Add a database or cache to the environment that needs it. Managed services run in containers on Slipway's private Docker network; application connection variables are managed by Slipway.

## Create and inspect

From the linked project directory:

```bash
slipway db:create mydb --type postgresql --env staging
slipway db:create cache --type redis --env staging
slipway services --env staging
```

Use `--type` and `--env` to choose the service and environment. The unreleased next CLI parses `db:create --version` as the database version. Earlier clients intercept it as the global CLI version flag; use the dashboard's service creation controls on those clients. Do not assume a major version is available because an arbitrary image tag exists.

For connection details:

```bash
slipway db:url mydb --env staging
```

This prints a credential-bearing URL. Keep it out of chat, logs, screenshots, and source control. Use the appropriate managed variable in the app configuration, then deploy and verify the app can connect. See [Environment Variables](/slipway/environment-variables).

## Browse and query

Open [Dock](/slipway/dock) for a supported running service. Inspect a bounded query before changing data. Database queries, imports, and migrations operate on the live service; taking a backup and reviewing the target belong before destructive work.

There are no CLI `db:connect`, `db:link`, `db:update`, or `db:logs` commands in the inspected registry. Use the service's dashboard controls and connection details for those workflows.

## Backups

Create a backup before an important change:

```bash
slipway backup:create mydb --env staging
slipway backup:list mydb --env staging
```

Inspect its status and storage location. Starting a backup is not proof that it finished or can be restored. Configure [Private Backup Storage](/slipway/backup-storage) for supported off-host providers and verify recovery with a disposable target before depending on it.

For a restore, stop app and external writers first, select the intended backup, then acknowledge that writers are paused:

```bash
slipway backup:restore BACKUP_ID --writes-paused
```

The CLI follows the returned restore operation. Keep writers paused if it is pending or unconfirmed. Preserve any reported safety-snapshot identifier. Verify database structure, expected records, and app compatibility before resuming writes. See [Operations and API](/slipway/operations#wait-and-verify).

A restore can discard changes made after the backup. Application image [rollback](/slipway/rollbacks) does not restore data.

## External services

If you already run PostgreSQL elsewhere, use [External PostgreSQL](/slipway/external-postgresql) for connection, logical backup, and recovery rules. For a reviewed private custom image, follow [Custom Services](/slipway/custom-services).

## Troubleshooting

Check the selected environment, service status, network reachability, credential configuration, and app logs. Redeploy after variables change so the app receives its effective configuration. Do not open database ports publicly as a substitute for diagnosing the private connection.
