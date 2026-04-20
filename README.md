# Ultimate-TTS-Studio-SUP3R-Edition

A Pinokio script for <https://github.com/SUP3RMASS1VE/Ultimate-TTS-Studio-SUP3R-Edition>

## Optional MCP Sidecar

### What is the MCP Sidecar?

The MCP sidecar (`mcp_sidecar.py`) is a **separate, optional** service that exposes TTS Studio's core features (generate speech, list voices/engines, narration transform, etc.) as MCP tools over an SSE endpoint. It runs in its own conda environment (`tts_mcp_env`), independent of the main app.

### Who Uses It?

| Consumer | How |
|---|---|
| **VS Code Copilot Chat** | Connects via `.vscode/mcp.json` so Copilot can call TTS functions directly from the editor |
| **Other MCP-compatible AI agents** | Any agent that speaks MCP protocol can connect to the SSE endpoint |
| **The MCP Sidecar UI** | Its own Gradio dashboard for testing MCP tools |

### Do I Need It?

- **If you're just using the TTS Studio web UI** (generating audio, using the assistant, narration transform, etc.) → **you don't need MCP at all.** The main `Start` button launches everything you need.
- **If you want AI coding agents (like Copilot) to trigger TTS generation programmatically** → install and start MCP.

> **TL;DR** — Just click **Start** in Pinokio. Skip the MCP buttons unless you're using Copilot or external AI tools to drive TTS generation.

The default `Install` and `Start` flow now keeps MCP dependencies out of the main `app/tts_env`
environment.

- `Install` provisions the normal Ultimate TTS Studio UI environment only.
- `Install MCP` provisions a separate optional `app/tts_mcp_env` environment for the MCP sidecar.
- `Start` continues to launch the normal UI unchanged.
- `Start MCP` launches the isolated MCP sidecar (`app/mcp_sidecar.py`), implemented as a standalone
  FastAPI + FastMCP server. Its SSE endpoint is mounted at `<sidecar-url>/gradio_api/mcp/sse`, and
  the bearer token is written to `app/.mcp_token`.

### MCP Launcher Flow

1. Run `Install MCP` from the root Pinokio launcher menu. This creates the isolated
   `app/tts_mcp_env` environment and installs the sidecar-specific MCP runtime.
2. Run `Start MCP`. The launcher starts `python mcp_sidecar.py --port {{port}}` from `app/` and
   captures the sidecar URL so Pinokio can show both `Open MCP Sidecar UI` and `MCP SSE Endpoint`.
3. Open `MCP SSE Endpoint` from the menu, or build it manually as
   `<captured-sidecar-url>/gradio_api/mcp/sse`.
4. Read the bearer token from `app/.mcp_token`. The sidecar rewrites this token on startup.
5. `Start MCP` now also rewrites `.vscode/mcp.json` and `.vscode/mcp.live.json` with the current
   sidecar URL and bearer token.

### VS Code MCP Startup Behavior

VS Code reads `.vscode/mcp.json` as soon as the workspace opens. If that file contains a fake or
stale MCP endpoint, VS Code tries to connect immediately and reports a startup failure before
`Start MCP` has had a chance to write a live config.

To prevent that, the tracked default `.vscode/mcp.json` is intentionally safe and empty:

```json
{
  "servers": {}
}
```

Once `Start MCP` is running, it replaces `.vscode/mcp.json` and writes `.vscode/mcp.live.json` with
the current sidecar URL and bearer token from `app/.mcp_token`.

If you need a manual template, use `.vscode/mcp.sample.json`. It keeps the preferred config shape,
but with obvious placeholders for the MCP port and bearer token so it is not mistaken for a live
config.

### Verifying The MCP Sidecar

After `Start MCP` is running:

1. Confirm the token file exists at `app/.mcp_token`.
2. Confirm the sidecar terminal shows `MCP security initialized. Token file: .mcp_token`.
3. Verify the SSE endpoint with PowerShell:

```powershell
$token = Get-Content .\app\.mcp_token -Raw
$headers = @{
  Authorization = "Bearer $token"
  Accept = "text/event-stream"
}
Invoke-WebRequest -Uri "http://127.0.0.1:<PORT>/gradio_api/mcp/sse" -Headers $headers
```

