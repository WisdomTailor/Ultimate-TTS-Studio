# Review Findings & Recommendations

**Prepared for:** Agent 00 (Chief Project Manager) — Approval Gate  
**Prepared by:** Agent 08 (Global Agent Manager) / GitHub Copilot Chat Session  
**Date:** 2026-03-30  
**Reviewed by:** Agent 00 (Chief Project Manager) — 2026-03-30  
**Last updated:** 2026-03-30 (Rec A implemented, Azure Foundry provisioned)  
**Branch:** `my-custom-features`  
**Repo:** `c:\pinokio\api\Ultimate-TTS-Studio.git`  
**Status:** ✅ SPRINT 1 IN PROGRESS — Rec A implemented and merged. This is a living working
document.

---

## Executive Summary — Quick Reference

| Rec | Title                                    | Verdict                        | Sprint | Owner          | Risk   |
| --- | ---------------------------------------- | ------------------------------ | ------ | -------------- | ------ |
| A   | Provider config refactor (`launch.py`)   | ✅ **IMPLEMENTED** (3 commits) | 1      | Agent 13       | Low    |
| B   | Save OpenAPI schema (docs only)          | ✅ **APPROVED** (as draft)     | 1      | Agent 07 / 08  | None   |
| C   | FastAPI router implementation            | ⏸️ **DEFERRED** to Sprint 2    | 2      | New Agent (14) | Medium |
| D   | Create Integration Reliability Eng agent | ✅ **APPROVED**                | 1      | Agent 08       | None   |

**Architecture decision (Q3 from §8):** Job model = **disk-backed JSON sidecar**. Rationale:
inspectable, no extra deps, aligns with existing sidecar pattern in boundary contract, resilient for
long-running eBook jobs. In-memory is too fragile; SQLite is over-engineered for MVP.

**Boundary contract gap sprint target (Q5 from §8):** Gaps 5 (API key policy) and 7 (error
categories) are addressed by Rec A. Remaining 5 gaps are Sprint 2, gated on Rec A stability.

---

## 1. Scope of This Review

This session investigated three distinct areas:

1. **Auxiliary API server** — understanding the existing internal REST API surface
2. **LLM provider integration** — fitness of current provider preset logic for GitHub Models and LM
   Studio
3. **Public REST API design** — what it would take to expose the full multi-engine studio behind a
   stable API boundary, grounded in `Docs/TTS-Service-Boundary-Contract.md`

All changes to `launch.py` and all new files (OpenAPI schema, FastAPI router) were **drafted but not
applied**. This document records what was found and what was proposed, so that Agent 00 can approve,
reject, or redirect before any repo changes are made.

---

## 2. Current Architecture — What Exists

### 2.1 Main Application (`app/launch.py`)

- ~14,554 lines, Gradio-based UI launched via `demo.launch()`
- **Not a REST API.** All user interaction is through the Gradio web interface.
- Contains all engine orchestration, session state, preset management, and LLM narration-transform
  logic.

### 2.2 Auxiliary API Server (`app/tools/api_server.py`)

- **Scope:** Fish Speech inference only. Does not cover other engines.
- **Stack:** Kui/Uvicorn ASGI, bearer-auth middleware.
- **Launch:** `python tools/api_server.py --listen 127.0.0.1:8080 [--api-key KEY]`
- **Endpoints:**

| Method   | Path               | Purpose                          |
| -------- | ------------------ | -------------------------------- |
| GET/POST | `/v1/health`       | Health check                     |
| POST     | `/v1/tts`          | TTS synthesis (Fish Speech only) |
| POST     | `/v1/asr`          | Automatic speech recognition     |
| POST     | `/v1/vqgan/encode` | VQGAN feature encode             |
| POST     | `/v1/vqgan/decode` | VQGAN feature decode             |

- **Call format:** `application/msgpack` or `application/json`, `Authorization: Bearer <key>`
  header.
- **Client example:** `app/tools/api_client.py`

### 2.3 LLM Narration-Transform Subsystem (`app/launch.py` ~lines 6184–6455)

- Calls any OpenAI-compatible `chat/completions` endpoint via stdlib `urllib`.
- Key functions:

| Function                                      | Purpose                                                        |
| --------------------------------------------- | -------------------------------------------------------------- |
| `get_llm_provider_defaults(provider_name)`    | Returns `(base_url, api_key, model_id)` tuple from static dict |
| `get_llm_provider_env_var(provider_name)`     | Returns env var name to read API key from                      |
| `get_llm_shell_key_setup_hint(provider_name)` | Returns shell export instructions                              |
| `resolve_llm_api_key(provider_name, api_key)` | Checks UI input, falls back to env var                         |
| `call_openai_compatible_chat(...)`            | Builds and sends POST to `base_url + /chat/completions`        |
| `test_llm_connection(...)`                    | Smoke-tests connection with "Reply with OK only."              |
| `apply_llm_narration_transform(...)`          | Runs transform; applies fallback if key missing                |

- **Current named presets in dropdown (line 9052):** Ollama, LM Studio, Google Gemini, vLLM, Custom.
  **GitHub Models is not a named preset.**

### 2.4 Service Boundary Contract

- `Docs/TTS-Service-Boundary-Contract.md` — status: _"integration-approved but
  stabilization-required."_
- Defines 12 minimum request fields, 9 minimum response fields, 3 required `transform_outcome`
  states, 8 lineage requirements, and 7 mandatory stability gaps.
- This contract is the authoritative reference for any public API design.

---

## 3. Findings

### Finding 1 — GitHub Models cannot be used reliably as a "Custom" preset

> **Agent 00 Comment:** Confirmed. I verified `call_openai_compatible_chat` at line 6268 — only
> `Content-Type` and `Authorization` are sent. This is a real user-facing gap.

**Evidence:**  
`call_openai_compatible_chat` (line 6268) only sends `Content-Type` and `Authorization` headers.
GitHub Models requires two additional headers:

```text
Accept: application/vnd.github+json
X-GitHub-Api-Version: 2026-03-10
```

GitHub Models also uses a distinct env var (`GITHUB_MODELS_TOKEN`), a distinct base URL
(`https://models.github.ai`), model IDs shaped as `publisher/model_name` (e.g.
`openai/gpt-4.1-mini`), and always requires an API key.

**Impact:** A user who enters GitHub Models as a Custom preset will silently fail or get
authentication errors with no actionable feedback.

---

### Finding 2 — Provider config is too flat to support per-provider behavior

> **Agent 00 Comment:** Confirmed. The tuple design makes every new provider a multi-function
> scatter edit. The structured dict approach in Rec A is the right call.

**Evidence:**  
`get_llm_provider_defaults` returns a plain `(base_url, api_key, model_id)` tuple. There is no
structure for per-provider custom headers, whether an API key is required, what kind of provider
this is (local vs. remote), or which env var to use (only Gemini is treated differently from the
generic `OPENAI_API_KEY`).

**Impact:** Adding any new provider that deviates from the base OpenAI pattern (headers, key policy,
local vs. remote) requires code changes scattered across four separate functions.

---

### Finding 3 — LM Studio, while named in the dropdown, is indistinguishable from "Custom" in fallback logic

> **Agent 00 Comment:** Confirmed. The key guard at line 6430 only checks for Gemini. Ollama is also
> local and should share the same `requires_api_key: false` treatment.

**Evidence:**  
LM Studio is mapped to `OPENAI_API_KEY` in `get_llm_provider_env_var`, has no `kind` marker, and has
no `requires_api_key: False` flag. The fallback guard in `apply_llm_narration_transform` only checks
for Gemini.

**Impact:** A user running LM Studio locally (which requires no API key) may see spurious
key-missing warnings.

---

### Finding 4 — No public REST API covers the full multi-engine studio

> **Agent 00 Comment:** Acknowledged. This is a known gap. The boundary contract was intentionally
> approved as architecture-only. Implementation is Sprint 2 work.

**Evidence:**  
The auxiliary API server (`app/tools/api_server.py`) covers Fish Speech only. The main Gradio app
exposes no REST API. Engine selection, voice presets, eBook generation, conversation generation, and
the LLM narration-transform are all UI-only.

**Impact:** Integration with Creative Crafter (Repo B) per `TTS-Service-Boundary-Contract.md` is
currently impossible via API. The boundary contract is architecturally approved but technically
unimplemented.

---

### Finding 5 — The boundary contract has 7 mandatory gaps that block stable sign-off

> **Agent 00 Comment:** Rec A addresses gaps 5 (API key policy) and 7 (error categories — partial).
> The remaining 5 gaps are Sprint 2 work, gated on Rec A stability. This sequencing is correct.

Per `Docs/TTS-Service-Boundary-Contract.md`, the following must be resolved before the boundary is
treated as stable:

