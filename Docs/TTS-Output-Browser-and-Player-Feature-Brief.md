# TTS Output Browser and Player Feature Brief

**Date:** 2026-04-27
**Compiled by:** Agent 08 (GitHub Copilot, GPT-5.4)
**Source:** User-supplied chat transcript fragments
**Status:** Consolidated planning brief, not yet implementation-approved
**Scope:** Index historical Ultimate TTS Studio outputs, browse them in the UI, stream playback, and support job reload for reruns and future editing workflows.

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

---

## 7. Filesystem Model

The transcript's improved target layout was:

```text
F:/TTS Output Files/
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
- results list with columns for timestamp, project, preset, engine, seed, speaker, chunks, and
  quick play
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
2. That sample should have `manual_audio_path = "fish_speech_output_20260425_042121.wav"`.
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

---

## 15. Transcript-Suggested Timeline

The transcript suggested this rough implementation sequence:

1. Day 1: Read transcript and produce schema plus indexer prototype.
2. Day 2: Add tests and CLI polish.
3. Day 3: Produce API spec and UI wireframe, then demo with sample data.

---

## 16. Areas of Confusion or Clarification Needed

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

### 16.4 Root Path Example Conflicts

The transcript uses both of these as the scan root:

- `F:/TTS Output Files`
- `F:/TTS Output Files/app_state_outputs`

The actual intended root for scanning needs to be made explicit.

### 16.5 Optional `serve` Mode vs Required Streaming Acceptance Test

The transcript describes `serve` as optional, but also makes streaming playback endpoint behavior a
hard acceptance criterion. If streaming is required for acceptance, `serve` is functionally part of
the MVP unless the UI will read local files directly.

### 16.6 Manual Audio Path Format Is Inconsistent

The sample row stores `manual_audio_path` as a bare filename while autosave paths are stored as full
absolute normalized paths. It is unclear whether manual paths should also be stored as full paths.

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

The transcript defines an indexer, database, API, and UI wireframe, but it does not say where in
the current Gradio app these features should live, how state should be persisted inside the repo,
or whether the browser should be part of `app/launch.py`, a sidecar service, or another UI surface.

### 16.11 Sample Filenames May Not Be Exhaustive

The original transcript reference says the user would supply the full chat transcript as the
authoritative source for filenames and metadata examples. The current material appears to be a later
chunked summary, so additional filename variants may exist outside this compiled brief.

---

## 17. Recommended Next Step

Before implementation, resolve the ambiguity list above and lock these four decisions explicitly:

1. canonical scan root
2. canonical `.job.json` storage location
3. whether playback is direct local file access or mandatory API proxy
4. where the feature lives in the current Ultimate TTS Studio architecture

Once those are fixed, this brief can be used as the implementation handoff document.
