---
title: Browser Testing
editLink: true
---

# Browser testing

Sounding uses Playwright for browser-capable trials.

Browser trials expose a Sounding page wrapper. Use `page` or `visit()` for
actions, and keep assertions under `expect(page)`.

## `test()` when the browser matters

Use browser trials when the real browser matters:

- sign in journeys
- mobile navigation
- editors and dashboards
- gated content flows
- checkout handoff

When a repo uses a separate functional layer, keep these browser flows under `tests/e2e/pages/` and move request or Inertia contracts down into `tests/functional/`.

```js
import { test } from 'sounding'

test(
  'subscriber can finish a members-only issue',
  { browser: true, world: 'issue-access' },
  async ({ visit, expect }) => {
    const page = await visit.as('subscriber')('/issues/the-nerve-to-build')

    await expect(page).toSee('The rest of the story')
    expect(page).toHaveNoSmoke()
  }
)
```

## Expect-first browser assertions

Sounding browser trials keep the action/assertion split clear:

```js
await page
  .click('@send-link')
  .type('email', 'creator@example.com')
  .press('Send link')

await expect(page).toSee('Check your email')
await expect(page).not.toSee('Invalid email')
expect(page).toHavePath('/check-email')
```

Use these matchers for browser pages:

| API                                       | Purpose                                                                    |
| ----------------------------------------- | -------------------------------------------------------------------------- |
| `expect(page).toSee(text)`                | Assert page text exists in the document text.                              |
| `expect(page).not.toSee(text)`            | Assert page text is absent.                                                |
| `expect(page).toHaveUrl(url)`             | Assert the full URL, or path when the expected value starts with `/`.      |
| `expect(page).toHavePath(path)`           | Assert path, query, and hash.                                              |
| `expect(page).toHaveTitle(title)`         | Assert document title.                                                     |
| `expect(page).toHaveNoJavascriptErrors()` | Fail on browser runtime errors.                                            |
| `expect(page).toHaveNoConsoleLogs()`      | Fail on any console message, including `log`, `warn`, `info`, and `error`. |
| `expect(page).toHaveNoConsoleErrors()`    | Fail only on `console.error`.                                              |
| `expect(page).toHaveNoSmoke()`            | Fail on JavaScript errors or console errors.                               |
| `expect(page).toMatchScreenshot(name)`    | Compare a full-page screenshot with an approved visual baseline.           |

`toHaveNoConsoleLogs()` is intentionally strict. Use it when a flow should leave
the browser console completely silent. Use `toHaveNoSmoke()` for the normal
smoke-safety check.

For page-level layout contracts, read [Visual regression testing](/sounding/visual-regression).

## Browser smoke helpers

Use `smoke()` when the trial is only trying to answer one question: do these
pages boot cleanly in a real browser?

```js
import { test } from 'sounding'

test('public pages do not smoke', async ({ smoke }) => {
  await smoke(['/', '/pricing', '/contact'])
})
```

`smoke()` opens the browser lazily. That means a normal request-level trial can
stay light until it actually asks for browser proof:

```js
test('pricing page has a contract and browser smoke', async ({
  visit,
  smoke,
  expect
}) => {
  const page = await visit('/pricing')

  expect(page).toBeInertiaPage('marketing/pricing')
  await smoke('/pricing')
})
```

Pass a browser project when the route list should run through a named browser
configuration:

```js
test('mobile public pages do not smoke', async ({ smoke }) => {
  await smoke(['/', '/pricing', '/contact'], { project: 'mobile' })
})
```

Use `visit.all()` when you want the inspected route collection back:

```js
test('public pages do not smoke', async ({ visit, expect }) => {
  const pages = await visit.all(['/', '/pricing', '/contact'])

  expect(pages).toHaveNoSmoke()
  expect(pages.entries[0].target).toBe('/')
})
```

Each collection entry includes:

- `target`
- `project`
- `currentUrl`
- `javascriptErrors`
- `consoleMessages`
- `consoleErrors`
- `page`

