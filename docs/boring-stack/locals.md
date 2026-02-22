---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Locals
titleTemplate: The Boring JavaScript Stack 🥱
description: Pass data to the root EJS template for SEO meta tags, Open Graph images, page titles, and more.
prev:
  text: Infinite scroll
  link: '/boring-stack/infinite-scroll'
next:
  text: Authentication
  link: '/boring-stack/authentication'
editLink: true
---

# Locals

Locals let you pass data from your actions to the root EJS template (`views/app.ejs`). They're perfect for SEO meta tags, page titles, Open Graph images, and anything that belongs in the HTML `<head>`.

Unlike props which go to your React/Vue/Svelte components, locals only go to the EJS template on the initial full-page load — which is exactly when search engines and social media crawlers read your HTML.

## Setting locals from actions

Return a `locals` object alongside `page` and `props`:

```js
module.exports = {
  exits: {
    success: { responseType: 'inertia' }
  },
  fn: async function () {
    const course = await Course.findOne({ slug: this.req.param('slug') })

    return {
      page: 'courses/show',
      props: { course },
      locals: {
        // [!code focus:5]
        title: course.title,
        description: course.description,
        ogImage: course.thumbnailUrl
      }
    }
  }
}
```

## Setting locals from hooks

Use `sails.inertia.local()` to set locals for the current request, or `sails.inertia.localGlobally()` for app-wide defaults:

```js
// api/hooks/custom/index.js
module.exports = function defineCustomHook(sails) {
  return {
    initialize: async function () {
      // Default for every page
      sails.inertia.localGlobally('title', 'My App') // [!code focus]
    },
    routes: {
      before: {
        'GET /*': {
          skipAssets: true,
          fn: async function (req, res, next) {
            // Override for this request
            sails.inertia.local('canonicalUrl', `https://myapp.com${req.path}`) // [!code focus]
            return next()
          }
        }
      }
    }
  }
}
```

## Using locals in EJS

Access locals through EJS's built-in `locals` object with `||` fallbacks:

```html
<!-- views/app.ejs -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= locals.title || 'My App' %></title>
    <!-- [!code focus:3] -->
    <meta name="description" content="<%= locals.description || '' %>" />
    <meta
      property="og:image"
      content="<%= locals.ogImage || '/images/og.png' %>"
    />
    <%- shipwright.styles() %>
  </head>
  <body>
    <div id="app" data-page="<%= JSON.stringify(page) %>"></div>
    <%- shipwright.scripts() %>
  </body>
</html>
```

::: tip Why `locals.title` instead of bare `title`?
In EJS, referencing an undeclared variable throws a ReferenceError. The `locals` object is always available in EJS — accessing a missing property on it safely returns `undefined`.
:::

## Precedence

Locals merge in this order (last wins):

1. **Global** — `sails.inertia.localGlobally()` (app-wide default)
2. **Request-scoped** — `sails.inertia.local()` (set in hooks/middleware)
3. **Action** — `return { locals: { ... } }` (set in the action)

An action's locals always take priority over globals and request-scoped locals.

::: info
See the full [Locals API reference](/inertia-sails/locals) for more examples including structured data (JSON-LD), per-page canonical URLs, and conditional locals.
:::
