---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/boring-stack-social.png
title: Testing cookbook
titleTemplate: The Boring JavaScript Stack 🥱
description: Real-world Sounding recipes for testing Boring Stack applications
prev:
  text: Error handling
  link: '/boring-stack/error-handling'
next:
  text: Mellow
  link: '/boring-stack/mellow'
editLink: true
---

# Testing cookbook

The [Testing](/boring-stack/testing) guide explains the shape of a Boring Stack
test suite. This cookbook is the next layer: practical recipes for the flows
real apps keep breaking if nobody tests them.

The examples are grounded in product shapes from apps like African Engineer and
Hagfish: paid issue access, magic links, invoice sending, credit callbacks,
expense dashboards, and tax summaries.

## Pick the smallest useful lane

Most testing decisions start with one question: what is the behavior?

| Behavior                                                         | Use                        | Example                                              |
| ---------------------------------------------------------------- | -------------------------- | ---------------------------------------------------- |
| Pure business calculation                                        | Unit trial                 | Tax totals, display formatting, plan limits          |
| Route, policy, redirect, session, or mail                        | Functional request trial   | Login redirects, webhook callbacks, email delivery   |
| Inertia page contract                                            | Functional `visit()` trial | Dashboard props, page component, validation errors   |
| Product state shared by many trials                              | World or scenario          | Subscriber access, creator dashboard, billing state  |
| DOM, navigation, focus, responsive layout, or client interaction | Browser trial              | Magic-link sign in, dashboard cards, editor controls |

Start low. Move up only when the higher layer is the behavior.

## Test helpers with real business numbers

Unit trials are best for helpers and small business operations. Keep these
close to the domain language, not the implementation detail.

```js
const { test } = require('sounding')

test('builds a tax summary from paid invoices and expenses', async ({
  sails,
  expect
}) => {
  const summary = await sails.helpers.tax.buildYearSummary.with({
    invoices: [
      {
        subtotalAmount: 2000000,
        discountPercentage: 10,
        vatRate: 7.5,
        whtEnabled: true,
        whtRate: 5,
        currency: 'NGN'
      },
      {
        subtotalAmount: 500000,
        discountPercentage: 0,
        vatRate: 0,
        whtEnabled: false,
        whtRate: 0,
        currency: 'NGN'
      }
    ],
    expenses: [
      {
        amount: 300000,
        currency: 'NGN',
        isTaxDeductible: true,
        receiptUrl: '/uploads/rent-receipt.pdf'
      },
      {
        amount: 50000,
        currency: 'NGN',
        isTaxDeductible: true
      },
      {
        amount: 20000,
        currency: 'NGN',
        isTaxDeductible: false
      }
    ]
  })

  expect(summary.trackedIncome.NGN).toBe(2300000)
  expect(summary.vatCollected.NGN).toBe(135000)
  expect(summary.whtCredits.NGN).toBe(90000)
  expect(summary.deductibleExpenses.NGN).toBe(350000)
  expect(summary.counts.deductibleExpensesMissingReceipts).toBe(1)
})
```

Use helper trials when a bug would be explained by a bad rule, not by routing,
auth, or browser behavior.

## Lock down Inertia page contracts

Use `visit()` for pages where the important behavior is the server-side Inertia
payload. This is where dashboard, pricing, editor, and reporting pages usually
belong first.

```js
const { test } = require('sounding')

test('tax assistant sends summary props for the selected year', async ({
  sails,
  visit,
  expect
}) => {
  const current = await sails.sounding.world.use('nigeria-tax-assistant')

  const page = await visit(`/tax?year=${current.filingYear}&authority=lagos`, {
    session: {
      creatorId: current.creators.owner.id
    }
  })

  expect(page).toHaveStatus(200)
  expect(page).toBeInertiaPage('tax/index')
  expect(page).toHaveProp('selectedAuthority', 'lagos')
  expect(page).toHaveProp('selectedYear', current.filingYear)
  expect(page).toHaveProp('defaultCurrency', 'NGN')
  expect(page.data.props.summary.trackedIncome.NGN).toBe(
    current.summary.trackedIncome
  )
})
```

This is faster and more precise than opening a browser just to prove the page
received the right props.

