# Ultimate TTS Studio — Revised Strategic Roadmap v2.1

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

| WI  | Title                                    | App commit | Parent commit        |
| --- | ---------------------------------------- | ---------- | -------------------- |
| 1   | Module extraction: `narration_transform.py` | `20afb9b` | `e3bb7fc`            |
| 2   | Evaluation metric definitions            | —          | `7923b41`            |
| 3   | Golden multi-speaker dataset             | `2440279`  | `c51e40f`            |
| 4   | Phase 5 gate docs in AGENTS.md           | —          | `90342bf`            |
| 5   | VibeVoice `ENGINE_EXPRESSIVENESS` fix    | `4b4d712`  | `445ff7e`            |
| 6   | Smoke test Phase 2 end-to-end            | N/A (verified, no code changes) | N/A   |
| 7   | Repo hygiene                             | `300f29e`  | `61fd1c3`, `fb69a6d` |

1. **Module extraction: `narration_transform.py`** ✅ — Constants, deterministic normalization,
   provider helpers, and transform functions extracted from `launch.py`. Zero Gradio imports.
   ≥80% unit test coverage achieved (app `20afb9b`, parent `e3bb7fc`).
2. **Evaluation metric definitions** ✅ — Metric specs documented: consistency (exact match for
   Minimal/Polish, >95% for Vivid), provider parity (cosine >0.80 via sentence-transformers),
   speaker attribution (F1 >0.75). Test execution plan created (parent `7923b41`).
3. **Golden multi-speaker dataset** ✅ — 5–10 annotated conversation scripts created for speaker
   attribution evaluation (app `2440279`, parent `c51e40f`).
4. **Phase 5 gate documentation** ✅ — Phase 5 entry criteria added to `AGENTS.md`
   (parent `90342bf`).
5. **VibeVoice `ENGINE_EXPRESSIVENESS` fix** ✅ — VibeVoice added to the engine capability matrix
   (app `4b4d712`, parent `445ff7e`).
6. **Smoke test Phase 2 end-to-end** ✅ — Full pipeline verified via Pinokio; all Phase 2 changes
   confirmed working together. No code changes required.
7. **Repo hygiene** ✅ — Loose artifacts committed/gitignored (`APPENDIX_DRAFT.md`,
   `Docs/Review - feedback-010426.txt`) (app `300f29e`, parent `61fd1c3` + `fb69a6d`).

---

### Phase 3 — Conversation Enhancement

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

**Completion gate:** Provider parity tests pass (same input on Ollama, LM Studio, Gemini → cosine
similarity >0.80). Speaker attribution F1 >0.75 on golden dataset.

---

### Phase 4a — MCP Server + Tools

**Purpose:** Expose TTS Studio capabilities to external tools and coding agents.

1. **Gradio built-in MCP evaluation spike** — Test `mcp_server=True` fitness. If ≥80% tool surface
   covered, build on top of it.
2. **Tool implementation** — `transform_text`, `list_engines`, `list_voices`, `synthesize`,
   `structure_conversation`, `get_engine_info` + job tools: `submit_synthesis_job`,
   `get_job_status`, `cancel_job`, `list_outputs`.
3. **Transport: streamable-http** — Bound to 127.0.0.1. `.vscode/mcp.json` config example.
4. **Security layer** — OAuth-aligned auth. Per-tool rate limits (synthesize: 1-2 concurrent,
   transform: higher, reads: loose). Token/session-based limiting. Audit logging.
5. **Threading** — Separate MCP subprocess with IPC. Fallback: shared ASGI app.

---

### Phase 4b — Assistant + Job Orchestration

**Purpose:** In-app help and batch processing infrastructure.

1. **Assistant UI** — Status bar (`gr.Row` at top) + full Assistant tab with chatbot component.
2. **Assistant LLM decoupling** — Shared provider infrastructure with separate config namespaces
   (`narration_llm` vs `assistant_llm`). Shorter retries/timeouts for assistant.
3. **Diagnostic capabilities** — Connection testing, error interpretation, settings suggestions.
4. **Job orchestration** — Background job system with gr.Timer polling. Queue, cancel, retry,
   resume. Progress reporting for eBook/batch generation.

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

## 4. Key Architectural Decisions

### Module Architecture (Target: End of Phase 3)

```text
launch.py              — Gradio UI, event handlers, app lifecycle
narration_transform.py — Constants, deterministic normalization, LLM transform, prompt assembly
engine_registry.py     — Engine handlers, capability matrix, cue stripping
conversation_logic.py  — Multi-speaker structuring, NarrationScript model, attribution
```

All three extracted modules: zero Gradio imports, ≥80% unit test coverage, importable independently.

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

### MCP Architecture (Phase 4a)

- Evaluate Gradio built-in MCP (`mcp_server=True`) before custom FastMCP
- Transport: `streamable-http` on 127.0.0.1
- VS Code config: `.vscode/mcp.json`
- Prefer subprocess with IPC for crash isolation

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
| Phase 5 scope creep — features creep into Phase 3/4                 | All       | HIGH     | Auto-gate on Phase 4 completion. Explicit entry criteria. Fresh prioritization.                                      |
| Module extraction regression — refactoring breaks existing features | Phase 2.5 | MEDIUM   | ≥80% test coverage before extraction. Run evaluation harness after each module cut.                                  |

---

## 7. Document Revision History

| Date       | Version | Changes                                                                                                                                                                                         |
| ---------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-04 | 2.0     | Initial revised roadmap incorporating Architecture Review 040426 findings, four-member council review. Phase 4 split into 4a/4b. Phase 2.5 added. Module extraction phased. Phase 5 auto-gated. |
| 2026-04-04 | 2.1     | Phase 2.5 marked complete. All 7 work items delivered. `narration_transform.py` extraction shipped (WI-1). Evaluation metrics and golden dataset in place (WI-2, WI-3). Phase 5 gate documented (WI-4). VibeVoice fix landed (WI-5). Smoke test passed (WI-6). Repo hygiene complete (WI-7). |

---

_This document is the authoritative roadmap for Ultimate TTS Studio development. For the user-facing
feature guide, see `LLM-Narration-Transform-Guide.md`. For project-wide agent policy, see
`AGENTS.md`._
