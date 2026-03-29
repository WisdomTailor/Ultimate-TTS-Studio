---
applyTo: "**/*.py"
---

# Code Generation Instructions

## Python Style

- Formatter: **Black** with `--line-length 100`.
- Imports: stdlib → third-party → local, separated by blank lines.
- Naming: `snake_case` for functions/variables, `PascalCase` for classes, `UPPER_SNAKE` for
  constants.
- Type hints on all public function signatures.
- Docstrings: Google style for public APIs; omit for obvious internal helpers.

## Safety & Correctness

- Never silently swallow exceptions — log or re-raise.
- Validate at system boundaries (user input, file I/O, API responses).
- Use `pathlib.Path` over string concatenation for file paths.
- Prefer `with` statements for resource management (files, connections).

## Backward Compatibility

- Existing public function signatures must not change without a deprecation path.
- New optional parameters default to the previous behavior.
- If a function is renamed, keep the old name as an alias with a deprecation warning.

## Markdown Output Quality (for generated docs/comments)

- Use fenced code blocks with language identifiers (` ```python `, ` ```json `).
- Use numbered lists for sequential steps, bullet lists for unordered items.
- Wrap lines at 100 characters in prose (Prettier will enforce this).
