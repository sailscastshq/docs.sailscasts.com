---
title: Migrating existing checks to Slipway CI
titleTemplate: Slipway
description: Preserve test coverage, verify the supported execution profile and distinguish source checks from a CI cutover.
editLink: true
---

# Migrating existing checks to Slipway CI

Start by mapping the checks your current workflow actually runs. A successful local trial is useful compatibility evidence, but it is not a retained server run, a GitHub PR check or approval to deploy.

This guide covers the implemented deployment-admission profile in Slipway **0.0.131** with CLI **0.0.5**. Review [setup](/slipway/ci) and [resource budgets](/slipway/ci-resources) first.

## Preserve the coverage contract

| Stage                | Example command           | Preserve                                                   |
| -------------------- | ------------------------- | ---------------------------------------------------------- |
| Installation         | `npm ci`                  | The committed lockfile and reviewed installation lifecycle |
| Lint                 | `npm run lint`            | The existing whole-repository checks                       |
| Unit tests           | `npm run test:unit`       | Every existing unit test                                   |
| Functional tests     | `npm run test:functional` | Existing request/helper tests and application safeguards   |
| Browser tests        | `npm run test:e2e`        | Desktop/mobile cases and required local connections        |
| Aggregate test stage | `npm test`                | All required test suites, in their reviewed order          |
| Asset build          | `npm run build`           | The production assets and required build plugins           |

The suite-specific command names are examples; define `npm test` so the reviewed test stage retains your application's actual coverage. Do not skip browser cases, remove tests or weaken the build to make a migration pass. Build assets without lifting the application or starting production jobs and providers.

Pin the supported Node image and architecture consistently with the app Dockerfile and the reviewed policy. Validate the exact committed source. A merge with a different SHA needs evidence for that new source.

## Provision dependencies before network isolation

The stock official Node image does not include a Playwright browser and all of its Linux libraries. Browser tests need an app-owned, reviewed provisioning path that fits the supported runtime and [workspace/memory budgets](/slipway/ci-resources#supported-budget).

Installation lifecycle scripts execute during `npm ci`, while installation network access is available. Provision required browser binaries and compatible libraries before the network is disconnected, then select those workspace files in the application's test configuration. Validate launch and the complete suite with networking disconnected. Keep the existing browser flags, host validation and test coverage unless a separately reviewed change is needed.

The non-root, read-only sandbox is not a system-wide package installer. Do not solve missing dependencies by adding privileges, mounting the host, copying production settings or downloading during the isolated check stages. Downloaded browser/system-library dependencies also need version and provenance review; a pinned Node image and npm lockfile alone do not make external system-package resolution hermetic.

### App-owned Chromium provisioning pattern

For a reviewed Debian 12 AMD64 Node image, an application can prepare browser dependencies during its Linux CI test installation:

1. Keep APT lists and downloaded archives inside the bounded workspace. Use authenticated package indexes and download-only resolution, then extract the required library and font packages into workspace directories. Do not install system packages or run package maintainer scripts.
2. Use the locked Playwright package to download its Chromium headless shell into a workspace browser directory. Release temporary package archives before extracting the browser to reduce peak workspace use.
3. Select those files in the test wrapper with `PLAYWRIGHT_BROWSERS_PATH`, `LD_LIBRARY_PATH` and a workspace `FONTCONFIG_FILE` and font cache. Fail clearly if preparation is missing; do not download during tests.
4. Gate preparation to the reviewed Linux CI test environment. Keep ordinary development and production installs unaffected, and keep scripts inert when imported by application discovery.
5. Build the browser fixture's real assets in the configuration expected by the tests. Retain the separate production asset build and all existing browser assertions.

This is application-owned setup, not a built-in Playwright executor profile. Browser launch with these workspace dependencies has been verified both before and after network disconnection without changing the sandbox. A launch probe and a passing native suite do not establish that the complete official isolated run passes; verify that run on the exact final commit before claiming compatibility or completing a cutover.

## Current cutover limits

Automatic server checks run as part of deployment admission for the configured branch. Feature branches and pull requests without deployment triggers do not acquire standalone server runs in this profile. There is no general checks-only server-run operation in its CI API. Do not start a production deployment simply to test CI.

Automatic GitHub status mirroring is not implemented in this release. A retained Slipway run is not a GitHub PR status. An internal status-formatting helper does not establish a supported publication path. Keep the GitHub workflow and required status names until a real replacement reporting path is implemented and verified.

Local receipt submission requires explicit app-scoped policy and device approval. Trust granted for another application is not authority for this one. A disposable executor trial without submission does not register a device or prove server acceptance.

## Review and verify the transition

1. Run lint, the full test aggregate and the production asset build on the exact candidate. Inspect installation lifecycle changes as code execution.
2. Confirm all dependencies fit the supported isolation and budgets. Preserve the existing workflow while resolving gaps.
3. Review the app policy against the pushed full SHA, required commands, pinned runtime and architecture. A new policy revision needs new device approval and matching receipts.
4. Retain successful install, lint, all test suites, build and cleanup evidence. Distinguish local compatibility results from accepted server evidence and GitHub reporting.
5. Verify the intended reporting path and exact final commit before retiring a duplicate workflow. Preserve unrelated release and security workflows. Branch-protection and required-status changes are separate decisions.
6. Treat source-check success, merge approval and deployment approval as separate outcomes. Deployment candidate/runtime/health verification still applies.

The read-only status command inspects retained results; it does not execute checks:

```sh
slipway ci:status --project my-app --env production --app web
```

A staged migration can keep both systems while validating compatibility. It is complete only when the intended checks, reporting, final source and deployment boundaries have been verified. Do not label an unfinished application trial or proposed platform capability a completed CI replacement.
