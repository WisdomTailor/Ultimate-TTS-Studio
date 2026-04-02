# launch.py Index

This document is the required starting point for any agent or developer working on `app/launch.py`.

`app/launch.py` is a 16,103-line monolith that combines runtime setup, engine orchestration,
conversation generation, persistence helpers, LLM narration tooling, the full Gradio component tree,
and all event wiring. Do not start editing by search alone. Read this index first, decide which
layer you are changing, and then jump to the relevant symbols.

**Extracted modules (do not search launch.py for these — they live elsewhere):**

| Module                   | Extracted in | Contains                                                                                 |
| ------------------------ | ------------ | ---------------------------------------------------------------------------------------- |
| `narration_transform.py` | Phase 2.5    | Constants, deterministic normalization, provider helpers, LLM transform, prompt assembly |
| `engine_registry.py`     | Phase 3      | Engine capability matrix, cue stripping, metadata                                        |
| `conversation_logic.py`  | Phase 3      | Script parsing, speaker extraction, AI formatter, per-line transform                     |
| `narration_script.py`    | Phase 3      | NarrationScript Pydantic model, SemanticCue enum                                         |
| `pronunciation.py`       | Phase 3      | Protected term masking, phonetic overrides, lexicon persistence                          |
| `tts_service.py`         | Phase 4a     | Synthesis orchestration, voice listing, output management                                |
| `mcp_sidecar.py`         | Phase 4a     | FastAPI + FastMCP server (all 13 MCP tools)                                              |
| `mcp_security.py`        | Phase 4a     | Bearer-token auth, rate limits, audit logging                                            |
| `job_manager.py`         | Phase 4a     | Disk-backed JSON job state, subprocess workers                                           |

## How To Use This Index

1. Identify the layer you are changing: backend logic, storage/state, UI layout, or event wiring.
2. Jump to the section landmark in the structural map.
3. Follow the related symbols listed for that area.
4. Before editing any UI control, trace the full path: component declaration -> handler/helper ->
   `.click()` / `.change()` binding.
5. If the change touches generation behavior, inspect both `generate_unified_tts` and
   `generate_unified_tts_wrapped` before making edits.

## Structural Map

