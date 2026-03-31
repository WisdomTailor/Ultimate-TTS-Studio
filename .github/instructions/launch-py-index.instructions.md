---
applyTo: "app/launch.py"
description: "Required when app/launch.py is in scope: read Docs/launch-py-index.md before reviewing, editing, or answering questions about that file."
---

# launch.py Index — Required Pre-Read

`app/launch.py` is a large mixed-responsibility file that combines backend generation logic, app
state helpers, Gradio layout, and event wiring.

Before reviewing, editing, or answering questions about `app/launch.py`, you must read:

- `Docs/launch-py-index.md`

## Required workflow

1. Read `Docs/launch-py-index.md` first.
2. Identify the target layer of the change.
3. Trace the relevant symbols and bindings listed in the index.
4. Only then start editing or reviewing `app/launch.py`.

## Why this is mandatory

- Search-only edits in `app/launch.py` are high-risk.
- UI controls, handler closures, and generation functions are tightly coupled.
- The index documents the navigation landmarks and the common coupling points that cause regressions.

If the index appears stale, update the index as part of the same task.