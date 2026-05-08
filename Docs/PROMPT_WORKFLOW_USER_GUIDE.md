# User Guide: From Prompt to Narrated Video — Step by Step

**Audience:** Beginners to intermediate users of Ultimate TTS Studio **Goal:** Walk you through the
complete workflow — from generating a story with an LLM, to producing a narrated audio story with AI
voices, to building a video with sequential AI illustrations.

---

## Table of Contents

1. [Overview — What We're Building](#overview)
2. [What You Need Before Starting](#prerequisites)
3. [The 5-Phase Workflow](#the-5-phase-workflow)
   - Phase 1: Generate the Story with an LLM
   - Phase 2: Prepare the Narration Script
   - Phase 3: Generate Audio with TTS Studio
   - Phase 4: Generate Visual Illustrations
   - Phase 5: Assemble the Final Video
4. [Worked Example: "The Unicorn"](#worked-example)
5. [Troubleshooting](#troubleshooting)
6. [Quick-Reference Cheat Sheet](#cheat-sheet)

---

<a name="overview"></a>

## 1. Overview — What We're Building

You will create a **narrated audio story video** that combines:

- **AI-generated story text** (written by an LLM like Claude or GPT-4)
- **Multi-voice TTS narration** (using Ultimate TTS Studio with different AI voices for each
  character)
- **Sequential AI illustrations** (images generated to match each scene)
- **Background music and sound effects** (for atmosphere)

The final output is a video file (MP4) that plays like an audiobook with visuals — perfect for
platforms that support narrated adult content.

**How long does this take?**

- First time: 2–4 hours (learning curve)
- After practice: 30–60 minutes per episode

**What skill level is required?**

- No coding required
- Basic computer file management (copy/paste, folders)
- Willingness to follow steps in order

---

<a name="prerequisites"></a>

## 2. What You Need Before Starting

### Software

| Tool                                                           | Purpose                             | Where to Get It                                |
| -------------------------------------------------------------- | ----------------------------------- | ---------------------------------------------- |
| **Ultimate TTS Studio**                                        | TTS audio generation, voice cloning | Already installed in your workspace            |
| **An LLM** (Claude, GPT-4, or local model)                     | Story generation                    | claude.ai, chatgpt.com, or LM Studio for local |
| **An image generator** (Stable Diffusion, Flux, or Midjourney) | Visual illustrations                | Automatic1111, ComfyUI, or midjourney.com      |
| **Video editor** (optional)                                    | Final assembly                      | DaVinci Resolve (free), CapCut, or FFmpeg      |

### Accounts & Access

- [ ] Access to an LLM that handles NSFW content (Claude Sonnet 3.5+ recommended)
- [ ] Access to an image generator that handles NSFW content (Stable Diffusion recommended)
- [ ] Ultimate TTS Studio running locally
- [ ] At least 10 GB free disk space for audio and image files

### Folder Setup

Create this folder structure on your computer before starting:

```text
My_Narrated_Stories/
+-- 01_Raw_Stories/          <- LLM-generated story text goes here
+-- 02_Narration_Scripts/    <- Formatted scripts with voice tags
+-- 03_Audio/                <- TTS-generated audio files
|   +-- Narrator/
|   +-- Character_A/
|   +-- Character_B/
+-- 04_Images/               <- AI-generated illustrations
|   +-- Scene_01/
|   +-- Scene_02/
|   +-- ...
+-- 05_Music_SFX/            <- Background music and sound effects
+-- 06_Final_Output/         <- Assembled video files
```

---

<a name="the-5-phase-workflow"></a>

## 3. The 5-Phase Workflow

### Phase 1: Generate the Story with an LLM

**Goal:** Produce a well-structured story with distinct character voices, clear scene breaks, and
TTS-friendly formatting.

#### Step 1.1: Choose Your Story Parameters

Before prompting, decide:

- **Genre:** Interracial Romance / Loving Wives
- **Setting:** (e.g., "a small Texas town," "a luxury high-rise in Manhattan")
- **Main characters:** Names, ages, backgrounds, physical descriptions
- **Heat level:** How explicit should the intimate scenes be?
- **Story length:** 3,000–8,000 words for a single episode

#### Step 1.2: Use the Master Story Prompt

Copy the entire prompt below into your LLM. This is the same prompt from Part 3 of the research
document, simplified for direct use:

---

**COPY THIS ENTIRE BLOCK INTO YOUR LLM:**

```text
You are an award-winning erotic fiction author specializing in interracial romance and loving wives stories. Your stories consistently rate 4.8+ stars.

Write an original story following these rules:

GENRE: Interracial Romance / Loving Wives
SETTING: [DESCRIBE YOUR SETTING]
TONE: Emotionally intense, sensual, character-driven
HEAT LEVEL: Explicit — include detailed intimate scenes that advance character development
WORD COUNT: 5,000-8,000 words
POV: First person (male protagonist)

CHARACTERS:
- [CHARACTER A NAME]: [Age], [Race], [Occupation], [Physical description], [Personality]
- [CHARACTER B NAME]: [Age], [Race], [Occupation], [Physical description], [Personality]
- [CHARACTER C NAME if needed]: [Same details]

PLOT OUTLINE:
1. HOOK: [What's the opening situation?]
2. SETUP: [How do the characters meet/connect?]
3. RISING ACTION: [What creates tension/desire?]
4. FIRST INTIMACY: [First erotic scene — must be emotionally earned]
5. COMPLICATION: [What threatens the connection?]
6. CLIMAX: [Emotional and physical peak]
7. RESOLUTION: [Satisfying ending]

WRITING RULES:
- 60% dialogue, 40% narration/description
- Every character must have a DISTINCT voice (different vocabulary, rhythm, speech patterns)
- Use subtext — characters rarely say exactly what they mean
- Include natural speech: interruptions, trailing off, topic changes
- Add physical action beats between dialogue lines
- Intimate scenes: minimum 500 words of buildup before explicit content
- Engage all 5 senses in every major scene
- Mark scene breaks with *** every 1,500-2,000 words
- Include internal monologue in *italics*
- No fading to black — explicit content is expected
- All characters are adults (18+)

OUTPUT FORMAT:
Title: [Evocative title]
Author Note: [1-2 sentence context]
[Chapter header]
[Story body]
End Note: [Tease what comes next]
```

---

#### Step 1.3: Review and Refine the Output

After the LLM generates the story, check for:

- [ ] **Distinct voices:** Can you tell who's speaking without looking at the attribution?
- [ ] **Scene breaks:** Are there clear `***` markers between scenes?
- [ ] **Dialogue ratio:** Is at least 60% of the story dialogue?
- [ ] **Sensory details:** Does each scene have sight, sound, touch, smell, taste?
- [ ] **Emotional arc:** Does the story build tension and release it satisfyingly?

If anything is missing, ask the LLM to revise:

> "Rewrite Scene 3 with more sensory detail and stronger character voice for [Character Name]."

#### Step 1.4: Save the Story

Save the finished story as a `.txt` file in your `01_Raw_Stories/` folder.

**Filename format:** `StoryTitle_Episode01_Raw.txt`

---

### Phase 2: Prepare the Narration Script

**Goal:** Convert the raw story into a script formatted for TTS generation, with voice tags, pause
markers, and visual cues.

#### Step 2.1: Split the Story into Narration Segments

Read through the story and divide it into segments of 150–300 words each. Each segment should be a
single "beat" — a moment of narration, a dialogue exchange, or a description.

**How to split:**

- Split at natural paragraph breaks
- Split when the speaker changes (if it's a long monologue)
- Split at scene transitions
- Split before and after sound effects or music cues

#### Step 2.2: Add Voice Tags and Direction

For each segment, add tags at the top:

```text
[NARRATOR: Jaime — warm, conversational, self-deprecating]
[EMOTION: lighthearted, curious]
[PAUSE: 1s before next segment]
[VISUAL: CUT TO — exterior of a Texas bar at dusk]
```

**Tag Reference:**

| Tag                     | Purpose                     | Example                                       |
| ----------------------- | --------------------------- | --------------------------------------------- |
| `[NARRATOR: name]`      | Who is speaking             | `[NARRATOR: Jaime]`                           |
| `[EMOTION: type]`       | Emotional direction         | `[EMOTION: tense, worried]`                   |
| `[PAUSE: duration]`     | Silence before next segment | `[PAUSE: 2s]`                                 |
| `[BEAT]`                | Short dramatic pause        | `[BEAT]`                                      |
| `[SFX: description]`    | Sound effect needed         | `[SFX: door closing, footsteps]`              |
| `[MUSIC: description]`  | Music cue                   | `[MUSIC: soft jazz, low volume]`              |
| `[VISUAL: description]` | What the image should show  | `[VISUAL: CUT TO — couple dancing]`           |
| `[WHISPER]`             | Character is whispering     | `[WHISPER] I can't believe this is happening` |
| `[BREATHLESS]`          | Character is out of breath  | `[BREATHLESS] I've been looking for you`      |

#### Step 2.3: Create the Voice Assignment Map

Make a table of every character and their voice characteristics:

| Character        | Voice Description                                     | TTS Engine                    | Voice Settings                |
| ---------------- | ----------------------------------------------------- | ----------------------------- | ----------------------------- |
| Jaime (Narrator) | Warm, conversational, self-deprecating, working-class | Chatterbox Turbo              | Speed: 0.95, Temperature: 0.7 |
| Jen              | Confident, warm, playful, slightly husky              | F5-TTS (clone from reference) | Speed: 1.0, Temperature: 0.8  |
| Steve            | Business-like, slightly slurred when drunk, confident | Chatterbox Turbo              | Speed: 1.05, Temperature: 0.6 |

#### Step 2.4: Save the Script

Save the formatted script in `02_Narration_Scripts/`.

**Filename format:** `StoryTitle_Episode01_Script.md`

---

### Phase 3: Generate Audio with TTS Studio

**Goal:** Convert each narration segment into high-quality audio using different voices for each
character.

#### Step 3.1: Launch Ultimate TTS Studio

Open TTS Studio and ensure your preferred engines are loaded:

- **Chatterbox Turbo** — for narrator and characters without voice clones
- **F5-TTS** — for characters where you have reference audio
- **IndexTTS2** — for multi-speaker consistency

#### Step 3.2: Generate Audio Segment by Segment

For each segment in your narration script:

1. **Select the correct voice** based on your Voice Assignment Map
2. **Paste the text** (without the tags — just the spoken words)
3. **Set the emotion/temperature** per your script notes
4. **Generate the audio**
5. **Listen to the result** — if it sounds off, adjust temperature/speed and regenerate
6. **Export as WAV** (for highest quality) into the correct character folder

**Pro tip:** Generate all segments for one character before switching voices. This maintains
consistency.

#### Step 3.3: Post-Processing

For each audio file:

- **Normalize volume** to -3 dB (prevents some segments being louder than others)
- **Add subtle reverb** for scenes in large spaces (bars, bedrooms)
- **Add room tone** for scenes in quiet spaces (offices, cars)
- **Trim silence** at the beginning and end of each clip

#### Step 3.4: Compile the Audio Track

Import all segments into your video editor or audio software in order. Add:

- Background music (low volume, -20 dB relative to narration)
- Sound effects at marked cues
- Crossfades (0.5–1 second) between segments for smooth transitions

Export the final audio as a single WAV or FLAC file.

---

### Phase 4: Generate Visual Illustrations

**Goal:** Create 15–25 AI-generated images that match the story's key visual moments.

#### Step 4.1: Create the Visual Storyboard

From your narration script, identify the 15–25 most important visual moments. For each, write:

1. **Shot type:** Close-up, medium shot, wide shot, etc.
2. **Lighting:** Warm golden hour, cool moonlight, dramatic shadows, etc.
3. **Color palette:** Amber/red for intimacy, blue/cool for tension, etc.
4. **Characters present:** Who's in the shot and what they're doing
5. **Setting:** Where the scene takes place
6. **Mood:** The emotional tone of the image
7. **Key action:** What's happening in this moment

#### Step 4.2: Write Image Prompts

Use this template for each image:

```text
[SHOT TYPE], [LIGHTING], [COLOR PALETTE], [CHARACTER DESCRIPTIONS WITH ACTIONS], [SETTING], [MOOD], [STYLE REFERENCE], [TECHNICAL SPECS]
```

**Example:**

```text
Medium close-up, warm golden hour lighting, amber and deep red color palette, a handsome Black man in his 40s with close-cropped hair and kind brown eyes sitting on the edge of a king-size bed looking up at a beautiful white woman in her early 30s with flowing auburn hair wearing a silk robe that has slipped off one shoulder as she reaches for his face, master bedroom with soft cream walls and warm wood furniture, intimate and vulnerable mood with a sense of longing, photorealistic style with cinematic color grading and shallow depth of field, 16:9 aspect ratio, 4K quality
```

#### Step 4.3: Generate and Refine

1. Paste the prompt into your image generator
2. Generate 4 variations
3. Select the best one
4. If characters look inconsistent, use the same seed value and reference images
5. Upscale to 4K if your generator outputs at lower resolution
6. Save as PNG in `04_Images/Scene_XX/`

**Character Consistency Tip:** After generating the first image of each character, save it as a
reference. Use img2img or character reference features in your image generator to maintain the same
appearance across all frames.

#### Step 4.4: Create Transition Frames

For smooth video transitions, generate 1–2 extra frames between major scene changes. These can be:

- Close-ups of objects (a hand, a glass, a door handle)
- Wide establishing shots
- Abstract/blurred images that match the color palette

---

### Phase 5: Assemble the Final Video

**Goal:** Combine audio, images, music, and transitions into a finished MP4 video.

#### Step 5.1: Import Everything into Your Video Editor

1. Import the compiled audio track
2. Import all images in sequence
3. Import background music tracks
4. Import sound effects

#### Step 5.2: Sync Images to Audio

1. Place the audio track on the timeline
2. Place each image on the video track above
3. Adjust the duration of each image to match the corresponding audio segment
4. Use the `[VISUAL]` cues from your script as sync points

**Timing guideline:** Each image should be displayed for 5–15 seconds, depending on the length of
the corresponding audio segment.

#### Step 5.3: Add Transitions

- **Crossfade (1–2 seconds):** For emotional scenes, time passage, location changes
- **Cut (instant):** For tension, surprise, or rapid dialogue
- **Dissolve (2–3 seconds):** For dream sequences, memories, or hallucinations
- **Fade to black:** For scene endings or chapter breaks

#### Step 5.4: Add Text (Optional)

- Title card at the beginning
- Chapter headers
- Subtitles with speaker identification (e.g., "Jaime:", "Jen:")
- End card with "To be continued..." or social links

#### Step 5.5: Export

**Recommended settings:**

- Resolution: 1920×1080 (Full HD) or 3840×2160 (4K)
- Frame rate: 24 fps (cinematic) or 30 fps (smooth)
- Video codec: H.264 or H.265
- Audio: AAC 320 kbps or FLAC
- Format: MP4

Save to `06_Final_Output/`.

**Filename format:** `StoryTitle_Episode01_Final.mp4`

---

<a name="worked-example"></a>

## 4. Worked Example: "The Unicorn"

This section walks through the entire workflow using **"The Unicorn" by qhml1** as our reference
story. This is the story about Jaime (a working-class man), Jen (a retired model married to
billionaire Steve), and the slow-burn tension between Jaime and Jen.

### Phase 1: Story Generation

#### Input — What We Typed into the LLM

We used the Master Story Prompt with these specific parameters:

```
GENRE: Loving Wives / Interracial Romance
SETTING: A small Texas town — specifically "The Barn" country bar and Steve & Jen's luxury home
TONE: Emotionally intense, sensual, character-driven with humor
HEAT LEVEL: Explicit
WORD COUNT: 5,000-8,000 words
POV: First person (Jaime)

CHARACTERS:
- Jaime: 29, white, working-class fishing guide, lean and weathered, self-deprecating humor, loyal, doesn't care about money
- Jen: 32, white, former model married to a billionaire, stunningly beautiful, warm but lonely, playful sense of humor, feels unseen by her husband
- Steve: 35, white, billionaire businessman, obsessed with deals, generous but neglectful, sees Jaime as his only true friend

PLOT OUTLINE:
1. HOOK: Jaime arrives at Steve's mansion to find Steve passed out drunk and Jen looking lonely
2. SETUP: Jaime offers to take Jen out for the evening since Steve is out cold
3. RISING ACTION: They go to The Barn — Jen transforms, dances, comes alive. Jaime is captivated but respects boundaries
4. FIRST INTIMACY: On the dance floor, a slow song creates undeniable physical tension. They go back to the mansion. One kiss that goes further.
5. COMPLICATION: Steve wakes up. Jaime leaves. The next morning is awkward.
6. CLIMAX: Jen calls Jaime. She needs to talk. They meet privately and confront what happened.
7. RESOLUTION: They agree to navigate this carefully. The story ends with them meeting again, the tension unresolved but acknowledged.

[Plus all the WRITING RULES from the master prompt]
```

#### Output — What the LLM Produced (Abridged)

The LLM generated a ~6,000-word story. Here's an excerpt showing the quality and format:

---

> **The Unicorn**
>
> _A story about friendship, desire, and the lines we almost cross._
>
> **Chapter 1: The Barn**
>
> I pulled my truck up to the mansion at half past seven, and the lights were already blazing. That
> was normal — Steve kept this place lit up like a casino. What wasn't normal was finding him
> face-down on the living room couch, still in his suit from work, one shoe off and one shoe on.
>
> "Steve?" I shook his shoulder. He mumbled something about a merger and kept snoring.
>
> That's when I heard her laugh from the kitchen. It was the kind of laugh that made you want to be
> whatever she was laughing at.
>
> Jen stood at the counter in jeans and a T-shirt — just jeans and a T-shirt — and somehow looked
> like she'd stepped off a magazine cover. Her auburn hair was pulled back in a messy ponytail, and
> she was smiling at something on her phone.
>
> "Hey, Jaime." She looked up, and her smile shifted into something more genuine. The kind she
> usually saved for when Steve wasn't around. "You here to fish or to babysit?"
>
> "Little of both, apparently." I gestured at Steve's unconscious form. "Rough day?"
>
> "Rough year." She set her phone down. "He's been on that conference call since noon. I think he
> drank the entire time."
>
> I looked at Steve, then at Jen. She was beautiful — I'd known that since the first time Steve
> introduced us — but tonight there was something else. Something restless in her eyes.
>
> "You got plans tonight?" she asked.
>
> "Was gonna go home and watch the game."
>
> "That's not a plan. That's a tragedy." She tilted her head. "Come on. Let me get changed. We're
> going out."
>
> "Jen, I don't think —"
>
> "Steve won't even know we're gone. And I haven't been out of this house in three weeks. Please,
> Jaime. I need to remember what music sounds like."
>
> _I should have said no. I knew that then. But when Jen looks at you with those blue eyes and asks
> you for something — you don't say no. Nobody says no to Jen._
>
> "Alright," I said. "But I'm driving the truck."
>
> She grinned. "Obviously."
>
> ---
>
> The Barn was exactly what it sounded like — a massive wooden structure designed to look like a
> barn, complete with a hayloft that was actually a VIP section. The parking lot was full of pickup
> trucks and the air smelled like beer and barbecue.
>
> When Jen walked through the door, the entire room noticed.
>
> She'd changed into jeans that looked painted on, a pale pink western shirt, and red boots that
> added three inches to her height. Her hair was down now, cascading over her shoulders in waves
> that caught the light from the neon signs.
>
> "You're staring," she said without looking at me.
>
> "I'm making sure nobody runs into you. It's like watching a natural disaster in slow motion."
>
> She laughed — that real laugh, the one that made her whole face light up. "Smooth, Jaime. Real
> smooth."
>
> We found a table near the dance floor. The band was playing a two-step, and the floor was packed
> with couples moving in that easy Texas rhythm. Jen watched them with an expression I couldn't
> quite read.
>
> "You dance?" I asked.
>
> "I have a degree in it." She took a sip of her beer. "Ballet, mostly. But I can two-step with the
> best of them."
>
> "Then why are you sitting here with me?"
>
> She looked at me. Really looked at me. "Because you're the only person in this room who doesn't
> want something from me."
>
> _That hit harder than it should have._
>
> "Come on," I said, standing and offering my hand. "Let's dance."
>
> ---
>
> [Story continues for ~5,500 more words, following the plot outline through all 7 beats, with > >
> explicit intimate scenes, emotional conflict, and a resolution that sets up the next episode]

---

#### What We Checked After Generation

- [x] **Distinct voices:** Jaime's narration is self-deprecating and warm. Jen is confident and
      playful. Steve is business-focused.
- [x] **Scene breaks:** Clear `***` markers between the mansion, the bar, the dance floor, and the
      bedroom scenes.
- [x] **Dialogue ratio:** Approximately 65% dialogue, 35% narration.
- [x] **Sensory details:** The Barn scene includes smell (beer, barbecue), sound (band, laughter),
      sight (neon signs, Jen's hair), touch (hand on the dance floor), taste (beer).
- [x] **Emotional arc:** Tension builds from the bar → dance floor → drive home → intimacy →
      morning-after complication.

### Phase 2: Narration Script Preparation

We split the story into 28 segments. Here are the first 5 segments showing the format:

---

> **SEGMENT 1**

```text
[NARRATOR: Jaime — warm, conversational, self-deprecating]
[EMOTION: casual, slightly amused]
[MUSIC: soft country guitar, low volume, fade in]
[VISUAL: WIDE SHOT — exterior of a Texas mansion at night, warm lights glowing in windows, a pickup truck pulling into the driveway]

I pulled my truck up to the mansion at half past seven, and the lights were already blazing. That was normal — Steve kept this place lit up like a casino. What wasn't normal was finding him face-down on the living room couch, still in his suit from work, one shoe off and one shoe on.
```

> **SEGMENT 2**

```text
[NARRATOR: Jaime]
[EMOTION: curious, slightly concerned]
[SFX: snoring, muffled]
[VISUAL: CUT TO — interior living room, a man passed out on a designer couch, expensive but disheveled]

"Steve?" I shook his shoulder. He mumbled something about a merger and kept snoring.

That's when I heard her laugh from the kitchen. It was the kind of laugh that made you want to be whatever she was laughing at.
```

> **SEGMENT 3**

```text
[NARRATOR: Jaime]
[EMOTION: admiring, restrained]
[SFX: soft footsteps on hardwood]
[VISUAL: CUT TO — kitchen, a stunning woman in casual clothes smiling at her phone, warm lighting]

Jen stood at the counter in jeans and a T-shirt — just jeans and a T-shirt — and somehow looked like she'd stepped off a magazine cover. Her auburn hair was pulled back in a messy ponytail, and she was smiling at something on her phone.

"Hey, Jaime." She looked up, and her smile shifted into something more genuine. The kind she usually saved for when Steve wasn't around. "You here to fish or to babysit?"
```

> **SEGMENT 4**

```text
[CHARACTER: Jen — confident, playful, warm]
[EMOTION: teasing, slightly sad underneath]
[BEAT]
[VISUAL: MEDIUM SHOT — Jen leaning against the counter, looking at Jaime]

"Little of both, apparently." I gestured at Steve's unconscious form. "Rough day?"

"Rough year." She set her phone down. "He's been on that conference call since noon. I think he drank the entire time."
```

> **SEGMENT 5**

```text
[NARRATOR: Jaime]
[EMOTION: conflicted, drawn in]
[PAUSE: 1s]
[VISUAL: CLOSE-UP — Jaime's face, looking at Jen with barely concealed admiration]

I looked at Steve, then at Jen. She was beautiful — I'd known that since the first time Steve introduced us — but tonight there was something else. Something restless in her eyes.

"You got plans tonight?" she asked.

"Was gonna go home and watch the game."

"That's not a plan. That's a tragedy." She tilted her head. "Come on. Let me get changed. We're going out."
```

---

#### Voice Assignment Map for This Story

| Character            | Description                                                      | Engine           | Settings               |
| -------------------- | ---------------------------------------------------------------- | ---------------- | ---------------------- |
| **Jaime (Narrator)** | Warm, conversational, self-deprecating, working-class Texas      | Chatterbox Turbo | Speed: 0.95, Temp: 0.7 |
| **Jen**              | Confident, warm, playful, slightly husky, model-turned-housewife | F5-TTS           | Speed: 1.0, Temp: 0.8  |
| **Steve**            | Business-like, confident, slightly slurred when drunk            | Chatterbox Turbo | Speed: 1.05, Temp: 0.6 |

### Phase 3: Audio Generation

#### Step-by-Step in TTS Studio

1. **Open TTS Studio** → Select **Chatterbox Turbo** engine
2. **Load Jaime's voice profile** (Speed: 0.95, Temperature: 0.7)
3. **Paste Segment 1 text** (without tags — just the spoken words):
   > "I pulled my truck up to the mansion at half past seven, and the lights were already blazing.
   > That was normal — Steve kept this place lit up like a casino. What wasn't normal was finding
   > him face-down on the living room couch, still in his suit from work, one shoe off and one shoe
   > on."
4. **Generate** → Listen → Adjust if needed → Export as `Segment_01_Jaime.wav`
5. **Repeat for all Jaime segments** (approximately 18 segments)
6. **Switch to F5-TTS** → Load Jen's voice profile
7. **Paste Segment 4 text**:
   > "Little of both, apparently." [pause] "Rough day?" [pause] "Rough year." [pause] "He's been on
   > that conference call since noon. I think he drank the entire time."
8. **Generate** → Listen → Export as `Segment_04_Jen.wav`
9. **Repeat for all Jen segments** (approximately 8 segments)
10. **Switch to Chatterbox Turbo** → Adjust settings for Steve (Speed: 1.05, Temp: 0.6)
11. **Generate Steve segments** (approximately 2 segments)

#### Audio Output

After generation, your `03_Audio/` folder looks like:

```mer
03_Audio/
+-- Narrator/
|   +-- Segment_01_Jaime.wav
|   +-- Segment_02_Jaime.wav
|   +-- Segment_03_Jaime.wav
|   +-- ...
|   +-- Segment_28_Jaime.wav
+-- Jen/
|   +-- Segment_04_Jen.wav
|   +-- Segment_07_Jen.wav
|   +-- ...
|   +-- Segment_25_Jen.wav
+-- Steve/
    +-- Segment_15_Steve.wav
    +-- Segment_16_Steve.wav
```

**Total audio duration:** Approximately 22 minutes

### Phase 4: Visual Generation

#### Storyboard — Key Frames

We identified 18 key visual moments from the story:

| Frame | Scene                             | Shot Type                        | Mood               |
| ----- | --------------------------------- | -------------------------------- | ------------------ |
| 1     | Truck pulling up to mansion       | Wide establishing                | Anticipation       |
| 2     | Steve passed out on couch         | Medium                           | Comedy             |
| 3     | Jen in the kitchen                | Medium close-up                  | Warmth, beauty     |
| 4     | Jen and Jaime talking             | Two-shot                         | Connection         |
| 5     | Jen changing clothes              | Medium (from behind, respectful) | Anticipation       |
| 6     | Exterior of The Barn              | Wide                             | Excitement         |
| 7     | Jen walking through the door      | Medium, low angle                | Impact             |
| 8     | Jaime's reaction                  | Close-up                         | Awe                |
| 9     | The dance floor, wide shot        | Wide                             | Energy             |
| 10    | Jaime and Jen dancing — two-step  | Medium                           | Playfulness        |
| 11    | The slow song — close-up on faces | Close-up                         | Intimacy building  |
| 12    | Jaime's hand on Jen's waist       | Close-up                         | Tension            |
| 13    | Driving home in the truck         | Medium, through windshield       | Quiet tension      |
| 14    | The mansion at night              | Wide                             | Calm before storm  |
| 15    | The kiss                          | Close-up, profiles               | Passion            |
| 16    | Morning — Jaime leaving           | Medium                           | Awkwardness        |
| 17    | Jen on the phone                  | Close-up                         | Determination      |
| 18    | Jaime and Jen meeting again       | Two-shot, neutral location       | Unresolved tension |

#### Example Image Prompts

**Frame 3 — Jen in the Kitchen:**

```
Medium close-up, warm golden kitchen lighting, amber and cream color palette, a beautiful white woman in her early 30s with auburn hair in a messy ponytail wearing a simple white T-shirt and jeans leaning against a marble kitchen island holding a smartphone and laughing softly, luxury modern kitchen with stainless steel appliances and warm wood cabinets, intimate and warm mood with a hint of loneliness, photorealistic style with cinematic color grading, 16:9 aspect ratio, 4K quality, shallow depth of field
```

**Frame 11 — The Slow Dance:**

```
Close-up shot from the side, warm amber bar lighting with soft neon accents, golden and deep red color palette, a lean weathered white man in his late 20s with short brown hair in a western shirt holding a stunning auburn-haired woman in a pink western shirt and tight jeans close against him as they slowly dance, his hand on the small of her back, her head tilted up looking into his eyes, crowded country bar dance floor blurred in background, intensely intimate and vulnerable mood with palpable sexual tension, photorealistic style with cinematic color grading and lens flare from neon signs, 16:9 aspect ratio, 4K quality, very shallow depth of field
```

**Frame 15 — The Kiss:**

```
Extreme close-up of two profiles, warm moonlight through sheer curtains, silver and warm amber color palette, a man's stubbled jaw and a woman's perfect profile with closed eyes and long lashes as their lips meet in a tender kiss, soft focus on the point of contact, bedroom setting with rumpled silk sheets barely visible, passionate yet tender mood with a sense of crossing a line, photorealistic style with cinematic color grading and soft bokeh, 16:9 aspect ratio, 4K quality, extremely shallow depth of field
```

### Phase 5: Video Assembly

#### Timeline Layout (in DaVinci Resolve, CapCut, or similar)

```
Video Track 2:  [Title Card] [Image 01] [Image 02] ... [Image 18] [End Card]
Video Track 1:  [Black] [Transition] [Transition] ... [Transition] [Black]
Audio Track 3:  [Music: soft country guitar -------------------------------------------]
Audio Track 2:  [SFX: truck engine] [SFX: door] [SFX: music] ... [SFX: phone ring]
Audio Track 1:  [Seg 01] [Seg 02] [Seg 03] ... [Seg 28] [Silence]
```

#### Export Settings

- **Resolution:** 1920×1080
- **Frame rate:** 24 fps
- **Codec:** H.264
- **Audio:** AAC 320 kbps
- **File size:** Approximately 800 MB for a 22-minute episode

**Final output:** `The_Unicorn_Episode01_Final.mp4`

---

<a name="troubleshooting"></a>

## 5. Troubleshooting

### Common Problems and Solutions

#### Story Generation

| Problem                               | Solution                                                                                                                                                         |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LLM refuses to write explicit content | Switch to a less restrictive model (Claude Sonnet, Mistral, or a local uncensored model via LM Studio)                                                           |
| Characters sound the same             | Add more specific voice descriptions to the prompt. Example: "Jen speaks in short, confident sentences. Jaime uses longer, self-deprecating rambling sentences." |
| Story is too short                    | Ask the LLM to "expand Scene 3 with more dialogue and sensory detail" or "add a subplot about [X]"                                                               |
| Story has no scene breaks             | Ask the LLM to "add \*\*\* scene breaks every 1,500 words"                                                                                                       |
| Intimacy scenes feel rushed           | Ask the LLM to "slow down the intimate scene — add 500 words of buildup focusing on touch, breathing, and emotional vulnerability"                               |

#### Audio Generation

| Problem                            | Solution                                                                                       |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| TTS sounds robotic                 | Lower the temperature (try 0.6–0.7). Use Chatterbox Turbo for more natural prosody.            |
| Character voices are inconsistent  | Use the same seed value. For F5-TTS, use the same reference audio clip every time.             |
| Audio levels vary between segments | Normalize all clips to -3 dB before assembling.                                                |
| Pronunciation is wrong             | Use phonetic spelling in the script. Example: "Jen" → "Jehn" if the TTS says "Jen" like "pen." |
| Long pauses between segments       | Trim silence from clip ends. Add 0.3s crossfades between clips.                                |

#### Visual Generation

| Problem                                  | Solution                                                                                  |
| ---------------------------------------- | ----------------------------------------------------------------------------------------- |
| Characters look different in every image | Use the same seed value. Save your best character image as a reference and use img2img.   |
| Images don't match the scene mood        | Be more specific about lighting and color palette in your prompt.                         |
| NSFW content is blocked                  | Use Stable Diffusion locally (Automatic1111 or ComfyUI) with an uncensored model.         |
| Images are low quality                   | Upscale using your generator's built-in upscaler or a separate tool like Topaz Gigapixel. |

#### Video Assembly

| Problem                          | Solution                                                                         |
| -------------------------------- | -------------------------------------------------------------------------------- |
| Audio and images are out of sync | Use the `[VISUAL]` cues from your script as sync points. Adjust image durations. |
| Video file is too long/short     | Adjust image display duration (5–15 seconds per image).                          |
| Transitions feel jarring         | Use longer crossfades (1.5–2s) for emotional scenes. Use cuts only for tension.  |
| Final file is enormous           | Export at 1080p instead of 4K. Use H.265 codec for better compression.           |

---

<a name="cheat-sheet"></a>

## 6. Quick-Reference Cheat Sheet

### The 5 Phases at a Glance

```
+-----------------------------------------------------------------+
|  PHASE 1: Generate Story (LLM)                                  |
|  -> Use Master Story Prompt with your parameters                |
|  -> Check: distinct voices, scene breaks, 60% dialogue           |
|  -> Save to 01_Raw_Stories/                                     |
+-----------------------------------------------------------------+
|  PHASE 2: Prepare Narration Script                              |
|  -> Split into 150-300 word segments                            |
|  -> Add voice tags, emotion notes, visual cues                  |
|  -> Create Voice Assignment Map                                 |
|  -> Save to 02_Narration_Scripts/                               |
+-----------------------------------------------------------------+
|  PHASE 3: Generate Audio (TTS Studio)                           |
|  -> Generate each segment with correct voice                    |
|  -> Post-process: normalize, trim, add reverb                   |
|  -> Compile full audio track                                    |
|  -> Save to 03_Audio/                                           |
+-----------------------------------------------------------------+
|  PHASE 4: Generate Visuals (Image Generator)                    |
|  -> Create 15-25 key frame prompts                              |
|  -> Generate, select best, maintain character consistency       |
|  -> Upscale to 4K                                               |
|  -> Save to 04_Images/                                          |
+-----------------------------------------------------------------+
|  PHASE 5: Assemble Video (Video Editor)                         |
|  -> Import audio + images + music + SFX                         |
|  -> Sync images to audio using visual cues                      |
|  -> Add transitions and text                                    |
|  -> Export as MP4 (1080p or 4K, 24fps)                         |
|  -> Save to 06_Final_Output/                                    |
+-----------------------------------------------------------------+
```

### Tag Quick Reference

```
[NARRATOR: name]        -> Who is speaking
[EMOTION: type]         -> Emotional direction
[PAUSE: 2s]             -> Silence before next segment
[BEAT]                  -> Short dramatic pause
[SFX: description]      -> Sound effect needed
[MUSIC: description]    -> Music cue
[VISUAL: description]   -> What the image should show
[WHISPER]               -> Whispered dialogue
[BREATHLESS]            -> Out of breath
```

### Recommended Settings

**TTS:**

- Chatterbox Turbo: Speed 0.95, Temperature 0.7 (narrator)
- F5-TTS: Speed 1.0, Temperature 0.8 (character voices)
- IndexTTS2: Default settings (multi-speaker fallback)

**Video:**

- Resolution: 1920×1080 or 3840×2160
- Frame rate: 24 fps
- Codec: H.264 or H.265
- Audio: AAC 320 kbps

**Images:**

- Aspect ratio: 16:9
- Style: Photorealistic, cinematic color grading
- Consistency: Same seed + reference images per character

---

## Next Steps

Once you've completed your first episode:

1. **Review the output** — Watch the full video and note what works and what doesn't
2. **Adjust your prompts** — Refine the story prompt based on what the LLM did well/poorly
3. **Build a voice library** — Save your TTS voice profiles for reuse across episodes
4. **Create character sheets** — Save your best AI character images as references for future
   episodes
5. **Batch produce** — Once your workflow is smooth, generate multiple episodes in parallel

---

_This guide accompanies the research document at `Docs/STORY_RESEARCH_AND_PROMPT_ENGINEERING.md`.
Refer to that document for the full story analyses, model recommendations, and prompt library._
