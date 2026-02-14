---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Notifications
titleTemplate: Slipway
description: Configure notification channels and events for your Slipway instance.
prev:
  text: Settings
  link: /slipway/settings
next:
  text: Updates
  link: /slipway/updates
editLink: true
---

# Notifications

Slipway can notify you about deployments, backups, container health, and resource usage across five channels: **Discord**, **Slack**, **Telegram**, **Email**, and **Webhook**.

## Accessing Notifications Settings

1. Click your avatar (bottom left)
2. Select **Settings**
3. Click **Notifications**

Or navigate directly to:

```
https://slipway.yourdomain.com/settings/notifications
```

## Notification Events

Choose which events trigger notifications. Each event can be toggled independently.

### Deployments

| Event                  | Description                       | Default |
| ---------------------- | --------------------------------- | ------- |
| Successful deployments | Notify when a deployment succeeds | On      |
| Failed deployments     | Notify when a deployment fails    | On      |

### Backups

| Event              | Description                    | Default |
| ------------------ | ------------------------------ | ------- |
| Successful backups | Notify when a backup completes | Off     |
| Failed backups     | Notify when a backup fails     | On      |

### Lookout

| Event               | Description                                  | Default |
| ------------------- | -------------------------------------------- | ------- |
| Container restarts  | Notify when a container stops unexpectedly   | On      |
| High resource usage | Notify when CPU or memory exceeds thresholds | On      |

### Quest

| Event       | Description                              | Default |
| ----------- | ---------------------------------------- | ------- |
| Failed jobs | Notify when a Quest background job fails | On      |

## Notification Channels

### Discord

Send notifications to a Discord channel using a webhook.

**Setup:**

1. In your Discord server, go to **Server Settings → Integrations → Webhooks**
2. Click **New Webhook**, choose a channel, and copy the webhook URL
3. In Slipway, enable Discord and paste the webhook URL
4. Click **Send test message** to verify

Discord notifications use rich embeds with color-coded status (green for success, red for failure, amber for warnings).

### Slack

Send notifications to a Slack channel using an incoming webhook.

**Setup:**

1. In your Slack workspace, go to **Apps → Incoming Webhooks**
2. Create a new webhook and select a channel
3. Copy the webhook URL (starts with `https://hooks.slack.com/services/...`)
4. In Slipway, enable Slack and paste the webhook URL
5. Click **Send test message** to verify

Slack messages use mrkdwn formatting with bold headers and inline code blocks.

### Telegram

Receive instant notifications via a Telegram bot.

**Setup:**