Replace `<PORT>` with the port shown in the Pinokio `MCP SSE Endpoint` menu item or sidecar log. If
authentication is wired correctly, the request should connect without an auth failure and the token
in `app/.mcp_token` should match the current sidecar session.

### MCP Config Files

- `.vscode/mcp.json`: tracked safe default until `Start MCP` rewrites it with the active live MCP
  client config
- `.vscode/mcp.live.json`: extra live-session copy written by `Start MCP` for inspection and
  debugging
- `.vscode/mcp.sample.json`: manual sample/reference config with obvious placeholders, not a live
  default

### MCP Tools (Phase 4a)

The sidecar exposes these MCP tools via `app/mcp_sidecar.py`:

| Tool                     | Category    | Description                                   |
| ------------------------ | ----------- | --------------------------------------------- |
| `list_engines`           | Read-only   | List registered TTS engines and availability  |
| `get_engine_info`        | Read-only   | Capabilities and status for a specific engine |
| `list_voices`            | Read-only   | Available voices for an engine                |
| `list_outputs`           | Read-only   | Enumerate generated output files              |
| `get_app_version`        | Read-only   | Application version string                    |
| `normalize_text`         | Stateless   | Deterministic text normalization (no LLM)     |
| `list_llm_providers`     | Stateless   | Configured LLM providers                      |
| `transform_text`         | Stateless   | AI Script Polish transform via configured LLM |
| `structure_conversation` | Stateless   | Format dialogue into NarrationScript JSON     |
| `synthesize`             | GPU-heavy   | Single-utterance synchronous synthesis        |
| `submit_synthesis_job`   | Job control | Submit a long-running synthesis job           |
| `get_job_status`         | Job control | Poll job lifecycle state                      |
| `cancel_job`             | Job control | Cancel a queued or running job                |

Security (`app/mcp_security.py`): bearer-token auth via `.mcp_token`, per-tool rate limits, and
audit logging under `logs/mcp/audit.log`.

Job state (`app/job_manager.py`): disk-backed JSON under `app_state/jobs/*.json` with subprocess
workers.

### Verify MCP Action

If MCP is installed, the Pinokio menu exposes `Verify MCP`.

1. It reads `app/.mcp_token`.
2. It probes `<sidecar-url>/status`.
3. It probes the authenticated SSE endpoint at `<sidecar-url>/gradio_api/mcp/sse`.
4. It prints both responses in the terminal and raises a completion notification.

## Voice Presets + Wrapper Pipeline

The app now includes a unified preset and generation wrapper workflow in `app/launch.py`:

- Persistent preset storage in `app_state/presets.json`
- Managed preset audio storage in `app_state/voices/`
- Runtime preset selection for supported engines (`ChatterboxTTS`, `Chatterbox Multilingual`,
  `Chatterbox Turbo`)
- Deterministic seed capture with visible `Last Seed` output
- Optional autosave pipeline for generated artifacts in `app_state/outputs/<project>/` (or custom
  output base path)
- Configurable generated-output storage mode in the UI (`Project Folders` or `Custom Path`) while
  keeping `app_state/voices/` local
- Conversation and audiobook generations now write sidecar metadata JSON next to saved audio (and
  conversation script sidecar text)
- Selecting `Custom Path` now opens a folder picker in front of the app for easier path selection
- Main generate flow keeps structured autosave storage by default and also keeps legacy outputs by
  default, with an option to auto-clean legacy copies if desired

Autosave writes:

- audio file (`audio/`)
- source script text (`scripts/`)
- metadata JSON (`meta/`) including engine, seed, preset, and text hash
- model controls in metadata are engine-specific (only fields exposed by the selected engine are
  included)

Reference design and checklists are in `app/docs/`.

## LLM Text-to-Script Crafter Status

- Current implementation status and future roadmap:
  - [app/tools/llm_narration_transform/docs/llm_text_to_script_crafter_status_and_roadmap.md](app/tools/llm_narration_transform/docs/llm_text_to_script_crafter_status_and_roadmap.md)
