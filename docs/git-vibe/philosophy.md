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

Git Vibe is for solo developers and teams that want the speed of AI-assisted development without losing control of their Git workflow.

Its purpose is straightforward: make parallel development structured, predictable, and easy to resume.

## `main` should remain releasable

`main` should be suitable for review, release, and deployment.

That only works when unfinished work, experiments, and exploratory AI output stay in separate worktrees.

## One task, one worktree

Creating another worktree is inexpensive. Mixing unrelated changes is not.

When a single checkout contains multiple ideas, experiments, and AI-generated diffs, review becomes slower and releases become less reliable.

Git Vibe addresses that by giving each task its own worktree.

## AI agents need clear boundaries

AI increases throughput, but it also increases the volume of changes that need to be understood and reviewed.

Git Vibe treats agents as collaborators that need clear context, an isolated branch, and a dedicated workspace.

## Less ceremony, more clarity

Many Git workflows add process when the real problem is ambiguity.

Git Vibe reduces that ambiguity:

- no `develop`
- no stash-heavy switching
- no unclear branch purpose
- no long-lived checkout carrying unrelated pending work

Open a vibe, do the work, open the PR, and finish cleanly.

## Cleanup is part of the workflow

A good workflow should help you close work as well as start it.

That is why Git Vibe includes finish, check, reopen, diff, and cleanup commands. The objective is not only speed. It is also confidence in the state of the repository.
