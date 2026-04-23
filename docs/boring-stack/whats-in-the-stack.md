---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: What's in the stack?
titleTemplate: The Boring JavaScript Stack 🥱
description: The Boring JavaScript Stack combines Sails, Inertia, Tailwind CSS, and Vue, React, or Svelte.
prev:
  text: 'Who is it for?'
  link: '/boring-stack/who-is-it-for'
next:
  text: Getting started
  link: '/boring-stack/getting-started'
editLink: true
---

# What's in The Boring JavaScript Stack?

The Boring JavaScript Stack combines Sails, Inertia, Tailwind CSS, and your choice of Vue, React, or Svelte.

## Vue, React, or Svelte

Pick one UI framework for the app's pages and components. Inertia uses those components as the client-side view layer.

## Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/) provides the utility classes used for styling pages and components.

## Inertia

[Inertia](https://inertiajs.com/) lets Sails controllers return pages and props without building a separate JSON API.

## Sails

At the core of this stack is [Sails](https://sailsjs.com/), which handles routing, policies, models, helpers, sessions, scripts, and other server-side behavior.

Because we’re using Sails as the web framework, we can leverage a lot of its features including:

- [Authentication](https://sailsjs.com/documentation/concepts/sessions#how-sessions-work-in-sails-advanced-): Sails has a robust support for session-based authentication.
- [Sails Wish](https://docs.sailscasts.com/wish/): Easily setup OAuth flows with providers like [GitHub](https://docs.sailscasts.com/wish/github) or [Google](https://docs.sailscasts.com/wish/google) in your Sails applications.
- [Authorization](https://sailsjs.com/documentation/concepts/policies): Sails has policies which are versatile tools for authorization and access control: they let you execute some logic before an action is run in order to determine whether or not to continue processing the request.
- [Waterline ORM](https://sailsjs.com/documentation/concepts/models-and-orm): Sails comes installed with a powerful [ORM/ODM](http://stackoverflow.com/questions/12261866/what-is-the-difference-between-an-orm-and-an-odm) called Waterline, a datastore-agnostic tool that dramatically simplifies interaction with one or more databases.
- [WebSocket support](https://sailsjs.com/documentation/concepts/realtime): Sails apps are capable of full-duplex, realtime communication between the client and server.
- [File uploads](https://sailsjs.com/documentation/concepts/file-uploads): [Skipper](https://github.com/sailshq/skipper) makes it easy to implement streaming file uploads to disk, Amazon S3, Cloudflare R2, DigitalOcean Spaces or any supported file upload adapters.
- [Shell scripts](https://sailsjs.com/documentation/concepts/shell-scripts): Sails lets you run JavaScript functions as shell scripts. This can be useful for running scheduled jobs with [Sails Quest](https://docs.sailscasts.com/sails-quest) (cron, Heroku scheduler), worker processes, and any other custom, one-off scripts that need access to your Sails app's models, configuration, and helpers.
- [Sails Mail](https://docs.sailscasts.com/mail/): Send email through a Sails hook and helper-based API.
- [Sails Quest](https://docs.sailscasts.com/sails-quest): Schedule background jobs in your Sails applications with human-readable intervals, cron expressions, and full access to your app's context.
