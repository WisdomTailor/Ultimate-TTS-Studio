---
applyTo: "**/test_*.py"
---

# Test Generation Instructions

## Framework

- Use `unittest` by default. Use `pytest` if the project already has a pytest setup.
- Test files: `test_*.py`, living alongside or in a `tests/` directory matching the project
  convention.

## Test Design

- Tests must be **pure unit tests** by default — no network, no GPU, no external services.
- Mock external dependencies (APIs, file I/O to real paths, database connections).
- Test both success paths and error/boundary conditions.
- Each test method should test one behavior.

## Assertions

- Use specific assertions (`assertEqual`, `assertRaises`, `assertIn`) over generic `assertTrue`.
- Include meaningful assertion messages for non-obvious checks.
- For floating-point comparisons, use `assertAlmostEqual` with appropriate precision.

## Structure

- Group related tests in `TestCase` subclasses named `Test<Feature>`.
- Use `setUp` / `tearDown` for shared fixtures; prefer `setUpClass` for expensive one-time setup.
- Keep test data inline or in a `fixtures/` directory — never depend on runtime state.
