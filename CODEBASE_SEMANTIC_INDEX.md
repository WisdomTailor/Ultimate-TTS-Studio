# Ultimate TTS Studio - Codebase Semantic Index

> **Purpose**: Semantic navigation map for the entire codebase. Use this index to quickly locate
> components by function, layer, or feature.

---

## Quick Navigation

| Layer             | Key Files                                               | Description                          |
| ----------------- | ------------------------------------------------------- | ------------------------------------ |
| **Launcher**      | `pinokio.js`, `install.js`, `start.js`                  | Pinokio one-click installer/launcher |
| **Core UI**       | `app/launch.py`                                         | Gradio monolith (~21K lines)         |
| **Engine Layer**  | `app/engine_registry.py`, `app/*_handler.py`            | TTS engine abstractions              |
| **Service Layer** | `app/tts_service.py`, `app/mcp_sidecar.py`              | Headless services                    |
| **Data Layer**    | `app/output_history_store.py`, `app/job_manager.py`     | Persistence and job recovery         |
| **Narration**     | `app/narration_script.py`, `app/narration_transform.py` | Script processing                    |

---

## 1. Launcher Layer (Root Scripts)

### Pinokio Integration

| File             | Semantic Purpose       | Key Exports/Events                     |
| ---------------- | ---------------------- | -------------------------------------- |
| `pinokio.js`     | Dynamic menu generator | `menu()` → install/start/stop/open UI  |
| `install.js`     | Conda env + repo clone | Creates `tts_env`, clones app deps     |
| `start.js`       | Launch Gradio UI       | Captures `http://` URL → `local.set`   |
| `update.js`      | Pull + reinstall       | `git pull`, `uv pip install -r`        |
| `reset.js`       | Clean slate            | Removes `app/`, `checkpoints/`, `env/` |
| `link.js`        | Deduplication          | Symlinks redundant library folders     |
| `torch.js`       | PyTorch setup          | xformers/triton/sageattention options  |
| `mcp_install.js` | MCP sidecar env        | Creates `tts_mcp_env`                  |
| `mcp_start.js`   | MCP sidecar launch     | SSE endpoint on port 2xxx              |
| `mcp_verify.js`  | MCP connectivity       | Auth + tool discovery check            |

---

## 2. Core Application Layer (`app/`)

### 2.1 Main Entry Point

| File        | Lines   | Semantic Role                                                         |
| ----------- | ------- | --------------------------------------------------------------------- |
| `launch.py` | ~21,788 | **Gradio monolith** - All UI tabs, model management, generation logic |

**Key Sections in `launch.py`** (see `Docs/launch-py-index.md` for detailed navigation):

- Lines ~1-500: Imports, config, model registry init
- Lines ~500-2000: TTS Engine loading/unloading, model manager class
- Lines ~2000-5000: Text-to-Synthesize tab (single speaker)
- Lines ~5000-8000: Conversation Mode tab (multi-speaker scripts)
- Lines ~8000-11000: eBook → Audiobook tab (batch generation)
- Lines ~11000-14000: VibeVoice tab (podcast workflow)
- Lines ~14000-16000: Assistant tab (in-app LLM)
- Lines ~16000-18000: Jobs tab (queue management)
- Lines ~18000-20000: History tab (output browser)
- Lines ~20000+: Settings tab, presets, app shutdown

### 2.2 Engine Registry & Profiles

| File                        | Semantic Purpose            | Key Classes/Functions                                     |
| --------------------------- | --------------------------- | --------------------------------------------------------- |
| `engine_registry.py`        | Central capability registry | `EngineRegistry`, `EngineCapability`, `get_engine_info()` |
| `engine_script_profiles.py` | Per-engine optimization     | `get_profile(engine)`, `ScriptProfile` dataclass          |

**Engine Capabilities Tracked**:

- SSML support, bracket cues, emotion vectors
- Voice cloning, custom voice design
- Supported audio formats, sample rates
- Max text length, GPU memory requirements

### 2.3 TTS Engine Handlers

| Handler File                  | Engine         | Key Features                               |
| ----------------------------- | -------------- | ------------------------------------------ |
| `chatterbox_turbo_handler.py` | Chatterbox TTS | Voice cloning, exaggeration control, 24kHz |
| `f5_tts_handler.py`           | F5-TTS         | Reference audio-based cloning              |
| `higgs_audio_handler.py`      | Higgs Audio    | Multi-style TTS, emotion control           |
| `indextts2_handler.py`        | IndexTTS2      | Advanced indexing, speaker prompts         |
| `kitten_tts_handler.py`       | KittenTTS      | Lightweight, fast inference                |
| `qwen_tts_handler.py`         | Qwen TTS       | Voice design, cloning, custom voices       |
| `vibevoice_handler.py`        | VibeVoice      | Podcast-style multi-speaker                |
| `voxcpm_handler.py`           | VoxCPM         | CPM-based architecture                     |

**Common Handler Interface**:

```python
class TTSEngineHandler:
    def load_model(self, checkpoint: str) -> None
    def unload_model(self) -> None
    def synthesize(self, text: str, voice: str, **kwargs) -> bytes
    def get_voices(self) -> list[str]
    def get_capabilities(self) -> dict
```

