---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Updates
titleTemplate: Slipway
description: Keep your Slipway instance up to date with the latest features and security fixes.
prev:
  text: Team Management
  link: /slipway/team-management
editLink: true
---

# Updates

Slipway includes built-in update checking to help you stay current with the latest features and security fixes.

## Checking for Updates

### Via Dashboard

1. Go to **Settings → Updates**
2. View your current version and check if updates are available
3. Click **Check again** to manually refresh

### Update Banner

When a new version is available, a banner appears at the top of the dashboard:

```
┌────────────────────────────────────────────────────────────┐
│ 🔄 Slipway 0.2.0 is available                             │
│    You're currently running 0.1.0                         │
│                                    [View Update] [Dismiss] │
└────────────────────────────────────────────────────────────┘
```

Click **View Update** to see detailed upgrade instructions.

## How Updates Work

### Version Checking

Slipway checks for updates by querying the GitHub Releases API:

- Checks are cached for 1 hour to respect rate limits
- No data is sent to Slipway servers
- Works in air-gapped environments (shows current version only)

### Update Notifications

Configure notifications in `config/slipway.js`:

```javascript
module.exports.slipway = {
  // Show update banner in dashboard
  showUpdateNotifications: true,

  // How often to check (default: 1 hour)
  updateCheckInterval: 60 * 60 * 1000
}
```

## Updating Slipway

Since Slipway runs in Docker, updates require pulling the new image and recreating the container.

::: tip Data Persistence
Your data is stored in Docker volumes and will be preserved during updates.
:::

### Using Docker CLI

**Step 1: Pull the new image**

```bash
docker pull sailscastshq/slipway:0.2.0
```

**Step 2: Stop the current container**

```bash
docker stop slipway
```

**Step 3: Remove the old container**

```bash
docker rm slipway
```

**Step 4: Start with the new image**

```bash
docker run -d --name slipway \
  -p 80:1337 \
  -v slipway-data:/app/data \
  -v /var/run/docker.sock:/var/run/docker.sock \
  sailscastshq/slipway:0.2.0
```

### Using Docker Compose

**Step 1: Update your `docker-compose.yml`**

```yaml
services:
  slipway:
    image: sailscastshq/slipway:0.2.0 # Update this line
    # ... rest of config
```

**Step 2: Apply the update**

```bash
docker compose up -d
```

Docker Compose automatically stops the old container, removes it, and starts the new one.

## Version Pinning

### Using Specific Versions

For production stability, pin to specific versions:

```yaml
# docker-compose.yml
services:
  slipway:
    image: sailscastshq/slipway:0.2.0 # Pinned version
```

### Using Latest

For development or auto-updates:

```yaml
# docker-compose.yml
services:
  slipway:
    image: sailscastshq/slipway:latest
```

Then update with:

```bash
docker compose pull && docker compose up -d
```

## Automatic Updates

### Using Watchtower

[Watchtower](https://containrrr.dev/watchtower/) can automatically update containers:

```yaml
# docker-compose.yml
services:
  slipway:
    image: sailscastshq/slipway:latest
    labels:
      - 'com.centurylinklabs.watchtower.enable=true'

  watchtower:
    image: containrrr/watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --cleanup --label-enable
```

### Using Cron

Create a simple update script:

```bash
#!/bin/bash
# /opt/slipway/update.sh

cd /opt/slipway
docker compose pull
docker compose up -d
```

Schedule with cron:

```bash
# Check for updates weekly at 3 AM Sunday
0 3 * * 0 /opt/slipway/update.sh
```

## Rollback

If an update causes issues, rollback to the previous version:

```bash
# Stop current container
docker stop slipway && docker rm slipway

# Start with previous version
docker run -d --name slipway \
  -v slipway-data:/app/data \
  -v /var/run/docker.sock:/var/run/docker.sock \
  sailscastshq/slipway:0.1.0  # Previous version
```

## Release Notes

View release notes for each version:

- **Dashboard**: Settings → Updates → "View release notes on GitHub"
- **GitHub**: [github.com/sailscastshq/slipway/releases](https://github.com/sailscastshq/slipway/releases)

### What's in a Release

Each release includes:

- New features and improvements
- Bug fixes
- Security patches
- Breaking changes (if any)

## Troubleshooting

### "Unable to Check for Updates"

If the update check fails:

1. **Network issues**: Ensure your server can reach `api.github.com`
2. **Rate limiting**: GitHub API allows 60 requests/hour for unauthenticated requests
3. **Firewall**: Check if outbound HTTPS is blocked

### "Container Won't Start After Update"

1. Check logs: `docker logs slipway`
2. Verify volumes exist: `docker volume ls | grep slipway`
3. Check for breaking changes in release notes

### "Data Missing After Update"

Ensure you're using the same volume mounts:

```bash
# Correct
docker run -v slipway-data:/app/data ...

# Wrong (different volume name)
docker run -v slipway-storage:/app/data ...
```

## Best Practices

### 1. Review Release Notes

Before updating, check for:

- Breaking changes
- New environment variables
- Migration steps

### 2. Backup Before Updating

```bash
# Backup the data volume
docker run --rm -v slipway-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/slipway-backup.tar.gz /data
```

### 3. Test in Staging

If running production workloads:

1. Test updates in a staging environment first
2. Verify your apps still deploy correctly
3. Check for any UI/API changes

### 4. Schedule Updates

Plan updates during maintenance windows:

- Low traffic periods
- When deployments are unlikely
- With time to rollback if needed

## What's Next?

- Configure [Settings](/slipway/settings) for your instance
- Set up [Auto-Deploy](/slipway/auto-deploy) for your projects
- Learn about [Configuration](/slipway/configuration) options
