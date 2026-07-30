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
- Keep independent named scratchpads for different investigations
- Find and reuse your source-only execution history
- Save personal or project snippets without running them
- Bind executions to the exact app, container, and deployment target
- Require a short-lived write arm for obvious production mutations
- Record privacy-safe production execution audits for owners and admins
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

### Stopping and reading execution status

While Helm is evaluating code, **Run** becomes **Stop** and the result pane shows the
elapsed wall-clock time. Stop works for both synchronous code and awaited work. It
terminates the isolated process; in project Helm, Slipway also verifies and terminates
the exact Node process inside the app container. Closing the request has the same
effect, so disconnected work cannot continue invisibly.

The result bar distinguishes **Success**, **Error**, **Timed out**, and **Cancelled**.
It also reports the row count when the result is an array, serialized output size,
duration, and whether output was truncated. Console lines captured before a timeout or
cancellation remain available when safe and are labelled **partial**.

Each run has a unique execution ID. If you stop one run and immediately start another,
a late response from the older run cannot replace the newer result.

## Using Helm

### Sails-aware completion

Helm completes the Sails application that is actually connected to the editor. Start
typing a model global such as `Cre`, a helper path such as `sails.helpers.mail`, or a
config path such as `sails.config.custom` to see matching suggestions.

Completion understands:

- model global IDs such as `Creator`, `Invoice`, and `User`
- model attributes inside criteria, selection, sorting, and `Model.attributes`
- Waterline model methods and chained query modifiers
- `sails.helpers` namespaces and helper names
- `sails.config` keys and their value types
- lowercase model identities under `sails.models`

Use <kbd>↑</kbd> and <kbd>↓</kbd> to move through suggestions, <kbd>Enter</kbd> to
accept one, and <kbd>Esc</kbd> to close the list. <kbd>Ctrl Space</kbd> opens
completion explicitly. The existing <kbd>⌘ Enter</kbd> or <kbd>Ctrl Enter</kbd>
shortcut still runs the current selection or editor.

Project Helm reads names and types from the running app in the selected environment.
Bosun reads the same metadata from Slipway itself. Helm refreshes project metadata
when the page regains focus, so returning after a deployment picks up the new app
shape. If the app is stopped, still booting, or cannot be inspected, the editor
continues to work without completion.

::: info Configuration values stay private
Completion returns configuration key names and value types only. It does not return
configuration values, model records, attribute defaults, credentials, tokens, or
secrets to the browser.
:::

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
- **Copy diagnostics** for target and execution metadata without returned values
- **Clear result** in project Helm

CSV exports preserve the visible columns and protect text values from being interpreted
as spreadsheet formulas. If the bounded runtime had to shorten the value or its logs,
the result bar displays **Truncated** beside the execution time.

Returned strings are always treated as data. HTML inside a result is escaped and shown
as text; Helm never inserts it as executable page markup.

### Inspect intermediate values

Add `// @inspect` after a complete expression when you want to see its value without
changing the final result:

```javascript
const creators = await Creator.find({
  subscriptionStatus: 'active'
}) // @inspect

creators.map((creator) => creator.publicId)
```

Helm parses the marker as JavaScript syntax and shows the captured value on the same
editor line. It also works after a single variable initializer and inside a loop. A
string containing `// @inspect`, a partial expression, or a marker on its own line does
not activate inspection.

An expression is evaluated once. Inspection returns that exact value to the surrounding
program, so adding the marker does not repeat a query or change what the snippet
returns. A loop keeps at most 20 values for one marker and reports how many additional
values were omitted. Editing the source or starting another run clears the old inline
values.

Inline values are bounded with the rest of the Helm result and exist only in the
current execution response. They are not copied into Helm history or audit events.

### Trace Waterline and native queries

Add the exact opt-in directive `// @trace queries` anywhere in the submitted source to
record database work started by that execution:

```javascript
// @trace queries

await Creator.find({
  subscriptionStatus: 'active'
}).limit(10)
```

The **Queries** disclosure appears above the result controls and shows:

- Waterline model and method, such as `creator.find`;
- datastore, duration, and success or error status;
- the shape of Waterline criteria with every value replaced by `[value]`; and
- `sendNativeQuery` statements with comments, quoted literals, and numeric literals
  removed.

Tracing is off by default, so ordinary Helm executions do not install query
instrumentation. When enabled, it is scoped to the isolated execution's asynchronous
context; unrelated application startup or background work is not included. Helm keeps
at most 100 trace entries and reports any omitted remainder. Bind values, criteria
values, and query error messages are never included in the trace.

Query tracing is diagnostic visibility, not permission to write. Project Helm still
applies the production mutation classifier and write-arm flow before executing source.

### Named scratchpads

