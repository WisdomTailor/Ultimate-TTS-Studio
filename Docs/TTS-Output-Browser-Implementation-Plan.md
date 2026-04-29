# TTS Output Browser Implementation Plan

**Date:** 2026-04-27 **Planning Owner:** Agent 08 (GitHub Copilot, GPT-5.4) **Architecture
Signoff:** Agent 00 (Chief Project Manager) **Source Brief:**
`Docs/TTS-Output-Browser-and-Player-Feature-Brief.md` **Status:** Approved for implementation
planning **Scope:** Main-app local history browser for persisted TTS output bundles, with reload
support and validated local playback.

---

## 0. Review Status (2026-04-29)

This plan was reviewed against the current implementation in:

- `app/output_history_store.py`
- `app/output_history_service.py`
- `app/tests/test_output_history_store.py`
- `app/tests/test_output_history_service.py`
- `app/launch.py`

### 0.1 Completed In Code

- Helper-module split is in place: SQLite storage lives in `app/output_history_store.py`, and bundle
  parsing / `.job.json` repair / reload payload logic lives in `app/output_history_service.py`.
- The main app owns the feature: `app/launch.py` adds a top-level `History` tab adjacent to `Jobs`.
- SQLite identity follows the approved rule: `job_json_path` is unique, while `seed` remains
  nullable metadata plus a filterable index.
- `outputs.db` is derived from the parent of the active autosave root, matching the approved
  storage-root decision.
- Reload support is implemented, including richer reload snapshots for newer records and preset
  audio fallback when an engine's original upload path is no longer usable.
- Successful autosave attempts a history upsert, and history-index failures degrade to a warning
  instead of failing the TTS generation path.
- Manual reindex support is implemented.
- Legacy-output migration is implemented: the History tab now exposes `Import Legacy Outputs`,
  which scans the active runtime `outputs/` root, converts loose `.wav` / `.mp3` files into
  canonical `app_state_outputs/default` bundles, reuses matching legacy `.json` / `.txt` sidecars
  when present, and synthesizes minimal metadata/script artifacts when they are missing so imported
  records become indexable.
- Same-process local playback proxy is implemented in the main app startup path. History preview now
  resolves a validated record under the active autosave root and serves audio through
  `/api/history/audio/{record_id}` rather than returning direct filesystem paths to Gradio.
- Runtime-path verification is in place for this release baseline: the active custom autosave root
  (`F:/TTS Output Files/app_state_outputs`) is populated and indexed, so proxy playback targets the
  same live folders users currently save into.
- First-class History filters are now wired in the main app for project, preset, seed, speaker, and
  from/to timestamp bounds while preserving the existing free-text query and current table columns.

### 0.2 Still Needs Fixing Before Calling The Feature Solid

- History detail currently shows path strings and summary text, but not the fuller metadata/script
  browsing workflow described in the approved MVP (`script` previews/links, metadata inspection,
  quick actions such as open-folder / copy-path).
- Autosave bundle naming still uses second-resolution timestamps in the run base with no collision
  disambiguation. Two generations in the same project/preset bucket within the same second can
  overwrite bundle files, including the canonical `.job.json`.
- History indexing is non-fatal, but it still runs inline on the generation success path. It is not
  asynchronous or otherwise non-blocking in the stricter sense.

### 0.3 Review-Coverage Gaps

- Current tests do not cover bundle-name collision handling.
- Current tests do not cover UI-level History interactions such as row selection, filter controls,
  or the custom-base-path restart limitation.
- Current tests do not verify search against stored script text content.
- Current tests only cover the store-level filter/query contract; nested Gradio handler wiring in
  `app/launch.py` remains unexercised by direct tests.

### 0.4 Recommended Next Improvements

1. Add collision-safe bundle naming or suffixing to the native autosave path so `.job.json`
  identity is unique before the DB ever sees same-second generations.
2. Add script/meta preview actions and tests that exercise real History browse-and-reload flows.
3. Add UI-level History interaction coverage for filter controls, import/reindex actions, and
  row/detail selection.

Legacy migration is no longer the main blocker for History adoption; remaining priority is making
the native autosave path collision-safe and deepening browse/reload coverage.

This section is intentionally additive. The original plan below remains the design baseline, while
this review block records what is complete versus what still deviates in the current code.

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

### 1.2.1 Database Location Derivation

**Implemented behavior:** `outputs.db` is always stored at the **parent** of the autosave root:

- If autosave root is `app_state_outputs/` (local default), db is at
  `app_state_outputs/../outputs.db`
- If autosave root is `custom_base/app_state_outputs/` (custom path), db is at
  `custom_base/outputs.db`
- This ensures the database persists at the feature storage root and is shared across all projects
  under that root, eliminating per-project database fragmentation.

### 1.3 MVP Playback Strategy

Playback for the browser/player feature should use a same-process local backend proxy endpoint, not
direct browser file access.

Contract:

- local-only behavior by default
- only serve files under the configured autosave root
- validate requested paths server-side before streaming
- bind the UI to record IDs or validated server paths, not raw filesystem paths

### 1.3.1 Storage Hierarchy and Flat Backup Area

**Implemented behavior:** The app maintains two distinct output storage areas when autosave is
enabled:

- **Canonical indexed source:** `app_state_outputs/<project>/` stores structured autosave bundles
  (audio/, scripts/, meta/, jobs/) that are scanned and indexed by History
- **Flat backup/runtime area:** `outputs/` stores legacy flat WAV files when a user enables "Save
  backup copies to \"outputs/\" folder." This is a flat, unstructured folder used for quick runtime
  access and fallback; it is **not** the canonical history source and is **not** indexed by reindex
  operations
- **Database location:** `outputs.db` resides at the autosave root's parent (see 1.2.1)

Loose WAV files (e.g., in `outputs/`) that are not part of a structured `app_state_outputs` bundle
are **not** indexed by current reindex behavior and will not appear in History.

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
- `compute_gradio_allowed_paths()` to populate Gradio File component allowed paths

Keep outside `app/launch.py`:

- SQLite schema and query logic
- bundle discovery and scan logic
- `.job.json` repair/build logic
- playback path validation helpers

### 1.5.1 Gradio Preview Serving and Allowed Paths

**Implemented behavior:**

- History preview requires Gradio `allowed_paths` configuration to serve files from autosave bundles
  and legacy local roots
- Allowed paths are computed at launch from active settings (`compute_gradio_allowed_paths()`) and
  include the autosave root, app_state output directories, and custom base paths
- **Limitation:** Changing to a brand new custom base path mid-session requires an **app restart**
  for Gradio preview serving to recognize the new paths; the setting will persist but preview links
  will fail until restart

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

- `app/launch.py` Purpose: integrate the History tab, call the history service after autosave, and
  register a local playback proxy route.

- `Docs/TTS-Output-Browser-and-Player-Feature-Brief.md` Purpose: retain as the source planning brief
  and reference this implementation plan.

### 3.2 Files to Add

- `app/output_history_store.py` Purpose: SQLite schema initialization, migration guard, upsert
  logic, list/query functions, lookup by ID, and indexing strategy.

- `app/output_history_service.py` Purpose: bundle scanning, path normalization, metadata parsing,
  `.job.json` repair/build, playback target validation, and reload payload generation.

- `app/tests/test_output_history_store.py` Purpose: verify schema creation, idempotent upsert,
  null-seed behavior, and uniqueness by job bundle path.

- `app/tests/test_output_history_service.py` Purpose: verify bundle discovery, `.job.json`
  creation/repair, normalized path handling, playback validation, and reload payload generation.

### 3.3 Optional Later Files

These are not required for the first implementation slice, but may be added later if the feature
grows:

- `app/output_history_models.py` Purpose: typed record or payload models if the store/service
  modules become large.

- `app/tests/fixtures/output_history/` Purpose: realistic fixture bundles for integration-style
  tests.

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
5. Produce list/detail payloads for the UI (including Audio Length when derivable from WAV headers).
6. Produce reload payloads for the generation form with richer single-text state restore and
   exclusions for API keys and transient uploads.
7. Validate playback targets under the autosave root.
8. Implement preset-backed reference-audio fallback for the active engine when original upload paths
   are unavailable during reload.

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
- audio duration display (when captured in metadata)
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
- do not index loose WAV files outside structured `app_state_outputs` bundles
- do warn (but do not fail) if Gradio allowed_paths cannot be set at launch time
- document the mid-session custom base path restart requirement as a known limitation

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

Agent 00 approved this direction for implementation because it is local-first, Gradio-first, aligned
with the existing autosave architecture, and low-risk for incremental delivery. This plan is the
agreed implementation baseline unless later implementation evidence forces a scoped revision.
