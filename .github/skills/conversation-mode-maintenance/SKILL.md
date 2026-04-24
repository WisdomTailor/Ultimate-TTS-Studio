---
name: conversation-mode-maintenance
description:
  "Diagnose, operate, maintain, analyze, and fix Ultimate TTS Studio multi-speaker Conversation
  Mode. Use for AI Format failures, long-story truncation, prompt visibility, prompt-library scope,
  Cast Characters behavior, speaker persistence bugs, preset voice bank assignment, conversation
  voice bank saves, dropdown/CSS popup bugs, stale-server mismatches, and launch.py conversation
  event wiring."
argument-hint:
  "Describe the conversation-mode issue, workflow, bug, UI problem, or maintenance task."
user-invocable: true
disable-model-invocation: false
---

# Conversation Mode Maintenance

## What This Skill Produces

This skill gives an agent a repeatable workflow for diagnosing and maintaining Ultimate TTS Studio's
multi-speaker Conversation Mode end to end.

Use it to:

- troubleshoot Conversation Mode bugs and regressions
- analyze AI Format, Cast Characters, and conversation generation behavior
- maintain preset-bank and conversation-bank workflows
- fix Gradio UI, CSS, dropdown, and event-wiring issues in Conversation Mode
- validate runtime behavior against the currently running app instance
- identify which documentation and indexes must change after Conversation Mode edits

## When to Use

Use this skill when a request mentions any of the following:

- Conversation Mode
- multi-speaker
- AI Format
- Cast Characters
- speaker profiles
- conversation voice bank
- preset voice bank
- apply preset to character
- save character as preset
- prompt library
- conversation AI prompt
- LM Studio response not appearing in UI
- raw story unchanged after AI Format
- long story truncation
- dropdown popup opens in wrong place
- voices mixed up or assigned to the wrong speaker

## Primary Code and State Surfaces

Read these first when relevant:

- `Docs/launch-py-index.md`
- `app/launch.py`
- `app/conversation_logic.py`
- `app/narration_transform.py`
- `app_state/settings.json`
- `app/app_state/presets.json`
- `app/app_state/voices/`
- `app_state/prompt_library.json`
- `app/app_state/speaker_profiles.json`

## Conversation Mode Ownership Map

Use this map to jump to the right layer quickly.

- `app/launch.py` Purpose: Gradio component tree, CSS, nested handlers, event wiring, settings
  persistence plumbing.
- `app/conversation_logic.py` Purpose: conversation parsing, speaker extraction, formatting helpers,
  narration-script conversion.
- `app/narration_transform.py` Purpose: provider helpers, prompt library, OpenAI-compatible chat
  calls, chunking helpers, casting prompt.
- `app_state/settings.json` Purpose: saved LLM provider/model/base URL and conversation prompt
  defaults.
- `app/app_state/presets.json` and `app/app_state/voices/` Purpose: reusable preset voice bank.
- `app/app_state/speaker_profiles.json` Purpose: saved conversation roster mappings.

## Standard Workflow

### 1. Classify the Request

Classify the issue before editing.

- `formatting`: AI Format, prompt, LM Studio output, raw text unchanged, long-story truncation
- `persistence`: wrong character voice assignment, mixed voices, bank save/load issues
- `ui`: dropdown placement, accordion layout, labels, summaries, visibility, stale controls
- `provider`: wrong model, connection issues, prompt scope confusion, provider/model sync
- `generation`: Conversation audio generation, voice sample usage, engine-specific behavior
- `docs`: guide drift, index drift, instruction drift after Conversation Mode changes

### 2. Check the Required Navigation and Runtime Anchors

Before editing `app/launch.py`, always:

- read `Docs/launch-py-index.md`
- identify the specific Conversation Mode control in the component tree
- trace declaration -> nested handler -> `.click()` or `.change()` binding

When debugging reported behavior, also:

- check `logs/` first when useful
- verify the currently running server matches the current workspace code
- compare live UI text against the current `launch.py` to catch stale-server mismatches

## Fast Diagnosis Branches

### A. AI Format Returned Raw Text Unchanged

Check in this order:

1. Confirm the live UI is the current server build, not a stale instance.
2. Inspect `handle_ai_format_script` in `app/launch.py`.
3. Confirm whether Conversation Mode is using a visible conversation prompt or an older hidden
   prompt path.
4. Inspect post-LLM cleanup and parsing.
5. Check the status textbox return path, not just the main textbox.
6. Reproduce with a short benign prose sample and then with the failing long sample.

Decision points:

- If LM Studio shows formatted text but the UI stays raw, compare live DOM against current code and
  check the handler return path.
- If the output includes `SOURCE CONFIRMED:`, strip it before parsing or generation.
- If the output is partially formatted but not parseable, preserve the usable text and show a
  warning instead of silently reverting.

### B. Long Story Only Partially Processed

Check in this order:

1. Confirm whether Conversation `AI Format` is single-pass or chunked.
2. Inspect `chunk_text_for_transform` in `app/narration_transform.py`.
3. If Conversation Mode is not chunked, add bounded chunking and stitch the speaker-formatted output
   back together.
