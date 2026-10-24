---
title: Test a backup restore
titleTemplate: Slipway
description: Restore a managed PostgreSQL backup into a temporary database from Dock.
editLink: true
---

# Test a backup restore

A completed upload proves you have a backup file. A restore test checks whether Slipway can download it and restore it into a temporary database.

Open the service in **Dock → Backups**. Choose **Test restore** beside a completed backup, or **Back up and test restore** to create a fresh backup and test it in one flow.

## What gets tested

The test downloads the private backup, checks compatibility, starts an isolated temporary database, restores the backup and reports its checks and cleanup. The live application database is unchanged, and a test does not require pausing application writes.

This flow supports **managed PostgreSQL**. External PostgreSQL and other engines are not supported by this test runner. Test those backups in a separate private recovery database using the appropriate engine tools.

A completed backup with a known positive size must fit the instance's configured limits. The default download limit is 64 MiB. Temporary data, memory and execution time are also bounded; the interface reports eligibility before you start.

## Read the result

Follow the stages and final report in Dock. A passed restore confirms the automated checks completed; it does not prove business correctness, application compatibility or a complete disaster recovery plan. Review the reported database version and test the application against restored data when those guarantees matter.

Use **Cancel test** to request cancellation. If temporary resources remain, **Retry cleanup** handles the retained cleanup task. A successful restore with cleanup still pending needs attention; do not treat it as a fully completed operation.

## Restore production deliberately

Testing and replacing the live database are separate actions. An actual restore requires the production restore safeguards, including pausing writes. Keep backup credentials private and retain a tested recovery procedure.

See [Dock](/slipway/dock), [database backups](/slipway/database-services) and [private backup storage](/slipway/backup-storage).
