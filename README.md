# Ultimate TTS Studio Launcher Workspace

This repository is the Pinokio launcher workspace for Ultimate TTS Studio.

- The launcher scripts live in the repository root.
- The application runtime lives in `app/`.
- `install.js` clones the upstream app repository into `app/` when needed.
- `start.js` launches the Gradio web UI from `app/launch.py`.
- The MCP sidecar is optional and runs in its own environment.

If you want to use the app directly without the launcher, see `app/README.md`.

## What This Workspace Provides

Ultimate TTS Studio combines multiple speech engines, narration tooling, conversation workflows,
job orchestration, structured output storage, and an optional MCP sidecar for automation.

Current UI modes in `app/launch.py`:

- Text to Synthesize
- Conversation Mode
- eBook to Audiobook
- VibeVoice
- Assistant
- History
- Jobs

Current engine tabs in the main app:

- ChatterboxTTS
- Chatterbox Multilingual
- Chatterbox Turbo
- Kokoro TTS
- Fish Speech
- IndexTTS
- IndexTTS2
- F5-TTS
- Higgs Audio
- VoxCPM
- KittenTTS
- Qwen TTS

## Recommended Usage

For normal use, stay in Pinokio:

1. Run `Install`.
2. Run `Start`.
3. Open the captured local Gradio URL from the launcher menu.

The launcher starts the main UI with:

```text
python launch.py
```

from `app/` inside the `tts_env` conda environment.

## Main Launcher Flow

### Install

`install.js` provisions the main app environment in `app/tts_env` and installs the runtime
dependencies used by the primary UI. The current install flow includes:

- `pynini`, `portaudio`, `sox`
- `uv pip install -r requirements.txt`
- `WeTextProcessing`
- `onnxruntime-gpu==1.22.0`
- `voxcpm` and `openai-whisper`
- the OpenAudio checkpoint download into `app/checkpoints/openaudio-s1-mini`
- `espeak-ng` installation through the platform-appropriate package manager

### Start

`start.js` launches the Gradio application from `app/launch.py` and captures the local web URL.

It also prompts for an optional `AZURE_AI_API_KEY`, used by the Microsoft Foundry / Azure AI LLM
provider path. Leaving it blank is valid when you only use local or other hosted providers.

### Update

`update.js` currently:

1. rebases the root launcher repo from `upstream/main`
2. pushes the current branch to `origin`
3. rebases the `app/` repo from `upstream/main`
4. pushes the app branch to `origin`
5. reruns `install.js`

### Reset

`reset.js` removes `app/`. The next `Install` recreates the app checkout and environment.

## Optional MCP Sidecar

The MCP sidecar is separate from the main UI and uses its own environment: `app/tts_mcp_env`.

Use it only if you want external tools or coding agents to call TTS Studio programmatically.

### MCP Flow

1. Run `Install MCP`.
2. Run `Start MCP`.
3. Use either `Open MCP Sidecar UI` or `MCP SSE Endpoint` from the Pinokio menu.
4. Use `Verify MCP` to test the sidecar health and authenticated SSE endpoint.

`mcp_start.js` launches:

```text
python mcp_sidecar.py --port {{port}}
```

from `app/` and then:

- reads `app/.mcp_token`
- writes `.vscode/mcp.json`
- writes `.vscode/mcp.live.json`

The tracked default `.vscode/mcp.json` should remain safe and empty until a live sidecar session
rewrites it.

### Exposed MCP Tools

The current sidecar exposes these tools through `app/mcp_sidecar.py`:

- `list_engines`
- `get_engine_info`
- `list_voices`
- `list_outputs`
- `get_app_version`
- `normalize_text`
- `list_llm_providers`
- `transform_text`
- `structure_conversation`
- `synthesize`
- `submit_synthesis_job`
- `get_job_status`
- `cancel_job`

Security and operational details:

- bearer-token auth is handled by `app/mcp_security.py`
- audit logging is written to `logs/mcp/audit.log`
- job state is persisted under `app_state/jobs/`

## Storage And Persistence

The current app-state layout is centered on `app_state/`, not `app_state_outputs/`.

Important locations used by `app/launch.py`:

- `app_state/settings.json`
- `app_state/presets.json`
- `app_state/voices/`
- `app_state/outputs/`
- `app_state/job_assets/`
- `app_state/conversation_checkpoints/`
- `outputs/`

Key runtime behaviors documented by the code today:

- structured autosave defaults to project-based storage
- custom output storage paths are supported
- narration, assistant, and conversation LLM settings persist independently
- conversation generation can resume from checkpoints when matching inputs exist
- History indexes structured autosave artifacts and supports reload into the UI
- Jobs track queued and long-running work separately from immediate single-shot generation

## Repo Layout

```text
.
|- install.js
|- start.js
|- mcp_install.js
|- mcp_start.js
|- mcp_verify.js
|- update.js
|- reset.js
|- pinokio.js
|- app/
|  |- launch.py
|  |- mcp_sidecar.py
|  |- job_manager.py
|  |- narration_transform.py
|  |- conversation_logic.py
|  `- README.md
`- Docs/
```

## Documentation Map

- Root `README.md`: launcher and workspace behavior
- `app/README.md`: app runtime, modes, engines, and manual operation
- `Docs/launch-py-index.md`: required navigation map before working in `app/launch.py`

## Notes

- The MCP sidecar is optional. The normal TTS web UI does not require it.
- Engine availability is conditional. Missing optional dependencies disable that engine path rather
  than preventing the UI from starting.
- The current source of truth for features is `app/launch.py` plus the extracted helper modules
  referenced by `Docs/launch-py-index.md`.