---

## 3. Service Layer

### 3.1 TTS Service (Headless)

| File                     | Semantic Role      | Key Functions                                                 |
| ------------------------ | ------------------ | ------------------------------------------------------------- |
| `tts_service.py`         | Headless TTS API   | `generate_tts()`, `list_engines()`, `list_voices()`           |
| `conversation_logic.py`  | Script parsing     | `parse_script()`, `extract_speakers()`, `format_for_engine()` |
| `narration_script.py`    | Script models      | `NarrationScript`, `ScriptLine`, `SemanticCue` (Pydantic)     |
| `narration_transform.py` | LLM transforms     | `transform_text()`, `Minimal/Polish/Vivid` modes              |
| `pronunciation.py`       | Phonetic overrides | `protect_terms()`, `apply_phonetic_dict()`                    |

### 3.2 MCP Sidecar (Phase 4a)

| File              | Semantic Role            | Exposed Tools                                                                                                               |
| ----------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `mcp_sidecar.py`  | FastAPI + FastMCP server | `list_engines`, `synthesize`, `submit_synthesis_job`, `get_job_status`, `list_voices`, `get_engine_info`, `ping` (13 total) |
| `mcp_security.py` | Auth + rate limits       | `BearerTokenAuth`, `RateLimiter`, `audit_log()`                                                                             |
| `job_manager.py`  | Disk-backed jobs         | `submit_job()`, `get_job()`, `cleanup_old_jobs()`, progress checkpoint recovery                                             |

**MCP Server Endpoints**:

- SSE: `http://localhost:2xxx/sse`
- Tools: 13 registered FastMCP tools
- Auth: Bearer token from `app/.mcp_token`

---

## 4. Data & State Layer

### 4.1 Persistence

| File                         | Semantic Role  | Storage Format                       |
| ---------------------------- | -------------- | ------------------------------------ |
| `output_history_store.py`    | SQLite index   | `outputs.db` → `outputs` table       |
| `output_history_service.py`  | Business logic | Path resolution, metadata enrichment |
| `output_history_ui.py`       | History tab UI | Gradio components, search/filter     |
| `history_index_scheduler.py` | Auto-indexing  | Triggers on autosave events          |
| `job_manager.py`             | Job state      | `app_state/jobs/*.json`              |

### 4.2 State Files (`app_state/`)

| File                  | Purpose          | Schema                                |
| --------------------- | ---------------- | ------------------------------------- |
| `settings.json`       | User preferences | LLM providers, output paths, defaults |
| `presets.json`        | Voice presets    | Named preset configs                  |
| `prompt_library.json` | Saved prompts    | Categorized prompt templates          |
| `jobs/*.json`         | Job state        | Status, params, output paths          |

### 4.3 Output Storage

| Path                 | Purpose                               |
| -------------------- | ------------------------------------- |
| `outputs/`           | Flat audio files (legacy)             |
| `app_state_outputs/` | Structured bundles (metadata + audio) |
| `outputs.db`         | SQLite index for fast search          |

---

## 5. Narration & Conversation

### 5.1 Script Processing Pipeline

```text
Input Text
    ↓
pronunciation.py → Protect terms, apply phonetics
    ↓
narration_transform.py → LLM transform (Minimal/Polish/Vivid)
    ↓
narration_script.py → Parse into structured script
    ↓
conversation_logic.py → Format for engine (SSML, bracket cues)
    ↓
[TTS Engine Handler] → synthesize()
```

### 5.2 Key Data Models

```python
# narration_script.py
class NarrationScript:
    lines: list[ScriptLine]
    metadata: dict

class ScriptLine:
    speaker: str
    text: str
    cues: list[SemanticCue]  # whisper, pause, emphasis

# conversation_logic.py
def parse_script(text: str) -> list[dict]:
    """Parse 'Speaker: Text' format into structured lines"""

def format_for_engine(lines: list[dict], engine: str) -> list[str]:
    """Apply engine-specific formatting (SSML, cues)"""
```

---

## 6. Assistant & LLM Integration

| File                             | Semantic Role    | Key Functions                                        |
| -------------------------------- | ---------------- | ---------------------------------------------------- |
| `assistant_service.py`           | In-app assistant | `chat()`, `get_tts_guidance()`, LLM provider routing |
| `tools/llm_narration_transform/` | Transform tools  | QLoRA configs, evaluation scripts                    |
| `engine_script_profiles.py`      | Prompt addendums | Per-engine LLM optimization hints                    |

**LLM Providers Supported** (via `assistant_service.py`):

- OpenAI API, Anthropic API, LM Studio (local), Ollama (local)

---

## 7. Engine Module Repositories (`app/` subfolders)

