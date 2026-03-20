---
title: Daily workflow
titleTemplate: Git Vibe
description: The issue-to-PR loop that Git Vibe is designed to make natural.
prev:
  text: Getting started
  link: /git-vibe/getting-started
next:
  text: AI workflows
  link: /git-vibe/ai-workflows
editLink: true
---

# Daily workflow

Git Vibe works best when it manages the branch and worktree lifecycle for one task at a time.

## Start from an issue

```sh
git vibe issue 42
```

Git Vibe reads the issue title, creates a deterministic branch, and opens the corresponding worktree.

## Do the work inside the vibe

Useful commands while a vibe is active:

```sh
git vibe diff
git vibe check
git vibe checks
git vibe enter 42
git vibe open 42
```

- `diff` shows the cumulative change for the current vibe
- `check` shows branch, compare target, PR, checks, and session context
- `enter` moves your shell back into the vibe
- `open` reopens the same vibe in Codex Desktop or VS Code

## Open the pull request

```sh
git vibe pr
```

For issue-driven vibes, Git Vibe can use the issue title as the PR title and add `Closes #<issue>` to the body.

## Finish after merge

```sh
git vibe finish --sync 42
```

This is the standard flow when the PR merged on GitHub and your local refs may be out of date.

## Recover from worktree issues

If you moved or deleted a worktree manually, use:

```sh
git vibe list
git vibe doctor
git vibe doctor --repair
```

The objective is simple: make the correct workflow easy to follow and easy to repeat.

## A full example

```sh
git switch main
git pull --ff-only origin main
git vibe issue 42
git commit -m "feat: implement the fix"
git vibe pr
git vibe check
git vibe finish --sync 42
```

That is the full cycle: open a vibe, do the work, submit the PR, and clean up.
