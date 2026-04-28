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
