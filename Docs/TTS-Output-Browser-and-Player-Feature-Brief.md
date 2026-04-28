# TTS Output Browser and Player Feature Brief

**Date:** 2026-04-27 **Compiled by:** Agent 08 (GitHub Copilot, GPT-5.4) **Source:** User-supplied
chat transcript fragments **Status:** Consolidated planning brief, not yet implementation-approved
**Scope:** Index historical Ultimate TTS Studio outputs, browse them in the UI, stream playback, and
support job reload for reruns and future editing workflows.

---

## 1. Purpose

This document consolidates the transcript into a single implementation-oriented brief for a TTS
Output Browser and Player feature.

The feature goal is to make historical generations first-class assets in Ultimate TTS Studio:

- browse past generations
- inspect metadata and related scripts
- stream audio inline
- reload a prior job into the UI
- create a foundation for later partial re-record and edit workflows

The transcript evolved during discussion. This brief distinguishes between:

- **Proposed requirements** from the original plan
- **Confirmed decisions** made later in the transcript
- **Areas needing clarification** where the transcript conflicts with itself or leaves gaps

---

## 2. Confirmed Decisions

The following points appear settled in the transcript and should be treated as current intent unless
the user changes direction:

1. The feature should index existing TTS output bundles rather than store audio blobs in a database.
2. SQLite is the intended index store.
3. The indexer should be idempotent and safe to rerun.
4. File paths should be normalized with forward slashes for portability.
5. Autosave metadata JSON is the authoritative source when present.
6. The system should support a browse-and-play workflow in the UI.
7. A `.job.json` artifact should exist for each reloadable job.
8. The indexer, not the UI, should generate `.job.json` automatically if it is missing.
9. The overall storage root for this feature is `F:/TTS Output Files`.
10. The canonical root for project output bundles is
    `F:/TTS Output Files/app_state_outputs/<project>`.
11. The `default` project folder is the fallback location for jobs where the user did not explicitly
    name a project in the UI.
12. When a file can be resolved during indexing, path fields should be stored as full normalized
    forward-slash paths.

---

## 3. Proposed Deliverables

The transcript proposed the following deliverables for the full feature implementation:

- `schema/sql/outputs_schema.sql` - SQLite schema and migration script
- `indexer/tts_indexer.py` - Python CLI tool to scan folders, parse metadata, and populate SQLite
- `indexer/tests/test_indexer.py` - unit tests and fixtures
- `backend/api_spec.md` - minimal REST API spec for the GUI
- `ui/wireframes/tts_browser_wireframe.json` - mockup data for the browser/player UI
- `README.md` - setup, run, and integration guidance
- acceptance tests covering indexing, playback links, and metadata correctness

These were part of the transcript's implementation plan. They are included here for traceability,
not as a statement that the current repository already follows this exact folder layout.

---

## 4. Product Goal

Build a production-ready feature that indexes Ultimate TTS Studio output bundles and exposes an
integrated browse-and-play experience inside the TTS UI.

The desired user experience is:

1. Past jobs appear in a history browser.
2. A user can search and filter them by key metadata.
3. A user can inspect metadata, script files, and output paths.
4. A user can play a historical WAV directly from the UI.
5. A user can reload a prior job into the UI as a reusable template.
6. A later phase may allow editing and partial regeneration of old jobs.

---

## 5. Priority Features

### 5.1 Priority 1 Core

- Accurate parsing of filenames and autosave JSON into discrete fields
- One SQLite row per generation
- CLI scan command that is idempotent and safe to rerun
- GUI-readable API for listing, filtering, and fetching records
- Inline playback through either direct local file access or a simple backend streaming endpoint

### 5.2 Priority 2 UX Enhancements

- Search and filter by project, preset, seed, speaker, and date range
- Quick actions to open folder, copy path, view scripts, and view metadata JSON
- Optional lightweight waveform or progress bar

---

## 6. Core Data Fields

The transcript identified the following fields as the core indexed record shape:

- `project`
- `preset`
- `timestamp` in `YYYYMMDD_HHMMSS`
- `datetime_iso`
- `engine`
- `seed`
- `speaker`
- `chunks`
- `transform`
- `llm_enabled`
- `manual_audio_path`
- `autosave_audio_path`
- `autosave_meta_path`
- `autosave_scripts` as an array
- `legacy_copy`

The later architecture discussion added two more fields:

- `job_json_path`
- `can_reload`

These should be considered part of the current intended model if reload support is implemented.

Implementation default for this brief: path-bearing fields should use full normalized paths when the
indexer can resolve the actual file location. Basename-only transcript examples are useful for
historical reference, but they should not override the normalized storage convention.

