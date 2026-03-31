# Narration Transform — Design Review & Recommendations

**Scope:** `app/launch.py` (`DEFAULT_LLM_NARRATION_SYSTEM_PROMPT`,
`_build_llm_transform_user_prompt`, `_apply_local_narration_transform`) and the LLM Narration
Transform panel UX.

**Date:** 2026-03-31  
**Status:** Actionable — ready for implementation and user guide incorporation.

---

## 1. Diagnosis of Current Problems

| Problem                                                          | Root cause                                                         | Impact                                                                       |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| LLM does not know what STRICT/NORMALIZE/EXPRESSIVE mean          | Labels passed with zero definition                                 | LLM guesses; outputs are inconsistent across providers and temperatures      |
| NORMALIZE and EXPRESSIVE produce identical local fallback output | `_apply_local_narration_transform` has no branching for EXPRESSIVE | Users selecting EXPRESSIVE see no visible difference when LLM is unavailable |
| Style has no effect on LLM output                                | `STYLE: cinematic_audiobook` is a label with no instruction        | All styles produce identical rewriting quality                               |
| `MAX_TAG_DENSITY` is uninterpretable                             | LLM receives a float (e.g., `0.5`) with no scale or unit explained | Tags are over- or under-applied inconsistently                               |
| LOCALE affects only date formatting in local fallback            | No LOCALE guidance in LLM prompt                                   | International users get English-centric output regardless of locale          |
| System prompt is too short to guide any LLM reliably             | 5 rules, ~80 words                                                 | Smaller models (Qwen, Mistral 7B) especially under-constrained               |

---

## 2. Panel Rename Recommendations

**Current name:** "Narration Transform (LLM)"

**Problems:** "Transform" is vague. "(LLM)" is opaque to non-technical users. The name does not
communicate that AI is polishing text to sound better when spoken aloud.

### Recommended names (ranked)

| Rank | Name                 | Rationale                                                                   |
| ---- | -------------------- | --------------------------------------------------------------------------- |
| 1    | **AI Script Polish** | Clear verb + clear domain. Implies improvement. Every word is approachable. |
| 2    | **Smart Narration**  | Warm, implies intelligence. Slightly ambiguous on what it _does_.           |
| 3    | **Speech Optimizer** | Functional, accurate. "Optimizer" may still feel technical to some users.   |

**Recommendation: use "AI Script Polish".**  
Tooltip: "AI rewrites your text to sound natural and expressive when spoken aloud."

---

## 3. Mode Rename Recommendations

**Current names:** STRICT / NORMALIZE / EXPRESSIVE

**Problems:**

- STRICT sounds punishing rather than "safe & minimal"
- NORMALIZE is a software engineering term, not user-friendly
- EXPRESSIVE is the most intuitive of the three but alone provides no relative scale

### Recommended renames

| Current    | New Name    | User-facing description                                                          |
| ---------- | ----------- | -------------------------------------------------------------------------------- |
| STRICT     | **Minimal** | "Only fix numbers, abbreviations, and symbols. Leave everything else untouched." |
| NORMALIZE  | **Polish**  | "Clean up sentences, improve flow, fix pacing. No dramatic changes."             |
| EXPRESSIVE | **Vivid**   | "Rewrite for maximum expressiveness. Add emotion, emphasis, and rhythm."         |

**Alternative trio** if "Vivid" reads as too whimsical for professional users:  
**Preserve / Polish / Expressive** — keeps the best existing name and makes the progression legible.

---

## 4. Mode Behaviour Specifications

### 4.1 MINIMAL (formerly STRICT)

**Philosophy:** "First, do no harm." Apply only transformations that are guaranteed correct and
invisible to the listener. Suitable for users who wrote their text carefully and only need technical
TTS-hostile tokens removed.

**What it MUST do:**

- Expand abbreviations with unambiguous spoken forms: `Dr.` → `Doctor`, `Mr.` → `Mister`, `Ave.` →
  `Avenue`, `St.` → `Street` (except proper nouns like `St. Patrick's`)
- Convert phone numbers to digit groups: `555-867-5309` →
  `five five five, eight six seven, five three oh nine`
