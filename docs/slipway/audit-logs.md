---
title: Audit Logs
titleTemplate: Slipway
description: Inspect operational events without exposing executed source or returned data.
editLink: true
---

# Audit Logs

Team owners and admins can open **Settings → Audit Log**. Select the relevant action and inspect the actor, target, time, and available diagnostic metadata.

```bash
slipway audit-log --page 1 --limit 20
```

The CLI lists audit entries; the dashboard provides the richer inspection workflow. A member without administrative authority cannot use the audit page or its JSON endpoint.

## Production execution

Helm records execution and write-arm events separately. Audit metadata includes target identity, source hash, execution status, timing, and whether writes were armed. It does not store submitted source, returned records, console logs, credentials, or full production data. See [Helm production audit](/slipway/helm#production-audit) for retention and configuration.

Helm's private source history is separate from the security audit trail. Deleting editable history does not remove the corresponding audit event.

## Share diagnostics

Use redacted metadata and an execution or deployment identifier when discussing an incident. Review downloaded or copied information before sharing it. An audit record is evidence of a recorded action; verify the application or database outcome separately.
