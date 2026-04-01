# launch.py Index

This document is the required starting point for any agent or developer working on `app/launch.py`.

`app/launch.py` is a 13,458-line monolith that combines runtime setup, engine orchestration,
conversation generation, persistence helpers, LLM narration tooling, the full Gradio component tree,
and all event wiring. Do not start editing by search alone. Read this index first, decide which
layer you are changing, and then jump to the relevant symbols.

## How To Use This Index

1. Identify the layer you are changing: backend logic, storage/state, UI layout, or event wiring.
2. Jump to the section landmark in the structural map.
3. Follow the related symbols listed for that area.
4. Before editing any UI control, trace the full path: component declaration -> handler/helper ->
   `.click()` / `.change()` binding.
5. If the change touches generation behavior, inspect both `generate_unified_tts` and
   `generate_unified_tts_wrapped` before making edits.

## Structural Map

| Area                                          |                                                                                      Lines | Main symbols                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Use this section for                                                      | Also inspect before editing                                                                          |
| --------------------------------------------- | -----------------------------------------------------------------------------------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Bootstrap and warning suppression             |                                                                                      1-103 | `suppress_specific_warnings`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | import behavior, stderr filtering, startup environment flags              | optional dependency imports and placeholders                                                         |
| Optional imports and safe fallbacks           |                                                                                    104-352 | `*_AVAILABLE` flags, `_tts_unavailable`, `_init_unavailable`                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | handler availability, placeholder behavior, safe imports                  | per-engine init/unload wrappers and UI availability branches                                         |
| Per-engine wrapper layer                      |                                                                                    353-787 | `init_voxcpm_model`, `init_higgs_audio`, `init_kitten_tts_model`, `init_vibevoice_model`, `init_indextts2_model`, `init_qwen_tts_model`                                                                                                                                                                                                                                                                                                                                                                                             | engine-specific wrapper loading, model gateway behavior                   | `MODEL_STATUS` and model-manager button handlers                                                     |
| Conversation subsystem                        |                                                                                   788-2292 | `parse_conversation_script` at 826, `generate_conversation_audio_simple` at 905, `generate_conversation_audio_kokoro` at 1393, `generate_conversation_audio_kitten` at 1688, `generate_conversation_audio_indextts2` at 1877, `format_conversation_info` at 2259                                                                                                                                                                                                                                                                    | script parsing, multi-speaker generation, speaker summaries               | conversation tab UI, analyze/generate button bindings                                                |
| App state and output storage                  |                                                                                  2293-2836 | `PRESETS_FILE` at 2433, `load_app_state_settings` at 2464, `resolve_output_storage_settings` at 2488, `save_output_storage_settings` at 2620                                                                                                                                                                                                                                                                                                                                                                                        | settings persistence, output paths, app-state hygiene                     | autosave helpers and workspace controls UI                                                           |
| Model lifecycle and status registry           |                                                                                  2847-3520 | `MODEL_STATUS` at 2847, `get_model_status` at 3418                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | global model state, load/unload status reporting                          | model manager UI and `handle_load_*` closures                                                        |
| Shared voices, utilities, and DSP helpers     |                                                                                  3521-3809 | Kokoro voice utilities, audio effect helpers                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | voice list behavior, preprocessing, effect support used by many engines   | engine generation implementations and Audio Effects Studio                                           |
| Engine generation implementations             |                                                                                  3810-6208 | `generate_chatterbox_tts` at 3810, `generate_chatterbox_multilingual_tts` at 3905, `generate_fish_speech_tts` at 4219, `generate_kokoro_tts` at 4640, `generate_indextts_tts` at 4776, `generate_indextts2_unified_tts` at 4928, `generate_f5_tts` at 5040, `get_voice_preset_choices` at 5210, `on_select_preset` at 5251, `on_save_preset` at 5272, `on_delete_preset` at 5307, `convert_ebook_to_audiobook` at 5390, `generate_voxcpm_unified_tts` at 5971                                                                       | engine behavior, preset CRUD, eBook generation, engine-specific bug fixes | unified dispatcher, autosave wrapper, UI controls for the engine                                     |
| LLM narration transform and provider plumbing | 6165-6946 (line range may have shifted after Phase 2.5 extraction — verify before editing) | `DEFAULT_LLM_NARRATION_SYSTEM_PROMPT` at 6165, `LLM_PROVIDER_CONFIGS` at 6347, `fetch_provider_models` at 6513, `on_llm_provider_change` at 6644, `refresh_llm_models` at 6668, `call_openai_compatible_chat` at 6713, `test_llm_connection` at 6776, `apply_llm_narration_transform` at 6859. **Note (Phase 2.5):** Pure-logic code (constants, normalization, provider helpers, transform functions) has been extracted to `narration_transform.py`. `launch.py` retains the Gradio-facing plumbing and delegates to that module. | provider setup, model discovery, transform logic, connection testing      | `narration_transform.py` for pure logic; narration transform accordion and wrapper argument ordering |
| Unified generation and autosave wrapper       |                                                                                  6947-7845 | `generate_unified_tts` at 6947, `generate_unified_tts_wrapped` at 7621                                                                                                                                                                                                                                                                                                                                                                                                                                                              | top-level generation dispatch, autosave metadata, last-seed behavior      | generate button inputs, engine-specific parameter ordering, autosave persistence helpers             |
| Gradio component tree                         |                                                                                 7846-12679 | `create_gradio_interface` at 7846                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | layout, labels, controls, tab structure, CSS/JS, visual UX                | nested handlers starting at 12680 and related backend functions                                      |
| Nested handlers and event wiring              |                                                                                12680-15107 | `handle_load_*`, `handle_generate_conversation_*`, `handle_ebook_*`, `.click()` / `.change()` chains                                                                                                                                                                                                                                                                                                                                                                                                                                | event regressions, control binding changes, handler return-shape fixes    | component declarations above and generation/storage helpers below                                    |
| Main entry point                              |                                                                                  15108-end | `if __name__ == "__main__":`, `demo.launch()`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | startup and launch behavior                                               | import/bootstrap block and `create_gradio_interface`                                                 |

