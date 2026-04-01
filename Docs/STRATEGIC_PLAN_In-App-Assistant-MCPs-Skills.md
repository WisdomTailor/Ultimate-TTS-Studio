# Strategic Plan: In-App Assistant + MCPs/Skills/Tools for Ultimate TTS Studio

**Date:** 2026-03-31  
**Version:** 1.0  
**Status:** Actionable — ready for phased implementation

---

## Executive Summary

Ultimate TTS Studio is a sophisticated Gradio-based application with 10+ TTS engines, LLM narration
transformation, eBook-to-audiobook conversion, conversation mode scripting, and multi-provider LLM
integration. To unlock user self-service, operational visibility, and developer velocity, this plan
proposes:

1. **In-App Assistant:** Context-aware Gradio chatbot that lives in a persistent sidebar, diagnoses
   issues, suggests settings, and previews transforms before execution
2. **MCP Server (Outbound):** Expose TTS Studio tools to VS Code agents for programmatic voice
   generation and text transformation
3. **Skills & Tools (For Developers):** Create reusable domain knowledge packages for coding agents
   building on this repo
4. **Enhanced Narration UX:** Progressive disclosure, presets, and before-after preview to empower
   novice users

---

# Part 1: In-App Assistant Plan

## 1.1 Design Philosophy

**Goal:** Every user, at any moment, can ask for help and get context-aware guidance without leaving
the app.

**Principles:**

- Always visible, never intrusive (sidebar / collapsible panel)
- Answers emerge from the app's own configuration and real-time state
- Diagnostic: can test connections, list loaded models, explain errors
- Empowering: shows before-and-after previews, suggests optimal settings
- LLM-aware: uses the same provider and model already configured for narration

---

## 1.2 Implementation Options

### Option A: Sidebar Chatbot (Recommended for MVP)

**Structure:**

```mermaid
┌─────────────────────────────────────────┐
│  Ultimate TTS Studio                    │
├─────────────────┬───────────────────────┤
│   Sidebar       │                       │
│   Assistant     │    Active Tab         │
│   (Collapsible) │  (Narration, etc.)    │
│                 │                       │
│ ┌─────────────┐ │                       │
│ │  ✨ Helper  │ │                       │
│ │ Chat        │ │                       │
│ ├─────────────┤ │                       │
│ │ How do I    │ │                       │
│ │ use preset  │ │                       │
│ │ voices?     │ │                       │
│ │             │ │                       │
│ │ [Assistant] │ │                       │
│ │             │ │                       │
│ │ Select a    │ │                       │
│ │ voice...    │ │                       │
│ │             │ │                       │
│ │ [Message]   │ │                       │
│ │ [Send]      │ │                       │
│ └─────────────┘ │                       │
│                 │                       │
└─────────────────┴───────────────────────┘
```

**Advantages:**

- Minimal UI disruption
- Maintains focus on active task
- Standard Gradio chatbot component
- Can toggle visibility without affect­ing main flow

**Technical Implementation:**

```python
# In launch.py around the main gr.Blocks definition

with gr.Blocks(...) as demo:
    with gr.Row():
        with gr.Column(scale=0.2, min_width=250, elem_classes=["assistant-sidebar"]):
            gr.Markdown("### ✨ Studio Assistant")
            assistant_chatbot = gr.Chatbot(
                label="Ask me anything",
                height=400,
                show_copy_button=True,
                elem_classes=["assistant-chat"]
            )
            assistant_input = gr.Textbox(
                placeholder="How do I...?",
                label="Question",
                lines=1,
                submit_button="Ask"
            )
            gr.Markdown("**Quick Diagnostics**")
            diag_button = gr.Button("🔧 Test LLM Connection", variant="secondary")
            model_status = gr.Markdown("")

        with gr.Column(scale=0.8):
            # ... existing tabs and UI ...
```

---

### Option B: Tabbed Modal (Assistant as Its Own Tab)

**Structure:** Add "Assistant" as first tab in the main interface.

**Advantages:**

- Full-width assistance experience
- Can show richer previews (side-by-side before/after)
- Less cramped for complex workflows

**Disadvantages:**

- Requires tab switching; breaks "always visible" goal
- May add cognitive load

**Recommendation:** Use Option A for MVP; Option B can augment later.

---

### Option C: Floating Button + Collapsible Drawer

**Structure:** Small FAB (Floating Action Button) that expands to a drawer sliding in from the
right.

**Advantages:**

- Non-intrusive; can be dismissed
- Works well on mobile/responsive layouts
- Modern UX pattern

**Disadvantages:**

- Requires custom CSS/JS
- May obscure content

**Recommendation:** Potential Phase 2 enhancement for responsive design.

---

## 1.3 What the Assistant Should Do

### 1.3.1 Conversational Help

**Example flows:**

```text
User: "What's the difference between Minimal, Polish, and Vivid?"
Assistant: [Explains each mode with concrete examples]

User: "Can I use F5-TTS with Google Gemini?"
Assistant: [Checks app config; confirms engine+provider combo is supported]

User: "How do I format a conversation script?"
Assistant: [Shows template + example with character names, stage directions]

User: "Why isn't my eBook converting?"
Assistant: [Diagnoses: checks if IndexTTS2 is loaded, tests file path, suggests fixes]
```

**Implementation:**

- Use a retrieval-augmented prompt that pulls context from app state
- Query the app's loaded models, current settings, active features
- Feed this into the already-configured LLM provider

---

### 1.3.2 Diagnostic Tools (Built-in Actions)

- **Capability 1: Test LLM Connection**

```python
def diagnose_llm_connection():
    """Test if the configured LLM provider is reachable and responsive."""
    provider = get_user_llm_config()
    try:
        response = quick_llm_ping(provider)
        return f"✅ {provider['name']} is responding\n" \
               f"  Model: {provider['model_id']}\n" \
               f"  Latency: {response['latency_ms']}ms"
    except Exception as e:
        return f"❌ Cannot reach {provider['name']}: {e}\n" \
               f"  Check: API key, base URL, network"
```

- **Capability 2: List Loaded Models**