Read [Testing Inertia pages](/sounding/testing-inertia) for partial reloads,
validation errors, shared props, and Inertia-specific matchers.

## Model access states as worlds

When a feature has several roles or states, put the setup in a scenario and load
it as a world. The trial should read like the product behavior.

```js
const { test } = require('sounding')

test('guest sees the paywall state on a members-only issue', async ({
  sails,
  visit,
  expect
}) => {
  const current = await sails.sounding.world.use('issue-access')
  const issuePage = await visit(`/i/${current.issues.gatedIssue.slug}`)

  expect(issuePage).toHaveStatus(200)
  expect(issuePage).toBeInertiaPage('issues/show')
  expect(issuePage).toHaveProp('isAuthenticated', false)
  expect(issuePage).toHaveProp('hasSubscription', false)
  expect(issuePage).toHaveProp('isFreeNow', false)
  expect(issuePage).toMatchProp(
    'previewContent',
    current.issues.gatedIssue.intro
  )
  expect(
    issuePage.data.props.issue.content.includes(
      current.issues.gatedIssue.premiumDetail
    )
  ).toBe(false)
})
```

Good world names sound like business situations:

- `issue-access`
- `publisher-editor`
- `nigeria-tax-assistant`
- `high-volume-expense-dashboard`
- `mixed-currency-expense-dashboard`

Weak names like `seed-data`, `basic-user`, or `case-1` force readers to open the
setup file before they understand the trial.

Read [Worlds and actors](/sounding/worlds), [Factories](/sounding/factories),
and [Scenarios](/sounding/scenarios) when setup starts repeating.

## Test mail without opening a browser

Mail is usually a functional behavior. Request the thing that sends the email,
then assert against the captured mailbox.

```js
const { test } = require('sounding')

test('requesting a magic link sends a usable email', async ({
  auth,
  sails,
  expect
}) => {
  const result = await auth.requestMagicLink('reader@example.com')
  const email = sails.sounding.mailbox.latest()

  expect(result.response).toHaveStatus(302)
  expect(result.response.header('location')).toMatch(
    '/check-email?type=magic-link'
  )
  expect(email.to).toContain('reader@example.com')
  expect(email.subject).toContain('magic link')
  expect(email.ctaUrl).toContain('/magic-link/')
})
```

Use the mailbox matchers when you want clearer failure output:

```js
expect(sails.sounding.mailbox).toHaveSentMail({
  to: 'reader@example.com',
  subject: /magic link/i
})
expect(sails.sounding.mailbox.latest()).toHaveCtaUrl(/magic-link/)
```

Read [Mail testing](/sounding/mail-testing) for the full mailbox surface.

## Test authenticated actions with `request.as()`

Use `request.as(actor)` when the behavior is a logged-in request, not the login
form itself.

```js
const { test } = require('sounding')

test('send invoice refuses creators without credits', async ({
  sails,
  world,
  request,
  expect
}) => {
  const creator = await world.create('creator', {
    credits: 0,
    sentInvoicesCount: 0
  })
  const client = await sails.models.client
    .create({
      name: 'Helix Holdings',
      email: 'hr@thehelixholdings.com',
      address: '1 Creator Way',
      cityStatePostal: 'Lagos, LA 100001',
      country: 'Nigeria',
      creator: creator.id
    })
    .fetch()
  const invoice = await world.create('invoice', {
    creator: creator.id,
    client: client.id,
    status: 'draft'
  })

  const response = await request
    .as(creator)
    .post(`/invoices/${invoice.publicId}/send`, {
      recipientEmails: [client.email],
      sendAt: 0
    })

  expect(response).toHaveStatus(400)
  expect(response.body).toContain('credits to send this invoice')

  const unchangedInvoice = await sails.models.invoice.findOne({
    id: invoice.id
  })
  const creditTransactions = await sails.models.credittransaction.find({
    creator: creator.id
  })

  expect(unchangedInvoice.status).toBe('draft')
  expect(creditTransactions.length).toBe(0)
})
```

This keeps the test focused on the invoice action. The browser login flow can
have its own browser trial.

Read [Auth and actors](/sounding/auth-and-actors) for `request.as()`,
`visit.as()`, `login.as()`, and `login.withPassword()`.