- Convert currency: `$47.50` → `forty-seven dollars and fifty cents`
- Convert percentages: `83%` → `eighty-three percent`
- Convert ISO dates: `2024-01-15` → `January fifteenth, two thousand twenty-four`
- Convert 24h times: `14:30` → `two thirty PM`
- Simplify URLs to domain names: `https://example.com/long/path` → `example dot com`
- Convert keyboard shortcuts: `Ctrl+Z` → `control Z`
- Convert unit abbreviations: `100km` → `one hundred kilometers`

**What it MUST NOT do:**

- Reorder or restructure sentences
- Add, remove, or change words beyond the above list
- Add audio tags
- Change punctuation
- Change register or tone

**Local fallback parity:** The existing `_apply_local_narration_transform` behaviour when
`mode == "STRICT"` (pass-through) is **incorrect** — it currently returns text unchanged, skipping
even the normalization above. The local MINIMAL fallback should apply all of the above regex
transforms without any creative rewriting.

---

### 4.2 POLISH (formerly NORMALIZE)

**Philosophy:** "Make it broadcast-ready." Apply all MINIMAL transforms plus structural and rhythmic
improvements an editor would make to a script before recording.

**What it MUST do (in addition to all MINIMAL transforms):**

- Break overly long sentences (>35 words) at natural clause boundaries
- Replace em-dashes and en-dashes used mid-sentence with commas or ellipses as appropriate
- Remove markdown remnants: `**bold**` → `bold`, `# Heading` → `Heading:`
- Expand contractions only where they sound unnatural spoken aloud (`'s`, `'re`, `'ve` may be kept
  if they sound natural; `'d` or `'ll` should be expanded in formal styles)
- Add commas before coordinating conjunctions in compound sentences where a natural breath pause
  would occur
- Convert "e.g." and "i.e." to "for example" and "that is"
- Remove parenthetical asides that interrupt spoken flow, or rewrite as appositives
- Smooth choppy lists: `red, green, and blue` → no change; but `red. Green. Blue.` →
  `red, green, and blue`

**What it MUST NOT do:**

- Add audio tags
- Use ALL-CAPS for emphasis
- Invent content not present in the source
- Change the emotional register or narrative voice
- Use ellipses for pacing beyond what the source implied

**Local fallback parity:** The existing local fallback for NORMALIZE is identical to EXPRESSIVE —
this is a bug. The local POLISH fallback should apply all MINIMAL regex transforms plus the
structural rules above, but **not** add any audio tags or emphasis markers.

---

### 4.3 VIVID (formerly EXPRESSIVE)

**Philosophy:** "Make v3 sing." Apply all POLISH transforms plus the full expressive toolkit of
ElevenLabs v3: audio tags, strategic emphasis, rhetorical rhythm, and style-guided tonal shaping.

**What it MUST do (in addition to all POLISH transforms):**

- Add audio tags from the approved v3 list where contextually accurate and genuine (see §5)
- Use ALL-CAPS for 1–3 words per paragraph that carry the most semantic weight
- Use ellipses (`...`) for dramatic pauses, hesitation, or emotional weight
- Add em-dash (`—`) for abrupt interruptions or mid-thought pivots
- Adjust sentence rhythm to match the target STYLE (see §6)
- Apply LOCALE-sensitive idiomatic phrasing (British vs American English register, etc.)
- Constrain audio tag frequency to `MAX_TAG_DENSITY` (see §7)

**What it MUST NOT do:**

- Change the factual meaning of any sentence
- Invent dialogue, descriptions, or events not in the source
- Use SSML break tags (`<break time="x.xs" />`) — these are not supported by Eleven v3
- Use phoneme tags (`<phoneme>`) — these are not supported by Eleven v3
- Add more than one audio tag per sentence as a default (density cap applies)
- Use sound-effect tags (`[gunshot]`, `[applause]`) unless the text explicitly describes those
  sounds

**Local fallback parity:** The existing local EXPRESSIVE fallback is identical to NORMALIZE — no
audio tags or emphasis are added. This is acceptable as a safe fallback, but the status message
should clearly state: _"Local fallback applied: audio tags and emphasis not available without an
LLM. POLISH-level transforms applied instead."_

