# Ultimate TTS Studio — Revised Strategic Roadmap v2.3

**Date:** 2026-04-04  
**Author:** Agent 00 (Chief Project Manager)  
**Reviewed by:** Council (Agents 01, 09, 11, 13)  
**Supersedes:** Roadmap in LLM-Narration-Transform-Guide.md v1.1  
**Source:** Architecture Review Recommendations 040426

---

## 1. Council Review Summary

Architecture Review 040426 proposed 10 strategic changes across Phases 3–5. A four-member council
reviewed feasibility, risk, and scoping. All 10 recommendations were accepted (most with scoping
adjustments). Key structural changes: Phase 4 split into 4a/4b; module extraction phased across 2.5
and 3; Phase 5 auto-gated on Phase 4 completion.

---

## 2. Final Verdicts

| #   | Recommendation                              | Council Consensus                  | PM Verdict      | Implementation Phase     | Notes                                                                                                                                                                                                                          |
| --- | ------------------------------------------- | ---------------------------------- | --------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **NarrationScript model**                   | Unanimous Accept                   | ACCEPT          | Phase 3                  | Pydantic dataclass. Closed SemanticCue enum (WHISPER, PAUSE, EMPHASIS, EMOTIONAL_BEAT). Semantic versioning with explicit `migrate_v1_to_v2()` functions. Renderer returns `rendered_text` + `engine_overrides`.               |
| 2   | **Pronunciation lexicon / protected terms** | Unanimous Accept                   | ACCEPT          | Phase 3                  | Placeholder masking pre-LLM; pronunciation overrides post-LLM, pre-synthesis. Two-table Glossary accordion UI (protected terms + pronunciation overrides).                                                                     |
| 3   | **MCP security day-one**                    | Unanimous Accept                   | ACCEPT          | Phase 4a                 | OAuth-aligned auth (not custom `.mcp-token`). Per-tool rate limits. Token/session-based limiting, not IP-based.                                                                                                                |
| 4   | **MCP transport: streamable-http**          | Unanimous Accept                   | ACCEPT          | Phase 4a                 | Protocol: `streamable-http`. VS Code config: `.vscode/mcp.json`. Evaluate Gradio built-in MCP (`mcp_server=True` at `/gradio_api/mcp/`) before building custom FastMCP.                                                        |
| 5   | **MCP tool decomposition**                  | Unanimous Accept                   | ACCEPT          | Phase 4a                 | Decomposed tools: `transform_text`, `list_engines`, `list_voices`, `synthesize`, `structure_conversation`, `get_engine_info`. Job-oriented additions: `submit_synthesis_job`, `get_job_status`, `cancel_job`, `list_outputs`.  |
| 6   | **Assistant: Status Bar + Tab**             | Unanimous Accept                   | ACCEPT          | Phase 4b                 | `gr.Row` at page top for status indicator. Full Assistant tab for interaction. No sticky-on-scroll — not worth CSS fragility.                                                                                                  |
| 7   | **Module extraction (phased)**              | Accept (scope divergence resolved) | ACCEPT — PHASED | Phase 2.5 + Phase 3      | Extract `narration_transform.py` as Phase 2.5 prerequisite (~2–3K lines, pure functions, zero Gradio imports). Extract `engine_registry.py` + `conversation_logic.py` during Phase 3. ≥80% unit test coverage for each module. |
| 8   | **Threading model**                         | Accept (prefer subprocess)         | ACCEPT          | Phase 4a                 | Prefer separate MCP subprocess with IPC (crash isolation, easier restarts). Same-process shared ASGI app as fallback.                                                                                                          |
| 9   | **Evaluation expansion**                    | Unanimous Accept                   | ACCEPT          | Phase 2.5 + Phase 3 gate | Define metrics before Phase 3: consistency (exact match for Minimal), provider parity (cosine >0.80), speaker attribution (F1 >0.75). Create 5–10 golden multi-speaker scripts. Add prompt versioning and regression log.      |
| 10  | **Phase 5 gating**                          | Unanimous Accept                   | ACCEPT          | Before Phase 3           | Auto-gate on Phase 4 completion. Phase 5 = fresh prioritization with user feedback, not predetermined backlog. Document gate criteria.                                                                                         |

---

## 3. Revised Phase Structure

### Phase 2 — Transform Quality + Foundations ✅ COMPLETE

