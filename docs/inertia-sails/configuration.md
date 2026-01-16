---
title: Configuration
editLink: true
prev:
  text: Installation
  link: '/inertia-sails/installation'
next:
  text: Basic usage
  link: '/inertia-sails/basic-usage'
---

# Configuration

inertia-sails is configured via `config/inertia.js`. Most apps work with zero configuration thanks to sensible defaults.

## Basic Configuration

```js
// config/inertia.js
module.exports.inertia = {
  // Root EJS template (default: 'app')
  rootView: 'app',

  // Asset version for cache busting (optional - auto-detected)
  // version: 'custom-version',

  // History encryption settings
  history: {
    encrypt: false
  }
}
```

## Root View

The `rootView` option specifies which EJS template to use as the root HTML document. This template receives the Inertia page data.

```js
module.exports.inertia = {
  rootView: 'app' // Uses views/app.ejs
}
```

Your root view should include the Inertia page data:

```html
<!-- views/app.ejs -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <%- shipwright.styles() %>
  </head>
  <body>
    <div id="app" data-page="<%- JSON.stringify(page) %>"></div>
    <%- shipwright.scripts() %>
  </body>
</html>
```

## Asset Versioning

See the [Asset Versioning](/inertia-sails/asset-versioning) page for details on how inertia-sails handles asset versioning automatically.

## History Encryption

Enable history encryption globally:

```js
module.exports.inertia = {
  history: {
    encrypt: true
  }
}
```

See [History Encryption](/inertia-sails/history-encryption) for per-request control.