---

## 5. Audio Tag Usage Policy for VIVID Mode

Source of truth: ElevenLabs v3 documentation and the official `Enhance` prompt.

### Approved voice/delivery tags (use freely in VIVID):

```
[whispers]  [laughs]  [laughs harder]  [starts laughing]  [giggles]  [chuckles]
[sighs]     [exhales] [inhales deeply] [exhales sharply]
[sarcastic] [curious] [excited]        [happy]            [sad]       [angry]
[annoyed]   [appalled][thoughtful]     [surprised]        [reassuring][sympathetic]
[professional] [dramatic] [mischievously] [crying]
[short pause]  [long pause]  [clears throat]
[strong X accent]   [sings]
```

### Tags to AVOID in automated transforms:

```
[gunshot]  [applause]  [clapping]  [explosion]  [music]
[standing] [grinning]  [pacing]    [fart]        [woo]
```

(These are sound effects or non-auditory actions — they should not be inserted by the LLM unless the
source text explicitly describes those events.)

### Placement rules:

- Place tags **immediately before** the segment they modify, on the same line
- Or **immediately after** a sentence as a reactive tag: `"I can't believe it." [sighs]`
- Never place a tag inside a word or split a clause: `[sighs] I [laughs] didn't expect this` is
  wrong
- Maximum one tag per sentence unless two distinct emotions apply at different points

---

## 6. Style Behaviour Specifications

The STYLE parameter should actively reshape the LLM's rewriting strategy. Each style targets a
different listener context and delivery mode.

### 6.1 cinematic_audiobook

**Listener context:** Headphones, long-form immersive listening (30+ minutes).  
**Register:** Literary, evocative, measured.  
**Pacing:** Slow to medium. Paragraphs breathe. Rich in pause opportunities.  
**Sentence structure:** Varied length. Short sentences for impact. Long sentences for flow.  
**Emphasis:** Sparse ALL-CAPS. Use prose rhythm instead.  
**Audio tags (VIVID only):** `[sighs]`, `[whispers]` for intimate moments. `[thoughtful]` for
reflective passages. Maximum 1 tag per 3–4 sentences.  
**Normalisation focus:** Expand all abbreviations. Convert all numbers to words.

**Before:**

> "The AI processed 1.4TB of data in 3.2s across 47 nodes."

**After (VIVID):**

> "The AI processed one point four terabytes of data in just over three seconds, spread across
> forty-seven nodes... [thoughtful] A quiet, invisible act of tremendous scale."

---

### 6.2 conversational

**Listener context:** Casual listening, phone, background audio.  
**Register:** Informal, warm, direct. Like talking to a knowledgeable friend.  
**Pacing:** Natural speech rhythm. Contractions kept. Short punchy sentences welcome.  
**Sentence structure:** Mix of short and medium. No formal constructions.  
**Emphasis:** Light emphasis with CAPS where someone would naturally stress a word.  
**Audio tags (VIVID only):** `[laughs]`, `[excited]`, `[curious]`. Moderate density.  
**Normalisation focus:** Expand numbers and abbreviations. Keep colloquial phrasing.

**Before:**

> "The meeting is at 14:00 on 2024-03-15. Attend or send an EOD update."

**After (VIVID):**

> "The meeting's at two PM on March fifteenth. [excited] Make sure you're there — or at least send
> an update by end of day."

---

### 6.3 news_broadcast

**Listener context:** Radio, news TV, public announcement.  
**Register:** Formal, authoritative, neutral. Zero editorialising.  
**Pacing:** Steady, deliberate. One thought per sentence.  
**Sentence structure:** Subject–verb–object. No asides or parentheticals.  
**Emphasis:** Avoid ALL-CAPS entirely. Emphasis is structural, not typographic.  
**Audio tags (VIVID only):** None. News delivery is neutral and untagged.  
**Normalisation focus:** Maximum normalisation. All numbers, dates, abbreviations expanded. Active
voice preferred.

**Before:**

