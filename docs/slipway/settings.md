---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Settings
titleTemplate: Slipway
description: Configure global settings for your Slipway instance.
prev:
  text: Custom Domain & SSL
  link: /slipway/custom-domain
next:
  text: Notifications
  link: /slipway/notifications
editLink: true
---

# Settings

Open **Settings** in your Slipway dashboard. Available sections depend on instance administration and your active team role.

| Section            | Use it for                                          |
| ------------------ | --------------------------------------------------- |
| Instance           | Instance URL and branding                           |
| File Storage       | Upload storage and private backup providers         |
| Notifications      | Deployment alerts via Telegram and email            |
| Global Environment | Instance variables applied to deployed applications |
| Team Profile       | Team name and logo                                  |
| Team Members       | Membership, invitations, and roles                  |
| Git                | GitHub connection and deploy-token management       |
| CLI Tokens         | Credentials issued by CLI authorization             |
| Updates            | Release checks and update instructions              |
| Audit Log          | Operational and production execution events         |

## Choose the right scope

Instance administrators manage host-wide settings. Team owners and admins manage the supported team operations. App domains, resource limits, variables, and deployment source are configured on the selected project environment or app rather than through a global CLI setting.

A hidden or unavailable setting is not evidence that its value is configured. Ask the appropriate instance or team administrator to make a required change.

## Save and verify

Review the target and changed values before saving. For an instance URL change, verify DNS, proxy reachability, and HTTPS through the new route; a saved URL alone does not prove those checks passed. For backup storage, run its connection check and confirm a real backup is restorable. See [Private Backup Storage](/slipway/backup-storage).

Do not copy private storage credentials or token responses into support reports. Share redacted errors and the affected scope.

The CLI has no settings import/export or `config:set` command. Follow [Project Configuration](/slipway/project-configuration), [Team Management](/slipway/team-management), and [Updates](/slipway/updates) for their specific workflows.
