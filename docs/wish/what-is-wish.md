---
title: What is Wish?
editLink: true
---

# {{ $frontmatter.title }}

Wish is the [OAuth](https://en.wikipedia.org/wiki/OAuth) Sails hook you wish(pun intended) exists for Sails.

Wish provides a simple, convenient way to authenticate with OAuth providers.

Wish supports [OAuth 2.0](https://oauth.net/2/) authentication and authorization via:

- [GitHub](/wish/github)
- [Google](/wish/google)

## Motivation

When building [Sailscasts](https://sailscasts.com), I needed an OAuth flow for to allow Sailscasts users to log in via GitHub.

So I wrote Wish as a Sails hook. This hook is an outcome of observing OAuth implementation in Sailscasts, aiming to spare you from writing the entire OAuth logic yourself.

Its primary purpose is to simplify supporting OAuth 2.0 authentication and authorization in Sails applications.