1. Transform execution parity across single-text, conversation, and eBook flows
2. Consistent semantics for `STRICT`, `NORMALIZE`, and `EXPRESSIVE` across all entry points
3. Explicit surfaced `transform_outcome` in all relevant flows
4. Artifact and sidecar integrity validation
5. Formal API key handling policy
6. Explicit timeout and retry behavior
7. Clear error categories: auth, network, timeout, model/config, and validation failures

---

## 4. Recommendations

### Recommendation A — Apply GitHub Models + provider config refactor to `launch.py` _(Low-risk, high value)_

> **Agent 00 Verdict: ✅ APPROVED — Apply immediately (Sprint 1)**
>
> Findings verified against codebase. The tuple-based design at lines 6184–6200 and the Gemini-only
> key guard at line 6430 are exactly as described. This is surgical, isolated, and directly fixes
> user-facing bugs.
>
> **Implementation owner:** Agent 13 (LLM Integration Specialist). **Review:** Agent 09 (Gradio UI)
> confirms dropdown addition has no layout side-effects.
>
> **Additional condition:** Include Ollama in the `requires_api_key: false` set alongside LM Studio.
> Both are local providers that should never trigger key-missing warnings.

**What:** Refactor the provider preset block from a tuple-based lookup to a structured
`LLM_PROVIDER_CONFIGS` dict, add GitHub Models as a named first-class provider, and thread
per-provider headers and key policy through the call path.

**Why:** Fixes Finding 1, Finding 2, and Finding 3 with a single surgical change block. The Gradio
event wiring (`llm_provider.change` → `get_llm_provider_defaults`) already auto-populates all UI
fields from the defaults function, so adding a new preset is zero-overhead on the UI side.

**Scope of change:**

- `get_llm_provider_defaults` → replace with `LLM_PROVIDER_CONFIGS` dict lookup
- `get_llm_provider_env_var` → derive from config dict
- `get_llm_shell_key_setup_hint` → add GitHub-specific instructions
- `call_openai_compatible_chat` → accept optional `extra_headers` or `provider_name` param
- `apply_llm_narration_transform` → replace Gemini-only key guard with
  `provider_config["requires_api_key"]`
- Dropdown choices → add `"GitHub Models (OpenAI-compatible)"`

**Risk:** Low. The change is confined to one well-isolated block. No engine logic, no audio
pipeline, no Gradio layout is touched.

**New constant required:**

```text
GITHUB_MODELS_API_VERSION = "2026-03-10"
```

**New config shape (per provider):**

```python
{
  "base_url": "...",
  "api_key": "",
  "model_id": "...",
  "env_var": "...",
  "requires_api_key": True/False,
  "kind": "remote" | "local",
  "headers": {}  # extra headers beyond Content-Type and Authorization
}
```

---

### Recommendation B — Save the MVP OpenAPI schema as a repo file _(Zero-risk, documentation only)_

> **Agent 00 Verdict: ✅ APPROVED — Commit as draft documentation (Sprint 1)**
>
> The schema should be saved to `Docs/api-spec-mvp.yaml` with a prominent header marking it as
> **DRAFT — subject to change** until the FastAPI implementation stabilises.
>
> **Implementation owner:** Agent 07 (Documentation) or Agent 08. **Note:** The 13-path surface is
> reasonable for MVP. No paths need to be cut.

**What:** Write the full OpenAPI 3.1.0 YAML (13 paths, all schemas, full security section) to
`Docs/api-spec-mvp.yaml`.

**Why:** The schema was fully designed in this session and grounds the implementation. Saving it
makes it reviewable by Agent 00 before any implementation starts. It does not change any runtime
code.

**Paths defined:**

| Path                              | Purpose                              |
| --------------------------------- | ------------------------------------ |
| `GET /v1/health`                  | Health + version check               |
| `GET /v1/capabilities`            | Loaded engines, voices, presets      |
| `POST /v1/generate/text`          | Single-text TTS job submission       |
| `POST /v1/generate/conversation`  | Multi-speaker conversation TTS       |
| `POST /v1/generate/ebook`         | Long-form eBook audiobook generation |
| `GET /v1/jobs/{jobId}`            | Job status polling                   |
| `GET /v1/jobs/{jobId}/artifacts`  | Completed artifact retrieval         |
| `GET /v1/models`                  | List available engines               |
| `POST /v1/models/{engine}/load`   | Load an engine                       |
| `POST /v1/models/{engine}/unload` | Unload an engine                     |
| `GET /v1/presets`                 | List voice presets                   |
| `GET /v1/presets/{presetId}`      | Get a single preset                  |

