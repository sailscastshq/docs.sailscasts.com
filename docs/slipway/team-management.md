---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Team Management
titleTemplate: Slipway
description: Manage team members, roles, and permissions in Slipway.
prev:
  text: Auto-Deploy
  link: /slipway/auto-deploy
next:
  text: Updates
  link: /slipway/updates
editLink: true
---

# Team Management

Use teams to organize projects and the people who can operate them. Check your active team before changing membership or using production tools.

## Invite a member

Open **Settings → Team Members**, enter the person's email, select the supported role, and send the invitation. Review pending invitations there and cancel invitations that should no longer grant access.

| Role   | Operational meaning                                     |
| ------ | ------------------------------------------------------- |
| Owner  | Team ownership and administrative authority             |
| Admin  | Supported team administration and privileged operations |
| Member | Team access without owner/admin-only tools              |

Roles are enforced by the server. Membership applies to the active team; it is not a separately configured per-project developer/maintainer role system.

## Change or remove access

Use the member's action menu in Team Members to change a supported role or remove access. Review the affected account and active team before confirming. Protect the remaining ownership and administration path when changing your own access.

Use **Team Profile** to update the name and logo. Use the team switcher to select another team you belong to before operating its projects.

## CLI and audit

```bash
slipway whoami
slipway audit-log --limit 20
```

`whoami` shows the saved CLI identity and team; it does not refresh membership from the server. API requests recheck active membership. The CLI has no team invitation, role-change, ownership-transfer, or project-member commands.

Owners and admins can inspect [Audit Logs](/slipway/audit-logs) for supported administrative and execution events. Revoke unused [CLI credentials](/slipway/cli-authentication#log-out-and-revoke-access) as part of access cleanup.