On failure, Sounding stops at the first smoky route. The terminal output names
the route, project, current URL, JavaScript errors, and console errors, and the
browser artifacts point at that same page.

## Browser test handles

Use `@name` for stable browser test handles. This is a Sounding convention:
the `@` prefix does not mean CSS, id, or JavaScript decorator. It means
"find this element by its test handle."

Sounding maps `@send-link` to elements with `data-test="send-link"` or
`data-testid="send-link"`:

```html
<button data-test="send-link">Email me a link</button>
```

```js
await page.click('@send-link')
```

Prefer test handles when visible copy may change, when UI repeats the same copy,
or when an element does not have a natural accessible label. Plain text and
normal CSS selectors still work:

```js
await page.click('Email me a link')
await page.click('#send-link')
await page.fill('input[name="email"]', 'creator@example.com')
```

## Fluent browser journeys

The Sounding page wrapper provides common browser journey actions:

```js
await visit('/settings')
  .as('owner')
  .inDarkMode()
  .withGeolocation(6.5244, 3.3792)
  .click('@avatar')
  .attach('@avatar-file', 'tests/fixtures/avatar.png')
  .typeSlowly('@display-name', 'Kelvin')
  .clear('@tagline')
  .append('@tagline', 'Building in public')
  .key('Enter')

await page.withinFrame('@billing-frame', async (frame) => {
  await frame.fill('@card-number', '4242424242424242')
  await frame.click('@save-card')
})
```

Supported page actions:

| API                                                     | Purpose                                                                   |
| ------------------------------------------------------- | ------------------------------------------------------------------------- |
| `page.click(target)`                                    | Click visible text, a test handle, or selector.                           |
| `page.type(target, value)` / `page.fill(target, value)` | Fill an input by label, test handle, or selector.                         |
| `page.typeSlowly(target, value)`                        | Type with a small delay for search boxes, masks, and key-driven UI.       |
| `page.append(target, value)`                            | Add text to the current input value.                                      |
| `page.clear(target)`                                    | Empty an input.                                                           |
| `page.press(target, key)`                               | Press a key while focused on a target.                                    |
| `page.select(target, value)`                            | Select an option.                                                         |
| `page.check(target)` / `page.uncheck(target)`           | Toggle checkboxes and radios.                                             |
| `page.hover(target)`                                    | Hover over a target.                                                      |
| `page.attach(target, files)`                            | Attach one or more files to an upload input.                              |
| `page.drag(source, target)`                             | Drag one target onto another.                                             |
| `page.scroll(target)`                                   | Scroll an element into view, or scroll the page with numeric coordinates. |
| `page.wait(target)`                                     | Wait for a timeout, selector, test handle, or load state.                 |
| `page.resize(width, height)`                            | Resize the page viewport.                                                 |
| `page.key(key)` / `page.keys(keys)`                     | Press keyboard shortcuts.                                                 |
| `page.back()` / `page.forward()` / `page.reload()`      | Navigate browser history or reload.                                       |
| `page.debug()`                                          | Pause in Playwright when the runtime supports it.                         |
| `page.withinFrame(target, callback)`                    | Scope actions to an iframe.                                               |

## Setup helpers

Setup helpers run before navigation when chained from `visit('/path')`:

```js
const page = await visit('/dashboard')
  .withHost('app.test')
  .inDarkMode()
  .withLocale('en-GB')
  .withTimezone('Africa/Lagos')
  .withUserAgent('SoundingBot/1.0')
  .withGeolocation({ latitude: 6.5244, longitude: 3.3792 })
```

`withHost()` resolves relative visit targets against a specific host:

```js
await visit('/dashboard').withHost('app.test')
// http://app.test/dashboard

await visit('/dashboard').withHost('https://creator.example.com')
// https://creator.example.com/dashboard
```

Use it for tenant domains, custom host routing, signed-link hosts, or apps that
branch on the request `Host` header.

Supported setup helpers:

| API                                             | Purpose                                                                |
| ----------------------------------------------- | ---------------------------------------------------------------------- |
| `visit('/path').as(actor)`                      | Log in as a world actor before navigation.                             |
| `visit('/path').on(project)` / `onMobile()`     | Open a named browser project before navigation.                        |
| `visit('/path').withHost(host)`                 | Resolve relative paths against a specific host.                        |
| `visit('/path').inDarkMode()` / `inLightMode()` | Emulate color scheme before navigation.                                |
| `visit('/path').withLocale(locale)`             | Override browser locale signals where possible.                        |
| `visit('/path').withTimezone(timezone)`         | Store timezone intent for browser metadata and future context support. |
| `visit('/path').withUserAgent(userAgent)`       | Set the page user-agent header where possible.                         |
| `visit('/path').withGeolocation(lat, lon)`      | Grant geolocation permission and set coordinates where possible.       |

## Read and capture helpers

Use page helpers when a trial needs browser state or visual evidence:

```js
page.url()
await page.text()
await page.text('@status')
await page.html()
await page.content()
await page.script(() => document.title)
await page.screenshot('.tmp/page.png')
await page.screenshotElement('@receipt', '.tmp/receipt.png')
```

Raw Playwright access remains available through `page.raw` or
`page.playwrightPage` when a browser flow needs a lower-level escape hatch.

## Failure artifacts

Browser failures are the hardest failures to understand from a stack trace alone, so Sounding captures the most useful evidence automatically.

When a `{ browser: true }` trial fails, Sounding keeps:

- the current page URL
- a `current-url.txt` file
- a full-page `screenshot.png`

The files live under:

```txt
.tmp/sounding/artifacts/<trial-name>/<browser-project>/
```

For example, this trial:

```js
test(
  'subscriber can finish a members-only issue',
  { browser: true },
  async ({ page }) => {
    await page.goto('/issues/the-nerve-to-build')

    // ...
  }
)
```

would write failure evidence to:

```txt
.tmp/sounding/artifacts/subscriber-can-finish-a-members-only-issue/desktop/
```

Sounding also appends the current URL and artifact paths to the thrown error:

```txt
Sounding browser artifacts:
- URL: http://127.0.0.1:3333/issues/the-nerve-to-build
- current URL file: .tmp/sounding/artifacts/subscriber-can-finish-a-members-only-issue/desktop/current-url.txt
- screenshot: .tmp/sounding/artifacts/subscriber-can-finish-a-members-only-issue/desktop/screenshot.png
```

That keeps the assertion failure as the main message while still pointing you at the browser evidence.

## Capture traces and videos

Screenshots and URLs are cheap enough to keep on by default. Traces and videos are heavier, so Sounding makes them opt-in.

Turn them on for one trial when a browser flow is flaky or timing-sensitive:

```js
test(
  'checkout keeps the cart after refresh',
  {
    browser: {
      artifacts: {
        trace: true,
        video: true
      }
    }
  },
  async ({ page, expect }) => {
    await page.goto('/checkout')
    await page.reload()

    await expect(page).toSee('Your cart')
    expect(page).toHaveNoSmoke()
  }
)
```

The failure directory will then include:

```txt
current-url.txt
screenshot.png
trace.zip
video.webm
```

Use trace when you need to inspect network requests, DOM snapshots, console output, or the timing between browser actions.
Use video when motion, redirects, focus changes, or transient UI states are the thing you need to see.

## Artifact modes

Artifact settings accept booleans for the common path:

- `true` keeps the artifact when the trial fails
- `false` disables that artifact

They also accept explicit modes:

- `off` disables the artifact
- `on-failure` keeps the artifact only for failed trials
- `on` keeps the artifact for successful trials too

Most apps should use booleans in day-to-day tests:

```js
test(
  'publisher can update an issue cover',
  {
    browser: {
      artifacts: {
        trace: true
      }
    }
  },
  async ({ page }) => {
    await page.goto('/publisher/issues/42/edit')
  }
)
```