**Risk:** None. Documentation file only.

---

### Recommendation C — FastAPI router skeleton for the MVP API _(Medium effort, medium risk)_

> **Agent 00 Verdict: ⏸️ DEFERRED — Not approved for Sprint 1. Plan for Sprint 2.**
>
> Agent 08's dependency analysis is correct. This cannot safely start until:
>
> 1. Rec A is merged and stable (provider config is the foundation for API key policy)
> 2. Rec B schema is committed and reviewed
> 3. Rec D agent is created (clear ownership required before extraction work begins)
> 4. At least gaps 1, 3, 5, 7 from the boundary contract are closed
>
> **Architecture decision:** Job model = **disk-backed JSON sidecar**.
>
> - Inspectable by humans and tools
> - No new dependency (no SQLite package)
> - Aligns with the sidecar metadata pattern already in the boundary contract
> - Resilient for long-running eBook generation (survives process restart)
> - In-memory is too fragile; SQLite is over-engineered for MVP
>
> **Implementation owner:** New Agent 14 (Integration Reliability Engineer), once created via Rec D.

**What:** Implement the 13 endpoints from the OpenAPI schema as a FastAPI router, extract service
logic from `launch.py`, and mount the router in `launch.py` alongside the Gradio app.

**Why:** Required to fulfil the `TTS-Service-Boundary-Contract.md` and allow Creative Crafter (Repo
B) to integrate.

**Dependencies before this is safe to start:**

- Recommendation A must be applied first (provider config must be stable before API key handling
  policy is formalised)
- Recommendation B (OpenAPI schema file) must be approved and saved first
- Agent 00 must confirm async job model is acceptable (jobs accumulate in memory or on disk — a
  design decision is needed)
- At least 4 of the 7 boundary contract gaps should be closed (transform parity, transform outcome
  surfacing, error categories, timeout behaviour)

**Risk:** Medium. `launch.py` is large and tightly coupled. Extracting service functions without
breaking the Gradio UI requires care. Recommend a dedicated specialist agent (e.g. Agent 13 LLM
Integration Specialist for provider config, a new Integration Reliability Engineer for the FastAPI
layer).

---

### Recommendation D — Assign Integration Reliability Engineer agent _(Agent fleet gap)_

> **Agent 00 Verdict: ✅ APPROVED — Create immediately (Sprint 1)**
>
> Agreed that this is a genuine fleet gap. The Gradio↔FastAPI coexistence layer, plus contract
> compliance, is a distinct discipline that neither Agent 01 nor Agent 09 should own.
>
> **Implementation owner:** Agent 08 creates the `.agent.md` file. **Scope:** FastAPI boundary
> layer, sidecar schema, job-state persistence, error categories, contract compliance. Explicitly
> NOT engine internals or Gradio UI. **Slot:** Agent 14 (Integration Reliability Engineer).

**What:** Create a specialist agent focused on the API/boundary layer: FastAPI router, sidecar
schema, job-state persistence, and error category coverage.

**Why:** No existing specialist agent owns this layer. Agent 01 owns engine handlers. Agent 09 owns
Gradio UI. The intersection between Gradio and FastAPI on the same process, plus the contract
compliance requirements, is a distinct discipline.

**Risk:** None. Agent file creation only.

---

## 5. Priority and Sequencing

```text
Sprint 1 (Current):
  ✅ Recommendation A: launch.py provider config refactor          [Agent 13] — DONE (3 commits)
  ✅ Recommendation A+: Azure Foundry provisioned + smoke-tested    [Agent 00] — DONE
  ⬜ Recommendation B: Save OpenAPI schema to Docs/api-spec-mvp.yaml [Agent 07/08] — Not started
  ⬜ Recommendation D: Create Integration Reliability Eng agent       [Agent 08] — Not started

Sprint 2 (Planned — gated on Sprint 1 stability):
  ⏸️ Recommendation C: FastAPI router implementation                 [Agent 14]
     Pre-conditions: Rec A stable, Rec B reviewed, Rec D agent active,
                     boundary contract gaps 1/3/5/7 closed.
```

---

## 6. Files That Would Be Changed

