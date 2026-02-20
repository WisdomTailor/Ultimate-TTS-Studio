# Ultimate-TTS-Studio-SUP3R-Edition

A Pinokio script for https://github.com/SUP3RMASS1VE/Ultimate-TTS-Studio-SUP3R-Edition

## Voice Presets + Wrapper Pipeline

The app now includes a unified preset and generation wrapper workflow in `app/launch.py`:

- Persistent preset storage in `app_state/presets.json`
- Managed preset audio storage in `app_state/voices/`
- Runtime preset selection for supported engines (`ChatterboxTTS`, `Chatterbox Multilingual`, `Chatterbox Turbo`)
- Deterministic seed capture with visible `Last Seed` output
- Optional autosave pipeline for generated artifacts in `app_state/outputs/<project>/` (or custom output base path)
- Configurable generated-output storage mode in the UI (`Project Folders` or `Custom Path`) while keeping `app_state/voices/` local
- Conversation and audiobook generations now write sidecar metadata JSON next to saved audio (and conversation script sidecar text)
- Selecting `Custom Path` now opens a folder picker in front of the app for easier path selection
- Main generate flow keeps structured autosave storage by default and also keeps legacy outputs by default, with an option to auto-clean legacy copies if desired

Autosave writes:

- audio file (`audio/`)
- source script text (`scripts/`)
- metadata JSON (`meta/`) including engine, seed, preset, and text hash

Reference design and checklists are in `app/docs/`.



