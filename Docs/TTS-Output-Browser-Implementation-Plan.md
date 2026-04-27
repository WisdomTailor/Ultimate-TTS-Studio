# TTS Output Browser Implementation Plan

**Date:** 2026-04-27
**Planning Owner:** Agent 08 (GitHub Copilot, GPT-5.4)
**Architecture Signoff:** Agent 00 (Chief Project Manager)
**Source Brief:** `Docs/TTS-Output-Browser-and-Player-Feature-Brief.md`
**Status:** Approved for implementation planning
**Scope:** Main-app local history browser for persisted TTS output bundles, with reload support and
validated local playback.

---

## 1. Final Decisions

### 1.1 Bundle Identity and DB Uniqueness

Do not use optional `seed` in any SQLite uniqueness rule.

Canonical identity for a persisted history record is:

- one normalized `.job.json` path equals one history record

Implementation rule:

- treat `seed` as nullable metadata only
- index `seed` for filtering
- do not include `seed` in the uniqueness constraint
- upsert records by canonical normalized job bundle path

### 1.2 Canonical `.job.json` Location

Each project bundle should store reload envelopes under a sibling `jobs/` directory:

```text
F:/TTS Output Files/app_state_outputs/<project>/jobs/<project>_<preset>_<timestamp>.job.json
```

Contract:

- `meta/*.json` remains the authoritative record of what was generated
- `jobs/*.job.json` is the authoritative reload envelope for the UI
- if `jobs/*.job.json` is missing, the indexer repairs or creates it from metadata plus discovered
  script and audio paths

### 1.3 MVP Playback Strategy

Playback for the browser/player feature should use a same-process local backend proxy endpoint, not
direct browser file access.

Contract:

- local-only behavior by default
- only serve files under the configured autosave root
- validate requested paths server-side before streaming
- bind the UI to record IDs or validated server paths, not raw filesystem paths

### 1.4 Feature Attachment Point

The feature belongs in the main Gradio application, not the MCP sidecar.

Placement:

- add a dedicated top-level `History` tab adjacent to `Jobs`
- keep runtime queue state in `Jobs`
- keep persisted output browsing and reload in `History`

### 1.5 Launch.py Boundary

`app/launch.py` should remain a thin integration layer.

Keep inside `app/launch.py`:

- UI components
- event wiring
- thin calls into helper modules
- same-process playback route registration

Keep outside `app/launch.py`:

- SQLite schema and query logic
- bundle discovery and scan logic
- `.job.json` repair/build logic
- playback path validation helpers

---

## 2. Repo-Fit Rationale

This plan is approved because it matches the repository as it exists today:

- `app/launch.py` already owns output storage settings and autosave flow
- `autosave_generation_artifacts` already sits on the main generation path
- the app already has a `Jobs` tab, but that surface represents live queue state rather than
  historical browsing
- the product is local-first and browser-based, so a local playback proxy is safer than direct file
  access and less intrusive than a separate service

---

## 3. File Plan

### 3.1 Files to Modify

- `app/launch.py`
  Purpose: integrate the History tab, call the history service after autosave, and register a
  local playback proxy route.

- `Docs/TTS-Output-Browser-and-Player-Feature-Brief.md`
  Purpose: retain as the source planning brief and reference this implementation plan.

### 3.2 Files to Add

- `app/output_history_store.py`
  Purpose: SQLite schema initialization, migration guard, upsert logic, list/query functions,
  lookup by ID, and indexing strategy.

- `app/output_history_service.py`
  Purpose: bundle scanning, path normalization, metadata parsing, `.job.json` repair/build,
  playback target validation, and reload payload generation.

- `app/tests/test_output_history_store.py`
  Purpose: verify schema creation, idempotent upsert, null-seed behavior, and uniqueness by job
  bundle path.

- `app/tests/test_output_history_service.py`
  Purpose: verify bundle discovery, `.job.json` creation/repair, normalized path handling,
  playback validation, and reload payload generation.

### 3.3 Optional Later Files

These are not required for the first implementation slice, but may be added later if the feature
grows:

- `app/output_history_models.py`
  Purpose: typed record or payload models if the store/service modules become large.

- `app/tests/fixtures/output_history/`
  Purpose: realistic fixture bundles for integration-style tests.

---

## 4. Sequenced Build Plan

### Phase 1: Data Layer

1. Add `app/output_history_store.py`.
2. Define the SQLite schema and indexes.
3. Key uniqueness to normalized `.job.json` path, not nullable `seed`.
4. Add list and detail query methods needed by the UI.

### Phase 2: History Service

1. Add `app/output_history_service.py`.
2. Scan `F:/TTS Output Files/app_state_outputs` or the configured equivalent root.
3. Parse autosave metadata and discover audio/script files.
4. Create or repair `jobs/*.job.json` when missing.
5. Produce list/detail payloads for the UI.
6. Produce reload payloads for the generation form.
7. Validate playback targets under the autosave root.

### Phase 3: Write-Path Integration

1. Update `app/launch.py` so successful autosave calls a narrow single-bundle upsert.
2. Ensure history indexing failure degrades to a warning, not a failed TTS run.
3. Keep autosave as the primary source of success/failure semantics.

### Phase 4: UI Integration

1. Add a top-level `History` tab adjacent to `Jobs`.
2. Add MVP controls:
   - filters
   - record list
   - detail panel
   - inline player
   - refresh
   - reindex
   - reload into main generation UI
3. Keep `Jobs` dedicated to live queue state only.

### Phase 5: Playback Proxy

1. Register a same-process local playback proxy route in `app/launch.py`.
2. Stream only validated files under the autosave root.
3. Keep the API local-only for MVP.

### Phase 6: Tests

1. Add store tests for schema and uniqueness behavior.
2. Add service tests for bundle parsing and repair.
3. Add path validation tests for playback.
4. Add reload payload tests.

---

## 5. Schema Direction

The exact SQL can still be drafted in implementation, but the approved schema direction is:

- surrogate integer primary key is acceptable
- canonical uniqueness must be enforced on normalized `job_json_path`
- `seed` is nullable and indexed, not part of identity
- timestamp, project, preset, engine, and speaker should have normal indexes if needed for UI
  filtering

Practical result:

- two records with the same `seed` can exist
- two records with null `seed` can exist
- two records with different metadata but the same canonical `job_json_path` must not both exist

---

## 6. UI Scope for MVP

The MVP History tab should include:

- project/preset/search filters
- date/timestamp display
- engine and speaker metadata
- seed display and filter
- quick playback
- metadata detail panel
- script file links/previews
- refresh and reindex actions
- reload action into the main generation workflow

The MVP should not include:

- waveform editing
- partial re-record
- background watchers
- external-service sync
- MCP-sidecar integration

---

## 7. Risks and Guardrails

### 7.1 Risks

- bundle-name collisions if second-resolution timestamps are insufficient
- silent path trust bugs if playback serves unvalidated files
- `launch.py` bloat if SQLite or parsing logic is embedded directly in UI code
- UX confusion if historical browsing is mixed into `Jobs`
- autosave regressions if history upsert failure is allowed to fail the generation path

### 7.2 Guardrails

- do not use composite uniqueness involving nullable `seed`
- do not introduce a separate daemon, watcher, or sidecar for MVP
- do not trust metadata-provided paths without root validation
- do not block successful generation on history indexing failure
- keep parsing/store logic in helper modules under `app/`
- keep the History tab separate from Jobs

---

## 8. Implementation Entry Criteria

Implementation can proceed using this plan once the coding slice is scoped to:

1. one SQLite store module
2. one history service module
3. one `launch.py` integration slice
4. one dedicated History tab MVP

This is intentionally incremental. It does not require a parallel server architecture or broad app
refactoring.

---

## 9. Signoff

Agent 00 approved this direction for implementation because it is local-first, Gradio-first,
aligned with the existing autosave architecture, and low-risk for incremental delivery. This plan is
the agreed implementation baseline unless later implementation evidence forces a scoped revision.
