# Ultimate-TTS-Studio-SUP3R-Edition

A Pinokio script for <https://github.com/SUP3RMASS1VE/Ultimate-TTS-Studio-SUP3R-Edition>

## Optional MCP Sidecar

The default `Install` and `Start` flow now keeps MCP dependencies out of the main `app/tts_env`
environment.

- `Install` provisions the normal Ultimate TTS Studio UI environment only.
- `Install MCP` provisions a separate optional `app/tts_mcp_env` environment for the MCP sidecar.
- `Start` continues to launch the normal UI unchanged.
- `Start MCP` launches the isolated Gradio MCP sidecar. Its SSE endpoint is
  `<sidecar-url>/gradio_api/mcp/sse`, and the bearer token is written to `app/.mcp_token`.

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

- `.vscode/mcp.json`: active live MCP client config, rewritten by `Start MCP`
- `.vscode/mcp.live.json`: extra live-session copy for inspection/debugging
- `.vscode/mcp.sample.json`: static sample/reference config

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