1. Message [@BotFather](https://t.me/BotFather) on Telegram and create a new bot
2. Copy the **bot token** (e.g., `123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ`)
3. Get your **chat ID** — add the bot to a group or message it directly, then use the [getUpdates API](https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates) to find the chat ID
4. (Optional) If your group has **Topics** enabled, enter the **Topic Thread ID** to send notifications to a specific topic
5. In Slipway, enable Telegram and enter the values
6. Click **Send test message** to verify

Telegram messages use HTML formatting and include direct links to deployments when available.

### Email

Send notification emails to one or more recipients via SMTP.

**Setup:**

1. Enable Email in the notification settings
2. Configure your SMTP server (host, port, username, password)
3. Set the **From address** (e.g., `noreply@yourdomain.com`)
4. Enter **Notification recipients** — comma-separated email addresses
5. Click **Send test email** to verify

::: tip SMTP from Environment Variables
If you've set `MAIL_HOST`, `MAIL_USER`, etc. in your [global environment variables](/slipway/global-environment-variables), Slipway will use those automatically. Settings configured in the dashboard override environment variables.
:::

### Webhook

Send structured JSON payloads to any HTTP endpoint. Useful for integrating with automation platforms like n8n, Zapier, Make, or your own services.

**Setup:**

1. Enable Webhook in the notification settings
2. Enter your endpoint URL
3. Click **Send test webhook** to verify

Slipway sends a `POST` request with `Content-Type: application/json`. Your endpoint should return a `2xx` status code.

## Webhook Payloads

Every webhook payload follows the same envelope structure:

```json
{
  "event": "event.type",
  "timestamp": "2025-01-15T14:30:00.000Z",
  "data": { ... }
}
```

| Field       | Type   | Description                         |
| ----------- | ------ | ----------------------------------- |
| `event`     | string | The event type (see below)          |
| `timestamp` | string | ISO 8601 timestamp of when it fired |
| `data`      | object | Event-specific payload              |

### `deployment.success`

Sent when a deployment completes successfully.

```json
{
  "event": "deployment.success",
  "timestamp": "2025-01-15T14:30:00.000Z",
  "data": {
    "project": {
      "name": "my-sails-app",
      "slug": "my-sails-app"
    },
    "environment": {
      "name": "production"
    },
    "deployment": {
      "id": 42,
      "status": "running",
      "gitBranch": "main",
      "gitCommitShort": "a1b2c3d4"
    },
    "deploymentUrl": "https://slipway.example.com/projects/my-sails-app/deployments/42",
    "instanceName": "Slipway"
  }
}
```

### `deployment.failed`

Sent when a deployment fails. Same `data` shape as `deployment.success` but with `status: "failed"`.

```json
{
  "event": "deployment.failed",
  "timestamp": "2025-01-15T14:30:00.000Z",
  "data": {
    "project": {
      "name": "my-sails-app",
      "slug": "my-sails-app"
    },
    "environment": {
      "name": "production"
    },
    "deployment": {
      "id": 43,
      "status": "failed",
      "gitBranch": "main",
      "gitCommitShort": "e5f6g7h8"
    },
    "deploymentUrl": "https://slipway.example.com/projects/my-sails-app/deployments/43",
    "instanceName": "Slipway"
  }
}
```

### `backup.success`

Sent when a database backup completes successfully.

```json
{
  "event": "backup.success",
  "timestamp": "2025-01-15T02:00:00.000Z",
  "data": {
    "service": {
      "name": "postgres-main",
      "type": "postgres"
    },
    "backup": {
      "id": 10,
      "status": "completed",
      "durationMs": 3200,
      "sizeBytes": 15728640,
      "errorMessage": null
    },
    "instanceName": "Slipway"
  }
}
```

### `backup.failed`

Sent when a database backup fails.

```json
{
  "event": "backup.failed",
  "timestamp": "2025-01-15T02:00:00.000Z",
  "data": {
    "service": {
      "name": "postgres-main",
      "type": "postgres"
    },
    "backup": {
      "id": 11,
      "status": "failed",
      "durationMs": 1500,
      "sizeBytes": null,
      "errorMessage": "Connection refused"
    },
    "instanceName": "Slipway"
  }
}
```

### `container.down`

Sent when a container is detected as stopped unexpectedly.

```json
{
  "event": "container.down",
  "timestamp": "2025-01-15T14:30:00.000Z",
  "data": {
    "containerName": "slipway-my-sails-app-production",
    "resourceType": "app",
    "instanceName": "Slipway"
  }
}
```

| Field           | Type   | Values           | Description                              |
| --------------- | ------ | ---------------- | ---------------------------------------- |
| `containerName` | string |                  | Docker container name                    |
| `resourceType`  | string | `app`, `service` | Whether it's an app or service container |
| `instanceName`  | string |                  | Your Slipway instance name               |

### `resource.high_usage`

Sent when a container exceeds CPU or memory thresholds.

```json
{
  "event": "resource.high_usage",
  "timestamp": "2025-01-15T14:30:00.000Z",
  "data": {
    "containerName": "slipway-my-sails-app-production",
    "cpuPercent": 92.5,
    "memoryPercent": 87.3,
    "cpuHigh": true,
    "memHigh": true,
    "instanceName": "Slipway"
  }
}
```

| Field           | Type    | Description                           |
| --------------- | ------- | ------------------------------------- |
| `containerName` | string  | Docker container name                 |
| `cpuPercent`    | number  | Current CPU usage percentage          |
| `memoryPercent` | number  | Current memory usage percentage       |
| `cpuHigh`       | boolean | Whether CPU is above the threshold    |
| `memHigh`       | boolean | Whether memory is above the threshold |
| `instanceName`  | string  | Your Slipway instance name            |

### `quest.job_failed`

Sent when a Quest background job fails.

```json
{
  "event": "quest.job_failed",
  "timestamp": "2025-01-15T14:30:00.000Z",
  "data": {
    "jobName": "send-weekly-report",
    "errorMessage": "Connection refused",
    "duration": 1500,
    "instanceName": "Slipway"
  }
}
```

| Field          | Type   | Description                                 |
| -------------- | ------ | ------------------------------------------- |
| `jobName`      | string | Name of the failed job                      |
| `errorMessage` | string | Error message from the job                  |
| `duration`     | number | Job duration in milliseconds (if available) |
| `instanceName` | string | Your Slipway instance name                  |

## Testing Notifications

Each channel has a **Send test** button that sends a sample notification without saving your settings first. This lets you verify the connection before committing.

The test uses your current form values, so you can paste a new webhook URL and test it immediately.

## What's Next?

- Configure [Settings](/slipway/settings) for your Slipway instance
- Set up [Auto-Deploy](/slipway/auto-deploy) with GitHub webhooks
- Learn about [Lookout](/slipway/lookout) for real-time monitoring
