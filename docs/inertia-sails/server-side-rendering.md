---
title: Server-side rendering
editLink: true
prev:
  text: Root view
  link: '/inertia-sails/root-view'
next:
  text: Asset versioning
  link: '/inertia-sails/asset-versioning'
---

Inertia pages normally render in the browser after Sails sends the root EJS view and the page object. Server-side rendering lets Sails render selected Inertia pages to HTML before the response leaves the server.

SSR is useful when the first response matters: public landing pages, content pages, pricing pages, marketing pages, and any route where search engines, link previews, or first paint deserve real HTML.

## Enable SSR

The shortest configuration enables SSR for every Inertia page:

```js
// config/inertia.js
module.exports.inertia = {
  ssr: true
}
```

This is shorthand for:

```js
module.exports.inertia = {
  ssr: {
    enabled: true,
    pages: true
  }
}
```

When your app has `assets/js/ssr.js`, `rsbuild-plugin-inertia` builds the server bundle automatically. Sails reads the bundle from `.tmp/ssr/inertia.mjs`.

## Render Selected Pages

Most apps should start with selective SSR. It gives public pages better HTML while keeping private, app-like screens on the normal client-rendered path.

```js
// config/inertia.js
module.exports.inertia = {
  ssr: {
    enabled: true,
    pages: ['index', 'pricing', /^blog\//]
  }
}
```

The `pages` option accepts:

- `true` to render every page
- a page name like `'index'`
- a regular expression like `/^blog\//`
- an array of names and regular expressions
- a function that receives the component name and page object

You can opt out for a single response:

```js
module.exports = {
  exits: {
    success: { responseType: 'inertia' }
  },

  fn: async function () {
    return {
      page: 'dashboard/index',
      ssr: false
    }
  }
}
```

## Root View

Your root EJS view should render the SSR body when it exists, and fall back to the normal client-rendered shell otherwise.

```html
<% const inertiaSsr = typeof ssr !== 'undefined' ? ssr : null %>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <%- shipwright.styles() %> <%- inertiaSsr && inertiaSsr.head ?
    inertiaSsr.head.join('\n') : '' %>
  </head>
  <body>
    <% if (inertiaSsr && inertiaSsr.body) { %> <%- inertiaSsr.body %> <% } else
    { %>
    <div id="app"></div>
    <script type="application/json" data-page="app">
      <%- JSON.stringify(page).replace(/</g, '\\u003c') %>
    </script>
    <% } %> <%- shipwright.scripts() %>
  </body>
</html>
```

Vue SSR output includes `data-server-rendered="true"` on the app element. That is not an Inertia protocol field; it is framework output that tells the client to hydrate the server-rendered DOM instead of replacing it.

## SSR or EJS?

Use EJS when the page is mostly HTML and does not need Inertia navigation, client-side form state, shared props, layouts, or page components. EJS is still the simplest path for traditional server-rendered pages, small static views, health pages, and hybrid Sails apps that already have server-rendered screens.

Use Inertia without SSR when the route behaves like an application screen: authenticated dashboards, settings pages, internal tools, and workflows where the user is already inside the app and client-side navigation matters more than view-source HTML.

Use Inertia with SSR when the page benefits from both: real HTML on the first response and the richer Inertia client experience after hydration.

## Performance Notes

SSR improves the first response for the right pages, but it is not free. The server now renders the component tree, so CPU work moves from the browser to Sails.

Start with public pages, measure, then widen the selector when the app proves it is safe.

Good SSR candidates:

- home, pricing, marketing, documentation, blog, and public content pages
- pages with stable props and important SEO text
- pages where link previews and crawlers need meaningful HTML

Poor SSR candidates:

- pages that depend heavily on `window`, `document`, `localStorage`, or browser-only libraries
- private dashboards where SEO does not matter
- pages with very expensive personalized rendering
- pages where deferred props should stay deferred for faster response time

Keep SSR pages boring:

- fetch data in Sails actions, not inside component setup
- guard browser-only code behind mounted/effect hooks
- keep expensive data as deferred props when it does not need to be in the first HTML
- use `sails.inertia.once()` for shared data that can be cached safely
- keep Shipwright on `1.4.0` or newer so only initial entry assets are injected and async chunks stay lazy

If SSR fails, inertia-sails falls back to the client-rendered shell by default. You can make SSR failures throw during debugging:

```js
module.exports.inertia = {
  ssr: {
    enabled: true,
    pages: true,
    fallback: false
  }
}
```
