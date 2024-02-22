---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-flash-social.png
title: Getting started
titleTemplate: Sails Flash
description: Getting started with Sails Flash in a Sails application
next: false
editLink: true
---

# Introduction

Sails Flash is a lightweight hook for [Sails.js](https://sailsjs.com/) based on connect-flash that streamlines the handling of flash messages in your web applications.

Flash messages are temporary messages displayed to users, commonly used for providing feedback after form submissions, indicating successful or failed actions, and communicating validation errors.

## Getting started

To get started with Sails Flash, simply install it by running:

```bash
npm install sails-flash
```

And that's it, you can now set and read flash messages in your Sails applications anywhere you have access to the `req` object.

## Set a flash message

```js
req.flash('message', 'User updated successfully')
```

::: tip
The key can be any string you want. For convention you can limit the key to `success`, `error`, `message`
:::

## Read a flash message

```js
req.flash('message')
```

::: tip
Reading a flash message will unset it after the first time it is read(that's how flash messages works).
:::

## Star the repo :star:

::: tip Star the Sails Flash repo on GitHub :star:
If you like Sails Flash, show it some love with [a star on GitHub](https://github.com/sailscastshq/sails-flash).
:::