## Test session callbacks directly

Callback routes often depend on session state from a previous step. Test that
state directly before adding a browser or external provider.

```js
const { test } = require('sounding')

test('credit callback returns to the stored invoice send flow', async ({
  request,
  expect
}) => {
  const response = await request
    .withSession({
      after_credits_url: '/invoices/inv_public_id?send=true'
    })
    .get('/credits/callback')

  expect(response).toRedirectTo('/invoices/inv_public_id?send=true')
})

test('credit callback ignores unsafe stored return URLs', async ({
  request,
  expect
}) => {
  const response = await request
    .withSession({
      after_credits_url: 'https://example.com/not-your-app'
    })
    .get('/credits/callback')

  expect(response).toRedirectTo('/settings/billing')
})
```

Use the HTTP transport only when the transport itself matters:

```js
const http = request.using('http')
const response = await http.get('/health')

expect(response).toHaveStatus(200)
```

The current transport API is `request.using('http')`. Do not add old
compatibility flags like `{ http: true }` to new Boring Stack examples.

Read [Request clients and transport](/sounding/request-clients) for the full
request surface.

## Use the browser for browser behavior

Browser trials should prove things the request layer cannot:

- real login navigation
- focus and keyboard behavior
- mobile or responsive layout
- client-side editors
- visible access states
- text fitting, truncation, and overflow

```js
const { test } = require('sounding')

test(
  'magic link login reaches the dashboard in a real browser',
  { browser: true },
  async ({ auth, page, expect }) => {
    await auth.login.as('browser-reader@example.com', page)

    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(
      page.getByRole('heading', { level: 1, name: /browser-reader/i })
    ).toBeVisible()
  }
)
```

For password-based apps, follow the real form:

```js
test(
  'creator reaches expenses after password login',
  { browser: true },
  async ({ sails, login, page, expect }) => {
    const current = await sails.sounding.world.use(
      'high-volume-expense-dashboard'
    )

    await login.withPassword('owner', page, {
      password: current.auth.password,
      returnUrl: '/expenses'
    })

    await expect(page).toHaveURL(/\/expenses$/)
    await expect(page.getByRole('heading', { name: /expenses/i })).toBeVisible()
  }
)
```

Read [Browser testing](/sounding/browser-testing) for artifacts, mobile
projects, traces, and videos.

## Prove layout problems in the browser

When the behavior is visual, assert the DOM measurement that would actually
break for users.

```js
const { test } = require('sounding')

function summaryCard(page, label) {
  return page
    .locator('a, article')
    .filter({ has: page.getByText(label, { exact: true }) })
    .first()
}

async function expectCardValueToFit(card, expect) {
  const value = card.locator('div.block.min-w-0 p').first()
  const fitsWithinCard = await value.evaluate(
    (element) => element.scrollWidth <= element.clientWidth + 1
  )

  expect(fitsWithinCard).toBe(true)
}

test(
  'expenses dashboard compacts large totals without clipping the card',
  { browser: true },
  async ({ sails, login, page, expect }) => {
    const current = await sails.sounding.world.use(
      'high-volume-expense-dashboard'
    )

    await login.withPassword('owner', page, {
      password: current.auth.password,
      returnUrl: '/expenses'
    })

    const allTimeExpensesCard = summaryCard(page, 'All Time Expenses')

    await expect(allTimeExpensesCard).toContainText('$723.5B')
    await expectCardValueToFit(allTimeExpensesCard, expect)
  }
)
```

This kind of trial belongs in the browser lane because the behavior depends on
real rendered dimensions.

## Keep the suite readable

As the app grows, keep each lane honest:

- put helper and business-rule trials under `tests/unit/`
- put request, mail, redirect, session, and Inertia contracts under
  `tests/functional/`
- put browser-only behavior under `tests/e2e/`
- put reusable record builders under `tests/factories/`
- put named product situations under `tests/scenarios/`

A healthy Boring Stack suite should let someone answer three questions without
digging:

1. What behavior broke?
2. What product situation was active?
3. Why did this need this layer of the stack?

When those answers are obvious, the tests become documentation the team can
trust.
