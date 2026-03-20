# Contributing to The Sailscasts Docs

We appreciate your interest in contributing to this docs! Your contributions are very valuable to us, and we want to ensure that the process is easy and productive for everyone involved.

Please take a moment to read the guidelines below before contributing to the project.

## Project Description

This project contains the official documentation for open source and commercial projects by The Sailscasts Company.

## Contribution Workflow

This repository follows a `main`-based workflow.

- `main` is the default branch.
- Pull requests should target `main`.
- Short-lived work should happen on feature branches.

## Before Contributing

Before setting up your environment, select an issue you would like to work on.

1. Search through the list of [open issues](https://github.com/sailscastshq/docs.sailscasts.com/issues).
2. Find the issue you want to work on.
3. Check whether someone else has already opened a pull request for it.

If you notice a bug or want to add a feature, create a new issue first.

## Getting Started

1. Fork and clone the repository.
2. Update your local checkout:

```bash
git checkout main
git pull upstream main
```

3. Create a short-lived branch from `main`:

```bash
git checkout -b feat/<my-branch> main
```

4. Make your changes.
5. Commit using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).
6. Push your branch and open a pull request targeting `main`.

## Commit Format

Use conventional commits:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `chore:` for maintenance tasks

Keep commit messages concise, clear, and in the present tense.

## Contribution Etiquette

- Review the issue thread before starting work.
- If no one has claimed the issue, leave a comment saying you are working on it.
- If someone has gone quiet for a long time, it is fine to pick it up later, but leave a comment first.

Thank you for contributing.