---

## 7. Filesystem Model

With the later user clarification applied, the intended storage structure is:

- overall storage root: `F:/TTS Output Files`
- output bundle root: `F:/TTS Output Files/app_state_outputs/<project>`
- fallback project bucket for unnamed jobs: `F:/TTS Output Files/app_state_outputs/default`

The bundle layout under each project is:

```text
F:/TTS Output Files/
├── outputs.db                       # proposed DB location
├── ...                              # other future index/support files
└── app_state_outputs/
    └── <project>/
        ├── audio/
        │   └── <project>_<preset>_<timestamp>.wav
        ├── scripts/
        │   ├── <project>_<preset>_<timestamp>.txt
        │   ├── <project>_<preset>_<timestamp>.original.txt
        │   └── <project>_<preset>_<timestamp>.transformed.txt
        ├── meta/
        │   └── <project>_<preset>_<timestamp>.json
        └── jobs/
            └── <project>_<preset>_<timestamp>.job.json
```

The stated design intent is that one generation becomes one bundle, and one bundle becomes one
reloadable record.

In practical terms, this means:

- the parent root `F:/TTS Output Files` is the feature storage root for the database and related
  support files
- the per-project output content being indexed lives under `app_state_outputs/`
- `default/` is not a special schema exception; it is simply the project bucket for unnamed UI jobs

The current folder snapshot also shows sibling folders such as `audiobooks/` and `outputs/` under
`F:/TTS Output Files`. In the current implementation:

- **`outputs/`** is a flat backup/runtime area, not a canonical history source. When autosave is
  enabled with the "Keep structured autosave audio copy" option, flat WAV files are written here
  for quick runtime access and fallback. This folder is **not** indexed by History reindex and
  loose WAV files here will **not** appear in the History tab.
- **`app_state_outputs/`** is the canonical indexed source and is the only scope for History
  browsing and reload workflows in MVP.
- **`audiobooks/`** is a separate folder for audiobook generation outputs and is outside History
  scope.

### 7.1 Job Bundle Intent

The proposed `.job.json` file is meant to hold everything needed to restore a historical job into
the UI, including:

- clean script
- original script
- transformed script
- voice preset
- engine settings
- seed
- speaker
- transform flags
- chunk count
- output file paths
- timestamps
- future edit history if needed

The transcript described `.job.json` as the single source of truth for reload.

### 7.2 Reload Capabilities and Restrictions

**Implemented behavior:**

- Reload supports richer single-text state restore: when a user reloads a prior job, the UI
  restores the full job context including original script, transformed script, voice preset,
  engine settings, seed, and speaker
- **Exclusions:** API keys and transient upload paths are excluded from reload snapshots to prevent
  stale credentials and unresolvable file references from being reloaded automatically
- **Preset-backed reference audio fallback:** When original reference-audio upload paths are
  unavailable (e.g., the uploaded file was deleted), the system falls back to a preset-backed
  reference voice for the active engine if available during reload

### 7.3 Preview Serving and Gradio Allowed Paths

**Implemented behavior:**

- History preview requires Gradio `allowed_paths` configuration to serve files from autosave
  bundles and legacy local roots
- Allowed paths are computed at app startup from active settings (via `compute_gradio_allowed_paths()`)
  and include the autosave root, app_state output directories, and custom base paths
- **Known limitation:** Changing to a brand new custom base path mid-session requires an **app restart**
  for Gradio preview serving to recognize the new paths. The setting will persist in `app_state/settings.json`,
  but preview links will fail until the app is restarted.

---

## 8. Parsing Rules

### 8.1 Timestamp Format

- Filenames use `YYYYMMDD_HHMMSS`
- The original timestamp token should be stored unchanged
- `datetime_iso` should also be stored as a naive local-time ISO string such as
  `2026-04-25T04:21:28`

### 8.2 Filename Patterns

#### Manual Output

Example:

```text
fish_speech_output_20260425_042121.wav
```

Intended behavior:

- keep the file path as `manual_audio_path`
- infer engine only if it is safely derivable
- prefer metadata JSON over filename heuristics when both exist

If the file is discoverable at scan time, the preferred DB representation for `manual_audio_path` is
the full normalized path rather than a basename-only string.

#### Autosave Bundle Root

Example:

```text
default_no_preset_20260425_042128
```

Intended extraction:

- `project = default`
- `preset = no_preset`
- `timestamp = 20260425_042128`

#### Autosave Files