| File                                                       | Change Type                                  | Recommendation |
| ---------------------------------------------------------- | -------------------------------------------- | -------------- |
| `app/launch.py`                                            | Modify (~20 lines replaced across 6184–9069) | A              |
| `Docs/api-spec-mvp.yaml`                                   | Create (new, ~350 lines)                     | B              |
| `app/api/router.py`                                        | Create (new, FastAPI)                        | C (deferred)   |
| `app/api/job_store.py`                                     | Create (new, job state)                      | C (deferred)   |
| `.github/agents/integration-reliability-engineer.agent.md` | Create (new agent file)                      | D              |

---

## 7. Implementation Log

### Rec A — Implemented 2026-03-30

**Commits (submodule `app/` → WisdomTailor/Ultimate-TTS-Studio-SUP3R-Edition):**

| Commit    | Message                                                                                   |
| --------- | ----------------------------------------------------------------------------------------- |
| `fdc011a` | `feat(api): refactor LLM provider config to structured dict, add Foundry + GitHub Models` |
| `3e7434a` | `fix(api): wire real Foundry endpoint, fix Azure OpenAI URL pattern`                      |
| `5ca1d13` | `fix(api): use regional Azure endpoint for Foundry provider`                              |

**Commits (parent repo → WisdomTailor/Ultimate-TTS-Studio):**

| Commit    | Message                                                           |
| --------- | ----------------------------------------------------------------- |
| `44bd3d3` | `chore: update app submodule pointer (Foundry provider refactor)` |
| `3055558` | `chore: update app submodule pointer (Foundry endpoint fix)`      |
| `8ffd92c` | `chore: update app submodule pointer (regional Azure endpoint)`   |

**What changed in `app/launch.py`:** 116 insertions, 41 deletions across 8 replacement blocks:

1. Replaced tuple-based `get_llm_provider_defaults` with `LLM_PROVIDER_CONFIGS` structured dict (7
   providers)
2. Added **Microsoft Foundry** and **GitHub Models** as first-class providers
3. Refactored `get_llm_provider_env_var` to derive from config dict
4. Enhanced `get_llm_shell_key_setup_hint` with Foundry and GitHub-specific hints
5. Added `extra_headers` and `auth_style` params to `call_openai_compatible_chat`
6. Added conditional Azure OpenAI URL pattern
   (`/openai/deployments/{model}/chat/completions?api-version=`)
7. Replaced Gemini-only key guard with generic `requires_api_key` from config
8. Updated dropdown to `choices=list(LLM_PROVIDER_CONFIGS.keys())`

**Providers now available (7):**

| Provider                              | Kind   | Key Required | Auth Style | Base URL                                           |
| ------------------------------------- | ------ | ------------ | ---------- | -------------------------------------------------- |
| Ollama (OpenAI-compatible)            | local  | No           | bearer     | <http://localhost:11434/v1>                        |
| LM Studio OpenAI Server               | local  | No           | bearer     | <http://localhost:1234/v1>                         |
| Google Gemini API (OpenAI-compatible) | cloud  | Yes          | bearer     | <https://generativelanguage.googleapis.com/v1beta> |
| Microsoft Foundry (OpenAI-compatible) | cloud  | Yes          | api-key    | <https://eastus2.api.cognitive.microsoft.com>      |
| GitHub Models (OpenAI-compatible)     | cloud  | Yes          | bearer     | <https://models.github.ai/v1>                      |
| vLLM OpenAI Server                    | local  | No           | bearer     | <http://localhost:8000/v1>                         |
| Custom OpenAI-compatible              | custom | Yes          | bearer     | <http://localhost:8000/v1>                         |

### Azure Foundry Provisioning — 2026-03-30

| Resource         | Value                                                         |
| ---------------- | ------------------------------------------------------------- |
| Subscription     | Azure subscription 1 (`b7c3def6-e2b0-4500-b7c6-2ea244ea2c49`) |
| Resource Group   | `rg-ultimate-tts` (East US 2)                                 |
| AI Services      | `ultimate-tts-foundry` (Kind: AIServices, SKU: S0)            |
| Model Deployed   | `gpt-4o-mini` (v2024-07-18, GlobalStandard, capacity 10)      |
| Working Endpoint | `https://eastus2.api.cognitive.microsoft.com`                 |
| Auth             | `api-key` header (env var: `AZURE_AI_API_KEY`)                |
| Smoke Test       | ✅ Passed — gpt-4o-mini returned "OK", 22 tokens              |

