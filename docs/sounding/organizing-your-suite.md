---
title: Organizing Your Suite
editLink: true
---

# Organizing your suite

Organize the suite so the relationship between **trials**, **features**, and **layers** is easy to see.

The test tree should follow the product and the testing layers, not the framework name.

## A strong default structure

```text
tests/
  unit/
    helpers/
  functional/
    pages/
    api/
  e2e/
    pages/
      auth/
      billing/
      dashboard/
      issues/
  factories/
  scenarios/
```

This gives you three useful separations:

- **by layer**: unit vs functional vs browser
- **by product surface**: auth, billing, issues, dashboard
- **by setup vocabulary**: factories and scenarios live under `tests/`

## Why not `tests/sounding/`

A folder like `tests/sounding/` makes the framework more visible than the product. Prefer grouping by layer and feature instead.

## Unit tests

Keep fast helper and business-logic trials under `tests/unit/`.

```text
tests/unit/
  helpers/
    capitalize.test.js
    get-user-initials.test.js
```

This is where light, app-aware helper trials belong.

## Functional and browser trials

Put request-driven and Inertia-driven page contracts under `tests/functional/`, and keep browser-capable trials under `tests/e2e/pages/`.

```text
tests/functional/pages/
  blog.test.js
  story.test.js
  auth/
    login.test.js
  issues/
    contracts.test.js
tests/e2e/pages/
  home.test.js
  auth/
    magic-link-browser.test.js
  issues/
    reader-access.test.js
  dashboard/
    editor.test.js
```

This layout keeps related behaviors together while separating non-browser checks from browser journeys.

## Split by behavior, not by tool

A good file should answer this question clearly:

**What family of trials lives here?**

Names like `reader-access.test.js` and `magic-link-browser.test.js` are clearer than vague names like `issues.test.js` when the feature has multiple distinct behaviors.

Inside a feature folder, split files by **behavior** and **runtime value**, not by arbitrary naming.

For example:

- `magic-link-request.test.js` for request/mail behavior
- `magic-link-browser.test.js` for the full browser sign-in flow
- `contracts.test.js` for request or Inertia-level issue contracts
- `reader-access.test.js` for browser-capable reading flows

This keeps the suite fast, legible, and easy to maintain.

## Factories belong under `tests/factories`

Factories should live under `tests/factories` because they are test vocabulary, not app runtime code.

If you want the full factory API and loading behavior, read [Factories](/sounding/factories).

A practical layout might look like:

```text
tests/factories/
  user.js
  issue.js
  subscription.js
```

Each factory should model one record shape well.

## Scenarios belong under `tests/scenarios`

Scenarios should live under `tests/scenarios` because they define business situations.

```text
tests/scenarios/
  issue-access.js
  publisher-editor.js
  magic-link-signin.js
tests/world-helpers/
    create-user-with-team.js
```

A good scenario name should tell you the situation before you open the file.

If a helper exists only to keep a scenario readable, keep it near the scenarios.
Use a named folder such as `tests/world-helpers/` instead of a vague `tests/support/` folder.

If you want the full scenario API and loading behavior, read [Scenarios](/sounding/scenarios).

## A useful rule of thumb

If a trial reads better with a named business situation, add or reuse a scenario.

If a trial just needs one more field value, prefer:

- a trait
- a small override
- a helper inside the scenario

If that helper grows into product-state setup, keep it in a named nearby folder like `tests/world-helpers/`, not inside the auto-loaded `tests/scenarios/` tree.

Do not create a new scenario for every tiny variation.

## Keep feature folders focused

A few practical rules help a lot:

- keep one file focused on one kind of behavior
- prefer `contracts.test.js` for request/Inertia contracts
- prefer `*-browser.test.js` for true browser journeys
- group by feature before grouping by runtime detail
- do not let one giant file become the whole feature

## Example layout

This is a layout that works well in a real app:

```text
tests/
  unit/
    helpers/
      capitalize.test.js
      get-user-initials.test.js
  functional/
    pages/
      auth/
        login.test.js
      issues/
        contracts.test.js
    api/
      issues/
        create.test.js
  e2e/
    pages/
      auth/
        magic-link-browser.test.js
      billing/
        pricing.test.js
      dashboard/
        editor.test.js
      issues/
        reader-access.test.js
      home.test.js
      blog.test.js
      contact.test.js
      story.test.js
  world-helpers/
    create-user-with-team.js
  scenarios/
    issue-access.js
    publisher-editor.js
```

This structure is simple and scalable.

## Summary

A Sounding suite should look like a well-organized product codebase that uses Sounding.
