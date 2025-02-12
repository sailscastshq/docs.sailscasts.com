---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Sharing data
titleTemplate: The Boring JavaScript Stack 🥱
description: Sharing data in The Boring JavaScript Stack
prev:
  text: Flash messages
  link: '/boring-stack/flash-messages'
next:
  text: Deferred props
  link: '/boring-stack/deferred-props'
editLink: true
---

# Sharing data

If you have data that you want to be provided as prop to your SPA (a common use-case is information about the authenticated user) you can use the `sails.inertia.share` method.

You can do this in `api/hooks/custom/index.js`.

## Example

Here is an example of sharing the logged in user data:

```js
module.exports = function defineCustomHook(sails) {
  return {
    /**
     * Runs when this Sails app loads/lifts.
     */
    initialize: async function () {
      sails.log.info('Initializing custom hook (`custom`)')
    },
    routes: {
      before: {
        'GET /': {
          skipAssets: true,
          fn: async function (req, res, next) {
            if (req.session.userId) {
              const loggedInUser = await User.findOne({
                id: req.session.userId
              })
              if (!loggedInUser) {
                delete req.session.userId
                return res.redirect('/login')
              }
              sails.inertia.share('loggedInUser', loggedInUser) // [!code focus]
              return next()
            }
            return next()
          }
        }
      }
    }
  }
}
```

::: info
Learn more about [sharing data](https://inertiajs.com/shared-data) on the Inertia docs.
:::
