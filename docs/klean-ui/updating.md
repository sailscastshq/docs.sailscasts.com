---
title: Updating
titleTemplate: Klean UI
description: Inspect and safely update application-owned Klean UI source without configuration or silent overwrites.
outline: [2, 3]
---

# Updating

Klean components become application source when you add them. Updates therefore begin with inspection, not replacement:

```bash
npx klean-ui check
npx klean-ui diff button
npx klean-ui update button
```

There is no initializer, application manifest, provider, lock-in file, or background updater. The versioned CLI knows the source it ships; your application keeps ordinary Vue, React, or Svelte files.

## Check before changing anything

Run `check` from anywhere inside a conventional Boring Stack application:

```bash
npx klean-ui check
```

The command detects the Sails application, framework, component directory, and package manager exactly as `add` does. It then reports only source that exists in the application.

| Status           | Meaning                                                                   | Automatic update |
| ---------------- | ------------------------------------------------------------------------- | ---------------- |
| Current          | The application file already matches this CLI's source.                   | Nothing to do    |
| Update available | The file exactly matches a known earlier Klean revision.                  | Safe             |
| Locally modified | The file does not exactly match current or known historical Klean source. | Blocked          |
| Untracked        | The file is in the UI directory but is not a Klean registry destination.  | Never touched    |

Locally modified does not mean wrong. It means the application owns a difference and Klean refuses to guess whether that difference is formatting, product styling, a bug fix, or new behavior.

`check` is read-only. A current application exits with status `0`; updates, local changes, or untracked files exit with status `2`; detection and operational failures exit with status `1`.

## Review the actual difference

Use `diff` for one installed component:

```bash
npx klean-ui diff button
```

The output shows application source against the source bundled with the invoked CLI version. When the installed source is a known Klean revision, the output also identifies the revision change, direct dependency changes, and any migration notes.

```text
button: r1 → r2

--- application/button/Button.vue
+++ registry/button/Button.vue
@@ ...
-old source
+new source
```

`diff` never writes files or runs the package manager. No difference exits with status `0`; a visible difference exits with status `2`; an invalid request exits with status `1`.

## Update one component

After reviewing the diff:

```bash
npx klean-ui update button
```

The default update succeeds only when the installed source exactly matches a known Klean revision. Klean plans every component file, prerequisite, direct dependency, package file, and lockfile before mutation. The complete update is one transaction: if file writing or dependency installation fails, Klean restores the previous application state.

An already-current component is a no-op. An absent component is not installed by `update`; use `npx klean-ui add button` instead.

### Preview the transaction

```bash
npx klean-ui update button --dry-run
```

The dry run reports every source and dependency change without writing or invoking the package manager.

### Compound components

Updating a component also resolves its declared Klean prerequisites. A Date Picker update may therefore include Calendar, Input, Popover, or a newly introduced helper file. One locally modified prerequisite blocks the whole component-scoped transaction. Klean does not leave a half-updated interaction behind.

## Update everything that is safe

```bash
npx klean-ui update --all
```

`--all` updates every installed item whose complete transaction is safely replaceable. Locally modified components and untracked files remain untouched and are reported together. All accepted file and dependency changes are still applied as one rollback-safe transaction.

When every installed item is current, the command is a no-op. A complete successful update exits with status `0`. If safe items update but other items are skipped, it exits with status `2` so scripts and agents cannot overlook the remaining review work.

## Recover from local changes

When Klean reports local changes:

1. Run `npx klean-ui diff <component>`.
2. Decide which application changes must remain.
3. Port the upstream fix into the owned file, or apply the new Klean source and reapply the product changes deliberately.
4. Run the application's tests and visual checks.
5. Run `npx klean-ui check` again.

Application wrappers and recipes should normally live outside the copied primitive. Keeping product styling in a wrapper such as `PrimaryButton.vue` lets more upstream accessibility and browser fixes remain safely replaceable.

### Deliberate replacement

`--overwrite` is the explicit destructive escape hatch:

```bash
npx klean-ui update button --overwrite
```

It replaces locally modified files with the invoked CLI's registry source. Review `diff`, commit or otherwise preserve the application source, and use the flag only when discarding those local changes is intentional. It is never implied by `update` or `update --all`.

## Slipway and Hagfish adoption

Existing application components may predate Klean or intentionally express a distinct product treatment. Start their migration with read-only commands:

```bash
npx klean-ui check
npx klean-ui diff alert
```

If a Slipway or Hagfish file is reported as locally modified, treat its diff as migration evidence—not permission to overwrite it. Preserve the application's markup requirements, Tailwind language, server behavior, and visual regression coverage while adopting the shared Klean contract.

Once an application has adopted an exact Klean revision, later safe updates become automatic candidates. The application never becomes a selectable Klean theme and never gives runtime ownership back to the CLI.

## Stability policy

- Patch releases fix implementation, accessibility, and browser compatibility without intentional API breaks.
- Minor releases are additive.
- Breaking anatomy or behavior requires migration notes, a deliberate transition path, and proving-application evidence even before `1.0`.
- Native semantics, caller Tailwind classes, public slots, and useful `data-*` hooks are compatibility surfaces.

This restrained policy makes source updates progressive and component-scoped rather than periodic redesigns.

## Nonstandard application paths

The same explicit path and framework overrides available to `add` are available during inspection and update:

```bash
npx klean-ui check --components-dir resources/js/ui
npx klean-ui diff button --components-dir resources/js/ui
npx klean-ui update button --components-dir resources/js/ui
```

Flags describe an exceptional invocation. Klean still does not create consumer configuration.

## Related guides

- [Installation](/klean-ui/installation) — add framework-native source for the first time.
- [CLI](/klean-ui/cli) — command and detection reference.
- [Doctrine](/klean-ui/doctrine) — source ownership, platform-first behavior, and Tailwind boundaries.
- [Durable UI](/klean-ui/durable-ui) — resilience, recovery, and correct state ownership.

Implementation tracking: [Klean UI issue #61](https://github.com/sailscastshq/klean-ui/issues/61).
