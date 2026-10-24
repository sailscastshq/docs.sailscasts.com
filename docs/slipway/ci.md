---
title: Slipway CI
titleTemplate: Slipway
description: Run reviewed source checks on a trusted local device, then verify deployment on your server.
editLink: true
---

# Slipway CI

Run lint, tests and the build on your development machine. Submit the result for the exact commit you pushed. Slipway checks the evidence before building and verifying the deployment candidate on your server.

**CI → Runs** shows source checks separately from server deployment verification. A local pass alone never approves an application image.

![Slipway CI showing the Sailsconf local source-check pilot](/slipway/ci-runs-0.0.120.png)

## Availability

This guide targets Slipway server **0.0.120** and **slipway-cli 0.0.4**. Server and CLI are released separately; check their release status before installing. No application hook is required for CI. See [release compatibility](/slipway/updates#release-compatibility).

The first execution profile supports a Sails app using npm, a committed lockfile and disposable SQLite. It requires Docker Desktop through a local Unix socket, at least 5 GiB of Docker VM memory, and an immutable official Node 22 image (22.12 or newer). PostgreSQL/Redis test services, injected CI secrets, remote runners and shared caches are outside this profile.

## Review the policy

Connect the application's GitHub repository in Slipway first. Commit and push your source, including `package.json`, `package-lock.json` and the `lint`, `test` and `build` scripts. Review these scripts and npm installation lifecycle scripts: they execute application code.

Select a platform-specific official Node image digest matching your deployment architecture. Pin the Dockerfile base to that digest, or a multi-platform index containing the same image. The server verifies the candidate's Node version and runtime base.

Replace the example target, commit and image digest with your own:

```sh
slipway ci:setup --project my-app --env production --app web \
  --commit <pushed-full-sha> --branch main \
  --image node@sha256:<platform-specific-digest> --platform linux/amd64 \
  --approve-policy --approve-target my-app/production/web
```

The policy binds the repository, app, branch, required commands, executor, runtime and platform. Team owners and admins manage this initial version. Select the app explicitly with `--app`; a project alone is not a CI target.

## Trust your device

```sh
slipway ci:register --project my-app --env production --app web \
  --name 'My development machine' --trust-device \
  --approve-target my-app/production/web
```

This is an explicit trust decision. The signature identifies an approved device; it does not prove that its administrator cannot forge a result. Only approve devices and administrators you trust.

The CLI keeps credentials and the signing key outside the repository. Application checks do not receive either. **CI → Configuration** shows the reviewed policy and approved devices.

![The reviewed policy in Slipway CI Configuration](/slipway/ci-configuration-0.0.120.png)

## Run, push and submit

Commit first. The runner uses a Git archive of that exact commit; uncommitted changes are excluded.

```sh
slipway ci --project my-app --env production --app web --local
# Push that exact commit to the configured branch, then submit the retained report.
slipway ci:submit --project my-app --env production --app web \
  --report <path-printed-by-ci>/report.json
slipway ci:status --project my-app --env production --app web
```

Without `--local`, `slipway ci` also attempts submission immediately. If the commit has not been pushed, retain the report and submit it after pushing. A merge commit with a different SHA needs a new run, even if its files look the same.

Each run uses a disposable non-root Docker container with a read-only root filesystem, two CPUs, 4 GiB memory and a twenty-minute deadline. Installation has network access; required checks run after disconnection. The container receives neither production environment variables nor the host project or Docker socket. Cleanup and bounded local logs are part of the result.

## Deployment verification

Slipway verifies repository metadata directly with GitHub. The current policy, exact branch head, source tree, package and lockfile bytes, approved device, one-use challenge and signed result must match. Successful evidence must be no more than an hour old.

A deployment can wait up to twenty minutes for qualifying evidence. It then builds on the server and checks the immutable image, architecture, Node runtime, current configuration and existing readiness checks. Trust and policy are checked again before traffic moves. Changed policy, revoked devices or mismatched commits block promotion.

Source checks and candidate verification are separate records. Tests are not rerun against the final production image. The initial profile does not promise reproducible builds or hardware-backed execution attestation. Existing rollback checks remain in force.

## Change or revoke access

Review a new policy after changing commands, runtime, platform or executor. Approve devices for that policy again; old results cannot satisfy a new revision.

```sh
slipway ci:revoke --project my-app --env production --app web \
  --runner <runner-uuid> --approve-target my-app/production/web
```

Use **CI → Configuration** to revoke a device or disable the policy. Disabling a policy while an admitted deployment is in flight invalidates that candidate's promotion; review and start a new deployment.

## Adopt it gradually

Keep existing GitHub checks and branch protection while validating the first app. Slipway CI currently covers the reviewed npm workflow and deployment gate; it does not mirror GitHub statuses or replace arbitrary GitHub Actions workflows. Compare identical commits and cold/warm conditions before claiming a speed improvement.

The Sailsconf pilot used real source in an isolated local Slipway instance. It did not change the production CI policy. Production activation follows installation of matching server and CLI releases.
