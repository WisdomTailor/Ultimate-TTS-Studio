# Ultimate TTS Studio — UI Improvement Plan

**Date:** 2026-04-24 **Owner (planning):** Agent 00 (Chief Project Manager) **Owner (execution):**
Agent 09 (Gradio UI Specialist) **Reviewer / Signoff:** Agent 00 **QA:** Agent 10 (Problems &
Diagnostics), Agent 03 (QA) **Source review:** [Conversation of 2026-04-24 — UI/UX consulting
review] **Scope:** `app/launch.py` UI layer only. No changes to generation pipelines, engines, MCP,
or backend services.

---

## 1. Context

The current UI has grown feature-first without a governing information architecture. Live DOM
measurement revealed:

- **403 buttons**, **658 inputs**, **104 sliders**, **44 accordions**, **10 top tabs** and **10
  engine sub-tabs** rendered on the default landing view.
- Three parallel tab systems (top tabs, second copy of top tabs, engine sub-tabs) that are not
  visually differentiated.
- Every button is purple, regardless of role (primary, secondary, destructive, utility).
- Every label is styled as a purple chip, making labels visually compete with actions.
- Times New Roman leaking into some DOM nodes due to a CSS cascade gap.
- Hero marketing cards and admin-only accordions (Model Manager, F5 Model Management, Qwen Model
  Management) render on the landing page for daily users.

The root cause is **missing information hierarchy**, not aesthetics. Fix hierarchy and the "noisy
same-same" feeling resolves.

---

## 2. Guiding Principles

1. **Progressive disclosure.** A new user should see _only_ what they need to generate their first
   clip. Everything else collapses, moves to a settings drawer, or defers to the engine panel.
2. **One primary action per screen.** The main Generate button should be the single highest-
   contrast element visible.
3. **Roles, not repetition.** Buttons have roles (primary / secondary / tertiary / destructive),
   each with a distinct visual treatment.
4. **Respect existing identity.** Keep the purple accent, dark theme, and emoji-forward tab
   branding. Reduce their footprint so they retain meaning.
5. **No backend changes.** This plan is UI-only. Event wiring, generation pipelines, engine
   handlers, MCP tools — all unchanged.
6. **No regressions.** Every existing workflow (Text, Conversation, eBook, VibeVoice, all engine
   tabs, Assistant, Jobs) must continue to function identically after each sprint.

---

## 3. Sprint A — Easy Wins Pass

**Effort:** 2–3 days **Risk:** Low (CSS + label changes + accordion defaults) **Files touched:**
`app/launch.py` (UI section only, lines ~8795–8900 CSS and ~7931+ component tree) **Owner:** Agent
09

### WI-A1 — Kill the hero marketing cards on landing

**Where:** Top of `create_gradio_interface`, immediately after the main title block. **What:**
Remove the 4 "Voice Cloning / Pre-trained Voices / eBook Conversion / Audio Effects" marketing
cards. Replace with a single one-line subtitle under the title, or nothing. **Why:** These are
feature brags that push the actual interface down ~180px. Users have already opened the app; they
don't need to be sold on it. **Acceptance:** Landing view loads with the main title immediately
followed by the Model Manager (if kept) or the mode tabs (if moved per WI-A7). Gradio functional
tests still pass.

### WI-A2 — Unify the Generate button

**Where:** Main generation row in the Text and Conversation tabs. **What:** Replace the two
side-by-side "Generate Speech" and "Generate Conversation" purple buttons with **one** Generate
button whose `value` (label) changes based on the active top-level tab. Implementation:

- Single
  `gr.Button("🎤 Generate Speech", variant="primary", size="lg", elem_id="primary_generate_btn")`.