```python
def show_model_inventory():
    """Show which TTS/LLM engines are loaded and available."""
    loaded = {
        name: status for name, status in MODEL_STATUS.items()
        if status["loaded"]
    }
    return f"**Loaded Models ({len(loaded)}):**\n" + \
           "\n".join(f"- {name} ✅" for name in sorted(loaded.keys()))
```

- **Capability 3: Explain Error Message**

```python
def explain_error(error_msg: str):
    """Translate a technical error into plain-language guidance."""
    common_errors = {
        "CUDA out of memory": "Too many models loaded. Try unloading unused engines.",
        "Cannot reach LM Studio": "LM Studio isn't running. Launch it from the app or from Settings.",
        "API key invalid": "Check your API key in the LLM Provider settings.",
        "File not found": "Check that the file path is correct and the file exists.",
    }

    plain_language = common_errors.get(error_msg,
        f"Error: {error_msg}\n\nCheck docs or enable debug mode for details.")

    return plain_language
```

- **Capability 4: Suggest Optimal Settings**

```python
def suggest_settings_for_use_case(use_case: str):
    """Recommend settings based on user intent."""
    presets = {
        "audiobook": {
            "narration_mode": "Vivid",
            "voice_variety": "high",
            "engine": "F5-TTS or Kokoro",
            "llm_provider": "Ollama (local) or Gemini (remote)"
        },
        "podcast": {
            "narration_mode": "Polish",
            "voice_variety": "medium",
            "engine": "Kokoro",
            "llm_provider": "Local preferred for speed"
        },
        "quick_demo": {
            "narration_mode": "Minimal",
            "voice_variety": "low",
            "engine": "ChatterboxTTS (fastest)",
            "llm_provider": "Optional"
        }
    }
    return presets.get(use_case.lower(), presets["quick_demo"])
```

---

### 1.3.3 Preview Functionality

- **Capability 5: Preview Narration Transform**

Before applying a transform to a long document, users can:

1. Paste a short excerpt (1–3 sentences)
2. Select a Mode (Minimal, Polish, Vivid)
3. Click "Preview Transform"
4. See before and after side-by-side
5. Confirm settings before applying to full document

```python
def preview_narration_transform(
    excerpt: str,
    mode: str,
    provider_config: dict
) -> dict:
    """Show what the transform will do without modifying the document."""
    try:
        transformed = apply_narration_transform(
            excerpt,
            mode,
            provider_config
        )
        return {
            "mode": mode,
            "original": excerpt,
            "transformed": transformed,
            "status": "✅ Preview successful"
        }
    except Exception as e:
        return {
            "status": f"❌ Preview failed: {e}"
        }
```

---

## 1.4 Architecture & Data Flow

```mermaid
┌─────────────────────────────────────────────────────────────┐
│ Gradio UI Layer (launch.py)                                 │
├─────────────────────────────────┬───────────────────────────┤
│ Assistant Sidebar               │ Main Tabs                 │
│ ├─ Chatbot Component            │ ├─ Narration              │
│ ├─ User Input                   │ ├─ Conversation           │
│ └─ Diagnostic Buttons           │ ├─ eBook                  │
│                                 │ └─ Settings               │
├─────────────────────────────────┴───────────────────────────┤
│ Assistant Logic Layer (new module: app/assistant.py)         │
│ ├─ extract_app_context()           # Read app state          │
│ ├─ build_assistant_prompt()        # Embeddings + RAG        │
│ ├─ call_configured_llm()           # Use narration provider  │
│ ├─ format_assistant_response()     # Markdown formatting     │
│ └─ run_diagnostic_*()              # Connection tests, etc.  │
├────────────────────────────────────────────────────────────┤
│ Existing App State (already available)                      │
│ ├─ MODEL_STATUS                                              │
│ ├─ LLM provider config                                      │
│ ├─ Loaded voices & engines                                  │
│ ├─ Current settings & presets                               │
│ └─ Recent error logs                                        │
├────────────────────────────────────────────────────────────┤
│ External Integration                                        │
│ ├─ LLM Provider (OpenAI-compatible, Gemini, Ollama, etc.)   │
│ └─ (Optional) Knowledge Base for enhanced RAG               │
└────────────────────────────────────────────────────────────┘
```

---

## 1.5 Implementation Roadmap

### Phase 1: MVP (Weeks 1–2)

- [ ] Create `app/assistant.py` with core functions
- [ ] Add sidebar Chatbot component to `launch.py`
- [ ] Implement basic LLM integration (use existing narration provider)
- [ ] Add "Test LLM Connection" diagnostic
- [ ] Write 10–15 canned help responses covering common Q&A

### Phase 2: Enhanced Diagnostics (Weeks 3–4)

- [ ] Implement model inventory display
- [ ] Add error explanation engine
- [ ] Create settings suggestion system
- [ ] Test across all supported LLM providers

### Phase 3: Preview & Workflows (Weeks 5–6)

- [ ] Implement narration transform preview
- [ ] Add preset workflow guidance
- [ ] Build conversation script formatter helper

---

# Part 2: MCPs / Skills / Tools Analysis

## 2.1 MCP Server (Outbound)

### Question: Can TTS Studio expose an MCP server so VS Code agents can interact with it?

**Short Answer:** Yes. TTS Studio can expose an MCP server that allows VS Code Copilot agents to
generate speech, list voices, transform text, and structure conversations programmatically.

---

### 2.1.1 Reference: MCP Protocol Overview

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is a standardized way for AI agents
(e.g., VS Code Copilot) to talk to external systems. An MCP server exposes **tools** that an agent
can call.

**Example:**

```mermaid
┌──────────────────────┐
│ VS Code Copilot      │
└──────────────┬───────┘
               │ "generate_tts(...)"
               ├─ host: localhost:5000
               ├─ mcp_server: tts-studio
               ↓
┌──────────────────────────────────────────┐
│ TTS Studio MCP Server (Python)           │
├──────────────────────────────────────────┤
│ Tools:                                   │
│ ├─ generate_tts()                       │
│ ├─ list_voices()                        │
│ ├─ transform_text()                     │
│ ├─ structure_conversation()             │
│ └─ get_engine_info()                    │
└──────────────────────────────────────────┘
```