| Area                                             |       Lines | Main symbols                                                                                                                                                                                                     | Use this section for                                                             | Also inspect before editing                                                                          |
| ------------------------------------------------ | ----------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Bootstrap and warning suppression                |       1–108 | `suppress_specific_warnings`                                                                                                                                                                                     | import behavior, stderr filtering, startup environment flags                     | optional dependency imports and placeholders                                                         |
| Optional imports and safe fallbacks              |     109–457 | `*_AVAILABLE` flags, `_tts_unavailable`, `_init_unavailable`                                                                                                                                                     | handler availability, placeholder behavior, safe imports                         | per-engine init/unload wrappers and UI availability branches                                         |
| VoxCPM model management and conversation audio   |    458–1984 | `init_voxcpm_model` at 458·`generate_conversation_audio_simple` at 631·`generate_conversation_audio_kokoro` at 1119·`generate_conversation_audio_kitten` at 1414·`generate_conversation_audio_indextts2` at 1603 | VoxCPM lifecycle, multi-speaker conversation audio generation (per-engine paths) | `conversation_logic.py` for parsing/formatting; `MODEL_STATUS` and model-manager button handlers     |
| Helper functions                                 |   1985–2098 | Shared utility helpers                                                                                                                                                                                           | miscellaneous shared functions                                                   | callers spread across sections                                                                       |
| Global configuration and directory setup         |   2099–2556 | `APP_STATE_PRESETS_FILE` at 2121·`PRESETS_FILE` at 2128·`load_app_state_settings` at 2159·`resolve_output_storage_settings` at 2183·`save_output_storage_settings` at 2340                                       | settings persistence, output paths, app-state hygiene, directory creation        | autosave helpers and workspace controls UI                                                           |
| Model lifecycle and status registry              |   2557–3240 | `MODEL_STATUS` at 2567·`get_model_status`                                                                                                                                                                        | global model state, load/unload status reporting                                 | model manager UI and `handle_load_*` closures                                                        |
| Kokoro voice definitions                         |   3241–3278 | Kokoro voice constants                                                                                                                                                                                           | voice list constants                                                             | engine generation, conversation voice assignment                                                     |
| Shared utilities and DSP helpers                 |   3279–3528 | Kokoro voice utilities, audio effect helpers                                                                                                                                                                     | voice list behavior, preprocessing, effect support                               | engine generation implementations and Audio Effects Studio                                           |
| Engine generation implementations                |   3529–5088 | `generate_chatterbox_tts` at 3529·`generate_fish_speech_tts` at 3741·`generate_kokoro_tts` at 4155·`generate_indextts2_unified_tts` at 4647·`generate_f5_tts` at 4759·`get_voice_preset_choices` at 4930         | engine behavior, preset CRUD                                                     | unified dispatcher, autosave wrapper, UI controls for the engine                                     |
| eBook to audiobook functions                     |   5089–5884 | `convert_ebook_to_audiobook`                                                                                                                                                                                     | eBook analysis, chapter selection, batch audiobook generation                    | engine selection, preset state, multi-engine path                                                    |
| LLM narration transform (Gradio-facing plumbing) |   5885–6508 | `DEFAULT_LLM_NARRATION_SYSTEM_PROMPT` at 5885·`LLM_PROVIDER_CONFIGS` at 6109·`fetch_provider_models` at 6275·`on_llm_provider_change` at 6406 — **pure logic extracted to `narration_transform.py`**             | provider setup, model discovery, Gradio-side transform wiring                    | `narration_transform.py` for pure logic; narration transform accordion and wrapper argument ordering |
| Unified generation and autosave wrapper          |   6509–7303 | `generate_unified_tts` at 6510·`generate_unified_tts_wrapped` at 7079·`autosave_generation_artifacts` at 6963                                                                                                    | top-level generation dispatch, autosave metadata, last-seed behavior             | generate button inputs, engine-specific parameter ordering, autosave persistence helpers             |
| Gradio component tree                            |  7304–12344 | `create_gradio_interface` at 7305                                                                                                                                                                                | layout, labels, controls, tab structure, CSS/JS, visual UX                       | nested handlers starting at 12345 and related backend functions                                      |
| Nested handlers and event wiring                 | 12345–16022 | `handle_load_*` from 12345·`handle_assistant_*` near 12600·`generate_btn.click(...)` at 13606                                                                                                                    | event regressions, control binding changes, handler return-shape fixes           | component declarations above and generation/storage helpers                                          |
| Main entry point                                 | 16023–16103 | `if __name__ == "__main__":` at 16073·`demo.launch()`                                                                                                                                                            | startup and launch behavior                                                      | import/bootstrap block and `create_gradio_interface`                                                 |

## UI Landmarks Inside `create_gradio_interface`

Use these anchors when the change starts from a visible UI element.

> **Note:** The line ranges below are approximate and have shifted since Phase 3 additions grew
> `create_gradio_interface` significantly. Treat them as search guidance, not exact positions. All
> landmarks are inside `create_gradio_interface` (7305–12344).

| Landmark                      | Approx. lines | Why it matters                                                           |
| ----------------------------- | ------------: | ------------------------------------------------------------------------ |
| Model Manager accordion       |    ~9072–9200 | Load/unload controls and model-specific management panels                |
| Assistant status bar          |    ~9098–9104 | Compact top-row connection indicator above the main workspace            |
| Text to Synthesize tab        |    ~9490–9700 | Main single-speaker input path                                           |
| Narration Transform accordion |    ~9510–9680 | Provider settings, connection test, transform apply flow                 |
| Conversation Mode tab         |   ~9700–10600 | Character roster, script Dataframe, line editor, conversation generation |
| eBook to Audiobook tab        |  ~10600–10900 | File analysis, chapter selection, batch audiobook generation             |
| VibeVoice tab                 |  ~10900–11300 | Podcast workflow, model management, speaker voice assignment             |
| Assistant tab                 |  ~11300–11450 | Chatbot UI, assistant LLM settings, connection test, provider changes    |
| Right rail outputs            |  ~11300–11500 | Generated audio, status, last seed, audiobook results                    |
| Workspace Controls accordion  |  ~11500–11600 | Voice presets, autosave, output storage settings                         |
| Engine Selection accordion    |  ~11600–11750 | Current engine and audio-format routing                                  |
| Engine settings tabs          |  ~11750–12300 | Per-engine control panels                                                |
| Audio Effects Studio          |  ~12300–12344 | Cross-engine DSP controls                                                |