- `audio/<name>.wav`
- `scripts/<name>.txt`
- `scripts/<name>.original.txt`
- `scripts/<name>.transformed.txt`
- `meta/<name>.json`

### 8.3 Metadata Priority

If autosave metadata JSON exists and is valid, its fields should override filename heuristics.

If metadata JSON is missing or corrupt:

- fall back to filename parsing
- log a warning
- still index what can be indexed safely

---

## 9. Database Expectations

The transcript proposed a single `outputs` table containing at minimum:

- identity and timestamp fields
- metadata fields such as engine, seed, speaker, and chunks
- file path references for audio, metadata, scripts, and job bundle
- reload support fields
- created and updated timestamps

### 9.1 Upsert Behavior

The intended behavior is:

- unique logical key per generation
- insert on first scan
- update existing row on rescan
- preserve `created_at`
- update `updated_at` on changes

### 9.2 Proposed Unique Key

The transcript proposed:

```text
project + preset + timestamp + seed
```

with seed treated as optional.

---

## 10. Indexer Responsibilities

The proposed Python indexer is responsible for:

- scanning the output tree
- finding autosave metadata files
- parsing filenames and metadata
- generating `.job.json` if missing
- validating bundle integrity
- populating or updating SQLite
- marking jobs as reloadable when sufficient artifacts exist

### 10.1 CLI Commands

The transcript proposed these commands:

- `scan`
- `validate`
- `serve` (optional local server for API and playback proxy)

### 10.2 Proposed Scan Options

- `--root`
- `--db`
- `--dry-run`
- `--force-rescan`
- `--threads`

With the clarified storage layout, the implementation defaults for this brief are:

- `--root` should point at `F:/TTS Output Files/app_state_outputs`
- `--db` should point at a database path under `F:/TTS Output Files`, such as
  `F:/TTS Output Files/outputs.db`

### 10.3 Operational Constraints

- Python 3.10+
- prefer stdlib `sqlite3`
- stream file reads where possible
- batch DB writes using transactions
- handle large archives without loading everything into memory
- retry briefly on `sqlite3.OperationalError` with exponential backoff
- respect OS file permissions and fail gracefully on unreadable files

---

## 11. API Summary

The transcript proposed a minimal local API for UI consumption.

### 11.1 `GET /api/outputs`

Query params:

- `project`
- `preset`
- `seed`
- `speaker`
- `from`
- `to`
- `limit`
- `offset`
- `q`

Returns a paginated list of records with metadata and relevant file paths.

### 11.2 `GET /api/outputs/{id}`

Returns full metadata and related script file paths.

### 11.3 `GET /api/stream`

Query param:

- `path`

Returns streamed audio with the correct `Content-Type`.

### 11.4 Security Intent

- local development may run without auth
- production should require a token
- file paths should be validated to remain under an allowed root

---

## 12. UI Requirements

### 12.1 MVP Components

- search bar with filters
- results list with columns for timestamp, project, preset, engine, seed, speaker, chunks, and quick
  play
- detail panel showing metadata, script previews, and quick actions
- inline player with play, pause, seek, and volume
- rescan action or last-indexed indicator

### 12.2 Improved Workflow Goal

The later transcript expanded the UI expectation from browse-and-play into browse-inspect-reload:

```text
[TTS UI]
    -> Browse History
    -> List of Jobs
       -> Play Audio
       -> View Scripts
       -> View Metadata
       -> Reload Job
    -> UI loads .job.json
    -> UI repopulates fields
    -> User modifies and reruns
```

### 12.3 Future Editing Workflow

The transcript also proposed a future workflow, not MVP, for:

1. reload job
2. edit script or replace a section
3. regenerate only affected chunks
4. merge new audio into existing audio
5. save as a new job

---

## 13. Testing and Acceptance

### 13.1 Unit Tests

- filename parsing tests
- metadata JSON parsing tests for valid and malformed cases
- DB upsert tests
- query tests

### 13.2 Integration Tests

- run `scan` on a fixture folder
- assert expected DB rows
- verify playback endpoint streams audio

### 13.3 Manual QA Checklist

- play several historical WAVs in the UI
- verify source, original, and transformed scripts are accessible
- verify rescan updates the DB when new files are added
- verify reload works when `can_reload` is true

### 13.4 Transcript Acceptance Cases

The transcript gave these explicit acceptance targets:

1. A sample record should exist with `timestamp = "20260425_042128"`.
2. That sample should resolve to the manual audio file `fish_speech_output_20260425_042121.wav`.
3. Query by `seed` should return the expected row.
4. Playback endpoint should return HTTP 200 and stream the audio file.

---

## 14. Example Record