Use the tab strip above the editor to keep several investigations open without
replacing the source already in Helm. Each scratchpad remembers its name, source, and
selected result view. The ellipsis menu lets you rename, duplicate, reorder, close, or
save the active scratchpad as a snippet. You can also double-click a tab to rename it
and use <kbd>←</kbd> and <kbd>→</kbd> while a tab is focused to move between tabs.

The breadcrumb identifies the app and environment for current-target tabs, so Helm does
not repeat that context on every tab. A tab from another target displays its app and
environment directly. Opening it navigates Helm to that target before the source can
run. Slipway asks for confirmation first when the destination is production, so a
scratchpad cannot silently change where an execution will happen.

Scratchpad source and view preference are stored in the current browser and restored
after reload. Returned values, console output, logs, and errors stay in memory only and
are discarded on reload. A dot on a tab means its source has changed since its last
successful whole-editor run or since it was saved as a snippet.

Helm keeps at most 20 scratchpads in the browser. Use snippets for durable commands that
need to be shared with a team or reused beyond the current browser.

### Durable history

Use the **History** icon beside Run to open your history for the current project
environment. History follows your Slipway account across navigation and browser
sessions. It is private to you and remains separated by project and environment.

Each entry stores only:

- the JavaScript source you executed;
- status and duration;
- the project, environment, app, container, and deployment version target; and
- the execution time.

Returned records, console output, captured logs, and error details are never stored in
Helm history. Slipway writes a separate security audit event without copying the
executed source or returned data into its details. Clearing editable history therefore
does not remove the audit trail.

Select an entry to load it into the editor. Its ellipsis menu can also rerun, pin,
save, or delete it. Rerun still uses a fresh execution ID and follows the same timeout
and output bounds as a new run. Search matches the stored source.

**Clear** removes the unpinned history for this user and environment. Pinned runs stay
until you unpin or explicitly delete them. Unpinned history is retained for 30 days
and capped at 200 entries per user, project, and environment by default. A Slipway
operator can change those bounds:

```text
SLIPWAY_HELM_HISTORY_RETENTION_DAYS=30
SLIPWAY_HELM_HISTORY_MAX_ENTRIES=200
```

### Production target and write arming

The Helm breadcrumb identifies the active project, environment, and app. Slipway
resolves the container and deployment again on the server for every execution. The
production mutation confirmation shows that resolved target before writes can be
armed, and **Copy diagnostics** includes it without including returned values.

Slipway parses every project Helm submission on the server. When it sees an obvious
Waterline create, update, destroy, collection mutation, native query, or recognizable
external side effect in production, Helm pauses instead of sending the source to the
container.

Choose **Arm writes** only after reviewing the target and detected calls. The arm:

- expires after 60 seconds by default;
- belongs to the current signed-in user and team;
- is bound to the exact source hash, app, container, and deployment version;
- is persisted only as a token hash; and
- is consumed by one execution attempt.

Editing the source or deploying a new version invalidates the arm. Operators can
shorten the window:

```text
SLIPWAY_HELM_WRITE_ARM_TTL_SECONDS=60
```

::: warning Safety friction, not a sandbox
Mutation detection is deliberately described as a heuristic. Arbitrary JavaScript
can construct or hide side effects that static analysis cannot prove. Strong
read-only enforcement requires read-only database credentials and restricted runtime
capabilities.
:::

### Production audit

Team owners and admins can open **Settings → Audit Log**, filter to Helm, and search
by action, target, source hash, person, resource, or IP address. Team members cannot
open the audit page or its JSON endpoint.

Helm records the actor, target, request IP, SHA-256 source hash, source and output byte
counts, start time, duration, status, classifier metadata, and whether writes were
armed. Blocked execution attempts and write-arm actions are separate events.

The audit event never stores submitted source, returned values, console logs,
credentials, or full production records. Audit is therefore independent from the
private, editable source history.

Helm audit events are retained for 90 days and capped at 5,000 entries per team by
default:

```text
SLIPWAY_HELM_AUDIT_RETENTION_DAYS=90
SLIPWAY_HELM_AUDIT_MAX_ENTRIES=5000
```

### Reusable snippets

Use the **Snippets** icon beside Run to keep repeatable Helm source under a clear name.
You can save the whole editor, the current selection, or an existing history entry.
Selecting a snippet inserts its source into the editor and **never executes it**. Review
the source, then press Run when you are ready.

A snippet can be:

- **Personal** — visible only to you in that project.
- **Project** — visible to Slipway team members who can access that project.

A project snippet keeps its creator as the owner. Other project members can insert it,
but only its owner can rename it, replace its source, change its visibility, or delete
it. This prevents a shared operational command from being overwritten accidentally.
The list shows the owner as provenance.

Snippet source follows the same 64 KB maximum as a Helm execution. Snippet lifecycle
events are audited without copying the snippet source into audit details.

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

Don't type passwords or API keys in Helm. Source history is private to your account,
but credentials still do not belong in executable source or operational history.

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