---

### 2.1.2 Proposed MCP Tools

#### Tool 1: `generate_tts`

**Purpose:** Generate audio from text using a selected engine.

```json
{
  "name": "generate_tts",
  "description": "Generate speech from text using the specified TTS engine",
  "inputSchema": {
    "type": "object",
    "properties": {
      "text": {
        "type": "string",
        "description": "Text to synthesize"
      },
      "engine": {
        "type": "string",
        "enum": ["f5-tts", "kokoro", "chatterbox", "vibevoice", "indextts2"],
        "description": "TTS engine to use"
      },
      "voice": {
        "type": "string",
        "description": "Voice ID (run list_voices to see available)"
      },
      "output_format": {
        "type": "string",
        "enum": ["wav", "mp3"],
        "default": "wav"
      }
    },
    "required": ["text", "engine", "voice"]
  }
}
```

**Example Usage (in VS Code):**

```python
# Agent generates introduction for a tutorial video
result = mcp_call("generate_tts", {
    "text": "Welcome to the Advanced Prompt Engineering tutorial",
    "engine": "f5-tts",
    "voice": "warm-female-009",
    "output_format": "wav"
})
# Returns: { "audio_path": "/outputs/intro.wav", "duration_sec": 3.2 }
```

---

#### Tool 2: `list_voices`

**Purpose:** Discover available voices for a given engine.

```json
{
  "name": "list_voices",
  "description": "List all available voices for a TTS engine",
  "inputSchema": {
    "type": "object",
    "properties": {
      "engine": {
        "type": "string",
        "enum": ["f5-tts", "kokoro", "chatterbox", "vibevoice", "indextts2"],
        "description": "Engine to list voices for"
      }
    },
    "required": ["engine"]
  }
}
```

**Returns:**

```json
{
  "engine": "kokoro",
  "voices": [
    {
      "voice_id": "ko_f01",
      "display_name": "Kokoro Female (friendly)",
      "gender": "female",
      "language": "en"
    },
    {
      "voice_id": "ko_m01",
      "display_name": "Kokoro Male (professional)",
      "gender": "male",
      "language": "en"
    }
  ],
  "total": 6
}
```

---

#### Tool 3: `transform_text`

**Purpose:** Apply narration transformation before synthesis.

```json
{
  "name": "transform_text",
  "description": "Transform text for optimal TTS output",
  "inputSchema": {
    "type": "object",
    "properties": {
      "text": {
        "type": "string",
        "description": "Text to transform"
      },
      "mode": {
        "type": "string",
        "enum": ["minimal", "polish", "vivid"],
        "description": "Transformation intensity"
      },
      "preview": {
        "type": "boolean",
        "default": false,
        "description": "If true, return before/after; don't save"
      }
    },
    "required": ["text", "mode"]
  }
}
```

---

#### Tool 4: `structure_conversation`

**Purpose:** Format a dialogue into TTS-compatible conversation script.

```json
{
  "name": "structure_conversation",
  "description": "Convert dialogue into a TTS-compatible conversation script",
  "inputSchema": {
    "type": "object",
    "properties": {
      "dialogue": {
        "type": "string",
        "description": "Raw dialogue text or conversation blocks"
      },
      "characters": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Names of speakers (e.g., ['Alice', 'Bob'])"
      },
      "voice_map": {
        "type": "object",
        "description": "Mapping of character name to voice ID",
        "example": { "Alice": "ko_f01", "Bob": "ko_m01" }
      }
    },
    "required": ["dialogue", "characters"]
  }
}
```

---

#### Tool 5: `get_engine_info`

**Purpose:** Query engine capabilities and status.

```json
{
  "name": "get_engine_info",
  "description": "Get information about available TTS engines",
  "inputSchema": {
    "type": "object",
    "properties": {
      "engine": {
        "type": "string",
        "description": "Engine name, or 'all' for all engines"
      }
    }
  }
}
```

**Returns (for engine='all'):**

```json
{
  "engines": [
    {
      "name": "f5-tts",
      "loaded": true,
      "voice_count": 8,
      "supported_formats": ["wav", "mp3"],
      "features": ["multi-speaker", "emotion-control"],
      "status": "ready"
    },
    {
      "name": "kokoro",
      "loaded": true,
      "voice_count": 6,
      "supported_formats": ["wav"],
      "features": ["low-latency"],
      "status": "ready"
    }
  ]
}
```

---

### 2.1.3 Implementation Outline

**Create: `app/mcp_server.py`**

```python
"""
MCP server for TTS Studio.
Exposes tools for voice generation, text transformation, etc.
Runs on a background thread; can be accessed via stdio or HTTP.
"""

import json
import logging
from mcp.server import Server
from mcp.types import Tool, TextContent

# Initialize MCP server
server = Server("tts-studio")
logger = logging.getLogger(__name__)

@server.list_tools()
async def list_tools() -> list[Tool]:
    """Return available MCP tools."""
    return [
        Tool(
            name="generate_tts",
            description="Generate audio from text",
            inputSchema={ ... }
        ),
        Tool(
            name="list_voices",
            description="List available voices",
            inputSchema={ ... }
        ),
        Tool(
            name="transform_text",
            description="Transform text for TTS",
            inputSchema={ ... }
        ),
        Tool(
            name="structure_conversation",
            description="Format dialogue script",
            inputSchema={ ... }
        ),
        Tool(
            name="get_engine_info",
            description="Query engine capabilities",
            inputSchema={ ... }
        ),
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    """Handle tool invocations from VS Code."""
    if name == "generate_tts":
        return await handle_generate_tts(arguments)
    elif name == "list_voices":
        return await handle_list_voices(arguments)
    elif name == "transform_text":
        return await handle_transform_text(arguments)
    elif name == "structure_conversation":
        return await handle_structure_conversation(arguments)
    elif name == "get_engine_info":
        return await handle_get_engine_info(arguments)
    else:
        raise ValueError(f"Unknown tool: {name}")

async def handle_generate_tts(args):
    """Invoke generateTTS with given parameters."""
    text = args["text"]
    engine = args["engine"]
    voice = args["voice"]
    output_format = args.get("output_format", "wav")

    # Delegate to existing TTS handler
    audio_path, error = await invoke_tts_engine(engine, text, voice, output_format)
    if error:
        return TextContent(type="text", text=f"Error: {error}")
    return TextContent(type="text", text=json.dumps({
        "status": "success",
        "audio_path": audio_path
    }))

# ... other handlers ...

def run_mcp_server():
    """Start the MCP server."""
    import asyncio
    asyncio.run(server.run(sys.stdin.buffer, sys.stdout.buffer))
```