The transcript's sample verification row was:

```json
{
  "project": "default",
  "preset": "no_preset",
  "timestamp": "20260425_042128",
  "datetime_iso": "2026-04-25T04:21:28",
  "engine": "Fish Speech",
  "seed": 501928455,
  "speaker": "Confidence Narration",
  "chunks": 105,
  "transform": "deterministic normalisation",
  "llm_enabled": false,
  "manual_audio_path": "fish_speech_output_20260425_042121.wav",
  "autosave_audio_path": "F:/TTS Output Files/app_state_outputs/default/audio/default_no_preset_20260425_042128.wav",
  "autosave_meta_path": "F:/TTS Output Files/app_state_outputs/default/meta/default_no_preset_20260425_042128.json",
  "autosave_scripts": [
    "F:/TTS Output Files/app_state_outputs/default/scripts/default_no_preset_20260425_042128.txt",
    "F:/TTS Output Files/app_state_outputs/default/scripts/default_no_preset_20260425_042128.original.txt",
    "F:/TTS Output Files/app_state_outputs/default/scripts/default_no_preset_20260425_042128.transformed.txt"
  ],
  "legacy_copy": true
}
```

This example is preserved verbatim from the transcript for verification reference.

Implementation note: for the actual DB representation, `manual_audio_path` should be stored as a
full normalized path when the file location is known.

---

## 15. Transcript-Suggested Timeline

The transcript suggested this rough implementation sequence:

1. Day 1: Read transcript and produce schema plus indexer prototype.
2. Day 2: Add tests and CLI polish.
3. Day 3: Produce API spec and UI wireframe, then demo with sample data.

---

## 16. Areas of Confusion, Clarification, or Implementation Notes

The transcript contains several ambiguities and internal conflicts that should be resolved before
implementation starts.

### 16.1 Output of This Document vs Implementation Scope

The user request here was to compile the transcript into a Markdown file, but the transcript itself
contains a full implementation plan and generated starter code. This document preserves the plan,
but does not treat that generated code as approved implementation.

### 16.2 Target Repository Layout Is Not Mapped to This Repo Yet

The transcript proposes deliverables under `schema/sql/`, `indexer/`, `backend/`, and `ui/`, but it
does not explain how those paths should integrate with the current Ultimate TTS Studio repository
structure.

### 16.3 `.job.json` Location Conflicts

The architecture section says `.job.json` should live under a sibling `jobs/` directory:

```text
<project>/jobs/<project>_<preset>_<timestamp>.job.json
```

The later assistant-generated Python example instead writes the file beside the metadata file using
the metadata stem with a `.job.json` suffix. Those are two different storage models.

Recommended default: use the sibling `jobs/` directory described in Section 17.

### 16.4 Root Layout Clarified

This ambiguity has now been clarified by the user:

- storage root for DB and related feature files: `F:/TTS Output Files`
- root for indexed project outputs: `F:/TTS Output Files/app_state_outputs/<project>`
- fallback unnamed-project location: `F:/TTS Output Files/app_state_outputs/default`

This should no longer be treated as an open question unless implementation reveals a different
runtime contract.

### 16.5 Optional `serve` Mode vs Required Streaming Acceptance Test

The transcript describes `serve` as optional, but also makes streaming playback endpoint behavior a
hard acceptance criterion. If streaming is required for acceptance, `serve` is functionally part of
the MVP unless the UI will read local files directly.

Recommended default: implement a local backend playback proxy as part of the MVP, as described in
Section 17.

### 16.6 Manual Audio Path Representation

The transcript sample row stores `manual_audio_path` as a bare filename while autosave paths are
stored as full absolute normalized paths.

Recommended implementation default for this brief:

- if the indexer can resolve the actual file location, store `manual_audio_path` as a full
  normalized path
- treat basename-only transcript values as historical shorthand, not as the preferred DB encoding

### 16.7 Engine Inference Rule Is Ambiguous

The transcript says manual output filenames such as `fish_speech_output_20260425_042121.wav` should
extract engine `Fish Speech` if present in the transcript, otherwise leave engine null and prefer
metadata JSON. That rule depends on narrative context rather than a stable parsing rule.

### 16.8 Unique Key Proposal Needs Technical Review

The transcript proposes a unique key using `project + preset + timestamp + seed`, with seed being
optional. That intent is clear, but the later SQL example uses `COALESCE(seed, -1)` inside a table
constraint and conflict target in a way that needs technical verification before adoption.

### 16.9 Relationship Between Existing Autosave Metadata and New `.job.json`

