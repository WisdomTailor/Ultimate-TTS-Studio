# Expert Communications Agent Brief — Ultimate TTS Studio User Documentation Suite

> **Issued by:** Agent 00 (Chief Project Manager)
> **Date:** 2026-04-03
> **Classification:** Insider-grade prompt brief for documentation agent
> **Target audience for output:** End users (hobbyists, audiobook creators, content creators, developers)

---

## 1. YOUR ROLE AND OPERATING CONSTRAINTS

You are a professional technical communications specialist. Your mission is to produce a
publication-quality documentation suite for **Ultimate TTS Studio SUP3R Edition** — an all-in-one
text-to-speech workstation with 14 engines, AI-powered text preparation, multi-speaker conversation
mode, eBook-to-audiobook conversion, professional audio effects, and MCP tool integration.

**Operating rules:**

- Write for humans, not engineers. Assume zero TTS experience.
- Every feature you document must trace to real UI controls. Do not fabricate controls or features.
- Use the exact labels, emoji prefixes, and tab names from the Gradio interface (listed below).
- Where a feature has a "why" — explain it before the "how."
- Screenshots will be added later by another team member. Leave `<!-- screenshot: DESCRIPTION -->`
  placeholders at logical insertion points.
- All file paths are relative to the project root (`/app/` for app code, `/Docs/` for docs).
- Use American English. Target a Flesch-Kincaid reading level of 8–10 (informed adult, not academic).
- Do NOT include implementation details, code, or architecture — this is user-facing.

---

## 2. PROJECT KNOWLEDGE BASE

### 2.1 What Is Ultimate TTS Studio?

