---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Content
titleTemplate: Slipway
description: Edit markdown content files directly from the Slipway dashboard. A visual CMS for sails-content powered apps.
prev:
  text: Bridge
  link: /slipway/bridge
next:
  text: Quest
  link: /slipway/quest
editLink: true
---

# Content

Content is a **visual CMS** for your [sails-content](https://docs.sailscasts.com/sails-content) powered applications. Edit markdown files, manage frontmatter, and deploy changes—all from the Slipway dashboard.

## What is Content?

Content provides a web-based interface for managing your `sails-content` files:

- **Browse collections** - Navigate your content directory structure
- **Edit markdown** - Visual editor with live preview
- **Manage frontmatter** - Edit metadata fields directly
- **One-click deploy** - Save changes and trigger a deploy

No need to push to git for simple content updates.

## Requirements

Content is available when your app uses [sails-content](https://docs.sailscasts.com/sails-content):

```bash
npm install sails-content
```

Slipway automatically detects `sails-content` during deployment and enables the Content feature.

## Accessing Content

### Via Dashboard

1. Go to your project in Slipway
2. Select an environment
3. Click the **Content** icon (document icon with violet color)
4. Browse your collections

### Via Direct URL

```
https://your-slipway-instance.com/projects/myapp/content
```

Or with a specific environment:

```
https://your-slipway-instance.com/projects/myapp/environments/staging/content
```

## Content Structure

Content follows the standard `sails-content` directory structure:

```
content/
├── blog/
│   ├── hello-world.md
│   ├── getting-started.md
│   └── advanced-features.md
├── docs/
│   ├── introduction.md
│   ├── installation.md
│   └── api-reference.md
└── pages/
    ├── about.md
    └── contact.md
```

Each subdirectory becomes a **collection** in the Content Manager.

## Collections

### Viewing Collections

The Content Manager lists all collections with:

- Collection name
- Number of files
- Individual file listings

```
┌─────────────────────────────────────────────────────────────────┐
│ Content Manager                               sails-content     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 📁 blog                                    3 files        [+]   │
│ ├── hello-world                                                 │
│ ├── getting-started                                             │
│ └── advanced-features                                           │
│                                                                 │
│ 📁 docs                                    3 files        [+]   │
│ ├── introduction                                                │
│ ├── installation                                                │
│ └── api-reference                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Creating New Content

1. Click the **+** button next to a collection
2. Enter a slug (becomes the filename)
3. Optionally add a title
4. Click **Create**

The new file is created with basic frontmatter:

```markdown
---
title: My New Post
createdAt: 2024-01-20T10:30:00.000Z
---

# My New Post

Start writing your content here.
```

## Editor

### Split View

The default editor shows a split view:

- **Left**: Edit panel with frontmatter and markdown body
- **Right**: Live preview of rendered content

### Editor Modes

Toggle between modes using the toolbar:

| Mode        | Description                     |
| ----------- | ------------------------------- |
| **Edit**    | Full-width editor, no preview   |
| **Split**   | Side-by-side editor and preview |
| **Preview** | Full-width preview only         |

### Raw Mode

Click the code icon to toggle raw mode:

- Edit the complete file including YAML frontmatter
- Useful for complex frontmatter or troubleshooting

### Keyboard Shortcuts

| Shortcut       | Action                 |
| -------------- | ---------------------- |
| `Cmd/Ctrl + S` | Save without deploying |

## Frontmatter

### Editing Frontmatter

The editor displays frontmatter fields as form inputs:

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTMATTER                                                     │
├─────────────────────────────────────────────────────────────────┤
│ title      │ Getting Started with Sails                       │ │
│ author     │ John Doe                                          │ │
│ date       │ 2024-01-20                                        │ │
│ tags       │ ["sails", "nodejs", "tutorial"]                   │ │
└─────────────────────────────────────────────────────────────────┘
```

### Supported Types

Frontmatter values are preserved as their original types:

- **Strings**: Regular text input
- **Numbers**: Preserved as numbers
- **Booleans**: true/false values
- **Arrays**: JSON arrays
- **Objects**: JSON objects

## Saving and Deploying

### Save Only

Click **Save** to write changes to the file without deploying:

- Changes are saved to disk immediately
- The running app won't see changes (SSG mode)
- Use this when making multiple edits

### Save & Deploy

Click **Save & Deploy** to:

1. Save the file
2. Trigger a new deployment
3. Redirect to the deployment page

::: tip SSG Mode
sails-content uses Static Site Generation (SSG). Content is compiled at build time, so changes require a redeploy to take effect.
:::

## Deleting Content

1. Open the content file in the editor
2. Click the trash icon in the toolbar
3. Confirm the deletion

::: warning
Deleting content removes the file permanently. Consider saving a backup before deleting important content.
:::

## File Types

Content supports both Markdown and JSON files:

### Markdown Files (.md)

Standard markdown with YAML frontmatter:

```markdown
---
title: Hello World
author: Jane Doe
publishedAt: 2024-01-20
---

# Hello World

This is the body content in **markdown**.
```

### JSON Files (.json)

Structured data without a markdown body:

```json
{
  "title": "Site Configuration",
  "navigation": [
    { "label": "Home", "url": "/" },
    { "label": "About", "url": "/about" }
  ]
}
```

## API Endpoints

Content provides REST API endpoints for programmatic access:

### List Collections

```bash
GET /api/v1/projects/:projectSlug/content/collections
```

### Get Content

```bash
GET /api/v1/projects/:projectSlug/content/:collection/:file
```

### Create Content

```bash
POST /api/v1/projects/:projectSlug/content/:collection

{
  "slug": "my-new-post",
  "title": "My New Post",
  "body": "Initial content..."
}
```

### Update Content

```bash
PUT /api/v1/projects/:projectSlug/content/:collection/:file

{
  "frontmatter": { "title": "Updated Title" },
  "body": "Updated content...",
  "deploy": true
}
```

### Delete Content

```bash
DELETE /api/v1/projects/:projectSlug/content/:collection/:file
```

## Best Practices

### 1. Use Meaningful Slugs

Slugs become URLs, so use descriptive, URL-friendly names:

```
# Good
getting-started-with-sails
api-authentication-guide

# Avoid
post-1
untitled-2024-01-20
```

### 2. Consistent Frontmatter

Use consistent frontmatter fields across collections:

```yaml
---
title: Post Title
description: Brief description for SEO
author: Author Name
publishedAt: 2024-01-20
tags: ['tag1', 'tag2']
---
```

### 3. Preview Before Deploying

Use the preview mode to check rendering before deploying.

### 4. Batch Edits Together

When making multiple edits, save without deploying, then deploy once at the end.

## Troubleshooting

### Content Not Appearing

If the Content feature isn't showing:

1. Verify `sails-content` is in your `package.json`
2. Deploy your app (detection happens during deployment)
3. Check the environment page for the content icon

### Changes Not Visible

Remember that sails-content uses SSG:

1. Save your changes
2. Click "Save & Deploy"
3. Wait for the deployment to complete
4. Your changes are now live

### Frontmatter Parse Errors

If frontmatter isn't parsing correctly:

1. Switch to raw mode
2. Check YAML syntax (proper indentation, colons, quotes)
3. Validate complex values are proper JSON/YAML

## What's Next?

- Learn about [sails-content](https://docs.sailscasts.com/sails-content) for setting up content in your app
- Use [Helm](/slipway/helm) for database queries
- Set up [Auto-Deploy](/slipway/auto-deploy) for git-based deployments