**Integration with launch.py:**

```python
# In launch.py, after model initialization

import threading
from app.mcp_server import run_mcp_server

# Start MCP server in background thread (optional, can be user-enabled)
def start_mcp_server():
    """Start MCP server to allow VS Code integration."""
    mcp_thread = threading.Thread(target=run_mcp_server, daemon=True)
    mcp_thread.start()

# User can enable via Settings or command-line flag
if os.environ.get("ENABLE_MCP_SERVER") == "1":
    start_mcp_server()
```

**VS Code Integration: `copilot-instructions.md`**

````markdown
# TTS Studio MCP Server

Studio can expose an MCP server for programmatic voice generation.

## Enable the Server

```bash
ENABLE_MCP_SERVER=1 python app/launch.py
```
````

## Configure VS Code

In your `.vscode/settings.json`:

\`\`\`json { "github.copilot.codeGeneration.agents.tts-studio": { "serverPath": "127.0.0.1",
"serverPort": 5000, "serverType": "stdio" } } \`\`\`

## Example: Generate Audio for a Tutorial

\`\`\`python

# In a coding agent or custom prompt

import requests

# Use the TTS Studio MCP server to generate intro audio

response = mcp.call("generate_tts", { "text": "Welcome to the API reference documentation",
"engine": "kokoro", "voice": "professional-female" })

print(f"Audio saved to: {response['audio_path']}") \`\`\`

````markdown
---

### 2.1.4 Benefits & Use Cases

| Use Case | Benefit |
|----------|---------|
| **Automated Tutorial Generation** | Agent reads doc, generates narrated video snippets |
| **Batch Audiobook Processing** | Workflow agents generate full books programmatically |
| **Accessibility Automation** | CI/CD pipeline adds audio narration to docs/releases |
| **Voice-First Demos** | Build interactive demos with pre-generated voice tracks |

---

## 2.2 Can TTS Studio Consume MCP Servers?

### Question: Could TTS Studio benefit from integrating external MCP servers?

**Short Answer:** Yes, with strong caveats. An MCP server for **document-to-dialogue conversion** or
**speaker identification** could enhance conversation mode.

---

### 2.2.1 Potential Inbound MCPs

#### MCP 1: Document Analyzer (Hypothetical)

**Purpose:** Extract speaker names, dialogue structure, and metadata from unstructured text.

```json
{
  "name": "analyze_document",
  "description": "Extract dialogue structure from a document",
  "inputSchema": {
    "type": "object",
    "properties": {
      "text": { "type": "string" },
      "hint_characters": { "type": "array", "items": { "type": "string" } }
    }
  }
}
```
````

- **Benefit:** For conversation mode, this MCP could pre-parse scripts, identify speakers, and suggest
voice assignments.

- **Caution:** Adding external MCP dependency complicates deployment. Evaluate if the existing
LLM-based conversation mode is sufficient.

#### MCP 2: Voice Cloning Service (Hypothetical)

    **Purpose:** Generate new voices from audio samples.

    **Benefit:** Users could integrate with voice cloning services without reinventing the wheel.

    **Caution:** Out of scope for MVP. Only consider if user demand is clear.

---

### 2.2.2 Recommendation

**For MVP: Do not consume external MCPs.**

**Rationale:**

- The app's LLM provider (Ollama, Gemini, LM Studio) already does dialogue extraction.
- Adding MCP client complexity increases maintenance burden.
- Defer to Phase 2+ if specific use cases demand it.

---

## 2.3 Skills & Tools for Developers

### Question: What project-specific skills could help coding agents working on this repo?

**Answer:** Create 4–6 reusable domain skills:

---

### Skill 1: TTS Engine Handler Pattern

**File:** `skills/tts-engine-integration/SKILL.md`

**Purpose:** Guide developers adding a new TTS engine (e.g., "Project X TTS").

**Content:**

```markdown
# TTS Engine Integration Skill

## Pattern Overview

Every TTS engine in Ultimate TTS Studio follows this pattern:

1. **Handler Module** (`app/{engine_name}_handler.py`)
   - `async def synthesize(text, voice_id, speed, pitch) -> (audio_bytes, error)`
   - `def list_voices() -> list[Voice]`
   - `def init() -> (bool, status_msg)`
   - `def unload() -> None`

2. **Engine Registration** (`app/launch.py`)
   - Add import for handler
   - Register in MODEL_STATUS dict
   - Add UI tab and buttons

3. **Voice Loader** (if custom voices)
   - Use `app/tools/download_models.py` pattern
   - Store in `app/checkpoints/{engine_name}/`

## Quickstart: Add New Engine "NewTTS"

1. Create `app/newtts_handler.py` with core functions
2. Register in MODEL_STATUS["newtts"] in launch.py
3. Add UI buttons for load/unload/test in TTS tab
4. Test with existing narration and conversation modes
5. Documentation: Update README.md with engine description

## Common Pitfalls

- Forgetting to add cleanup in unload()
- Not handling missing models gracefully
- Not respecting DEVICE (CPU vs GPU)
- Blocking the UI thread during synthesis
```

---

### Skill 2: Narration Transform Prompt Engineering

**File:** `skills/narration-prompt-engineering/SKILL.md`

**Purpose:** Guide LLM prompt optimization for text transformation.

**Content:**

```markdown
# Narration Transform Prompt Engineering

## Current System Prompt Evaluation

The narration transform system uses:

- `DEFAULT_LLM_NARRATION_SYSTEM_PROMPT` (~80 words)
- Three modes: Minimal, Polish, Vivid
- No per-mode guidance for the LLM

## Recommended Improvements

### Problem: LLM Doesn't Know What "Vivid" Means

- **Current:** Labels with no definition
- **Fix:** Add concrete examples in system prompt

### Problem: Style Has No Effect

- **Current:** Style parameter isn't sent to LLM
- **Fix:** Embed style-specific rules in system prompt templates

### Problem: MAX_TAG_DENSITY Uninterpretable

- **Current:** Float `0.5` with no scale explanation
- **Fix:** Replace with explicit rule ("Place [tags x] every N words")

## Prompt Template Format

Each mode should have a distinct system prompt:

\`\`\`python SYSTEM_PROMPTS = { "minimal": """Your job is to fix ONLY: 1. Expand abbreviations (Dr.
→ Doctor) 2. Spell out numbers 0-9 3. Convert currency symbols to words

    DO NOT rewrite sentences. Preserve all meaning, structure, pacing.""",

    "polish": """Rewrite for clarity and natural pacing:
    1. Break up run-on sentences
    2. Replace jargon with everyday words
    3. Add punctuation for natural pauses (commas, dashes)

    Example:
    BEFORE: "Quantum entanglement, which Einstein called 'spooky action at a distance',
             defies conventional understanding."
    AFTER: "Quantum entanglement defies understanding. Einstein called it 'spooky action
            at a distance.'",

    "vivid": """Rewrite for maximum expressiveness and engagement:
    1. Add emotional language and emphasis
    2. Break complex ideas into shorter, punchier sentences
    3. Use metaphors and vivid verbs

    Example:
    BEFORE: "The discovery changed everything."
    AFTER: "This discovery shattered everything we thought we knew."""

} \`\`\`

## Testing & Validation

- Test across providers: Ollama 7B, Mistral, Gemini, Claude
- Measure consistency: Same input → Similar output across 3 runs
- Evaluate quality: Run `scripts/eval_narration_transform.py`
```

---

### Skill 3: Gradio UI Patterns for TTS Studio

**File:** `skills/gradio-ui-patterns/SKILL.md`

**Purpose:** Document common UI patterns used in the app for consistency.

**Content:**

```markdown
# Gradio UI Patterns for TTS Studio

## Pattern 1: Engine Selector Tab

All TTS engines follow this pattern:

\`\`\`python with gr.Tab("🎤 TTS Engines"): with gr.Group(label="Engine Selection",
elem_classes=["fade-in"]): engine_dropdown = gr.Dropdown( choices=["F5-TTS", "Kokoro",
"ChatterboxTTS"], value="kokoro", label="Select TTS Engine", scale=2 ) with gr.Row(): load_btn =
gr.Button("📥 Load", variant="primary", scale=1) unload_btn = gr.Button("📤 Unload",
variant="secondary", scale=1)

        engine_status = gr.Markdown(value="Status: Not loaded", elem_classes=["status"])

        load_btn.click(
            fn=load_engine,
            inputs=[engine_dropdown],
            outputs=[engine_status]
        )

\`\`\`

## Pattern 2: Settings Panel

Settings are grouped by functionality:

\`\`\`python with gr.Group(label="Advanced Settings"): with gr.Row(): speed = gr.Slider(0.5, 2.0,
1.0, label="Speed") pitch = gr.Slider(-20, 20, 0, label="Pitch (Hz)") emotion =
gr.Dropdown(["neutral", "happy", "sad"], label="Emotion") \`\`\`

## Pattern 3: Status & Diagnostics

Always include a Markdown output for status:

\`\`\`python status_output = gr.Markdown( value="🟡 Ready", elem_classes=["status-indicator"] )
\`\`\`

Status values use emoji conventions:

- 🟢 Ready / Success
- 🟡 Waiting / Caution
- 🔴 Error / Failed
- ⏳ Loading / Processing
```

---

### Skill 4: Conversation Mode Script Formatting

**File:** `skills/conversation-mode-scripting/SKILL.md`

**Purpose:** Document conversation mode formatting rules.

**Content:**

```markdown
# Conversation Mode Script Formatting

## Format Rules

Conversation scripts use a simple text-based format:

\`\`\` CHARACTER_A: This is dialogue. CHARACTER_B: This is a response. ~[Stage direction or action]~
CHARACTER_A: More dialogue after the action. \`\`\`

## Character Definition

Define characters at the top of the script:

\`\`\` === SPEAKERS === CHARACTER_A: kokoro_f01 CHARACTER_B: kokoro_m01

=== DIALOGUE === CHARACTER_A: Hello! How are you? CHARACTER_B: I'm doing great, thanks for asking.
\`\`\`

## Annotation

Annotate dialogue for emotional intensity:

\`\`\` CHARACTER_A: [excited] I got the job! CHARACTER_B: [surprised] Wait, really? That's amazing!
\`\`\`

## Validation

Use the App Assistant to check script format before generating audio: \`\`\`

> Check my script format Assistant: [validates and suggests fixes] \`\`\`
```

---

### Skill 5: Text Transform Evaluation & Testing

**File:** `skills/narration-transform-testing/SKILL.md`

**Purpose:** Guide testing of narration transformations.

**Content:**

```markdown
# Narration Transform Testing & Evaluation

## Manual Test Cases

Before submitting a transform change, test with:

### Test Set 1: Edge Cases

- All-numeric text: "1,234,567.89 is a big number"
- Abbreviations: "Dr. Smith at 123 Oak Ave."
- Phone numbers: "Call me at 555-867-5309"
- Currency: "$100.50 vs £50"
- Percentages: "30% reduction in costs"

### Test Set 2: Mode Consistency

- Same input → Run 3 times with each mode
- Check: Does "Vivid" always rewrite more than "Minimal"?
- Check: Does "Polish" always preserve meaning?

### Test Set 3: Provider Compatibility

- Ollama 7B
- Mistral 7B
- Gemini 1.5 Pro
- (Skip Claude; different API syntax)

## Automated Testing

Use the evaluation script:

\`\`\`bash python scripts/eval_narration_transform.py \\ --test-set tests/narration/test_cases.json
\\ --providers ollama,gemini \\ --modes minimal,polish,vivid \\ --output
results/eval_2026_03_31.json \`\`\`

## Metrics

- **Consistency:** 80%+ of outputs match expected pattern
- **Length:** Vivid > Polish > Minimal (in character count)
- **Meaning Preservation:** None of the mode should change meaning
```