Ultimate TTS Studio SUP3R Edition is a local-first, GPU-accelerated desktop application for
generating speech from text. It runs as a Gradio web UI served on localhost and is primarily
installed through [Pinokio](https://pinokio.co), a one-click app launcher.

**Core value proposition:** One interface that unifies 14 TTS engines with professional voice
cloning, AI text preparation, multi-speaker conversation generation, eBook audiobook conversion,
and a studio-grade audio effects chain — all running locally on the user's own hardware.

**Key differentiator:** Unlike cloud TTS services, everything runs locally. No audio leaves the
user's machine (unless they opt into cloud LLM providers for the AI Script Polish feature). Users
keep full control of their data and generated content.

### 2.2 Supported TTS Engines (14 Total)

Each engine has different strengths. Users choose based on their needs.

| # | Engine | UI Label | Specialty | Voice Source |
|---|--------|----------|-----------|--------------|
| 1 | ChatterboxTTS | 🎤 ChatterboxTTS | Voice cloning from short reference clips | User reference audio |
| 2 | Chatterbox Multilingual | 🌍 Chatterbox Multilingual | 23-language voice cloning | User reference audio |
| 3 | Chatterbox Turbo | 🚀 Chatterbox Turbo | Fast voice cloning (speed priority) | User reference audio |
| 4 | Kokoro TTS | 🗣️ Kokoro TTS | Pre-trained multilingual voices | Built-in voice library + custom .pt |
| 5 | Fish Speech | 🐟 Fish Speech | Natural TTS with advanced prosody | Custom voices |
| 6 | IndexTTS | 🎯 IndexTTS | Industrial-quality TTS | Custom voices |
| 7 | IndexTTS2 | 🎯 IndexTTS2 | Emotion control (6-axis emotion sliders) | Custom voices |
| 8 | F5-TTS | 🎵 F5-TTS | Flow-matching TTS | Reference audio |
| 9 | Higgs Audio | 🎙️ Higgs Audio | Multimodal TTS | Voice presets |
| 10 | VoxCPM | 🎤 VoxCPM | Voice cloning TTS | Reference audio + whisper transcription |
| 11 | KittenTTS | 🐱 KittenTTS | Lightweight mini model | 8 built-in expressive voices |
| 12 | Qwen Voice Design | 🎨 Qwen Voice Design | Create custom voices from text description | Text description of voice characteristics |
| 13 | Qwen Voice Clone | 🎭 Qwen Voice Clone | Clone voices from reference | Reference audio |
| 14 | Qwen Custom Voice | 🗣️ Qwen Custom Voice | Predefined speakers | Built-in speaker library |

**Important engine behaviors the docs should cover:**
- Models are NOT auto-loaded into GPU memory at startup — users must manually load via Model Manager
- Chatterbox and Kokoro auto-download on first load; Fish Speech requires manual download
- IndexTTS2 uniquely supports 6-axis emotion control (Happy, Sad, Angry, Afraid, Surprised, Calm)
- All engines work in both single-speaker and conversation modes
- VoxCPM includes advanced settings: CFG, timesteps, normalize, denoise, retry
- Qwen offers three distinct modes (Design, Clone, Custom) under one engine umbrella

### 2.3 Application UI Structure

The interface has a two-column layout:
- **Left column:** Input and controls (tabs + accordions)
- **Right column:** Output (generated audio, status, download)

#### Main Tabs (Input Area)

| Tab | UI Label | Purpose |
|-----|----------|---------|
| 1 | 📝 TEXT TO SYNTHESIZE | Single-speaker text input with AI Script Polish |
| 2 | 🎭 CONVERSATION MODE | Multi-speaker dialogue with character roster and script editor |
| 3 | 📚 EBOOK TO AUDIOBOOK | File-based eBook conversion to audiobook |
| 4 | 🎙️ VIBEVOICE | Multi-speaker podcast generation (1–4 speakers) |
| 5 | 🤖 ASSISTANT | AI chat assistant for help and guidance |
| 6 | 📋 JOBS | Background job queue monitoring |

#### Persistent Panels (Always Visible)

| Panel | UI Label | Purpose |
|-------|----------|---------|
| Model Manager | Model Management accordion | Load/unload TTS models, manage GPU memory |
| Assistant Status Bar | Status row at top | Shows assistant LLM connection state |
| Engine Selection | Engine Selection accordion | Choose which TTS engine to use |
| Engine Settings | Per-engine tab panel | Engine-specific parameters |
| Audio Effects Studio | Audio Effects Studio section | Post-processing chain |
| Workspace Controls | 🧭 Workspace Controls accordion | Presets, autosave, output storage |
| Output Panel | Right column | Generated audio, seed, status |

### 2.4 Feature Deep Dive — AI Script Polish

**UI location:** Narration Transform accordion inside the 📝 TEXT TO SYNTHESIZE tab.

This is an AI-powered text preparation system. Before text is spoken by a TTS engine, an AI can
rewrite, clean up, or enhance it so it sounds better when read aloud.

**LLM Provider options:**
- Custom OpenAI-compatible (flexible, advanced users)
- GitHub Models (cloud, free tier, GITHUB_MODELS_TOKEN)
- Google Gemini API (cloud, free tier, GOOGLE_API_KEY)
- LM Studio (local, no API key, auto-launch support)
- Microsoft Foundry (cloud, enterprise, AZURE_AI_API_KEY)
- Ollama (local, no API key)
- vLLM OpenAI Server (local, GPU inference)

**Transform Modes (3 tiers):**

| Mode | What It Does | Best For |
|------|-------------|----------|
| **Minimal** | Expands abbreviations, numbers, dates, units. Zero creative changes. | Technical text, factual content |
| **Polish** | Everything Minimal does + smooths awkward phrasing, adds natural transitions | Podcasts, presentations, blogs |
| **Vivid** | Everything Polish does + adds dramatic pacing, emotional beats, cinematic breathing | Audiobooks, storytelling, cinematic narration |

**Transform Styles:** Conversational, Professional/Formal, Storytelling/Cinematic, Podcast/Casual, Academic/Educational

**Locale system:** Transforms are language-aware (US English, British English, Australian English, etc.)

**Connection → Test → Transform flow:** Select provider → enter API key (if cloud) → select model → click 🔗 Test Connection → type text → choose mode + style → click Apply Transform → review result → generate speech.

### 2.5 Feature Deep Dive — Conversation Mode

**UI location:** 🎭 CONVERSATION MODE tab.

Multi-speaker dialogue generation with character management and script editing.

**Workflow:**
1. Paste a dialogue script (or write one)
2. Click "Analyze Script" to auto-detect characters
3. (Optional) Click "AI Format" to have an LLM restructure the dialogue
4. Assign voice, engine, and style per character in the character roster (up to 5 speakers)
5. Use the line editor to refine individual lines
6. (Optional) Apply per-line AI Script Polish for individual lines
7. Set timing controls (speaker change pause, same speaker pause)
8. Generate

**Per-speaker voice options vary by engine:**
- Kokoro: Pre-built voice selection per speaker
- KittenTTS: 8 expressive built-in voices
- IndexTTS2: Per-speaker 6-axis emotion control sliders
- Voice cloning engines: Per-speaker reference audio upload with transcription

**Timing controls:**
- Speaker Change Pause: -0.5 to 2.0 seconds (default 0.8s)
- Same Speaker Pause: -0.5 to 1.0 seconds (default 0.3s)

### 2.6 Feature Deep Dive — eBook to Audiobook

**UI location:** 📚 EBOOK TO AUDIOBOOK tab.

Convert eBook files into full audiobooks with chapter-level control.

**Supported formats:** .epub, .pdf, .txt, .html, .htm, .rtf, .fb2, .odt

**Workflow:**
1. Upload an eBook file
2. The app analyzes and displays chapter structure
3. Select which chapters to convert (multi-checkbox)
4. Choose TTS engine and audio format (WAV or MP3)
5. Set text chunk length (300–800 chars, default 500)
6. Configure timing gaps (between chunks: 0–3s, between chapters: 0–5s)
7. Generate

**Output behavior:** Files <50MB/<30min play directly in UI. Larger files are saved to the audiobooks folder with a download link.

### 2.7 Feature Deep Dive — VibeVoice

**UI location:** 🎙️ VIBEVOICE tab.

Multi-speaker podcast and dialogue generation using dedicated VibeVoice models.

**Workflow:**
1. Download a model (VibeVoice-1.5B compact or VibeVoice-Large high quality)
2. Load the model (optionally with Flash Attention for speed)
3. Write or paste a podcast script
4. Set number of speakers (1–4)
5. Assign voices per speaker (built-in or custom uploaded)
6. Configure generation settings (CFG Scale 0.1–3.0, seed, audio format)
7. Generate

**Custom voice upload:** 3–10 second voice samples with naming.

### 2.8 Feature Deep Dive — Audio Effects Studio

**UI location:** Audio Effects Studio section (visible below engine settings).

Professional post-processing chain applied to generated audio.

| Effect | Controls | Range |
|--------|----------|-------|
| 🎚️ Master Gain | Volume boost/cut | -20 to +20 dB |
| 3-Band EQ | Bass/Mid/Treble | -12 to +12 dB each |
| 🏛️ Reverb | Room Size, Damping, Wet Mix | 0.1–1.0 each |
| 🔊 Echo | Delay Time, Decay Amount | 0.1–1.0s, 0.1–0.9 |
| 🎼 Pitch Shift | Semitone shift | -12 to +12 semitones |

Each effect has an enable/disable checkbox. Effects are applied to the next generation.

### 2.9 Feature Deep Dive — Workspace Controls

**UI location:** 🧭 Workspace Controls accordion.

**Voice Preset Management:**
- Save/load/delete named voice presets per engine
- Presets stored in `app_state/presets.json`
- Preset audio files stored in `app_state/voices/`
- Speaker name association

**Autosave System:**
- Toggle autosave on/off
- Project name organization
- Options: Keep structured autosave copy + Keep legacy output copy
- Autosave writes: audio file, source script text, metadata JSON (engine, seed, preset, text hash)
- Auto-clean legacy copies option

**Output Storage:**
- "Project Folders" mode (default) or "Custom Path" mode
- Custom path uses folder picker for easy selection
- Open Output Folder / Open Autosave Folder buttons

### 2.10 Feature Deep Dive — Model Manager

**UI location:** Model Management accordion (top of left column).

Centralized control for loading and unloading TTS models from GPU memory.

**Key behaviors:**
- Models must be explicitly loaded before use
- Per-engine status indicators show load state
- Unload frees GPU memory for other engines
- Some engines (Chatterbox, Kokoro) auto-download on first load
- Fish Speech models require manual download

### 2.11 Feature Deep Dive — Assistant

**UI location:** 🤖 ASSISTANT tab.

In-app AI chatbot for help, guidance, and troubleshooting.

**Components:**
- Chat display with message history
- Message input + Send button + Clear Chat button
- Independent LLM settings (separate from AI Script Polish): provider, base URL, API key, model, system prompt, temperature, top-p, max tokens
- Connection test button

**Note:** The Assistant uses its own LLM configuration, independent from AI Script Polish. You can
use different providers for each.

### 2.12 Feature Deep Dive — Jobs

**UI location:** 📋 JOBS tab.

Background job queue monitoring for MCP-originated synthesis jobs.

**Components:**
- Job queue table: ID, Status, Engine, Created, Elapsed, Text Preview
- Manual refresh + auto-refresh toggle (3-second polling)
- Cancel Job and Retry Job controls
- Job details display

### 2.13 MCP Integration (Advanced / Developer Feature)

The app exposes a Model Context Protocol (MCP) server as an optional sidecar process. This allows
coding agents (like GitHub Copilot, Cursor, etc.) to use TTS Studio programmatically.

**13 MCP tools:** list_engines, get_engine_info, list_voices, list_outputs, get_app_version,
normalize_text, list_llm_providers, transform_text, structure_conversation, synthesize,
submit_synthesis_job, get_job_status, cancel_job.

**Separate install/start:** Install MCP + Start MCP from Pinokio menu.

---

## 3. INSTALLATION CONTEXT

The app is designed for one-click installation via Pinokio:
1. User clicks "Install" in Pinokio
2. All dependencies, models, and environment are automatically set up
3. User clicks "Start" to launch the Gradio UI
4. Browser opens to `http://127.0.0.1:<port>`

**System requirements:**
- Windows 11 (primary platform; tested on RTX 4090)
- NVIDIA GPU recommended (varies by engine)
- Python environment managed automatically by Pinokio
- Disk space: varies by number of engine models downloaded

---

## 4. DOCUMENTS REQUIRED — THE DELIVERABLE SUITE

Produce the following 5 documents. Each must be self-contained (readable independently) but
cross-referenced where relevant. All documents go in `/Docs/`.

### Document 1: `Docs/USER_GUIDE.md` — Comprehensive User Guide

**Purpose:** Complete reference guide covering every feature and control.
**Length target:** 8,000–12,000 words.
**Structure:**

1. **Welcome & What This App Does** — 2-paragraph overview
2. **Getting Started** — Launch, first run, choosing your first engine, generating your first audio
3. **The Interface** — Annotated layout walkthrough (left/right columns, tab structure)
4. **Single Speaker Generation** (📝 tab) — Full workflow: type text → choose engine → configure → generate → save
5. **AI Script Polish** — What it is, why you need it, provider setup, transform modes guide with examples, connection testing, applying transforms
6. **Conversation Mode** (🎭 tab) — Character setup, script analysis, AI formatting, line editing, per-speaker voice assignment, timing controls, generation
7. **eBook to Audiobook** (📚 tab) — File upload, chapter selection, format/timing settings, output handling
8. **VibeVoice** (🎙️ tab) — Model download/load, script input, speaker setup, generation settings
9. **Engine Reference** — Per-engine page with: what it does, when to choose it, settings guide, model management notes, voice cloning instructions (where applicable)
10. **Audio Effects Studio** — Effect-by-effect guide with recommended starting settings for common use cases (podcast, audiobook, cinematic, music backing)
11. **Workspace Controls** — Presets tutorial, autosave explained, output storage modes
12. **Model Manager** — Loading/unloading, GPU memory management, which models auto-download
13. **Assistant** (🤖 tab) — Setup, usage, how it differs from AI Script Polish
14. **Jobs** (📋 tab) — What appears here, monitoring, cancel/retry
15. **MCP Integration** (advanced) — Brief overview for developers, link to technical README
16. **Troubleshooting** — Common issues, audio quality tips, "it's too loud/quiet" fixes
17. **Keyboard Shortcuts & Tips** — Any time-saving workflows
18. **Glossary** — TTS terms defined plainly

### Document 2: `Docs/QUICK_START.md` — 5-Minute Quick Start

**Purpose:** Get a first-time user from zero to generated audio in under 5 minutes.
**Length target:** 800–1,200 words.
**Structure:**

1. Launch the app (assume Pinokio installed)
2. Choose your first engine (recommend ChatterboxTTS or Kokoro for beginners)
3. Load the model
4. Type a sentence
5. Click Generate
6. Listen to your result
7. (Optional) Try AI Script Polish
8. (Optional) Try a different engine
9. Where to go next (link to full guide)

### Document 3: `Docs/FEATURE_MATRIX.md` — Feature & Engine Comparison Matrix

**Purpose:** At-a-glance reference for "which engine should I use for X?"
**Length target:** 1,500–2,500 words.
**Structure:**

1. Engine comparison table (voice cloning? multilingual? emotion control? speed? quality? GPU needs?)
2. Use case recommendations:
   - "I want to clone my own voice" → these engines
   - "I want the fastest generation" → these engines
   - "I want emotion control" → IndexTTS2
   - "I want to make a podcast" → VibeVoice or Conversation Mode
   - "I want an audiobook" → eBook to Audiobook tab with these engines
   - "I want to design a voice from a description" → Qwen Voice Design
3. Transform mode comparison (Minimal vs Polish vs Vivid)
4. Audio format guidance (WAV vs MP3, when to use each)
5. LLM provider comparison (local vs cloud, speed vs quality)

### Document 4: `Docs/WORKFLOWS.md` — Workflow Recipes

**Purpose:** Step-by-step workflows for common real-world tasks.
**Length target:** 3,000–5,000 words.
**Structure — one section per workflow:**

1. **"Clone My Voice and Read Text"** — Reference audio → ChatterboxTTS → generate
2. **"Create a Podcast Episode"** — Script writing → Conversation Mode with 2+ speakers → export
3. **"Convert My eBook to Audiobook"** — Upload file → chapter selection → batch generate
4. **"Polish Raw Text for Professional Narration"** — AI Script Polish in Vivid mode → review → generate with F5-TTS
5. **"Design a Custom Voice from Scratch"** — Qwen Voice Design → describe voice → generate sample → use in production
6. **"Add Professional Audio Effects"** — Generate base audio → apply reverb + EQ for podcast studio feel
7. **"Generate Multi-Language Content"** — Chatterbox Multilingual 23 languages → per-language output
8. **"Use TTS Studio from Your Code Editor"** — MCP sidecar → VS Code integration → API calls
9. **"Save and Reuse Voice Presets"** — Create preset → save → load across sessions
10. **"Batch Generate with Consistent Settings"** — Preset + autosave + project folders

Each workflow: numbered steps, expected outcome, tips, common mistakes to avoid.

### Document 5: `Docs/FAQ.md` — Frequently Asked Questions

**Purpose:** Answer the 25 most common questions users will have.
**Length target:** 2,000–3,000 words.
**Structure — organized by category:**

**Getting Started:**
- What hardware do I need?
- Does it work on Mac/Linux?
- How much disk space do models need?
- Do I need an internet connection?

**Engines & Voices:**
- Which engine sounds best?
- Can I clone any voice?
- How long does a reference clip need to be?
- Why does my cloned voice sound different from the reference?

**AI Script Polish:**
- Do I need AI Script Polish? (Yes, even Minimal mode helps)
- Which LLM provider should I use?
- Is my text sent to the cloud?
- Why does the transform take so long?

**Audio Quality:**
- Why is the audio too loud/quiet/distorted?
- How do I make it sound like a professional podcast?
- What's the difference between WAV and MP3?

**Troubleshooting:**
- The model won't load
- Generation is very slow
- I get an out-of-memory error
- The app won't start
- Fish Speech models aren't loading

**Advanced:**
- What is MCP and do I need it?
- Can I use this programmatically?
- Where are my generated files saved?
- How do I back up my presets?

---

## 5. QUALITY GATES

Before considering any document complete, verify:

- [ ] Every UI tab and accordion mentioned uses the EXACT label from the app (with emoji prefix)
- [ ] No feature is described that doesn't exist in the current build
- [ ] All 14 engines are mentioned by name at least once in the User Guide
- [ ] Every workflow in WORKFLOWS.md can actually be performed with the current UI
- [ ] Cross-references between documents use relative markdown links
- [ ] Screenshot placeholders are present at every major UI walkthrough step
- [ ] Reading level is accessible (no unexplained jargon — if a technical term is used, it's in the Glossary)
- [ ] The MCP section is clearly marked as "Advanced / Developer" and doesn't confuse general users
- [ ] No architecture, code, file paths, or implementation details leak into user-facing content
- [ ] The difference between AI Script Polish (text preparation) and the TTS engine (voice synthesis) is made crystal clear early and reinforced throughout

---

## 6. TONE AND VOICE GUIDELINES

- **Warm but not fluffy.** Be helpful and encouraging without being condescending.
- **Direct.** Lead with what the user needs to do, not background theory.
- **Concrete.** Use real examples of text input → output wherever possible.
- **Honest about limitations.** If an engine only works well on certain hardware, say so.
- **Consistent terminology:**
  - "engine" not "model" when referring to ChatterboxTTS, Kokoro, etc.
  - "AI Script Polish" not "narration transform" or "LLM transform"
  - "generate" not "synthesize" in user-facing text
  - "reference audio" not "voice sample" for cloning input
  - "preset" for saved voice configurations
  - "autosave" for the automatic output persistence feature

---

## 7. SOURCE DOCUMENTS (For Grounding)

Read these files for additional context before writing. They contain verified technical details:

| File | What It Contains | Priority |
|------|-----------------|----------|
| `Docs/launch-py-index.md` | Complete structural map of the UI monolith | HIGH — use for feature verification |
| `Docs/LLM-Narration-Transform-Guide.md` | Detailed AI Script Polish user guide (existing draft) | HIGH — incorporate and expand |
| `Docs/REVISED_ROADMAP_v2.md` | Strategic roadmap with phase delivery status | MEDIUM — understand what's shipped |
| `app/README.md` | Technical README with MCP details | MEDIUM — source for MCP section |
| `README.md` | Root launcher README | LOW — basic overview |
| `Docs/evaluation-metrics-spec.md` | Quality metrics (internal) | LOW — not user-facing |
| `app/engine_registry.py` | Engine capability matrix (source of truth for engine features) | HIGH — verify engine claims |

---

## 8. DELIVERY FORMAT

- All documents in Markdown (`.md`)
- Save to `/Docs/` directory
- Use `##` for major sections, `###` for subsections
- Use tables for comparisons and reference data
- Use numbered lists for sequential workflows
- Use bullet lists for feature descriptions
- Fenced code blocks with language identifiers only where showing API/config examples
- Wrap prose at 100 characters per line
- Each document starts with a title (`#`), one-line description, and table of contents

---

*End of brief. The communications agent should have everything needed to produce the complete
documentation suite without additional codebase access.*