> "Q3 results: $4.2B revenue, up 12% YoY. CEO John Smith said 'strong performance.'"

**After (VIVID):**

> "The company reported four point two billion dollars in third-quarter revenue, an increase of
> twelve percent compared to the same period last year. Chief Executive John Smith described the
> results as a strong performance."

---

### 6.4 documentary

**Listener context:** Documentary film, educational video, museum audio guide.  
**Register:** Educational, gravitas, slightly formal but accessible.  
**Pacing:** Measured. Weight given to key facts. Occasional pause for effect.  
**Sentence structure:** Medium to long. Smooth transitions between ideas.  
**Emphasis:** Occasional ALL-CAPS for a single defining word or statistic.  
**Audio tags (VIVID only):** `[thoughtful]` for reflective passages. Very sparse.  
**Normalisation focus:** All numbers expanded. Units spelled out. Dates fully written.

**Before:**

> "The volcano last erupted in 1883, killing 36,000 people in under 2 hours."

**After (VIVID):**

> "The volcano last erupted in eighteen eighty-three, claiming the lives of thirty-six thousand
> people in under two hours. [thoughtful] It remains one of the deadliest volcanic events in
> recorded human history."

---

### 6.5 dramatic_reading

**Listener context:** Theatre, audiobook with strong characterisation, performance art.  
**Register:** Theatrical, heightened, emotionally intense.  
**Pacing:** Variable and deliberate. Short sentences land as punches. Long sentences build.  
**Sentence structure:** Fragmented for impact. Repetition for emphasis. Rhetorical questions
welcome.  
**Emphasis:** Generous ALL-CAPS. Strategic ellipses for dramatic weight.  
**Audio tags (VIVID only):** `[sarcastic]`, `[crying]`, `[excited]`, `[whispers]`, `[dramatic]`.
Highest permitted density.  
**Normalisation focus:** Normalisations may be softened if the raw form is more dramatic (e.g.,
"twenty-three MILLION dollars" reads better than the plain expanded form).

**Before:**

> "He had no choice. The decision had already been made."

**After (VIVID):**

> "[dramatic] He had NO choice. [sighs] The decision... had ALREADY been made."

---

### 6.6 bedtime_story

**Listener context:** Children's bedtime, relaxation, sleep audio.  
**Register:** Warm, gentle, reassuring. Simple vocabulary.  
**Pacing:** Slow, soothing. Each sentence is a breath. No abrupt transitions.  
**Sentence structure:** Short to medium. Simple clauses. Repetition for comfort.  
**Emphasis:** Minimal ALL-CAPS. Emphasise only magical or comforting words.  
**Audio tags (VIVID only):** `[whispers]` for cosy intimate moments. Very sparse — max 1 per
paragraph.  
**Normalisation focus:** Convert all numbers to simple spoken words. Avoid technical terms.

**Before:**

> "The fox discovered a hidden trail at 11:47 PM."

**After (VIVID):**

> "The little fox discovered a hidden trail... [whispers] deep in the quiet of the night."

---

### 6.7 podcast

**Listener context:** Commute, gym, background listening. Engaged but distracted audience.  
**Register:** Casual-professional. Hosts are knowledgeable and personable.  
**Pacing:** Medium. Energetic but not rushed. Varied for engagement.  
**Sentence structure:** Mix of conversational bursts and explanatory stretches.  
**Emphasis:** Moderate ALL-CAPS. Key terms and surprising facts get emphasis.  
**Audio tags (VIVID only):** `[laughs]`, `[excited]`, `[curious]`. Moderate density.  
**Normalisation focus:** Expand abbreviations, normalise numbers. Contractions welcome.

**Before:**

> "Studies show 73% of listeners prefer audio over reading for educational content."

**After (VIVID):**

> "[curious] Here's something interesting — studies show that seventy-three percent of listeners
> PREFER audio over reading for educational content. Think about what that means for how we
> communicate."

---

### 6.8 lecture

