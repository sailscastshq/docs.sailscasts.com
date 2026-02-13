---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Bridge
titleTemplate: Slipway
description: An auto-generated data management interface for your Sails models. View, create, edit, and manage your data.
prev:
  text: Helm
  link: /slipway/helm
next:
  text: Content
  link: /slipway/content
editLink: true
---

# Bridge

Bridge is an **auto-generated data management interface** for your Sails applications. Named after the ship's bridge—the command center where the captain navigates and controls the vessel.

Think of it as [Laravel Nova](https://nova.laravel.com/) or [AdminJS](https://adminjs.co/) built specifically for Sails.

## What is Bridge?

Bridge automatically generates a full data management interface from your Sails models:

- **List views** with sorting, search, and pagination
- **Create/Edit forms** with proper field types
- **Relationship management** (belongsTo, hasMany)
- **Bulk delete**
- **Detail views** with related records

No configuration required—Bridge introspects your models and generates the UI automatically.

## Accessing Bridge

### Via Dashboard

1. Go to your project in Slipway
2. Select an environment
3. Click the **Bridge** tab
4. Browse your models

Your app must be running for Bridge to work — it reads model definitions from the running container.

## How It Works

Bridge works by remotely introspecting your deployed Sails app:

1. Slipway executes code inside your running container via `docker exec`
2. It reads all your model definitions — attributes, types, validations, associations
3. It caches this schema (refreshed every 10 minutes)
4. All CRUD operations are executed remotely in the container context

This means Bridge always reflects your **actual model definitions** — no separate config to keep in sync.

## Auto-Generated Interface

### Model Detection

Bridge automatically detects all models in `api/models/`:

```
api/models/
├── User.js       → Bridge shows "User" with all attributes
├── Post.js       → Bridge shows "Post" with all attributes
├── Comment.js    → Bridge shows "Comment" with all attributes
└── Order.js      → Bridge shows "Order" with all attributes
```

### Field Type Mapping

Waterline types are automatically mapped to appropriate UI controls:

| Waterline Type | Bridge Control |
| -------------- | -------------- |
| `string`       | Text input     |
| `text`         | Textarea       |
| `number`       | Number input   |
| `boolean`      | Toggle switch  |
| `json`         | JSON editor    |
| `ref` (date)   | Date picker    |

### Relationship Detection

Associations are automatically rendered:

```javascript
// api/models/Post.js
module.exports = {
  attributes: {
    title: { type: 'string' },
    content: { type: 'string' },

    // belongsTo — rendered as dropdown
    author: { model: 'user' },

    // hasMany — rendered as related list
    comments: { collection: 'comment', via: 'post' }
  }
}
```

## Features

### List View

The list view provides:

- **Sortable columns** — Click headers to sort
- **Search** — Search across record fields
- **Pagination** — Navigate through records
- **Record counts** — See total records per model

### Create/Edit Forms

Forms are auto-generated based on your model attributes:

- Required fields are marked
- Field types match your Waterline definitions
- Validation rules (isEmail, isIn, etc.) are respected
- `encrypt` fields are handled appropriately

### Detail View

View a single record with all its data and relationships. Associated records are shown inline — belongsTo shows the related record, hasMany shows the collection.

### Bulk Delete

Select multiple records from the list view and delete them in one action.

## Configuration

Bridge configuration is done via `config/slipway.js` in your Sails app:

```javascript
// config/slipway.js
module.exports.slipway = {
  bridge: {
    // Models to exclude from Bridge
    hidden: ['Session', 'Archive']
  }
}
```

::: tip
Bridge reads your model definitions directly — it doesn't need you to duplicate your schema in a config file. Configuration is only needed for customizing Bridge's behavior, not describing your models.
:::

## Troubleshooting

### Models Not Appearing

1. Make sure your app is running
2. Check the model is in `api/models/` and exports a valid Sails model
3. Wait up to 10 minutes for the model cache to refresh, or redeploy

### Relationships Not Working

1. Ensure associations are properly defined with `model:` or `collection:` + `via:`
2. Check the referenced model exists
3. Verify the `via` attribute matches the association name on the other side

## What's Next?

- Use [Helm](/slipway/helm) for direct database queries
- Set up [Auto-Deploy](/slipway/auto-deploy) for continuous deployment
- Configure [Team Management](/slipway/team-management) for access control
