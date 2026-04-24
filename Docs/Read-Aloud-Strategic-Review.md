# Read Aloud Replacement — Strategic Review

**Date:** 2026-04-24
**Reviewer:** Agent 00 (Chief Project Manager, Claude Opus 4.6)
**Proposal under review:** [`Docs/TTS Studio — System‑Wide Read Aloud Replacement.md`](./TTS%20Studio%20—%20System‑Wide%20Read%20Aloud%20Replacement.md)
**Verdict:** ✅ Feasible, strategically aligned, **Phase 5 candidate — GATED**
**Status:** 🧊 Shelved pending Phase 4b completion and user-demand validation
**Audience:** Future agents (Agent 00 successors, Agent 11 architecture, Agent 13 integrations)
picking this up when Phase 5 opens.

---

## 1. Purpose of This Document

The handover brief at
`Docs/TTS Studio — System‑Wide Read Aloud Replacement.md` proposes replacing Microsoft Edge's
Read Aloud with a system-wide, privacy-preserving narration engine powered by Ultimate TTS Studio.

This document:

1. Records the strategic decision to **accept the concept but defer implementation**.
2. Corrects the scope, which underestimates what already exists and omits critical failure modes.
3. Provides a **revised, phased implementation plan** ready to pick up when Phase 5 opens.
4. Captures the research and reasoning so no context is lost between now and implementation.

**If you are an agent picking this up in the future: read this document in full before touching
the original handover brief. The original is preserved for traceability, but it is incomplete.**

---

## 2. Decision Summary

| Question | Answer |
|---|---|
| Feasible? | ✅ Yes. |
| Strategically aligned? | ✅ Yes — fits "local, privacy-preserving, multi-engine" project DNA. |
| Best option vs alternatives? | ✅ TTS is the only approach that meets the "custom voices + local" requirement. |
| Ready to start? | ❌ No. Blocked by Phase 5 gate (Phase 4b not shipped; demand not validated). |
| Accept concept? | ✅ Yes. |
| Accept scope as written? | ❌ No. See §5 for corrections. |
| Implementation effort (revised)? | **2–3 weeks** across 4 work items, not a multi-month project. |

---

## 3. What the Original Proposal Gets Right

1. **Problem framing is accurate.** Edge Read Aloud cannot use local or custom voices — this is
   a real user gap, especially for accessibility and privacy-sensitive workflows.
2. **Privacy-first / local-first stance** is correct and consistent with the project's DNA.
3. **Modularity mandate** (separate listener, UI, engine layers) is correct.
4. **Success criteria are measurable** — hotkey → speak, offline, low latency.
5. **Future-extensions list** (continuous reading, dialogue mode) aligns naturally with the
   existing `NarrationScript` model and Conversation Mode features.

---

## 4. What the Original Proposal Misses

### 4.1 The server already exists (mostly)

The brief proposes building a `/speak` endpoint from scratch. In reality, `app/mcp_sidecar.py`
(shipped in Phase 4a) already exposes almost everything needed:

| Proposal asks for                  | What already exists in Phase 4a                                    |
|------------------------------------|--------------------------------------------------------------------|
| `POST /speak` endpoint             | `synthesize` + `submit_synthesis_job` MCP tools (streamable-http)  |
| Voice / preset parameters          | `list_voices`, `list_engines`, `get_engine_info`                   |
| Queueing and cancellation          | `app/job_manager.py` — `submit` / `get_status` / `cancel`          |
| Bearer authentication              | `app/mcp_security.py` — token-based, with per-tool rate limits     |
| Local HTTP binding to `127.0.0.1`  | Already configured in `mcp_sidecar.py`                             |
| Audit logging                      | Already in place via `mcp_security.py`                             |

**Implication:** This is a *client + UX* project, not a *server* project. The server work is one
additional FastAPI route (`POST /speak`) added to the existing sidecar, wrapping
`tts_service.generate_tts` with fire-and-forget playback semantics. ~50 lines of Python.

### 4.2 Latency is the #1 reliability risk (unaddressed in original)

Edge Read Aloud starts speaking in **<200 ms**. The premium engines currently wired into TTS
Studio have very different performance:

