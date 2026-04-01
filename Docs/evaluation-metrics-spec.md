# Evaluation Metrics Specification

**Version:** 1.0  
**Date:** 2026-04-04  
**Author:** Agent 03 (Quality Assurance)  
**Status:** Active — defines Phase 3 completion gates

---

## 1. Purpose

This document defines the metrics, thresholds, tooling, and execution plan for the Ultimate TTS
Studio evaluation infrastructure. These metrics serve as completion gates — Phase 3 cannot ship
until all relevant tests pass.

---

## 2. Test Suites

### 2.1 Transform Consistency

**Goal:** Verify that the narration transform pipeline produces stable, reproducible output.

#### 2.1.1 Minimal Mode Consistency

- **Input:** 100 test sentences from the existing test corpus (`tests/test_narration_transform.py`)
- **Method:** Run `deterministic_normalize()` 3× on each input
- **Metric:** Exact string match across all 3 runs
- **Pass threshold:** 100% — deterministic function, zero variance allowed
- **Tooling:** `pytest` with `@pytest.mark.parametrize`
- **Frequency:** Every CI run
- **Failure action:** Immediate fix — indicates non-determinism bug

#### 2.1.2 Polish Mode Consistency

- **Input:** 50 representative sentences (subset of Minimal corpus)
- **Method:** Run `apply_llm_narration_transform()` with Polish mode 3× on each input, same provider and model
- **Metric:** Exact string match across all 3 runs (LLM temperature should be ~0 for Polish)
- **Pass threshold:** 95% of sentences match exactly (5% variance allowed for LLM non-determinism at low temperature)
- **Tooling:** `pytest` + LLM provider fixture
- **Frequency:** Nightly (requires LLM provider running)
- **Failure action:** Investigate if temperature is set correctly; if LLM is non-deterministic at temp=0, document the provider-specific behavior

#### 2.1.3 Vivid Mode Consistency

- **Input:** 50 representative sentences
- **Method:** Run `apply_llm_narration_transform()` with Vivid mode 3× on each input, same provider and model
- **Metric:** Pairwise cosine similarity of sentence embeddings (using `sentence-transformers`)
- **Pass threshold:** Mean pairwise similarity >0.95
- **Tooling:** `pytest` + `sentence-transformers` (`all-MiniLM-L6-v2`)
- **Frequency:** Nightly
- **Failure action:** If below threshold, check temperature setting — Vivid uses higher temp, some variance is expected

### 2.2 Provider Parity

**Goal:** Verify that different LLM providers produce semantically equivalent transforms.

#### 2.2.1 Cross-Provider Polish Parity

- **Input:** 20 representative sentences
- **Method:** Run Polish mode transform on the same input across 3 providers (e.g., Ollama + LM Studio + Google Gemini)
- **Metric:** Pairwise cosine similarity of sentence embeddings across providers
- **Pass threshold:** Mean similarity >0.80
- **Tooling:** `pytest` + `sentence-transformers` + provider fixtures
- **Frequency:** Weekly (requires multiple providers available)
- **Failure action:** If a specific provider consistently diverges, add model-specific prompt template. Document which provider/model combinations are validated.

#### 2.2.2 Workaround Documentation

When a provider fails parity tests:

1. Record the provider name, model, and divergent output samples
2. Attempt prompt engineering fixes (more explicit instructions for weaker models)
3. If unfixable, document as a known limitation with recommended alternatives
4. Parity test for that provider moves to "known-divergent" tier (tracked but not blocking)

### 2.3 Speaker Attribution

**Goal:** Verify that the AI conversation formatter correctly identifies speakers from raw text.

#### 2.3.1 Attribution Accuracy

- **Input:** 7 golden scripts (`tests/golden_scripts/*.json`)
- **Method:** Feed `source_text` to the conversation formatter, compare output speaker labels against `expected_output`
- **Metric:** Precision, Recall, F1 score per script (macro-averaged)
  - **Precision:** Of lines assigned to a speaker, what % are correct?
  - **Recall:** Of lines that should be assigned to a speaker, what % were found?
  - **F1:** Harmonic mean of precision and recall
- **Pass threshold:** Macro-averaged F1 >0.75
- **Tooling:** `pytest` + `sklearn.metrics.f1_score` (or manual calculation to avoid heavy dep)
- **Frequency:** Every CI run (once conversation formatter exists)
- **Failure action:** Review misattributed lines; strengthen prompt for ambiguous cases

#### 2.3.2 Ambiguity Detection

- **Input:** Golden scripts with `"ambiguous": true` lines
- **Method:** Check if the formatter flags the same lines as ambiguous
- **Metric:** Recall of ambiguous line detection
- **Pass threshold:** >0.60 (ambiguity is inherently hard — lower threshold)
- **Tooling:** `pytest`
- **Frequency:** Every CI run
- **Failure action:** Review false negatives; adjust confidence thresholds