- `tabs.select()` event updates the button label via a small helper (e.g. "🎤 Generate Speech", "🎭
  Generate Conversation", "📚 Generate Audiobook").
- The button's click handler dispatches to the correct underlying generation function based on the
  active tab's state variable.

**Why:** Two equally-weighted purple primary buttons on the same row is a well-known anti-pattern
that destroys action hierarchy. **Acceptance:** Only one Generate button is visible at any time.
Label reflects the active mode. All three generation paths (Text, Conversation, eBook) still work
correctly.

### WI-A3 — Emoji diet

**Where:** All `gr.Button(...)` labels, all `gr.Accordion(...)` labels, all section markdown
headings. **What:** Remove emoji from:

- All buttons _except_ the single primary Generate button and header actions like
  `⭐ Star on GitHub`.
- All accordion headers (`🧩 Model Manager`, `🎵 F5-TTS Model Management`, `🧠 Narration Transform`,
  `🗣️ Speaker 1 Kokoro Voice`, etc. → plain text labels).
- Section H2/H3 markdown headings.

**Keep emoji on:** Top-level mode tabs (📝 Text / 🎭 Conversation / 📚 eBook / 🎙️ VibeVoice / 🤖
Assistant / 📋 Jobs). These are landmarks; emoji aid fast visual scanning.

**Why:** When everything is decorated, nothing stands out. Baseline count from the DOM is 30+
emoji-bearing buttons; target ≤ 8 emoji on the entire page (5 tab emoji + title sparkle + footer
heart + 1 primary generate).

**Acceptance:** DOM audit shows ≤ 10 emoji-bearing elements on landing.

### WI-A4 — Fix the Times New Roman leak

**Where:** Global CSS block starting at line ~8795. **What:** Add a global font enforcement rule at
the top of the CSS block:

```css
body,
button,
input,
textarea,
select,
label {
  font-family:
    "Inter",
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif !important;
}
* {
  font-family: inherit;
}
```

Keep the existing `.gradio-container` rule. The `*` rule forces inheritance to descendants that
otherwise pick up browser defaults (the source of Times New Roman).

**Why:** Three font families (Inter, Arial/Helvetica, Times New Roman) rendering simultaneously is a
visible polish bug.

**Acceptance:** DOM audit reveals only one font family on all text nodes.

### WI-A5 — Button role system (CSS-only)

**Where:** Global CSS block. **What:** Establish four button tiers using `elem_classes` on the
Python side. Agent 09 decides whether to use Gradio's built-in `variant` or custom `elem_classes`;
recommendation: custom classes for precision.

| Role                                | Visual treatment                               | Use cases                                                                         |
| ----------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------- |
| **Primary** (`btn-primary`)         | Solid purple, elevated, large                  | The single Generate button only                                                   |
| **Secondary** (`btn-secondary`)     | Transparent bg, purple 1px border, purple text | "Apply Transform", "Test Connection", "Save", "Analyze Script", "Cast Characters" |
| **Tertiary** (`btn-tertiary`)       | Ghost (no bg, no border, subtle hover)         | "↺ Reset", "🔄 Refresh", "Clear Temp", small utility actions                      |
| **Destructive** (`btn-destructive`) | Transparent bg, red `#ef4444` border, red text | "Delete Selected", "Unload Model", "Reject"                                       |

Apply classes to the existing buttons in `launch.py` in this pass. For buttons whose role is
ambiguous, default to `btn-secondary`.

**Why:** Single most impactful visual change. Kills the "every button is purple" same-same.

**Acceptance:** DOM audit shows no more than 1–2 elements with the solid purple primary treatment.
Secondary/tertiary buttons are visually distinguishable from primary at a glance.

### WI-A6 — Move admin accordions off landing

**Where:** `Model Manager`, `F5-TTS Model Management`, `Qwen TTS Model Management` accordions
currently render above the mode tabs. **What:**

- Create a new top-level tab `⚙️ MODELS` (or add to a collapsed "Settings" accordion at the bottom)
  that contains the three model-management accordions.
- Remove them from the landing area. Users who need them click the Models tab.
- Alternative (smaller change): leave them where they are but set `open=False` on all three and
  group them under a single "🔧 Model Management" super-accordion that defaults closed.

Agent 09 chooses the lower-risk option (super-accordion default-closed) for Sprint A; Sprint B may
promote to a dedicated tab.

**Why:** These are install-time, not run-time concerns. Daily users don't touch them.

**Acceptance:** Default landing shows no Model Manager UI above the mode tabs. Models remain
loadable via the new location.

### WI-A7 — Collapse slider rows to compact form

**Where:** All `gr.Slider(...)` instances across engine panels. **What:** Apply a CSS rule that
reduces slider row height by ~30% and places label + value on the same line:

```css
.gr-slider,
.gradio-slider {
  padding: 4px 0 !important;
}
.gr-slider .label-wrap,
.gradio-slider .label-wrap {
  font-size: 0.85rem !important;
  margin-bottom: 2px !important;
}
.gr-slider input[type="number"] {
  font-size: 0.8rem !important;
  padding: 2px 6px !important;
}
```

Description text (the sentence below each slider) moves to the `info` attribute of the slider where
it already is, but CSS hides it by default and reveals on hover/focus:

```css
.gr-slider .block-info,
.gradio-slider .block-info {
  opacity: 0;
  max-height: 0;
  transition:
    opacity 0.15s,
    max-height 0.15s;
  overflow: hidden;
}
.gr-slider:hover .block-info,
.gr-slider:focus-within .block-info,
.gradio-slider:hover .block-info,
.gradio-slider:focus-within .block-info {
  opacity: 1;
  max-height: 3em;
}
```

**Why:** With 104 sliders, even a 30% row-height saving reclaims significant vertical space.
Descriptions remain discoverable on hover.

**Acceptance:** Slider rows visibly shorter. Descriptions appear on hover/focus. All sliders still
adjust values correctly.

### WI-A8 — Label chip suppression

**Where:** Global CSS. **What:** Remove the solid purple chip styling from component labels
(`gr.Textbox`, `gr.Slider`, `gr.Dropdown` labels) so they read as passive text, not action chips.
Keep labels readable but de-emphasized so they don't compete with real buttons.

```css
.gradio-container label,
.gradio-container .label-wrap > span {
  background: transparent !important;
  color: var(--text-secondary) !important;
  font-weight: 500 !important;
  font-size: 0.88rem !important;
  padding: 0 !important;
}
```

**Why:** Labels styled as chips make the eye treat every form field as a clickable action. This is
the single biggest contributor to the "403 buttons that all look the same" feeling.

**Acceptance:** Labels render as muted text, not as filled chips. No labels register as buttons in
assistive-tool audits.

### Sprint A Completion Gate

- DOM audit metrics meet targets (see §5 Acceptance Metrics).
- Visual screenshot diff captured (landing + one scrolled view, before/after).
- No functional regressions: text generation, conversation generation, eBook path, VibeVoice, model
  load/unload, engine switching, LLM transform, pronunciation glossary, jobs tab, assistant tab all
  verified working.
- `python -m py_compile app/launch.py` passes.
- Scoped commit pushed to `origin/my-custom-features`.

---

## 4. Sprint B — Structural Cleanup

**Effort:** 3–5 days **Risk:** Medium (touches tab structure and component ordering) **Files
touched:** `app/launch.py` (UI section) **Owner:** Agent 09 **Prerequisite:** Sprint A signed off.

### WI-B1 — Engines → dropdown inside each mode

**Where:** The second-layer "engine tabs" inside the Text / Conversation / eBook tabs. **What:**
Replace the 10-engine tab strip with:

- A single `gr.Dropdown(label="Voice Engine", choices=[...])` with engines as options.
- One `gr.Group()` per engine below, controlled by `visible=True/False` based on the dropdown
  selection.
- `dropdown.change()` event toggles visibility.

**Why:** 10 tabs in a single strip force overflow menus and create a second tab system that competes
with the top mode tabs. A dropdown is the standard control for >5 peer choices.

**Acceptance:** Only one engine panel is visible at a time. Switching engines is one click, not two.
No tab-overflow menu needed.

### WI-B2 — Sticky output panel

**Where:** Right column of the main layout. **What:** The "Generated Audio" player, status line, and
last-seed text move into a sticky right column that follows the user's scroll. Implementation: CSS
`position: sticky; top: 16px;` on the output column, with a reasonable min-width.

**Why:** Page is 1766px tall. User scrolls down to adjust settings, then must scroll back up to play
the result. A sticky player removes that friction.

**Acceptance:** Playing generated audio works from any scroll position without requiring scroll-
back.

### WI-B3 — Audio Effects → output card

**Where:** Audio Effects Studio currently lives at bottom of page (~line 12300+). **What:** Move
Audio Effects controls adjacent to (or inside a tab alongside) the Generated Audio player.
Rationale: effects apply _to_ generated audio; they belong with the audio, not 1500 pixels below it.

**Why:** Spatial proximity between cause (generated audio) and effect (DSP controls).

**Acceptance:** Audio Effects Studio is within one scroll of the output player, or inside the output
panel itself as a collapsed section.

### WI-B4 — Surface tier system

**Where:** Global CSS. **What:** Introduce a 3-tier surface system via CSS variables:

- **Surface 0** (page bg): existing gradient
- **Surface 1** (working area: text box, primary engine panel, output): `rgba(255, 255, 255, 0.05)`,
  slight upward elevation via box-shadow
- **Surface 2** (contextual panels: accordions, settings, admin): `rgba(0, 0, 0, 0.2)`, inset
  appearance

Update `gr.Group()` and `gr.Accordion()` default backgrounds to match.

**Why:** Currently every card has identical dark-purple background. Visual hierarchy collapses. A
4–6% luminance difference between tiers gives the eye somewhere to rest.

**Acceptance:** Main working area is visually distinct from contextual/admin surfaces at a glance.

### Sprint B Completion Gate

Same as Sprint A, plus:

- Engine-switching UX smoke test on at least 3 engines (Chatterbox, Kokoro, VibeVoice).
- Generated audio playback verified from scrolled-down position.
- Scoped commit pushed.

---

## 5. Acceptance Metrics (Objective, Measurable)

Measured via DOM audit (Playwright `page.evaluate`).

| Metric                         |       Baseline |      Post-Sprint A target |     Post-Sprint B target |
| ------------------------------ | -------------: | ------------------------: | -----------------------: |
| Total buttons on landing       |            403 |                     ≤ 250 |                    ≤ 150 |
| Emoji-bearing buttons          |           ~30+ |                      ≤ 10 |                     ≤ 10 |
| Distinct font families         |              3 |                         1 |                        1 |
| Accordions open at landing     |    ~12 visible |                       ≤ 6 |                      ≤ 4 |
| Top-level tabs                 |             10 | 10 (deferred to Sprint B) |                      ≤ 6 |
| Engine sub-tabs                |             10 | 10 (deferred to Sprint B) | 0 (replaced by dropdown) |
| Unique button visual roles     | 1 (all purple) |                       ≥ 3 |                      ≥ 4 |
| Label chips treated as buttons |            All |                      None |                     None |

---

## 6. Risk Register

| #   | Risk                                                                     | Severity | Mitigation                                                                                                 |
| --- | ------------------------------------------------------------------------ | :------: | ---------------------------------------------------------------------------------------------------------- |
| R1  | CSS changes break Gradio default styles on minor version update          |    🟡    | Target classes via `elem_classes` where possible, not generic selectors.                                   |
| R2  | Removing emoji from buttons regresses user recognition of known controls |    🟢    | Keep emoji on top-level tabs and the single primary button.                                                |
| R3  | Engine dropdown change in Sprint B breaks per-engine event wiring        |    🟡    | Keep each engine's component group intact; only swap `visible` state. No handler signature changes.        |
| R4  | Unified Generate button in WI-A2 mis-dispatches based on active tab      |    🟡    | Use the existing `tabs.select()` state variable. Unit test each of the 3 paths.                            |
| R5  | Sticky output in WI-B2 overlaps other columns on narrow viewports        |    🟢    | Media query disables stickiness below ~1280px width.                                                       |
| R6  | SUP3R Edition vs pinokiofactory upstream drift on UI                     |    🟡    | Work lands on `my-custom-features` branch first. Upstream sync deferred to PR flow per project convention. |

---

## 7. Governance & Commit Policy

- Each WI within a sprint **may** land as its own commit; each sprint **must** land as at least one
  commit pushed to `origin/my-custom-features`.
- Commit messages follow `.github/instructions/commit-message.instructions.md`.
- Scope each commit to UI changes only; do not bundle unrelated working-tree modifications.
- Agent 09 reports completion to Agent 00 after each sprint with:
  1. List of WIs completed (with commit hashes).
  2. DOM audit results vs acceptance metrics.
  3. Before/after screenshots.
  4. Functional smoke-test results.

---

## 8. Out of Scope (Sprint C / Later)

Not in this plan; listed for visibility:

- Three-pane layout (left rail nav / main / right rail output).
- Settings drawer.
- First-run onboarding modal.
- Compact/comfortable density toggle.
- Icon set migration (Lucide / Phosphor) to replace emoji.
- Accessibility audit (WCAG AA contrast, keyboard nav, screen-reader labels).

These are tracked as potential Sprint C work; no commitment is made here.

---

## 9. Approvals

| Role            | Agent    | Status                         |
| --------------- | -------- | ------------------------------ |
| Plan author     | Agent 00 | ✅ Authored 2026-04-24         |
| Execution owner | Agent 09 | ⏳ Pending kickoff             |
| QA owner        | Agent 10 | ⏳ Pending Sprint A handoff    |
| Final signoff   | Agent 00 | ⏳ Pending Sprint B completion |

---

## UX Audit Report — Ultimate TTS Studio Expert Findings & Recommendations for Council Review

1. Executive Summary After reviewing the codebase, documentation, and live UI structure, the user
   feedback is accurate and actionable. The UI suffers from information hierarchy collapse, not
   aesthetic failure. The root cause is a 16,200-line Gradio monolith that has grown feature-first
   without governing architecture. There are 403 buttons, 658 inputs, 104 sliders, 44 accordions,
   and 20+ tabs rendered across the interface, with no visual differentiation between primary
   actions, secondary settings, and administrative controls.

The good news: most fixes are UI-only (CSS + component reorganization) and do not touch generation
pipelines. A phased approach can deliver measurable UX improvement within days, not weeks.

1. Evidence from Codebase Metric Finding Source DOM Scale 403 buttons, 658 inputs, 104 sliders, 44
   accordions, 10 top tabs + 10 engine sub-tabs UI-Improvement-Plan.md §1 Monolith Size ~16,200
   lines in single launch.py launch-py-index.md Nesting Depth Accordion → Row → Column → Accordion
   patterns repeated 20+ times grep_search on launch.py Visual Noise Every button purple regardless
   of role; every label styled as a filled chip UI-Improvement-Plan.md §1 Font Leak Times New Roman
   rendering in nested DOM nodes due to CSS cascade gap UI-Improvement-Plan.md §1 Landing Bloat Hero
   marketing cards + Model Manager accordions push actual interface down ~180px
   UI-Improvement-Plan.md §3 Naming Debt "Narration Transform (LLM)" panel and
   STRICT/NORMALIZE/EXPRESSIVE modes are user-unfriendly Narration-Transform-Design-Review.md

2. Easy Wins (Low Risk, High Impact, 2–3 Days) These are CSS-only or label-only changes that require
   no backend refactoring and no event handler rewiring.

   3.1 Kill the Hero Marketing Cards on Landing Problem: Four feature-brag cards ("Voice Cloning /
   Pre-trained Voices / eBook Conversion / Audio Effects") push the actual interface down ~180px.
   Users have already opened the app; they don't need to be sold on it. Fix: Remove the cards.
   Replace with a single subtitle line under the title, or nothing. File: launch.py, top of
   create_gradio_interface Risk: Zero. Pure deletion.

   3.2 Emoji Diet Problem: 30+ emoji-bearing buttons and accordion headers create visual noise. When
   everything is decorated, nothing stands out. Fix: Remove emoji from all buttons except the single
   primary Generate button and header actions. Remove emoji from all accordion headers. Keep emoji
   only on top-level mode tabs (📝 Text / 🎭 Conversation / 📚 eBook / 🎙️ VibeVoice / 🤖 Assistant /
   📋 Jobs) — these are landmarks where emoji aid fast scanning. Target: ≤ 10 emoji-bearing elements
   on the entire page. File: launch.py, all gr.Button, gr.Accordion, and gr.Markdown labels Risk:
   Zero. Label changes only.

   3.3 Fix the Times New Roman Leak Problem: Three font families (Inter, Arial/Helvetica, Times New
   Roman) render simultaneously due to a CSS cascade gap. Fix: Add global font enforcement at the
   top of the CSS block:

File: launch.py, CSS block (~line 8795) Risk: Zero. CSS-only.

3.4 Button Role System (CSS-Only) Problem: Every button is solid purple, regardless of whether it is
a primary action, secondary setting, or destructive operation. This destroys action hierarchy. Fix:
Establish four visual tiers using elem_classes:

Role Visual Treatment Use Cases Primary Solid purple, elevated, large The single Generate button
only Secondary Transparent bg, purple 1px border, purple text "Apply Transform", "Test Connection",
"Save", "Analyze Script" Tertiary Ghost (no bg, no border, subtle hover) "Reset", "Refresh", "Clear
Temp", small utility actions Destructive Transparent bg, red border, red text "Delete Selected",
"Unload Model", "Reject" File: launch.py, CSS block + elem_classes on button definitions Risk: Very
low. CSS + class assignment only.

3.5 Collapse Admin Accordions by Default Problem: Model Manager, F5-TTS Model Management, and Qwen
TTS Model Management are install-time concerns, not run-time concerns. They render expanded on the
landing page for daily users. Fix: Group them under a single "Model Management" super-accordion with
open=False. File: launch.py, Model Manager section (~lines 9072–9200) Risk: Very low. Default state
change only.

3.6 Rename "Narration Transform (LLM)" → "AI Script Polish" Problem: The current panel name and mode
names (STRICT / NORMALIZE / EXPRESSIVE) are opaque to users. This was already identified in
Narration-Transform-Design-Review.md. Fix: Rename panel to "AI Script Polish". Rename modes to
Minimal / Polish / Vivid with clear behavioral descriptions. File: launch.py, Narration Transform
accordion (~lines 9510–9680) Risk: Low. Label changes + dropdown choices update.

1. Harder but Worthwhile Improvements (Medium Risk, Structural, 1–2 Weeks) These require component
   reorganization and potentially event handler adjustments, but still no backend pipeline changes.

4.1 Unify the Generate Button Problem: Two side-by-side "Generate Speech" and "Generate
Conversation" purple buttons destroy action hierarchy. Users must decide which to click before the
UI has guided them to a mode. Fix: Replace with one Generate button whose label changes based on the
active top-level tab:

Text tab: "🎤 Generate Speech" Conversation tab: "🎭 Generate Conversation" eBook tab: "📚 Generate
Audiobook" Use tabs.select() event to update the button label. The button's click handler dispatches
to the correct underlying generation function based on active tab state. File: launch.py, main
generation row (~lines 9490–9700) Risk: Medium. Requires event wiring change and a small dispatch
helper.

4.2 Progressive Disclosure for Engine Settings Problem: All 14 engine parameter panels are visible
simultaneously in nested accordions. A user running Kokoro sees sliders for Chatterbox Turbo,
IndexTTS2 emotion vectors, F5-TTS cross-fade, etc. Fix: Show only the active engine's parameter
panel. Use the engine dropdown's .change() event to toggle visibility of the corresponding parameter
accordion. This is standard Gradio pattern (gr.update(visible=...)). File: launch.py, Engine
Selection accordion (lines 11600–11750) and engine settings tabs (lines 11750–12300) Risk: Medium.
Requires visibility wiring for ~14 engine panels.

4.3 Compact Slider Rows Problem: Slider rows consume excessive vertical space. Each slider has a
label, value field, and description sentence, often stacked vertically. Fix: CSS rule to place
label + value on the same line, reduce row height by ~30%. Hide description text by default; reveal
on hover/focus. File: launch.py, CSS block + slider component definitions Risk: Low. CSS-only, but
requires testing across all engine panels.

4.4 Move Admin-Only Controls to a Dedicated Tab Problem: Model Management, Output Storage, and
system diagnostics are admin/install-time concerns mixed with creative workflow controls. Fix:
Create a new top-level tab ⚙️ Settings (or 🔧 System) that houses:

Model Manager F5-TTS / Qwen Model Management Output Storage configuration System diagnostics / temp
file cleanup LLM provider defaults (global) Remove these from the landing area entirely. File:
launch.py, tab structure (~line 7931+) Risk: Medium. Requires reorganizing the component tree and
verifying no event handlers break.

4.5 Conversation Mode Speaker Panel Simplification Problem: Conversation mode has deeply nested
speaker assignment panels with 5+ voice sample uploaders, reference text fields, and per-speaker
engine dropdowns. The nesting depth contributes to the "complicated" feeling. Fix:

Collapse individual speaker panels into a single "Cast Characters" accordion. Use a gr.DataFrame or
compact card grid to show speaker → voice → preset mappings at a glance. Expand individual speaker
details only when a row is selected. File: launch.py, Conversation Mode tab (~lines 9700–10600)
Risk: Medium. Requires component restructuring but existing state management can be preserved. 4.6
History Tab Filter Wiring (Deferred from Previous Session) Problem: History tab dropdown filters
were changed from Textbox to Dropdown in a previous session, but backend handlers are not wired.
Fix: Add handle_history_tab_activate event, update handle_history_panel_refresh to accept engine
parameter, and synchronize all event handler inputs/outputs. File: launch.py, History tab (~lines
13250+) Risk: Low-Medium. Backend handler updates required.

1. Strategic Recommendations (High Impact, Longer Timeline) These are architectural and should be
   gated on Phase 4 stability per AGENTS.md.

5.1 Component Tree Modularization The 16,200-line launch.py is unmaintainable for UI work. Extract
each major tab into its own module:

ui/text_tab.py ui/conversation_tab.py ui/ebook_tab.py ui/history_tab.py ui/assistant_tab.py Each
module returns its component tree and event wiring. launch.py becomes an orchestrator. Effort: 2–3
weeks. Blocked on: Test coverage for regression safety.

5.2 Workflow-Onboarding Wizard New users see 10 tabs and 14 engines with no guidance. A one-time
onboarding wizard (or a persistent "Quick Start" banner) that asks:

"What are you making?" (Single voice / Conversation / Audiobook) "Do you have a reference voice?"
(Yes/No) "What's your hardware?" (CPU/GPU) ...and then pre-selects the optimal engine, collapses
irrelevant tabs, and sets sensible defaults. Effort: 1–2 weeks. Value: Dramatically reduces
time-to-first-generation.

5.3 Preset-Centric Voice Library The current voice preset system is powerful but buried. A dedicated
"Voice Library" tab with:

Grid of voice cards (preset name + preview audio + tags) Drag-and-drop assignment to Conversation
speakers One-click "Use for Text" button ...would make the preset system a first-class workflow
feature rather than a hidden power-user tool. Effort: 2 weeks.

1. Prioritized Implementation Roadmap Phase Items Effort Risk Owner Sprint A 3.1 Kill hero cards,
   3.2 Emoji diet, 3.3 Font fix, 3.4 Button roles, 3.5 Collapse admin accordions, 3.6 Rename
   transform panel 2–3 days Very Low Agent 09 Sprint B 4.1 Unified Generate button, 4.2 Progressive
   engine disclosure, 4.3 Compact sliders, 4.6 History filter wiring 3–5 days Medium Agent 09 Sprint
   C 4.4 Settings tab extraction, 4.5 Conversation panel simplification 1 week Medium Agent 09 Phase
   5 5.1 Component modularization, 5.2 Onboarding wizard, 5.3 Voice Library tab 2–4 weeks High Agent
   09 + 08
2. Success Metrics Metric Baseline Target (Post-Sprint A) Target (Post-Sprint C) Visible buttons on
   landing 403 ≤ 50 ≤ 30 Emoji-bearing elements 30+ ≤ 10 ≤ 10 Vertical scroll to first input ~180px
   ≤ 80px ≤ 60px Visible accordion panels (default) 44 ≤ 15 ≤ 10 Font families rendered 3 1 1
   Time-to-first-generation (new user) Unknown — ≤ 60 seconds
3. Conclusion The UI is not broken — it is un-governed. The feature set is excellent (14 engines,
   LLM transforms, conversation mode, eBook conversion), but the presentation layer has outgrown its
   container.

The council should approve Sprint A immediately. It is zero-risk, high-visibility, and will validate
whether the UX complaints resolve with hierarchy fixes alone. If user feedback improves after Sprint
A, proceed to Sprint B. If not, the issue is deeper than presentation and requires the structural
changes in Sprints B–C.

The existing UI-Improvement-Plan.md is a solid technical execution document. This report validates
its findings and adds the Conversation panel simplification, History filter wiring, and Voice
Library recommendations based on direct codebase inspection.

Respectfully submitted for council consideration. Agent 08 (Global Agent Manager) — UX Audit Session
