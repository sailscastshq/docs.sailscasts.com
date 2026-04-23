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

Git Vibe works best when you want one `feat/*` workflow that can handle both parallel lanes and simpler one-checkout work.

## Recommended tools

These are the tools that make the full Git Vibe workflow available:

- `gh` for issue-driven vibes, pull requests, and PR checks
- `codex` or `code` if you want `git vibe open` to launch a workspace app
- `npx skills` if you want to install the Git Vibe skill for Codex

## Install Git Vibe

```sh
curl -fsSL https://raw.githubusercontent.com/sailscastshq/git-vibe/main/install.sh | bash
```

To pin a specific release:

```sh
curl -fsSL https://raw.githubusercontent.com/sailscastshq/git-vibe/v0.0.4/install.sh | GIT_VIBE_REF=v0.0.4 bash
```

If you are working from a local checkout, you can also run:

```sh
./install.sh
```

## Install the skill too

If you use Codex, install the Git Vibe skill alongside the CLI. The CLI creates the workflow. The skill gives the agent the conventions and commands to follow inside it.

```sh
npx skills add sailscastshq/git-vibe
```

## What the installer sets up

The installer:

- installs `git-vibe` into `~/.git-vibe/bin`
- installs global Git hook wrappers into `~/.git-vibe/hooks`
- configures `git vibe`, `git vc`, and `git vr` aliases
- sets shared defaults such as `vibe.baseBranch`, `vibe.branchPrefix`, and `vibe.worktreeRoot`
- updates your shell profile so auto-jump works for `git vibe code`, `git vibe enter`, and `git vibe finish`

## Reload your shell

The installer updates your shell profile, but it cannot modify the terminal session that launched it.

Open a new terminal or reload your profile:

```sh
source ~/.zshrc
```

`git vibe ...` works immediately through the Git alias. Reloading the shell is what enables direct `git-vibe` usage and the auto-jump shell integration in the current session.

## Verify the install

```sh
git vibe version
```

## Pick the right mode

Git Vibe defaults to `worktree`, which is still the best fit when you want one isolated lane per task.

Use `worktree` when:

- you are running multiple agents or experiments in parallel
- you want each task in its own directory
- you want the shell and editor to jump to a dedicated lane

Use `solo` when:

- you usually have one active branch at a time
- you mostly want `git switch`, `npm run dev`, and quick UI iteration
- you want the editor to stay on the same checkout while Git Vibe switches branches

Set your personal default with:

```sh
git config --global vibe.mode solo
```

## Open your first vibe

From a clean `main` checkout:

```sh
git switch main
git pull --ff-only origin main
git vibe code fix-login-redirect
```

In the default `worktree` mode, that creates:

- a branch like `feat/fix-login-redirect`
- a dedicated worktree under `../.vibe/<repo>/fix-login-redirect`
- shared runtime plumbing such as `node_modules` from the main checkout when it already exists
- a context summary showing the path, compare target, and current change state

If your base checkout is already ready to run, Git Vibe links `node_modules` into new vibes by default so commands like `npm run dev`, `npm test`, or framework CLIs can work without reinstalling dependencies.

If you are in `solo` mode, the same command creates or switches `feat/fix-login-redirect` in your current checkout instead. The editor usually stays aligned automatically because the path does not change.

If your project needs more than that, configure `vibe.sharedPaths` in `vibe.toml` for paths like `.venv`, `.direnv`, or `vendor/bundle`.

If you work from issues, you can start directly from the issue number:

```sh
git vibe issue 42
```

::: tip
This is where the AI benefit becomes practical. In `worktree` mode, each vibe is isolated, so you can run one agent in one worktree, explore a second change in another, and keep `main` clean for review or release.
:::

## Attach AI context when you open a vibe

```sh
git vibe code --agent codex --task "fix login redirect" 42
```

This metadata makes it easier to resume a vibe later and understand what it was opened for.

## Open a PR when you are ready

```sh
git vibe pr
```

## Finish the vibe after merge

```sh
git vibe finish --sync 42
```

That fetches the latest remote state, verifies the merge, and cleans up the vibe. In `worktree` mode it removes the worktree. In `solo` mode it switches the current checkout back to `main`.
