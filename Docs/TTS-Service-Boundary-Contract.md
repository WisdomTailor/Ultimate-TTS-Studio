# TTS Service Boundary Contract

Date: 2026-03-30

## Status

Architecture approved in principle. Stabilization still required before this boundary is treated as
fully stable by downstream repos.

## Repo A Role

Ultimate TTS Studio remains:

- the TTS product
- the owner of synthesis orchestration and engine handlers
- the owner of TTS-facing narration-transform behavior
- the producer of narration artifacts and lineage metadata

Repo A does not own broader creative-orchestration logic.

## Repo B Relationship

Creative Crafter must treat Repo A as a peer narration service.

Primary integration mode:

- API or service boundary for normal operation

Secondary integration mode:

- file handoff boundary for long-form batch, replay, audit, and recovery workflows

## Minimum Request Fields

- `request_id`
- `source_id`
- `caller` or `origin_system`
- `flow_mode`
- `content`
- `content_segments` when applicable
- `transform_enabled`
- `transform_mode`
- `allow_fallback`
- `voice_preset_id` or equivalent target
- `output_format`
- `metadata`

## Minimum Response Fields

- `request_id`
- `status`
- `transform_outcome`
- `final_text_used_for_synthesis`
- `artifacts`
- `sidecar_metadata_path`
- `audio_outputs`
- `error_category` when failed
- `error_message` when failed

## Required Transform Outcome States

These must be surfaced explicitly:

- `remote_success`
- `fallback_used`
- `passthrough`

## Minimum Lineage Requirements

Repo A must expose or persist:

- original source text lineage
- final text actually used for synthesis
- transform outcome state
- requested transform mode and applied path
- provider and model metadata when remote transform was used
- explicit fallback marker when fallback was used
- stable hashes for source text and synthesized text input
- artifact paths for original, transformed, final script, sidecar metadata, and audio outputs

The sidecar must describe what actually happened, not merely what was configured.

## Mandatory Gaps Before Stable Boundary Sign-Off

- transform execution parity for single-text, conversation, and eBook flows
- consistent meaning of `STRICT`, `NORMALIZE`, and `EXPRESSIVE` across all entry points
- explicit surfaced transform outcomes in all relevant flows
- artifact and sidecar integrity validation
- formal API key handling policy
- explicit timeout and retry behavior
- clear error categories for auth, network, timeout, model/config, and validation failures

## Scope That Stays Out Of Repo A

- story ideation and authoring workflows
- scene planning and multimedia orchestration
- cross-project platform governance
- Creative Crafter runtime logic
- duplicated downstream orchestration rules that belong in Repo B

## Operational Recommendation

Treat this boundary as integration-approved but stabilization-required.
