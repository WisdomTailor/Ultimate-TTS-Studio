# Feature & Engine Comparison Matrix

> At-a-glance reference for choosing the right engine, transform mode, and settings for your
> creative goal. For full narrative detail on each engine, see
> [User Guide — Section 9: Engine Reference](USER_GUIDE.md#9-engine-reference).

---

## Contents

1. [How to Read This Document](#1-how-to-read-this-document)
2. [Engine Comparison Table](#2-engine-comparison-table)
3. [Use Case Recommendations](#3-use-case-recommendations)
4. [Transform Mode Comparison](#4-transform-mode-comparison)
5. [Audio Format Guidance](#5-audio-format-guidance)
6. [LLM Provider Comparison](#6-llm-provider-comparison)

---

## 1. How to Read This Document

Ultimate TTS Studio includes 14 TTS engines, three AI text preparation modes, two audio output
formats, and seven LLM providers. The tables and recommendations in this document are your shortcut
to the right choices.

Each section answers one question: **which option fits my goal?** The tables give you the overview;
the [User Guide](USER_GUIDE.md) gives you the depth. Come here first, then follow the
cross-references for step-by-step instructions.

> 💡 **Not sure where to start?** Jump to [Use Case Recommendations](#3-use-case-recommendations)
> below. Most first-time users should begin with 🗣️ **Kokoro TTS** (no reference audio needed, fast,
> beginner-friendly) or 🎤 **ChatterboxTTS** (if you want to clone a specific voice right away).

---

## 2. Engine Comparison Table

<!-- screenshot: Engine Selection accordion showing the dropdown list of all 14 engines -->

The 14 available TTS engines are compared below across eight capability dimensions.

**Column notes:**

- **Voice Cloning** — Can this engine replicate a specific voice from a reference recording you
  provide?
- **Multilingual** — Does it support languages beyond English?
- **Emotion Control** — Can you programmatically adjust the emotional register of the speech?
- **Speed** — Relative generation time on a modern NVIDIA GPU. Fast = near-instant; Medium = 5–30
  seconds per passage; Slow = a minute or more depending on hardware.
- **Quality** — The naturalness and fidelity of typical output. All engines produce usable audio;
  "Excellent" engines have the most natural prosody and fewest artifacts under normal conditions.
- **Voice Source** — What controls which voice the engine uses.
- **Auto-Download** — Does the model download automatically on first **Load**, or does it require a
  manual step? See the note on 🐟 Fish Speech.

| Engine | Voice Cloning | Multilingual | Emotion Control | Speed | Quality | Voice Source | Auto-Download |
|---|---|---|---|---|---|---|---|
| 🎤 ChatterboxTTS | ✅ Yes | ❌ No | ❌ No | Medium | Great | Reference audio | ✅ Yes |
| 🌍 Chatterbox Multilingual | ✅ Yes | ✅ Yes (23 languages) | ❌ No | Medium | Great | Reference audio | ✅ Yes |
| 🚀 Chatterbox Turbo | ✅ Yes | ❌ No | ❌ No | **Fast** | Good | Reference audio | ✅ Yes |
| 🗣️ Kokoro TTS | ❌ No | ✅ Yes | ❌ No | Fast | Great | Built-in voices + custom .pt | ✅ Yes |
| 🐟 Fish Speech | ✅ Yes | ✅ Yes | ❌ No | Medium | Excellent | Custom voices | ⚠️ Manual |
| 🎯 IndexTTS | ✅ Yes | ❌ No | ❌ No | Medium | Great | Reference audio | ✅ Yes |
| 🎯 IndexTTS2 | ✅ Yes | ❌ No | ✅ Yes (8-axis) | Medium | Excellent | Reference audio | ✅ Yes |
| 🎵 F5-TTS | ✅ Yes | ✅ Yes | ❌ No | Medium | Great | Reference audio | ✅ Yes |
| 🎙️ Higgs Audio | ❌ No | ✅ Yes | ❌ No | Medium | Great | Voice presets | ✅ Yes |
| 🎤 VoxCPM | ✅ Yes | ❌ No | ❌ No | Medium | Great | Reference audio | ✅ Yes |
| 🐱 KittenTTS | ❌ No | ❌ No | ❌ No | **Fast** | Good | 8 built-in voices | ✅ Yes |
| 🎨 Qwen Voice Design | ❌ No | ✅ Yes | ❌ No | Slow | Great | Text description | ✅ Yes |
| 🎭 Qwen Voice Clone | ✅ Yes | ✅ Yes | ❌ No | Medium | Great | Reference audio | ✅ Yes |
| 🗣️ Qwen Custom Voice | ❌ No | ✅ Yes | ❌ No | Medium | Great | Built-in speaker profiles | ✅ Yes |

**Important notes:**

- **🐟 Fish Speech** is the only engine that requires a manual download. Click the download button
  inside the **Model Management** accordion under the Fish Speech section before attempting to load
  it.
- The three **Qwen modes** (Voice Design, Voice Clone, Custom Voice) share one underlying model —
  load it once in Model Management, and all three modes become available simultaneously.
- **🎯 IndexTTS2's** eight emotion axes are: Happy, Angry, Sad, Afraid, Disgusted, Melancholic,
  Surprised, and Calm — each independently adjustable.
- For multilingual engines without a fixed language count listed, language support varies by model
  version. Check the engine settings panel for the current language list after loading.

---

## 3. Use Case Recommendations

Find the scenario closest to your goal and follow the recommendation. For step-by-step
instructions, each recommendation links to the relevant section of [WORKFLOWS.md](WORKFLOWS.md) or
the [User Guide](USER_GUIDE.md).

---

### "I want to clone my own voice"

These engines accept a short reference audio clip (5–30 seconds of clean speech) and generate new
text in that voice:

| Engine | Why Choose It |
|---|---|
| 🎤 **ChatterboxTTS** | Best starting point. Auto-downloads, minimal setup, excellent results from a clean recording. |
| 🌍 **Chatterbox Multilingual** | Same voice quality as ChatterboxTTS, but generates across 23 languages. |
| 🚀 **Chatterbox Turbo** | Speed-optimized variant. Trade some quality for significantly faster generation. |
| 🐟 **Fish Speech** | Top-tier prosody and naturalness. Requires a manual download — worth it for premium long-form work. |
| 🎤 **VoxCPM** | Highly configurable. Built-in bad-case detection retries automatically when output falls below threshold. |
| 🎵 **F5-TTS** | Clean and smooth. Adjustable speed and cross-fade make it well-suited for multi-pass projects. |
| 🎭 **Qwen Voice Clone** | Multilingual voice cloning. Clone a voice and generate in a different language from the reference. |

> 💡 **Quality tip:** Use a 10–20 second clip recorded in a quiet room with consistent vocal
> energy. Avoid background music, reverb, or multiple speakers in the reference. See the
> [Clone My Voice workflow](WORKFLOWS.md) for a guided walkthrough.

---

### "I want the fastest generation"

Speed matters when you're prototyping, drafting, or running large batches:

- **🐱 KittenTTS** — The smallest, fastest engine in the app. Eight built-in voices, no reference
  audio, no large model downloads. Results in seconds.
- **🚀 Chatterbox Turbo** — Fast voice cloning. Retains the voice identity of your reference without
  the full generation cost of standard ChatterboxTTS.

> 💡 **Workflow tip:** Draft and preview with KittenTTS or Chatterbox Turbo, then switch to a
> higher-quality engine for your final production run. Your settings carry over when you change
> engines.

---

### "I want emotion control"

Only one engine offers direct, per-axis emotional shaping:

**🎯 IndexTTS2** provides eight independent emotion sliders — **Happy, Angry, Sad, Afraid,
Disgusted, Melancholic, Surprised, and Calm**. Each axis can be set independently between 0 and
1.0. You can combine them: a character who is largely Calm but carries a trace of Melancholic reads
very differently from one with Calm at maximum and Surprised dialed in.

The **Emotion Alpha** control governs the overall weight given to the emotion settings — how strongly
they override the neutral baseline. Start with a low Alpha and increase until the character feels
right.

This is particularly powerful for audiobooks and character-driven content. Save a preset for each
character's emotional baseline, then adjust per scene as needed.

> 💡 See the [🎯 IndexTTS2 engine entry](USER_GUIDE.md#-indextts2) in the User Guide for a full
> walkthrough of the emotion axes and recommended starting values.

---

### "I want to make a podcast"

Two options, depending on how much control you want:

- **🎙️ VibeVoice tab** — Dedicated multi-speaker podcast generation with 1–4 speakers. Download a
  VibeVoice model (compact or Large), write your script, assign voices per speaker, and generate.
  The simplest path to a multi-speaker output.
- **🎭 Conversation Mode** with any of the 14 engines — More flexible: mix different engines per
  speaker, use voice cloning for specific characters, apply per-line AI Script Polish. Best when
  you want engine variety or precise control over individual lines.

Both approaches produce polished multi-speaker dialogue. VibeVoice is simpler; Conversation Mode is
more powerful.

> 💡 See [Create a Podcast Episode](WORKFLOWS.md) for guided steps through both options.

---

### "I want an audiobook"

- **📚 eBook to Audiobook tab** — Upload an `.epub`, `.pdf`, `.txt`, or other supported file,
  select chapters, choose your engine and format, and generate chapter by chapter. Built for
  long-form work.
- **Best engines for long-form consistency:**
  - 🗣️ **Kokoro TTS** — Built-in voices stay consistent across long runs; fast to generate.
  - 🐟 **Fish Speech** — Excellent natural prosody for storytelling; worth the manual download step.
  - 🎯 **IndexTTS** and 🎯 **IndexTTS2** — Industrial-quality consistency for production audiobooks.

> 💡 See [Convert My eBook to Audiobook](WORKFLOWS.md) for a step-by-step walkthrough.

---

### "I want to design a voice from a text description"

- **🎨 Qwen Voice Design** — Describe the voice you want in plain English: "a warm, authoritative
  male voice, mid-forties, slight regional accent, calm and measured delivery." Qwen generates a
  voice that matches the description.

No reference audio required. Ideal when you have a clear concept but no recording to work from.

> 💡 See [Design a Custom Voice from Scratch](WORKFLOWS.md) for a workflow guide.

---

### "I want multilingual content"

| Engine | Language Support |
|---|---|
| 🌍 Chatterbox Multilingual | 23 languages (with voice cloning across language boundaries) |
| 🗣️ Kokoro TTS | Multiple (built-in multilingual voice library) |
| 🐟 Fish Speech | Multiple |
| 🎵 F5-TTS | Multiple |
| 🎙️ Higgs Audio | Multiple |
| 🎨 Qwen Voice Design | Multiple |
| 🎭 Qwen Voice Clone | Multiple |
| 🗣️ Qwen Custom Voice | Multiple |

For voice cloning across languages — where the cloned voice speaks in a language different from the
reference recording — **🌍 Chatterbox Multilingual** and **🎭 Qwen Voice Clone** are the strongest
choices.

> 💡 See [Generate Multi-Language Content](WORKFLOWS.md) for a step-by-step guide.

---

### "I need something lightweight"

- **🐱 KittenTTS** — The smallest model in the app. Eight built-in expressive voices in four
  male/female pairs. No large model downloads, no reference audio setup, and fast enough to generate
  on modest hardware. The right choice for quick tests, lightweight deployments, or systems where
  heavier engines struggle.

---

## 4. Transform Mode Comparison

_AI Script Polish_ (labeled "Narration Transform" in the UI) prepares your text before it reaches
the TTS engine. Choosing the right mode depends on your content type.

| Mode | What It Changes | Best When | What It Leaves Alone |
|---|---|---|---|
| **Minimal** | Expands abbreviations, numbers, dates, units | Factual text, technical content, news scripts | Phrasing, sentence structure, tone |
| **Polish** | Everything Minimal does + smooths phrasing, adds natural transitions | Podcasts, blog narration, presentations | Creative content, emotional emphasis |
| **Vivid** | Everything Polish does + adds dramatic pacing, pauses, emotional beats | Audiobooks, fiction, cinematic narration | Factual accuracy (meaning is preserved) |

### When to Use Each Mode

**Minimal** is your safe default — use it for everything, at minimum. Every TTS engine will stumble
over "Dr." read as "doctor" or "3" instead of "three." Minimal catches and expands all of those
automatically without changing a word of your intent.

> **Example — Minimal:** _Before:_ "Dr. Chen reviewed 3 files at 14:30 on Feb 12th, noting a $42.50
> charge." _After:_ "Doctor Chen reviewed three files at two thirty PM on February twelfth, noting a
> forty two dollar and fifty cent charge."

**Polish** is the everyday upgrade for spoken content. Rough transitions, short choppy sentences,
and slightly awkward phrasing can sound unnatural when read aloud even when they read fine on the
page. Polish smooths those structures without changing your meaning.

> **Example — Polish:** _Before:_ "The update fixed 3 bugs. Users reported issues. We patched them."
> _After:_ "The update fixed three bugs that users had reported, and we've patched all of them."

**Vivid** is for storytellers. It adds dramatic pauses, builds tension, and creates the rhythm that
makes a narrated story feel alive. Use it intentionally — it transforms a flat passage into a
performance, which is exactly right for audiobooks and exactly wrong for dry technical content.

> **Example — Vivid:** _Before:_ "She opened the door. There was no one inside." _After:_ "She
> opened the door... and stopped. The room was empty. Completely, utterly empty."

Beyond the three modes, a **Transform Style** dropdown (Conversational, Professional/Formal,
Storytelling/Cinematic, Podcast/Casual, Academic/Educational) further shapes the tone. A **Locale**
setting handles regional English conventions (spelling, date formats, honorifics). See
[Section 5 of the User Guide](USER_GUIDE.md#5-ai-script-polish) for the full workflow.

---

## 5. Audio Format Guidance

Generated audio can be saved as **WAV** or **MP3**. The right choice depends on what you plan to do
with the file next.

| Format | File Size | Quality | Best For |
|---|---|---|---|
| **WAV** | Large (uncompressed) | Lossless — no quality loss | Editing, post-production, archival |
| **MP3** | Small (compressed) | Slightly reduced — generally imperceptible for speech | Sharing, streaming, publishing, podcasts |

### The Simple Rule

**Save as WAV if you're going to edit the file.** If you plan to mix it with music, trim it in audio
software, or run it through post-production, WAV preserves every detail. No quality degradation
happens across repeated export and import cycles.

**Save as MP3 if you're going to share the file.** Uploading to a podcast platform, sending to a
client, or distributing finished content — the size savings are significant (a 10 MB WAV often
becomes around 1 MB at standard podcast bitrates) with essentially no perceptible difference in
speech quality.

> ⚠️ **Avoid transcoding loops:** Don't generate WAV → convert to MP3 → re-import → export WAV.
> Every MP3 encode introduces irreversible quality loss. Choose your format before your final
> generation pass.

### File Size at a Glance

| Duration | WAV (approx.) | MP3 (approx.) |
|---|---|---|
| 1 minute | ~10 MB | ~1–2 MB |
| 10 minutes | ~100 MB | ~10–20 MB |
| 1 hour | ~600 MB | ~55–100 MB |

For full audiobooks, MP3 is practical for final delivery. For chapter-level editing before final
assembly, WAV is worth the disk space.

---

## 6. LLM Provider Comparison

AI Script Polish uses a language model (LLM) to rewrite your text before synthesis. Seven providers
are supported: three run entirely on your machine (no API key required), and four connect to cloud
services.

| Provider | Requires API Key | Runs Locally | Privacy | Best For |
|---|---|---|---|---|
| **Ollama** | No | ✅ Yes | Full — nothing leaves your machine | Local GPU users wanting maximum privacy and control |
| **LM Studio** | No | ✅ Yes | Full — nothing leaves your machine | Local GPU users who prefer a visual model manager |
| **vLLM** | No | ✅ Yes | Full — nothing leaves your machine | Advanced users running high-throughput local inference |
| **GitHub Models** | Yes (free tier) | ❌ Cloud | Text sent to Microsoft | Easy cloud access, no GPU needed, generous free tier |
| **Google Gemini** | Yes | ❌ Cloud | Text sent to Google | High-quality cloud generation with a free-tier API |
| **Microsoft Foundry** | Yes | ❌ Cloud | Enterprise data handling policies | Enterprise users in the Microsoft Azure ecosystem |
| **Custom OpenAI-compatible** | Configurable | Local or cloud | Depends on endpoint | Advanced users with custom model endpoints |

### Privacy First

**Your text is only sent to a third party when you use a cloud provider.** If you are working with
personal content, proprietary scripts, or any text you don't want to leave your machine, choose
Ollama, LM Studio, or vLLM. All three run entirely locally — nothing is transmitted.

### Recommended Starting Points

- **If you have an NVIDIA GPU:** Start with **Ollama**. No API key, full privacy, and strong
  performance on a mid-range GPU. Install a 7B-parameter model (such as Llama 3 or Mistral 7B) for
  a good balance of speed and output quality.
- **If you don't have a GPU, or want the easiest setup:** Start with **GitHub Models**. The free
  tier is genuinely useful, setup requires a single personal access token (free from GitHub), and
  quality across all three transform modes is excellent.
- **If you're in an enterprise environment:** **Microsoft Foundry** integrates with existing Azure
  credentials and applies enterprise data governance policies automatically.

> ⚠️ **Two separate LLM connections:** AI Script Polish and the in-app **🤖 Assistant** each have
> their own LLM settings panels. You can run Ollama locally for text preparation and GitHub Models
> for the assistant — or use the same provider for both. Configuring one does not affect the other.

> 💡 For a step-by-step connection guide, see
> [Section 5 of the User Guide](USER_GUIDE.md#5-ai-script-polish).

---

_Ultimate TTS Studio SUP3R Edition — Documentation Suite v1.0_
