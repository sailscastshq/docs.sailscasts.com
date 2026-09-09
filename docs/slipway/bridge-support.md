---
title: Bridge Support Views
titleTemplate: Slipway
description: Open temporary read-only customer views while preserving the operator login.
editLink: true
---

# Read-only support views

Bridge can open an approved customer page as that customer without replacing the operator's normal application login. It is off by default. Install `sails-hook-slipway@0.0.10` or later, enable Bridge, and redeploy the app after configuring approved pages.

```js
// config/slipway.js
module.exports.slipway = {
  bridge: {
    impersonation: {
      enabled: true,
      readOnlyPaths: ['/', '/workspace']
    }
  }
}
```

The convention is `User` and `req.session.userId`. Shared identity configuration is inherited; for an app whose `Creator` model is referenced by `req.session.creatorId`:

```js
module.exports.slipway = {
  identity: { model: 'creator', sessionKey: 'creatorId' },
  bridge: {
    impersonation: { enabled: true, readOnlyPaths: ['/', '/workspace'] }
  }
}
```

Paths are exact paths relative to the app's route prefix. They must be reviewed by the app owner: a GET handler can still send email, call a payment provider, or write through a direct database driver. This feature is not a sandbox for arbitrary host code. Unknown pages, unsafe HTTP methods, common authentication/billing/export paths, Waterline writes, native datastore queries/transactions, and Quest job execution are blocked. Static files are served only from the host's actual public directory. Declare only pages whose effects are safe. Sessionless applications can use Wake anonymously; support viewing specifically requires host session middleware.

For additional application-specific session fields, set `bridge.impersonation.helper: 'support.identity'`. The helper receives `{ req, grant, actor, target }` and returns `{ session: { userId: target.id, ... } }` (or the declared session key). It must authorize the target's own context and must not copy the operator's roles, credentials, or team selection. Returning null refuses access. Administrator, owner, service-account, suspended and deleted targets are rejected before this helper runs. Standard TBJS team owners and administrators are also protected.

The user-facing name is **support view**, with **View as this user** as the action. Configuration uses `bridge.impersonation`, and audit action names use `bridge.impersonation.*`.

## Starting and ending a view

A Slipway team owner or administrator opens a record from the declared identity model, chooses **View as this user**, provides a reason, and confirms their current Slipway password. A host Bridge invitation does not grant this capability.

A one-use launch grant expires after two minutes. Its random token travels in the URL fragment, is removed before exchange, and is stored only as a hash by Slipway. The support view has a separate secure, HttpOnly, SameSite=Strict cookie and a fifteen-minute maximum lifetime measured from grant creation. HTTPS is required for production. The target identity is installed only for that request; the normal session ID, cookie, and stored session are unchanged, including concurrent normal requests.

Every supported HTML page has a fixed identity/read-only/countdown banner and **Stop viewing**. Inertia navigation preserves the banner. Pages that cannot render the banner under their content security policy, raw responses, attachments, and streams are refused. The client checks banner visibility and ends viewing if it disappears. This protects against integration errors, not a malicious operator modifying their browser. Server-side authorization and write guards remain authoritative.

Stop viewing and normal `/logout` or `/signout` paths end the support view and return to Bridge. They do not log the operator out of their original app session. Reloading retains the support view until it ends. A host process restart ends all local support views.

Owners/admins can revoke a grant with the authenticated, CSRF-protected `POST /api/v1/bridge/support/:grantId/revoke` endpoint. Disabling Bridge, rotating its credential, removing the operator's manager access, or changing their password revokes grants. Hosts refresh authorization every ten seconds and fail closed when their thirty-second lease expires; ordinary host page requests do not wait on Slipway network calls. A Quest job also expires unused/abandoned grants every minute. Local maximum expiry is enforced on every support request.

## Audit delivery and recovery

Slipway records requested, started, denied, write-blocked, stopped, expired, and revoked actions with the operator, subject, app, team, reason, and grant. Passwords, launch tokens, and support cookies are never audit fields. Starting requires an acknowledged persisted audit event. Host audit delivery uses stable event IDs and an atomic local outbox capped at 1,000 entries; retries are idempotent. Audit failure never allows a denied action or prevents local stopping.

The outbox is in `<appPath>/.tmp/slipway-support`, with owner-only file permissions. Keep this directory on persistent storage if audit recovery across replacement containers is required. A full, unwritable, or corrupt outbox prevents new acknowledged starts; failures are logged without tokens. Existing pending entries are retried after restart when the same app credential remains authorized. Credential revocation intentionally rejects old credentials: preserve pending files for investigation rather than assuming they were delivered. Central grant expiry/revocation remains recorded even when a host disappears.

Wake excludes requests carrying the runtime's support-session marker. Existing normal app requests retain their usual identity and collection behavior.
