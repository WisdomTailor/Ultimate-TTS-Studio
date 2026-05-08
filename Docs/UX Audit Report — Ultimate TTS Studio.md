UX Audit Report — Ultimate TTS Studio Expert Findings & Recommendations for Council Review

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
Pre-trained Voices / eBook Conversion / Audio Effects") push the actual interface down ~180px. Users
have already opened the app; they don't need to be sold on it. Fix: Remove the cards. Replace with a
single subtitle line under the title, or nothing. File: launch.py, top of create_gradio_interface
Risk: Zero. Pure deletion.

3.2 Emoji Diet Problem: 30+ emoji-bearing buttons and accordion headers create visual noise. When
everything is decorated, nothing stands out. Fix: Remove emoji from all buttons except the single
primary Generate button and header actions. Remove emoji from all accordion headers. Keep emoji only
on top-level mode tabs (📝 Text / 🎭 Conversation / 📚 eBook / 🎙️ VibeVoice / 🤖 Assistant / 📋
Jobs) — these are landmarks where emoji aid fast scanning. Target: ≤ 10 emoji-bearing elements on
the entire page. File: launch.py, all gr.Button, gr.Accordion, and gr.Markdown labels Risk: Zero.
Label changes only.

3.3 Fix the Times New Roman Leak Problem: Three font families (Inter, Arial/Helvetica, Times New
Roman) render simultaneously due to a CSS cascade gap. Fix: Add global font enforcement at the top
of the CSS block:

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
