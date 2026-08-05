---
title: Scan In CI And Its Limitations
description: Automate Durable UI Scan safely and understand what the static scanner can and cannot conclude.
---

# Scan In CI And Its Limitations

## Exit Codes In 0.0.1

Durable UI Scan is advisory in its first release:

- exit `0` when a scan completes, even when findings exist
- exit `1` for invalid arguments, missing paths, unreadable input, or another failure to run

This means you can add the command to CI to preserve a report without unexpectedly blocking a deployment. A finding is a prompt to reproduce a browser contract, not a build failure.

## Save A CI Artifact

Run the scanner from the checked-out project and store JSON as an artifact with the CI provider of your choice:

```sh
npx durable-ui scan . --json > durable-ui-report.json
```

For a repository containing generated or non-JavaScript environments, add directory names explicitly:

```sh
npx durable-ui scan . --ignore .venv,generated --json > durable-ui-report.json
```

Pin the package when repeatability matters:

```sh
npx durable-ui@0.0.1 scan . --json > durable-ui-report.json
```

Because the command exits `0` for findings, any custom threshold must be implemented by the consuming CI step. Treat `schemaVersion` as the compatibility boundary when parsing the report.

## What Static Analysis Cannot Know

Scan reads source text; it does not compile the application, execute framework code, inspect the DOM, or drive a browser. It cannot reliably determine:

- whether a custom helper persists or restores state at runtime
- whether server autosave protects a form
- whether a dialog is intentionally ephemeral
- whether a return destination is validated by the server
- whether cleanup is hidden behind a framework abstraction
- whether request ordering is enforced outside the matched file
- whether the final experience feels correct to a keyboard, touch, or assistive-technology user

The scanner favors explainable source evidence over broad guesses, so it will have both false positives and false negatives. Rename-heavy abstractions and generated code can reduce what it recognizes.

## Operational Limits

- Directory scans collect at most 10,000 source files by default. Change the bound with `--max-files`.
- Supported source files larger than 1 MiB are listed in `filesSkipped` and not inspected.
- Default ignored directories, test files, and symbolic links are not inspected.
- The scanner reads files as UTF-8.
- Framework detection is informational and depends on `package.json` dependencies or framework-specific source extensions.

## The Verification Loop

For every material finding:

1. Open the referenced screen in the real application.
2. Follow the report's browser test.
3. Decide the intended product contract.
4. Change the implementation only when observed behavior violates that contract.
5. Repeat the test with refresh, Back and Forward, remounting, sign-in interruption, slow responses, or unavailable storage as relevant.

The [Durable UI course](https://sailscasts.com/courses/durable-ui) teaches the decision framework behind this loop.