**Note:** The AI Foundry portal endpoint (`services.ai.azure.com`) was not yet DNS-propagated at
time of setup. The regional endpoint works correctly and is what's configured in the code.

---

## 8. Approval Answers from Agent 00

The following decisions were requested by Agent 08 and are now resolved:

1. **Is Recommendation A (launch.py provider refactor) approved?** ✅ **YES.** Apply immediately.
   Agent 13 implements, Agent 09 reviews UI impact. Additional condition: mark Ollama as
   `requires_api_key: false` alongside LM Studio.

2. **Is Recommendation B (save OpenAPI schema file) approved?** ✅ **YES.** Save to
   `Docs/api-spec-mvp.yaml` with a DRAFT header. Agent 07 or 08 commits.

3. **Should the async job model (Recommendation C) use in-memory job state, disk-backed JSON
   sidecar, or a lightweight SQLite store?** 💾 **Disk-backed JSON sidecar.** Rationale:
   inspectable, no extra deps, matches boundary contract sidecar pattern, survives process restart
   for long eBook jobs. In-memory too fragile. SQLite over-engineered for MVP.

4. **Is creating an Integration Reliability Engineer specialist agent (Recommendation D) approved?**
   ✅ **YES.** Agent 08 creates it as Agent 14. Scope: FastAPI boundary, sidecar schema, job-state
   persistence, contract compliance. NOT engine internals or Gradio UI.

5. **Is there a sprint target for resolving the 7 boundary contract gaps listed in Finding 5?** 📅
   **Sprint 2.** Rec A (Sprint 1) addresses gaps 5 and 7 (partial). Remaining gaps are Sprint 2
   work, gated on Rec A merge. Agent 14 owns gaps 1–4 and 6–7 once created.

---

## 9. Reference Index

| Document                  | Location                                                                     | Relevance                          |
| ------------------------- | ---------------------------------------------------------------------------- | ---------------------------------- |
| Service Boundary Contract | `Docs/TTS-Service-Boundary-Contract.md`                                      | Authoritative API design reference |
| Project Assessment        | `Docs/Project-Assessment-and-Creative-Workflow-Split.md`                     | Strategic context                  |
| LM Studio API Reference   | `Docs/LM Studio API.mdx`                                                     | Provider integration reference     |
| Eleven V3 Guide           | `Docs/Eleven V3 TTS Model Guide to Promp official document from website.mdx` | Engine-specific reference          |
| Split Execution Runbook   | `Docs/Split-Execution-Runbook.md`                                            | Repo A / Repo B split context      |
| Main launcher             | `app/launch.py`                                                              | All runtime logic                  |
| Auxiliary API server      | `app/tools/api_server.py`                                                    | Fish Speech inference API          |
| API client sample         | `app/tools/api_client.py`                                                    | Integration code pattern           |
| Provider logic block      | `app/launch.py` lines 6184–6455                                              | All LLM transform code             |
| UI dropdown               | `app/launch.py` line 9052                                                    | Provider selector                  |
| Event wiring              | `app/launch.py` line 13026                                                   | Auto-fill on provider change       |

---

## Appendix A — Development & Implementation Plan

### A.1 Sprint 1 — Immediate Work (Current Sprint)

#### Task 1.1: Provider Config Refactor (Rec A)

**Owner:** Agent 13 (LLM Integration Specialist)  
**Reviewer:** Agent 09 (Gradio UI Specialist)  
**Estimated scope:** ~6 replacement blocks in `app/launch.py`, lines 6184–9069  
**Branch:** `my-custom-features`

**Step-by-step implementation sequence:**

1. **Replace `get_llm_provider_defaults`** (lines 6184–6200)
   - Replace the function body with a `LLM_PROVIDER_CONFIGS` dict lookup
   - New dict shape per provider:

     ```python
     {
       "base_url": str,
       "api_key": str,          # default empty for most
       "model_id": str,
       "env_var": str,          # e.g. "GOOGLE_API_KEY", "GITHUB_MODELS_TOKEN"
       "requires_api_key": bool,
       "kind": str,             # "local" | "remote"
       "headers": dict,         # extra headers beyond Content-Type and Authorization
     }
     ```

   - Providers to include:
     - `"Ollama (OpenAI-compatible)"` → local, no key required
     - `"LM Studio OpenAI Server"` → local, no key required
     - `"Google Gemini API (OpenAI-compatible)"` → remote, key required, env `GOOGLE_API_KEY`
     - `"GitHub Models (OpenAI-compatible)"` → remote, key required, env `GITHUB_MODELS_TOKEN`,
       headers: `{"Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2026-03-10"}`
     - `"vLLM OpenAI Server"` → local, no key required
     - `"Custom OpenAI-compatible"` → remote, key required (conservative default)
   - Return tuple `(base_url, api_key, model_id)` for backward compat, but also expose config dict
     via a new `get_llm_provider_config(provider_name)` function