## Common Change Routes

### If you are changing a UI control

1. Find the control in `create_gradio_interface`.
2. Find the related handler in the nested closure section.
3. Find the final `.click()` / `.change()` binding.
4. Verify the handler return shape still matches the outputs list.

Assistant UI follows the same rule: `assistant_status_indicator`, `assistant_chatbot`, and the
assistant LLM settings controls live in the component tree, while `handle_assistant_*` closures and
their `.click()` / `.submit()` / `.change()` bindings live in the nested handler section.

### If you are changing narration transform behavior

Pure-logic code lives in `narration_transform.py` (extracted in Phase 2.5). `launch.py` retains
Gradio-facing plumbing only. `apply_llm_narration_transform`, `call_openai_compatible_chat`, and
`test_llm_connection` are in `narration_transform.py`, not `launch.py`.

Inspect these in order:

1. `narration_transform.py` — constants, normalization helpers, provider logic, prompt assembly,
   transform functions
2. `DEFAULT_LLM_NARRATION_SYSTEM_PROMPT` at launch.py:5885
3. `LLM_PROVIDER_CONFIGS` at launch.py:6109
4. `fetch_provider_models` at launch.py:6275 (delegates to `narration_transform.py`)
5. narration transform UI controls in `create_gradio_interface`
6. `generate_unified_tts_wrapped` input ordering

### If you are changing conversation mode

`parse_conversation_script`, `format_conversation_info`, and `apply_per_line_transform` are in
`conversation_logic.py` (extracted Phase 3). `launch.py` retains the per-engine audio generation
functions and Gradio event wiring.

Inspect these in order:

1. `conversation_logic.py` — parsing, speaker extraction, AI formatter, per-line transform
2. the appropriate `generate_conversation_audio_*` function in launch.py (458–1984)
3. `handle_analyze_script` in nested handlers (12345+)
4. `handle_generate_conversation_advanced` at launch.py:14409
5. `generate_conversation_btn.click(...)`

### If you are changing presets, autosave, or file persistence

Inspect these in order:

1. `load_app_state_settings`
2. `resolve_output_storage_settings`
3. `save_output_storage_settings`
4. `on_select_preset`, `on_save_preset`, `on_delete_preset`
5. `autosave_generation_artifacts`
6. `generate_unified_tts_wrapped`

### If you are changing engine routing

Inspect these in order:

1. per-engine UI tab in `create_gradio_interface`
2. engine-specific `generate_*` implementation
3. `generate_unified_tts`
4. `generate_unified_tts_wrapped`
5. the relevant model-manager and engine-selection handlers

## High-Risk Couplings

These are the easiest places to break unintentionally.

- `generate_unified_tts` parameter order is tightly coupled to the `generate_btn.click(...)` inputs.
- `generate_unified_tts_wrapped` depends on the base signature plus trailing extra args in a fixed
  order for speaker name, preset, autosave flags, and seed state.
- Feature-unavailable branches create dummy Gradio components to preserve event-wiring shape.
  Removing or reordering those placeholders can break output lists.
- `MODEL_STATUS` is used by both backend lifecycle functions and the UI status displays.
- Conversation mode uses different generation paths for standard engines, Kokoro, KittenTTS, and
  IndexTTS2. Do not assume a single shared path.

## Safe-Edit Checklist

- Read this file before reading `app/launch.py` in detail.
- Decide whether the change belongs to backend logic, UI layout, or event wiring.
- For any UI change, trace declaration -> handler -> binding before editing.
- For any engine change, inspect both engine-specific code and `generate_unified_tts`.
- For any persistence change, inspect the app-state helpers and autosave wrapper.
- Keep return arity aligned with Gradio outputs.
- Prefer narrow edits. This file is large enough that unrelated refactors are high-risk.

## When To Stop And Re-scope

Stop and reconsider the change if any of the following becomes true.

- The change requires touching both UI layout and multiple unrelated engine implementations.
- You cannot explain which binding calls the handler you are editing.
- You are changing a return tuple without updating all matching Gradio outputs.
- You are about to reorder arguments in `generate_unified_tts` or `generate_unified_tts_wrapped`
  without checking every call site.

When that happens, split the work into smaller edits and update this index if you learn a better
navigation pattern.