4. Report chunk count or chunk-level warnings in the status text.

Quality criteria:

- long prose should not depend on one huge LLM response
- chunk boundaries should preserve paragraph flow where possible
- stitched output should remain valid `Speaker: Text` script lines

### C. Prompt Library / Prompt Scope Confusion

Check in this order:

1. Determine whether the issue is narration transform, conversation AI Format, or Cast Characters.
2. Inspect which controls are actually wired to the handler in `app/launch.py`.
3. Confirm whether the prompt library is shared, and whether settings are shared or
   namespace-specific.

Known distinctions from this conversation:

- Conversation `AI Format` should use a visible conversation prompt surface.
- Conversation prompt selection can share the prompt library with narration transform while keeping
  separate saved defaults.
- `Cast Characters` keeps its own built-in casting prompt even when provider/model are shared.

### D. Preset Bank / Character Assignment / Persistence Bugs

Check in this order:

1. Distinguish reusable preset voice bank from saved conversation voice bank.
2. Inspect `assigned_preset`, selected profile, and per-character settings in `app/launch.py`.
3. Verify case-insensitive speaker matching and no positional fallback reassignment when loading
   saved banks.
4. Confirm that applying a preset only changes the selected character.
5. Confirm that saving a conversation bank stores the whole roster mapping separately from reusable
   presets.

Quality criteria:

- no cross-character voice reassignment
- preset actions affect only the selected character unless explicitly saving the full bank
- saved mappings survive restart

### E. Dropdown or Popup Positioning Bugs

Check in this order:

1. Inspect the local container classes around the affected control.
2. Inspect the actual Gradio popup element used by the current build, especially `ul.options`.
3. Anchor the popup to the nearest local panel instead of widening all dropdown CSS globally.
4. Keep the fix local to the affected section whenever possible.

Known pattern from this conversation:

- Conversation AI dropdowns needed a local `.conversation-ai-panel .wrap ul.options` anchor.
- Preset Voice Bank dropdowns needed a separate local container and the same popup anchoring
  strategy.

### F. Stale Runtime vs Current Code Mismatch

Use this branch whenever the live UI does not reflect the code you are reading.

Check in this order:

1. Compare live labels or summary text with `launch.py` strings.
2. Identify the process listening on `127.0.0.1:7860`.
3. Restart the app from the current workspace if it is serving stale code.
4. Recheck the live DOM for the newly added controls before diagnosing further.

## Editing Rules for Conversation Mode

- Prefer narrow edits in `app/launch.py`.
- If a UI issue is local, fix it with local CSS selectors or local event wiring.
- Preserve the distinction between:
  - reusable preset voice bank
  - full conversation voice bank
  - conversation AI prompt surface
  - built-in Cast Characters prompt
- Do not broaden global dropdown CSS unless the bug is truly global.
- For long-input formatting, prefer chunking over raising token limits indefinitely.

## Validation Sequence

After the first substantive edit, do a focused validation immediately.

Preferred order:

1. Problems check on the touched file
2. narrow syntax check such as `python -m py_compile app/launch.py`
3. live runtime verification against the running app when applicable
4. only then continue with adjacent edits

For Conversation Mode changes, validate at least one of:

- live UI shows the new control or text
- dropdown opens from the correct local anchor
- AI Format returns changed text for representative prose
- long story path reports chunked processing instead of partial silent failure

## Completion Checks

Do not consider the task complete until these are true when applicable:

- the affected control is visible in the live app
- the handler output shape still matches the Gradio outputs list
- `app/launch.py` has no new Problems errors
- `python -m py_compile app/launch.py` succeeds
- no unrelated Conversation Mode sections were broken
- if repo files changed, commit and push the scoped change

## Documentation Follow-through

After any Conversation Mode behavior change, check whether these need updates:

- `Docs/launch-py-index.md`
- `Docs/LLM-Narration-Transform-Guide.md`
- `README.md`
- any instructional docs describing prompt scope, AI Format, banks, or UI controls
- indexes or review docs that still describe old hidden-prompt or non-chunked behavior

## Example Prompts

- `/conversation-mode-maintenance Fix why AI Format returns my raw story unchanged even though LM Studio shows formatted output.`
- `/conversation-mode-maintenance Investigate multi-speaker voice assignments getting mixed up after loading a saved bank.`
- `/conversation-mode-maintenance Add a local CSS fix for the Conversation preset dropdown opening behind the next panel.`
- `/conversation-mode-maintenance Explain which prompt actually controls Conversation AI Format and update the UI so it is visible.`
- `/conversation-mode-maintenance Audit long-story handling in Conversation Mode and add chunking if needed.`

## Most Likely Ambiguities to Resolve Later

These are the parts that may need refinement over time:

- whether Cast Characters should eventually expose its own visible prompt surface
- whether the shared prompt library should split into narration and conversation scopes
- what chunk size works best across local models for long-story AI Format
- which user-facing docs should become the source of truth for Conversation Mode behavior
