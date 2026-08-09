---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Bearing
titleTemplate: Slipway
description: Collect feedback, publish a roadmap, and announce product updates on your application's own domain.
prev:
  text: Bridge
  link: /slipway/bridge
next:
  text: Content
  link: /slipway/content
editLink: true
---

# Bearing

Bearing turns customer feedback into visible product direction without adding another service or account system to your application.

Your customers see three familiar surfaces:

- **Feedback** for sharing and supporting ideas;
- **Roadmap** for seeing what is planned and in progress; and
- **Updates** for learning what shipped.

The product is called Bearing inside Slipway. Public pages use the plain labels your customers already understand.

## App-owned URLs

Bearing stays on the deployed application's domain. A root application uses:

```text
https://your-app.example.com/feedback
https://your-app.example.com/roadmap
https://your-app.example.com/updates
```

For an application mounted below `/academy`, the same pages become:

```text
https://example.com/academy/feedback
https://example.com/academy/roadmap
https://example.com/academy/updates
```

Slipway serves these pages through the application's existing Caddy route. Navigation, sessions, and assets remain on the app's origin.

## Enable Bearing

1. Install `sails-hook-slipway@^0.0.7` in the Sails application.
2. Open the app in Slipway and choose **Bearing** from the app menu.
3. Enable Bearing and choose who may participate.
4. Redeploy the app once so Slipway can inject its private app-scoped exchange credential and activate the host-app integration.

Slipway owns the public routes and runtime settings. You do not need to add Feedback, Roadmap, or Updates routes to the application.

## Participation

Anyone can read the public pages. Writing has a stricter default.

By default, submitting feedback and voting require an authenticated user of the host application. Bearing uses the application's existing server-side session and verified email state; it does not create a separate customer account.

Bearing and Bridge share one host-app identity contract. Configure
`slipway.identity` once when an app does not use the default Boring Stack model
or login route. Bearing can inherit an existing `slipway.bridge.identity` and
`bridge.loginPath` configuration, so adding Bearing does not duplicate app
authentication code. For tenant-aware or external authentication, a
`loginHelper` may compute the safe local login URL and return destination from
the request instead of hard-coding `/login` or `/signin` into either feature.

The handoff works as follows:

1. The customer chooses **Sign in to share**.
2. The app's installed Slipway hook resolves its current authenticated user.
3. The hook sends the stable user ID, display name, and verified email to Slipway over an app-authenticated server channel.
4. Slipway returns a short-lived, single-use code.
5. Redeeming that code establishes an app-scoped Bearing participant session.

Raw identity is never placed in a query string. A participant is not a Slipway team member, Slipway user, or Bridge access grant.

### Anonymous participation

Enable **Allow anonymous participation** when guests should be able to submit and vote without signing in. It is disabled by default.

Turning it off immediately blocks new anonymous mutations without deleting feedback that was already submitted anonymously.

## Settings

Bearing is configured per app because each app owns its domain, route prefix, deployment, and user session.

| Setting                       | Default | Effect                                                         |
| ----------------------------- | ------- | -------------------------------------------------------------- |
| Bearing                       | Off     | Master switch for all Bearing routes and writes                |
| Accept new feedback           | On      | Pauses new submissions while keeping existing feedback visible |
| Allow anonymous participation | Off     | Allows guests to submit and vote                               |
| Public roadmap                | On      | Publishes or hides `/roadmap`                                  |
| Public updates                | On      | Publishes or hides `/updates`                                  |
| In-app widget                 | Off     | Adds the Bearing launcher to successful HTML pages             |
| Widget side                   | Right   | Places the launcher at the bottom right or bottom left         |
| Opening view                  | Updates | Opens the widget on Updates or Feedback                        |
| Unread indicator              | On      | Shows What's new until that visitor opens the latest update    |

The master switch and participation rules are enforced on the server. Hiding a control in the browser is never treated as authorization.

## Feedback and roadmap

New feedback enters the Bearing inbox as **Reviewing**. An app owner or administrator can move it through:

```text
Reviewing → Planned → In progress → Shipped
          ↘ Closed
```

Planned and In-progress feedback automatically appears on the public Roadmap. There is no second roadmap record to keep synchronized.

## Updates

An update explains something useful that changed. Link it to one or more feedback items when the release delivers what customers requested.

Publishing the update marks those linked items Shipped and makes the update available on `/updates` and in the widget.

This publish and state change happen in one database transaction. A failed
publish cannot leave the public update and its linked roadmap items disagreeing.

## In-app widget

When enabled, `sails-hook-slipway` inserts the same-origin Bearing bootstrap into eligible HTML responses. The bootstrap checks the current Slipway setting before rendering, so disabling the widget takes effect without another deployment.

The widget:

- is isolated from host styles;
- waits for interaction before loading its full interface;
- supports keyboard navigation, Escape, and focus restoration;
- respects reduced-motion preferences; and
- fails open, leaving the host page unchanged if Bearing is unavailable.

The attention state is deliberately temporary. Bearing compares the latest
published update's public ID with a small seen watermark in that visitor's
browser. The trigger says **What's new** only when those IDs differ, then clears
the attention as soon as the visitor opens the widget. With no published update
there is nothing to mark as new, and a previously seen release does not stay
highlighted forever.

The hook skips JSON, redirects, downloads, streams, Server-Sent Events, and responses whose Content Security Policy cannot safely allow the same-origin script.

## Security boundaries

- Bearing is disabled per app by default.
- Its private exchange credential never reaches the browser.
- Host identity must have a verified email unless the app uses an explicit identity helper with equivalent proof.
- Launch codes expire quickly and can be redeemed only once.
- Disabling Bearing or rotating its app credential invalidates stale writing sessions.
- Public responses never include participant email addresses or stable host-user IDs.

For the underlying app identity convention and custom identity helpers, see [Bridge app-local access](/slipway/bridge#app-local-access). Bearing shares that provider-neutral resolver, but not Bridge invitations or roles.
