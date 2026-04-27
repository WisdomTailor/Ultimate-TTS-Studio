from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Iterable


REPO_ROOT = Path(__file__).resolve().parents[2]
AGENTS_DIR = REPO_ROOT / ".github" / "agents"
FRONTMATTER_RE = re.compile(r"\A---\r?\n(.*?)\r?\n---\r?\n", re.DOTALL)


def iter_agent_files() -> Iterable[Path]:
    return sorted(AGENTS_DIR.glob("*.agent.md"))


def parse_frontmatter(text: str) -> tuple[str | None, str | None]:
    match = FRONTMATTER_RE.match(text)
    if not match:
        return None, "missing YAML frontmatter at top of file"
    return match.group(1), None


def fallback_validate(frontmatter: str) -> list[str]:
    errors: list[str] = []
    if "\t" in frontmatter:
        errors.append("frontmatter contains tab indentation")

    lines = frontmatter.splitlines()
    keys = {
        line.split(":", 1)[0].strip()
        for line in lines
        if line and not line.startswith((" ", "-")) and ":" in line
    }
    if "description" not in keys:
        errors.append("missing required 'description' field")

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("model:") and " or " in stripped:
            errors.append("model field uses invalid 'or' syntax")
        if stripped.startswith("tools:") and re.search(r"tools:\s*[\"']", stripped):
            errors.append("tools field should be a YAML list, not a quoted comma string")
        if stripped.startswith("agents:*"):
            errors.append("agents field uses invalid 'agents:*' syntax")
    return errors


def yaml_validate(frontmatter: str) -> list[str]:
    try:
        import yaml  # type: ignore
    except ImportError:
        return fallback_validate(frontmatter)

    errors: list[str] = []
    try:
        data = yaml.safe_load(frontmatter)
    except Exception as exc:  # pragma: no cover - parser-provided detail is the value
        return [f"invalid YAML: {exc}"]

    if not isinstance(data, dict):
        return ["frontmatter must parse to a mapping"]

    description = data.get("description")
    if not isinstance(description, str) or not description.strip():
        errors.append("description must be a non-empty string")

    model = data.get("model")
    if model is not None and not (
        isinstance(model, str)
        or (
            isinstance(model, list)
            and model
            and all(isinstance(item, str) and item.strip() for item in model)
        )
    ):
        errors.append("model must be a string or a non-empty list of strings")

    tools = data.get("tools")
    if tools is not None and not isinstance(tools, list):
        errors.append("tools must be a YAML list when present")

    agents = data.get("agents")
    if agents is not None and not isinstance(agents, list):
        errors.append("agents must be a YAML list when present")

    return errors


def validate_file(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    frontmatter, error = parse_frontmatter(text)
    if error:
        return [error]
    assert frontmatter is not None
    return yaml_validate(frontmatter)


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate .agent.md frontmatter")
    parser.add_argument("--quiet", action="store_true", help="Only print failures")
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit hook-friendly JSON output",
    )
    args = parser.parse_args()

    failures: dict[str, list[str]] = {}
    for file_path in iter_agent_files():
        file_errors = validate_file(file_path)
        if file_errors:
            failures[str(file_path.relative_to(REPO_ROOT))] = file_errors

    if args.json:
        if failures:
            print(
                json.dumps(
                    {
                        "continue": True,
                        "systemMessage": "Agent frontmatter validation failed. Run the 'Validate agent frontmatter' task.",
                    }
                )
            )
        else:
            print(json.dumps({"continue": True}))

    if failures:
        if not args.quiet:
            print("Agent frontmatter validation failed:", file=sys.stderr)
            for relative_path, messages in failures.items():
                print(f"- {relative_path}", file=sys.stderr)
                for message in messages:
                    print(f"  - {message}", file=sys.stderr)
        return 1

    if not args.quiet:
        print("Agent frontmatter validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())