Use `on` when you are deliberately collecting evidence from a passing browser flow:

```js
test(
  'launch demo recording stays stable',
  {
    browser: {
      artifacts: {
        video: 'on'
      }
    }
  },
  async ({ page }) => {
    await page.goto('/demo')
  }
)
```

## Disable artifacts for a trial

If a smoke trial is intentionally tiny and you do not want files, turn artifacts off for that trial:

```js
test(
  'health page responds',
  { browser: { artifacts: false } },
  async ({ visit, expect }) => {
    const page = await visit('/health')

    await expect(page).toSee('OK')
  }
)
```

This is mainly useful for very large suites or trials that intentionally fail while exercising error boundaries.

## Load a world before browser setup

Browser trials become harder to maintain when they carry too much setup. Use the trial's `world` option to start from a named business situation before the browser flow begins.

## Run the same flows across browser projects

Run the same core flows across named browser projects:

- desktop
- mobile
- WebKit or Firefox when the browser engine matters
- dark mode when relevant

The default project is `desktop`, so most browser trials can stay terse:

```js
test(
  'subscriber can read a gated issue',
  { browser: true },
  async ({ visit, expect }) => {
    const page = await visit('/issues/the-nerve-to-build')

    await expect(page).toSee('The rest of the story')
  }
)
```

When a trial needs a specific project, use the string shorthand:

```js
test(
  'mobile navigation opens the account menu',
  { browser: 'mobile' },
  async ({ visit, expect }) => {
    const page = await visit('/dashboard').inDarkMode()

    await page.click('@account-menu')
    await expect(page).toSee('Settings')
  }
)
```

Or use the object form when the trial also needs artifacts or direct browser overrides:

```js
test(
  'checkout works in WebKit',
  {
    browser: {
      project: 'safari',
      artifacts: {
        trace: true
      }
    }
  },
  async ({ visit, expect }) => {
    const page = await visit('/checkout')

    await expect(page).toSee('Checkout')
  }
)
```

Use `visit().on()` when one visit inside a browser trial needs a different
project before navigation:

```js
test(
  'publisher dashboard adapts across projects',
  { browser: true },
  async ({ visit, expect }) => {
    const mobilePage = await visit('/dashboard').onMobile()
    await expect(mobilePage).toSee('Menu')

    const safariPage = await visit('/dashboard').on('safari')
    await expect(safariPage).toSee('Dashboard')
  }
)
```

For a whole trial, prefer `{ browser: 'mobile' }`. For one specific visit,
`visit('/path').onMobile()` closes the current browser session, opens the named
project, then applies actor login, color scheme, locale, host, and other setup
before it navigates.

Define the projects in `config/sounding.js`:

```js
module.exports.sounding = {
  browser: {
    projects: {
      desktop: {},
      mobile: {
        device: 'iPhone 13'
      },
      safari: {
        type: 'webkit'
      }
    }
  }
}
```

If a trial references a project that is not configured, Sounding fails before opening the browser and lists the available project names.

## Choose the right layer

Use browser trials for what only the browser can prove.

Leave lower-level behavior to:

- `test()` with `sails.helpers`
- `test()` with `get()` / `post()`
- `test()` with `visit()`

## What browser-capable trials add

When you opt into `{ browser: true }`, the trial context additionally gives you:

- `page`
- `browserContext`
- `browser`
- Playwright-flavored `expect()` behavior for browser assertions

It also makes helpers like `login.as(actorOrEmail, page)` useful in the same trial.
It also makes helpers like `login.withPassword(actorOrEmail, page, { password })` useful when the real browser form is the behavior.

## Typical browser cases

Use browser-capable trials for:

- sign-in journeys
- editor flows
- checkout or handoff flows
- mobile navigation
- anything where the DOM, navigation, or real page state is the behavior

Do not use browser-capable trials just because they exist.

If a request or Inertia contract can prove the behavior more cheaply and more clearly, prefer that lower layer first.
