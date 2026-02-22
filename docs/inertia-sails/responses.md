---
title: Inertia Responses
editLink: true
prev:
  text: Basic usage
  link: '/inertia-sails/basic-usage'
next:
  text: Redirects
  link: '/inertia-sails/redirects'
---

# Inertia Responses

inertia-sails uses Sails custom responses to handle Inertia page rendering. This integrates seamlessly with Sails' actions2 pattern.

## Basic Usage

To send an Inertia response, specify `responseType: 'inertia'` in your action's exits and return an object with `page` and optional `props`:

```js
// api/controllers/dashboard/view-dashboard.js
module.exports = {
  friendlyName: 'View dashboard',

  description: 'Display the dashboard page.',

  exits: {
    success: {
      responseType: 'inertia'
    }
  },

  fn: async function () {
    return {
      page: 'dashboard/index',
      props: {
        stats: await Stats.find()
      }
    }
  }
}
```

## Response Object

The response object accepts these properties:

| Property | Type   | Description                                    |
| -------- | ------ | ---------------------------------------------- |
| `page`   | string | **Required.** The frontend component to render |
| `props`  | object | Data passed to the component                   |
| `locals` | object | Data passed to the root EJS template           |

### Page

The `page` property specifies which frontend component to render. This maps to your component file structure:

```js
return {
  page: 'users/index' // Renders assets/js/pages/users/index.vue (or .jsx)
}
```

### Props

Props are passed directly to your frontend component:

```js
return {
  page: 'users/show',
  props: {
    user: await User.findOne({ id: inputs.id }),
    posts: await Post.find({ author: inputs.id })
  }
}
```

Access these in your component:

```vue
<script setup>
defineProps({
  user: Object,
  posts: Array
})
</script>
```

### Locals

Locals are passed to your root EJS template, not to the frontend component. Use this for page titles, meta tags, or other server-rendered content:

```js
return {
  page: 'users/show',
  props: { user },
  locals: {
    title: `${user.fullName} - Profile`,
    description: user.bio
  }
}
```

Access in your EJS template:

```html
<head>
  <title><%= locals.title || 'My App' %></title>
  <meta name="description" content="<%= locals.description || '' %>" />
</head>
```

See [Locals](/inertia-sails/locals) for the full API, precedence rules, and real-world examples.

## Custom Response Files

inertia-sails requires two custom response files in your `api/responses/` directory:

- **inertia.js** - Handles Inertia page responses
- **inertiaRedirect.js** - Handles Inertia redirects

If you used `create-sails`, these are already set up. Otherwise, copy them from the [boring-stack templates](https://github.com/sailscastshq/boring-stack/tree/main/templates).