## UI Landmarks Inside `create_gradio_interface`

Use these anchors when the change starts from a visible UI element.

| Landmark                      | Approx. lines | Why it matters                                               |
| ----------------------------- | ------------: | ------------------------------------------------------------ |
| Model Manager accordion       |     9072-9199 | Load/unload controls and model-specific management panels    |
| Text to Synthesize tab        |     9490-9686 | Main single-speaker input path                               |
| Narration Transform accordion |     9510-9655 | Provider settings, connection test, transform apply flow     |
| Conversation Mode tab         |    9687-10399 | Script analysis, speaker setup, conversation generation      |
| eBook to Audiobook tab        |   10400-10626 | File analysis, chapter selection, batch audiobook generation |
| VibeVoice tab                 |   10627-11094 | podcast workflow, model management, speaker voice assignment |
| Right rail outputs            |   11095-11191 | generated audio, status, last seed, audiobook results        |
| Workspace Controls accordion  |   11192-11245 | voice presets, autosave, output storage settings             |
| Engine Selection accordion    |   11246-11391 | current engine and audio-format routing                      |
| Engine settings tabs          |   11392-12457 | per-engine control panels                                    |
| Audio Effects Studio          |   12458-12679 | cross-engine DSP controls                                    |

## Common Change Routes

### If you are changing a UI control

1. Find the control in `create_gradio_interface`.
2. Find the related handler in the nested closure section.
3. Find the final `.click()` / `.change()` binding.
4. Verify the handler return shape still matches the outputs list.

### If you are changing narration transform behavior

Pure-logic code lives in `narration_transform.py` (extracted in Phase 2.5). `launch.py` retains
Gradio-facing plumbing only.

Inspect these in order:

1. `narration_transform.py` — constants, normalization helpers, provider logic, prompt assembly
2. `DEFAULT_LLM_NARRATION_SYSTEM_PROMPT` (may now delegate to `narration_transform.py`)
3. `LLM_PROVIDER_CONFIGS`
4. `apply_llm_narration_transform`
5. narration transform UI controls in `create_gradio_interface`
6. `generate_unified_tts_wrapped` input ordering

### If you are changing conversation mode

Inspect these in order:

1. `parse_conversation_script`
2. the appropriate `generate_conversation_audio_*` function
3. `handle_analyze_script`
4. `handle_generate_conversation_advanced`
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