| Engine           | Cold start | Warm synth (short sentence) |
|------------------|-----------:|-----------------------------:|
| Chatterbox Turbo | 3–8 s      | 0.8–2 s                      |
| VibeVoice        | 10–20 s    | 2–5 s                        |
| Higgs Audio      | 15–30 s    | 3–8 s                        |
| F5-TTS           | 8–15 s     | 1–3 s                        |
| IndexTTS2        | 5–12 s     | 1–4 s                        |
| Kokoro (absent)  | 1–2 s      | 0.1–0.3 s                    |
| Piper (absent)   | <1 s       | 0.05–0.15 s                  |

Numbers are directional, based on typical RTX 3060/4060 hardware. Cold start includes model load
and first-inference warmup.

**Without mitigation, users will press the hotkey, wait 10 seconds, and stop using the feature
within a week.** This is the single most important issue the original proposal does not address.

**Required mitigations (non-negotiable for MVP):**

1. **Add a fast-path engine.** Bundle Piper or Kokoro alongside the premium engines. Read Aloud
   defaults to the fast-path engine; premium engines remain available for long-form / quality
   work.
2. **Warm-start on launcher startup.** Preload the configured Read Aloud engine + default voice
   so the first hotkey press is warm.
3. **Stream audio playback.** Start playing the first sentence while the rest is still
   synthesizing. The `job_manager` will need to support partial-result streaming; today it's
   blocking.
4. **Client-side pre-normalization.** Run `deterministic_normalize` in the client before shipping
   to the server — cuts round-trip size and LLM pre-work.

### 4.3 Windows global hotkey + clipboard capture is non-trivial

The brief treats hotkey capture as a one-liner. On Windows it is not. Known pitfalls:

- `keyboard` (PyPI) requires admin privileges for global hooks on Windows.
- `pynput` works without admin but conflicts with some DRM/game windows and elevated apps.
- `RegisterHotKey` Win32 API (via `pywin32`) is the most reliable but requires a message loop.
- **Clipboard capture after hotkey is a race condition:** simulate `Ctrl+C` → poll clipboard
  with 50–150 ms delay → read → restore prior clipboard. Every implementer gets this wrong first
  time.
- UAC-elevated windows (Task Manager, some installers) will not hand over focus to an
  unelevated hook.
- DirectInput games swallow global hooks entirely.

**Required:** Ship a throwaway prototype (1 day, Agent 10) that tests the hotkey + clipboard
pipeline against the target app matrix before the architecture is finalized.

### 4.4 Tray app is a v2 concern, not MVP

The brief treats the tray app as core scope. Reasons to defer:

- Cross-platform tray (`pystray`) has quirks across Windows/macOS/Linux.
- Must coexist with the Gradio UI (two UIs controlling one engine — concurrency hazard).
- Shared settings source of truth required.
- Must survive Pinokio restarts without orphan processes.

**MVP ships with hotkey + background process only.** Tray is added in WI-RA3 once UX is
validated.

### 4.5 Cancellation semantics are undefined

The brief doesn't specify what happens when the user presses the hotkey while current speech is
playing. Three options:

| Behavior | UX |
|---|---|
| Stop current + start new | Most natural for Read Aloud; matches Edge. |
| Queue | Matches `job_manager` model but surprises users who expect Edge-like behavior. |
| Ignore | Feels broken. |

**Decision:** Default is **stop-current, start-new**. A modifier key (Ctrl+hotkey) queues.

### 4.6 No accessibility story

"Read Aloud" is heavily used by users with visual or reading disabilities. Missing from the
original brief:

- Speech rate control hotkey (increase / decrease)
- Pause / resume (not just stop)
- Skip-back-sentence / skip-forward-sentence
- Punctuation verbosity toggle (read "period" / "comma" or skip)

**These are MVP, not future extensions.** Without them, the feature is a demo, not a Read Aloud
replacement.

---

## 5. Alternative Approaches Considered

| Option | Custom voices? | Local? | Latency | Reliability | Verdict |
|---|:---:|:---:|---:|:---:|---|
| Windows SAPI5 (shell to `System.Speech`) | ❌ | ✅ | <200 ms | High | Fails custom-voice goal |
| Windows Narrator API | ❌ | ✅ | <200 ms | High | Fails custom-voice goal |
| Azure Speech / ElevenLabs cloud | ✅ | ❌ | 300–800 ms | High | Violates privacy goal |
| **TTS Studio via hotkey client** | ✅ | ✅ | 1–30 s* | Medium† | **Recommended** |
| Piper / Kokoro bundled as fast-path | ✅ (limited range) | ✅ | <300 ms | High | **Required companion** |

