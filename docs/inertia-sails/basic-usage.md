---
title: Basic Usage
editLink: true
prev:
  text: Configuration
  link: '/inertia-sails/configuration'
next:
  text: Inertia responses
  link: '/inertia-sails/responses'
---

# Basic Usage

This guide covers the essential patterns for using inertia-sails in your application.

## Creating Pages

### 1. Define an Action

Create a Sails action that returns an Inertia response:

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
    const user = await User.findOne({ id: this.req.session.userId })
    const stats = await Stats.find({ user: user.id })

    return {
      page: 'dashboard/index',
      props: {
        user,
        stats
      }
    }
  }
}
```

### 2. Create the Frontend Component

Create a Vue or React component at the path specified in `page`:

**Vue (assets/js/pages/dashboard/index.vue)**

```vue
<script setup>
defineProps({
  user: Object,
  stats: Array
})
</script>

<template>
  <div>
    <h1>Welcome, {{ user.fullName }}</h1>
    <div v-for="stat in stats" :key="stat.id">
      {{ stat.name }}: {{ stat.value }}
    </div>
  </div>
</template>
```

**React (assets/js/pages/dashboard/index.jsx)**

```jsx
export default function Dashboard({ user, stats }) {
  return (
    <div>
      <h1>Welcome, {user.fullName}</h1>
      {stats.map((stat) => (
        <div key={stat.id}>
          {stat.name}: {stat.value}
        </div>
      ))}
    </div>
  )
}
```

### 3. Configure the Route

Add a route in `config/routes.js`:

```js
module.exports.routes = {
  'GET /dashboard': 'dashboard/view-dashboard'
}
```

## Sharing Data Globally

Share data that's needed across all pages:

```js
// api/hooks/custom/index.js
module.exports = function defineCustomHook(sails) {
  return {
    routes: {
      before: {
        'GET /*': {
          skipAssets: true,
          fn: async function (req, res, next) {
            // Share authenticated user
            if (req.session.userId) {
              const user = await User.findOne({ id: req.session.userId })
              sails.inertia.share('loggedInUser', user)
            }

            // Share flash messages
            if (req.session.flash) {
              sails.inertia.share('flash', req.session.flash)
              delete req.session.flash
            }

            return next()
          }
        }
      }
    }
  }
}
```

## Form Handling

### Submit Form

```vue
<script setup>
import { useForm } from '@inertiajs/vue3'

const form = useForm({
  fullName: '',
  email: ''
})

function submit() {
  form.post('/profile/update')
}
</script>

<template>
  <form @submit.prevent="submit">
    <input v-model="form.fullName" />
    <input v-model="form.email" type="email" />
    <button :disabled="form.processing">Save</button>
  </form>
</template>
```

### Handle Submission

```js
// api/controllers/profile/update-profile.js
module.exports = {
  inputs: {
    fullName: { type: 'string', required: true },
    email: { type: 'string', isEmail: true, required: true }
  },

  exits: {
    success: { responseType: 'inertiaRedirect' },
    badRequest: { responseType: 'badRequest' }
  },

  fn: async function ({ fullName, email }) {
    await User.updateOne({ id: this.req.session.userId }).set({
      fullName,
      email
    })

    sails.inertia.flash('success', 'Profile updated!')
    return sails.inertia.back('/profile')
  }
}
```

## Navigation

Use Inertia's Link component for SPA-like navigation:

**Vue**

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <Link href="/dashboard">Dashboard</Link>
  <Link href="/profile" method="post">Update Profile</Link>
</template>
```

**React**

```jsx
import { Link } from '@inertiajs/react'

function Nav() {
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/profile" method="post">
        Update Profile
      </Link>
    </nav>
  )
}
```

## Architecture Note

inertia-sails uses AsyncLocalStorage for request-scoped state. This ensures that `share()`, `flash()`, and other per-request APIs don't leak data between concurrent requests. This is transparent to your application code but critical for correctness in production.

## Next Steps

- [Responses](/inertia-sails/responses) - Learn about Inertia response options
- [Sharing Data](/inertia-sails/sharing-data) - Deep dive into data sharing
- [Once Props](/inertia-sails/once-props) - Cache expensive props
- [Flash Messages](/inertia-sails/flash-messages) - One-time notifications