| Folder         | Engine         | Purpose                |
| -------------- | -------------- | ---------------------- |
| `chatterbox/`  | Chatterbox TTS | Cloned engine codebase |
| `fish_speech/` | Fish Speech    | Cloned engine codebase |
| `higgs_audio/` | Higgs Audio    | Cloned engine codebase |
| `indextts/`    | IndexTTS       | Cloned engine codebase |
| `indextts2/`   | IndexTTS2      | Cloned engine codebase |
| `qwen_tts/`    | Qwen TTS       | Cloned engine codebase |
| `vibevoice/`   | VibeVoice      | Cloned engine codebase |

---

## 8. Utility Tools (`app/tools/`)

| File/Folder                | Semantic Role                               |
| -------------------------- | ------------------------------------------- |
| `whisper_asr.py`           | Whisper ASR for audio transcription         |
| `download_models.py`       | Model download utility                      |
| `api_server.py`            | Standalone API server                       |
| `api_client.py`            | API client for external integrations        |
| `server/`                  | Server utilities (model_manager, inference) |
| `webui/`                   | WebUI utilities (audio_effects, inference)  |
| `vqgan/`                   | VQGAN tools for audio generation            |
| `llm_narration_transform/` | LLM transform training/eval tools           |

---

## 9. Documentation (`Docs/`)

| File                                            | Semantic Purpose                                      |
| ----------------------------------------------- | ----------------------------------------------------- |
| `launch-py-index.md`                            | **CRITICAL**: Navigation map for `launch.py` monolith |
| `USER_GUIDE.md`                                 | End-user documentation                                |
| `QUICK_START.md`                                | Getting started guide                                 |
| `FAQ.md`                                        | Common questions                                      |
| `FEATURE_MATRIX.md`                             | Feature comparison across engines                     |
| `REVISED_ROADMAP_v2.md`                         | Phase 1-5 roadmap                                     |
| `LLM-Narration-Transform-Guide.md`              | LLM transform feature guide                           |
| `TTS-Output-Browser-Implementation-Plan.md`     | Output browser feature spec                           |
| `Architecture-Review-Recommendations 040426.md` | Architecture review findings                          |
| `UI-Improvement-Plan.md`                        | UI/UX improvement proposals                           |

---

## 10. Search by Feature

### Text-to-Speech Generation

- **Entry**: `launch.py` → Text to Synthesize tab
- **Engine selection**: `engine_registry.py` → `get_engine_info()`
- **Handler**: `app/*_tts_handler.py` → `synthesize()`
- **Service**: `tts_service.py` → `generate_tts()`

### Conversation Mode (Multi-Speaker)

- **Script parsing**: `conversation_logic.py` → `parse_script()`
- **Transform**: `narration_transform.py` → `transform_text()`
- **Format**: `conversation_logic.py` → `format_for_engine()`
- **Generation**: Per-line calls to engine handlers

### Audiobook Generation

- **eBook conversion**: `ebook_converter.py`
- **Batch logic**: `launch.py` → eBook tab
- **Output**: `outputs/` or `app_state_outputs/`

### Output History Browsing

- **UI**: `output_history_ui.py`
- **Search**: `output_history_service.py`
- **Index**: `output_history_store.py` → `outputs.db`

### MCP Integration

- **Server**: `mcp_sidecar.py`
- **Auth**: `mcp_security.py`
- **Jobs**: `job_manager.py`
- **Client config**: `.vscode/mcp.live.json`

---

## 11. Configuration Files Reference

| File                               | Purpose              | Format |
| ---------------------------------- | -------------------- | ------ |
| `pinokio_meta.json`                | Pinokio metadata     | JSON   |
| `app/requirements.txt`             | Python deps          | pip/uv |
| `app/requirements_mcp_sidecar.txt` | MCP deps             | pip/uv |
| `app_state/settings.json`          | User settings        | JSON   |
| `.vscode/mcp.json`                 | VS Code MCP config   | JSON   |
| `pyrightconfig.json`               | Pyright type checker | JSON   |
| `.prettierrc.json`                 | Prettier formatter   | JSON   |

---

## 12. Key Relationships Diagram

```javascript
pinokio.js (UI)
    ↓
start.js → launch.py (Gradio)
    ├── engine_registry.py → *handler.py
    ├── tts_service.py (headless)
    ├── mcp_sidecar.py → MCP tools
    ├── conversation_logic.py → narration_transform.py
    ├── output_history_*.py → outputs.db
    └── assistant_service.py → LLM providers
```

---

## 13. Common Tasks Quick Reference

| Task                      | Start Here                  | Then                                                   |
| ------------------------- | --------------------------- | ------------------------------------------------------ |
| Add new TTS engine        | `engine_registry.py`        | Create `app/new_engine_handler.py`                     |
| Modify UI tab             | `launch.py`                 | Search for tab section (see `Docs/launch-py-index.md`) |
| Change narration pipeline | `narration_transform.py`    | Update `engine_script_profiles.py`                     |
| Add MCP tool              | `mcp_sidecar.py`            | Register in `@mcp.tool()` decorator                    |
| Fix output history        | `output_history_service.py` | Check `outputs.db` schema                              |
| Update launcher           | `pinokio.js`                | Modify menu items dynamically                          |

---

_Last updated: 2026-05-01_ _For detailed `launch.py` navigation, see `Docs/launch-py-index.md`_
