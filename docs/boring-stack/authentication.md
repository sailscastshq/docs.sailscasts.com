---
title: Authentication
titleTemplate: The Boring JavaScript Stack 🥱
description: Authentication in The Boring JavaScript Stack
prev:
  text: Sharing data
  link: '/boring-stack/sharing-data'
next:
  text: Authorization
  link: '/boring-stack/authorization'
editLink: true
---

# {{ $frontmatter.title }} {#authentication}

Authentication is the process of verifying the identity of a user, typically through credentials like a username and password. For example, logging into a GitHub account requires authentication.

The Boring JavaScript Stack manages its own authentication.

By default, the Boring JavaScript Stack offers you two mechanisms for authentication:

1. Email and Password authentication
2. Provider authentication

## Email and password authentication

When a user wishes to sign up for an account, they are asked for their email address. The Boring Stack will send them an email with a link to verify their email. The user can click the link to verify their email address.

The password is stored using the bcrypt algorithm and handled by the password helper from [Sails organics](https://github.com/sailshq/sails-hook-organics).

## Provider authentication

Using [Sails Wish](/wish/), The Boring Stack supports third-party authentication allowing you to easily add SSO(Single Sign On) to your application. Out of the box The Boring Stack supports [OAuth with Google](/wish/google). You can easily setup [OAuth with GitHub](/wish/github) as well.
