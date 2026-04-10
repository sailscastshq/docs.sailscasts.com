---
title: Philosophy
titleTemplate: Git Vibe
description: Why Git Vibe exists and the point of view behind its AI-native workflow.
prev:
  text: Overview
  link: /git-vibe/
next:
  text: Getting started
  link: /git-vibe/getting-started
editLink: true
---

# Philosophy

Git Vibe keeps Git state explicit when humans and AI agents work across editors, terminals, and worktrees.

Its purpose is to open one isolated lane per task and make that lane easy to inspect, reopen, and finish.

## `main` should remain releasable

`main` should be suitable for review, release, and deployment.

That only works when unfinished work, experiments, and exploratory AI output stay out of `main`.

## Worktree by default, solo when simpler

Creating another worktree is inexpensive. Mixing unrelated changes is not.

Git Vibe uses `worktree` as the default mode so each task can stay on its own branch and checkout.

That is still the right answer when you want:

- one isolated lane per task
- parallel AI agents
- multiple experiments running side by side

Use `solo` when you want the same branch-based workflow in the current checkout.

## AI agents need clear boundaries

AI-assisted work increases the number of diffs that still need review. Git Vibe gives agents explicit context, an isolated branch, and, when useful, a dedicated workspace.

## Reduce ambiguity

Git Vibe reduces ambiguity by avoiding:

- no `develop`
- no stash-heavy switching
- no unclear branch purpose
- no long-lived checkout carrying unrelated pending work

Open a vibe, do the work, open the PR, and finish cleanly.

## Cleanup is part of the workflow

Git Vibe includes finish, check, reopen, diff, and cleanup commands so completed work is as explicit as in-progress work.
