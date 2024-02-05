---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-content-social.png
title: Motivation
titleTemplate: Sails Content
description: Why Sails Content was created
next:
  text: Getting started
  link: '/content/getting-started'
editLink: true
---

# Motivation

I really like the DX of [Astro Content Collection](https://docs.astro.build/en/guides/content-collections/) and [Nuxt Content](https://content.nuxt.com/). They are quite superb for having static sites driven by `.md` files.

However, I find that when I needed a simple blog for [Hagfish](https://hagfish.io/blog), the only option I had if I wanted the DX of Astro or Nuxt with Markdown was to deploy the blog on a subdomain.

That means I'll have to maintain two separate codebases just to have a blog in Markdown with the developer experience (DX) of Astro.

Also, I have been thinking of bringing that developer experience (DX) to Sails developers ever since [Mike's keynote at Sailsconf 2022](https://youtu.be/OME5lQUJ4q4?si=umQ654LtAXGWSELT). I've also seen Sails being used to build static sites from Markdown at [Fleet](https://fleetdm.com/), but I didn't quite like the DX.

## Leveraging Shipwright

[Shipwright](https://github.com/sailshq/shipwright) is set to be the new modern asset pipeline for [Sails](https://sailsjs.com/) based on [Rsbuild](https://rsbuild.dev/). After working on it and using it to power the templates of [The Boring JavaScript Stack](https://sailscasts.com/boring), I find that it contains a key ingredient that might let me introduce what will become Sails Content.

## Vision

Sails Content provides a file-based CMS for your Sails application, powered by `.md` files and your view template. This enables Sails applications to have the developer experience (DX) of Astro Content Collection or Nuxt Content for creating blogs.

You no longer need to have your blogs on `blog.example.com`. Instead, with Sails Content, you can have it within your Sails application at `example.com/blog`.