**Listener context:** University lecture, professional training, e-learning module.  
**Register:** Clear, authoritative, structured. Methodical delivery.  
**Pacing:** Steady with deliberate pauses after key concepts.  
**Sentence structure:** Well-organised. Verbal signposting: "First… Second… In summary…"  
**Emphasis:** Sparse ALL-CAPS for key terms being defined. Avoid overuse.  
**Audio tags (VIVID only):** None or minimal. Professional register doesn't suit emotional tags.  
**Normalisation focus:** All numbers, units, abbreviations expanded. Technical terms kept (they are
the content). Add "that is" for first use of initialisms.

**Before:**

> "TCP/IP enables packet-switched network communication across heterogeneous systems."

**After (VIVID):**

> "TCP/IP — that is, Transmission Control Protocol slash Internet Protocol — enables packet-switched
> network communication across HETEROGENEOUS systems. In other words, it allows different networks
> to talk to each other regardless of their underlying technology."

---

### 6.9 meditation

**Listener context:** Mindfulness session, sleep meditation, guided relaxation.  
**Register:** Grounding, present-tense, calm. Minimal vocabulary. Repetitive for anchoring.  
**Pacing:** Very slow. Generous use of ellipses. Each phrase is separate.  
**Sentence structure:** Short, declarative, present tense. No complex clauses.  
**Emphasis:** No ALL-CAPS. Softness is the emphasis.  
**Audio tags (VIVID only):** `[exhales]`, `[sighs]`, `[whispers]`. Sparse but meaningful.  
**Normalisation focus:** Remove all technical tokens. Simplify everything to spoken natural
language.

**Before:**

> "Focus on your breathing. Inhale for 4 counts, hold for 7, exhale for 8."

**After (VIVID):**

> "[whispers] Focus on your breathing... [exhales] Breathe in... slowly... for four counts. Hold...
> for seven. And breathe out... for eight. [sighs] You are here. You are safe."

---

### 6.10 commercial

**Listener context:** Radio ad, pre-roll audio, product announcement.  
**Register:** Energetic, persuasive, confident. Benefits-first language.  
**Pacing:** Fast to medium. Punchy. Strong rhythm. Clear call-to-action.  
**Sentence structure:** Short active sentences. Fragments for punch. Ends with CTA.  
**Emphasis:** Liberal ALL-CAPS for key selling points.  
**Audio tags (VIVID only):** `[excited]`, `[happy]`. Used selectively for opening hook and CTA.  
**Normalisation focus:** Expand all tokens. Numbers as words. Pricing expanded clearly.

**Before:**

> "Get 50% off all plans until Dec 31. Use code SAVE50 at checkout."

**After (VIVID):**

> "[excited] Fifty percent OFF — every plan, right now. Use code SAVE fifty at checkout. But hurry —
> this offer ends December thirty-first. DON'T miss it."

---

## 7. MAX_TAG_DENSITY Specification

**Current problem:** The LLM receives a raw float (e.g., `0.5`) with no unit or scale definition.

### Proposed scale definition

`MAX_TAG_DENSITY` is a float from `0.0` to `1.0` representing the **maximum permitted ratio of
audio-tagged sentences to total sentences** in the output.

| Value | Meaning                                 | Example: 10-sentence text |
| ----- | --------------------------------------- | ------------------------- |
| 0.0   | No audio tags at all                    | 0 tags                    |
| 0.25  | Sparse                                  | ≤2 tags                   |
| 0.5   | Moderate                                | ≤5 tags                   |
| 0.75  | Generous                                | ≤7 tags                   |
| 1.0   | Maximum (every sentence may have a tag) | ≤10 tags                  |

The LLM prompt must include this definition so the model can apply it correctly.

**UI label recommendation:** Replace the raw number slider label with a named scale:

- 0.0 → **None**
- 0.25 → **Sparse**
- 0.5 → **Moderate** (default)
- 0.75 → **Generous**
- 1.0 → **Maximum**

---

## 8. Redesigned System Prompt

Replace `DEFAULT_LLM_NARRATION_SYSTEM_PROMPT` with the following:

```
You are a TTS narration script transformer for ElevenLabs Eleven v3.

Your task is to transform source text into a clean, natural-sounding narration script that will be
passed directly to a TTS engine. The output is spoken audio — there is no human reader.

## Absolute Rules (never violate)

1. OUTPUT ONLY the transformed narration text. No explanations, no commentary, no markdown.
2. NEVER use SSML tags. Eleven v3 does not support them. No <break>, <phoneme>, or any XML tags.
3. NEVER change the factual meaning of any sentence.
4. NEVER invent dialogue, descriptions, or events not present in the source text.
5. NEVER add sound-effect tags ([gunshot], [explosion], [music], [applause]) unless the source
   explicitly describes that sound occurring.
6. Audio tags are voice/delivery directions only: [whispers], [laughs], [sighs], [excited], etc.
7. Use standard square-bracket audio tags: [whispers] not <whispers> or *whispers*.

## Transform Modes

You will receive a MODE parameter. Apply the corresponding level of transformation:

### MODE: MINIMAL
Apply ONLY technical normalisation for TTS readability. Do not restructure, reword, or add
expressiveness.

Mandatory normalisations:
- Abbreviations: Dr. → Doctor, Mr. → Mister, Mrs. → Missus, Ave. → Avenue, St. → Street
  (exception: saint names like St. Patrick remain unchanged)
- Phone numbers: 555-867-5309 → five five five, eight six seven, five three oh nine
- Currency: $47.50 → forty-seven dollars and fifty cents; £1,001 → one thousand and one pounds
- Percentages: 83% → eighty-three percent
- ISO dates: 2024-01-15 → January fifteenth, two thousand twenty-four
- 24-hour time: 14:30 → two thirty PM
- URLs: https://example.com/path → example dot com
- Keyboard shortcuts: Ctrl+Z → control Z; Cmd+S → command S
- Unit abbreviations: 100km → one hundred kilometers; 5TB → five terabytes
- Initialisms on first use: TCP/IP → TCP/IP, that is, Transmission Control Protocol slash Internet Protocol

Do NOT: add audio tags, change word order, add emphasis, restructure sentences.

### MODE: POLISH
Apply all MINIMAL normalisations PLUS structural editing for natural spoken flow.

Additional transforms:
- Break sentences longer than approximately 35 words at natural clause boundaries
- Remove markdown: **bold** → bold, # Heading → Heading:, _italic_ → plain text
- Convert parenthetical asides to appositives or spoken transitions ("(see above)" → "as mentioned")
- Expand e.g. → for example, i.e. → that is, etc. → and so on
- Smooth choppy punctuation: "Red. Green. Blue." → "red, green, and blue"
- Add commas before coordinating conjunctions where a natural breath pause would occur
- Convert colons mid-sentence to spoken transitions: "Result: fail" → "The result was failure"

Do NOT: add audio tags, use ALL-CAPS emphasis, or change the emotional register.

### MODE: VIVID
Apply all POLISH transforms PLUS full expressive optimisation for Eleven v3.

Additional transforms:
- Add audio tags (voice delivery directions only) at a frequency governed by MAX_TAG_DENSITY
- Use ALL-CAPS for 1–3 words per paragraph that carry maximum semantic weight
- Use ellipses (...) for dramatic pauses, hesitation, or emotional build
- Use em-dash (—) for abrupt pivots or interruptions
- Apply style-specific rhythm and tone shaping (see STYLE parameter)
- Adapt register and phrasing to the LOCALE

Constraints:
- Maximum one audio tag per sentence unless two distinct emotions apply to different parts
- Preferred tags: [whispers] [laughs] [sighs] [exhales] [excited] [curious] [thoughtful]
  [sarcastic] [sad] [angry] [dramatic] [reassuring] [short pause] [long pause]
- Avoid: [gunshot] [applause] [music] [standing] [grinning] (non-auditory or sound effects)

## Style Guidance

You will receive a STYLE parameter. Match the output tone, pacing, and register to the style:

- cinematic_audiobook: Literary, measured, evocative. Long-form immersive. Paragraphs breathe.
- conversational: Warm, informal, direct. Natural speech rhythm. Contractions kept.
- news_broadcast: Formal, authoritative, neutral. One thought per sentence. No audio tags.
- documentary: Educational, measured gravitas. Smooth transitions. Sparse tags.
- dramatic_reading: Theatrical, heightened, emotionally intense. Generous emphasis and tags.
- bedtime_story: Gentle, warm, slow. Simple vocabulary. Very sparse [whispers] tags only.
- podcast: Casual-professional. Engaging, varied. Moderate tags and emphasis.
- lecture: Clear, structured, methodical. Verbal signposting. Minimal tags.
- meditation: Very slow, grounding, present-tense. Ellipses for breath. Soft tags only.
- commercial: Energetic, persuasive, punchy. Short sentences. Strong CTA. Excited tags welcome.

## MAX_TAG_DENSITY (VIVID mode only)

You will receive a MAX_TAG_DENSITY value from 0.0 to 1.0. This is the maximum permitted ratio of
audio-tagged sentences to total sentences in your output.

0.0 = no audio tags  |  0.25 = sparse (≤1 in 4 sentences)  |  0.5 = moderate (≤1 in 2 sentences)
0.75 = generous  |  1.0 = maximum (every sentence may have a tag if appropriate)

If MAX_TAG_DENSITY is 0.0, treat the VIVID mode as POLISH mode for tag purposes only.

## LOCALE Guidance

You will receive a LOCALE parameter (e.g., en-US, en-GB, fr-FR). Apply locale-sensitive formatting:

- en-US: Month-Day-Year dates, "color", "center", "$" for US dollars, 12-hour time
- en-GB: Day-Month-Year dates, "colour", "centre", "£" for pounds, 12-hour time with "half past"
- Other locales: Format dates and numbers according to local spoken conventions. Maintain the
  language of the source text; do not translate.
```

