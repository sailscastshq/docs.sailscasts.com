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

Helm is a production REPL for your Sails applications.

## What is Helm?

Helm gives you a live REPL connected to your running Sails application:

- Query your database using Waterline models
- Execute Sails helpers
- Inspect configuration
- Debug issues in real-time
- Inspect returned values as tables, expandable trees, or raw text
- All without SSH or direct database access

## Accessing Helm

### Via Dashboard

1. Go to your project in Slipway
2. Select an environment and click the app name from the Apps list
3. Click the ellipsis dropdown menu and select **Helm**
4. Start typing in the REPL interface

Your app must be running for Helm to work — it executes code inside the running container.

## How It Works

When you run code in Helm, Slipway:

1. Parses your editor contents as the body of an async JavaScript function
2. Returns the complete final top-level expression, if there is one
3. Starts an isolated process and boots the Sails application without its HTTP server
4. Executes project Helm inside the running app container via `docker exec`
5. Captures console logs separately from the final value, timing, and structured errors
6. Lowers the Sails application and terminates the isolated process

This means you have full access to your app's Sails environment — models, helpers, config, and everything else.

Project Helm and Bosun Helm use the same parser and result contract. Valid JavaScript therefore behaves the same in both consoles.

::: info Execution Timeout
Each Helm execution has a **30-second wall-clock timeout**. This covers synchronous code, awaited work, and application boot. A timed-out execution is terminated, so it cannot continue running after Helm reports the timeout.
:::

::: info Bounded output
Helm accepts up to **64 KB of source**, captures up to **64 KB of console logs**, and bounds the serialized result. If output is too large, Helm returns the safe portion and marks the result as truncated instead of buffering without limit.
:::

## Using Helm

### Inspecting Results

Helm chooses the clearest view for the returned value:

- A non-empty array of flat records with the same fields opens as a **Table**.
- A nested object or array opens as an expandable **Tree**.
- Strings, primitive values, and exact serialized output remain available in **Raw**.

The compact icon view switcher only shows choices that apply to the current value.
Hover an icon to see its Table, Tree, or Raw tooltip; every button also has an
accessible name. Tables preserve their column layout and scroll horizontally when
needed. `null` values appear as `NULL`, booleans and numbers remain visibly typed,
dates use their ISO value, and long values stay bounded instead of widening the whole
workspace.

Console calls are not mixed into the returned value. When an execution logs output,
Helm adds a small **Console** disclosure below the result and immediately above the
bottom view controls. It stays collapsed after a successful run and opens automatically
when the execution fails. Expanded logs grow upward inside a bounded scrolling area, so
diagnostics remain available without replacing the result.

Use the result ellipsis menu to:

- **Copy as JSON** for the complete value received by the browser
- **Export CSV** when the result is compatible with the table view
- **Clear result** in project Helm

CSV exports preserve the visible columns and protect text values from being interpreted
as spreadsheet formulas. If the bounded runtime had to shorten the value or its logs,
the result bar displays **Truncated** beside the execution time.

Returned strings are always treated as data. HTML inside a result is escaped and shown
as text; Helm never inserts it as executable page markup.

Project Helm keeps recent runs for the current page session. Select an entry to put its
source back in the editor, or use **Clear** to remove the recent-run list. Clearing
history does not change the editor or the current result.

### Run a Selection or the Whole Editor

Helm runs the current selection when you have selected code. The existing **Run** button changes to **Run selection**, and <kbd>⌘ Enter</kbd> on macOS or <kbd>Ctrl Enter</kbd> elsewhere follows the same rule.

When there is no selection, Helm runs the whole editor. A whitespace-only selection is not executable, so Helm disables the run action instead of unexpectedly running code outside the selection.

Only the selected source is sent for execution. Definitions elsewhere in the editor are not silently included. Helm keeps the selection and keyboard focus after the result arrives so you can adjust the same query and rerun it quickly.

Syntax and runtime errors still point to the original line and column in the editor, even when the selected code begins partway through the document.

When Helm can map a failure to submitted source, it underlines the relevant token and
places a concise message on that line. The result pane repeats the error and its original
line and column. Runtime and VM frames remain inside a closed **Stack trace** disclosure,
so they are available for deeper debugging without obscuring the source-level failure.
Editing the source or completing a successful run clears the stale diagnostic.

### Multi-line JavaScript

Write normal multi-line JavaScript. You do not need to add `return` before the final query:

```javascript
const now = new Date().toISOString()

await Creator.find({
  where: {
    subscriptionStatus: 'active',
    subscriptionEndsAt: { '>=': now }
  },
  select: ['publicId', 'subscriptionProvider', 'subscriptionStatus']
})
```

Helm parses the whole snippet, recognizes the complete `await Creator.find(...)` expression, and displays its value.

The execution rules are:

- Top-level `await` works.
- The complete final top-level expression becomes the displayed value.
- An explicit top-level `return` is preserved.
- A final declaration or control statement produces no value unless you log or explicitly return one.
- `return` inside a nested function, string, regular expression, or comment does not change how the outer snippet runs.
- `console.log()`, `console.info()`, `console.warn()`, and `console.error()` stay ordered ahead of the final value.

For example:

```javascript
console.log('Checking active subscriptions')

const creators = await Creator.find({
  subscriptionStatus: 'active'
}).limit(10)

creators.map((creator) => ({
  publicId: creator.publicId,
  provider: creator.subscriptionProvider
}))
```

Helm keeps the log in the **Console** disclosure and presents the mapped array
separately in its table, tree, or raw representation.

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

### Source-oriented errors

Syntax and runtime errors refer to `helm-input.js` and report the line and column from the code in the editor. The Sails bootstrap wrapper is not counted, so `2:9` means line 2, column 9 of your submitted snippet.

Values are formatted without reading property getters. Helm also handles circular objects and JavaScript values such as `BigInt`, `Date`, `Error`, `Map`, and `Set` without failing the entire execution.

## What's Next?

- Learn about [Bridge](/slipway/bridge) for visual data management
- Set up [Database Services](/slipway/database-services) for your app
- Configure [Environment Variables](/slipway/environment-variables)
