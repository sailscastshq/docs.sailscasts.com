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

Slipway supports teams for collaborative development. Manage members, assign roles, and control access to projects.

## Team Overview

When you create a Slipway account, a team is automatically created for you. Teams contain:

- **Members** - Users with access to your projects
- **Projects** - Applications deployed via Slipway
- **Roles** - Permission levels for members

## Viewing Your Team

### Via Dashboard

1. Click your avatar (bottom left)
2. Select **Settings**
3. Click **Team**

### Via CLI

```bash
slipway team:info
```

Output:

```
Team: Acme Inc
Slug: acme-inc
Created: January 1, 2024

Members (3):
  admin@example.com     Owner       Joined Jan 1, 2024
  developer@example.com Developer   Joined Jan 5, 2024
  viewer@example.com    Viewer      Joined Jan 10, 2024

Projects (5):
  my-sails-app, api-service, marketing-site, ...
```

## Roles and Permissions

### Available Roles

| Role          | Description                                  |
| ------------- | -------------------------------------------- |
| **Owner**     | Full access, can delete team, manage billing |
| **Admin**     | Manage projects, members, and settings       |
| **Developer** | Deploy, view logs, manage env vars           |
| **Viewer**    | Read-only access to projects and logs        |

### Permission Matrix

| Permission      | Owner | Admin | Developer | Viewer |
| --------------- | ----- | ----- | --------- | ------ |
| View projects   | ✓     | ✓     | ✓         | ✓      |
| View logs       | ✓     | ✓     | ✓         | ✓      |
| Deploy          | ✓     | ✓     | ✓         | ✗      |
| Manage env vars | ✓     | ✓     | ✓         | ✗      |
| Manage secrets  | ✓     | ✓     | ✗         | ✗      |
| Create projects | ✓     | ✓     | ✗         | ✗      |
| Delete projects | ✓     | ✓     | ✗         | ✗      |
| Manage members  | ✓     | ✓     | ✗         | ✗      |
| Manage billing  | ✓     | ✗     | ✗         | ✗      |
| Delete team     | ✓     | ✗     | ✗         | ✗      |

## Inviting Members

### Via Dashboard

1. Go to **Settings → Team**
2. Click **Invite Member**
3. Enter email address
4. Select role
5. Click **Send Invitation**

### Via CLI

```bash
slipway team:invite developer@example.com --role=developer
```

### Invitation Flow

1. Invitee receives email with invitation link
2. They click the link and create an account (or log in)
3. They're added to your team with the assigned role
4. They can now access team projects

### Pending Invitations

View pending invitations:

```bash
slipway team:invitations
```

Cancel an invitation:

```bash
slipway team:invite:cancel developer@example.com
```

## Managing Members

### Update Role

```bash
slipway team:member:update developer@example.com --role=admin
```

Or via Dashboard:

1. Go to **Settings → Team**
2. Find the member
3. Click the role dropdown
4. Select new role

### Remove Member

```bash
slipway team:member:remove developer@example.com
```

::: warning Access Revoked
Removed members immediately lose access to all team projects.
:::

## Project-Level Permissions

For more granular control, assign members to specific projects:

### Assign to Project

```bash
slipway project:member:add my-sails-app developer@example.com --role=developer
```

### Project Roles

| Role           | Description                |
| -------------- | -------------------------- |
| **Maintainer** | Full project access        |
| **Developer**  | Deploy and manage env vars |
| **Viewer**     | Read-only access           |

### List Project Members

```bash
slipway project:members my-sails-app
```

## Team Settings

### Update Team Name

```bash
slipway team:update --name="New Company Name"
```

### Transfer Ownership

Transfer team ownership to another admin:

```bash
slipway team:transfer admin@example.com
```

::: danger Irreversible
Ownership transfer cannot be undone. The new owner will have full control.
:::

## Audit Logging

Track team activity:

```bash
slipway team:audit
```

Output:

```
TIMESTAMP            USER                ACTION
2024-01-20 14:30     admin@example.com   Deployed my-sails-app
2024-01-20 14:25     admin@example.com   Set env var DATABASE_URL
2024-01-19 10:00     admin@example.com   Invited developer@example.com
2024-01-18 09:00     admin@example.com   Created project api-service
```

### Filter by User

```bash
slipway team:audit --user=developer@example.com
```

### Filter by Action

```bash
slipway team:audit --action=deploy
```

## Single Sign-On (SSO)

For enterprise teams, configure SSO:

### Supported Providers

- Google Workspace
- Microsoft Azure AD
- Okta
- Generic SAML 2.0
- Generic OIDC

### Configuration

1. Go to **Settings → Security → SSO**
2. Select your provider
3. Enter configuration details
4. Test the connection
5. Enable SSO

### Enforcing SSO

Once configured, you can require SSO for all team members:

```bash
slipway team:update --require-sso=true
```

## API Access for Teams

### Team-Level Tokens

Create tokens for CI/CD that work across all team projects:

```bash
slipway team:token:create "CI/CD Token" --scope=deploy
```

### Project-Specific Tokens

Create tokens limited to specific projects:

```bash
slipway project:token:create my-sails-app "Deploy Token"
```

## Best Practices

### 1. Principle of Least Privilege

Assign the minimum role needed:

- New developers → **Developer** role
- Contractors → **Viewer** or project-specific access
- Team leads → **Admin** role

### 2. Regular Access Reviews

Periodically review team membership:

```bash
slipway team:members
```

Remove members who no longer need access.

### 3. Use Project-Level Permissions

For sensitive projects:

```bash
# Restrict access to production project
slipway project:member:add production-app admin@example.com --role=maintainer
```

### 4. Enable 2FA for Admins

Require two-factor authentication:

```bash
slipway team:update --require-2fa-admins=true
```

### 5. Monitor Audit Logs

Regularly check for unusual activity:

```bash
slipway team:audit --since=7d
```

## Troubleshooting

### "Permission Denied"

```
Error: You don't have permission to perform this action
```

**Solution:**

- Check your role: `slipway whoami`
- Ask an admin to upgrade your role

### "Invitation Expired"

Invitations expire after 7 days. Send a new invitation:

```bash
slipway team:invite:cancel old@example.com
slipway team:invite old@example.com --role=developer
```

### "Cannot Remove Last Owner"

A team must have at least one owner.

**Solution:**

1. Promote another member to owner
2. Then remove yourself

### "SSO Login Failed"

1. Check SSO configuration
2. Verify user exists in identity provider
3. Check attribute mapping

## What's Next?

- Learn about [Updates](/slipway/updates) to keep Slipway current
- Configure [Auto-Deploy](/slipway/auto-deploy) for team workflows
- Set up [Secrets](/slipway/secrets) with proper access control
- Learn about [Settings](/slipway/settings) for team configuration
