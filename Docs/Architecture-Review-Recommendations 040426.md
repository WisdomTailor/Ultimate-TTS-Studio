# Architecture Review Recommendations — Updated for Phase 3 Planning

This document captures the Phase 2 architecture review findings and the resulting recommendations
for Phase 3 planning. It is intended to guide the next phase of development with a clear roadmap,
priorities, and risk mitigation strategies.

## Summary of Phase 2 Review Findings

1. **Deterministic-first architecture is solid:** The separation of deterministic normalization and
   LLM polish is a strong foundation. It allows for predictable transformations, better debugging,
   and more consistent results across engines. This model is the contract between: conversation
   structuring → per-line polish → engine-aware rendering → TTS synthesis. Every stage reads and
   writes this model.

Engine-aware rendering plugs in here: cues stores semantic intent (SemanticCue.WHISPER,
SemanticCue.PAUSE). The engine-aware renderer (built in WI-3) converts these to the right surface
form for the target engine, or strips them for engines that would read them literally. This is a
refinement of WI-3's strip_unsupported_cues() — instead of stripping after the fact, generate
correctly from the start.

3.1.3 Pronunciation Lexicon and Protected Terms Status: Accepted by Agent 00 for Phase 3.

Two features, one UI surface:

Protected terms: User-defined list of strings that must never be modified by any transform pass
(deterministic or LLM). Examples: brand names, character names, invented words. Implementation:
inject into both the deterministic normalizer (skip matching tokens) and the LLM system prompt
("Never modify these terms: ...").

Pronunciation overrides: User-defined mapping of written form → spoken form. Examples: "GIF" →
"jif", "Loughborough" → "luffbruh". Implementation: apply as a post-transform deterministic
replacement, after LLM but before TTS.

Store both as a JSON file per project. Surface in the UI as an editable table in an "Advanced" or
"Glossary" accordion.

3.2 HIGH Priority — Phase 4 (MCP + Assistant) 3.2.1 MCP Security is Day-One, Not Day-Two Status:
Accepted by Agent 00. MCP auth/scopes required from launch.

The strategic plan's MCP implementation has no authentication, no authorization, no rate limiting,
and no input validation. These are not enhancements — they are launch requirements.

Minimum viable security for MCP server:

Control Implementation Authentication Generate a random token on server start. Write it to a
well-known file (.mcp-token). Require it in every tool call header. Authorization scopes read
(list_voices, get_status) / generate (synthesize, transform) / admin (configure). Default new
connections to read. Rate limiting Max 10 concurrent generation requests. Max 100 requests/minute
per client. Queue overflow → 429. Input validation Text length cap (configurable, default 50K
chars). Engine/voice must be in known set. Output path sandboxed to designated output directory.
Audit log Append-only log: timestamp, client ID, tool name, parameters (text truncated), outcome,
duration. Transport correction: The strategic plan uses stdio transport (sys.stdin.buffer), but the
use case is VS Code connecting to an already-running Gradio server. Use HTTP+SSE (streamable-http)
transport, bound to 127.0.0.1 only. Write connection details to .mcp.json for VS Code discovery.

Threading correction: Do not spawn a separate asyncio.run() in a background thread. Either integrate
MCP handlers into Gradio's event loop, or run as a subprocess with IPC for crash isolation.

3.2.2 Decouple Assistant from Creative LLM Provider Status: Accepted by Agent 00.

The assistant must remain functional when the user's creative LLM provider is:

Misconfigured (wrong API key, wrong URL) Down (network failure, service outage) Rate-limited or over
budget Not yet configured (first-run experience) Implementation approach:

Tier 1 — Zero-LLM diagnostics (always available): Status bar showing connection health, active
engine, last error. "Test Connection" button next to provider dropdown. "Show Loaded Models" in
engine tab. Canned FAQ responses for the 30 most common questions (pattern-matched, no LLM call).

Tier 2 — Lightweight LLM (independent): Assistant has its own provider config, defaulting to: local
Ollama with a small model if available → bundled FAQ index if not. Never shares the creative
provider path unless user explicitly opts in AND that provider passes a health check.