### 2.4 Audio Regression

**Goal:** Detect unexpected changes in synthesized audio characteristics.

#### 2.4.1 Duration Stability

- **Input:** 10 reference sentences with known expected duration (recorded baseline)
- **Method:** Synthesize each sentence with the same engine/voice, measure duration
- **Metric:** Absolute percentage difference from baseline duration
- **Pass threshold:** All within ±10% of baseline
- **Tooling:** `pytest` + `librosa` or `scipy.io.wavfile` for duration measurement
- **Frequency:** After engine updates or handler changes
- **Failure action:** Compare waveforms; check if engine version changed

#### 2.4.2 Silence Ratio

- **Input:** Same 10 reference sentences
- **Method:** Measure ratio of silence (below -40dB) to total duration
- **Metric:** Silence ratio difference from baseline
- **Pass threshold:** Silence ratio within ±5 percentage points of baseline
- **Tooling:** `pytest` + audio analysis
- **Frequency:** After engine updates
- **Failure action:** Check for padding or truncation bugs

#### 2.4.3 Clipping Detection

- **Input:** All synthesized audio
- **Method:** Check for samples at or near maximum amplitude (>0.99)
- **Metric:** Percentage of samples that are clipped
- **Pass threshold:** <0.1% clipped samples
- **Tooling:** `numpy` peak analysis
- **Frequency:** Every generation (can be integrated into pipeline)
- **Failure action:** Check gain/normalization settings

---

## 3. Prompt Versioning

### 3.1 Directory Structure

```text
app/prompts/
├── narration_transform_system_v2.txt
├── speaker_attribution_system_v1.txt
└── test_results/
    ├── consistency_v2_YYYY_MM_DD.json
    ├── parity_v2_providers_YYYY_MM_DD.json
    └── attribution_v1_golden_YYYY_MM_DD.json
```

### 3.2 Version Control Rules

1. System prompts are tracked in git with version numbers in filenames
2. When a prompt is modified, increment the version number
3. Test results are saved with the prompt version + date
4. Before shipping a phase, require test results showing all relevant tests pass with the current prompt version
5. Never modify a prompt version in-place — create a new version file

### 3.3 Regression Tracking

After each prompt version change:

1. Run consistency tests (all modes)
2. Run provider parity tests (at least 2 providers)
3. Compare results against previous version
4. If regression detected, roll back to previous version and investigate

---

## 4. Test Execution Plan

### 4.1 Tiers

| Tier             | Tests                                               | Trigger           | Requirements                      |
| ---------------- | --------------------------------------------------- | ----------------- | --------------------------------- |
| **CI (fast)**    | Minimal consistency, engine coverage, cue stripping | Every commit      | No LLM provider needed            |
| **Nightly**      | Polish/Vivid consistency, single-provider parity    | Nightly schedule  | 1 LLM provider running            |
| **Weekly**       | Cross-provider parity, speaker attribution          | Weekly schedule   | 3 LLM providers + golden scripts  |
| **Release gate** | All of the above + audio regression                 | Before phase ship | Full test environment             |

### 4.2 Test Infrastructure

- **pytest** as test runner
- **sentence-transformers** (`all-MiniLM-L6-v2`) for embedding-based similarity
- **sklearn.metrics** (or manual) for precision/recall/F1
- **librosa** or **scipy** for audio analysis (audio regression only)
- **Provider fixtures** that skip tests when providers aren't available

### 4.3 Running Tests

```bash
# CI tier (fast, no LLM needed)
pytest tests/ -m "not nightly and not weekly and not release"

# Nightly tier
pytest tests/ -m "not weekly and not release"

# Weekly tier
pytest tests/ -m "not release"

# Full release gate
pytest tests/
```

---

## 5. Phase 3 Completion Gates

Phase 3 CANNOT ship until:

- [ ] Minimal consistency: 100% exact match (100 sentences × 3 runs)
- [ ] Polish consistency: ≥95% exact match (50 sentences × 3 runs)
- [ ] Vivid consistency: Mean pairwise cosine >0.95 (50 sentences × 3 runs)
- [ ] Provider parity: Mean cosine >0.80 (20 sentences × 3 providers)
- [ ] Speaker attribution: Macro F1 >0.75 (7 golden scripts)
- [ ] Ambiguity detection: Recall >0.60
- [ ] Audio regression baselines established for at least 3 engines
- [ ] Prompt versioning directory created with current versions tracked

---

## 6. Revision History

| Date       | Version | Changes                                                                                             |
| ---------- | ------- | --------------------------------------------------------------------------------------------------- |
| 2026-04-04 | 1.0     | Initial metric specification covering consistency, parity, attribution, and regression              |