---

### 2.3.3 Skill Library Organization

Create the following directory structure:

```mermaid
skills/
├── tts-engine-integration/
│   └── SKILL.md
├── narration-prompt-engineering/
│   ├── SKILL.md
│   └── example_prompts.json          # Templates
├── gradio-ui-patterns/
│   ├── SKILL.md
│   └── snippets/                     # Reusable code blocks
├── conversation-mode-scripting/
│   ├── SKILL.md
│   └── examples/                     # Sample scripts
└── narration-transform-testing/
    ├── SKILL.md
    └── test_cases.json               # Test data
```

---

### 2.3.4 Skill Integration with Copilot Agents

Add a Copilot instructions file to guide agent selection:

**File:** `.vscode/copilot-instructions.md`

```markdown
# TTS Studio Development Instructions for Copilot

When working on this codebase, apply these skills:

## Engine Integration

- Skill: `skills/tts-engine-integration/SKILL.md`
- Trigger: Adding new TTS engine or modifying existing handler
- Example: "Add VibeVoice engine support"

## Narration & Transform

- Skill: `skills/narration-prompt-engineering/SKILL.md`
- Trigger: Modifying system prompts, LLM configuration
- Example: "Improve Vivid mode output consistency"

## UI & UX

- Skill: `skills/gradio-ui-patterns/SKILL.md`
- Trigger: Adding new controls or panels
- Example: "Create settings panel for new engine"

## Conversation Scripts

- Skill: `skills/conversation-mode-scripting/SKILL.md`
- Trigger: Enhancing conversation mode or adding examples
- Example: "Add tone annotation support"

## Testing

- Skill: `skills/narration-transform-testing/SKILL.md`
- Trigger: Quality validation for transform changes
- Example: "Validate transform behavior across providers"
```

---

## 2.4 Consistency & Multi-Model Strategies

### Challenge: Outputs vary significantly across LLM providers

**Problem Patterns:**

- Ollama 7B produces shorter outputs than Gemini
- Different models interpret "Vivid" differently
- Temperature fluctuations cause inconsistency

### Solution 1: Structured Output (JSON Mode)

Force the LLM to return structured, validated output:

```python
def transform_with_structured_output(text: str, mode: str, provider: str):
    """Use JSON mode to ensure consistent output format."""

    system_prompt = f"""You are a text transformer for TTS.

    Return ONLY valid JSON in this format:
    {{
        "mode": "{mode}",
        "original": "<original text>",
        "transformed": "<transformed text>",
        "changes_made": ["change1", "change2"],
        "confidence": 0.95
    }}
    """

    response = call_llm_with_json_mode(system_prompt, user_prompt, provider)

    # Validate response before returning
    parsed = json.loads(response)
    assert parsed["mode"] == mode, "Mode mismatch"
    assert len(parsed["transformed"]) > 0, "Empty output"

    return parsed
```

---

### Solution 2: Provider-Specific Prompt Templates

Match prompts to each provider's strengths:

```python
PROVIDER_TWEAKS = {
    "ollama_7b": {
        "system_prompt_length": "short",              # Use concise prompts
        "examples_per_mode": 2,                       # Fewer examples
        "temperature": 0.3,                           # Lower temp for consistency
    },
    "gemini": {
        "system_prompt_length": "detailed",           # Gemini handles long prompts
        "examples_per_mode": 5,                       # More examples help
        "temperature": 0.5,
    },
    "lm_studio_mistral": {
        "system_prompt_length": "medium",
        "examples_per_mode": 3,
        "temperature": 0.4,
    }
}

def calibrate_transform_prompt(mode: str, provider: str):
    """Adjust prompt for the target provider."""
    config = PROVIDER_TWEAKS.get(provider, PROVIDER_TWEAKS["ollama_7b"])

    system_prompt = get_system_prompt_for_mode(mode, config["system_prompt_length"])
    system_prompt += f"\n\n" + get_examples(mode, count=config["examples_per_mode"])

    return system_prompt, config["temperature"]
```

---

### Solution 3: Validation & Fallback

If LLM output fails validation, use local fallback:

```python
def apply_narration_transform_safe(text: str, mode: str, provider_config: dict) -> str:
    """Transform text with LLM, fallback to local if LLM fails."""

    try:
        # Try LLM first
        transformed = call_llm_transform(text, mode, provider_config)
        if validate_output(transformed, mode):
            return transformed
        else:
            logger.warning("LLM output validation failed, using fallback")
    except Exception as e:
        logger.warning(f"LLM transform failed: {e}, using fallback")

    # Fallback to local transform (always available)
    return _apply_local_narration_transform(text, mode)
```

---

# Part 3: Novice UX Recommendations for Narration Transform

## 3.1 Current State Assessment

**Panel Name:** "Narration Transform (LLM)"  
**Issues (from design review):**

- Name is opaque ("Transform?" "LLM?" unclear to new users)
- No guidance on what modes do
- Labels MINIMAL/POLISH/VIVID are unexplained
- No preview before applying to large documents
- Settings (MAX_TAG_DENSITY, LOCALE) are undocumented
- No "quick start" for common use cases

---

## 3.2 Recommended Design: Progressive Disclosure

**Goal:** Empower beginners without overwhelming them; allow power users to access advanced
settings.

