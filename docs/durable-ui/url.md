---
title: URL Durability
description: Durable UI primitives for shareable view state that belongs in the address bar.
---

# URL Durability

URL durability protects view state that should be shareable, bookmarkable, and reproducible from a link.

This is public navigation context, not private draft data. It belongs in the address bar because another person, another tab, or a future visit should be able to land on the same view.

## Primitive

- [query-state](/durable-ui/url/query-state) keeps one query parameter in sync with Vue or React state.

## The Rule

If the state changes what view the user is looking at, and that view should survive refreshes or shared links, it probably belongs in URL durability.

If the state is private work, secrets, or unfinished form input, keep it out of the URL.

## Good Examples

URL durability is a good fit for:

- The active settings tab.
- A search term for a list or table.
- Selected role, status, or date filters.
- Sort key and sort direction.
- The current page in pagination.
- Shareable modal state like `?modal=invite-member`.

## Do Not Use URL Durability For

- Passwords, tokens, OTPs, or secrets.
- Private form field values.
- Parsed CSV rows or import drafts.
- Large blobs or raw files.
- Anything the user would not want copied into the address bar.
