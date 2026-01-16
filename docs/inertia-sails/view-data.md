---
title: View Data
editLink: true
prev:
  text: Flash messages
  link: '/inertia-sails/flash-messages'
next:
  text: Once props
  link: '/inertia-sails/once-props'
---

# View Data

View data is passed to your root EJS template, not to the frontend component. This is useful for server-rendered content like page titles, meta tags, or other HTML that needs to be rendered before the JavaScript loads.

## Basic Usage

Use `sails.inertia.viewData()` to share data with the root template:

```js
sails.inertia.viewData('title', 'Dashboard - My App')
sails.inertia.viewData('description', 'View your account dashboard')
```

## In Actions

You can set view data from within your action:

```js
module.exports = {
  exits: {
    success: { responseType: 'inertia' }
  },

  fn: async function () {
    const user = await User.findOne({ id: this.req.session.userId })

    sails.inertia.viewData('title', `${user.fullName} - Profile`)
    sails.inertia.viewData('ogImage', user.avatarUrl)

    return {
      page: 'profile/show',
      props: { user }
    }
  }
}
```

## Via Response Object

You can also pass view data directly in the response:

```js
return {
  page: 'users/show',
  props: { user },
  viewData: {
    title: `${user.fullName} - Profile`,
    description: user.bio
  }
}
```

## Accessing in Templates

View data is available as local variables in your EJS template:

```html
<!-- views/app.ejs -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title><%= typeof title !== 'undefined' ? title : 'My App' %></title>
    <meta
      name="description"
      content="<%= typeof description !== 'undefined' ? description : 'Default description' %>"
    />
    <% if (typeof ogImage !== 'undefined') { %>
    <meta property="og:image" content="<%= ogImage %>" />
    <% } %> <%- shipwright.styles() %>
  </head>
  <body>
    <div id="app" data-page="<%- JSON.stringify(page) %>"></div>
    <%- shipwright.scripts() %>
  </body>
</html>
```

## Common Use Cases

### SEO Meta Tags

```js
sails.inertia.viewData('title', 'Blog Post Title')
sails.inertia.viewData('description', 'Post excerpt...')
sails.inertia.viewData('ogImage', '/images/blog/post-cover.jpg')
```

### Structured Data

```js
sails.inertia.viewData(
  'structuredData',
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    author: post.author.name
  })
)
```

### Custom Head Scripts

```js
sails.inertia.viewData('analyticsId', 'UA-XXXXX-Y')
```

## View Data vs Props

| Feature      | `viewData()`   | `props`            |
| ------------ | -------------- | ------------------ |
| Available in | EJS template   | Frontend component |
| Rendered     | Server-side    | Client-side        |
| Use case     | SEO, meta tags | Component data     |

Use `viewData()` for content that needs to be in the initial HTML (SEO, meta tags). Use `props` for data your frontend components need.
