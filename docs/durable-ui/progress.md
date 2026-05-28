---
title: Progress Durability
description: Durable UI primitives for private work the user has not submitted yet.
---

# Progress Durability

Progress durability protects work the user has already done but has not submitted yet.

This is private, local progress. It should survive refreshes and browser restarts, but it is not a database record and it is not meant to be shared by URL.

Progress is where real apps lose the most user trust: long forms, imports, onboarding flows, setup wizards, and any task where a refresh should not erase work.

## Primitives

Progress primitives solve different kinds of unfinished work:

- [form-draft](/durable-ui/progress/form-draft) keeps one form's private field values alive.
- [wizard-draft](/durable-ui/progress/wizard-draft) keeps multi-step progress alive, including the current step and per-step data.

More progress primitives can live here as the category grows.

## The Rule

If losing the state would make the user repeat work they already did, it probably belongs in progress durability.

If the state is already submitted, shared, auditable, or cross-device, it belongs on the server instead.

## Good Examples

Progress durability is a good fit for:

- A React Hook Form draft restored with `reset()`.
- An Inertia form draft restored with `form.setData()` or `Object.assign(form, data)`.
- A long profile, invoice, expense, or student form that should not disappear on refresh.
- The current step in an onboarding flow.
- The selected import method in a student import wizard.
- Student rows entered across multiple steps.
- Parsed CSV rows that should survive refresh before final submit.

## Do Not Use Progress Durability For

- Submitted records.
- Passwords, tokens, OTPs, card details, or secrets.
- Raw files.
- State that should be shared with another person.
- State that should sync across devices.