\* With warm-start + streaming
† Medium until §4.2 mitigations are in place; High once they are.

**Strong recommendation:** The recommendation is **not** either/or. Ship TTS Studio as the
Read Aloud engine **with a fast-path engine bundled**. Users who care about voice quality switch
to premium engines; users who just want Read Aloud get sub-second response with local voices
that are still vastly better than SAPI5.

---

## 6. Revised Implementation Plan

**All work below is gated on Phase 5 entry criteria (AGENTS.md §"Phase 5 Entry Criteria"):**

1. Phase 4a AND Phase 4b shipped (not beta).
2. ≥3 documented user requests OR ≥2 beta testers report difficulty without the feature.
3. Prioritization workshop held.
4. Each WI scoped to ≤2 weeks.

### Phase 5 WI-RA1 — Read Aloud MVP (5–7 days)

**Owner candidates:** Agent 13 (LLM/Integration specialist — HTTP client + API work),
Agent 01 (TTS engine engineer — fast-path engine integration).

**Deliverables:**

- `POST /speak` route added to `app/mcp_sidecar.py`, wrapping `tts_service.generate_tts`
  with fire-and-forget playback and basic cancellation.
- `POST /speak/stop`, `POST /speak/pause`, `POST /speak/resume` routes.
- A new handler file `app/kokoro_handler.py` **or** `app/piper_handler.py` (fast-path engine),
  registered in `engine_registry.py` with appropriate capabilities. Engine choice decided during
  WI-RA1 kickoff based on licensing, voice quality, and Pinokio install ergonomics.
- A background Python client (`app/read_aloud_client.py`) that:
  - Registers a global hotkey (Win32 `RegisterHotKey` preferred).
  - Captures the active clipboard selection via the `Ctrl+C` + poll + restore pattern.
  - POSTs to `127.0.0.1:<sidecar-port>/speak` with bearer token.
  - Plays returned audio via a local playback backend (`sounddevice` or `pygame.mixer`).
- Warm-start logic: on launcher startup, preload the configured Read Aloud engine + voice.
- Settings keys under `app_state/settings.json`:
  - `read_aloud.enabled`
  - `read_aloud.hotkey` (default `Ctrl+Shift+Space`)
  - `read_aloud.engine` (default: fast-path engine)
  - `read_aloud.voice`
  - `read_aloud.rate`
  - `read_aloud.warm_on_start`

**NOT in MVP:** tray app, continuous reading, dialogue mode, cross-app testing matrix polish.

### Phase 5 WI-RA2 — UX Hardening (3–5 days)

**Owner candidates:** Agent 09 (Gradio UI — settings persistence), Agent 03 (QA — test matrix).

**Deliverables:**

- Accessibility hotkeys: rate ± 10%, pause/resume, skip-back-sentence, skip-forward-sentence.
- Cancellation semantics implemented (stop-current-start-new default; Ctrl+hotkey queues).
- Clipboard-restoration robustness: retry + timeout + fallback to "no selection → read selected
  text in active window if accessibility API available."
- Cross-app test matrix executed: Edge, Chrome, Firefox, PDF reader, Word, Notepad, VS Code,
  PowerShell, locked-screen apps, elevated Task Manager.
- Settings panel in Gradio UI (under new "System Integration" accordion in Settings tab) that
  reads/writes the `read_aloud.*` settings keys. Single source of truth with the client.
- Audit log entries for each `/speak` call.

### Phase 5 WI-RA3 — Tray + Polish (3–5 days)

**Owner candidates:** Agent 09 (Gradio UI — UX polish), Agent 06 (DevOps — auto-start
integration).

**Deliverables:**

- Optional `pystray`-based tray app (toggle in settings: on/off, default off in v1).
- Voice / preset switcher from tray context menu.
- Auto-start-with-Pinokio option.
- Tray reflects current state: idle / preloading / speaking / paused / error.
- Orphan-process guard on Pinokio restart.

### Phase 5 WI-RA4 — Advanced Modes (optional, scoped separately)

**Gated on WI-RA1..3 shipping.**

- Continuous reading mode — automatically read the next paragraph after current finishes.
- Dialogue mode — reuses the Conversation Mode `NarrationScript` pipeline; speaker detection
  per-paragraph, voice switching per speaker.
- Script Doctor integration — pre-process text through the narration transform pipeline
  (Minimal / Polish / Vivid) before synthesis.