---

## 9. Redesigned User Prompt Template

Replace `_build_llm_transform_user_prompt` with the following:

```python
def _build_llm_transform_user_prompt(
    source_text: str, mode: str, locale: str, style: str, max_tag_density: float
) -> str:
    mode_instruction = {
        "MINIMAL": (
            "Apply MINIMAL mode: normalise numbers, abbreviations, currency, dates, times, "
            "URLs, and symbols to their spoken forms. Do not restructure sentences, add audio "
            "tags, or change emphasis. Return only the normalised plain text."
        ),
        "NORMALIZE": (
            "Apply POLISH mode: normalise all technical tokens (numbers, abbreviations, "
            "currency, dates, times, URLs, symbols) AND improve sentence structure for natural "
            "spoken flow. Break long sentences, remove markdown, smooth choppy phrasing. "
            "Do not add audio tags or emphasis. Return only clean narration text."
        ),
        "EXPRESSIVE": (
            "Apply VIVID mode: normalise all technical tokens, improve sentence structure, "
            "AND add expressive delivery for ElevenLabs Eleven v3. Use voice audio tags, "
            "ALL-CAPS emphasis, ellipses, and em-dashes to shape performance. "
            f"Limit audio tags to a density of {max_tag_density:.2f} "
            f"(ratio of tagged sentences to total sentences). "
            f"Match the tone, pacing, and register of the '{style}' style. "
            "Return only the transformed narration text."
        ),
    }.get(
        mode,
        "Apply POLISH mode: normalise text and improve spoken flow. Return only narration text.",
    )

    locale_note = (
        f"Apply {locale} locale conventions for dates, numbers, and spelling."
        if locale and locale.strip() and locale.strip().lower() not in ("", "en-us")
        else ""
    )

    parts = [
        f"TRANSFORM REQUEST\n",
        f"Mode: {mode}\n",
        f"Style: {style}\n",
        f"Locale: {locale}\n",
        f"Max tag density: {max_tag_density:.2f}\n\n",
        f"Instructions: {mode_instruction}\n",
    ]
    if locale_note:
        parts.append(f"Locale note: {locale_note}\n")
    parts.append(f"\nSOURCE TEXT:\n{source_text}")

    return "".join(parts)
```

---

## 10. Local Fallback Parity Fixes

The local `_apply_local_narration_transform` function needs two changes:

### 10.1 MINIMAL (STRICT) mode: add normalisations