- WI-1: Deterministic normalization (app `6835062`, parent `51de3e1`)
- WI-2: Redesigned prompts + mode renames Minimal/Polish/Vivid (app `ccb6adb`, parent `39db27e`)
- WI-3: Engine capability matrix + cue stripping (app `cc04100`, parent `86cf37b`)
- WI-4: Outcome presets UI (app `1b098fa`, parent `08500a1`)
- WI-5: Preview/diff UX (app `9f5f00d`, parent `a85f9e8`)
- WI-6: Evaluation harness (app `b5cdd51`, parent `fcfc0f2`)

---

### Phase 2.5 — Pre-Phase 3 Prerequisites ✅ COMPLETE

**Completed:** 2026-04-04  
**Purpose:** Reduce architectural debt and establish evaluation infrastructure before Phase 3 adds
complexity.

All 7 work items delivered:

| WI  | Title                                       | App commit                      | Parent commit        |
| --- | ------------------------------------------- | ------------------------------- | -------------------- |
| 1   | Module extraction: `narration_transform.py` | `20afb9b`                       | `e3bb7fc`            |
| 2   | Evaluation metric definitions               | —                               | `7923b41`            |
| 3   | Golden multi-speaker dataset                | `2440279`                       | `c51e40f`            |
| 4   | Phase 5 gate docs in AGENTS.md              | —                               | `90342bf`            |
| 5   | VibeVoice `ENGINE_EXPRESSIVENESS` fix       | `4b4d712`                       | `445ff7e`            |
| 6   | Smoke test Phase 2 end-to-end               | N/A (verified, no code changes) | N/A                  |
| 7   | Repo hygiene                                | `300f29e`                       | `61fd1c3`, `fb69a6d` |

1. **Module extraction: `narration_transform.py`** ✅ — Constants, deterministic normalization,
   provider helpers, and transform functions extracted from `launch.py`. Zero Gradio imports. ≥80%
   unit test coverage achieved (app `20afb9b`, parent `e3bb7fc`).
2. **Evaluation metric definitions** ✅ — Metric specs documented: consistency (exact match for
   Minimal/Polish, >95% for Vivid), provider parity (cosine >0.80 via sentence-transformers),
   speaker attribution (F1 >0.75). Test execution plan created (parent `7923b41`).
3. **Golden multi-speaker dataset** ✅ — 5–10 annotated conversation scripts created for speaker
   attribution evaluation (app `2440279`, parent `c51e40f`).
4. **Phase 5 gate documentation** ✅ — Phase 5 entry criteria added to `AGENTS.md` (parent
   `90342bf`).
5. **VibeVoice `ENGINE_EXPRESSIVENESS` fix** ✅ — VibeVoice added to the engine capability matrix
   (app `4b4d712`, parent `445ff7e`).
6. **Smoke test Phase 2 end-to-end** ✅ — Full pipeline verified via Pinokio; all Phase 2 changes
   confirmed working together. No code changes required.
7. **Repo hygiene** ✅ — Loose artifacts committed/gitignored (`APPENDIX_DRAFT.md`,
   `Docs/Review - feedback-010426.txt`) (app `300f29e`, parent `61fd1c3` + `fb69a6d`).

---

### Phase 3 — Conversation Enhancement ✅ COMPLETE

**Completed:** 2026-04-07  
**Purpose:** Build multi-speaker conversation structuring on top of the transform pipeline.

1. **NarrationScript model** — Pydantic dataclass with SemanticCue enum, versioning, migration
   functions.
2. **AI conversation formatter** — LLM-powered speaker detection and attribution, returning
   NarrationScript JSON.
3. **Conversation mode UI** — Character roster + selected-character detail pane + read-only script
   Dataframe + selected-line editor. "Guided form editor" pattern (NOT spreadsheet/script editor).
4. **Per-line transform** — Apply AI Script Polish per speaker line with mode/style/locale.
5. **Pronunciation lexicon UI** — Two-table Glossary accordion: protected terms + pronunciation
   overrides.
6. **Pronunciation pipeline** — Placeholder masking pre-LLM; pronunciation substitution post-LLM,
   pre-synthesis.
7. **Module extraction: `engine_registry.py` + `conversation_logic.py`** — Continue modularization.
   Zero Gradio imports. ≥80% test coverage each.

All 7 work items delivered:

| WI  | Title                                                   | App commit | Parent commit |
| --- | ------------------------------------------------------- | ---------- | ------------- |
| 1   | NarrationScript Pydantic model                          | `f8bb430`  | `682172d`     |
| 2   | AI conversation formatter                               | `6edede9`  | `c7e1abb`     |
| 3   | Conversation mode UI redesign                           | `1e76de8`  | `420c380`     |
| 4   | Per-line narration transform                            | `2161883`  | `8e49031`     |
| 5   | Pronunciation lexicon UI                                | `e24966f`  | `b7e7632`     |
| 6   | Pronunciation pipeline                                  | `c788e26`  | `718c55b`     |
| 7   | Module extraction: engine_registry + conversation_logic | `5f2027f`  | `6decac5`     |

1. **NarrationScript Pydantic model** ✅ — `narration_script.py` (130 lines). SemanticCue enum,
   NarrationLine with validation, NarrationScript with serialization. 23/23 tests.
2. **AI conversation formatter** ✅ — Added to `conversation_logic.py`. LLM-powered speaker
   detection with NarrationScript JSON output. System prompt + JSON extraction. 18/18 tests for
   conversation logic.
3. **Conversation mode UI redesign** ✅ — Guided form editor pattern: character roster (gr.Radio),
   selected-character detail pane (engine-aware), script Dataframe, line editor. All original
   speaker voice components preserved for backward compatibility.
4. **Per-line narration transform** ✅ — `PerLineTransformSettings` dataclass +
   `apply_per_line_transform()` with pronunciation pipeline integration. 7 new tests (25/25 total
   for conversation_logic).
5. **Pronunciation lexicon UI** ✅ — Two-table Glossary accordion: protected terms + pronunciation
   overrides. Load/Save/Clear. Auto-loads on startup.
6. **Pronunciation pipeline** ✅ — `pronunciation.py` (~293 lines). Placeholder masking (guillemet
   format), phonetic substitution, lexicon JSON persistence (v1.0). 12/12 tests, 100% coverage.
7. **Module extraction** ✅ — `engine_registry.py` (153 lines, 5/5 tests, 98% coverage) +
   `conversation_logic.py` (~400 lines, 25/25 tests). Zero Gradio imports each.

**Completion gate:** All unit tests pass (83/83 across Phase 3 modules; 4 pre-existing normalization
failures excluded). Integration gate metrics (provider parity cosine >0.80, speaker attribution
F1 >0.75) require live LLM endpoints — deferred to user smoke-test session.

---

### Phase 4a — MCP Server + Tools ✅ IMPLEMENTED (awaiting Agent 00 sign-off)

**Completed:** 2026-04-02 (implementation complete; sign-off pending)  
**Purpose:** Expose TTS Studio capabilities to external tools and coding agents.

**Implementation summary:**

- Architecture chosen: **standalone FastAPI + FastMCP** (`app/mcp_sidecar.py`), mounted at
  `/gradio_api/mcp/`. The Gradio built-in MCP spike (WI-1) confirmed that a separate process was the
  better isolation boundary. Custom FastMCP was chosen over the Gradio built-in.
- Service layer: `app/tts_service.py` — synthesis orchestration, voice listing, output management.
  Zero Gradio imports.
- Security: `app/mcp_security.py` — bearer-token auth via `.mcp_token` file, per-tool rate limits,
  audit logging at `logs/mcp/audit.log`.
- Job persistence: `app/job_manager.py` — disk-backed JSON state under `app_state/jobs/*.json`,
  subprocess workers for crash isolation.

