---
title: Root View
editLink: true
prev:
  text: History encryption
  link: '/inertia-sails/history-encryption'
next:
  text: Asset versioning
  link: '/inertia-sails/asset-versioning'
---

# Root View

The root view is the EJS template that wraps your Inertia page. inertia-sails allows you to change the root view per-request.

## Default Configuration

Set the default root view in `config/inertia.js`:

```js
module.exports.inertia = {
  rootView: 'app' // Uses views/app.ejs
}
```

## Per-Request Override

Use `sails.inertia.setRootView()` to change the root view for a specific request:

```js
module.exports = {
  exits: {
    success: { responseType: 'inertia' }
  },

  fn: async function () {
    // Use a different layout for auth pages
    sails.inertia.setRootView('auth')

    return {
      page: 'auth/login',
      props: {}
    }
  }
}
```

## Use Cases

### Different Layouts

Create multiple root templates for different sections:

```
views/
  app.ejs      # Main app layout
  auth.ejs     # Auth pages (login, register)
  admin.ejs    # Admin dashboard
  minimal.ejs  # Minimal layout for embeds
```

### Auth Pages

```js
// api/controllers/auth/view-login.js
module.exports = {
  exits: {
    success: { responseType: 'inertia' }
  },

  fn: async function () {
    sails.inertia.setRootView('auth')

    return {
      page: 'auth/login',
      props: {}
    }
  }
}
```

```ejs
<!-- views/auth.ejs -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <%- shipwright.styles() %>
</head>
<body class="auth-layout">
  <div id="app" data-page="<%- JSON.stringify(page) %>"></div>
  <%- shipwright.scripts() %>
</body>
</html>
```

### Admin Section

```js
// api/controllers/admin/view-dashboard.js
module.exports = {
  exits: {
    success: { responseType: 'inertia' }
  },

  fn: async function () {
    sails.inertia.setRootView('admin')

    return {
      page: 'admin/dashboard',
      props: {
        stats: await Stats.getAdminStats()
      }
    }
  }
}
```

### Embeddable Pages

```js
// api/controllers/embed/view-widget.js
module.exports = {
  exits: {
    success: { responseType: 'inertia' }
  },

  fn: async function () {
    // Minimal layout without navigation
    sails.inertia.setRootView('minimal')

    return {
      page: 'embed/widget',
      props: {
        data: await Widget.getData()
      }
    }
  }
}
```

## In Custom Hooks

Set root view based on route patterns:

```js
// api/hooks/custom/index.js
module.exports = function defineCustomHook(sails) {
  return {
    routes: {
      before: {
        'GET /admin/*': {
          skipAssets: true,
          fn: async function (req, res, next) {
            sails.inertia.setRootView('admin')
            return next()
          }
        },
        'GET /auth/*': {
          skipAssets: true,
          fn: async function (req, res, next) {
            sails.inertia.setRootView('auth')
            return next()
          }
        }
      }
    }
  }
}
```

## Template Examples

### Main App Template

```ejs
<!-- views/app.ejs -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><%= typeof title !== 'undefined' ? title : 'My App' %></title>
  <%- shipwright.styles() %>
</head>
<body>
  <div id="app" data-page="<%- JSON.stringify(page) %>"></div>
  <%- shipwright.scripts() %>
</body>
</html>
```

### Auth Template

```ejs
<!-- views/auth.ejs -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sign In - My App</title>
  <%- shipwright.styles() %>
</head>
<body class="min-h-screen bg-gray-50 flex items-center justify-center">
  <div id="app" data-page="<%- JSON.stringify(page) %>"></div>
  <%- shipwright.scripts() %>
</body>
</html>
```
