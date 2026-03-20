---
title: Getting started
titleTemplate: Git Vibe
description: Install Git Vibe, open your first vibe, and understand the core loop.
prev:
  text: Philosophy
  link: /git-vibe/philosophy
next:
  text: Daily workflow
  link: /git-vibe/daily-workflow
editLink: true
---

# Getting started

Git Vibe is at its best when your team is moving fast with AI. Every task gets its own lane, so you can ask an agent to explore, review, or build without gambling on your current checkout.

## Install Git Vibe

```sh
curl -fsSL https://raw.githubusercontent.com/sailscastshq/git-vibe/main/install.sh | bash
```

## Install the skill too

If you use Codex, install the Git Vibe skill alongside the CLI. The CLI creates the Git lane. The skill teaches the agent how to behave inside it.

```sh
npx skills add sailscastshq/git-vibe
```

## Verify the install

```sh
git vibe version
```

## Open your first vibe

From a clean `main` checkout:

```sh
git switch main
git pull --ff-only origin main
git vibe code fix-login-redirect
```

That gives you:

- a branch like `feat/fix-login-redirect`
- a dedicated worktree under `../.vibe/<repo>/fix-login-redirect`
- a focused context summary showing the path, compare target, and current change state

If you work from issues, you can start directly from the issue number:

```sh
git vibe issue 42
```

::: tip
This is where the AI part stops being hype. Each vibe is an isolated lane, so you can run one agent in one worktree, a second experiment in another, and still keep `main` clean for review or release.
:::

## Attach AI context when you open a vibe

```sh
git vibe code --agent codex --task "fix login redirect" 42
```

That lightweight metadata makes it easier to come back later and remember what that lane was for.

## Open a PR when you are ready

```sh
git vibe pr
```

## Finish the vibe after merge

```sh
git vibe finish --sync 42
```

That fetches the fresh remote state, verifies the merge, removes the worktree, and returns you to a boring, clean `main`.