**⚠️ Auth implementation delta:** WI-5 originally specified OAuth-aligned auth (council verdict #3).
The implemented solution uses bearer-token via `.mcp_token` file — simpler and functional for local
usage, but not OAuth-aligned. This is an open decision for sign-off: accept as current-state, or
upgrade to a proper OAuth flow before closing Phase 4a.

**Work items as delivered:**

| WI  | Title                           | Status | Notes                                                                                            |
| --- | ------------------------------- | ------ | ------------------------------------------------------------------------------------------------ |
| 0   | Secret hygiene                  | ✅     | API keys resolved via env vars; no plain-text persistence                                        |
| 1   | Gradio MCP spike                | ✅     | Evaluated; chosen architecture: standalone FastAPI + FastMCP                                     |
| 2   | Service layer: `tts_service.py` | ✅     | Zero Gradio imports; synthesis, voice listing, output mgmt                                       |
| 3   | Read-only MCP tools             | ✅     | `list_engines`, `get_engine_info`, `list_voices`, `list_outputs`, `get_app_version`              |
| 4   | Stateless transform tools       | ✅     | `normalize_text`, `list_llm_providers`, `transform_text`, `structure_conversation`               |
| 5   | Security layer                  | ✅     | Bearer-token auth (`.mcp_token`), per-tool rate limits, audit logging (delta: not OAuth-aligned) |
| 6   | Synthesis tool: `synthesize`    | ✅     | GPU-aware, single-utterance, synchronous with timeout                                            |
| 7   | Job tools                       | ✅     | `submit_synthesis_job`, `get_job_status`, `cancel_job`; subprocess workers                       |
| 8   | Transport + config              | ✅     | SSE endpoint at `/gradio_api/mcp/sse`; `.vscode/mcp.json` rewritten by `Start MCP`               |

**Full tool list (13 tools):** `list_engines`, `get_engine_info`, `list_voices`, `list_outputs`,
`get_app_version`, `normalize_text`, `list_llm_providers`, `transform_text`,
`structure_conversation`, `synthesize`, `submit_synthesis_job`, `get_job_status`, `cancel_job`.

**Completion gate (for sign-off):** Read-only and stateless tools pass contract tests. Security
layer validated. Synthesis tool smoke-tested on ≥2 engines. `.vscode/mcp.json` config works in VS
Code Copilot. Auth delta decision documented and accepted or escalated.

---

### Phase 4b — Assistant + Job Orchestration 🔜 NEXT (pending Phase 4a sign-off)

**Status:** Ready to start. Implementation begins after Agent 00 signs off on Phase 4a.  
**Purpose:** In-app help and batch processing infrastructure.

**Prerequisites (must land before any visible assistant UI):**

- **Config namespace separation** — Split `llm_*` settings into `narration_llm` and `assistant_llm`
  namespaces with independent endpoint, model, and timeout configuration. Shared provider
  infrastructure, separate runtime behavior (shorter retries/timeouts for assistant).
- **Job-state model** — Phase 4a `job_manager.py` satisfies this prerequisite. Verify the API
  contract is sufficient before building the Phase 4b UI on top of it.

**Work items (after prerequisites):**

1. **Assistant UI** — Status bar (`gr.Row` at top) + full Assistant tab with chatbot component. The
   assistant is a consumer of the same service contracts and job APIs as MCP tools — not a special
   path inside the UI.
2. **Diagnostic capabilities** — Connection testing, error interpretation, settings suggestions.
3. **Job orchestration UI** — `gr.Timer` polling for background job progress. Queue visualization,
   cancel/retry controls. Progress reporting for eBook/batch generation.

**Phase 4b depends on Phase 4a being stable.**

---

### Phase 5 — Platform Vision (GATED)

**Entry criteria (ALL must be met):**

1. Phase 4 (both 4a and 4b) stable and shipped (not beta)
2. User demand for each Phase 5 item validated: ≥3 documented user requests OR ≥2 beta testers
   report difficulty without the feature
3. Prioritization workshop held with community feedback
4. Each feature scoped to ≤2 weeks effort per item

**Candidate features (NOT committed):**

- Character bibles and narrator profiles
- Casting presets and series-wide style guides
- DAW export (multi-track audio)
- Subtitle alignment
- CI/CD pipeline integration
- Asset manifests

**Without the entry criteria being met, Phase 5 items are NOT committed to.**

---

### Lab Handover Intake (LM Studio Debug & Dev, 2026-04-10)

**Source:** `WisdomTailor/my-project` commit `8d2011c` (Sprint 3 complete)  
**Handover doc:** `Docs/HANDOVER_TTS_STUDIO.md` (external workspace)

Triaged items from 3 sprints of LM Studio lab work. Items are categorized by priority and roadmap
placement.

#### Immediate (shipped with intake)

| Item | Description | Status |
|---|---|---|
| Think-tag stripping | `strip_think_tags()` for Qwen3 model output cleanup | ✅ Shipped |
| LLM sampling params | Lab-validated defaults (temp 0.25, top_p 0.85, repetition_penalty 1.08) | ✅ Shipped |

#### Phase 4b Candidates

| Item | Lab Reference | Description |
|---|---|---|
| batch_tts_prep | §1.2 | Automate V3 tag formatting via LLM with json_schema enforcement. Lab proved small models (Ministral-3B) can handle formatting if system prompt is precise. |
| V3 protocol extraction | §3 | Extract "7 non-negotiable rules" and full V3 tagging protocol from lab preset audit into reusable reference doc. 6 refactoring actions identified (dedup, parameterize, strip HTML, split into composable layers). |
| batch_writer | §1.1 | Script generation pipeline: structured inputs → LLM → stories/scripts. Lab proved batch pattern at 102 tok/s. |

#### Phase 5 Candidates (gated)

| Item | Lab Reference | Notes |
|---|---|---|
| Chained pipeline (Caption → Write → TTS) | §1.3 | Council: do NOT build monolithic pipeline. Use Agent Framework SDK with separate agent classes. |
| Multi-Provider Smart Router | §1.4 | Local-first with cloud fallback. Premature until batch volume justifies routing complexity. |
| Agent Framework migration | §2 | CaptionAgent / WriterAgent / TTSAgent architecture. Prerequisites: SDK install, Agent Inspector, eval datasets. |

#### Performance Baselines (Reference)

Lab-captured benchmarks for comparison (not roadmap items):

- **Text gen (Qwen3-14B):** 30 tok/s (OpenAI SDK) → 61.3 tok/s (speculative decoding, +97%)
- **Vision (qwen3-vl-8b):** 102 tok/s, 2.0s avg, 548 char captions
- **VRAM rule:** 2 models loaded = optimal; 6 models = 3.2× degradation. Load/unload between stages.
- **Sampling (TTS formatting):** temp 0.25, top_p 0.85, repeat_penalty 1.08

---

## 4. Key Architectural Decisions

### Module Architecture (Current: End of Phase 4a)

```text
launch.py              — Gradio UI, event handlers, app lifecycle
narration_transform.py — Constants, deterministic normalization, LLM transform, prompt assembly
narration_script.py    — NarrationScript Pydantic model, SemanticCue enum, versioning
engine_registry.py     — Engine capability matrix, cue stripping, metadata control
conversation_logic.py  — Conversation parsing, speaker extraction, AI formatter, per-line transform
pronunciation.py       — Protected term masking, phonetic overrides, lexicon persistence
tts_service.py         — Synthesis orchestration, voice listing, output management
mcp_sidecar.py         — FastAPI + FastMCP server; all 13 MCP tools; subprocess entry point
mcp_security.py        — Bearer-token auth, per-tool rate limits, audit logging
job_manager.py         — Disk-backed JSON job state, subprocess workers
```

All extracted modules: zero Gradio imports, ≥80% unit test coverage, importable independently. MCP
tools bind to these modules, never to launch.py callbacks.

### NarrationScript Schema (Phase 3)

```python
class SemanticCue(str, Enum):
    WHISPER = "whisper"
    PAUSE = "pause"
    EMPHASIS = "emphasis"
    EMOTIONAL_BEAT = "emotional_beat"

class NarrationLine(BaseModel):
    speaker: str
    text: str
    line_type: Literal["dialogue", "narration", "stage_direction"]
    cues: list[SemanticCue] = []
    confidence: float = 1.0
    ambiguous: bool = False

class NarrationScript(BaseModel):
    version: str = "1.0"
    lines: list[NarrationLine]
    metadata: dict = {}
```

### MCP Architecture (Phase 4a — as implemented)

- **Transport:** SSE endpoint at `/gradio_api/mcp/sse` (FastMCP mounted on FastAPI)
- **Process model:** Separate subprocess (`app/mcp_sidecar.py`), not embedded in the Gradio process
- **Auth:** Bearer-token via `.mcp_token` file (written on sidecar startup)
- **Security module:** `app/mcp_security.py` — rate limiting, audit logging at `logs/mcp/audit.log`
- **Job state:** `app/job_manager.py` — disk-backed JSON under `app_state/jobs/*.json`
- **VS Code config:** `.vscode/mcp.json` rewritten by `Start MCP`; safe empty default tracked in
  repo

### Conversation Mode UI Pattern (Phase 3)

- Character roster sidebar (add/edit/delete characters)
- Selected-character detail pane (voice, description, style)
- Read-only script Dataframe (overview of all lines)
- Selected-line editor (edit one line at a time with context)
- "Guided form editor" paradigm — NOT spreadsheet/script editor

This keeps within Gradio's strengths and avoids the UI ceiling (per Agent 09).

---

## 5. Evaluation Infrastructure

### Metrics Specification (Define in Phase 2.5)

| Test Type                       | Input                       | Method                                  | Metric                                    | Pass Threshold |
| ------------------------------- | --------------------------- | --------------------------------------- | ----------------------------------------- | -------------- |
| Transform Consistency (Minimal) | 100 test sentences          | Run 3x                                  | Exact string match                        | 100%           |
| Transform Consistency (Vivid)   | 50 test sentences           | Run 3x                                  | Cosine similarity                         | >0.95          |
| Provider Parity (Polish)        | 20 representative sentences | Compare across 3 providers              | Cosine similarity (sentence-transformers) | Mean >0.80     |
| Speaker Attribution             | 5–10 golden scripts         | Compare AI vs manual labels             | F1 score                                  | >0.75          |
| Audio Regression                | Reference audio set         | Duration, silence ratio, clip detection | Within tolerance                          | ±10% duration  |

### Prompt Versioning

Track system prompt changes in a versioned directory:

```mermaid
graph TD
    A[Prompts] --> B[Narration Transform System]
    A --> C[Speaker Attribution System]
    B --> D[v1.txt]
    B --> E[v2.txt]
    C --> F[v1.txt]

prompts/
├── narration_transform_system_v2.txt
├── speaker_attribution_system_v1.txt
└── test_results/
    ├── consistency_v2_YYYY_MM_DD.json
    └── parity_v2_providers_YYYY_MM_DD.json
```

Before shipping any phase, require a test report showing all relevant tests pass.

---

## 6. Risk Register

| Risk                                                                | Phase     | Severity | Mitigation                                                                                                           |
| ------------------------------------------------------------------- | --------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| Gradio UI ceiling — conversation UI too complex for Gradio          | Phase 3   | HIGH     | "Guided form editor" pattern. If insufficient, evaluate Gradio custom components before considering platform switch. |
| Provider parity — LLM outputs vary significantly across providers   | Phase 3   | MEDIUM   | Provider parity tests as Phase 3 completion gate. Model-specific prompt templates for weaker models.                 |
| NarrationScript migration — schema changes break saved scripts      | Phase 3+  | MEDIUM   | Semantic versioning with explicit migration functions. Never delete fields — deprecate with fallback.                |
| MCP security gaps — localhost exposure without auth                 | Phase 4a  | HIGH     | Security from day one. OAuth-aligned auth, per-tool rate limits, audit logging.                                      |
| MCP–UI coupling — tools bound to Gradio callbacks                   | Phase 4a  | HIGH     | Service layer extraction (WI-2) before any tool wiring. MCP binds only to pure modules.                              |
| Secret hygiene — API keys in plaintext JSON app state               | Phase 4a  | HIGH     | Blocker WI-0: env-var resolution only. Remove key fields from settings.json schema.                                  |
| Phase 5 scope creep — features creep into Phase 3/4                 | All       | HIGH     | Auto-gate on Phase 4 completion. Explicit entry criteria. Fresh prioritization.                                      |
| Module extraction regression — refactoring breaks existing features | Phase 2.5 | MEDIUM   | ≥80% test coverage before extraction. Run evaluation harness after each module cut.                                  |

---

## 7. Document Revision History

| Date       | Version | Changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-04 | 2.0     | Initial revised roadmap incorporating Architecture Review 040426 findings, four-member council review. Phase 4 split into 4a/4b. Phase 2.5 added. Module extraction phased. Phase 5 auto-gated.                                                                                                                                                                                                                                                                         |
| 2026-04-04 | 2.1     | Phase 2.5 marked complete. All 7 work items delivered. `narration_transform.py` extraction shipped (WI-1). Evaluation metrics and golden dataset in place (WI-2, WI-3). Phase 5 gate documented (WI-4). VibeVoice fix landed (WI-5). Smoke test passed (WI-6). Repo hygiene complete (WI-7).                                                                                                                                                                            |
| 2026-04-07 | 2.2     | Phase 3 marked complete. All 7 work items delivered. `narration_script.py` created (WI-1). AI conversation formatter added to `conversation_logic.py` (WI-2). Conversation mode UI redesigned with guided form editor (WI-3). Per-line transform with pronunciation integration (WI-4). Pronunciation glossary UI (WI-5). `pronunciation.py` pipeline (WI-6). `engine_registry.py` + `conversation_logic.py` extraction (WI-7). Module architecture updated to 6 files. |
| 2026-04-07 | 2.3     | Phase 4a restructured: risk-sequenced 9-WI plan (WI-0–WI-8). Secret hygiene blocker added. Service layer extraction (`tts_service.py`) before MCP tool wiring. Read-only/stateless tools first, synthesis second, job control last. Phase 4b amended with explicit prerequisites (config namespace separation, job-state model). Two new risks added to register (MCP–UI coupling, secret hygiene). Grounded in codebase architecture review.                           |

---

_This document is the authoritative roadmap for Ultimate TTS Studio development. For the user-facing
feature guide, see `LLM-Narration-Transform-Guide.md`. For project-wide agent policy, see
`AGENTS.md`._
