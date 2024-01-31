---
title: What's in the stack?
titleTemplate: The Boring JavaScript Stack 🥱
description: The Boring JavaScript comes with Sails, Inertia, Tailwind CSS, and Vue, React, or Svelte. It's about proven technologies prioritizing stability and efficiency, letting you focus on solving real web development problems without the noise of constant updates.
prev:
  text: 'Who is it for?'
  link: '/boring-stack/who-is-it-for'
next:
  text: Getting started
  link: '/boring-stack/getting-started'
editLink: true
---

# What's in The Boring JavaScript Stack?

Alright, let's peel back the layers and take a look at what makes up **The Boring JavaScript Stack**.

## Vue, React, or Svelte

Whether you prefer the simplicity of [Vue](https://vuejs.org/), the flexibility of [React](https://reactjs.org/), or the efficiency of [Svelte](https://svelte.dev/), **The Boring JavaScript Stack** accommodates your choice. With The Boring JavaScript Stack, the UI of your app are simply the components of your chosen UI framework.

So if you enjoy writing React's JSX, you'd love The Boring JavaScript Stack as that's the only thing you have to know from React - writing components. Same thing with Vue and Svelte.

## Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/), the utility-first CSS framework makes styling feels like cheating. It that the styling backbone of this stack.

Since The Boring JavaScript Stack is about being pragmatic, what's better than Tailwind CSS in practicality, efficiency, and ensuring your styles are predictable and easy to manage?

## Inertia

[Inertia](https://inertiajs.com/) allows you to build modern single-page apps without the need for a full-blown API. It keeps things simple and straightforward, emphasizing stability in your UI(frontend) development.

## Sails

At the core of this stack is [Sails](https://sailsjs.com/), a web framework that's been around the block and has proven itself. It's not trying to reinvent the wheel; instead, it focuses on providing a solid foundation for building scalable and maintainable web applications.

Because we’re using Sails as the web framework, we can leverage a lot of its features including:

- [Authentication](https://sailsjs.com/documentation/concepts/sessions#how-sessions-work-in-sails-advanced-): Sails has a robust support for session-based authentication.
- [Sails Wish](https://docs.sailscasts.com/wish/): Easily setup OAuth flows with providers like [GitHub](https://docs.sailscasts.com/wish/github) or [Google](https://docs.sailscasts.com/wish/google) in your Sails applications.
- [Authorization](https://sailsjs.com/documentation/concepts/policies): Sails has policies which are versatile tools for authorization and access control: they let you execute some logic before an action is run in order to determine whether or not to continue processing the request.
- [Waterline ORM](https://sailsjs.com/documentation/concepts/models-and-orm): Sails comes installed with a powerful ORM/ODM called Waterline, a datastore-agnostic tool that dramatically simplifies interaction with one or more databases.
- [WebSocket support](https://sailsjs.com/documentation/concepts/realtime): Sails apps are capable of full-duplex, realtime communication between the client and server.
- [File uploads](https://sailsjs.com/documentation/concepts/file-uploads): [Skipper](https://github.com/sailshq/skipper) makes it easy to implement streaming file uploads to disk, S3, or any supported file upload adapters.
- [Shell scripts](https://sailsjs.com/documentation/concepts/shell-scripts): Sails lets you run JavaScript functions as shell scripts. This can be useful for running scheduled jobs (cron, Heroku scheduler), worker processes, and any other custom, one-off scripts that need access to your Sails app's models, configuration, and helpers.
- [Sails Mail](https://docs.sailscasts.com/mail/): Sails Mail provides an amazing and elegant API for sending emails.
