# **TTS Studio — System‑Wide Read Aloud Replacement**

## Agent Handover Brief

---

> ## 📋 Review Status — 2026-04-24
>
> **Reviewed by:** Agent 00 (Chief Project Manager) **Verdict:** ✅ Feasible, strategically aligned,
> but scope needs revision before implementation. **Phase:** 🚪 **Phase 5 candidate — GATED.**
> Cannot start until Phase 4a + 4b both shipped and user demand validated (see `AGENTS.md` Phase 5
> Entry Criteria). **Action:** Shelved pending Phase 4b completion + demand validation.
>
> **Companion document:** [`Docs/Read-Aloud-Strategic-Review.md`](./Read-Aloud-Strategic-Review.md)
> — contains the full review, revised scope, risk analysis, and implementation plan. **Read that
> document before acting on this brief.**
>
> **Do NOT implement this proposal as written.** Key corrections in the strategic review:
>
> 1. The `POST /speak` endpoint does **not** need to be built from scratch — `app/mcp_sidecar.py`
>    already exposes `synthesize`, `submit_synthesis_job`, `list_voices`, and bearer auth. Add one
>    FastAPI route, don't build a parallel server.
> 2. **Latency is the #1 reliability risk** and is unaddressed in this brief. A "fast-path" engine
>    (Piper / Kokoro class) must be bundled — heavy engines (Chatterbox, VibeVoice, Higgs) have
>    3–30s cold start and will fail as a Read Aloud replacement without warm-start + streaming.
> 3. Windows global hotkey + clipboard capture has non-obvious failure modes (admin hooks, race
>    conditions, clipboard restoration). Prototype before architecting.
> 4. Accessibility hotkeys (rate, pause, skip) are **MVP scope**, not a "future extension."
> 5. Tray app is a v2 concern, not MVP.

---

## **1. Project Overview**

The goal of this project is to extend **The Ultimate TTS Studio** into a **system‑wide, universal
Read Aloud replacement**.  
Instead of relying on Microsoft Edge’s built‑in Read Aloud (which cannot use custom voices or local
models), the TTS Studio will provide:

- A **local, privacy‑preserving** text‑to‑speech engine
- A **global hotkey** for “Speak Selected Text”
- A **background listener service** that accepts text from any application
- A **clean, extensible API** for future features
- A **tray‑level UX** for quick access and control

This transforms TTS Studio from a standalone tool into a **system‑integrated narration engine**.

---

## **2. Core Objectives**

### **2.1 Functional Goals**

- Replace Edge Read Aloud with a **universal, app‑agnostic** solution
- Enable **instant TTS playback** from any application
- Maintain **local inference** (no cloud dependency)
- Support **multiple voices, presets, and emotional profiles**
- Provide a **stable, documented API** for internal and external use

### **2.2 Technical Goals**

- Add a lightweight **local HTTP endpoint** (e.g., `/speak`)
- Implement a **global hotkey listener**
- Add a **background service mode** (minimized or tray icon)
- Integrate with existing TTS Studio pipelines (Fish Speech, AllTalk, ElevenLabs local, etc.)
- Ensure modularity for future expansion (batch mode, continuous reading, dialogue mode)

---

## **3. Proposed Architecture**

### **3.1 Local TTS Listener Service**

A minimal local server (Python, Node, or integrated directly into the Studio) that:

- Accepts POST requests containing text, voice, preset
- Routes text into the existing TTS Studio inference pipeline
- Plays audio immediately or returns audio buffers
- Supports queueing and cancellation

**Endpoint example:**

```text
POST /speak
{
  "text": "...",
  "voice": "default",
  "preset": "neutral"
}
```

---

### **3.2 Global Hotkey Integration**

A system‑wide hotkey triggers:

1. Copy selected text
2. Send it to the local TTS listener
3. Playback through TTS Studio

This replaces the Read Aloud UX entirely.

---

### **3.3 Tray Application / Background Mode**

A small UI surface providing:

- Start/stop listener
- Voice/preset selection
- Hotkey configuration
- Playback controls (pause/stop/queue)
- Status indicators

This ensures the TTS engine is always available without opening the full Studio.

---

## **4. Integration Points Inside TTS Studio**

### **4.1 Engine Layer**

Expose a simple internal function:

```python
speak(text, voice, preset)
```

This wraps the existing model pipeline and handles:

- Chunking
- Normalization
- Inference
- Audio playback

### **4.2 Preset System**

Allow the listener to reference:

- Voice presets
- Emotional presets
- Narration modes

### **4.3 Logging & History**

All system‑wide reads should appear in:

- Session history
- Voice usage logs
- Optional audio export

---

## **5. Future Extensions (Optional but Recommended)**

- **Continuous Reading Mode**  
  Automatically read the next paragraph or selection.

- **Dialogue Mode**  
  Auto‑switch voices based on speaker tags.

- **Script Doctor Integration**  
  Pre‑process text for clarity, pacing, or emotional tone.

- **Pinokio Automation**  
  Allow remote triggering or batch narration workflows.

- **Plugin API**  
  Let external tools send text directly to the Studio.

---

## **6. Deliverables for the Agent**

The agent working on this project should produce:

1. **Local Listener Module**
   - `/speak` endpoint
   - Audio playback integration
   - Error handling

2. **Hotkey Integration**
   - Global listener
   - Configurable shortcut
   - Clipboard capture

3. **Tray App / Background Mode**
   - Minimal UI
   - Status + controls
   - Auto‑start option

4. **Documentation**
   - API reference
   - Integration guide
   - Developer notes

5. **Testing & Validation**
   - Latency benchmarks
   - Long‑text stability
   - Multi‑voice switching
   - Error recovery

---

## **7. Success Criteria**

The project is considered successful when:

- The user can highlight text in any app and press a hotkey to hear it spoken by TTS Studio
- The system works offline, reliably, and with low latency
- The TTS Studio becomes the default “Read Aloud” engine across the OS
- The architecture is modular and ready for future expansion

---

## **8. Notes for the Agent**

- Maintain modularity: avoid hard‑coupling UI, listener, and engine layers
- Keep the listener lightweight and resilient
- Prioritize low latency and smooth playback
- Ensure the system can run continuously without memory leaks
- Follow existing TTS Studio coding style and project structure

---

If you want, I can also generate:

- A **technical architecture diagram**
- A **task breakdown for GitHub Issues**
- A **developer onboarding doc**
- A **VS Code workspace setup guide**
- A **starter implementation for the listener service**