Currently returns text unchanged. It should apply all the regex normalisation transforms that are
already in the NORMALIZE branch. The MINIMAL LLM mode promises normalisations; the fallback must
deliver them too.

**Fix:** Remove the early `return text` in the `if mode == "STRICT":` branch and move it to after
all normalisations.

### 10.2 EXPRESSIVE mode: add a best-effort emphasis pass

Currently identical to NORMALIZE fallback. A minimal improvement without an LLM:

1. ALL-CAPS any word in the text that is already emphasised with surrounding exclamation marks or
   that matches a short list of high-impact words (amazing, never, always, critical, etc.) — this is
   cosmetic and optional.
2. Append a status note in the transform log: _"VIVID mode: local fallback applied POLISH-level
   transforms. Audio tags and AI-driven emphasis require a configured LLM."_

The local fallback for EXPRESSIVE should never silently pretend it applied full VIVID transforms.

---

## 11. Before/After Examples

### Input text used for all examples:

> "Dr. Smith presented Q3 results: $4.2B revenue, up 12.5% YoY. The meeting was at 14:00 on
> 2024-09-30. Visit https://results.example.com for details. He said 'we're proud of this.'"

### MINIMAL output:

> "Doctor Smith presented third-quarter results: four point two billion dollars revenue, up twelve
> point five percent year over year. The meeting was at two PM on September thirtieth, two thousand
> twenty-four. Visit results dot example dot com for details. He said 'we're proud of this.'"

### POLISH + news_broadcast:

> "Doctor Smith presented third-quarter results today. Revenue reached four point two billion
> dollars, an increase of twelve point five percent compared to the same period last year. The
> meeting took place at two PM on September thirtieth, two thousand twenty-four. Full results are
> available at results dot example dot com. Smith said the company was proud of the performance."

### VIVID + cinematic_audiobook:

> "[thoughtful] Doctor Smith stepped forward to present the third-quarter results... Four point two
> billion dollars. Up TWELVE point five percent year over year. The boardroom fell quiet at two PM
> on September thirtieth, two thousand twenty-four — a date that would be remembered. 'Visit results
> dot example dot com,' they announced, 'for every last detail.' [sighs] He paused before the final
> words. 'We're proud of this.'"

### VIVID + news_broadcast (same text, different style):

> "Doctor Smith today presented third-quarter financial results. Revenue totalled four point two
> billion dollars — a year-on-year increase of twelve point five percent. The presentation took
> place at two PM on September thirtieth, two thousand twenty-four. Full results are published at
> results dot example dot com. Smith described the outcome as, quote, 'we're proud of this.'"

### VIVID + commercial:

> "[excited] Doctor Smith just dropped the numbers — and they're BIG. Four point two billion
> dollars. Up twelve point five percent. Year over year. September thirtieth, two thousand
> twenty-four — a day to remember. Head to results dot example dot com and see for yourself. In his
> words? 'We're PROUD of this.' And so are we."

---

## 12. Summary Checklist for Implementation

- [ ] Rename panel: "AI Script Polish" with tooltip copy
- [ ] Rename modes in UI: STRICT → Minimal, NORMALIZE → Polish, EXPRESSIVE → Vivid (keep internal
      Python constants as-is or alias for backward compat)
- [ ] Replace `DEFAULT_LLM_NARRATION_SYSTEM_PROMPT` with the redesigned version (§8)
- [ ] Replace `_build_llm_transform_user_prompt` with the expanded version (§9)
- [ ] Fix STRICT/MINIMAL local fallback: apply normalisations instead of returning unchanged text
      (§10.1)
- [ ] Fix EXPRESSIVE local fallback: emit a status message distinguishing it from full VIVID (§10.2)
- [ ] Rename `MAX_TAG_DENSITY` slider labels: 0→None, 0.25→Sparse, 0.5→Moderate, 0.75→Generous,
      1.0→Maximum
- [ ] Add style tooltip descriptions to the style dropdown (10 entries, 1 sentence each)
- [ ] Regression-test all three modes × all three fallback conditions (remote success, remote
      failure + fallback, no model + fallback) per the existing smoke test matrix in the roadmap
