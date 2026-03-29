---
applyTo: "**"
---

# Commit Message Instructions

## Format

```
<type>(<scope>): <subject>

<body>
```

## Types

- `feat` — New feature or capability
- `fix` — Bug fix
- `refactor` — Code restructuring without behavior change
- `docs` — Documentation only
- `test` — Adding or updating tests
- `chore` — Build, CI, tooling, or repo maintenance
- `style` — Formatting, whitespace (no logic change)
- `perf` — Performance improvement

## Rules

- **Subject:** imperative mood, no period, max 72 characters.
- **Body:** explain **what** and **why**, not how. Reference issue numbers if relevant.
- **Scope:** use the primary module or area affected (e.g., `ui`, `api`, `config`, `launcher`).
- If the change touches multiple scopes, use comma-separated (e.g., `ui,api`).
- Mention test results if tests were added or modified.
