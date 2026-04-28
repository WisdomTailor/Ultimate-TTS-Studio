# Ultimate TTS Studio SUP3R Edition — User Guide

**Complete reference guide for every feature, workflow, and control.**

Everything you need to go from first launch to professional-quality audio production — all in one
place. If you're just getting started, check the [Quick Start Guide](QUICK_START.md) first. If you
want a quick engine comparison, jump to [Feature Matrix](FEATURE_MATRIX.md). For step-by-step
workflow recipes, see [Workflows](WORKFLOWS.md). (See [Glossary](#19-glossary) for TTS terms.)

---

## Table of Contents

1. [Welcome & What This App Does](#1-welcome--what-this-app-does)
2. [Getting Started](#2-getting-started)
3. [The Interface](#3-the-interface)
4. [Single Speaker Generation](#4-single-speaker-generation)
5. [AI Script Polish](#5-ai-script-polish)
6. [Conversation Mode](#6-conversation-mode)
7. [eBook to Audiobook](#7-ebook-to-audiobook)
8. [VibeVoice](#8-vibevoice)
9. [Engine Reference](#9-engine-reference)
10. Audio Effects Studio _(Part 2)_
11. Workspace Controls _(Part 2)_
12. Model Manager _(Part 2)_
13. Assistant _(Part 2)_
14. History _(Part 2)_
15. Jobs _(Part 2)_
16. MCP Integration _(Part 2)_
17. Troubleshooting _(Part 2)_
18. Keyboard Shortcuts & Tips _(Part 2)_
19. Glossary _(Part 2)_

---

## 1. Welcome & What This App Does

Ultimate TTS Studio SUP3R Edition is an all-in-one text-to-speech workstation that runs entirely on
your own computer. It brings together 14 TTS engines — from voice cloning to multi-speaker dialogue
to emotion-controlled narration — under one interface that anyone can use without prior audio or AI
experience.

This isn't a cloud service where your voice recordings are uploaded to someone else's server and
your content is processed on their hardware. Everything happens locally. Your text, your reference
audio, and your generated speech stay on your machine. If you choose to use cloud AI providers for
the AI Script Polish feature, only your text (not any audio) passes through a third-party API — and
that's entirely optional. Whether you're an audiobook narrator looking to scale your production, a
podcaster who wants natural multi-speaker dialogue, a content creator experimenting with voice
cloning, or a hobbyist who's simply curious about AI voices, this guide will walk you through
everything from your first generation to advanced workflows.

---

## 2. Getting Started

### Launching the App

Ultimate TTS Studio is designed to be installed and launched through **Pinokio**, a one-click app
launcher. Once installed, the workflow is:

1. Open **Pinokio** on your desktop.
2. Find **Ultimate TTS Studio SUP3R Edition** in your app list.
3. Click **Start**.

A browser tab opens automatically — usually at an address like `http://127.0.0.1:7860`. That's the
app. All the controls and generation happen right in that browser window; nothing else to install or
configure.

> **Tip:** Bookmark the app URL so you can reopen it quickly if the tab closes. The address stays
> the same as long as the app is running.

<!-- screenshot: Pinokio launcher with Ultimate TTS Studio listed and Start button highlighted -->

### What You See on First Run

When the interface loads for the first time, you'll see a two-column layout. The left side is your
workspace: tabs, settings, engine controls, and the text input. The right side is your output area,
which will show your generated audio once you create something.

Nothing is loaded yet. The engines are installed on your drive, but no model is sitting in GPU
memory — that's by design. You'll load whichever engine you need for your project, keeping your GPU
free for other work when you're done.

> **In a hurry?** Head to the [Quick Start Guide](QUICK_START.md) for the fastest path to your first
> generated audio. Come back here when you want to explore deeper features.

### System Requirements

| Requirement    | Details                                                          |
| -------------- | ---------------------------------------------------------------- |
| **OS**         | Windows 11 (primary tested platform)                             |
| **GPU**        | NVIDIA GPU recommended; exact requirements vary by engine        |
| **Disk space** | Varies by how many engine models you download (each is 0.5–8 GB) |
| **Python**     | Managed automatically by Pinokio — you don't need to install it  |

> ⚠️ **GPU note:** Some engines (ChatterboxTTS, Fish Speech, IndexTTS2) are GPU-intensive and will
> be significantly slower or unable to run without a dedicated NVIDIA GPU. Lighter engines like 🐱
> KittenTTS and 🗣️ Kokoro TTS can run on CPU in a pinch, but GPU is always faster.

### How Models Are Downloaded

Most engines download their model files the first time you load them — you'll see a progress message
in the status bar. After the first download, everything loads from your drive within a few seconds.

**Exception:** 🐟 Fish Speech requires a manual download step. You'll find the download button
inside the **Model Management** section of the app. Details are in the [Fish Speech](#fish-speech)
engine reference.

---

## 3. The Interface

### Two-Column Layout

The app uses a clean split layout designed to keep your controls and your output visible at the same
time.

<!-- screenshot: Full app interface showing left column (controls) and right column (output panel) -->

**Left column** — your workspace. Everything you need to configure and trigger a generation:

- Six tabs that switch between different generation modes
- Persistent accordion panels that stay accessible regardless of which tab you're on
- Engine settings that update based on which engine you've selected

**Right column** — your results. When audio is generated, it appears here immediately. You'll see:

- An audio player to listen before saving
- The status of the last generation
- A seed number you can copy to reproduce the same result
- Download controls and audiobook output links

### The Six Main Tabs

| Tab                       | What It's For                                              |
| ------------------------- | ---------------------------------------------------------- |
| **📝 TEXT TO SYNTHESIZE** | Single-speaker generation — type or paste text and go      |
| **🎭 CONVERSATION MODE**  | Multi-speaker dialogue with per-character voice settings   |
| **📚 EBOOK TO AUDIOBOOK** | Convert book files into narrated audiobooks                |
| **🎙️ VIBEVOICE**          | Podcast-style multi-speaker generation with its own models |
| **🤖 ASSISTANT**          | AI chatbot for in-app help and guidance                    |
| **🕘 HISTORY**            | Browse and reload past generations from autosave bundles   |
| **📋 JOBS**               | Background job queue for large or API-triggered tasks      |

### The Persistent Panels

These panels live below the tabs and are always accessible. You don't need to switch tabs to use
them.

**Model Management accordion** — Load and unload TTS models. This is where you go before you can
generate anything: find your engine, hit **Load**, and wait for the green status indicator. Each
engine has its own load button and status.

**Engine Selection accordion** — A dropdown to choose which engine handles your next generation. The
Engine Settings panel directly below it updates the moment you switch engines.

**Engine Settings** — The per-engine control panel. Changes here apply to the next generation. Most
settings have sensible defaults, so you rarely need to touch them.

**Audio Effects Studio** — Post-processing controls applied after generation: EQ, reverb, echo,
pitch shift, and master gain. Effects are off by default.

**🧭 Workspace Controls accordion** — Voice presets, autosave settings, and output storage options.

<!-- screenshot: Left column showing all accordion panels in their collapsed state with labels -->

### Don't Feel Overwhelmed

You only need three things for a first generation: a loaded model, text in the input box, and a
click of the **Generate** button. The rest is optional until you need it. Start small and explore
from there.

---

## 4. Single Speaker Generation

### Overview

The **📝 TEXT TO SYNTHESIZE** tab is your starting point for any single-voice generation —
narration, voice cloning, podcast snippets, or just trying a new engine. The workflow has five
steps: prepare your text, select and load an engine, choose a voice, click **Generate**, and save
your result.

<!-- screenshot: 📝 TEXT TO SYNTHESIZE tab with text in the input area and Generate button visible -->

### Step 1 — Prepare Your Text

Click the **📝 TEXT TO SYNTHESIZE** tab (it's usually selected by default when you open the app).

You'll see a large text input area. Type or paste whatever you want generated. A few practical tips:

- **Keep it under 500 characters for your first test.** Most engines handle longer text fine, but
  short passages let you evaluate quality quickly without waiting.
- **Punctuation matters.** Commas and periods translate directly into pauses. Write "Hello. How are
  you?" and you'll hear a natural break between those sentences.
- **Avoid heavy abbreviations in raw text.** "Dr. Smith left at 3pm on Jan 5th" will be read
  literally and may sound odd. Use **AI Script Polish** (see [Section 5](#5-ai-script-polish)) to
  expand these automatically.
- **Text length guidance:** Most engines produce best results under 1,000 characters per generation.
  Longer passages work but may occasionally stutter or lose quality near the end. For book-length
  content, use the [eBook to Audiobook](#7-ebook-to-audiobook) tab instead.

### Step 2 — Load Your Engine

Before you can generate, the engine needs to be loaded into GPU memory.

1. Scroll to the **Model Management** accordion and expand it.
2. Find the engine you want and click its **Load** button.
3. Wait for the green status badge — that's your signal it's ready.

<!-- screenshot: Model Management accordion showing Kokoro TTS with a Load button and status indicator -->

First-time loading for Chatterbox or Kokoro downloads a few hundred megabytes automatically. Fish
Speech requires a manual download first (see the Engine Reference).

### Step 3 — Select the Engine and Voice

1. Open the **Engine Selection** accordion.
2. Pick your engine from the dropdown.
3. The **Engine Settings** panel below updates immediately. Configure voice options if needed.

For **🗣️ Kokoro TTS**, a voice dropdown appears — pick any of the pre-built voices. For **🎤
ChatterboxTTS** and most cloning engines, you'll upload a short reference audio clip (5–30 seconds
of clean speech) to define the voice.

<!-- screenshot: Engine Selection accordion with Kokoro TTS selected, and Engine Settings panel showing the Voice dropdown -->

### Step 4 — Generate

Click **Generate**. A progress indicator appears in the right column while the engine processes your
text.

Generation time varies: Kokoro on modern hardware produces a few seconds of audio nearly instantly.
A longer passage with ChatterboxTTS on a mid-range GPU might take 15–30 seconds.

<!-- screenshot: Right column showing generation in progress and the audio player once complete -->

### Step 5 — Listen and Save

When generation completes, the audio player in the right column is available immediately. Press play
to review your result.

**Where files are saved:** Generated audio goes into the `outputs` folder, organized by date. You
don't need to do anything special — every generation is saved automatically.

**The seed number:** Below the audio player, you'll see a seed value. Copy this number if you want
to reproduce exactly the same result later. When you enter the same text, same engine settings, and
same seed, you'll get the same audio output. This is useful for fine-tuning your settings before
committing to a long narration run.

**Autosave and presets:** For recurring projects, the **🧭 Workspace Controls** accordion lets you
save your engine configuration as a named preset and control what gets saved automatically. Details
in Part 2 of this guide.

---

## 5. AI Script Polish

### What It Is — and Why It Matters

_AI Script Polish_ is a text preparation tool built into the **📝 TEXT TO SYNTHESIZE** tab. Before
your text reaches the TTS engine, an AI rewrites it so it sounds natural when spoken aloud.

In the UI, you'll find this feature inside the **Narration Transform** accordion inside the **📝
TEXT TO SYNTHESIZE** tab. Throughout this guide we use the name "AI Script Polish" to describe what
it does — when the documentation says "open AI Script Polish," you're opening that **Narration
Transform** accordion.

Here's why it matters. TTS engines are excellent at reading text, but raw text often contains things
that trip them up:

| Raw Text                             | How it sounds                                                   |
| ------------------------------------ | --------------------------------------------------------------- |
| "Dr. Smith left at 3pm on Jan 5th"   | "Doctor period Smith left at three PM on January fifth" (wrong) |
| "The API costs $0.002 per 1K tokens" | Read literally, sounds robotic                                  |
| "Call us at +1-800-555-0100"         | Numbers, hyphens, and punctuation collide strangely             |

AI Script Polish catches all of these and more — not just by expanding abbreviations, but by
restructuring sentences so they flow naturally when spoken.

> 💡 **Quick tip:** Even if you only use the **Minimal** mode, AI Script Polish will catch problems
> that would otherwise produce awkward audio. It takes seconds and is almost always worth enabling.

### Finding AI Script Polish

In the **📝 TEXT TO SYNTHESIZE** tab, look for the **Narration Transform** accordion below the text
input area. Click to expand it. This is your AI Script Polish panel.

<!-- screenshot: Narration Transform accordion expanded inside the TEXT TO SYNTHESIZE tab, showing provider and mode controls -->

### Setting Up an LLM Provider

AI Script Polish uses a language model (LLM) to understand and rewrite your text. You can choose
from local models (no API key, no data leaving your machine) or cloud providers (fast, powerful,
requires an API key).

| Provider                     | Type     | API Key Required? | Notes                                             |
| ---------------------------- | -------- | ----------------- | ------------------------------------------------- |
| **Ollama**                   | Local    | No                | Run locally with any Ollama-compatible model      |
| **LM Studio**                | Local    | No                | Full support for LM Studio auto-launch            |
| **vLLM OpenAI Server**       | Local    | No                | GPU inference server for maximum local throughput |
| **Custom OpenAI-compatible** | Flexible | Depends           | Point at any OpenAI API-compatible endpoint       |
| **GitHub Models**            | Cloud    | Yes (free tier)   | GITHUB_MODELS_TOKEN                               |
| **Google Gemini API**        | Cloud    | Yes (free tier)   | GOOGLE_API_KEY                                    |
| **Microsoft Foundry**        | Cloud    | Yes (enterprise)  | AZURE_AI_API_KEY                                  |

> ⚠️ **Privacy note:** If you choose a cloud provider (GitHub Models, Google Gemini, Microsoft
> Foundry), your text is sent to that provider's servers for processing. Your audio files and
> reference recordings are never sent anywhere — only the text you're preparing. If this matters to
> you, use a local provider like Ollama or LM Studio. Both run entirely on your hardware.

**Quick setup flow:**

1. Select your provider from the **Provider** dropdown.
2. Enter your API key (cloud providers only) and the model name you'd like to use.
3. Click **🔗 Test Connection** to confirm it's working. A green confirmation appears when the
   connection is live.

<!-- screenshot: Narration Transform panel showing provider dropdown, API key field, and Test Connection button -->

### The Three Transform Modes

Once connected, pick your mode based on your goals:

#### Minimal

The lightest touch. Minimal mode expands abbreviations, numbers, dates, and units — nothing more. No
creative rewrites, no style changes. Perfect for technical or factual text where you want the exact
meaning preserved.

> **Example — Minimal:** _Before:_ "Dr. Chen reviewed 3 files at 14:30 on Feb 12th, noting a $42.50
> charge." _After:_ "Doctor Chen reviewed three files at two thirty PM on February twelfth, noting a
> forty two dollar and fifty cent charge."

#### Polish

Everything Minimal does, plus natural phrasing improvements: smoothing out awkward sentence
structures, adding small connective phrases, and improving the rhythm of longer passages. Good for
podcasts, blog narration, and presentation scripts.

> **Example — Polish:** _Before:_ "The update fixed 3 bugs. Users reported issues. We patched them
> this week." _After:_ "The update fixed three bugs that users had reported, and we've patched all
> of them this week."

#### Vivid

Everything Polish does, plus dramatic pacing, emotional beats, and breathing cues designed for
cinematic narration. Vivid mode is opinionated — it adds pauses, emphasis, and rhythm. It's ideal
for audiobooks and storytelling, but may feel heavy-handed for dry or factual content.

> **Example — Vivid:** _Before:_ "She opened the door. There was no one inside." _After:_ "She
> opened the door... and stopped. The room was empty. Completely, utterly empty."

### Transform Styles

Beyond the three modes, a **Style** dropdown tailors the tone of the rewrite:

| Style                      | Best For                                             |
| -------------------------- | ---------------------------------------------------- |
| **Conversational**         | Casual narration, informal podcasts, friendly tone   |
| **Professional/Formal**    | Business content, corporate narration, presentations |
| **Storytelling/Cinematic** | Fiction, audiobooks, dramatic narration              |
| **Podcast/Casual**         | Podcast intros/outros, social media audio            |
| **Academic/Educational**   | Lectures, e-learning, tutorial narration             |

### The Full Workflow

1. Expand the **Narration Transform** accordion.
2. Select your **Provider** and connect (see above).
3. Type or paste your text in the main text area.
4. Choose your **Mode** (Minimal, Polish, or Vivid) and **Style**.
5. Click **Apply Transform**.
6. Review the transformed text — it replaces your original in the text area.
7. Make any manual tweaks you want.
8. Click **Generate** to produce speech from the polished text.

<!-- screenshot: Narration Transform accordion after Apply Transform showing the polished text in the text area -->

### Locale-Aware Transforms

The **Locale** setting tells the AI which regional English conventions to use. "Doctor" vs "Dr",
"colour" vs "color", date formats — these all differ by locale. Pick the option that matches your
intended audience. US English is the default.

---

## 6. Conversation Mode

### What It's For

**🎭 CONVERSATION MODE** is where multi-speaker dialogue comes alive. Instead of single voices
reading a single script, you can assign different engines and voices to different characters — each
speaking in their own distinct voice — and generate a full conversation as a seamless audio file.

This is the right tool for podcasts with multiple hosts, audiobook chapters with distinct
characters, training dialogues, or any content where more than one voice tells the story.

<!-- screenshot: 🎭 CONVERSATION MODE tab showing the script input area and character roster -->

### Script Format

Your script needs one line per spoken segment, with the speaker name followed by a colon:

```text
Alice: Have you tried the new studio yet?
Bob: I've been using it all week — the voice cloning is incredible.
Alice: Agreed. I cloned my own voice in about ten minutes.
```

Keep it simple: one `Speaker: Text` pair per line. Blank lines between segments are fine. The app
supports up to five distinct speakers in a single conversation.

### Step 1 — Paste Your Script

Click the **🎭 CONVERSATION MODE** tab and paste your dialogue into the script input area.

> **Don't have a script yet?** You can write free-form dialogue and let the **AI Format** button
> restructure it into the `Speaker: Text` format automatically. Just paste your raw dialogue and
> click **AI Format** — the connected LLM will parse speakers and reformat everything. (AI Format
> requires an LLM connection from the AI Script Polish setup. If you haven't connected one, see
> [Section 5](#5-ai-script-polish) first.)

### Step 2 — Analyze Script

Click **Analyze Script**. The app reads your dialogue and builds a character roster — one entry per
unique speaker name it detects. Each speaker gets their own row where you'll configure their voice.

<!-- screenshot: Character roster appearing after Analyze Script showing detected speakers with voice assignment controls -->

### Step 3 — Assign Voices to Speakers

For each speaker in the roster, choose which engine and voice they'll use. This is the creative
heart of Conversation Mode — you can mix engines freely. Speaker A might use ChatterboxTTS with a
cloned voice while Speaker B uses Kokoro with a built-in voice. The only rule is that both engines
must be loaded before you generate.

Voice assignment options differ by engine:

| Engine                                            | How You Assign a Voice                                                        |
| ------------------------------------------------- | ----------------------------------------------------------------------------- |
| **🗣️ Kokoro TTS**                                 | Pick from the built-in voice dropdown                                         |
| **🐱 KittenTTS**                                  | Pick from 8 built-in expressive voices                                        |
| **🎤 ChatterboxTTS / 🐟 Fish Speech / 🎤 VoxCPM** | Upload a reference audio file (5–30 sec), optionally add transcript           |
| **🎯 IndexTTS2**                                  | Upload reference audio + configure 8 emotion axes per speaker                 |
| **🎨🎭🗣️ Qwen (Design / Clone / Custom)**         | Depends on mode (see [Qwen section](#qwen-voice-design--clone--custom-voice)) |

<!-- screenshot: Character roster showing one speaker configured with Kokoro (voice dropdown) and another with ChatterboxTTS (reference audio upload) -->

### Step 4 — Refine Lines (Optional)

The **Line Editor** panel shows every line of your script in a table. You can:

- Edit the text of any individual line
- Reassign a line to a different speaker
- Apply **per-line AI Script Polish** to refine just that one line's phrasing

This is useful when one line in an otherwise good script needs a specific tweak — you don't have to
re-run the whole script transform.

<!-- screenshot: Line Editor panel showing individual dialogue lines with edit and transform options -->

### Step 5 — Set Timing Controls

Two sliders control the pacing of your generated conversation:

- **Speaker Change Pause** — the gap between lines from _different_ speakers. Default: 0.8 seconds.
  Range: -0.5 to 2.0 seconds. Increase this if conversations feel rushed; decrease for rapid-fire
  exchanges.
- **Same Speaker Pause** — the gap between consecutive lines from the _same_ speaker. Default: 0.3
  seconds. Range: -0.5 to 1.0 seconds.

Negative values can be used to overlap or trim silence between segments if you want an intentionally
tight, clipped editing style.

### Step 6 — Generate

Click **Generate Conversation**. The app processes each line sequentially, then combines them with
the pauses you set. Progress appears in the right column.

When complete, the full conversation plays in the audio player. All individual-line audio files are
also preserved so you can swap out a single line without regenerating everything.

> ⚠️ **Fish Speech volume reminder:** Fish Speech can generate audio that is significantly louder
> than other engines. If you're mixing Fish Speech speakers with others, start with your system
> volume at 50% and adjust from there.

<!-- screenshot: Right column showing completed conversation audio in the player with download button -->

---

## 7. eBook to Audiobook

### What It Does

The **📚 EBOOK TO AUDIOBOOK** tab converts written books into narrated audiobooks. You upload a
file, the app analyzes its chapter structure, and you choose which chapters to convert — all using
whichever TTS engine and voice you've already configured.

This is a batch operation. It splits your content into manageable chunks, generates each one, and
stitches the results together with timing gaps between sections.

<!-- screenshot: 📚 EBOOK TO AUDIOBOOK tab showing file upload area and chapter list after analysis -->

### Supported File Formats

| Format           | Notes                                      |
| ---------------- | ------------------------------------------ |
| `.epub`          | Best format — preserves chapter structure  |
| `.pdf`           | Text extraction quality varies by PDF type |
| `.txt`           | Plain text; chapters detected by structure |
| `.html` / `.htm` | Web page content                           |
| `.rtf`           | Rich text format                           |
| `.fb2`           | Popular e-reader format                    |
| `.odt`           | OpenDocument (LibreOffice/OpenOffice)      |

> 💡 **Tip:** If you have a choice of format, use `.epub`. It carries clean chapter metadata that
> lets the app split your book accurately without guessing at structure.

### The Workflow

-**1. Upload your file**

Drag your file onto the upload area, or click to browse. The app reads and analyzes the file
immediately.

-**2. Review chapters**

A list of detected chapters appears. Each one has a checkbox. Select the chapters you want to
convert — or use **Select All** to queue the entire book.

<!-- screenshot: Chapter selection list with checkboxes and Select All option -->

-**3. Choose your engine and format**

The engine and voice you've configured in **Engine Selection** and **Engine Settings** carries over
here. Make sure you've loaded the engine you want before clicking generate.

Choose your audio format: **WAV** for uncompressed quality (larger files), or **MP3** for smaller
files that work everywhere.

-**4. Configure chunking**

The **Text Chunk Length** slider (default: 500 characters, range: 300–800) controls how the app
breaks your text before sending it to the TTS engine. TTS engines work best on short, self-contained
passages — not paragraphs-at-a-time, and certainly not whole chapters at once.

Think of it like reading aloud: a voice actor doesn't try to breathe continuously for five minutes.
They take natural pauses. The chunking system does that automatically. Smaller chunks (300–400
characters) produce more consistent quality; larger chunks (700–800) are faster but may produce
occasional dips.

-**5. Set timing gaps**

- **Between chunks:** 0–3 seconds of silence between each text segment within a chapter. Default
  around 0.5 seconds.
- **Between chapters:** 0–5 seconds of silence when moving between chapters. Use 2–3 seconds for a
  natural chapter break feeling.

-**6. Generate**

Click **Generate Audiobook**. A progress indicator shows which chapter and chunk is active.

<!-- screenshot: Audiobook generation in progress showing chapter and chunk progress -->

### Output Handling

- Files under 50 MB or 30 minutes play directly in the interface when complete.
- Larger files are saved to the `audiobooks` folder and a download link appears in the right column.
  These can be transferred to any device or loaded into an audio editor.

---

## 8. VibeVoice

### What VibeVoice Is

**🎙️ VIBEVOICE** is a purpose-built podcast and dialogue generation system. Unlike Conversation Mode
— which coordinates multiple standard TTS engines — VibeVoice uses its own dedicated multi-speaker
models that are specifically trained for natural conversational dynamics between two or more voices.

If Conversation Mode is "assemble a cast from wherever you like," VibeVoice is "use a studio cast
that already knows how to talk to each other." The result can feel more cohesive for podcast-style
content, though it trades some individual voice customization for natural inter-speaker flow.

<!-- screenshot: 🎙️ VIBEVOICE tab showing model download section and script input area -->

### Step 1 — Download and Load a Model

VibeVoice uses its own models, separate from any other engines you've loaded. Two options are
available:

| Model               | Size      | Best For                                          |
| ------------------- | --------- | ------------------------------------------------- |
| **VibeVoice-1.5B**  | Compact   | Faster generation, lower GPU memory, good quality |
| **VibeVoice-Large** | Full size | Higher quality, more natural prosody, more VRAM   |

Inside the **🎙️ VIBEVOICE** tab, you'll find model download and load buttons. Click **Download** for
your chosen model (one-time), then **Load Model** before generating. An optional **Flash Attention**
toggle is available if your GPU supports it — this speeds up generation without affecting quality.

<!-- screenshot: VibeVoice tab showing model download, load button, and Flash Attention toggle -->

### Step 2 — Set Up Speakers

VibeVoice supports 1–4 speakers. Set the number of speakers, then for each one:

- Choose a built-in voice (selected from VibeVoice's built-in voice library), or
- Upload a custom voice sample — a clean 3–10 second recording that defines that speaker's voice
  characteristics.

Give each speaker a name if you want the output file to reference them correctly.

### Step 3 — Write or Paste Your Script

The script area accepts the same `Speaker: Text` format used in Conversation Mode. Type or paste
your podcast dialogue, with each line assigned to a named speaker.

### Step 4 — Generation Settings

- **CFG Scale** (0.1–3.0) — Controls how closely the output follows the voice characteristics.
  Higher values produce closer matches to the reference voice; lower values allow more variation.
  Default around 2.0 works well for most cases.
- **Seed** — Set a specific seed for reproducible output; use –1 or leave blank for random.
- **Audio Format** — WAV or MP3.

### Step 5 — Generate

Click **Generate Podcast**. Progress appears in the right column. The full multi-speaker audio file
plays in the player when complete.

### VibeVoice vs. Conversation Mode — When to Use Which

| Scenario                                        | Better Choice     |
| ----------------------------------------------- | ----------------- |
| Natural podcast feel with consistent dynamics   | VibeVoice         |
| Voice cloning specific real people              | Conversation Mode |
| Mixing multiple different TTS engines           | Conversation Mode |
| Emotion control per speaker                     | Conversation Mode |
| Fast batch dialogue with built-in voices        | Either, test both |
| Fiction with many distinct characters (up to 5) | Conversation Mode |

---

## 9. Engine Reference

This section covers every engine in the app — what it does well, when to choose it, and how to use
it. For a side-by-side comparison of all 14 engines, see [Feature Matrix](FEATURE_MATRIX.md).

> **Loading reminder:** Every engine must be loaded in **Model Management** before it can generate
> audio. Most engines need only a few seconds to load after the first download.

---

### 🎤 ChatterboxTTS

**What it does:** Clones a voice from a short reference recording. Give it 5–30 seconds of clean
speech, and ChatterboxTTS will generate new text in that voice with consistent tone and character.

**When to choose it:** You have reference audio of a specific voice and want to replicate it.
Personal narration projects, character voices, or building a personalized TTS workflow.

**Voice source:** Upload a reference audio file (WAV or MP3, 5–30 seconds, clean recording
recommended — minimal background noise, no music).

**Key settings:**

- **Exaggeration** — How expressive the voice is. Higher values add more dramatic range; lower
  values keep it flatter and more controlled. Start around 0.5.
- **Temperature** — Controls variation between generations. Lower = more consistent; higher = more
  natural variation between takes.
- **CFG Weight** — How closely the output tracks the voice characteristics of the reference.
- **Chunk Size** — How text is segmented internally. Default works for most use cases.

**Model management:** Auto-downloads on first load. No manual steps required.

---

### 🌍 Chatterbox Multilingual

**What it does:** Same core voice cloning as ChatterboxTTS, extended to support 23 languages. Clones
a voice from reference audio and generates speech in the target language — even if the reference
recording is in a different language.

**When to choose it:** You're producing content in multiple languages, or your audience is not
English-speaking, and you want the same voice throughout.

**Voice source:** Upload reference audio. The voice is cloned across language boundaries.

**Key settings:** All ChatterboxTTS settings plus:

- **Language** — Select the target language from the 23 supported options.
- **Repetition Penalty, Min P, Top P** — Advanced sampling controls for naturalness and variety.

**Model management:** Auto-downloads on first load.

---

### 🚀 Chatterbox Turbo

**What it does:** A speed-optimized variant of ChatterboxTTS. Trades some fine-grained quality for
significantly faster generation times. Ideal when you need fast iteration or batch processing.

**When to choose it:** You're running many generations and speed matters more than absolute quality,
or you're prototyping a project before committing to a longer run with standard ChatterboxTTS.

**Voice source:** Reference audio (same as ChatterboxTTS).

**Key settings:** Same as ChatterboxTTS (exaggeration, temperature, CFG weight) plus advanced
sampling controls (repetition penalty, min P, top P, chunk size).

**Model management:** Auto-downloads on first load.

---

### 🗣️ Kokoro TTS

**What it does:** Generates high-quality speech using a library of pre-built, pre-trained voices. No
reference audio required — pick a voice from the dropdown and go.

**When to choose it:** You want to get started immediately without preparing any reference audio.
Excellent quality for diverse voice styles (male, female, accents). Great for first tests and
regular narration where you don't need a specific person's voice.

**Voice source:** Built-in voice library. Voices are named and selectable from a dropdown (examples:
`af_heart`, `am_michael`, `bf_emma`). You can also load custom `.pt` voice files.

**Key settings:**

- **Voice** — The built-in voice to use.
- **Speed** — Speaking rate, from slow to fast. Default (1.0) is natural pace.

**Model management:** Auto-downloads on first load. Fast and lightweight compared to cloning
engines.

---

### Fish Speech

**What it does:** Produces highly natural speech with advanced prosody — the rhythm, intonation, and
emphasis that makes speech feel alive. Excellent quality for storytelling and narration with custom
voices.

**When to choose it:** You want top-tier natural quality with a custom voice and are willing to take
the extra setup step.

**Voice source:** Custom voices stored in the `custom_voices` folder. Fish Speech reads voice
profiles from there.

**Key settings:**

- **Temperature** — Variation and expressiveness.
- **Top P** — Sampling diversity.
- **Repetition Penalty** — Reduces repeated phrasing.
- **Max Tokens** — Maximum length per generation pass.

**Model management:** ⚠️ Fish Speech models require **manual download**. Find the download button
inside the **Model Management** accordion under the Fish Speech section. After downloading, load as
normal.

> ⚠️ **Volume warning:** Fish Speech frequently generates audio at higher volume than other engines.
> Keep your system volume around 50% when listening to first outputs, then adjust.

---

### 🎯 IndexTTS

**What it does:** Industrial-strength TTS focused on consistent, high-quality output. Reliable
across a range of content types with custom voice support.

**When to choose it:** You need dependable quality for production use — training content,
professional narration, or content where consistency from run to run matters.

**Voice source:** Custom voices (reference audio upload).

**Key settings:**

- **Temperature** — Generation variation.

**Model management:** Download and load from Model Management.

---

### 🎯 IndexTTS2

**What it does:** Extends IndexTTS with a unique 8-axis emotion control system, letting you shape
exactly how the speaker _feels_ while reading. Each axis is an independent slider.

**When to choose it:** You want precise emotional characterization in your narration — a character
who is joyful in one scene, melancholic in the next, and afraid in a crisis. Invaluable for
audiobooks and character-driven content.

**Voice source:** Reference audio upload. The emotion controls layer on top of the cloned voice.

**Emotion axes:**

| Axis        | What It Controls                       |
| ----------- | -------------------------------------- |
| Happy       | Lightness, warmth, brightness in voice |
| Angry       | Edge, intensity, clipped delivery      |
| Sad         | Slower pacing, lower energy            |
| Afraid      | Tension, higher pitch tendency         |
| Disgusted   | Distaste, flat affect                  |
| Melancholic | Wistful, distant quality               |
| Surprised   | Upward inflection, exclamatory energy  |
| Calm        | Smooth, measured, grounded delivery    |

Additional controls:

- **Emotion Mode** — Selects the overall emotion processing approach.
- **Emotion Alpha** — The overall weight given to emotion settings (how strongly they apply).
- **Temperature, Top P, Top K, Repetition Penalty** — Standard generation quality controls.
- **Max Mel Tokens** — Maximum audio sequence length.

**Model management:** Download and load from Model Management.

---

### 🎵 F5-TTS

**What it does:** A flow-matching TTS engine known for clean, smooth audio output. Produces natural
speech from reference audio with good prosody and minimal artifacting.

**When to choose it:** You want clean voice cloning output with adjustable speed, and you're
comfortable with a slightly longer generation time in exchange for smooth quality.

**Voice source:** Reference audio upload.

**Key settings:**

- **Speed** — Playback speed of generated audio.
- **Cross Fade** — Smoothing applied at the boundaries between generated segments.
- **Remove Silence** — Automatically trims silence from the output.

**Model management:** Download and load from Model Management.

---

### 🎙️ Higgs Audio

**What it does:** A multimodal TTS engine that supports voice presets and a system prompt — letting
you give the engine high-level instructions about how the voice should speak, not just what it
should say.

**When to choose it:** You want to guide the speaking style through a natural description, or you
want to work with preset voice profiles rather than uploading custom audio.

**Voice source:** Built-in voice presets (accessible via the Voice Preset dropdown in Engine
Settings).

**Key settings:**

- **Voice Preset** — Select from available preset voices.
- **System Prompt** — Optional instruction that shapes the delivery style (e.g., "Speak in a warm,
  welcoming tone appropriate for a children's audiobook").
- **Temperature, Top P, Top K, Max Tokens** — Standard generation controls.

**Model management:** Download and load from Model Management.

---

### 🎤 VoxCPM

**What it does:** A voice cloning engine with advanced generation controls including CFG
(classifier-free guidance), inference timesteps, and automatic bad-case retry — making it one of the
most configurable engines in the app.

**When to choose it:** You want fine-grained control over generation quality and consistency, and
you're comfortable experimenting with generation parameters.

**Voice source:** Reference audio upload, with optional Whisper transcription for better voice
matching.

**Key settings:**

- **CFG Value** — Guidance strength. Higher values stay closer to the reference voice.
- **Inference Timesteps** — Number of generation steps. More steps = better quality, slower speed.
- **Normalize** — Automatic audio level normalization.
- **Denoise** — Automatic denoising of output.
- **Retry Bad Cases** — Automatically retries if the output falls below a quality threshold.
- **Max Retry Times / Ratio Threshold** — Controls for the retry system.

**Model management:** Download and load from Model Management.

---

### 🐱 KittenTTS

**What it does:** An ultra-lightweight, fast TTS engine with 8 built-in expressive voices. No
reference audio required, no large model downloads.

**When to choose it:** You need quick generation with minimal setup. Great for prototyping, testing,
or use cases where speed matters more than maximum quality. Also useful on lower-end hardware where
heavier engines struggle.

**Voice source:** 8 built-in voices in four male/female pairs: `expr-voice-2-m`, `expr-voice-2-f`,
`expr-voice-3-m`, `expr-voice-3-f`, `expr-voice-4-m`, `expr-voice-4-f`, `expr-voice-5-m`,
`expr-voice-5-f`. Each has its own expressive character.

**Key settings:**

- **Voice** — Dropdown selector for the 8 built-in voices.

**Model management:** Download and load from Model Management. Small model size; fast initial
download.

---

### Qwen Voice Design / Clone / Custom Voice

Qwen appears as three engines in the UI, but they share the same underlying model — you just load it
once. Each mode is a different way of working with Qwen's voice generation capabilities.

#### 🎨 Qwen Voice Design

**What it does:** Creates a voice from a text description. Write what you want the voice to sound
like, and Qwen generates it.

**When to choose it:** You have a specific voice concept in mind but no reference recording — for
example, "a warm, authoritative male voice in the style of a documentary narrator."

**Key settings:**

- **Language** — Target language for generation.
- **Voice Description** — A free-text description of the voice characteristics you want.

#### 🎭 Qwen Voice Clone

**What it does:** Clones a voice from reference audio, similar to ChatterboxTTS and Fish Speech.

**Key settings:**

- **Language** — Target language.
- **Reference Text** — Transcript of the reference audio (recommended for best matching).
- **Model Size** — Choose between a faster or higher-quality model variant.
- **Chunk Size / Gap** — Controls for how audio is processed internally.

#### 🗣️ Qwen Custom Voice

**What it does:** Uses Qwen's built-in set of predefined speaker profiles — voices already trained
into the model that you can select and adjust.

**Key settings:**

- **Speaker Profile** — Select from the available built-in Qwen speakers.
- **Language** — Target language.
- **Style Instruction** — Optional text that adjusts the delivery style.
- **Model Size** — Faster vs. higher quality variant.

**Model management (all three Qwen modes):** Download and load a single Qwen model from the Model
Management accordion. All three modes become available once the model is loaded.

---

---

## 10. Audio Effects Studio

### What It Does

The **🎵 Audio Effects Studio** applies professional post-processing to your generated audio before
you hear it. Think of it as a lightweight mixing desk positioned between your TTS engine and your
ears: every generation passes through the chain automatically, and any effect you've switched on
shapes the result.

All effects default to off. The safe habit is to generate your first clip with everything disabled,
listen to the raw output, and then layer in effects once you know what the voice actually sounds
like on its own. A problem that sounds like bad reverb is usually just a bad reference clip —
effects can mask that, but they can't fix it.

> 💡 **Start with bypass.** Generate with all effects disabled first. Raw audio tells you whether a
> problem comes from the voice, the text, or the engine settings — before effects muddy the picture.

### Finding the Panel

Scroll below the Engine Settings panel in the left column to find the **🎵 Audio Effects Studio**
accordion. Click to expand it. The panel is divided into three groups: Volume & EQ Settings, Spatial
Effects, and Time-Based and Pitch Effects.

<!-- screenshot: 🎵 Audio Effects Studio accordion expanded, showing Master Gain slider, EQ checkbox, and the three effect groups -->

### Effect by Effect

#### 🎚️ Master Gain

**What it does:** Boosts or reduces the overall volume of your output, from −20 dB (very quiet) to
+20 dB (very loud). This is a simple amplitude adjustment — it doesn't change the voice character,
just the level.

**When to use it:** If your voice is consistently too quiet relative to background music you plan to
mix it with, or noticeably louder than other audio in your project, adjust here. Start with small
moves: ±3 dB is a surprisingly large perceptible change.

> ⚠️ **Volume warning for 🐟 Fish Speech:** Fish Speech models can be significantly louder than
> other engines at default settings. Keep your system volume around 50% on first playback and adjust
> from there.

#### 3-Band EQ

**What it does:** Boosts or cuts three frequency ranges — Bass (80–250 Hz), Mid (250–4,000 Hz), and
Treble (4,000+ Hz) — each independently adjustable from −12 dB to +12 dB. Enable the EQ with the
**Enable 3-Band EQ** checkbox; the three sliders appear once it's active.

**When to use it:**

- **Podcast:** A small bass boost (+2 to +3 dB) adds warmth. A gentle treble lift (+1 to +2 dB)
  improves intelligibility on earbuds.
- **Audiobook:** Keep the EQ flat or make very gentle adjustments. Listeners hear long stretches of
  audio in a session — dramatic EQ becomes fatiguing quickly.
- **Cinematic narration:** Reduce the mids slightly (−2 to −3 dB) and boost the low end for a
  broadcast-style weight.
- **Voice testing:** Leave everything at 0 and make no assumptions about the voice until you've
  heard it clean.

#### 🏛️ Reverb

**What it does:** Adds a sense of physical space around the voice — as if it were speaking in a room
rather than recorded in isolation. Enable with the **Enable Reverb** checkbox.

**Controls:**

| Control       | Range   | What It Does                                                                                          |
| ------------- | ------- | ----------------------------------------------------------------------------------------------------- |
| **Room Size** | 0.1–1.0 | How large the virtual space feels. 0.1 is a small vocal booth; 1.0 is a cathedral.                    |
| **Damping**   | 0.1–1.0 | How quickly the reverb tail fades. Higher values absorb the reverb faster, producing a tighter sound. |
| **Wet Mix**   | 0.1–0.8 | How much reverb blends with the dry signal. Keep this low (0.1–0.25) for natural depth.               |

**Recommended starting points:**

- **Podcast:** Room Size 0.2, Damping 0.8, Wet Mix 0.15 — barely perceptible, just enough to remove
  the "inside your head" quality of completely dry TTS.
- **Audiobook:** Off. Reverb adds listener fatigue over long sessions.
- **Cinematic narration:** Room Size 0.5, Damping 0.4, Wet Mix 0.3 — noticeable space that still
  keeps speech fully intelligible.

#### 🔊 Echo

**What it does:** Repeats the audio signal after a set delay, fading gradually. Enable with the
**Enable Echo** checkbox.

**Controls:**

- **Delay Time** (0.1–1.0 seconds) — How long after the original sound the echo appears.
- **Decay Amount** (0.1–0.9) — How loud the echo is relative to the original. Higher values produce
  more prominent, longer-lasting echoes.

**When to use it:** Echo is a creative effect best suited to atmospheric intros, trailer narration,
or stylized audio production. For spoken dialogue or narration you want listeners to follow closely,
keep Decay below 0.4 or leave echo off entirely — repeated words are surprisingly difficult to
parse.

#### 🎼 Pitch Shift

**What it does:** Shifts the entire voice up or down in semitones, from −12 (one octave lower) to
+12 (one octave higher). Enable with the **Enable Pitch Shift** checkbox.

**When to use it:** Useful when a cloned voice needs a small register adjustment to match a
character's expected pitch, or when you want to generate a variant voice from the same reference
audio without re-recording. Stay within ±3 semitones for natural-sounding results. Larger shifts
work for stylized or character voices where realism is secondary.

### Recommended Settings by Use Case

| Use Case                | Gain | EQ                        | Reverb         | Echo | Pitch |
| ----------------------- | ---- | ------------------------- | -------------- | ---- | ----- |
| **Podcast**             | 0 dB | Bass +2, Mid 0, Treble +1 | Rm 0.2, W 0.15 | Off  | 0     |
| **Audiobook**           | 0 dB | Off                       | Off            | Off  | 0     |
| **Cinematic narration** | 0 dB | Bass +3, Mid −2, Treble 0 | Rm 0.5, W 0.3  | Off  | 0     |
| **Voice testing**       | 0 dB | Off                       | Off            | Off  | 0     |

---

## 11. Workspace Controls

### What It Does

The **🧭 Workspace Controls** accordion keeps your workflow organized across sessions. It has two
jobs: voice presets (save and reload your engine configurations with one click) and autosave
settings (control how and where generated audio is stored). Find it in the lower section of the left
column.

<!-- screenshot: 🧭 Workspace Controls accordion expanded, showing the preset management panel on the left and autosave/storage panel on the right -->

### Voice Presets

A _preset_ is a saved snapshot of a speaker configuration: engine selection, voice settings, speaker
name, and optionally a reference audio file. Once saved, you can restore everything in one click
rather than re-entering settings at the start of every session.

#### Creating Your First Preset

1. Configure your engine and voice exactly the way you want it — engine selection, voice or
   reference audio, any custom settings.
2. Open **🧭 Workspace Controls**.
3. Type the character or speaker name into **🗣️ Speaker Name** (for example, `Elena` or `Narrator`).
4. Type a descriptive label into **🏷️ Preset Name** — something like `Elena_Warm` or
   `Narrator_Formal`. This is what you'll see in the dropdown later.
5. (Optional) Upload a reference audio file using **📎 Preset Audio File** if your engine uses voice
   cloning. Leave **📁 Copy audio into app_state/voices** checked to store the file inside the app's
   preset library so it's available in future sessions.
6. Click **💾 Save / Update Preset**.

A status message confirms the save. Your preset now appears in the **🎙️ Voice Preset** dropdown.

#### Loading, Updating, and Deleting Presets

**To load a preset:** Select it from the **🎙️ Voice Preset** dropdown and the engine settings update
automatically.

**To update a preset:** Adjust your settings, type the same preset name, and click **💾 Save /
Update Preset** again. The preset is overwritten with your new configuration.

**To delete a preset:** Select it from the dropdown and click **🗑️ Delete Preset**. Any reference
audio file stored for that preset is removed as well.

> 💡 Click **🔄 Refresh** if a freshly saved preset doesn't appear in the dropdown right away.

### Autosave

With autosave enabled, every generation is automatically saved to disk along with the text, engine
settings, and seed — so you never lose a good take even if you forget to write down what settings
produced it.

- **💾 Autosave project files** — Toggle autosave on or off for this session.
- **📚 Project Name** — Organizes saved files into named subfolders. Update this when you switch
  projects or chapters.
- **🧬 Keep structured autosave audio copy** — Saves a structured copy with full metadata: engine,
  seed, text hash. These bundles power the **🕘 HISTORY** tab.
- **Save backup copies to "outputs/" folder** — Also writes a flat copy to the `outputs/` folder.
  Optional convenience for direct file access.

Both options are enabled by default. If disk space is a concern, you can disable the backup copy
and rely on the structured autosave alone — it carries more information and takes the same space.
The structured autosave is what feeds the **🕘 HISTORY** tab; disabling it means past generations
won't appear there.

### Output Storage

- **📦 Generated Output Storage** — Choose **Project Folders (default)** to keep audio organized
  under named project subfolders, or **Custom Path** to redirect backup copies to any folder on your
  system (useful for writing directly to an external drive or a network share).
- **Path to "outputs/" folder** — When Custom Path mode is active, enter the full path to the
  folder where backup copies should land.

Click **💾 Apply Storage** to save your choice. Use **📂 Open Output Folder** and **🗂️ Open Autosave
Folder** to jump directly to your files in Windows Explorer without hunting through drive folders.

> 💡 **How the two storage locations relate:**
> Every generation with autosave enabled saves a structured bundle to `app_state_outputs/<project>/`.
> That bundle — with audio, text, settings, and seed — is what the **🕘 HISTORY** tab indexes and
> reloads from. The **Save backup copies to "outputs/" folder** checkbox writes an additional flat
> copy to `outputs/` for easy direct access. Loose WAV files placed manually in `outputs/` do not
> appear in History — only structured autosave bundles are indexed.

---

## 12. Model Manager

### Why You Load Models Manually

TTS models are large — typically 0.5 to 8 gigabytes each — and running them means holding that data
in GPU memory. If Ultimate TTS Studio loaded every installed engine at startup, your GPU memory
would be completely consumed before you generated a single word.

Instead, you load the engine you need and unload it when you're done. Think of it like opening and
closing apps: a few well-chosen applications open at once works beautifully; two dozen apps running
simultaneously does not.

### Finding the Model Manager

The **🧩 Model Manager** accordion sits at the top of the left column, above the main tabs. Click to
expand it. Inside, each engine has its own sub-accordion that shows the engine's current status and
provides **📥 Download**, **🚀 Load**, and **🗑️ Unload** controls.

<!-- screenshot: 🧩 Model Manager accordion expanded, showing individual engine sub-accordions with status indicators and load/unload buttons -->

### Loading a Model

1. Open **🧩 Model Manager** and expand the sub-accordion for your engine.
2. **First-time users:** If the model hasn't been downloaded yet, click **📥 Download Model** first.
   You'll see a progress message while the files transfer. This only needs to happen once.
3. Click **🚀 Load Model**. The status indicator updates when the model is live in GPU memory and
   ready to generate.

**What to expect by engine:**

- **🎤 ChatterboxTTS and 🗣️ Kokoro TTS** — Auto-download on first load. Subsequent loads take a few
  seconds from disk.
- **🐟 Fish Speech** — Requires a separate manual download step before the Load button works. Follow
  the on-screen instructions in the Fish Speech sub-accordion; the model files are fetched from
  Hugging Face.
- **🎯 IndexTTS2, 🎙️ Higgs Audio, 🎤 VoxCPM** — Larger models that may take 15–90 seconds to load
  depending on your GPU and drive speed.

### Status Indicators

Each sub-accordion shows the engine's current state clearly. When a model is loaded and ready,
you'll see a loaded indicator in the status area. If a load fails — most commonly because your GPU
doesn't have enough free memory — an error message explains what happened. Nothing fails silently.

### Managing GPU Memory

Running multiple large models at the same time can exhaust your VRAM and cause errors or severely
degraded performance.

**Best practice:** Unload engines you're not actively using. A practical rhythm for most projects:

1. Load the engine you need.
2. Generate your audio.
3. Unload before switching to a different heavy engine.

> 💡 **Lightweight pairs:** You can keep two lightweight models loaded at once without issue — for
> example, 🗣️ Kokoro TTS and 🐱 KittenTTS together. Avoid keeping two large models (🎤 ChatterboxTTS
> and 🐟 Fish Speech, for example) simultaneously loaded unless you have 16+ GB of VRAM to spare.

### Disk Space

Downloaded model files live in the `checkpoints/` folder. Don't delete files manually — use the
app's download workflow to ensure correct versions and folder structure are maintained.

---

## 13. Assistant

### What It Is

The **🤖 ASSISTANT** tab gives you an AI chatbot built into the app. Ask it questions about engine
settings, voice cloning workflows, troubleshooting steps, or anything else you're unsure about — and
get answers without leaving the interface and opening a browser search.

The Assistant is **completely separate from AI Script Polish**. AI Script Polish (labeled "Narration
Transform" in the UI) prepares your text before synthesis. The Assistant is a conversational helper
for using the app. They share no settings and no data — they just happen to live in the same
interface.

<!-- screenshot: 🤖 ASSISTANT tab with the chat display visible and the message input field at the bottom -->

### Using the Assistant

1. Click the **🤖 ASSISTANT** tab.
2. Type your question in the **Message** input field.
3. Click **📤 Send**.
4. The response appears in the chat display above.

Use **🗑️ Clear Chat** to start a fresh conversation at any time.

**Questions the Assistant handles well:**

- "Which engine should I use for cloning a voice with a strong regional accent?"
- "My reference audio is only 8 seconds — is that long enough?"
- "How do I set up Ollama as my AI Script Polish provider?"
- "Why does my Fish Speech output sound so much louder than Kokoro?"

### Configuring the Assistant's LLM

The Assistant requires a language model connection to respond. Open the **⚙️ Assistant LLM
Settings** accordion inside the **🤖 ASSISTANT** tab to configure it.

| Setting              | What It Does                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| **🔌 LLM Provider**  | Which AI backend the Assistant uses — same provider options as AI Script Polish, but independently configured |
| **🌐 Base URL**      | API endpoint for local providers like LM Studio or Ollama                                                     |
| **🔑 API Key**       | Required for cloud providers. Session-only — not saved to disk                                                |
| **🧠 Model**         | The specific model ID to use with your chosen provider                                                        |
| **📝 System Prompt** | Optional instructions that shape how the Assistant responds                                                   |

Click **🔗 Test Connection** to confirm your settings are working before you start a conversation.
Click **💾 Save Settings** to persist the provider, base URL, and model choices between sessions.
(API keys are never saved for security — enter them fresh each session.)

> 💡 **A practical pairing:** Use a fast, lightweight local model (Ollama with a small model) for
> the Assistant — good enough for quick questions — and a more powerful model for AI Script Polish,
> where text quality directly affects how the audio sounds.

---

## 14. History

### What the History Tab Is For

The **🕘 HISTORY** tab is a searchable log of every generation saved through autosave. Instead of
hunting through file folders, you can browse past clips by project, engine, voice, or timestamp —
and reload any of them back into the **📝 TEXT TO SYNTHESIZE** tab with one click.

> 💡 **History only tracks autosave bundles.** A bundle is created each time you generate with
> **Autosave** enabled in **🧭 Workspace Controls**. Loose audio files placed manually in `outputs/`
> are not indexed here.

<!-- screenshot: 🕘 HISTORY tab showing the Persisted Output Bundles table and search box -->

### Reading the History Table

Each row in the **Persisted Output Bundles** table represents one saved generation:

| Column               | What It Shows                                                     |
| -------------------- | ----------------------------------------------------------------- |
| **ID**               | Numeric record — enter this in the Record ID field to select it   |
| **Project**          | The project name set at generation time                           |
| **Preset**           | The voice preset active when the generation ran                   |
| **Timestamp**        | When the clip was created                                         |
| **Engine**           | Which TTS engine produced the audio                               |
| **Voice / Narrator** | The speaker name or voice identifier                              |
| **Audio Length**     | Duration of the generated clip                                    |
| **Seed**             | The seed used — reuse this to reproduce the exact same result     |

### Controls

- **Search History** — Filter rows by project, preset, engine, voice, or timestamp. Press Enter to apply.
- **🔄 Refresh** — Reloads the table from the index. Use after generating new clips.
- **🧭 Reindex Autosaves** — Scans `app_state_outputs/` and adds any bundles not yet in the index.
  Useful after restoring files from backup.
- **History Record ID** — Type a numeric ID from the table to select a specific record.
- **↩ Reload Into Text Tab** — Restores the selected bundle's full settings into the **📝 TEXT TO SYNTHESIZE** tab.

<!-- screenshot: 🕘 HISTORY tab with a record selected, the detail panel visible, and the audio preview active -->

### What Reloading Restores

Reloading a history record fills the Text tab with a complete production snapshot:

- The original source **text**
- **Engine** selection and **audio format**
- All **engine control settings** (voice, sliders, modes)
- **AI Script Polish** settings (transform mode, style, provider, model — but not API keys)
- **Audio Effects Studio** settings
- **Speaker label**, **preset**, **project name**, and autosave options
- The **last seed**

If the original reference audio file no longer exists at its saved path, the app automatically falls
back to the reference audio stored in the associated voice preset — so voice cloning sessions can
often resume correctly even when project files have moved.

> ⚠️ **Audio preview with custom output paths:** If you changed to a brand-new custom output folder
> mid-session, previewing clips from the old location requires restarting the app. After a restart,
> the new path is registered and previews work normally.

---

## 15. Jobs

### What This Tab Is For

The **📋 JOBS** tab monitors synthesis jobs submitted through the MCP integration — the developer
API layer of Ultimate TTS Studio. If you're using the app through the browser interface, you'll
rarely need this tab. It becomes useful when you're running TTS Studio programmatically from a
coding agent or automation script.

> 💡 **Casual users:** You can safely ignore this tab for day-to-day work. Everything you generate
> through the normal interface completes immediately and appears in the output panel on the right —
> no job queue involved.

<!-- screenshot: 📋 JOBS tab showing the job queue table with columns for ID, Status, Engine, Created, Elapsed, Text Preview -->

### Reading the Job Queue

The **🔄 Active & Recent Jobs** table shows submitted jobs with six columns:

| Column           | What It Shows                                                      |
| ---------------- | ------------------------------------------------------------------ |
| **ID**           | Unique identifier — use this to cancel or retry the job            |
| **Status**       | Current state: queued, processing, completed, failed, or cancelled |
| **Engine**       | Which TTS engine is handling (or handled) the job                  |
| **Created**      | When the job was submitted                                         |
| **Elapsed**      | How long the job has been running, or how long it took to complete |
| **Text Preview** | A short excerpt of the text being synthesized                      |

### Controls

- **🔄 Refresh** — Updates the table with the latest job statuses.
- **Auto-refresh (every 3s)** — Enable this to keep the table updating automatically while
  monitoring a batch run. Disable it when you're done to reduce background activity.
- **Job ID field** — Enter a full or partial job ID to target a specific job.
- **❌ Cancel Job** — Stops a queued or in-progress job.
- **🔁 Retry Job** — Resubmits a failed job using the original parameters.

---

## 16. MCP Integration

> **This section is for developers.** If you're using Ultimate TTS Studio through the browser
> interface, you don't need MCP — skip ahead to [Troubleshooting](#17-troubleshooting). Everything
> you need for normal use is already covered in the sections above.

### What MCP Is

_MCP_ stands for _Model Context Protocol_ — an open standard that lets AI coding agents (like GitHub
Copilot, Cursor, or Claude Code) discover and call external tools programmatically. The MCP
integration in Ultimate TTS Studio means a coding agent can generate speech, manage voices, and
submit synthesis jobs directly from your code editor, without you switching to the browser
interface.

In practical terms: if you're building an application that needs a voice, you can have your AI
assistant call TTS Studio as a tool and get the audio file back — automatically, in a loop, as part
of a larger workflow.

### Available Tools (13)

`list_engines` · `get_engine_info` · `list_voices` · `list_outputs` · `get_app_version` ·
`normalize_text` · `list_llm_providers` · `transform_text` · `structure_conversation` · `synthesize`
· `submit_synthesis_job` · `get_job_status` · `cancel_job`

### Installing and Starting the MCP Sidecar

The MCP server runs as a separate process alongside the main TTS Studio app. In Pinokio, you'll find
separate **Install MCP** and **Start MCP** menu items. Install once, then start the MCP sidecar
alongside TTS Studio whenever you need programmatic access.

For complete developer documentation — connection details, tool schemas, authentication, and
request/response formats — see [app/README.md](../app/README.md).

---

## 17. Troubleshooting

Most problems in Ultimate TTS Studio fall into a small set of categories. Start here before diving
deeper.

### Common Issues and Solutions

| Problem                            | Likely Cause                                    | What to Try                                                                                                                   |
| ---------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Model won't load**               | Insufficient VRAM; another model already loaded | Unload other models first; confirm your GPU has at least 4 GB of free VRAM                                                    |
| **Generation is very slow**        | Model not running on GPU                        | Confirm the engine shows "loaded" in 🧩 Model Manager; close GPU-heavy applications (games, other AI tools) running alongside |
| **Out of memory error**            | Too many models loaded simultaneously           | Unload unused engines; start each session with only the model you need                                                        |
| **Audio is too loud**              | Engine output level; no gain reduction applied  | Add a small negative Master Gain (−3 to −6 dB) in 🎵 Audio Effects Studio; particularly relevant for 🐟 Fish Speech           |
| **Audio is too quiet**             | Low engine output level                         | Add a small positive Master Gain (+3 to +6 dB) in 🎵 Audio Effects Studio                                                     |
| **App won't start**                | Port conflict; Pinokio startup issue            | Check Pinokio logs; restart Pinokio; verify no other application is occupying the same port                                   |
| **Fish Speech models not found**   | Manual download not yet completed               | Open 🧩 Model Manager, expand the Fish Speech sub-accordion, and follow the download instructions                             |
| **Cloned voice sounds wrong**      | Reference audio quality                         | See the reference audio tips below                                                                                            |
| **AI Script Polish won't connect** | Provider settings; API key issue                | Verify your provider, Base URL, API key, and model name are all correct; click 🔗 Test Connection for a live check            |
| **Gradio shows a blank page**      | App still loading                               | Wait 20–30 seconds and refresh the browser tab; check Pinokio for the startup status                                          |

### Reference Audio Tips for Better Voice Cloning

The quality of your reference audio is the single biggest factor in how well a cloned voice turns
out. Great reference clips produce excellent clones; poor ones have a ceiling no engine can
overcome.

**What makes a good reference clip:**

- **Length:** 10–30 seconds. Less than 5 seconds captures too little voice character to clone
  reliably. More than 60 seconds doesn't improve results.
- **Content:** Natural conversational speech at an even pace. Avoid singing, whispering, shouting,
  or speech with exaggerated emotion — these don't represent the normal speaking voice.
- **Background noise:** As clean as possible. Hiss, hum, reverb, and background music transfer
  directly into the cloned voice. Record in a quiet room or use a clean existing recording.
- **Format:** WAV at 22 kHz or 44 kHz is ideal. MP3 files work but may introduce subtle artifacts
  from compression.
- **Consistency:** A single speaker throughout, speaking in the style and register you want to
  clone.

> ⚠️ **Voice cloning notice:** Only clone voices you have permission to use. Cloning someone's voice
> without consent or proper authorization may violate privacy laws in your jurisdiction. Generated
> content using cloned voices is your responsibility.

### Checking Logs

If something goes wrong and the UI doesn't explain what happened, check the logs. In Pinokio, select
Ultimate TTS Studio and look for the **Logs** option — it shows the full console output from the
running app and typically contains the exact error message explaining what failed. Logs are the
fastest path to understanding an obscure problem.

---

## 18. Keyboard Shortcuts & Tips

### Quick Generation Workflow

The fastest path from text to audio in a session:

1. Load your engine once at the start — you don't need to reload between generations unless you
   switch engines.
2. Type or paste your text into **📝 TEXT TO SYNTHESIZE**.
3. Click **Generate**.
4. If the result is close but not quite right, adjust one setting and regenerate. Use the same seed
   to isolate what changed.

> 💡 **One variable at a time.** When fine-tuning a voice, change only one setting per generation —
> temperature, reference clip, or text. Changing multiple things at once makes it impossible to know
> what actually improved the result.

### Preset Save/Load Cycle

Save a preset whenever you settle on a configuration you plan to use again:

1. Dial in your engine, voice, and settings.
2. Open **🧭 Workspace Controls** → type a Speaker Name and Preset Name → click **💾 Save / Update
   Preset**.
3. Next session: open the **🎙️ Voice Preset** dropdown and select your preset. Your full
   configuration restores in seconds.

### Side-by-Side Engine Comparison

Want to hear how two different engines handle the same text?

1. Type a representative passage in **📝 TEXT TO SYNTHESIZE**.
2. Load Engine A, click **Generate**, note the seed shown in the output panel.
3. Note the filename of the output in the `outputs/` folder.
4. Load Engine B (unload Engine A first if VRAM is limited), generate the same text.
5. Compare the two files. They'll be timestamped in sequence, making them easy to find side by side.

### Power User Tips

- **Fix your seed while iterating.** Once you hear a generation you like, copy the seed from the
  output panel. Enter that seed manually for your next generation while you adjust other settings —
  this isolates what each change actually does to the voice.
- **Two-pass AI Script Polish.** Apply Minimal mode first and review the result. Once the text reads
  cleanly, switch to Polish or Vivid for style. This catches technical expansion issues and style
  decisions in separate passes.
- **Conversation Mode script format.** Use `SPEAKER_NAME: dialogue line` formatting in your script
  and the **Analyze Script** button auto-populates the character roster for you. Saves significant
  time on longer dialogue scenes.
- **Project naming before long runs.** Before any eBook conversion or batch generation, set a
  meaningful Project Name in **🧭 Workspace Controls**. Every file saves under that name, making
  chapter management and output organization much easier.
- **Autosave metadata is searchable.** The structured autosave copies include a metadata JSON file
  with the engine, seed, and text hash used for each generation. If you need to reproduce a result
  from a previous session, that file has everything you need.

---

## 19. Glossary

**TTS (Text-to-Speech)** The technology that converts written text into spoken audio. Ultimate TTS
Studio uses 14 different TTS systems, each with distinct strengths, voice characteristics, and
hardware requirements.

**Engine** In this app, "engine" refers to one of the 14 TTS systems — ChatterboxTTS, Kokoro, Fish
Speech, IndexTTS2, and so on. Each engine is a separate AI model with its own approach to generating
speech. Choosing the right engine is one of the most important decisions in any project.

**Voice cloning** The process of using a short recording of someone's speech to teach an engine what
that person's voice sounds like, then generating new speech in that voice. Cloning-capable engines
in this app include 🎤 ChatterboxTTS, 🌍 Chatterbox Multilingual, 🚀 Chatterbox Turbo, 🐟 Fish
Speech, 🎤 VoxCPM, 🎵 F5-TTS, and 🎭 Qwen Voice Clone.

**Reference audio** A short audio recording used as the voice model for voice cloning. Typically
10–30 seconds of clean, natural speech. The quality of the reference recording directly determines
how well the cloned voice sounds.

**AI Script Polish** The text preparation feature that rewrites your script before synthesis so it
reads naturally when spoken aloud. In the UI, this feature is inside the **Narration Transform**
accordion. Throughout this guide, "AI Script Polish" describes what it does; when the guide says to
open AI Script Polish, you're opening that **Narration Transform** accordion.

**Transform mode** One of three levels of rewriting within AI Script Polish: **Minimal** (expand
abbreviations, numbers, and dates only), **Polish** (light phrasing and rhythm improvements), or
**Vivid** (dramatic pacing, emotional beats, and breathing cues for storytelling). See
[Section 5](#5-ai-script-polish) for full examples.

**LLM (Large Language Model)** The AI that powers AI Script Polish and the Assistant. A language
model reads and transforms text. You choose which one to connect to: local providers (Ollama, LM
Studio — no data leaves your machine) or cloud providers (GitHub Models, Google Gemini, Microsoft
Foundry — text is sent to external servers for processing).

**GPU / VRAM** The GPU (Graphics Processing Unit) is the hardware that runs TTS models at practical
speeds. VRAM (Video RAM) is the GPU's dedicated memory. Most TTS engines need their model data
loaded into VRAM before they can generate audio — which is why the Model Manager exists. More VRAM
means you can run larger, higher-quality models.

**Model** The data file (or set of files) that an engine needs to generate speech. Models are
downloaded once and stored on disk. "Loading a model" means copying its data from disk into GPU
memory so the engine can use it for generation. "Unloading" removes it from GPU memory to free VRAM
for other engines.

**Preset** A saved voice configuration — engine selection, voice settings, speaker name, and
optionally a reference audio file — stored in the app so you can restore everything in one click in
future sessions. Managed in the **🧭 Workspace Controls** accordion.

**MCP (Model Context Protocol)** An open standard that allows AI coding agents and automation tools
to discover and call tools programmatically. TTS Studio's MCP integration lets developer tools like
GitHub Copilot or custom scripts trigger speech generation without using the browser interface. See
[Section 16](#16-mcp-integration).

**Conversation Mode** The multi-speaker generation mode in the **🎭 CONVERSATION MODE** tab. Paste a
dialogue script, assign a different voice to each character, and generate the whole scene as a
single audio file with natural speaker transitions. See [Section 6](#6-conversation-mode).

**Character roster** The list of speakers in a Conversation Mode project. Each character in the
roster has their own name, voice engine, and settings configured independently — so each speaker in
a scene can sound completely different.

**Audio effects chain** The sequence of post-processing effects in the **🎵 Audio Effects Studio**:
Master Gain → 3-Band EQ → Reverb → Echo → Pitch Shift. Effects apply in order, and only effects with
their checkbox enabled are active. See [Section 10](#10-audio-effects-studio).

**Bypass (effects)** Having all effects in the Audio Effects Studio disabled, so audio passes
through unmodified. Listening to raw, unprocessed audio first is good practice before enabling
effects — it lets you hear the voice's natural character and identify whether any issues come from
the generation itself rather than the processing chain.

**Seed** A number that controls the randomness used during audio generation. Using the same seed
with the same text and same settings reproduces the same audio output — useful for fine-tuning a
voice or making minor text edits while keeping the character of the generation consistent.

**Chunk** In the **📚 EBOOK TO AUDIOBOOK** tab, a chunk is a portion of text sent to the TTS engine
in a single generation pass. The Chunk Size setting (300–800 characters) controls how the text is
divided. Smaller chunks process faster and can be regenerated individually if one goes wrong; larger
chunks can produce more natural prosody across sentences.

**VibeVoice** The dedicated multi-speaker podcast generation system in the **🎙️ VIBEVOICE** tab,
powered by its own separate models (VibeVoice-1.5B compact or VibeVoice-Large). Designed for natural
multi-speaker audio where speakers feel distinct and conversation flows without awkward transitions.
See [Section 8](#8-vibevoice).

**Gradio** The open-source Python framework that renders the Ultimate TTS Studio interface. You may
notice "Gradio" or the port number in your browser's address bar — Gradio is the system that draws
the controls, sliders, and audio players you interact with. It runs entirely on your local computer
and serves the interface over localhost; nothing about the interface itself communicates externally.

---

Ultimate TTS Studio SUP3R Edition — Documentation Suite v1.0