**Total realistic effort (WI-RA1..3):** 11–17 days of focused work. WI-RA4 is open-ended.

---

## 7. Risk Register

| # | Risk | Severity | Mitigation |
|---|---|:---:|---|
| R1 | Latency too high → users abandon feature | 🔴 High | Bundle fast-path engine (WI-RA1). Warm-start. Streaming playback. |
| R2 | Windows hotkey conflicts with target apps | 🟡 Med | 1-day prototype (Agent 10) before WI-RA1 architecture lock. Configurable hotkey. |
| R3 | Clipboard race condition breaks under load | 🟡 Med | Retry + timeout + accessibility-API fallback in WI-RA2. |
| R4 | Tray app + main UI concurrency hazard | 🟡 Med | Single settings source of truth. Defer tray to WI-RA3. |
| R5 | Two-repo sync (SUP3R vs pinokiofactory) drift | 🟢 Low | Existing dual-repo hygiene rules in AGENTS.md apply. |
| R6 | Fast-path engine licensing | 🟡 Med | Verify Piper / Kokoro licenses accept redistribution via Pinokio install flow. Decide during WI-RA1 kickoff. |
| R7 | Cold-start UX on first hotkey press after launcher start | 🟡 Med | Warm-start on launcher startup — specified in WI-RA1. |
| R8 | Accessibility users block on missing rate/pause controls | 🟡 Med | Specified as MVP scope in WI-RA2. Do not skip. |
| R9 | GPU contention between Read Aloud and main UI generation | 🟡 Med | Fast-path engine should be CPU-friendly (Piper is; Kokoro smaller footprint). Document trade-off in WI-RA1. |

---

## 8. Success Criteria (Revised)

The feature is considered successful when:

1. User highlights text in any of the target matrix apps, presses the configured hotkey, and
   hears it spoken within **≤1 second** (fast-path engine, warm) or **≤3 seconds** (premium
   engine, warm).
2. Cold start after launcher startup is **≤5 seconds** for first hotkey press.
3. All accessibility hotkeys (rate, pause, skip) work reliably.
4. Stop-current-start-new cancellation works without artifacts.
5. No orphan processes after Pinokio restart.
6. Feature works offline.
7. Bearer-authenticated traffic only (no unauthenticated `/speak` calls).
8. Settings persist across launcher restarts.
9. Main Gradio UI and Read Aloud share a single voice/preset/settings source of truth.

---

## 9. Open Questions for Future Agents

When picking this up, confirm with Agent 00:

1. **Fast-path engine choice:** Piper vs Kokoro vs another. Depends on license, voice range,
   Pinokio install complexity, and CPU/GPU footprint at the time.
2. **Hotkey default:** `Ctrl+Shift+Space` is a placeholder. Validate against common
   accessibility tools and Windows shortcuts.
3. **Playback backend:** `sounddevice` (portaudio) vs `pygame.mixer` vs direct Windows
   `winsound`. Pick the one with the lowest first-audio latency at the time.
4. **Tray library:** `pystray` is the default. If a better cross-platform option has emerged
   by Phase 5, re-evaluate.
5. **Streaming synthesis:** Requires `job_manager` enhancements. Scope this in WI-RA1 kickoff.
6. **Dual-repo sync policy:** Confirm SUP3R Edition parity requirements before shipping.
7. **User demand evidence:** Before starting WI-RA1, collect the ≥3 documented user requests OR
   ≥2 beta-tester reports required by AGENTS.md Phase 5 gate.

---

## 10. References

- Original proposal: `Docs/TTS Studio — System‑Wide Read Aloud Replacement.md`
- Phase 5 gate criteria: `AGENTS.md` §"Phase 5 Entry Criteria"
- Existing MCP infrastructure: `app/mcp_sidecar.py`, `app/mcp_security.py`,
  `app/job_manager.py`, `app/tts_service.py`
- Engine registry: `app/engine_registry.py`
- Roadmap: `Docs/REVISED_ROADMAP_v2.md` §"Phase 5 — Platform Vision (GATED)"
- NarrationScript (future dialogue mode): `app/narration_script.py`
- Conversation pipeline (future dialogue mode): `app/conversation_logic.py`

---

## 11. Changelog

| Date | Change | Author |
|---|---|---|
| 2026-04-24 | Initial strategic review. Concept accepted, implementation deferred to Phase 5. | Agent 00 |