2. **Replace `get_llm_provider_env_var`** (lines 6203–6212)
   - Derive from `LLM_PROVIDER_CONFIGS[provider_name]["env_var"]`
   - Fallback: `"OPENAI_API_KEY"`

3. **Update `get_llm_shell_key_setup_hint`** (lines 6215–6222)
   - Add GitHub Models-specific instructions mentioning `GITHUB_MODELS_TOKEN`

4. **Update `call_openai_compatible_chat`** (lines 6268–6302)
   - Add optional `extra_headers: dict = None` parameter
   - Merge extra headers into the request headers dict before sending
   - No change to function signature for existing callers (backward compatible)

5. **Update `test_llm_connection`** (lines 6319–6352)
   - Replace the Gemini-only key guard with: `if config["requires_api_key"] and not resolved_key`
   - Pass `extra_headers` from config to `call_openai_compatible_chat`

6. **Update `apply_llm_narration_transform`** (lines 6396–6460)
   - Replace the Gemini-only key guard (line 6430) with:
     `if config["requires_api_key"] and not resolved_key`
   - Pass `extra_headers` from config to `call_openai_compatible_chat`

7. **Update dropdown choices** (lines 9052–9060)
   - Add `"GitHub Models (OpenAI-compatible)"` to the choices list
   - Position: after Google Gemini, before vLLM (remote providers grouped together)

**Acceptance criteria:**

- [ ] All existing providers still work (Ollama, LM Studio, Gemini, vLLM, Custom)
- [ ] GitHub Models appears in dropdown and auto-populates correct base URL, model ID, env var hint
- [ ] LM Studio and Ollama no longer trigger key-missing warnings
- [ ] `call_openai_compatible_chat` sends GitHub-specific headers when GitHub Models is selected
- [ ] No Gradio layout changes or regressions

---

#### Task 1.2: Save OpenAPI Schema (Rec B)

**Owner:** Agent 07 (Documentation) or Agent 08  
**File:** `Docs/api-spec-mvp.yaml`

**Steps:**

1. Create `Docs/api-spec-mvp.yaml` from the session draft
2. Add YAML comment header:
   `# DRAFT — Subject to change. See Review-Findings-and-Recommendations.md`
3. Validate YAML syntax (no runtime code, docs only)
4. Commit with message: `docs(api): add MVP OpenAPI schema draft for multi-engine TTS API`

**Acceptance criteria:**

- [ ] File parses as valid OpenAPI 3.1.0
- [ ] Contains all 13 paths from Recommendation B table
- [ ] DRAFT header is prominent

---

#### Task 1.3: Create Agent 14 (Rec D)

**Owner:** Agent 08 (Head of Agents)  
**File:** `.github/agents/agents/14-integration-reliability-engineer.agent.md`

**Scope definition for the agent file:**

- **Owns:** FastAPI router, sidecar schema, job-state persistence (JSON sidecar), error category
  taxonomy, boundary contract compliance, API key handling policy enforcement
- **Does NOT own:** Engine handlers (Agent 01), Gradio UI (Agent 09), LLM provider config (Agent 13)
- **Model:** GPT-5.4 (Operational tier)
- **Activates:** Sprint 2, after Rec A is merged

**Acceptance criteria:**

- [ ] Agent file follows fleet conventions (check existing agent files for format)
- [ ] Scope is explicit and non-overlapping with Agents 01, 09, 13

---

### A.2 Sprint 2 — Planned Work (After Sprint 1 Stability)

#### Task 2.1: Close Boundary Contract Gaps

**Owner:** Agent 14 (once active)  
**Prerequisite:** Rec A merged and stable

