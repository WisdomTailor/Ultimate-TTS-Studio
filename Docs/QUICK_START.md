# Quick Start Guide — Ultimate TTS Studio SUP3R Edition

**Your first generated audio in under 5 minutes.**

This guide takes you from a freshly launched app to a working audio file. It skips options you don't
need yet and focuses on the fastest path to something you can hear.

> **Already installed?** Jump straight to [Step 1: Launch the App](#step-1-launch-the-app).  
> **Need installation help?** Open the Pinokio launcher and click **Install**, then come back here.

---

## What You'll Do

1. Launch the app from Pinokio
2. Pick a beginner-friendly engine
3. Load the model into memory
4. Type your first sentence
5. Click Generate and listen
6. _(Optional)_ Clean up the text with AI Script Polish
7. _(Optional)_ Try a second engine to compare
8. Explore from here

**Ready for more?** Jump to [Your First Voice Cloning Project](#your-first-voice-cloning-project) to
produce a multi-speaker audiobook with cloned voices using Fish Speech.

---

## Step 1: Launch the App

Open **Pinokio**, find **Ultimate TTS Studio SUP3R Edition** in your app list, and click **Start**.

A browser tab will open automatically — usually at an address like `http://127.0.0.1:7860`. That's
the app. Everything happens in that browser window.

<!-- screenshot: Pinokio launcher showing the Start button for Ultimate TTS Studio -->

You'll see a two-column layout. The left side has all the controls; the right side shows your
generated audio when it's ready.

---

## Step 2: Choose Your First Engine

Ultimate TTS Studio includes 14 TTS engines. You don't need to know them all right now. For your
first run, use one of these two — both are beginner-friendly and auto-download their models:

| Engine               | Best for first try if...                                                                 |
| -------------------- | ---------------------------------------------------------------------------------------- |
| **🗣️ Kokoro TTS**    | You want to generate speech immediately, no setup. Comes with built-in voices.           |
| **🎤 ChatterboxTTS** | You have a short voice recording of someone (5–30 seconds) and want to clone that voice. |

**Not sure? Choose 🗣️ Kokoro TTS.** It's the fastest path to audio with no extra files needed.

---

## Step 3: Load the Model

Before any engine can generate speech, its model needs to be loaded into your GPU memory. This is a
manual step by design — it lets you control which models are active and keeps memory usage
predictable.

<!-- screenshot: Model Management accordion at the top of the left column, showing Kokoro with a Load button -->

1. Look for the **Model Management** accordion near the top of the left column. Click it to expand
   if it isn't already open.
2. Find **🗣️ Kokoro TTS** (or whichever engine you chose) in the list.
3. Click the **Load** button next to it.

The first time you load Kokoro, the app downloads the model automatically. This takes a minute or
two depending on your internet speed. A status indicator next to the engine name will turn green
when it's ready.

> **Tip:** You only need to download once. After the first load, the model lives on your drive and
> loads from there in seconds.

---

## Step 4: Select the Engine and Choose a Voice

With the model loaded, tell the app which engine to use for generation.

<!-- screenshot: Engine Selection accordion showing the engine dropdown with Kokoro TTS selected, and the Engine Settings panel below displaying Kokoro's voice options -->

1. Scroll down slightly in the left column to find the **Engine Selection** accordion. Expand it.
2. In the **Engine** dropdown, select **🗣️ Kokoro TTS** (or your chosen engine).
3. The **Engine Settings** panel below updates to show that engine's options. For Kokoro, a
   **Voice** dropdown appears — pick any voice from the list. `af_heart` and `am_michael` are
   popular starting points.

You don't need to change any other settings. The defaults work fine for a first test.

---

## Step 5: Type Your Text

<!-- screenshot: The 📝 TEXT TO SYNTHESIZE tab with a sample sentence in the text box -->

1. Click the **📝 TEXT TO SYNTHESIZE** tab at the top of the left column (it's usually the default).
2. In the large text area, type or paste a sentence. Something short and clear works best for a
   first test:

   > _"Welcome to Ultimate TTS Studio. Let's see what this engine sounds like."_

Keep it to two or three sentences for now.

---

## Step 6: Generate and Listen

Look for the **Generate** button at the bottom of the left column. Click it.

<!-- screenshot: The Generate button, and the right column showing an audio player after generation -->

The right column will show a progress indicator while the audio is being created. When it's done, an
audio player appears. Click play and listen.

Your generated audio plays directly in the browser. With autosave on (the default), the generation
is also saved as a bundle you can browse and reload from the **🕘 HISTORY** tab. A flat backup copy
also lands in the `outputs/` folder when that option is checked (on by default).

**What you're hearing:** The exact text you typed, spoken by the voice you selected, using the TTS
engine you loaded.

> **If nothing happens:** Check that the status indicator next to your engine in Model Management is
> green (loaded). If it's not, the model didn't finish loading — wait a moment and try again.

---

## Step 7 (Optional): Clean Up Your Text with AI Script Polish

TTS engines read text literally. Numbers, abbreviations, and awkward punctuation can produce odd
results. **AI Script Polish** (labeled **Narration Transform** in the UI) is a feature that prepares
your text before it's spoken — expanding "e.g." to "for example," smoothing run-on sentences, and
adding natural pacing cues.

<!-- screenshot: The Narration Transform accordion inside the 📝 TEXT TO SYNTHESIZE tab, expanded -->

1. In the **📝 TEXT TO SYNTHESIZE** tab, look for the **Narration Transform** accordion below the
   text input. Expand it.
2. Choose a **Transform Mode**:
   - **Minimal** — Expands abbreviations and numbers only. No creative changes.
   - **Polish** — Smooths phrasing and adds natural transitions. Good for most use cases.
   - **Vivid** — Adds dramatic pacing and emotional beats. Best for audiobooks and storytelling.
3. Select an **LLM Provider**. If you have LM Studio or Ollama installed locally, choose one of
   those — no API key needed. Otherwise choose **GitHub Models** (free, requires a GitHub account
   and token) or **Google Gemini API**.
4. Configure the provider (enter an API key if required, pick a model), then click **🔗 Test
   Connection** to confirm it's working.
5. Click **Apply Transform**. The text box updates with the polished version.
6. Review the result, then click **Generate** as before.

You'll notice the generated speech sounds more natural — smoother transitions, cleaner pronunciation
of numbers and abbreviations.

> **Skipping this step is fine.** AI Script Polish is optional. Come back to it once you're
> comfortable with basic generation.

---

## Step 8 (Optional): Try a Different Engine

Each engine has its own sound. Spending five minutes comparing two of them is the fastest way to
understand which one suits your project.

1. Go back to **Model Management** and load a second engine — try **🎤 ChatterboxTTS** or **🐱
   KittenTTS** (KittenTTS is tiny and fast, with 8 built-in expressive voices).
2. In the **Engine Selection** accordion, select the new engine from the **Engine** dropdown.
3. The **Engine Settings** panel updates for your chosen engine — configure its voice option
   (KittenTTS shows a voice dropdown; ChatterboxTTS asks for a reference audio clip).
4. Click **Generate** with the same text.

Listen to both results side by side. You'll immediately hear how engines differ in tone,
naturalness, and character.

---

## Your First Voice Cloning Project

**Three unique voices. One complete story.**

The Quick Start above gave you audio in five minutes using a pre-built voice. This workflow takes
the next step: you'll produce a short multi-speaker piece where each character sounds like a real,
distinct person — because each voice is cloned from a real reference clip.

You'll use **🐟 Fish Speech**, the voice-cloning engine in the suite, with three voice references:
Narrator, a male character, and a female character. Budget about 20 minutes for your first run. The
second run takes five.

---

### Step 1: Paste Your Story

Click the **📝 TEXT TO SYNTHESIZE** tab and paste your story into the text area. Three or four short
paragraphs with some dialogue work well for a test:

> _The forest was quiet except for the crunch of leaves. "Are you sure about this?" Emma asked.
> Marcus didn't answer. He just kept walking._

<!-- screenshot: 📝 TEXT TO SYNTHESIZE tab with story text pasted in the text area -->

---

### Step 2: Polish the Text with AI Script Polish

TTS engines read text literally. Dialogue tags, em dashes, and raw quoted speech can produce
unnatural pauses or mispronunciations. **AI Script Polish** (accessed via the **Narration
Transform** accordion in the **📝 TEXT TO SYNTHESIZE** tab) rewrites the text to flow naturally when
spoken.

<!-- screenshot: Narration Transform accordion expanded inside the 📝 TEXT TO SYNTHESIZE tab -->

1. Scroll down in the **📝 TEXT TO SYNTHESIZE** tab and expand the **Narration Transform**
   accordion.
2. Set **Transform Mode** to **Vivid** — the best choice for storytelling and dramatic narration.
3. Choose an **LLM Provider**. Ollama or LM Studio (if running locally) require no API key. Cloud
   options include GitHub Models and Google Gemini.
4. Click **🔗 Test Connection** to confirm the connection.
5. Click **Apply Transform** and review the result in the text area.

> 💡 **Tip:** Vivid mode often restructures dialogue into `Speaker: Text` format automatically —
> exactly what Conversation Mode expects. Review the output before moving on and correct any speaker
> names that don't look right.

---

### Step 3: Switch to Conversation Mode

Click the **🎭 CONVERSATION MODE** tab. Paste your polished script into the script text area. The
script must follow this format — one line per spoken segment:

```text
Narrator: The forest was quiet except for the crunch of leaves.
Emma: Are you sure about this?
Narrator: Marcus didn't answer. He just kept walking.
```

<!-- screenshot: 🎭 CONVERSATION MODE tab with speaker-labeled script in the text area -->

---

### Step 4: Analyze the Script

Click **Analyze Script**. The app detects every unique speaker name in the script and builds a
character roster — one card per speaker.

For a three-voice story you'll see three cards: **Narrator**, **Emma**, and **Marcus** (or whatever
names your script uses).

<!-- screenshot: Character roster showing three speaker cards after clicking Analyze Script -->

> **Typo alert:** Speaker names are matched exactly. `narrator` and `Narrator` are treated as two
> separate speakers. Double-check the script before analyzing if the roster looks wrong.

---

### Step 5: Download and Load Fish Speech

Fish Speech requires a one-time manual model download. Open the **Model Management** accordion and
find **🐟 Fish Speech**. Click **Load**.

If the model hasn't been downloaded yet, the app displays an error with the exact command to run:

```python
hf download cocktailpeanut/oa --local-dir ./checkpoints/openaudio-s1-mini
```

Open the **Pinokio terminal** and run that command. When the download finishes, click **Load**
again. The status badge turns green when Fish Speech is ready.

<!-- screenshot: Model Management accordion showing 🐟 Fish Speech with Load button and status badge -->

> 💡 **One-time step.** After the download, Fish Speech loads from your drive in seconds on every
> future session.

---

### Step 6: Select Fish Speech as Your Engine

Scroll to the **Engine Selection** accordion and open the **Engine** dropdown. Select **🐟 Fish
Speech**. The **Engine Settings** panel updates to show Fish Speech's voice cloning options.

<!-- screenshot: Engine Selection accordion with 🐟 Fish Speech selected in the Engine dropdown -->

---

### Step 7: Upload a Voice Sample for Each Speaker

Each speaker card in the character roster has three controls:

- **Audio upload** — drag-and-drop a file, click to browse, or record via microphone
- **Reference Text** — an optional transcription of what's spoken in the clip
- **Transcribe** button — auto-fills the Reference Text from the uploaded clip

For each of your three speakers, upload a 5–30 second voice clip. Supported formats: WAV, MP3, FLAC,
M4A, OGG.

<!-- screenshot: Character roster card showing the audio upload control, Reference Text field, and Transcribe button -->

**Three things that make a good reference clip:**

- Clean audio — no background music or noise
- Natural, conversational speech pace
- 10–20 seconds (longer doesn't improve the clone; shorter reduces accuracy)

> 💡 **No clips ready?** Record yourself on your phone reading a few sentences, then upload the
> file. Studio quality isn't required.

---

### Step 8: Adjust the Timing

Below the character roster, two timing controls shape how the conversation flows:

- **Speaker Change Pause** — silence between two different speakers. Default is 0.8s. For a narrated
  story, **1.0s** gives listeners a clear beat between characters.
- **Same Speaker Pause** — silence when the same speaker has back-to-back lines. The default 0.3s
  works well for most scripts.

---

### Step 9: Generate

Click **Generate**. Fish Speech processes each line individually using its assigned voice — this
takes longer than single-speaker generation. A progress indicator in the right column tracks each
line as it completes.

> ⚠️ **Fish Speech can be louder than expected.** Set your system volume to 50% before the first
> generation plays.

<!-- screenshot: Right column showing per-line progress during multi-speaker generation -->

---

### Step 10: Listen and Save

When generation completes, the combined audio plays in the right column. The file is automatically
saved to `outputs/` with a name like `conversation_fish_speech_20260403_143022.wav`.

> 💡 **Tip:** The filename uses the engine name and a timestamp, not your project name. Rename the
> file after generation — something like `forest_story_v1.wav` — so you can find it easily later.

**Want to refine a single line?** Use the line editor in **🎭 CONVERSATION MODE** to adjust one
line's text or reference audio and regenerate just that segment, without redoing the whole script.

---

## Where to Go Next

You've generated your first audio. Here's what each next step unlocks:

| I want to...                            | Go to...                                                                          |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| Understand every control in depth       | [USER_GUIDE.md](USER_GUIDE.md)                                                    |
| Compare all 14 engines at a glance      | [FEATURE_MATRIX.md](FEATURE_MATRIX.md)                                            |
| Clone my own voice                      | [WORKFLOWS.md](WORKFLOWS.md) — _Clone My Voice and Read Text_                     |
| Make a two-person podcast or dialogue   | [WORKFLOWS.md](WORKFLOWS.md) — _Create a Podcast Episode_                         |
| Try a multi-speaker, voice-cloned story | [Your First Voice Cloning Project](#your-first-voice-cloning-project) (this page) |
| Convert an eBook to an audiobook        | [WORKFLOWS.md](WORKFLOWS.md) — _Convert My eBook to Audiobook_                    |
| Get answers to common problems          | [FAQ.md](FAQ.md)                                                                  |

---

Ultimate TTS Studio SUP3R Edition — Documentation Suite v1.0
