---
title: Scan CLI Reference
description: Every command, argument, and flag supported by Durable UI Scan 0.0.1.
---

# Scan CLI Reference

## Usage

```text
durable-ui scan [path] [options]
durable-ui [path] [options]
```

With `npx`:

```sh
npx durable-ui scan [path] [options]
```

`path` defaults to the current working directory. It may resolve to a directory or one file. Only one target is accepted.

## Options

| Option                    | Description                                                                                   | Default      |
| ------------------------- | --------------------------------------------------------------------------------------------- | ------------ |
| `--json`                  | Print machine-readable JSON. Alias for `--format json`.                                       | Off          |
| `--format <pretty\|json>` | Select human-readable or JSON output. `--format=value` is also accepted.                      | `pretty`     |
| `--ignore <names>`        | Add comma-separated directory names to ignore. Repeatable; `--ignore=value` is accepted.      | None added   |
| `--max-files <number>`    | Stop collecting source files after a positive integer limit. `--max-files=value` is accepted. | `10000`      |
| `--no-course`             | Hide the course invitation at the end of pretty output.                                       | Course shown |
| `-h`, `--help`            | Print help and exit.                                                                          | —            |
| `-v`, `--version`         | Print the installed scanner version and exit.                                                 | —            |

## Examples

```sh
# Scan the current project
npx durable-ui scan .

# Scan only browser code
npx durable-ui scan ./resources/js

# Add generated directories to the ignore set
npx durable-ui scan . --ignore .venv,generated

# Bound a quick exploratory scan
npx durable-ui scan . --max-files 2000

# Produce clean JSON without promotional copy
npx durable-ui scan . --json > durable-ui-report.json

# Keep pretty output but omit the course invitation
npx durable-ui scan . --no-course
```

## Built-In Directory Ignores

Directory traversal ignores these names by default:

```text
.git, .next, .nuxt, .output, .svelte-kit, .turbo, .vite,
build, coverage, dist, fixtures, node_modules, out, public,
storybook-static, test, tests, __tests__, vendor
```

`--ignore` adds exact directory names to this set; it does not accept glob patterns. Hidden directories are scanned unless their exact name is ignored. Symbolic links and files named like `*.spec.*` or `*.test.*` are skipped.

## Environment Behavior

Pretty output uses color when stdout is a terminal. Set the conventional `NO_COLOR` environment variable to disable color:

```sh
NO_COLOR=1 npx durable-ui scan .
```

JSON output contains no ANSI color or course copy, so it can be parsed directly.
