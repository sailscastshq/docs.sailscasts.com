---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Server-side rendering
titleTemplate: The Boring JavaScript Stack 🥱
description: Learn when to use EJS, client-rendered Inertia, and server-rendered Inertia in The Boring JavaScript Stack
prev:
  text: Layouts
  link: /boring-stack/layouts
next:
  text: Redirects
  link: /boring-stack/redirects
editLink: true
---

# Server-side rendering

The Boring JavaScript Stack gives you three useful rendering paths:

- EJS for classic server-rendered pages
- Inertia for client-rendered application screens
- Inertia SSR for pages that need real HTML on the first response and a rich Inertia app after hydration

You do not have to pick one forever. A Sails app can use EJS and Inertia side by side, and Inertia SSR can be enabled for selected pages.

## The Quick Rule

Use EJS when the page is mostly HTML.

Use client-rendered Inertia when the page behaves like an app.

Use Inertia SSR when the page needs both: meaningful first-response HTML and Inertia after the browser hydrates.

## When To Use EJS

EJS is still the simplest choice for traditional server-rendered pages. It has less moving machinery than an Inertia page because Sails renders the HTML directly and the browser receives the final document.

Good EJS candidates:

- static pages that do not need Inertia navigation
- health checks, embeds, and tiny utility pages
- existing Sails screens in a hybrid app
- pages with simple forms that do not need SPA state
- admin-only pages where plain server rendering is enough

EJS is also a good escape hatch. If a page does not benefit from a client-side page component, keeping it in EJS is not a step backward.

## When To Use Client-Rendered Inertia

Client-rendered Inertia is the default app experience in The Boring Stack. Sails owns routing and data loading, while Vue, React, or Svelte owns the page component in the browser.

Good client-rendered Inertia candidates:

- authenticated dashboards
- settings pages
- internal tools
- multi-step flows with client-side state
- screens where fast client-side navigation matters more than view-source HTML

This is usually the best fit once a user is already inside the app. Search crawlers and social previews do not need rich HTML for most private screens.

## When To Use Inertia SSR

Inertia SSR renders the initial page component on the server, then hydrates it in the browser. The user gets real HTML in the response, but the page still becomes an Inertia app after JavaScript loads.

Good SSR candidates:

- home pages
- pricing pages
- marketing pages
- documentation pages
- blog and public content pages
- public pages where search engines or link previews need meaningful HTML

Start with public pages first. SSR is powerful, but it moves rendering work onto the server, so it is worth being selective until the app proves the cost is worth it.

## Enable SSR For Every Inertia Page

First add an SSR source entry for your framework. Shipwright compiles this file into `.tmp/ssr/inertia.mjs`, which is the private bundle Sails imports at runtime.

::: code-group

```js [Vue]
// assets/js/ssr.js
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createInertiaApp } from '@inertiajs/vue3'

export default function render(page) {
  return createInertiaApp({
    page,
    render: renderToString,
    resolve: (name) => require(`./pages/${name}`),
    setup({ App, props, plugin }) {
      return createSSRApp({ render: () => h(App, props) }).use(plugin)
    }
  })
}
```

```jsx [React]
// assets/js/ssr.js
import { createInertiaApp } from '@inertiajs/react'
import ReactDOMServer from 'react-dom/server'

export default function render(page) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => require(`./pages/${name}`),
    setup({ App, props }) {
      return <App {...props} />
    }
  })
}
```

```js [Svelte]
// assets/js/ssr.js
import { createInertiaApp } from '@inertiajs/svelte'
import { render } from 'svelte/server'

export default function ssrRender(page) {
  return createInertiaApp({
    page,
    resolve: (name) => require(`./pages/${name}`),
    setup({ App, props }) {
      return render(App, { props })
    }
  })
}
```

:::

The SSR entry is separate from `assets/js/app.js` because it uses the framework server renderer instead of mounting into the browser DOM.

```js
// config/inertia.js
module.exports.inertia = {
  ssr: true
}
```

This is the shortest configuration. It enables SSR for all Inertia pages and uses the default bundle at `.tmp/ssr/inertia.mjs`.

## Enable SSR For Selected Pages

Most apps should start here.

```js
// config/inertia.js
module.exports.inertia = {
  ssr: {
    enabled: true,
    pages: ['index', 'pricing', /^blog\//]
  }
}
```

You can opt out per response:

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

## Performance Tips

SSR can improve first paint and SEO, but it is not automatically faster for every page. The server now renders the component tree before sending the response.

Keep SSR pages predictable:

- fetch data in Sails actions instead of component setup
- keep browser-only code behind mounted/effect hooks
- avoid direct `window`, `document`, and `localStorage` access during SSR
- keep expensive non-critical data as deferred props
- cache safe shared data with `sails.inertia.once()`
- measure response time and HTML size before enabling SSR everywhere

Shipwright `1.4.0` or newer is recommended for SSR apps. It injects only the initial entry assets from the Rsbuild manifest, so async page chunks stay lazy instead of being loaded on every page.

## Hybrid Apps

Hybrid apps are expected. You can keep existing EJS routes and add Inertia routes where the SPA workflow helps.

For example:

- `/about` can stay EJS
- `/pricing` can be Inertia SSR
- `/dashboard` can be client-rendered Inertia
- `/admin/tools/export` can stay EJS if it is just a server-rendered utility screen

The boundary should follow the user experience, not the framework. If a route is mostly document-like, EJS or SSR can make sense. If a route is workflow-heavy, Inertia usually earns its keep.