```mermaid
┌─────────────────────────────────────────────────────────┐
│ AI Script Polish                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ✨ "AI rewrites your text to sound natural when         │
│     spoken aloud."                                      │
│                                                         │
│ QUICK START (Beginner-friendly)                         │
│ ═════════════════════════════════════════════           │
│                                                         │
│  📖 Use Case:                                          │
│  [Select from dropdown]                                │
│   • 📚 Audiobook (expressive, engaging)                │
│   • 🎙️ Podcast (clear, conversational)                 │
│   • 📰 News (professional, measured)                   │
│   • 🎬 Video Narration (dynamic, paced)                │
│   • ⚙️ Custom (manual config)                          │
│                                                         │
│  [Preset selected: Audiobook]                           │
│  ✅ Recommended: Polish mode + Preserve abbreviations   │
│                                                         │
│  📝 Text Input:                                         │
│  [Paste excerpt (1-3 sentences)]                        │
│                                                         │
│  [Preview Transform]                                    │
│                                                         │
│ ADVANCED SETTINGS (Collapsed)                           │
│ ════════════════════════════════════════                │
│ [▼ Show Advanced]                                       │
│                                                         │
│ [Later, after clicking ▼]                               │
│   Mode Details                                          │
│   └─ Minimal: Only fix numbers, abbreviations           │
│   └─ Polish: Improve flow and clarity                   │
│   └─ Vivid: Maximize expressiveness                     │
│                                                         │
│   Post-Transform Options                                │
│   └─ [x] Preserve abbreviations (Dr., Mr., etc.)        │
│   └─ [x] Spell out currency symbols ($→dollars)         │
│   └─ [ ] Apply emotion tags ([happy], [sad])            │
│                                                         │
│   LLM Provider                                          │
│   └─ [Current: Ollama, Model: Mistral 7B]               │
│   └─ [⚙️ Change]                                        |
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 3.3 Implementation Details

### Step 1: Rename Panel & Update Tooltip

In `launch.py`:

```python
with gr.Tab("✨ AI Script Polish", elem_classes=["ai-polish-tab"]):
    gr.Markdown("""
    ### ✨ AI Script Polish

    AI rewrites your text to sound natural and expressive when spoken aloud.
    Choose a use case or mode, and optionally preview before applying to your full document.
    """)
```

---

### Step 2: Implement Use-Case Selector

```python
QUICK_START_PRESETS = {
    "audiobook": {
        "mode": "vivid",
        "description": "Expressive, engaging narration for fiction and memoirs",
        "preserve_abbrev": True,
        "spell_currency": True,
        "recommended_engines": ["F5-TTS", "Kokoro"]
    },
    "podcast": {
        "mode": "polish",
        "description": "Clear, conversational tone for interviews and discussions",
        "preserve_abbrev": True,
        "spell_currency": False,
        "recommended_engines": ["Kokoro", "ChatterboxTTS"]
    },
    "news": {
        "mode": "polish",
        "description": "Professional, neutral tone for news and factual content",
        "preserve_abbrev": False,
        "spell_currency": True,
        "recommended_engines": ["ChatterboxTTS"]
    },
    "video_narration": {
        "mode": "vivid",
        "description": "Dynamic, paced delivery for video tutorials and explainers",
        "preserve_abbrev": True,
        "spell_currency": True,
        "recommended_engines": ["F5-TTS"]
    }
}

def apply_preset(use_case):
    preset = QUICK_START_PRESETS[use_case]
    return (
        preset["mode"],
        preset["preserve_abbrev"],
        preset["spell_currency"],
        gr.Markdown(f"✅ {preset['description']}\n\nRecommended: {preset['mode'].title()} mode")
    )

# In UI:
use_case_selector = gr.Radio(
    choices=list(QUICK_START_PRESETS.keys()),
    value="audiobook",
    label="📖 Use Case",
    type="value"
)

preset_description = gr.Markdown()

use_case_selector.change(
    fn=apply_preset,
    inputs=[use_case_selector],
    outputs=[mode_selector, preserve_abbrev_checkbox, spell_currency_checkbox, preset_description]
)
```

---

### Step 3: Before-After Preview

```python
def preview_transform(text_excerpt, mode, preserve_abbrev):
    """Show before/after without modifying original."""
    if not text_excerpt.strip():
        return "Please paste some text to preview.", "❌ No text provided"

    try:
        transformed = apply_narration_transform(
            text_excerpt,
            mode,
            preserve_abbrev=preserve_abbrev
        )
        return f"""
### 📝 Preview

**Original:**
{text_excerpt}

---

**After {mode.title()} Mode:**
{transformed}

---

✅ Preview successful. Ready to apply to full document?
        """, "✅ Preview ready"
    except Exception as e:
        return f"❌ Preview failed: {e}", f"❌ Error: {str(e)}"

# In UI:
preview_button = gr.Button("👁️ Preview Transform", variant="secondary")
preview_output = gr.Markdown()
preview_status = gr.Markdown()

preview_button.click(
    fn=preview_transform,
    inputs=[text_input, mode_selector, preserve_abbrev_checkbox],
    outputs=[preview_output, preview_status]
)
```

---

### Step 4: Help Expandables

```python
def format_mode_help():
    return """
    ### 📖 Mode Explanations

    **Minimal:**
    - Only fix numbers, abbreviations, symbols
    - "555-867-5309" → "five five five, eight six seven, five three zero nine"
    - "Dr. Smith" → "Doctor Smith"
    - "30%" → "thirty percent"
    - Preserves all other text exactly

    **Polish:**
    - Improves flow and natural pacing
    - Breaks up run-on sentences
    - Replaces jargon with everyday words
    - Suitable for most audiobooks and podcasts

    **Vivid:**
    - Rewrites for maximum expressiveness
    - Adds emotional language and emphasis
    - Converts passive sentences to active
    - Best for fiction, storytelling, dramatic content
    """

# In UI (within Advanced section):
with gr.Accordion("📚 What do the modes do?", open=False):
    gr.Markdown(format_mode_help())
```

---

### Step 5: Assistant Integration

The in-app assistant can answer:

```text
User: "What's the difference between modes?"
Assistant: [Shows expandable from Step 4]

User: "Which mode should I use for my book?"
Assistant: [Asks about genre, suggests mode based on answer]

