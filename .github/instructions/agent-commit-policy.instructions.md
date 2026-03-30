---
applyTo: "**"
---

# Agent Commit Policy

- For this repository, if an agent's work changes tracked files, the default expectation is that the
  work is not complete until the agent has created a task-scoped commit and pushed it to the current
  branch.

- Keep commits narrowly scoped to the work just completed. Do not include unrelated local changes
  unless the user explicitly asks for that.

- If commit or push is blocked by repo state, permissions, conflicts, or missing context, report the
  blocker and treat the task as incomplete rather than silently skipping the commit.

- If an agent notices a repository issue, broken state, or failed validation that materially affects
  safe progress, call it out immediately and stop to fix it first when feasible.

- If that repo issue cannot be safely fixed in the current turn, report the blocker clearly and
  treat the task as blocked rather than continuing as if the repo were healthy.

- Commit messages must follow `.github/instructions/commit-message.instructions.md`.