Tier 3 — Full conversational help (best-effort): Uses the creative provider when healthy and
opted-in. Falls back to Tier 2 → Tier 1 automatically.

Do not implement Option A (sidebar) from the strategic plan. Gradio does not natively support
persistent sidebars alongside tabbed content without fragile custom CSS. Instead:

Status bar (gr.Row at top): always visible, zero LLM dependency. Assistant tab: full-width
conversational help, diagnostics, preview. Standard Gradio tab. 3.2.3 MCP Tool Granularity —
Decompose the Pipeline The strategic plan's generate_tts tool bundles transform + engine selection +
synthesis + output formatting into one call. This prevents agents from composing steps
independently.

Recommended tool surface:

Tool Input Output transform_text raw text, mode, style, locale polished text + provenance
list_engines (none) available engines + status + capabilities list_voices engine voices with
metadata synthesize text, engine, voice, params audio file path + duration get_status (none) health
of all subsystems structure_conversation raw text schema-first JSON (see §3.1.1) Agents compose:
transform_text → synthesize. Or structure_conversation → per-line transform_text → per-line
synthesize. The monolithic generate_tts can exist as a convenience wrapper that calls the pipeline
tools internally.

3.3 MEDIUM Priority — Phase 3–4 3.3.1 Evaluation Harness Expansion WI-6 shipped a golden-case pytest
harness for normalization and cue stripping. Expand to:

Transform consistency tests: Same input × same mode × 3 runs → output similarity score above
threshold. Catches non-determinism regression. Provider parity tests: Same input × same mode × 3
providers → output semantic similarity above threshold. Catches prompt-sensitivity across models.
Speaker attribution benchmarks: Golden conversation scripts with known speakers. Measure
precision/recall of the AI attribution pass (Phase 3). Audio regression checks: Duration variance,
silence ratio, and clip detection on synthesis output for a stable test set. Catches engine
regressions. Run the deterministic tests (normalization, cue stripping) in CI. Run the LLM-dependent
tests as a scheduled nightly job or manual gate.

3.3.2 Engine Capability Matrix — Extend Beyond Cue Stripping WI-3 built ENGINE_EXPRESSIVENESS for
cue handling. Extend the matrix to cover:

Capability Type Used By supports_ssml bool Transform output rendering supports_emotion_tags bool
Vivid mode cue rendering supports_speed_control bool Pacing adaptation supports_pitch_control bool
Emphasis rendering supports_multi_speaker bool Conversation mode routing supports_streaming bool
Real-time preview max_text_length int Chunking strategy native_sample_rate int Audio pipeline config
This matrix informs not just cue stripping but also: which engines are eligible for conversation
mode, how to chunk long inputs, and what quality-of-service to expect.

3.3.3 Job Orchestration for Long-Running Work Audiobook chapters, eBook conversions, and
multi-speaker scripts can take minutes. The current model is synchronous Gradio callbacks, which
means: no progress tracking, no cancellation, no retry, no resume, no cached intermediates.

Minimum viable job system:

Job queue: In-memory (or SQLite-backed for persistence). Each job has: ID, status
(queued/running/done/failed/cancelled), progress percentage, created/started/completed timestamps.
Cancellation: User can cancel a running job. Synthesis stops at the next chunk boundary. Partial
output is preserved. Progress: Gradio polling component shows: "Processing chunk 3/12 — Alice line
7." Cached intermediates: Completed chunks are saved. Resume after failure picks up from the last
completed chunk, not from scratch. This is infrastructure, not user-facing feature. Build it before
scaling conversation mode or batch processing.

3.4 DEFERRED — Confirmed Deferrals from Agent 00 These were reviewed, accepted as directionally
correct, and explicitly deferred:

Item Reason for Deferral Revisit When "Speech Prep" rename / broader IA No user benefit until
conversation structuring ships Phase 3 ships and we assess naming confusion OS keyring for API keys
Desktop single-user app; env vars are the recommended secure path Multi-user deployment or
enterprise request Sentence-level diff with per-line accept/reject Over-scoped for Gradio;
side-by-side with Accept/Reject shipped in WI-5 Frontend framework migration Formal ADR documents
Team size doesn't justify overhead; decisions captured in this doc and guides Team grows beyond 2–3
active contributors Consuming external MCPs App's own LLM provider covers current needs; adds
deployment complexity Specific user demand or capability gap 4. Revised Roadmap (Post-Phase 2) Phase
Focus Key Deliverables 1 UX Polish ✅ Complete 2 Transform Quality + Foundations ✅ Complete (6 work
items shipped) 3 Conversation Enhancement Schema-first JSON intermediate, versioned NarrationScript
model, pronunciation lexicon + protected terms, per-line polish, narrator support, evaluation
expansion (speaker attribution benchmarks) 4 Assistant + Automation Decoupled assistant (status
bar + tab, not sidebar), MCP server with auth/scopes/rate-limits/audit from day one, HTTP+SSE
transport, decomposed tool surface, job orchestration 5 Platform Vision Character bibles, casting
presets, project-level state, series-wide style guides, DAW export, subtitle alignment, CI/CD
content pipeline integration 5. Platform-Level Assessment (Updated) What the app is today
(post-Phase 2) A multi-engine TTS production workbench with a two-stage text preparation pipeline
(deterministic normalization → LLM polish → engine-aware rendering), 14 TTS engines, outcome-based
presets, non-destructive preview, and a golden-case evaluation harness. It is meaningfully more
reliable and architecturally sound than it was before Phase 2.

What it is becoming A speech production pipeline where AI is one component, not the center. The
deterministic- first architecture, engine capability matrix, and evaluation harness are the
foundation for this. Conversation mode (Phase 3) and automation (Phase 4) extend the pipeline to
multi- speaker and programmatic workflows.

Top risks to monitor Monolith fragility. launch.py is ~15K lines. Every work item touches it.
Extract the narration transform pipeline, engine registry, and conversation logic into separate
modules when Phase 3 starts — not as refactoring for its own sake, but because concurrent
development on a single file creates serial bottlenecks and merge conflicts.

LLM consistency across providers. The redesigned prompts (WI-2) are better, but different models
still interpret them differently. The evaluation harness (WI-6) needs the provider-parity tests
(§3.3.1) before conversation mode ships, because speaker attribution is even more sensitive to model
variation than text polishing.

Gradio UI ceiling. Side-by-side preview (WI-5) and presets (WI-4) are at the limit of what Gradio
handles cleanly. Conversation mode's multi-speaker assignment UI, character management, and job
progress will push further. Evaluate Gradio custom components or a frontend migration gate before
Phase 5.

Scope creep from "platform vision." Character bibles, DAW export, subtitle alignment, and CI/CD
pipelines are exciting but each is a major feature. Gate each on demonstrated user demand, not
architectural completeness. The pipeline framing should guide design decisions; it should not become
a feature mandate.

1. Immediate Action Items Before Phase 3 work begins:

Smoke test Phase 2 end-to-end. Launch via Pinokio. Exercise: Minimal/Polish/Vivid transforms, preset
switching, preview Accept/Reject, provenance banner accuracy, cue stripping for at least 3 engines
(one high-expressiveness, one low, one medium). Commit or gitignore untracked files.
APPENDIX_DRAFT.md and Docs/Review - feedback-010426.txt are uncommitted in the parent repo. Run the
evaluation harness. pytest tests/ on the golden cases. Confirm all pass against at least one local
provider (Ollama or LM Studio). Extract narration transform module. Before Phase 3 adds conversation
logic to launch.py, extract the transform pipeline (normalization, LLM call, cue stripping, preview
logic) into app/narration_transform.py. This is a risk-reduction refactor, not a feature. This
document supersedes the initial review findings in Docs/Review - feedback-010426.txt for planning
purposes. That file remains as historical record of the pre-Phase 2 analysis.
