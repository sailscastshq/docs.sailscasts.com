---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-sqlite-social.png
title: Getting started
titleTemplate: Sails SQLite
description: High-performance SQLite adapter built specifically for Sails.js applications with advanced performance optimizations.
next:
  text: Configuration
  link: '/sails-sqlite/configuration'
editLink: true
---

# Getting Started

Sails SQLite is a high-performance SQLite adapter built specifically for Sails.js applications, featuring advanced performance optimizations based on SQLite best practices.

## Installation

Install the adapter using npm:

```bash
npm install sails-sqlite
```

## Basic Configuration

Configure your datastore in `config/datastores.js`:

```javascript
// config/datastores.js
module.exports.datastores = {
  default: {
    adapter: 'sails-sqlite',
    url: 'db/production.sqlite'
  }
}
```

## Quick Test

Create a simple model to test your setup:

```javascript
// api/models/User.js
module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true
    }
  }
}
```

Then test it in your Sails console:

```bash
sails console
```

```javascript
// Create a user
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com'
}).fetch()

console.log('Created user:', user)
```

## What's Next?

- Learn about [performance configuration](/sails-sqlite/configuration) for production use
- Explore [advanced features](/sails-sqlite/advanced-features) like transactions and batch operations
- Check out [model definitions](/sails-sqlite/model-definitions) and best practices
