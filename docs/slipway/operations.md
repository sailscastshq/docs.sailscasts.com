---
title: Operations and API
titleTemplate: Slipway
description: Choose the right surface and verify operational changes.
editLink: true
---

# Operations and API

Use one target throughout an investigation: project, environment, app or service, and deployment. Recheck it before a mutation, especially in production.

| Task                                | Surface                                  | CLI coverage                                                          |
| ----------------------------------- | ---------------------------------------- | --------------------------------------------------------------------- |
| Deploy source and inspect readiness | App deployment page or CLI               | `push`, `readiness`, `slide`, `deployments`                           |
| Read deployment output              | Deployment detail or CLI                 | `logs --deployment ID`                                                |
| Read running app logs               | App logs                                 | Next CLI/server: `logs`, `--follow`                                   |
| Inspect Sails models and helpers    | [Helm](/slipway/helm)                    | Next CLI/server `run` executes commands, not model-console JavaScript |
| Query or migrate a database         | [Dock](/slipway/dock)                    | No dedicated Dock command                                             |
| Inspect and operate background jobs | [Quest](/slipway/quest)                  | No dedicated Quest command                                            |
| Restore a database backup           | Service backups                          | `backup:restore ID --writes-paused`                                   |
| Roll back an app                    | [Deployment history](/slipway/rollbacks) | No rollback command                                                   |

## Authorization and review

Browser actions and authenticated API requests apply server-side team and target checks. [Deploy-token management](/slipway/deploy-tokens) has a separate availability boundary; do not assume those tokens authenticate deployment or operational requests. Never transfer a credential into a URL, chat transcript, screenshot, or committed script.

For a database change, inspect the current schema and take a recoverable backup first. For a production command, use [Helm's write-arm rules](/slipway/helm#production-target-and-write-arming). For a job, review its declared inputs and side effects. Permission to open a tool does not make its work read-only.

## Wait and verify

Distinguish request acceptance, progress, and terminal outcome. Retain an operation or deployment ID when one is returned. After a timeout or disconnect, inspect that operation and its actual effect before repeating the request.

For database restore, pause app and external writers before invoking:

```bash
slipway backup:restore BACKUP_ID --writes-paused
```

The CLI polls the returned restore operation for up to an hour. If it remains pending, inspect `/api/v1/restore-operations/OPERATION_ID` with an authorized client and keep writers paused. A completed operation still requires verification of the restored database before traffic resumes. See [database backups](/slipway/database-services#backups).

## API references

Use the tool-specific contract rather than guessing a URL from a CLI command:

- [Dock API](/slipway/dock#authenticated-endpoints) for query, schema, migration, import, and export requests.
- [Quest](/slipway/quest) for job compatibility and available operational controls.
- [Deploy tokens](/slipway/deploy-tokens) for scoped pipeline deployment.
- [CLI workflow](/slipway/cli) for structured logs/run output, exit codes, and unconfirmed outcomes.

These transports have different capabilities. The CLI has no general operation lookup, automatic replay, resume, or cancel interface.
