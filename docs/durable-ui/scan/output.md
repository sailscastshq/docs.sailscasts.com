---
title: Scan Output And JSON
description: Understand Durable UI Scan's terminal report, JSON schema, severities, and machine-readable fields.
---

# Scan Output And JSON

## Pretty Output

The default report starts with the project name, number of files scanned, detected frameworks, and elapsed time. Findings are ordered by severity, then file and line.

Each finding includes:

- `HIGH`, `MEDIUM`, or `REVIEW` severity
- title and source location
- one line of source evidence when available
- user impact
- a browser test
- a recommended direction

When patterns are recognized, a final section counts durable signals already present. The course invitation can be hidden with `--no-course`.

## JSON Output

Use `--json` or `--format json`:

```sh
npx durable-ui scan . --json
```

Version `0.0.1` returns this top-level shape:

```json
{
  "schemaVersion": 1,
  "scannerVersion": "0.0.1",
  "root": "/absolute/path/to/project",
  "frameworks": ["Vue", "Inertia", "Sails"],
  "filesScanned": 177,
  "filesSkipped": [],
  "elapsedMs": 38,
  "summary": {
    "total": 6,
    "high": 1,
    "medium": 5,
    "review": 0
  },
  "positiveSignals": [
    {
      "id": "url-state",
      "title": "URL-backed view state",
      "files": 12
    }
  ],
  "findings": [
    {
      "id": "navigation-rendered-as-button",
      "category": "Navigation",
      "severity": "high",
      "title": "Navigation is rendered as a button",
      "why": "Users lose link previews, open-in-new-tab, copy-link, keyboard, and browser navigation behavior.",
      "test": "Try to copy or open the destination in a new tab with the mouse and keyboard, then use Back; verify it behaves like a normal link.",
      "fix": "Render destination changes as an anchor or framework Link. Keep buttons for actions on the current page.",
      "file": "resources/js/pages/example.vue",
      "line": 42,
      "column": 7,
      "evidence": "<button @click=\"router.push('/settings')\">Settings</button>"
    }
  ]
}
```

The example values illustrate the contract; the report for your project will differ.

## Field Notes

- `schemaVersion` versions the JSON contract independently of the package.
- `scannerVersion` is the installed `durable-ui` package version.
- `root` is the resolved absolute scan root. For a single-file target, it is the file's parent directory.
- `frameworks` contains recognized frameworks in a stable display order.
- `filesScanned` counts readable source files actually inspected.
- `filesSkipped` lists supported source files skipped because they exceed 1 MiB. Ignored directories, test files, symbolic links, and files beyond `--max-files` are not listed here.
- `summary` counts findings by severity.
- `positiveSignals` contains only signals found in at least one file.
- `findings` is sorted by severity, file, and line.

JSON is written to stdout. Argument, path, and scan errors are written to stderr, which keeps successful JSON output parseable.