User: "Can I preview before applying?"
Assistant: [Points to Preview button + explains how it works]
```

---

## 3.4 Layout (Hierarchical)

```mermaid
AI Script Polish Tab
│
├─ 🎯 Quick Start Section (Visible by Default)
│  ├─ Use Case Selector (Radio: Audiobook / Podcast / News / Video / Custom)
│  ├─ Recommended Mode Display (Dynamic)
│  ├─ Text Input (Short excerpt)
│  └─ Preview Button
│
├─ 👀 Preview Output (Appears after Preview Click)
│  ├─ Before / After
│  └─ Status (✅ or ❌)
│
└─ ⚙️ Advanced Settings (Collapsed by Default)
   ├─ 📋 Mode Details (Expandable)
   ├─ ☑️ Post-Transform Options
   │  ├─ Preserve abbreviations
   │  ├─ Spell currency symbols
   │  └─ [Optional] Apply emotion tags
   ├─ 🔌 LLM Provider Info
   │  ├─ Current provider + model
   │  └─ [⚙️ Change Provider]
   └─ 🧪 Diagnostics
      ├─ [Test LLM Connection]
      └─ [View System Prompt]
```

---

## 3.5 Messaging & Microcopy

**Goal:** Clear, jargon-free language for beginners.

| Component             | Current                     | Recommended                                                                    |
| --------------------- | --------------------------- | ------------------------------------------------------------------------------ |
| Panel Title           | "Narration Transform (LLM)" | "✨ AI Script Polish"                                                          |
| Description           | _missing_                   | "AI rewrites your text to sound natural and expressive when spoken aloud."     |
| Mode: STRICT          | "Strict" (sounds harsh)     | "Minimal" (sounds safe)                                                        |
| Mode: NORMALIZE       | "Normalize" (technical)     | "Polish" (approachable)                                                        |
| Mode: EXPRESSIVE      | "Expressive" (OK)           | "Vivid" (more vivid!)                                                          |
| Button: Apply         | "Transform" (vague)         | "Apply AI Polish" (concrete)                                                   |
| Help: MAX_TAG_DENSITY | _unexplained_               | "Emotion tags frequency: How often to add [happy], [sad], etc." (+ slider 0–1) |

---

## 3.6 Accessibility & Responsiveness

- All buttons and toggles have clear labels and tooltips
- High contrast between "Minimal," "Polish," and "Vivid" modes
- Mobile-friendly: Collapsible advanced section
- Keyboard navigation: Tab through Quick Start, then Advanced

---

## 3.7 Onboarding & Guidance

**First-Time User Flow:**

1. User opens app, clicks "AI Script Polish"
2. See: "Choose a use case" prompt
3. Select "Audiobook"
4. See: "Recommended: Polish mode with Preserve abbreviations"
5. Paste 1-2 sentences
6. Click "Preview Transform"
7. See before/after side-by-side
8. If happy: "Ready to apply to full document? [Yes] [No]"
9. Apply transformation and proceed to TTS

---

# Part 4: Implementation Roadmap & Prioritization

## Phase 1: Foundation (Weeks 1–3)

### 1.1: In-App Assistant MVP

- [ ] Create `app/assistant.py` with core LLM integration
- [ ] Add sidebar Chatbot to `launch.py`
- [ ] Implement "Test LLM Connection" diagnostic
- [ ] Write help prompts for top 10 Q&A topics
- **Effort:** 3 PT | **Value:** High (addresses user support burden)

### 1.2: Narration Transform UX Redesign

- [ ] Rename panel to "AI Script Polish"
- [ ] Implement Quick Start presets (Audiobook, Podcast, News, Video)
- [ ] Add before-after preview functionality
- [ ] Update help text and tooltips
- **Effort:** 4 PT | **Value:** High (new user retention)

---

## Phase 2: Enhancement & Polish (Weeks 4–6)

### 2.1: Advanced Assistant Capabilities

- [ ] Add model inventory display
- [ ] Implement error explanation engine
- [ ] Create settings suggestion system
- [ ] Test across all LLM providers
- **Effort:** 3 PT | **Value:** Medium (reduces support requests)

### 2.2: Narration Prompt Quality

- [ ] Implement JSON-mode structured output
- [ ] Create provider-specific prompt templates
- [ ] Build evaluation harness
- [ ] Establish baseline consistency metrics
- **Effort:** 4 PT | **Value:** High (improves output consistency)

### 2.3: Skills & Documentation

- [ ] Write 5 domain-specific skills (Engine integration, Prompts, UI, Conversation, Testing)
- [ ] Create skill directory and `.vscode/copilot-instructions.md`
- [ ] Document MCP server capabilities (outbound only, MVP)
- **Effort:** 3 PT | **Value:** Medium (developer velocity)

---

## Phase 3: Integration & Ecosystem (Weeks 7–8)

### 3.1: MCP Server (Optional, MVP Scope)

- [ ] Build `app/mcp_server.py` with 5 core tools
- [ ] Add VS Code integration instructions
- [ ] Write example workflows
- [ ] Test tool invocation from VS Code Copilot
- **Effort:** 3 PT | **Value:** Medium (enables programmatic access)

### 3.2: Polish & Release

- [ ] User testing with 3–5 novice users
- [ ] Refine UX based on feedback
- [ ] Update documentation and examples
- [ ] Create video tutorial for new features
- **Effort:** 2 PT | **Value:** High (market readiness)

---

## Priority Matrix

| Feature               | Phase | Effort | Value  | Priority |
| --------------------- | ----- | ------ | ------ | -------- |
| Assistant sidebar     | 1.1   | 3 PT   | High   | 🔴 P0    |
| Narration UX redesign | 1.2   | 4 PT   | High   | 🔴 P0    |
| Advanced diagnostics  | 2.1   | 3 PT   | Medium | 🟠 P1    |
| Prompt engineering    | 2.2   | 4 PT   | High   | 🟠 P1    |
| Skills library        | 2.3   | 3 PT   | Medium | 🟡 P2    |
| MCP server            | 3.1   | 3 PT   | Medium | 🟡 P2    |
| Polish & release      | 3.2   | 2 PT   | High   | 🔴 P0    |

**Total Effort:** ~25 PT over 8 weeks

---

# Appendix A: Example Assistant Dialogs

## Dialog 1: First-Time User

```text
User: "How do I use this app?"
```
