# Frequently Asked Questions — Ultimate TTS Studio SUP3R Edition

**25 answers to the questions creators ask most.**

Can't find what you're looking for? The [User Guide](USER_GUIDE.md) goes deep on every feature, and
the [Workflow Recipes](WORKFLOWS.md) show you step-by-step paths through the most common tasks.

---

## Contents

1. [Getting Started](#getting-started)
2. [Engines & Voices](#engines--voices)
3. [AI Script Polish](#ai-script-polish)
4. [Audio Quality](#audio-quality)
5. [Troubleshooting](#troubleshooting)
6. [Advanced](#advanced)

---

## Getting Started

---

**Q: What hardware do I need?**

You'll get the best experience with an NVIDIA GPU — most engines are GPU-accelerated, and an NVIDIA
card dramatically improves generation speed. Lightweight engines like 🐱 **KittenTTS** can run on
lower-end hardware. Heavier engines like 🐟 **Fish Speech**, 🎤 **ChatterboxTTS**, and 🎯
**IndexTTS2** benefit most from 8 GB or more of VRAM. Running on CPU is possible but noticeably
slower. If you're not sure what you have, a good rule of thumb: if you can play modern games, you
can run most engines. For a full breakdown of engine speed and GPU demands, see the
[Feature Matrix](FEATURE_MATRIX.md#2-engine-comparison-table).

---

**Q: Does it work on Mac or Linux?**

The primary supported platform is Windows. Most development and testing happens on Windows with an
NVIDIA GPU. Running on Mac or Linux may be possible depending on the engine and your Python
environment, but it isn't officially supported and results may vary. If you're on Mac or Linux and
comfortable with Python environments, check the `app/README.md` for technical setup notes. For the
smoothest experience, the Pinokio one-click install is Windows-only.

---

**Q: How much disk space do the models take?**

It varies quite a bit by engine. 🐱 **KittenTTS** is a few hundred megabytes — genuinely small. 🗣️
**Kokoro TTS** is in the 1–2 GB range. Voice cloning engines (**ChatterboxTTS**,
**ChatterboxTurbo**, **F5-TTS**) sit in the 2–6 GB range. 🐟 **Fish Speech**, 🎯 **IndexTTS2**, and
the **Qwen** engines are the heaviest — plan for 10–20 GB each. You don't need to install all 14
engines. Install only what you'll actually use. The app lets you pick engines individually and
models are only downloaded when you click **Load** for the first time.

---

**Q: Do I need an internet connection to use the app?**

Only for a few specific things: initial installation, first-time model downloads, and if you choose
to use a cloud LLM provider with AI Script Polish (like GitHub Models or Google Gemini). Once your
models are downloaded, generating speech is entirely offline. Your text, your reference audio, and
your generated files never leave your machine — unless you explicitly configure a cloud LLM provider
for AI Script Polish.

---

**Q: How do I install the app?**

Ultimate TTS Studio is designed for one-click installation through **Pinokio**, a free app launcher.
Open Pinokio, find Ultimate TTS Studio SUP3R Edition in the list, and click **Install**. Pinokio
handles the Python environment, dependencies, and everything else automatically. When it finishes,
click **Start** to open the app in your browser. The [Quick Start Guide](QUICK_START.md) walks you
through your first generation from there.

---

[↑ Back to top](#contents)

---

## Engines & Voices

---

**Q: Which engine sounds best?**

"Best" depends entirely on your goal. 🐟 **Fish Speech** and 🎯 **IndexTTS2** consistently produce
the most natural-sounding output — great for audiobooks and professional narration. 🎤
**ChatterboxTTS** and 🎵 **F5-TTS** are excellent for voice cloning from a short reference clip. 🗣️
**Kokoro TTS** is unbeatable for speed and simplicity when you don't need to clone a specific voice.
🐱 **KittenTTS** is small, fast, and fun for casual use. The
[Feature Matrix](FEATURE_MATRIX.md#3-use-case-recommendations) has a full use case guide — read it
to match an engine to your actual goal rather than chasing a single "best" answer.

---

**Q: Can I clone any voice?**

You can clone any voice you have clear reference audio for. Nine of the 14 engines support voice
cloning: 🎤 **ChatterboxTTS**, 🌍 **Chatterbox Multilingual**, 🚀 **Chatterbox Turbo**, 🐟 **Fish
Speech**, 🎯 **IndexTTS**, 🎯 **IndexTTS2**, 🎵 **F5-TTS**, 🎤 **VoxCPM**, and 🎭 **Qwen Voice
Clone**. Each engine accepts a short audio reference clip and uses it to generate new speech in that
voice. Quality depends heavily on your reference clip — clean, quiet audio with natural pacing gives
the best results.

> ⚠️ **Ethics reminder:** Only clone voices you have permission to use. Cloning someone else's voice
> without consent is unethical and potentially illegal in many jurisdictions.

---

**Q: How long does a reference clip need to be?**

Aim for **5 to 30 seconds** of clean, natural speech. Shorter clips (under 5 seconds) often produce
inconsistent results. Longer clips (over 60 seconds) don't necessarily improve quality and just take
longer to process. The ideal clip is someone speaking naturally at a normal pace — not reading a
list, not rushing, no music in the background. A phone recorded in a quiet room works well. You
don't need a studio microphone, but you do need a recording where the voice is the only thing you
can clearly hear.

---

**Q: Why does my cloned voice sound different from the reference?**

A few things affect cloning quality. Background noise is the biggest culprit — even subtle room echo
or low-level hum can degrade results noticeably. Short clips (under 8 seconds) may not capture
enough voice characteristics. Clips with music, multiple speakers, or strong effects like reverb
confuse the engine. Try a longer clip, record in a quieter environment, or add a **Reference Text**
transcription (the actual words spoken in the clip) — some engines like 🎤 **ChatterboxTTS** use
this to calibrate more precisely.

---

**Q: What's the difference between all 14 engines?**

Each engine has a different specialty: voice cloning, emotion control, speed, multilingual output,
or voice design. Rather than summarizing 14 engines here, the best resource is the
[Feature Matrix](FEATURE_MATRIX.md#2-engine-comparison-table), which compares them side by side
across eight capability dimensions. The
[User Guide — Section 9: Engine Reference](USER_GUIDE.md#9-engine-reference) gives a narrative
walkthrough of each engine's strengths, settings, and best use cases.

---

**Q: Can I use multiple engines in one conversation?**

Not currently. Each conversation session uses one active engine for all speakers. If you're in 🎭
**Conversation Mode** and want two characters with very different voice qualities, the best approach
is to pick the engine whose voice cloning fits both characters well (🎤 **ChatterboxTTS** is popular
for this, with a different reference clip per character). In 🎙️ **VibeVoice**, you assign different
voice profiles to each speaker — those profiles all come from the VibeVoice model itself.

---

[↑ Back to top](#contents)

---

## AI Script Polish

---

**Q: Do I need AI Script Polish?**

It's optional but genuinely helpful for almost every use case. Even at the **Minimal** level, it
expands abbreviations, converts numbers to spoken form, and handles dates and units — which means
your TTS engine doesn't have to guess how to say "Dr. Smith reviewed the 14.5 mg results on Feb.
3rd." For podcasts and audiobooks, the **Polish** and **Vivid** modes can transform flat prose into
something that actually sounds like it was written to be read aloud. If you're generating from
clean, already-spoken-style text, you can skip it. If your source text comes from the web,
documents, or anywhere else, AI Script Polish is worth enabling.

_AI Script Polish_ is labeled **"Narration Transform"** in the UI — look for it in the accordion
inside the **📝 TEXT TO SYNTHESIZE** tab.

---

**Q: Which LLM provider should I use?**

For most users, the simplest path is **Ollama** (local, no API key, free, runs on your computer) or
**LM Studio** (local, similar). These keep everything on your machine and don't require signing up
for anything. If you want cloud quality without a subscription, **GitHub Models** offers a free tier
that works well for light to moderate usage. Google Gemini also has a generous free tier. For a
side-by-side comparison of all seven providers — including speed, cost, and privacy trade-offs — see
the [Feature Matrix — LLM Provider Comparison](FEATURE_MATRIX.md#6-llm-provider-comparison).

---

**Q: Is my text sent to the cloud?**

Only if you configure a cloud LLM provider (GitHub Models, Google Gemini, Microsoft Foundry, or a
remote Custom OpenAI-compatible server). With those providers, the text you enter for AI Script
Polish is sent to that provider's API before being returned to the app. Generated audio is never
sent anywhere — it's produced locally regardless of which LLM provider you use. If you use a local
provider (Ollama, LM Studio, or vLLM), your text stays entirely on your machine. The app is
local-first by design.

---

**Q: Why does the AI Script Polish transform take so long?**

Transform time depends on three factors: the LLM provider you're using, the model running on that
provider, and the length of your text. Local providers on modest hardware (especially running a 7B+
model on CPU) can take 30–60 seconds for a paragraph. Cloud providers like GitHub Models or Gemini
are usually faster for long texts. Smaller models run faster but may produce less polished results.
If speed is a priority, try a smaller model on your local provider, or use a cloud provider for long
transforms.

---

**Q: What's the difference between Minimal, Polish, and Vivid?**

They differ in how much the AI changes your text:

- **Minimal** — Expands abbreviations, formats numbers, dates, and units for speech. Zero creative
  changes to your words.
- **Polish** — Everything Minimal does, plus smooths awkward phrasing and adds natural transitions.
  Your meaning stays the same; the flow improves.
- **Vivid** — Everything Polish does, plus adds dramatic pacing, emotional beats, and cinematic
  breathing. Best for audiobooks and storytelling where you want expressive, produced narration.

When in doubt: use Minimal for factual or technical content, Polish for podcasts and blogs, Vivid
for fiction and audiobook production. See the
[Feature Matrix — Transform Mode Comparison](FEATURE_MATRIX.md#4-transform-mode-comparison) for a
detailed side-by-side.

---

[↑ Back to top](#contents)

---

## Audio Quality

---

**Q: Why is my audio too loud, too quiet, or distorted?**

Volume and clarity issues usually have a quick fix. For audio that's too quiet, open the **Audio
Effects Studio** section and increase the **🎚️ Master Gain** — start with +3 to +6 dB and listen
again. For audio that's too loud or clipping, dial Master Gain down (try −3 to −6 dB). For 🐟 **Fish
Speech** in particular: this engine generates audio that is significantly louder than most others.
Start your system volume at around 50% when listening to Fish Speech output for the first time, then
adjust from there. Distortion usually means the gain is too high — reduce Master Gain and
regenerate.

> ⚠️ **Fish Speech volume warning:** Fish Speech output levels can be noticeably louder than other
> engines. Keep your speakers or headphones at a moderate volume for your first generation, then
> calibrate.

---

**Q: How do I make it sound like a professional podcast?**

A few things work together to get that polished sound. First, use AI Script Polish in **Polish**
mode to smooth your script for spoken delivery. Then, after generating, apply the Audio Effects
Studio chain: a light positive **EQ** boost on the mid frequencies, a small amount of **Reverb**
(room size 0.2–0.3, wetmix 0.15) for warmth, and a Master Gain adjustment to land at a comfortable
listening volume. The step-by-step version of this workflow is in
[Workflow 6: Add Professional Audio Effects](WORKFLOWS.md#6-add-professional-audio-effects).

---

**Q: What's the difference between WAV and MP3?**

**WAV** is uncompressed audio — larger files, full quality, no artifacts. Use WAV when you're going
to edit the audio in another tool (Audacity, DaVinci Resolve, Adobe Audition) or use it in a
production pipeline. **MP3** is compressed — much smaller files, tiny quality trade-off. Use MP3 for
sharing, distribution, uploading to podcast platforms, or anywhere file size matters more than
editing flexibility. When in doubt: generate WAV, keep it as your master, and export MP3 when you
need to share.

---

**Q: Where are my generated files saved?**

With autosave enabled (the default), every generation is saved as a structured bundle in
`app_state_outputs/<project>/` — that's the storage the **🕘 HISTORY** tab indexes and reads from.
If **Save backup copies to "outputs/" folder** is also checked (also on by default), a flat copy
landed in `outputs/` as well, organized by date. Audiobook conversions (from the 📚 **EBOOK TO
AUDIOBOOK** tab) always go to the `audiobooks/` folder. You can also grab the most recent generation
from the audio player on the right side of the screen using the download button.

To change where backup copies are stored, open the **🧭 Workspace Controls** accordion and switch
from "Project Folders" to "Custom Path" mode.

> 💡 **Only structured autosave bundles appear in History.** Moving a loose WAV file into `outputs/`
> won't make it show up in the History tab — the index tracks bundles with metadata, not loose
> files.

---

**Q: What is the History tab and how do I use it?**

The **🕘 HISTORY** tab shows a table of every generation saved through autosave. Each row includes
the project name, preset, timestamp, engine, voice, audio length, and seed. To revisit a past
generation:

1. Click the **🕘 HISTORY** tab.
2. Find your generation in the **Persisted Output Bundles** table (or use **Search History** to
   filter).
3. Note the **ID** in the left column.
4. Type that ID into the **History Record ID** field below the table.
5. Click **↩ Reload Into Text Tab**.

The app restores the original text, engine, all settings, AI Script Polish options, audio effects,
and the last seed into the **📝 TEXT TO SYNTHESIZE** tab — ready to regenerate or continue from
where you left off. History reload does not copy API keys back into the text tab, but the app can
still use keys already saved in the UI settings or provided through provider environment variables.

---

**Q: Can I change the audio format after generation?**

The app generates audio in the format you selected (WAV or MP3) at generation time. If you want to
change formats after the fact, the easiest option is to use a free converter like
[Audacity](https://www.audacityteam.org/) or [FFmpeg](https://ffmpeg.org/) to convert between
formats. To avoid the extra step in future, set your preferred format before generating: the format
selector is in the engine settings panel or in the eBook conversion options, depending on which tab
you're using.

---

[↑ Back to top](#contents)

---

## Troubleshooting

---

**Q: The model won't load — what do I do?**

The most common cause is insufficient GPU memory (VRAM). Before trying to load a new engine, unload
any models you're not using: open **Model Management**, find the loaded engines, and click
**Unload** on each one. Free up as much VRAM as possible, then try again. If it still fails, close
other GPU-intensive applications (games, other AI apps, video editors). If you're trying to load a
heavy engine like 🐟 **Fish Speech** or 🎯 **IndexTTS2** on a card with 6 GB VRAM, consider using a
lighter engine like 🐱 **KittenTTS** or 🗣️ **Kokoro TTS** instead — both deliver solid results with
significantly lower memory overhead.

---

**Q: Generation is very slow — what can I do?**

First, check that your NVIDIA GPU drivers are up to date — outdated drivers can cut performance
significantly. Second, confirm the model is actually loaded and running on GPU rather than CPU (the
Model Management panel shows load state). Third, if you have multiple models loaded, try unloading
the ones you're not using — competing for VRAM slows everything down. For fast generation with good
quality, 🐱 **KittenTTS** and 🗣️ **Kokoro TTS** are the speed leaders. Slow generation with voice
cloning engines (ChatterboxTTS, Fish Speech) on a lower-end card is expected — these models are
doing significantly more compute per second of audio.

---

**Q: I get an out-of-memory error — how do I fix it?**

An out-of-memory error almost always means you've run out of VRAM. Steps to resolve:

<!-- screenshot: Model Management accordion showing one or more engines in loaded state with Unload buttons highlighted -->

1. Open **Model Management** and unload every model that's currently loaded.
2. Close any other applications using the GPU (particularly other AI tools, games, or video
   rendering software).
3. Try again with only the one engine you need.

If it still fails, the engine you're trying to use likely requires more VRAM than your card has. See
the [Feature Matrix](FEATURE_MATRIX.md#2-engine-comparison-table) for a comparison of engine memory
demands and find a lighter alternative.

---

**Q: The app won't start — what should I check?**

Open Pinokio and look at the terminal output in the **Start** log — it usually shows exactly what
went wrong. Common culprits: a port conflict (another app is using the same port), a missing
dependency, or a Python environment issue. If the terminal shows a port conflict, try restarting
Pinokio and launching again. If it shows a Python or package error, try **Reset** in Pinokio (this
reinstalls dependencies without losing your models or preset files). If you're stuck, check the
`logs/api/latest` file in the project folder for the full error trail.

---

**Q: Fish Speech models aren't loading — what do I do?**

🐟 **Fish Speech** is the only engine that requires a manual download step before it can be loaded.
The download isn't automatic. Here's how to trigger it:

<!-- screenshot: Model Management accordion expanded, showing the Fish Speech sub-section with Download button visible -->

1. Open the **Model Management** accordion at the top of the left column.
2. Find the **Fish Speech** section and expand it.
3. Click the **Download** button inside that section.
4. Wait for the download to complete — Fish Speech models are large (10+ GB), so this takes a few
   minutes on a fast connection.
5. Once the download finishes, click **Load** as normal.

If the Download button doesn't appear, you may be looking at the wrong section — the Fish Speech
entry in Model Management has its own sub-accordion. Expand it fully to find the download controls.

---

**Q: AI Script Polish says "connection failed" — how do I fix it?**

A connection failure usually means one of three things: the provider isn't running, the settings are
wrong, or the API key is missing or incorrect. Check each in order:

1. **For local providers (Ollama, LM Studio):** Make sure the app is actually running on your
   computer. Ollama and LM Studio both need to be started before the app can reach them.
2. **For cloud providers:** Double-check your API key — copy it fresh from your provider's dashboard
   and paste it in. Keys with extra whitespace or a missing character will silently fail.
3. **Model name:** The model name field is case-sensitive and must match exactly what your provider
   expects. An incorrect model name is a common source of connection errors.
4. Use the **🔗 Test Connection** button inside the AI Script Polish section to confirm the
connection before running a full transform.
<!-- screenshot: AI Script Polish (Narration Transform) accordion showing the provider settings fields and the Test Connection button -->

---

**Q: How do I keep my OpenRouter API key between sessions on Windows?**

Use either of these two supported paths:

1. **Save it in the app UI:** paste the key into the **API Key** field and click **Save LLM
   Settings** (or **💾 Save Settings** in the Assistant tab).
2. **Use a Windows environment variable:** run this in PowerShell:

   ```powershell
   [System.Environment]::SetEnvironmentVariable("OPENROUTER_API_KEY", "YOUR_OPENROUTER_KEY", "User")
   ```

   Then fully close and reopen VS Code and relaunch Ultimate TTS Studio. Existing terminals and app
   processes do not see newly added user environment variables until they restart.

In the UI, the **API key source** line will tell you whether the active key came from the app UI,
the environment, or is still missing.

---

[↑ Back to top](#contents)

---

## Advanced

---

**Q: What is MCP and do I need it?**

MCP stands for Model Context Protocol — it's a way for coding tools like GitHub Copilot, Cursor, or
custom scripts to talk to the app programmatically. If you're a developer and want to call TTS
Studio from code, trigger speech generation through an AI coding assistant, or build automation
around the app, MCP is for you. If you're a content creator using the app through the browser UI,
you don't need MCP at all — it's a completely separate, optional install that runs alongside the
main app. Full details are in the [User Guide — Section 16: MCP Integration](USER_GUIDE.md).

---

**Q: Can I use TTS Studio programmatically?**

Yes. The MCP sidecar exposes 13 tools for programmatic access: listing engines, managing voices,
transforming text, submitting synthesis jobs, checking job status, and more. You install it
separately from within Pinokio (look for the **Install MCP** option), then connect your coding tool
to it. The `app/README.md` contains the full API reference including example calls in Python,
JavaScript, and cURL. See also
[Workflow 8: Use TTS Studio from Your Code Editor](WORKFLOWS.md#8-use-tts-studio-from-your-code-editor)
for a hands-on walkthrough.

---

**Q: How do I back up my voice presets?**

Your named voice presets are stored in a single file: `app_state/presets.json`. Copy that file to
any backup location — cloud storage, an external drive, another folder — and you're done. Associated
voice audio files are stored in `app_state/voices/`. Back up both to fully preserve all your
presets. To restore on a fresh installation, copy both back to the same paths before launching the
app. To share presets with another machine, copy the same two locations and paste them in after
install.

---

[↑ Back to top](#contents)

---

Ultimate TTS Studio SUP3R Edition — Documentation Suite v1.0
