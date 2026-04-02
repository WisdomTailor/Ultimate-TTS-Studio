# Quick Start Guide — Ultimate TTS Studio SUP3R Edition

**Your first generated audio in under 5 minutes.**

This guide takes you from a freshly launched app to a working audio file. It skips options you
don't need yet and focuses on the fastest path to something you can hear.

> **Already installed?** Jump straight to [Step 1: Launch the App](#step-1-launch-the-app).  
> **Need installation help?** Open the Pinokio launcher and click **Install**, then come back here.

---

## What You'll Do

1. Launch the app from Pinokio
2. Pick a beginner-friendly engine
3. Load the model into memory
4. Type your first sentence
5. Click Generate and listen
6. *(Optional)* Clean up the text with AI Script Polish
7. *(Optional)* Try a second engine to compare
8. Explore from here

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

| Engine | Best for first try if... |
|---|---|
| **🗣️ Kokoro TTS** | You want to generate speech immediately, no setup. Comes with built-in voices. |
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

<!-- screenshot: Engine Selection accordion showing the Kokoro tab selected -->

1. Scroll down slightly in the left column to find the **Engine Selection** accordion. Expand it.
2. Click the **🗣️ Kokoro TTS** tab (or the tab for your chosen engine).
3. For Kokoro: a **Voice** dropdown will appear. Pick any voice from the list — `af_heart` and
   `am_michael` are popular starting points.

You don't need to change any other settings. The defaults work fine for a first test.

---

## Step 5: Type Your Text

<!-- screenshot: The 📝 TEXT TO SYNTHESIZE tab with a sample sentence in the text box -->

1. Click the **📝 TEXT TO SYNTHESIZE** tab at the top of the left column (it's usually the default).
2. In the large text area, type or paste a sentence. Something short and clear works best for a
   first test:

   > *"Welcome to Ultimate TTS Studio. Let's see what this engine sounds like."*

Keep it to two or three sentences for now.

---

## Step 6: Generate and Listen

Look for the **Generate** button at the bottom of the left column. Click it.

<!-- screenshot: The Generate button, and the right column showing an audio player after generation -->

The right column will show a progress indicator while the audio is being created. When it's done,
an audio player appears. Click play and listen.

**What you're hearing:** The exact text you typed, spoken by the voice you selected, using the TTS
engine you loaded.

> **If nothing happens:** Check that the status indicator next to your engine in Model Management
> is green (loaded). If it's not, the model didn't finish loading — wait a moment and try again.

---

## Step 7 (Optional): Clean Up Your Text with AI Script Polish

TTS engines read text literally. Numbers, abbreviations, and awkward punctuation can produce odd
results. **AI Script Polish** is a feature that prepares your text before it's spoken — expanding
"e.g." to "for example," smoothing run-on sentences, and adding natural pacing cues.

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

You'll notice the generated speech sounds more natural — smoother transitions, cleaner
pronunciation of numbers and abbreviations.

> **Skipping this step is fine.** AI Script Polish is optional. Come back to it once you're
> comfortable with basic generation.

---

## Step 8 (Optional): Try a Different Engine

Each engine has its own sound. Spending five minutes comparing two of them is the fastest way to
understand which one suits your project.

1. Go back to **Model Management** and load a second engine — try **🎤 ChatterboxTTS** or
   **🐱 KittenTTS** (KittenTTS is tiny and fast, with 8 built-in expressive voices).
2. In the **Engine Selection** accordion, click the new engine's tab.
3. Configure its voice option (KittenTTS shows a voice dropdown; ChatterboxTTS asks for a reference
   audio clip).
4. Click **Generate** with the same text.

Listen to both results side by side. You'll immediately hear how engines differ in tone, naturalness,
and character.

---

## Where to Go Next

You've generated your first audio. Here's what each next step unlocks:

| I want to... | Go to... |
|---|---|
| Understand every control in depth | [USER_GUIDE.md](USER_GUIDE.md) |
| Compare all 14 engines at a glance | [FEATURE_MATRIX.md](FEATURE_MATRIX.md) |
| Clone my own voice | [WORKFLOWS.md](WORKFLOWS.md) — *Clone My Voice and Read Text* |
| Make a two-person podcast or dialogue | [WORKFLOWS.md](WORKFLOWS.md) — *Create a Podcast Episode* |
| Convert an eBook to an audiobook | [WORKFLOWS.md](WORKFLOWS.md) — *Convert My eBook to Audiobook* |
| Get answers to common problems | [FAQ.md](FAQ.md) |

---

*Ultimate TTS Studio SUP3R Edition — Documentation Suite v1.0*
