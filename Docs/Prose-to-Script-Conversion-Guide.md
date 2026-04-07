# Prose-to-Multi-Speaker Script Conversion Guide

> **Ultimate TTS Studio — Conversation Mode**
>
> This is the definitive instruction document for converting prose and narrative text into
> multi-speaker scripts that Conversation Mode can synthesise. It is written for AI agents
> performing automated conversion AND for human editors reviewing or refining the output.

---

## Table of Contents

1. [Purpose and Scope](#1-purpose-and-scope)
2. [Architecture Alignment](#2-architecture-alignment)
3. [Input Taxonomy](#3-input-taxonomy)
4. [Target Format Specification](#4-target-format-specification)
5. [Prose Decomposition Rules](#5-prose-decomposition-rules)
6. [Speaker Attribution Rules](#6-speaker-attribution-rules)
7. [Speaker Consolidation Strategy](#7-speaker-consolidation-strategy)
8. [Text Preservation Rules](#8-text-preservation-rules)
9. [Chunking Strategy for Long-Form Content](#9-chunking-strategy-for-long-form-content)
10. [Engine-Specific Post-Processing](#10-engine-specific-post-processing)
11. [Quality Checklist](#11-quality-checklist)
12. [Worked Examples](#12-worked-examples)
13. [Anti-Patterns](#13-anti-patterns)
14. [Version History](#14-version-history)

---

## 1. Purpose and Scope

This guide defines the rules, conventions, and worked examples for transforming any source text into
a multi-speaker conversation script that Ultimate TTS Studio's Conversation Mode can synthesise.

**In scope:**
- Converting prose fiction, screenplays, transcripts, podcasts, and mixed-format documents
- Assigning spoken lines to correct speakers with accurate attribution
- Producing the `Speaker: Text` surface format and the underlying `NarrationScript` JSON

**Out of scope:**
- TTS engine tuning (covered in `app/engine_script_profiles.py`)
- AI Script Polish / narration transform (covered in `Docs/LLM-Narration-Transform-Guide.md`)
- Voice assignment and synthesis (covered in `Docs/USER_GUIDE.md § 6`)

**Who should read this:**
- AI agents using `format_conversation_with_llm()` or constructing `NarrationScript` objects
- Human editors reviewing auto-converted scripts before synthesis
- Developers extending the conversation pipeline

---

## 2. Architecture Alignment

Before converting any text, review the system contracts that govern output format.

### 2.1 Surface Format

The UI-facing editing surface is `Speaker: Text` (one utterance per line). This is parsed by
`parse_conversation_script()` in `app/conversation_logic.py`:

```text
Alice: Have you tried the new studio yet?
Bob: I have been using it all week — the voice cloning is incredible.
Narrator: A silence fell between them as the city hummed outside.
```

Parser rules (from `parse_conversation_script()`, `app/conversation_logic.py` L40-67):
- Lines matching `Speaker: Text` (colon not preceded by whitespace) start a new utterance.
- Continuation lines (no colon, or leading whitespace) are appended to the current speaker's text.
- Blank lines are ignored.

### 2.2 Canonical Data Structure

The internal canonical format is `NarrationScript` from `app/narration_script.py`. Every
completed conversion should be expressible as a valid `NarrationScript`:

```json
{
  "version": "1.0",
  "lines": [
    {
      "speaker": "Alice",
      "text": "Have you tried the new studio yet?",
      "line_type": "dialogue",
      "cues": [],
      "confidence": 1.0,
      "ambiguous": false
    },
    {
      "speaker": "Narrator",
      "text": "A silence fell between them as the city hummed outside.",
      "line_type": "narration",
      "cues": [],
      "confidence": 1.0,
      "ambiguous": false
    }
  ],
  "metadata": {
    "source_format": "prose_fiction",
    "model": "agent-converted"
  }
}
```

**Field reference** (`NarrationLine` in `app/narration_script.py`):

| Field        | Type                                           | Notes                                               |
| ------------ | ---------------------------------------------- | --------------------------------------------------- |
| `speaker`    | `str`                                          | Non-empty. Exact name used throughout the script.   |
| `text`       | `str`                                          | Non-empty. Spoken or narrated content only.         |
| `line_type`  | `"dialogue"` \| `"narration"` \| `"stage_direction"` | See definitions below.                     |
| `cues`       | `list[SemanticCue]`                            | Delivery hints; leave `[]` during conversion.      |
| `confidence` | `float` 0.0–1.0                                | 1.0 = certain attribution; < 1.0 = uncertain.      |
| `ambiguous`  | `bool`                                         | `true` when speaker is genuinely unclear.           |

**`line_type` definitions:**

- `dialogue` — text spoken aloud by a named character or speaker.
- `narration` — descriptive, atmospheric, or transitional text. Speaker is always `Narrator`.
- `stage_direction` — action cues or scene instructions not intended as spoken content.
  Speaker is always `Stage Direction`.

### 2.3 UI Constraint

The Conversation Mode UI accepts **a maximum of 5 distinct speakers** in a single script. Scripts
with more than 5 speakers must be consolidated before synthesis (see [§ 7](#7-speaker-consolidation-strategy)).

`Narrator` and `Stage Direction` count toward this limit. Typical budgets:

- Fiction: 1 Narrator + 4 characters
- Interview: 1 Interviewer + 4 guests
- Podcast: 2–3 hosts + 1–2 guest speakers

---

## 3. Input Taxonomy

Different source formats require different decomposition strategies. Identify the input type first,
then apply the appropriate approach.

### 3.1 Pure Prose Fiction

Novels, short stories, novellas. Narrator voice carries the scene; character voices appear as
attributed direct speech.

**Approach:** Separate direct speech from surrounding narration. Assign characters by attribution
tag. Keep all non-speech text as `Narrator`.

**Indicators:** Direct speech in quotation marks, attribution tags (`said Alice`, `he replied`),
third-person narration.

### 3.2 Screenplays and Stage Plays

Formally formatted with `CHARACTER NAME` headers, dialogue blocks, and stage directions.

**Approach:** Near-pass-through. Map character headers to speaker names (normalised to title case).
Map stage directions to `Stage Direction` speaker with `line_type: stage_direction`. Use `Narrator`
only for voice-over or off-screen narration.

**Indicators:** ALL-CAPS character names on their own line, indented dialogue, parenthetical cues
`(V.O.)`, `(O.S.)`.

### 3.3 Interview Transcripts

Q&A format. May use explicit labels (`Q:`, `HOST:`, `INTERVIEWER:`) or speaker initials.

**Approach:** Preserve speaker labels verbatim where clear; normalise to full form where abbreviated
(`Q` → `Interviewer`, `A` → `Guest`). There is no narrator role unless the transcript has
editorial framing text.

**Indicators:** Repetitive label patterns, time codes, `[crosstalk]`, `[laughter]` markers.

### 3.4 Podcast Scripts

Multi-host scripted segments, often with segment headers and ad-read blocks.

**Approach:** Hosts are named speakers. Segment transitions and show notes can be `Stage Direction`
or omitted if they add no spoken value. Ad-read text is attributed to the assigned host speaker;
do not create an `Ad` speaker.

**Indicators:** Episode number, INTRO / OUTRO blocks, `[MUSIC]` cues, sponsor blocks.

### 3.5 Mixed Narrative (Journalism / Essays)

Third-person prose interspersed with quoted speech, attributions, and reportage.

**Approach:** Treat the journalist's prose as `Narrator`. Extract direct quotes and attribute to
the named sources. Preserve indirect speech as `Narrator` (do not convert to first-person dialogue).

**Indicators:** Attribution verbs (`said`, `told reporters`, `explained`), block quotes, em-dash
attribution.

### 3.6 Pre-Formatted Dialogue

Text already in `Speaker: Text` format, or close to it.

**Approach:** Validate against the rules in [§ 4](#4-target-format-specification) and fix any
violations. Speaker count check. No structural decomposition needed.

**Indicators:** Every line contains a colon with a recognisable speaker name before it.

---

## 4. Target Format Specification

### 4.1 Surface Format Rules

```text
Speaker: Utterance text goes here.
Another Speaker: Their response goes here.
Narrator: The rain intensified outside the window.
```

Rules:
1. One `Speaker: Text` pair per line. No multi-speaker runs on a single line.
2. Speaker name must not contain a colon (use a dash instead: `Stage Direction - Opening`).
3. Lines beginning with a space or tab are continuation text for the preceding speaker.
4. Blank lines between utterances are allowed and ignored by the parser.
5. Speaker names are case-sensitive: `Alice` ≠ `alice`. Use title case.

### 4.2 JSON Schema Summary

Full schema is defined in `app/narration_script.py`. Minimum required fields per line:

```json
{"speaker": "NAME", "text": "Utterance.", "line_type": "dialogue"}
```

Default values when omitted: `cues: []`, `confidence: 1.0`, `ambiguous: false`.

### 4.3 Permitted Speaker Names

| Name              | When to Use                                              |
| ----------------- | -------------------------------------------------------- |
| `Narrator`        | All non-dialogue narration and description.              |
| `Stage Direction` | Action cues and scene descriptions not spoken aloud.     |
| Character names   | Exact as written in source, normalised to title case.    |
| `Interviewer`     | unnamed or labelled `Q` / `HOST` in interview sources.  |
| `Guest`           | unnamed or labelled `A` in interview sources.            |
| `Others`          | Consolidated minor characters (see § 7.3).               |

### 4.4 Five-Speaker Budget Planning

Before starting a conversion, audit the source and plan the budget:

```
Budget: 5 total speakers
  [ ] Narrator (reserve if source has non-dialogue text)
  [ ] Speaker 1 — protagonist or primary voice
  [ ] Speaker 2 — secondary speaker
  [ ] Speaker 3 — tertiary speaker
  [ ] Speaker 4 or "Others" — remaining characters consolidated
```

If the source is pure dialogue with no narration, all 5 slots are available for characters.

---

## 5. Prose Decomposition Rules

These rules define exactly how each prose pattern maps to `Speaker: Text` lines. Each rule
includes a before/after example.

### 5a — Direct Speech

The most common pattern. Attribution tags identify the speaker; the quoted text becomes the
utterance.

**Before:**
```
"Hello," Alice said. "I wasn't expecting you."
```

**After:**
```text
Alice: Hello. I wasn't expecting you.
```

- Strip the attribution tag (`Alice said`). It is metadata, not spoken content.
- Merge short interrupted quotes from the same speaker into one utterance when the break is caused
  only by an attribution tag mid-sentence.
- Preserve end punctuation within the quoted text. Do not add punctuation not present in source.

### 5b — Indirect Speech

Reported speech paraphrases what was said. It is narration, not dialogue.

**Before:**
```
Alice said she wasn't expecting him.
```

**After:**
```text
Narrator: Alice said she wasn't expecting him.
```

- ❌ NEVER convert indirect speech to first-person dialogue. The character's actual words are
  unknown; inventing them violates the text-preservation rule (§ 8).

### 5c — Interior Monologue (Thought)

Unspoken thoughts stay in narration. They are not dialogue.

**Before:**
```
She wondered if this was the right choice.
```

**After:**
```text
Narrator: She wondered if this was the right choice.
```

**Exception — italicised inner voice convention:**
Some authors italicise direct thoughts to signal that the character "speaks" internally. When
the source clearly uses this convention, you may attribute the line to the character AND set
`line_type: narration` (since it is still not spoken aloud):

```json
{"speaker": "Alice", "text": "Was this the right choice?", "line_type": "narration",
 "confidence": 0.8, "ambiguous": false}
```

Surface format:
```text
Alice: Was this the right choice?
```
Note the lower confidence to indicate the editorial decision. Flag this in a metadata comment.

### 5d — Embedded Quotes Within Narration

When a character's previous words are recalled or reported mid-narration.

**Before:**
```
Walking slowly, she recalled his words: "Don't forget."
```

**After (only split if attribution is unambiguous):**
```text
Narrator: Walking slowly, she recalled his words.
James: Don't forget.
```

**Keep as single narration line if attribution is unclear:**
```text
Narrator: Walking slowly, she recalled his words: don't forget.
```

- Only split when the speaker of the embedded quote is explicitly identified.
- When unsure, preserve as a single `Narrator` line. Incorrect attribution is worse than
  leaving quoted text in narration.

### 5e — Multi-Paragraph Dialogue (Book Convention)

Standard typographic convention uses opening quotes on each new paragraph of an ongoing speech,
but closing quotes only at the end of the final paragraph. This signals the same speaker continues.

**Before:**
```
"The project has three phases," Marcus began. "In the first phase, we survey the land.

"The second phase involves construction. We break ground in spring.

"Finally, the third phase is the grand opening. I hope you'll all be there."
```

**After:**
```text
Marcus: The project has three phases. In the first phase, we survey the land. The second
  phase involves construction. We break ground in spring. Finally, the third phase is the
  grand opening. I hope you'll all be there.
```

- Merge into a single utterance or keep as sequential same-speaker lines if length requires
  chunking (see § 9).
- Remove the unclosed opening quotes from continuation paragraphs.

### 5f — Mixed Narration and Dialogue in One Paragraph

Split at the attribution boundary.

**Before:**
```
The door burst open and Marcus stormed in. "What is the meaning of this?" he demanded,
his face red with fury. Alice stepped back, startled. "I can explain," she said quietly.
```

**After:**
```text
Narrator: The door burst open and Marcus stormed in.
Marcus: What is the meaning of this?
Narrator: He demanded, his face red with fury. Alice stepped back, startled.
Alice: I can explain.
```

Note: `"he demanded, his face red with fury"` is a mixed attribution tag + description. The
attribution (`he demanded`) is stripped from the dialogue; the description (`his face red with fury`)
becomes narration.

### 5g — Group Dialogue / Chorus

**Before:**
```
"All right! All right!" the crowd shouted.
```

**After:**
```text
Crowd: All right! All right!
```

- Use `Crowd`, `Group`, `Chorus`, or `Audience` as appropriate.
- These count as one of the 5 speaker slots.
- If the crowd's utterances are few and minor, consolidate them under `Others`.

### 5h — Letters, Poems, or Songs Within Narrative

**Before:**
```
She unfolded the letter and began to read aloud:
Dear Alice,
By the time you read this, I will be gone. Do not look for me.
                                             — James
```

**After:**
```text
Narrator: She unfolded the letter and began to read aloud.
Alice: Dear Alice. By the time you read this, I will be gone. Do not look for me. James.
```

Or, if Alice is reading it aloud and James authored it — the TTS context is Alice's voice reading,
so Alice is the speaker. If James is meant to be heard as himself (audio-drama convention), use
James as the speaker with `line_type: dialogue`.

For **songs** quoted within narrative, use the character performing the song as speaker:
```text
Alice: ♪ Somewhere over the rainbow, way up high. ♪
```
(If the engine doesn't handle musical notation, remove the ♪ symbols.)

For **poems** recited by an unnamed narrator, use `Narrator` with `line_type: narration`.

### 5i — Stripping Dialogue Tags

Dialogue tags are attribution metadata and never belong in the spoken text.

| Source text                                 | Spoken text      | Tag stripped          |
| ------------------------------------------- | ---------------- | --------------------- |
| `"Hello," she said.`                        | `Hello.`         | `she said`            |
| `"Stop!" he cried.`                         | `Stop!`          | `he cried`            |
| `"Really?" Alice asked, frowning.`          | `Really?`        | `Alice asked, frowning` |
| `"I'm tired," she whispered, eyes closing.` | `I'm tired.`     | `she whispered, eyes closing` |

**Preserving delivery hints as cues:**
If the tag contains a delivery qualifier (`whispered`, `shouted`, `laughed`), map it to a
`SemanticCue` in the JSON if a matching cue exists, or add a metadata annotation:

```json
{"speaker": "Alice", "text": "I'm tired.", "line_type": "dialogue",
 "cues": ["whisper"], "confidence": 1.0, "ambiguous": false}
```

Note: cue values come from `SemanticCue` in `app/narration_script.py`:
`whisper`, `pause`, `emphasis`, `emotional_beat`. Only map tags with a direct match.

### 5j — Action Beats Attached to Dialogue

Action beats are short character actions embedded before or after a speech line.

**Before:**
```
Alice laughed. "That's ridiculous," she said.
```

**After:**
```text
Narrator: Alice laughed.
Alice: That's ridiculous.
```

**Before (beat after dialogue):**
```
"I'll be there," he promised, then turned and walked out the door.
```

**After:**
```text
Character: I'll be there.
Narrator: He promised, then turned and walked out the door.
```

Do not merge action beats into the dialogue line — they are not spoken content.

---

## 6. Speaker Attribution Rules

### 6.1 Explicit Attribution (Confidence 1.0)
When the source provides a clear name: use it exactly (normalised to title case).
```
"Okay," said Dr. Martinez.  →  Dr. Martinez: Okay.
BOB HARRIS (screenplay)     →  Bob Harris: [dialogue]
INTERVIEWER:                →  Interviewer: [utterance]
```

### 6.2 Contextual Attribution (Confidence 0.7–0.9)
When identity is clear from context but not explicitly stated in the same sentence:
- Set `confidence` to the appropriate value below 1.0.
- Do not set `ambiguous: true` unless the attribution genuinely cannot be determined.

```
"Yes." [previous paragraph established Alice as speaking]  →  Alice: Yes.  (confidence 0.85)
```

### 6.3 Ambiguous Attribution (Confidence 0.5, ambiguous: true)
When two or more speakers are plausible and context does not resolve it:
```json
{"speaker": "Alice", "text": "I knew it.", "line_type": "dialogue",
 "confidence": 0.5, "ambiguous": true}
```
Flag for human review. Do not guess silently.

### 6.4 Naming Standards
- **Narrator:** Always `Narrator`. Not `Author`, `Narratrix`, `Narrative Voice`, or `Voice`.
- **Stage directions:** Always `Stage Direction`. Not `Action`, `Direction`, `Cue`.
- **Unknown speaker:** Never use `Unknown`. Use the best reasonable inference
  (`Stranger`, `Guard`, `Customer`) or `Others`.
- **Alias resolution:** If `Mom`, `Mrs. Carter`, and `Helen` are the same character in context,
  pick one name and use it everywhere. Prefer the name most frequently used or most clearly
  identified in the source.

### 6.5 Consistency Rule
The same character must have the same speaker name on every line throughout the entire script.
A character never changes name mid-script (except through alias resolution at the start).

### 6.6 No Stereotype Inference
Do not infer accent, gender, emotional affect, or social role from a character name alone.
Use only explicit source information when choosing names or noting cues.

---

## 7. Speaker Consolidation Strategy

When the source text has more than 5 distinct speakers, apply this strategy before or during
conversion.

### 7.1 Rank by Line Count
Count how many lines (or approximate word-count) each character contributes. Keep the 4 highest.

```
Character     Lines
----------    -----
Alice           42    ← keep
Marcus          31    ← keep
Dr. Reed        18    ← keep
Narrator        15    ← keep (reserved)
Tom              6    ← consolidate
Jim              4    ← consolidate
Guard #1         2    ← consolidate
```

### 7.2 Consolidate Minor Characters
Merge low-line-count characters into a 5th speaker named `Others` (or a context-appropriate
label: `Crowd`, `Officials`, `Minor Characters`).

```text
Others: Halt! Who goes there?
Others: Yes, sir. Right away.
```

### 7.3 Scene-Based Merging (Alternative Strategy)
If two minor characters never appear in the same scene, they can be merged into one speaker
name — listeners will not notice the voice continuity.

### 7.4 Narrator Slot Management
`Narrator` always occupies one slot unless the source is pure dialogue with zero narration.
When narration is needed but budget is tight, prioritise `Narrator` and consolidate characters.

### 7.5 No Narrator Contamination
Never merge character dialogue into the `Narrator` speaker to save slots. Characters retain their
own identity even if they become part of `Others`.

---

## 8. Text Preservation Rules

These rules are **non-negotiable**. They exist to prevent the conversion process from altering the
source author's words.

1. **Spoken text must be preserved verbatim.** No paraphrasing. No summarising. No added words.
2. **Narration text must be preserved verbatim.** Description and prose pass through unchanged.
3. **Dialogue tags are removed**, not altered. The tag contains no spoken content.
4. **Action beats are separated**, not deleted. They become `Narrator` lines.
5. **Speaker names may be normalised** (title case, alias resolution) but not invented.
6. **Do not add performance directions** that are absent from the source.
7. **Do not condense multiple exchanges** into a single utterance unless they are from the same
   speaker and represent a single continuous speech act.
8. **Quotation marks are removed** from the spoken text in the output (the speaker assignment
   carries that information).

---

## 9. Chunking Strategy for Long-Form Content

Long-form conversion (novels, multi-chapter scripts) must be chunked to stay within LLM context
limits and to keep conversion units manageable.

### 9.1 Natural Chunk Boundaries
Chunk at the following boundaries (in order of preference):
1. Chapter or act break
2. Scene break (blank lines, `* * *`, horizontal rule)
3. Paragraph break at end of a dialogue exchange
4. End of a complete sentence (last resort for size control)

**Never** split a chunk mid-dialogue or mid-sentence.

### 9.2 Target Chunk Size
Target **3 000 characters** per chunk. This matches the narration transform chunking default
for consistency across the pipeline.

Hard maximum: 4 000 characters (leaves headroom for the LLM system prompt in a 4 096 token
response window).

### 9.3 Speaker Registry (Must Carry Forward)
Before beginning chunked conversion, build a canonical speaker registry:

```json
{
  "Alice": {"aliases": ["she (main POV)", "the detective"], "line_type_default": "dialogue"},
  "Marcus": {"aliases": ["the professor", "Dr. Bell"], "line_type_default": "dialogue"},
  "Narrator": {"aliases": [], "line_type_default": "narration"}
}
```

Pass this registry as context to every subsequent chunk. The same character must produce the
same speaker name in every chunk.

### 9.4 Cross-Chunk Continuity Context
When converting chunk N, include the **last 2–3 lines** of chunk N-1 as a non-output context
preamble. This prevents attribution errors at chapter/scene boundaries.

```
[CONTEXT ONLY — DO NOT INCLUDE IN OUTPUT]
Alice: We leave at dawn.
Narrator: She extinguished the lamp and the room fell dark.
[END CONTEXT]

[CONVERT FROM HERE]
The first grey light of morning crept through the curtains...
```

### 9.5 Post-Chunk Stitching
After all chunks are converted:
- Verify speaker names are consistent across chunk boundaries.
- Verify the total distinct speaker count is ≤ 5 across the entire script.
- Merge consecutive lines from the same speaker if they were split only by a chunk boundary.

---

## 10. Engine-Specific Post-Processing

Conversion produces clean `Speaker: Text` output. Engine-specific constraints are applied as a
**separate post-processing step** after the structural conversion is complete. Do not apply engine
constraints during the attribution/decomposition phase.

The full per-engine rule set lives in `app/engine_script_profiles.py`. Key constraints per engine:

### ChatterboxTTS / Chatterbox Turbo
- Maximum sentence length: 250 characters (Turbo: 200 characters).
- Use `...` for deliberate pauses; `,` for light rhythm breaks; `—` for interruptions.
- Spell out all numbers, currencies, and abbreviations in spoken form.
- No SSML tags, bracket cues, or parenthetical stage directions.

### Chatterbox Multilingual
- Same length constraints as ChatterboxTTS (250 chars).
- Text must be in the target language only — do not mix languages within a line.
- Preserve diacritics exactly.

### Kokoro TTS
- Target sentences under 200 characters.
- Spell out all digits, currency symbols, percentages, and abbreviations; the engine performs no
  internal normalisation.
- Match locale spelling to the selected voice variant (US vs. UK English).

### Fish Speech
- 50–300 characters per sentence for natural prosody.
- Avoid repeating the same phrase more than twice within a line (triggers repetition artefacts).
- Multilingual capable; write each line in a single language.

### IndexTTS / IndexTTS2
- Keep segments under 300 characters; longer inputs cause timing drift.
- IndexTTS2 supports bracket cues and emotion vectors — the richest expressiveness surface in
  the studio. See `engine_script_profiles.py` for the full IndexTTS2 profile.

### ElevenLabs / VoxCPM / Other Remote Engines
- These engines generally handle longer segments and natural sentence structure well.
- Follow the base preservation rules; no special length constraints required for conversion.
- No SSML break tags — ElevenLabs v3 uses punctuation and audio tags for pacing.

### General Post-Processing Order
1. Complete structural conversion (this guide).
2. Apply speaker consolidation if needed.
3. Run narration transform (AI Script Polish) per speaker if desired.
4. Apply engine profile text normalisation.
5. Load into Conversation Mode and assign voices.

---

## 11. Quality Checklist

Run this checklist after every conversion before passing the script to Conversation Mode.

- [ ] Every line has a valid, non-empty speaker name.
- [ ] No spoken text has been paraphrased, summarised, or altered.
- [ ] No words have been added to spoken text.
- [ ] Dialogue tags have been stripped from spoken text.
- [ ] Action beats are separated into `Narrator` lines (not merged into dialogue).
- [ ] Indirect speech remains as `Narrator` narration (not converted to first-person dialogue).
- [ ] Interior monologue stays as `Narrator` unless the inner-voice convention is confirmed.
- [ ] `Narrator` is the speaker for all non-dialogue descriptive text.
- [ ] `Stage Direction` is used (rather than `Narrator`) for action cues not meant to be spoken.
- [ ] Total distinct speaker count is ≤ 5.
- [ ] The same character uses the same speaker name on every line.
- [ ] All character aliases (Mom / Mrs. Carter / Helen) are resolved to a single name.
- [ ] Lines with ambiguous attribution have `ambiguous: true` and `confidence < 1.0`.
- [ ] No speaker is named `Unknown`.
- [ ] Quoted text does not retain outer quotation marks in the `text` field.
- [ ] Script reads naturally when each speaker's lines are read aloud in isolation.
- [ ] If chunked, speaker names are consistent across all chunks.
- [ ] Engine post-processing constraints have been applied if an engine is already selected.

---

## 12. Worked Examples

### Example A — Short Prose Paragraph

**Source:**
```
Alice tapped the table impatiently. "Are we really doing this?" she asked. James looked up
from his notes. "Absolutely," he said. "There's no turning back now." A long silence
followed as the weight of the decision settled over them both.
```

**Step-by-step decomposition:**

1. Identify narrative wrapper: `Alice tapped the table impatiently.` → `Narrator` narration.
2. Extract direct speech: `"Are we really doing this?"` → `Alice` dialogue. Strip tag `she asked`.
3. Identify narrative bridge: `James looked up from his notes.` → `Narrator` narration.
4. Extract direct speech block: `"Absolutely." "There's no turning back now."` — both James, same
   speech act, merge into one line. Strip tag `he said`.
5. Closing narration: `A long silence followed…` → `Narrator` narration.

**Output (`Speaker: Text`):**
```text
Narrator: Alice tapped the table impatiently.
Alice: Are we really doing this?
Narrator: James looked up from his notes.
James: Absolutely. There's no turning back now.
Narrator: A long silence followed as the weight of the decision settled over them both.
```

**Output (`NarrationScript` JSON):**
```json
{
  "version": "1.0",
  "lines": [
    {"speaker": "Narrator", "text": "Alice tapped the table impatiently.",
     "line_type": "narration", "cues": [], "confidence": 1.0, "ambiguous": false},
    {"speaker": "Alice", "text": "Are we really doing this?",
     "line_type": "dialogue", "cues": [], "confidence": 1.0, "ambiguous": false},
    {"speaker": "Narrator", "text": "James looked up from his notes.",
     "line_type": "narration", "cues": [], "confidence": 1.0, "ambiguous": false},
    {"speaker": "James", "text": "Absolutely. There's no turning back now.",
     "line_type": "dialogue", "cues": [], "confidence": 1.0, "ambiguous": false},
    {"speaker": "Narrator",
     "text": "A long silence followed as the weight of the decision settled over them both.",
     "line_type": "narration", "cues": [], "confidence": 1.0, "ambiguous": false}
  ],
  "metadata": {"source_format": "prose_fiction", "model": "agent-converted"}
}
```

**Speaker budget used:** Narrator + Alice + James = 3 of 5 slots.

---

### Example B — Novel Excerpt with Four Elements

**Source (includes narrator, 3 characters, action beats, indirect speech):**
```
The library was cold, the kind of cold that settles in old buildings and never quite leaves.
Dr. Reed sat behind a mountain of manuscripts. "You're late," she said without looking up.

Marcus pulled off his coat and draped it over a chair. "The tram broke down." He glanced
sideways at the young woman by the window. "Who's she?"

Dr. Reed said that the newcomer's name was Elara and that she would be assisting them this
season.

"Hello," Elara said softly, extending her hand.

Marcus shook it briefly. He wondered whether this was wise.
```

**Decomposition notes:**

- `The library was cold…` → Narrator.
- `Dr. Reed sat behind a mountain of manuscripts.` → Narrator.
- `"You're late," she said without looking up.` → Dr. Reed: dialogue. Strip `she said without
  looking up`. Cue `whisper`/`emphasis` not clearly specified, leave `cues: []`.
- `Marcus pulled off his coat and draped it over a chair.` → Narrator (action beat).
- `"The tram broke down."` → Marcus: dialogue. Strip `(no tag, direct attribution from context)`.
- `He glanced sideways at the young woman by the window.` → Narrator.
- `"Who's she?"` → Marcus: dialogue. Merge with action beat above but keep separate (action beat
  precedes a different speaker exchange).
- `Dr. Reed said that the newcomer's name was Elara…` → **Indirect speech** → Narrator.
  Do NOT convert to `Dr. Reed: Her name is Elara.`
- `"Hello," Elara said softly, extending her hand.` → Elara: dialogue. Strip tag. Note `softly` →
  consider `cues: ["whisper"]` if supported.
- `Marcus shook it briefly.` → Narrator (action beat).
- `He wondered whether this was wise.` → Narrator (interior monologue, no italics convention).

**Output (`Speaker: Text`):**
```text
Narrator: The library was cold, the kind of cold that settles in old buildings and never
  quite leaves. Dr. Reed sat behind a mountain of manuscripts.
Dr. Reed: You're late.
Narrator: Marcus pulled off his coat and draped it over a chair.
Marcus: The tram broke down.
Narrator: He glanced sideways at the young woman by the window.
Marcus: Who's she?
Narrator: Dr. Reed said that the newcomer's name was Elara and that she would be assisting
  them this season.
Elara: Hello.
Narrator: Marcus shook it briefly. He wondered whether this was wise.
```

**Consolidation notes:** 4 speakers (Narrator, Dr. Reed, Marcus, Elara) = 4 of 5 slots. No
consolidation needed.

**Text-preservation verification:**
- `"Marcus pulled off his coat…"` kept verbatim as Narrator.
- Indirect speech (`Dr. Reed said that the newcomer's name was Elara…`) preserved exactly as
  Narrator; NOT converted to `Dr. Reed: Her name is Elara` (that would be paraphrasing invented
  dialogue).
- `He wondered whether this was wise` kept as Narrator, not converted to Marcus dialogue.

---

### Example C — Mixed Format (Interview with Embedded Narrative)

**Source:**
```
TRANSCRIPT — Creative Futures Podcast, Episode 42
[Recorded: March 2026]

HOST: Welcome back, everyone. Today I'm joined by Dr. Yuki Tanaka, whose new book on AI
creativity has been turning heads. Yuki, thanks for being here.

YUKI: Happy to be here. It's been quite a year.

HOST: Your book argues that creativity is not a uniquely human trait. That's a bold claim.
Tell us more.

YUKI: The core argument is simple. When a system produces output that cannot be predicted
from its inputs, and that output has aesthetic value, we have to at least consider the word
creative. Whether we reserve that word for humans is a philosophical choice, not an
empirical one.

[Segment break — ad read follows]

HOST: We'll be right back after a short break.
```

**Decomposition notes:**

- `TRANSCRIPT — Creative Futures Podcast, Episode 42` → `Stage Direction` with
  `line_type: stage_direction`. Not spoken.
- `[Recorded: March 2026]` → `Stage Direction`. Not spoken.
- `HOST:` → Map to `Interviewer` (or keep `Host` if that reads better).
- `YUKI:` → Map to `Dr. Yuki Tanaka` or simply `Yuki` (infer preferred name from source).
- `[Segment break — ad read follows]` → `Stage Direction`. Not spoken.
- No narrator role — this is pure dialogue/transcript. `Stage Direction` uses one speaker slot.

**Output (`Speaker: Text`):**
```text
Stage Direction: Transcript — Creative Futures Podcast, Episode 42. Recorded March 2026.
Host: Welcome back, everyone. Today I'm joined by Dr. Yuki Tanaka, whose new book on AI
  creativity has been turning heads. Yuki, thanks for being here.
Yuki: Happy to be here. It's been quite a year.
Host: Your book argues that creativity is not a uniquely human trait. That's a bold claim.
  Tell us more.
Yuki: The core argument is simple. When a system produces output that cannot be predicted
  from its inputs, and that output has aesthetic value, we have to at least consider the
  word creative. Whether we reserve that word for humans is a philosophical choice, not an
  empirical one.
Stage Direction: Segment break. Ad read follows.
Host: We'll be right back after a short break.
```

**Speaker budget used:** Stage Direction + Host + Yuki = 3 of 5 slots.

**Notes:**
- If `Stage Direction` lines are not wanted in the synthesis (they would be spoken aloud by
  whatever voice is assigned to that speaker), they can be omitted or the speaker assigned to
  a very low-volume voice, or the lines deleted from the script before loading into Conversation
  Mode.
- `[Recorded: March 2026]` bracket notation was normalised to spoken prose form.

---

## 13. Anti-Patterns

These are the most common errors. Each one violates a core rule. Treat any occurrence as a
conversion defect requiring correction.

### ❌ Converting Indirect Speech to Dialogue
```
Source: She said she was tired.
Wrong:  Character: I'm tired.     ← invented first-person dialogue
Right:  Narrator: She said she was tired.
```

### ❌ Losing Narration (Dropping Descriptive Text)
```
Source: He laughed bitterly. "You never change."
Wrong:  Character: You never change.   ← action beat silently discarded
Right:  Narrator: He laughed bitterly.
        Character: You never change.
```

### ❌ Splitting a Sentence Mid-Thought to Fit a Size Limit
```
Wrong:  Alice: The reason I came here was to tell you something
        Alice: important about the project timeline.
Right:  Alice: The reason I came here was to tell you something important about the
          project timeline.
```
(Chunk at paragraph or scene breaks, not mid-sentence.)

### ❌ Inventing Dialogue Not in the Source
```
Source: He nodded in agreement.
Wrong:  Character: Yes, I agree.       ← no words spoken in source
Right:  Narrator: He nodded in agreement.
```

### ❌ Using "Unknown" as a Speaker Name
```
Wrong:  Unknown: Get out of here.
Right:  Guard: Get out of here.        ← infer a reasonable contextual name
```

### ❌ Leaving Dialogue Tags in the Spoken Text
```
Wrong:  Alice: Hello, she said.
Right:  Alice: Hello.
```

### ❌ Assigning Indirect or Interior Speech to its Character
```
Source: Marcus thought for a moment about whether to trust her.
Wrong:  Marcus: Should I trust her?    ← interior thought converted to dialogue
Right:  Narrator: Marcus thought for a moment about whether to trust her.
```

### ❌ Merging Different Speakers' Lines to Save Space
```
Wrong:  Alice: Yes. No. Maybe.         ← three speakers compressed into one
Right:  Alice: Yes.
        Bob: No.
        Alice: Maybe.
```

### ❌ Exceeding 5 Speakers Without Consolidation
Any script with 6+ distinct speaker names will fail to load in Conversation Mode. Always
apply consolidation (§ 7) before the script is considered complete.

---

## 14. Version History

| Version | Date        | Author          | Notes                                    |
| ------- | ----------- | --------------- | ---------------------------------------- |
| v1.0    | 2026-04-08  | Agent (Copilot) | Initial release. Full schema alignment   |
|         |             |                 | with `NarrationScript` v1.0 and          |
|         |             |                 | `engine_script_profiles.py` as of        |
|         |             |                 | April 2026. Covers all 10 decomposition  |
|         |             |                 | rules, 3 worked examples, and engine     |
|         |             |                 | post-processing guidance.                |

---

*Related documents:*
- [`app/conversation_logic.py`](../app/conversation_logic.py) — `parse_conversation_script()`,
  `format_conversation_with_llm()`, `CONVERSATION_FORMATTER_SYSTEM_PROMPT`
- [`app/narration_script.py`](../app/narration_script.py) — `NarrationScript`, `NarrationLine`,
  `SemanticCue` schema definitions
- [`app/engine_script_profiles.py`](../app/engine_script_profiles.py) — per-engine text
  preparation rules
- [`Docs/LLM-Narration-Transform-Guide.md`](LLM-Narration-Transform-Guide.md) — narration
  transform / AI Script Polish pipeline
- [`Docs/USER_GUIDE.md`](USER_GUIDE.md) — end-user Conversation Mode walkthrough (§ 6)
