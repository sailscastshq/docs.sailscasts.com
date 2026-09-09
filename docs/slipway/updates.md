---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Updates
titleTemplate: Slipway
description: Keep your Slipway instance up to date with the latest features and security fixes.
prev:
  text: Notifications
  link: /slipway/notifications
next:
  text: CLI Installation
  link: /slipway/cli-installation
editLink: true
---

# Updates

Slipway includes built-in update detection and one-click updates from the dashboard.

## Upgrading to v0.0.65

[See everything new in this release](/slipway/whats-new), including Wake, Bridge support views, private backup providers, external PostgreSQL and custom-service routing and updates.

**No manual SQL is required in Bosun before deploying this version.** Startup creates missing tables and adds missing columns for existing installations. Keep production migration mode at `safe`; do not set `SLIPWAY_MIGRATE=alter` or `drop` to perform this upgrade. These are Slipway's own schema changes, not migrations of your deployed apps' databases.

Before the update, take a consistent backup of Slipway's database and retain its encryption keys. Preserve the existing `/app/db` volume. Wake adds `analytics.db` in that volume; existing analytics rows backfill automatically in bounded background batches. Review [Wake backup and recovery](/slipway/wake-operations#backup-and-restore) when backing up an instance that already collects analytics.

Wake and Bridge support views remain off by default. To use them, install the app hook and redeploy the application after configuring the capability:

```sh
npm install sails-hook-slipway@0.0.10
```

Updating the Slipway instance alone does not upgrade dependencies inside deployed apps. Custom images do not automatically gain Sails-specific capabilities.

The release image is `ghcr.io/sailscastshq/slipway:0.0.65`. [Release notes](https://github.com/sailscastshq/slipway/releases/tag/v0.0.65) describe compatibility and recovery boundaries.

## How It Works

Slipway checks for new versions by querying the [GitHub Releases API](https://github.com/sailscastshq/slipway/releases) for the latest release. Checks are cached for 1 hour to respect rate limits. No data is sent to external servers — Slipway only reads the public release metadata.

When a new version is available, a banner appears at the top of your dashboard with a link to the update page.

## Automatic Update (Dashboard)

The recommended way to update Slipway:

1. When a new version is available, click **Update** in the notification banner
2. On the update page, review the version comparison
3. Click **Update Now**

Slipway will:

1. Pull the latest Docker image from `ghcr.io/sailscastshq/slipway`
2. Inspect your current container's configuration (env vars, volumes, network, labels)
3. Spawn the **bosun** — a temporary sidecar container (`slipway-bosun`) that swaps the old container for the new one
4. The dashboard goes offline briefly (~5 seconds) while the container restarts
5. The page automatically reloads when the new version is ready

::: tip Data Persistence
Your data is stored on Docker volumes (`slipway-db`) and is preserved across updates. Your secrets at `/etc/slipway/.env` are also untouched.
:::

## Manual Update (SSH)

If the dashboard update doesn't work or you prefer command-line updates, SSH into your server and re-run the install script:

```bash
curl -fsSL https://raw.githubusercontent.com/sailscastshq/slipway/main/install.sh | bash
```

The script detects your existing installation (via `/etc/slipway/.env`), reuses your secrets (`SESSION_SECRET` and `DATA_ENCRYPTION_KEY`), pulls the latest image, and restarts the container with the same configuration.

You'll see:

```
Existing installation detected — reusing secrets
Pulling latest Slipway image...
Starting Slipway dashboard...

========================================================
  Slipway updated successfully!
========================================================
```

## Version Checking Configuration

Update notifications are configured in `config/slipway.js`:

```javascript
module.exports.slipway = {
  // Show update banner in dashboard (default: true)
  showUpdateNotifications: true,

  // How often to check (default: 1 hour)
  updateCheckInterval: 60 * 60 * 1000
}
```

## Rollback

If an update causes issues, you can roll back by running the install script with a specific version, or by pulling and running a previous image:

```bash
docker pull ghcr.io/sailscastshq/slipway:0.1.0
```

Then re-run the install script — it will use the image already pulled locally.

Alternatively, check the container logs to diagnose the issue:

```bash
docker logs slipway
```

The `--restart unless-stopped` policy means Docker will keep retrying if the container crashes on startup.

## Troubleshooting

### Update Check Shows "Unable to Check"

- **Network**: Ensure your server can reach `api.github.com` over HTTPS
- **Rate limiting**: GitHub allows 60 requests/hour for unauthenticated requests. Slipway caches results for 1 hour to stay within limits

### Dashboard Update Fails

If the one-click update fails:

1. Check the browser console for error details
2. Fall back to the [manual update](#manual-update-ssh) method
3. If the dashboard is unreachable, SSH into your server and check `docker logs slipway`

### Container Won't Start After Update

1. Check logs: `docker logs slipway`
2. Verify volumes exist: `docker volume ls | grep slipway`
3. Check the [release notes](https://github.com/sailscastshq/slipway/releases) for breaking changes or new required environment variables
