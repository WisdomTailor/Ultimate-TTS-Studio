# 📖 AI Script Polish — Complete User Guide & Strategic Plan

> **Ultimate TTS Studio — Narration Transform Panel**
>
> This guide covers every feature of the panel currently called "Narration Transform (LLM),"
> explains what each setting does and why, and presents the strategic roadmap for making this
> section world-class for both beginners and power users.

---

## 📋 Table of Contents

1. [Executive Summary](#1--executive-summary)
2. Panel Rename Recommendation
3. Complete Field-by-Field Guide
4. [How Transform Mode Works](#4--how-transform-mode-works)
5. [How Style Influences Output](#5--how-style-influences-output)
6. [Single Speaker vs Conversation Mode](#6--single-speaker-vs-conversation-mode)
7. [Conversation Mode — AI Format Workflow](#7--conversation-mode--ai-format-workflow)
8. [In-App Assistant Plan](#8--in-app-assistant-plan)
9. [Tools, MCPs, and Skills](#9--tools-mcps-and-skills)
10. [Implementation Priority Roadmap](#10--implementation-priority-roadmap)
11. [Frequently Asked Questions](#11--frequently-asked-questions)

---

## 1. 🎯 Executive Summary

### What Is This Panel?

The Narration Transform panel is an AI-powered text preparation system. Before your text is spoken
aloud by a TTS engine (like ElevenLabs, F5-TTS, or Chatterbox), this panel gives you the option to
have an AI rewrite, clean up, or enhance your text so it sounds better when read aloud.

Think of it like a **professional audio engineer who reads your script before recording** — they fix
abbreviations that would confuse the voice actor, adjust pacing for dramatic effect, and ensure
numbers and dates are written out in a way that sounds right.

### Why It Matters

Raw text often sounds unnatural when spoken by a TTS engine:

- "Dr. Smith arrived at 14:30 on 2024-01-15 and paid $100.50" sounds robotic
- "Doctor Smith arrived at two thirty PM on January fifteenth and paid one hundred dollars and fifty
  cents" sounds human

The difference between a bad audiobook and an excellent one is often **not the voice** — it's how
well the text was prepared for speech.

### Who Should Use It

- **Everyone** — even the Minimal mode fixes things that would sound wrong
- **Audiobook creators** — use Vivid mode with cinematic style for immersive narration
- **Content creators** — use Polish mode with conversational or podcast style
- **Developers** — use the API to automate text preparation in batch workflows

---

## 2. 🏷️ Panel Rename Recommendation

### Current Name: "Narration Transform (LLM)"

**Problem:** "LLM" means nothing to most users. "Transform" is vague. This name tells you nothing
about what the panel actually does.

### Council Recommendation

| Rank | Proposed Name        | Why It Works                                                                                                         |
| ---- | -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 1    | **AI Script Polish** | Clear, approachable. "Polish" implies improvement. "AI" signals intelligence. "Script" connects to audio production. |
| 2    | **Smart Narration**  | Warm and friendly. "Smart" implies it figures things out for you.                                                    |
| 3    | **Speech Optimizer** | Functional and accurate, but slightly more technical.                                                                |

**Our recommendation: AI Script Polish.**

It immediately communicates the purpose: _"An AI that polishes your script so it sounds better when
spoken aloud."_

> **Architecture Note (April 2026):** "AI Script Polish" is the right label for the current
> single-action feature. As the panel grows to include conversation structuring, normalization
> pipelines, and casting, the broader product area should be named **Script Prep**, with AI Script
> Polish as one action within it. This rename is deferred until conversation mode enhancement ships.

---

## 3. ⚙️ Complete Field-by-Field Guide

### 🔌 LLM Provider

**What it is:** The AI service that will process your text. Think of it as choosing which "brain"
does the thinking.

**Available providers:**

| Provider                     | Type     | API Key Needed?             | Best For                          |
| ---------------------------- | -------- | --------------------------- | --------------------------------- |
| **Custom OpenAI-compatible** | Flexible | Depends                     | Advanced users with custom setups |
| **GitHub Models**            | ☁️ Cloud | Yes (`GITHUB_MODELS_TOKEN`) | Free tier with many model options |
| **Google Gemini API**        | ☁️ Cloud | Yes (`GOOGLE_API_KEY`)      | High quality, generous free tier  |
| **LM Studio**                | 💻 Local | No                          | Privacy-first, runs on your PC    |
| **Microsoft Foundry**        | ☁️ Cloud | Yes (`AZURE_AI_API_KEY`)    | Enterprise, Azure integration     |
| **Ollama**                   | 💻 Local | No                          | Open source, runs on your PC      |
| **vLLM OpenAI Server**       | 💻 Local | No                          | High-performance GPU inference    |

**Local vs Cloud:**

- **Local providers** (LM Studio, Ollama, vLLM) run on your computer. Your text never leaves your
  machine. Requires a decent GPU. No API key needed.
- **Cloud providers** (Gemini, GitHub Models, Foundry) send your text to a remote server. Faster and
  often higher quality, but requires an internet connection and an API key.

**Special feature — LM Studio Auto-Start:** When you select LM Studio, the app automatically tries
to launch it on your PC. If LM Studio is installed, it starts up and the model list populates
automatically.

**Dynamic Model Discovery:** When you select any provider, the app contacts that provider's API to
fetch the list of models actually available to you — no more guessing which model names are valid.

---

### 🤖 Model ID

**What it is:** Within each provider, there are multiple AI models — different sizes with different
capabilities. This dropdown lets you choose which specific model processes your text.

**How models differ:**

| Factor    | Smaller Models (7B–8B)  | Larger Models (30B+, GPT-4o) |
| --------- | ----------------------- | ---------------------------- |
| Speed     | ⚡ Fast (seconds)       | 🐢 Slower (10–30 seconds)    |
| Quality   | Good for Polish mode    | Excellent for Vivid mode     |
| Cost      | Free/cheap              | May cost per request         |
| Resources | Runs on modest hardware | Needs powerful GPU or cloud  |

**The 🔄 Refresh button:** Click it to re-fetch the current list of models from your provider.
Useful when you load a new model in LM Studio or when available models change.

**How to choose:** Start with the default model. If quality isn't good enough, try a larger model.
If it's too slow, try a smaller one.

---

### 🌐 Base URL

**What it is:** The web address where the AI service is running. Think of it like a phone number for
the AI.

**For most users:** Leave this alone. It's auto-populated when you choose a provider.

**When to change it:** Only if you're running a custom server on a non-standard port, or you have a
private deployment of an AI model.

---

### 🔑 API Key

**What it is:** A password that proves you're authorized to use a cloud AI service. Free to obtain
from each provider's website.

**Which providers need one:**

| Provider          | Environment Variable  | Where to Get It                                                |
| ----------------- | --------------------- | -------------------------------------------------------------- |
| Google Gemini     | `GOOGLE_API_KEY`      | [Google AI Studio](https://aistudio.google.com/apikey)         |
| GitHub Models     | `GITHUB_MODELS_TOKEN` | [GitHub Settings → Tokens](https://github.com/settings/tokens) |
| Microsoft Foundry | `AZURE_AI_API_KEY`    | Azure Portal → AI Foundry → Project → Keys                     |

**Persistence:** API keys entered in the UI are now saved to your settings file and persist across
sessions. You can also set them as environment variables (e.g., in Pinokio's environment config) for
added security.

**Security:** The API key field is masked (password-style) in the UI. Keys are never logged or
displayed in output.

> **Security Note:** File-based persistence is convenient but stores keys in plain text. For
> stronger security, set API keys as **environment variables** (e.g., in Pinokio's ENVIRONMENT file
> or your system shell profile) rather than entering them in the UI. OS-backed credential storage
> (keyring integration) is on the long-term roadmap.

---

### 🎚️ Transform Mode

This is the most important setting. It controls **how aggressively** the AI rewrites your text.

#### Minimal (Currently: STRICT)

**Purpose:** Fix only things that would sound wrong when spoken. Leave everything else untouched.

**What it does:**

- Expands abbreviations: "Dr." → "Doctor", "Mr." → "Mister"
- Spells out numbers: "$100.50" → "one hundred dollars and fifty cents"
- Converts dates: "2024-01-15" → "January fifteenth, twenty twenty-four"
- Rewrites times: "14:30" → "two thirty PM"
- Expands URLs to spoken form
- Converts units: "5km" → "five kilometers"

**What it does NOT do:**

- Change your sentence structure
- Add dramatic pauses or emphasis
- Alter the tone or emotional register
- Rewrite anything that already sounds fine

**Before:**

> Dr. Smith arrived at 14:30 on 2024-01-15 and paid $100.50 for the 5km ride.

**After:**

> Doctor Smith arrived at two thirty PM on January fifteenth, twenty twenty-four, and paid one
> hundred dollars and fifty cents for the five kilometer ride.

---

#### Polish (Currently: NORMALIZE)

**Purpose:** Clean up text for smooth, natural speech. Fix awkward phrasing, improve flow.

**Everything Minimal does, plus:**

- Breaks overly long sentences for better pacing
- Removes markdown formatting artifacts
- Converts parenthetical asides to natural transitions
- Expands shorthand: "e.g." → "for example", "i.e." → "that is"
- Smooths choppy punctuation

**What it does NOT do:**

- Add audio/emotional tags
- Use ALL-CAPS emphasis
- Dramatically change the emotional register

**Before:**

> The CEO of the co. said (basically) that the ROI was ~50% -- pretty good. FYI the Q3 results were
> $2.1M which is approx. 15% higher than Q2 (see appendix B).

**After:**

> The CEO of the company said, essentially, that the return on investment was around fifty percent —
> pretty good. For your information, the third quarter results were two point one million dollars,
> which is approximately fifteen percent higher than the second quarter.

---

#### Vivid (Currently: EXPRESSIVE)

**Purpose:** Maximum expressiveness. Dramatic flair, emotional cues, emphasis. Designed for
audiobook narration, dramatic readings, and performance.

**Everything Polish does, plus:**

- Adds expressive audio cues: `[sighs]`, `[whispers]`, `[excited]`
- Uses ALL-CAPS sparingly for emphasis words
- Adds ellipses for dramatic pauses
- Uses em-dashes for pivots and reveals
- Adapts rhythm and pacing to the chosen style

**Constrained by Max Tag Density** — you control how many cues are added.

**Before:**

> He walked into the room. Everyone looked at him. It was quiet.

**After:**

> He walked into the room... and EVERYONE looked at him. [thoughtful] It was quiet — too quiet.
> **Best Practice — Engine-Aware Expressiveness** Expressive cues (`[whispers]`, `[sighs]`, ALL-CAPS
> emphasis, ellipses) are not universally supported across TTS engines. Some engines read cues
> literally or degrade cadence. The planned architecture stores **semantic intent** (pause,
> emphasis, whisper) as structured annotations, then renders or strips them per engine's capability
> matrix. Until this is implemented, Vivid mode output should be reviewed before sending to engines
> that lack expressive cue support.

---

### 🌍 Locale

**What it controls:** Language and region-specific formatting rules.

Examples:

- **en-US:** "January 15, 2024" / "one hundred dollars"
- **en-GB:** "15 January 2024" / "one hundred pounds"
- **de-DE:** German date/number formatting
- **ja-JP:** Japanese formatting conventions

**Default:** en-US. Change this if your content targets a specific language or region.

---

### 🎭 Style

Style sets the **mood and character** of the narration. Think of it as directing a voice actor:
"Read this as if you're narrating a documentary" vs "Read this like a bedtime story."

| Style                      | Best For                                    | How It Changes Output                                                          |
| -------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------ |
| 🎬 **cinematic_audiobook** | Fiction, novels, immersive stories          | Literary, atmospheric, evocative. Slow breathing prose with rich descriptions. |
| 💬 **conversational**      | Casual content, tutorials, how-tos          | Warm, informal, natural. Like talking to a friend.                             |
| 📺 **news_broadcast**      | Reports, formal announcements               | Authoritative, steady, neutral. Clear and precise.                             |
| 🎞️ **documentary**         | Educational, informational                  | Measured with gravitas. Weight and significance in delivery.                   |
| 🎭 **dramatic_reading**    | Theater, performance, poetry                | Theatrical, heightened emotion. Maximum peaks and valleys.                     |
| 🌙 **bedtime_story**       | Children's content, gentle narration        | Soft, warm, soothing. Slow and tender delivery.                                |
| 🎙️ **podcast**             | Talk shows, interviews, casual professional | Engaging, varied pacing. Conversational but structured.                        |
| 📚 **lecture**             | Academic, technical explanations            | Clear, methodical, step-by-step. Structured delivery.                          |
| 🧘 **meditation**          | Wellness, relaxation, guided sessions       | Very slow, grounding. Present-tense and calm.                                  |
| 📢 **commercial**          | Advertising, promos, calls to action        | Energetic, punchy, persuasive. Dynamic and action-oriented.                    |

**Custom styles:** The dropdown allows custom values. Type your own style keyword (e.g.,
"horror_narration" or "sports_commentary") and the AI will interpret it.

**Style + Mode interaction:** Style has the most impact in Vivid mode. In Polish mode, the style
provides subtle direction. In Minimal mode, style has no effect (since Minimal only fixes
conversions).

---

### 🔧 Advanced Parameters

These live in a collapsible section for power users. Most users can leave them at defaults.

#### Max Tag Density (0.0 – 1.0)

Controls how many expressive cues (like `[sighs]`, `[whispers]`) the AI inserts.

| Value | Label    | Meaning                                 |
| ----- | -------- | --------------------------------------- |
| 0.0   | None     | No audio tags at all                    |
| 0.25  | Sparse   | About 1 tag every 4 sentences           |
| 0.50  | Moderate | About 1 tag every 2 sentences (default) |
| 0.75  | Generous | Tags in most sentences                  |
| 1.0   | Maximum  | Tags in every sentence                  |

**Only affects Vivid mode.** Polish and Minimal modes ignore this setting.

#### Timeout (10 – 180 seconds)

How long to wait for the AI to respond before giving up. **Default: 60 seconds.**

Increase if:

- Your internet connection is slow
- You're processing very long texts
- You're using a large model that takes time to respond

#### Temperature (0.0 – 1.2)

The AI's "creativity dial."

| Range     | Behavior                                                                    |
| --------- | --------------------------------------------------------------------------- |
| 0.0 – 0.3 | Predictable, consistent. Same input → same output. Best for Minimal/Polish. |
| 0.3 – 0.7 | Balanced variety. Good default range.                                       |
| 0.7 – 1.2 | Creative, unpredictable. More surprising word choices. Best for Vivid mode. |

**Default: 0.2** — deliberately conservative for reliability.

#### Top P (0.1 – 1.0)

Controls word choice diversity. Technical name: "nucleus sampling."

**Recommendation:** Leave at **0.9** unless you have a specific reason to change it. Lower values
make output more focused and repetitive. Higher values introduce more variety.

#### Max Tokens (128 – 4096)

Maximum length of the AI's response in tokens (roughly: 1 token ≈ ¾ of a word).

**Why it matters:** If your input text is long, the AI needs enough response room to return the full
transformed version. If output appears truncated, increase this value.

| Input Length           | Recommended Max Tokens |
| ---------------------- | ---------------------- |
| Short (1-2 paragraphs) | 512                    |
| Medium (1 page)        | 1024 (default)         |
| Long (multiple pages)  | 2048–4096              |

#### Allow Local Fallback

**Default: On (recommended).**

If the AI provider is unavailable (network down, API error, timeout), the app automatically uses a
built-in text cleanup system instead of failing completely. The built-in system handles Minimal and
Polish level transformations (abbreviations, numbers, dates) but cannot do Vivid mode rewrites.

**When to turn off:** Only if you absolutely require AI-quality output and prefer failure over
approximate results.

#### Outcome Presets (Planned)

The current raw parameters (temperature, top-p, tokens) will be wrapped into **outcome-based
presets** as the primary interface:

| Preset           | Temperature | Top P | Best For                                          |
| ---------------- | ----------- | ----- | ------------------------------------------------- |
| **Conservative** | 0.1         | 0.8   | Minimal / Polish modes, consistency-critical work |
| **Balanced**     | 0.3         | 0.9   | General use (default)                             |
| **Creative**     | 0.7         | 0.95  | Vivid mode, experimental output                   |

Raw parameter controls will move to a collapsed Advanced section.

> **Planned Improvement — Non-Destructive Review Flow**
>
> Currently, "Apply Transform" replaces the text field in place. The planned improvement shows a
> **side-by-side preview** with original text on the left and transformed text on the right, plus
> Accept / Reject buttons and a provenance banner indicating whether the result came from the AI
> provider or from local fallback rules.

#### System Prompt

**What it is:** The "personality instructions" sent to the AI. It tells the AI exactly how to behave
— what to do and what not to do.

**Default value:** A carefully crafted set of rules for TTS narration transformation.

**Can you edit it?** Yes — advanced users can customize the system prompt to change how the AI
behaves. For example, you could:

- Add rules specific to your content domain
- Specify terminology that should never be changed
- Add character-specific voice directions
- Modify the level of expressiveness

**Reset button:** Restores the default system prompt.

**Persistence:** Your custom system prompt is saved to settings and persists across sessions.

> **Note — Hidden engine addendum:** The system prompt you see is the _base_ prompt. At generation
> time, an engine-specific addendum (e.g., ElevenLabs v3 tag syntax guidance, Kokoro length hints)
> is automatically appended by the system. This addendum is invisible in the UI and varies by the
> selected TTS engine. See § 6.3 for full details.

---

## 4. 🧠 How Transform Mode Works

### The Two-Layer System

Transform modes work through two layers:

1. **AI Layer (when available):** Your text is sent to the selected AI model along with the mode
   name—and now detailed instructions for what that mode means. The AI applies the transformations
   using its understanding of language.

2. **Local Fallback Layer (backup):** If the AI is unavailable, a built-in rule-based system applies
   deterministic transformations (number expansion, abbreviation expansion, etc.).

### What Happens Behind the Scenes

When you click "Apply Transform":

1. The app checks if an AI model is configured and reachable
2. It builds a prompt that includes:
   - Your system prompt (personality instructions)
   - The transform mode with detailed behavioral instructions
   - The locale and style settings
   - The max tag density constraint
   - Your original text
3. The AI processes the prompt and returns transformed text
4. The output is cleaned (removing any markdown or SSML the AI might add)
5. The transformed text replaces your original in the text field

If any step fails and "Allow Local Fallback" is enabled, the built-in system runs the Minimal/Polish
transformations instead.

### Mode Behavior Specifications

| Behavior                         | Minimal | Polish | Vivid |
| -------------------------------- | ------- | ------ | ----- |
| Expand abbreviations             | ✅      | ✅     | ✅    |
| Spell out numbers/dates/currency | ✅      | ✅     | ✅    |
| Convert URLs to spoken form      | ✅      | ✅     | ✅    |
| Break long sentences             | ❌      | ✅     | ✅    |
| Remove markdown artifacts        | ❌      | ✅     | ✅    |
| Smooth phrasing and flow         | ❌      | ✅     | ✅    |
| Add emotional/audio tags         | ❌      | ❌     | ✅    |
| Use ALL-CAPS emphasis            | ❌      | ❌     | ✅    |
| Add dramatic pauses (ellipses)   | ❌      | ❌     | ✅    |
| Style-guided rhythm changes      | ❌      | ❌     | ✅    |

> **Best Practice — Deterministic First, AI Second**
>
> Not every transformation needs an LLM. Number expansion, abbreviation handling, date/currency
> normalization, glossary protection, and pronunciation aliases should be **deterministic rules
> applied first**. The LLM is reserved for ambiguity resolution, style shaping, and expressive
> rewriting. This split improves reliability, reduces latency, lowers cost, and ensures consistency
> across providers.

---

## 5. 🎨 How Style Influences Output

### Style as Creative Direction

When you choose a style, the AI receives it as a creative direction — like giving a voice actor a
brief before they step into the recording booth.

The style affects:

- **Word choice:** "cinematic_audiobook" prefers rich, evocative words. "news_broadcast" prefers
  clear, neutral words.
- **Sentence length:** "meditation" uses shorter, calmer sentences. "lecture" uses structured,
  complete thoughts.
- **Punctuation patterns:** "dramatic_reading" uses more em-dashes and ellipses. "conversational"
  uses more contractions and casual transitions.
- **Emphasis placement:** "commercial" emphasizes action words. "bedtime_story" softens everything.
- **Pacing cues:** "documentary" places deliberate pauses between facts. "podcast" has natural
  conversational rhythm.

### New Content vs Existing Stories

Style works for both scenarios:

**Writing from scratch:** The style shapes how the AI constructs narration text from your raw ideas.

**Adapting existing text:** The style guides how the AI rewrites your text. A news article
transformed with "cinematic_audiobook" style becomes more literary. The same article with "podcast"
style becomes more conversational.

### Style + Mode Combinations

| Combination                  | Result                                                |
| ---------------------------- | ----------------------------------------------------- |
| Minimal + any style          | Style is ignored (Minimal only does mechanical fixes) |
| Polish + cinematic_audiobook | Subtle literary smoothing, improved flow              |
| Polish + conversational      | Natural, warm cleanup                                 |
| Vivid + dramatic_reading     | Maximum theatrical expressiveness                     |
| Vivid + bedtime_story        | Gentle, warm, with soft emotional cues                |
| Vivid + commercial           | Energetic, punchy, with excitement markers            |

---

## 6. 🎤 Single Speaker vs Conversation Mode

### Single Speaker Mode

**The current default path.** Great for:

- Narrating a blog post, article, or book chapter
- Generating a single voice reading text aloud
- Any content with one narrator

**Workflow:**

1. Enter or paste text in the main text field
2. Optionally apply AI Script Polish (the transform panel)
3. Choose a TTS engine and voice
4. Generate audio

### Conversation Mode

**For multi-speaker dialogues.** Great for:

- Audiobook chapters with dialogue between characters
- Podcast-style conversations
- Dramatic readings with multiple voices
- Interactive storytelling

**Current workflow:**

1. Enter text in "Speaker: Text" format (e.g., `Alice: Hello!`)
2. Click "Analyze Script" to detect speakers
3. Assign a voice sample to each speaker
4. Generate conversation audio

**Current limitation:** The LLM narration transform does NOT currently apply to conversation mode.
Text goes straight to TTS without any polishing. This is a gap that the enhanced workflow
(Section 7) addresses.

### 6.1 UI Control → Generation Mode Scope Matrix

Not all narration transform panel controls affect every generation mode. This matrix documents
exactly which controls take effect in each context.

| UI Control                                          |    Single-text Synthesis    | Conversation: AI Format | Conversation: Cast Characters | Conversation: Generate |
| --------------------------------------------------- | :-------------------------: | :---------------------: | :---------------------------: | :--------------------: |
| LLM Provider / Model / Base URL / API Key / Timeout |             ✅              |           ✅            |              ✅               |           ✅           |
| Content Type dropdown                               |  ✅ replaces system prompt  |           ❌            |              ❌               |           ❌           |
| Transform Mode (Minimal / Polish / Vivid)           |    ✅ shapes user-prompt    |           ❌            |              ❌               |           ❌           |
| Locale                                              |    ✅ shapes user-prompt    |           ❌            |              ❌               |           ❌           |
| Style                                               |    ✅ shapes user-prompt    |           ❌            |              ❌               |           ❌           |
| Max Tag Density                                     |     ✅ Vivid mode only      |           ❌            |              ❌               |           ❌           |
| LLM System Prompt (textbox)                         |    ✅ base system prompt    |           ❌            |              ❌               |           ❌           |
| Outcome Preset                                      |  ✅ temp/top_p/tokens only  |           ❌            |              ❌               |           ❌           |
| Allow Local Fallback toggle                         |             ✅              |           ❌            |              ❌               |           ❌           |
| Apply Transform button                              |        Preview only         |            —            |               —               |           —            |
| Reset Default Prompt button                         |   ✅ resets prompt + type   |            —            |               —               |           —            |
| TTS Engine (indirect)                               | ✅ engine addendum appended |           ❌            |              ❌               |           ❌           |

**Legend:**

- ✅ — control is active and affects this generation path
- ❌ — control has no effect on this generation path
- — — button is not available in this context

### 6.2 Conversation Mode: Dedicated Prompt Paths

When using Conversation Mode, **AI Format** uses the visible **Prompt Library** and **Conversation
AI Prompt** controls in the UI. **Cast Characters** continues to use its own built-in casting
prompt. The narration transform settings (Content Type, Transform Mode, Style, Locale, System Prompt
textbox) do not apply.

The key paths are:

- AI Format Script: `handle_ai_format_script` (launch.py:15778) using the Conversation AI Prompt and
  Prompt Library controls in Conversation Mode
- Cast Characters: `handle_cast_characters` (launch.py:15816) using `VOICE_CASTING_SYSTEM_PROMPT` —
  `narration_transform.py:70`
- Conversation Generate: `handle_generate_conversation_advanced` (launch.py:15882), which sends text
  directly to TTS with no LLM call

Only the **LLM provider connection settings** (provider, model, base URL, API key, timeout) are
shared with conversation mode operations.

### 6.3 Hidden Engine Addendum Behavior

When running **single-text synthesis**, the final system prompt sent to the LLM is not just the
value shown in the System Prompt textbox. At generation time, `_build_llm_system_prompt()` in
`narration_transform.py:840` appends an engine-specific addendum sourced from
`get_engine_prompt_addendum(tts_engine)` in `engine_script_profiles.py:734`.

**What this means:**

- The textbox shows the _base_ system prompt — the addendum is appended silently.
- Different TTS engines produce different effective system prompts even with identical textbox
  values.
- The addendum is engine-specific guidance (e.g., ElevenLabs v3 tag syntax, Kokoro length guidance).
- This behavior does **not** apply to conversation mode operations.

---

## 7. 🚀 Conversation Mode — AI Format Workflow

### Current Workflow

Conversation Mode now includes an AI-powered formatting pass for raw prose, dialogue, and mixed
story text.

#### Step 1: Paste Any Text

Paste your story, dialogue, or mixed prose into the **Conversation Script** box in Conversation
Mode.

#### Step 2: Click AI Format

The app sends the current text to the configured LLM using the visible Conversation AI prompt,
automatically chunks long stories when needed, and rewrites the result into `Speaker: Text` lines.

#### Step 3: Review the Same Box

The formatted output replaces the text in the same Conversation Script box. You can review it,
adjust speaker names if needed, then continue with **Analyze Script** and the rest of the normal
Conversation Mode flow.

#### Step 4: Optional Per-Line Polish

Each speaker's line can optionally be polished using the same AI Script Polish settings (mode,
style, locale) — applied individually so each speaker's lines maintain consistency.

#### Step 5: Voice Assignment and Generation

The existing workflow takes over: voice assignment, pause configuration, and audio generation.

> **Best Practice — Schema-First Intermediate Representation**
>
> The AI must return a **validated JSON structure** before populating the UI:
>
> ```json
> {
>   "lines": [
>     { "speaker": "Alice", "type": "dialogue", "text": "Hello!", "confidence": 0.95 },
>     {
>       "speaker": "Narrator",
>       "type": "narration",
>       "text": "She smiled warmly.",
>       "confidence": 0.88
>     },
>     {
>       "speaker": "Unknown",
>       "type": "dialogue",
>       "text": "Who's there?",
>       "confidence": 0.45,
>       "ambiguous": true
>     }
>   ]
> }
> ```
>
> Lines with low confidence or `ambiguous: true` are flagged for user review instead of silently
> accepted. This makes conversation mode auditable and debuggable.

### What the User Does vs What the Platform Does

| Step              | User Does         | Platform Does                               |
| ----------------- | ----------------- | ------------------------------------------- |
| Provide text      | Paste any format  | —                                           |
| Speaker detection | Review AI results | AI identifies speakers automatically        |
| Text formatting   | Approve/edit      | AI reformats to "Speaker: Text"             |
| Line polishing    | Choose mode/style | AI polishes each line                       |
| Voice assignment  | Select voices     | Auto-suggest based on speaker names         |
| Generation        | Click Generate    | Engine renders each line with correct voice |

### Edge Cases the System Will Handle

- **Narrator lines:** Assigned to a "Narrator" speaker with its own voice
- **Stage directions:** `(whispers)` preserved as emotional cues, `(shrugs)` removed
- **Multiple speakers in one paragraph:** Split into separate lines with attributed speakers
- **Dialect/accent notation:** Preserved as authored (not stereotyped)
- **Ambiguous attribution:** Defaults to "Narrator" with a warning

---

## 8. 🤖 In-App Assistant Plan

### Vision

An ever-present AI assistant within TTS Studio that can:

- Answer "how do I..." questions about any feature
- Diagnose connection issues
- Suggest optimal settings for your use case
- Guide you through conversation script formatting
- Explain error messages in plain language
- Preview what transforms will do before you apply them

### Planned Implementation

**Sidebar Chat Interface:** A Gradio chatbot component always visible in a sidebar panel. Type
questions naturally — it uses the same LLM provider you've configured.

**Context-Aware:** The assistant knows which tab you're on and can give relevant help. On the
Conversation Mode tab, it can help with formatting. On the LLM panel, it can test connections.

> **Architecture Decision:** The assistant uses its own provider fallback chain, independent of the
> user's creative transform provider. Diagnostics must work even when the creative provider is
> misconfigured, down, or rate-limited — that's precisely when users need help most.

**Diagnostic Capabilities:**

- "Test my LM Studio connection" → runs connectivity check and reports
- "Why am I getting a 401 error?" → checks API key configuration and suggests fixes
- "What model should I use for audiobooks?" → recommends based on provider and use case

### Phased Rollout

| Phase   | Focus            | Capabilities                                                   |
| ------- | ---------------- | -------------------------------------------------------------- |
| Phase 1 | MVP Chat         | Answer questions, explain features, basic diagnostics          |
| Phase 2 | Smart Help       | Settings suggestions, error interpretation, preview transforms |
| Phase 3 | Active Assistant | Fix configurations, auto-format scripts, run diagnostics       |

---

## 9. 🔧 Tools, MCPs, and Skills

### MCP Server (Model Context Protocol)

TTS Studio can expose an MCP server — allowing external tools (like VS Code, automation scripts, or
other AI agents) to interact with TTS capabilities programmatically.

**Planned tools:**

| Tool                                | What It Does                       |
| ----------------------------------- | ---------------------------------- |
| `generate_tts(text, engine, voice)` | Generate speech audio from text    |
| `list_voices(engine)`               | Get available voices for an engine |
| `transform_text(text, mode, style)` | Apply narration transform          |
| `structure_conversation(text)`      | Convert raw text to speaker format |
| `get_engine_info()`                 | Query engine capabilities          |

> **Security Requirement:** MCP tools must ship with authentication, authorization scopes, per-tool
> rate limiting, and audit logging from day one. Creative transforms, diagnostics, and automation
> channels must be isolated so that one failure does not compromise the others.

**Use case:** A VS Code agent working on a documentation project could automatically generate audio
narration for tutorial videos without leaving the editor.

### Skills for Coding Agents

Domain knowledge packages that help AI coding assistants work more effectively on this codebase:

1. **Engine Integration Skill** — Pattern for adding new TTS engines
2. **Prompt Engineering Skill** — How to write and test narration transform prompts
3. **Gradio UI Patterns Skill** — Reusable component patterns for this app
4. **Conversation Mode Scripting Skill** — Dialogue formatting rules and validation
5. **Narration Transform Testing Skill** — Test methodology and evaluation harness

### Consistency Across Changing LLM Models

When users switch between different AI models (e.g., from GPT-4o to a local Llama model), output
quality can vary. Strategies to maintain consistency:

- **Structured output schemas:** Force JSON responses for conversation structuring
- **Validation layers:** Check output against expected format before accepting
- **Model-specific prompt templates:** Stronger models get concise prompts; smaller models get
  detailed step-by-step instructions
- **Evaluation harness:** Automated quality scoring of transform output

---

## 10. 📅 Implementation Priority Roadmap

| Phase         | Focus                           | Key Items                                                                                                                                                                        | Status                      |
| ------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| **Phase 1**   | UX Polish                       | Panel tooltips, settings persistence, Gemini fix, alphabetized providers, system prompt scroll                                                                                   | ✅ Done                     |
| **Phase 2**   | Transform Quality + Foundations | Deterministic normalization, engine capability matrix, preview/diff UX, outcome presets, evaluation harness, redesigned prompts, mode renames                                    | ✅ Done                     |
| **Phase 2.5** | Pre-Phase 3 Prerequisites       | Module extraction (`narration_transform.py`), evaluation metrics, golden datasets, VibeVoice fix, repo hygiene, Phase 5 gate docs                                                | ✅ Done                     |
| **Phase 3**   | Conversation Enhancement        | NarrationScript model, AI conversation formatter, conversation UI, per-line transform, pronunciation lexicon, module extraction (`engine_registry.py` + `conversation_logic.py`) | ✅ Done                     |
| **Phase 4a**  | MCP Server + Tools              | FastAPI + FastMCP sidecar, full tool set (13 tools), bearer-token security, job manager, rate limits, audit logging                                                              | 🔍 Awaiting sign-off        |
| **Phase 4b**  | Assistant + Job Orchestration   | Assistant UI (status bar + tab), LLM decoupling, diagnostics, job queue/cancel/retry                                                                                             | 🔜 Next (after 4a sign-off) |
| **Phase 5**   | Platform Vision                 | Character bibles, DAW export, subtitle alignment, CI/CD pipelines (gated on Phase 4 completion + user demand)                                                                    | 🚪 Gated                    |

> For the complete revised roadmap with council verdicts, architectural decisions, evaluation
> metrics, and risk register, see [REVISED_ROADMAP_v2.md](REVISED_ROADMAP_v2.md).

---

## 11. ❓ Frequently Asked Questions

### Which provider should I use?

- **For privacy/offline:** LM Studio or Ollama — everything stays on your PC
- **For quality:** Google Gemini (generous free tier) or GitHub Models
- **For enterprise:** Microsoft Foundry (Azure integration)
- **Getting started:** LM Studio is the default — install it, load a model, and go

### Which mode is best for audiobooks?

**Vivid + cinematic_audiobook** is the audiobook gold standard. It produces immersive, atmospheric
narration with emotional cues. For non-fiction audiobooks, try **Polish + documentary**.

### Do I need an API key?

Only for cloud providers (Gemini, GitHub Models, Foundry). Local providers (LM Studio, Ollama, vLLM)
don't need one. API keys are free to obtain from each provider's website.

### Will it change my text?

Depends on the mode:

- **Minimal:** Only fixes things that would sound wrong (numbers, abbreviations)
- **Polish:** Smooths phrasing and flow, but preserves meaning and intent
- **Vivid:** Rewrites for maximum dramatic impact — intentionally creative

You can preview the result before committing to it.

### What if the AI is down?

If "Allow Local Fallback" is on (default), the app automatically uses its built-in text cleanup
system. This handles Minimal and Polish level fixes (abbreviation expansion, number conversion) but
cannot do Vivid mode creative rewrites.

### Can I undo a transform?

The original text is preserved internally. Use Ctrl+Z or the undo feature to revert.

### How do I make conversation mode work with my novel?

Currently, you need to manually format as "Speaker: Text." The planned Phase 3 enhancement will
allow you to paste raw novel text and have the AI automatically identify speakers and reformat it
for you.

### My Gemini API key gives a 401 error — what's wrong?

The Gemini OpenAI-compatible endpoint uses a specific authentication method. Make sure:

1. Your API key is valid (test it at [Google AI Studio](https://aistudio.google.com))
2. The key is entered in the API Key field OR set as `GOOGLE_API_KEY` environment variable
3. Click "Test Connection" to verify

### What's the difference between Temperature and Top P?

- **Temperature:** How creative the AI is. Low = predictable. High = surprising.
- **Top P:** How many word options the AI considers. Low = focused. High = diverse.

For narration transform, keep both at defaults (Temperature: 0.2, Top P: 0.9). Only adjust if you
want more creative (higher) or more predictable (lower) output.

### Can I save my custom settings?

Yes — all LLM panel settings (provider, model, URL, API key, system prompt) now persist across
sessions in your settings file.

---

## 📝 Document Revision History

| Date       | Version | Changes                                                                                                                                                                                  |
| ---------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-03-31 | 1.0     | Initial guide covering all panel fields, modes, styles, conversation mode plan, assistant plan, MCP/tools roadmap                                                                        |
| 2026-04-01 | 1.1     | Architecture review findings integrated: engine-aware cues, deterministic normalization, schema-first conversation, outcome presets, non-destructive UX, revised roadmap, security notes |
| 2026-04-04 | 1.2     | Roadmap updated to v2.0 phase structure (Phase 2.5 added, Phase 4 split into 4a/4b, Phase 5 gated). Full roadmap details moved to REVISED_ROADMAP_v2.md.                                 |
| 2026-04-02 | 1.3     | Phase statuses updated: Phase 2.5 ✅ Done, Phase 3 ✅ Done, Phase 4a 🔍 Awaiting sign-off (FastAPI + FastMCP, 13 tools), Phase 4b 🔜 Next.                                               |

---

_This document is part of the Ultimate TTS Studio project documentation. Report issues or suggest
improvements via the project repository._