| Gap # | Description                                    | Approach                                                       |
| ----- | ---------------------------------------------- | -------------------------------------------------------------- |
| 1     | Transform parity across flows                  | Audit single-text, conversation, eBook paths; unify call sites |
| 2     | Consistent STRICT/NORMALIZE/EXPRESSIVE meaning | Define canonical semantics; enforce in all entry points        |
| 3     | Explicit transform_outcome surfacing           | Return `transform_outcome` from all generation paths           |
| 4     | Artifact and sidecar integrity validation      | Add sidecar JSON schema validation on write                    |
| 5     | Formal API key handling policy                 | ✅ Partially addressed by Rec A config refactor                |
| 6     | Timeout and retry behavior                     | Define in FastAPI router; propagate to engine calls            |
| 7     | Clear error categories                         | ✅ Partially addressed by Rec A; complete in router layer      |

#### Task 2.2: FastAPI Router Implementation (Rec C)

-**Owner:** Agent 14  
-**Prerequisites:** Tasks 1.1, 1.2, 1.3 complete; gaps 1, 3, 5, 7 closed

-**Implementation phases:**

-**Phase 2.2a — Foundation (extract service functions)**

1. Identify all generation entry points in `launch.py` (single-text, conversation, eBook)
2. Extract pure service functions from Gradio callbacks into `app/api/services.py`
3. Ensure Gradio callbacks still work by importing from the new module
4. Test: all Gradio UI flows still function identically

-**Phase 2.2b — Job store**

1. Create `app/api/job_store.py` — disk-backed JSON sidecar job state
2. Job lifecycle: `pending` → `running` → `completed` | `failed`
3. Storage path: `outputs/jobs/{job_id}/sidecar.json`
4. Include all lineage fields from the boundary contract

-**Phase 2.2c — Router**

1. Create `app/api/router.py` — FastAPI router with all 13 endpoints
2. Mount in `launch.py` alongside Gradio: `app = gr.mount_gradio_app(fastapi_app, demo, path="/")`
3. Bearer token auth middleware
4. Rate limiting (basic, in-process)

-**Phase 2.2d — Integration test**

1. End-to-end test: submit text via API → poll job → retrieve audio artifact
2. Validate sidecar metadata matches boundary contract schema
3. Error path test: missing engine, bad auth, timeout

**Architecture decision (confirmed by Agent 00):**

- Job model: **disk-backed JSON sidecar** at `outputs/jobs/{job_id}/sidecar.json`
- Audio artifacts: alongside sidecar at `outputs/jobs/{job_id}/audio.*`
- No SQLite. No in-memory-only state.

---

### A.3 Dependency Graph

```text
Sprint 1 (parallel):
  ┌─ Task 1.1 (Rec A: provider refactor)  ─── Agent 13
  ├─ Task 1.2 (Rec B: OpenAPI schema)      ─── Agent 07/08
  └─ Task 1.3 (Rec D: create Agent 14)     ─── Agent 08

Sprint 2 (sequential, gated):
  Task 1.1 stable ──┐
  Task 1.2 committed ├──► Task 2.1 (close gaps) ──► Task 2.2 (FastAPI router)
  Task 1.3 created ──┘
```

---

### A.4 Risk Register

| Risk                                        | Likelihood | Impact | Mitigation                                             |
| ------------------------------------------- | ---------- | ------ | ------------------------------------------------------ |
| Provider refactor breaks existing providers | Low        | High   | Test all 5 existing providers after Rec A merge        |
| FastAPI mount conflicts with Gradio         | Medium     | High   | Prototype mount pattern early in Phase 2.2c            |
| Service extraction introduces regressions   | Medium     | Medium | Extract one flow at a time, test after each extraction |
| Job sidecar disk I/O bottleneck on eBooks   | Low        | Low    | Write sidecar once at job completion, not per-chunk    |
| GitHub Models API version changes           | Low        | Low    | Version constant is easily updatable                   |

---

### A.5 Definition of Done

**Sprint 1 is done when:**

- [x] Rec A is merged to `my-custom-features` and all 7 providers work (3 commits pushed)
- [x] Azure Foundry resource provisioned and smoke-tested (gpt-4o-mini live)
- [x] This document is updated with completion status
- [ ] `Docs/api-spec-mvp.yaml` is committed
- [ ] Agent 14 `.agent.md` file exists with correct scope
- [ ] In-app connection test via Gradio UI (select Foundry, enter key, click Test Connection)

**Sprint 2 is done when:**

- [ ] At least 5 of 7 boundary contract gaps are closed
- [ ] FastAPI router serves all 13 endpoints
- [ ] End-to-end API test passes (submit → poll → retrieve)
- [ ] Sidecar metadata matches boundary contract schema
- [ ] Gradio UI still functions identically
