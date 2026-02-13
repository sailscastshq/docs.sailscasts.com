---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Helm
titleTemplate: Slipway
description: A production REPL for your Sails applications. Query data, run helpers, and debug issues.
prev:
  text: Database Services
  link: /slipway/database-services
next:
  text: Bridge
  link: /slipway/bridge
editLink: true
---

# Helm

Helm is a **production REPL** for your Sails applications. Named after the ship's helm—where you steer and command the vessel.

Think of it as [Tinkerwell](https://tinkerwell.app/) for Sails — a live console connected to your running app.

## What is Helm?

Helm gives you a live REPL connected to your running Sails application:

- Query your database using Waterline models
- Execute Sails helpers
- Inspect configuration
- Debug issues in real-time
- All without SSH or direct database access

## Accessing Helm

### Via Dashboard

1. Go to your project in Slipway
2. Select an environment
3. Click the **Helm** tab
4. Start typing in the REPL interface

Your app must be running for Helm to work — it executes code inside the running container.

## How It Works

When you run code in Helm, Slipway:

1. Takes your code and wraps it in a Sails bootstrap script
2. Executes it inside your running container via `docker exec`
3. Captures the output and returns it to the browser

This means you have full access to your app's Sails environment — models, helpers, config, and everything else.

::: info Execution Timeout
Each Helm execution has a **30-second timeout**. Long-running queries will be terminated automatically.
:::

## Using Helm

### Querying Models

All your Sails models are available globally:

```javascript
// Find all users
await User.find()

// Find with criteria
await User.find({ role: 'admin' })

// Count records
await User.count()

// Find one
await User.findOne({ email: 'admin@example.com' })

// With associations
await User.find().populate('posts')
```

### Using Helpers

Call your Sails helpers directly:

```javascript
// Send an email
await sails.helpers.mail.send({
  to: 'test@example.com',
  subject: 'Test from Helm',
  template: 'email-test'
})

// Use any custom helper
await sails.helpers.payments.calculateTotal({ orderId: 123 })
```

### Inspecting Configuration

```javascript
// View custom config
sails.config.custom

// Check environment
sails.config.environment

// View datastore config
sails.config.datastores
```

### Advanced Queries

```javascript
// Raw SQL (PostgreSQL)
await sails.sendNativeQuery('SELECT COUNT(*) FROM "user"')

// Complex Waterline queries
await Post.find({
  where: { status: 'published' },
  sort: 'createdAt DESC',
  limit: 10
}).populate('author')

// Aggregations
await Order.sum('total')
```

## Use Cases

### Debugging a User Issue

```javascript
// Find the user
const user = await User.findOne({ email: 'customer@example.com' })

// Check their orders
await Order.find({ user: user.id }).sort('createdAt DESC')
```

### Quick Data Fixes

```javascript
// Update a single record
await User.updateOne({ email: 'customer@example.com' }).set({
  emailVerified: true
})
```

### Testing Helpers

```javascript
// Test email sending
await sails.helpers.mail.send({
  to: 'your-email@example.com',
  subject: 'Test',
  template: 'email-test'
})
```

## Best Practices

### 1. Always Use `.limit()`

```javascript
// Good
await User.find().limit(10)

// Risky in production — could return millions of rows
await User.find()
```

### 2. Never Store Credentials

Don't type passwords or API keys in the Helm — treat it as a shared console.

### 3. Test Queries Locally First

Test complex queries in development before running in production.

### 4. Use Transactions for Multiple Updates

```javascript
await sails.getDatastore().transaction(async (db) => {
  await User.updateOne({ id: 1 }).set({ credits: 100 }).usingConnection(db)
  await Transaction.create({ userId: 1, amount: 100 }).usingConnection(db)
})
```

## Troubleshooting

### "App Not Running"

Helm requires your app to be running. Check the app status on your environment page and review deployment logs if the app has crashed.

### "Execution Timeout"

The query took too long (>30 seconds).

1. Add `.limit()` to large queries
2. Add indexes to frequently queried columns
3. Simplify the query

## What's Next?

- Learn about [Bridge](/slipway/bridge) for visual data management
- Set up [Database Services](/slipway/database-services) for your app
- Configure [Environment Variables](/slipway/environment-variables)
