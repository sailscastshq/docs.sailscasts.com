---
title: Private Backup Storage
titleTemplate: Slipway
description: Configure private S3-compatible or Azure Blob backup storage and recovery.
editLink: true
---

# Private backup storage

Settings → File storage → Backup storage controls database backups separately from public uploads. The default uses existing file-storage credentials; no new configuration is needed for an existing private S3-compatible bucket. Choose a separate provider when public uploads and backups need different storage.

| Provider                                             | Private backup upload/download/delete | Public uploads                 |
| ---------------------------------------------------- | ------------------------------------- | ------------------------------ |
| R2, S3, Spaces, MinIO, custom S3-compatible endpoint | Supported through the S3 adapter      | Existing file-storage settings |
| Azure Blob Storage                                   | Supported through the Azure SDK       | Not offered                    |

A connection test uploads a small temporary object, downloads and verifies it, checks anonymous reads, and deletes it. Save runs the same test before committing configuration. No public URL is required for backups. Anonymous checks cover the object endpoint and a configured public delivery URL; separate CDN aliases, future policy changes, and provider version-retention policies remain the operator's responsibility. Use a private bucket/container and deny anonymous access at the provider.

S3 credentials need object read/write/delete permissions and permission to abort multipart uploads for failed-transfer cleanup. Use the provider’s equivalent least-privilege policy.

## Azure

Enter the account and existing private container. Prefer a container-scoped SAS token with **read, write, delete** permissions and a future expiry. Account keys are also supported. Both are encrypted at rest and omitted from browser props and logs. Blank credential fields retain the saved value. Custom endpoints are optional; HTTP requires an explicit trusted-private-network opt-in.

Azure is supported for backup storage, including manual/scheduled backups, restore downloads, retention deletion, pre-update Slipway snapshots, and cleanup. It does not make an Azure database a managed Docker service; external database support is separate.

## Compatibility and recovery

Existing `s3Key` records continue to work. Before changing shared storage settings, Slipway binds legacy backup records to their original encrypted configuration. New records store a neutral object key, provider/container, byte size, SHA-256 checksum, ETag and provider version metadata. A restore uses that backup's connection, even after a provider switch. Saving verified replacement credentials for the same provider and storage location also updates matching backup records. This lets you renew a SAS token or rotate a key without losing older backups. Backups at a different location keep their existing credentials; keep that location accessible until they are no longer needed.

New uploads use unique keys and conditional writes, and reject an observed anonymous read. Existing downloads are not blocked by this new upload privacy check. A currently public backup location must be replaced with a private backup location before creating more backups.

Transfers have size/time bounds. Cancellation and failed uploads attempt cleanup; a failed cleanup retains the object reference for the scheduler to retry. Retention keeps the database record when object deletion fails. Project/service cleanup seals the original storage connection before deleting records, so retries do not accidentally use a different provider. Keep the instance encryption keys with your recovery material.

Deletion addresses the current object. Provider-managed historical versions, snapshots and soft-delete retention may remain according to the bucket/account policy. Configure lifecycle expiry for historical versions; do not assume Slipway's retained-backup count is the provider's physical byte-retention limit.