The transcript describes autosave metadata JSON as authoritative, then later describes `.job.json`
as the single source of truth for reload. The exact contract between those two files is not fully
defined.

### 16.10 Existing App Integration Boundary Is Unspecified

The transcript defines an indexer, database, API, and UI wireframe, but it does not say where in the
current Gradio app these features should live, how state should be persisted inside the repo, or
whether the browser should be part of `app/launch.py`, a sidecar service, or another UI surface.

Recommended default: attach the feature to the main Gradio app in `app/launch.py` and keep the
indexer/storage logic in helper modules, as described in Section 17.

### 16.11 Sample Filenames May Not Be Exhaustive

The original transcript reference says the user would supply the full chat transcript as the
authoritative source for filenames and metadata examples. The current material appears to be a later
chunked summary, so additional filename variants may exist outside this compiled brief.

---

## 17. Recommended Implementation Defaults

The current repository already has three important anchors:

- `app/launch.py` owns output storage settings, autosave flow, the main Gradio UI, and event wiring
- `autosave_generation_artifacts` already sits on the main generation path
- the existing `Jobs` tab covers runtime queue state, which is adjacent in concept but distinct from
  historical output browsing

Given that structure, the recommended defaults for implementation are:

### 17.1 Canonical `.job.json` Location

Use the sibling `jobs/` directory inside each project bundle:

```text
F:/TTS Output Files/app_state_outputs/<project>/jobs/<project>_<preset>_<timestamp>.job.json
```

Rationale:

- it matches the bundle layout already captured in this brief
- it keeps reload state separate from authoritative generation metadata in `meta/`
- it gives the feature room to grow into edit history, UI state snapshots, and rerun parameters
  without overloading the autosave metadata schema
- it avoids coupling reload semantics to the metadata file naming or placement rules

Working contract:

- `meta/*.json` remains the authoritative record of what was generated
- `jobs/*.job.json` becomes the authoritative reload envelope for the UI
- if `jobs/*.job.json` is missing, the indexer should generate it from metadata plus discovered
  script and audio paths

### 17.2 Playback Strategy for MVP

Use a local backend playback proxy endpoint for MVP rather than direct file access.

Rationale:

- the current product is a browser-based Gradio UI, so direct `file://` access is brittle and not a
  good baseline
- a proxy endpoint keeps path validation server-side and avoids exposing arbitrary raw filesystem
  paths to the browser
- it aligns with the existing transcript acceptance test requiring HTTP 200 streaming behavior
- it preserves a clean path to future auth or policy checks without changing the UI contract later

Working contract:

- playback should be local-only by default
- the endpoint should only serve files under `F:/TTS Output Files/app_state_outputs`
- the UI should bind to record IDs or validated server paths, not naked browser filesystem paths

### 17.3 Feature Attachment Point in the Current App

Attach the browser/player UI to the main Gradio application in `app/launch.py` and keep the indexing
and storage logic in helper modules under `app/`.

Rationale:

- `app/launch.py` already owns output storage settings and autosave behavior
- the current UI already has a `Jobs` tab and right-rail output surface, so historical output
  browsing belongs with the main app rather than in the MCP sidecar
- the MCP sidecar is the wrong abstraction for this MVP because this feature is primarily a local UI
  and storage workflow, not an external tool surface
- extracting indexing/query logic into helper modules keeps `launch.py` from taking on another large
  storage implementation directly

Recommended shape:

- add a new history-oriented UI surface in the main app, preferably a dedicated `History` or
  `Library` tab adjacent to `Jobs`
- keep runtime queue state in `Jobs` and persisted output browsing in the new history surface
- put scan, query, and bundle-building helpers in new `app/` modules rather than embedding them
  deeply inside `launch.py`

### 17.4 Practical File Split

If implementation starts in this repository as it exists today, the most pragmatic split is:

- UI/event wiring: `app/launch.py`
- index/query logic: new helper module under `app/`
- schema or migration asset: either under `app/` or `Docs/`-adjacent implementation folders,
  depending on how the coding task is finally scoped
- playback proxy: local route attached to the main app surface, not the MCP sidecar

---

## 18. Recommended Next Step

The major architecture decisions are now resolved and an implementation-ready plan exists in:

- `Docs/TTS-Output-Browser-Implementation-Plan.md`

That implementation plan reflects Agent 00 signoff on:

1. canonical `jobs/` placement for `.job.json`
2. local playback proxy for MVP
3. main-app `History` tab placement adjacent to `Jobs`
4. helper-module split under `app/` for store and service logic

The feature can now move from planning into implementation without reopening the main architecture
questions unless new technical evidence forces a scoped revision.
