---
description:
  "Decision-grade research prompt for comparing Microsoft Foundry, GitHub Models, Gemini cloud,
  Hugging Face, and other hosted inference suppliers for Ultimate TTS Studio."
---

# Cloud Inference Supplier Evaluation

Recommended agent: `15 Deep Research Insider`

Use this prompt to run a full supplier evaluation for hosted LLM inference.

## Task

Act as a senior AI platform strategy researcher and procurement advisor. Evaluate which cloud
inference supplier is the best fit for Ultimate TTS Studio's near-term and medium-term needs.

### Project context

Ultimate TTS Studio is a TTS-focused product with a Gradio-based runtime and LLM-assisted
narration-transform workflows. We need reliable access to models that are too large or impractical
to run locally, including frontier and foundation models such as GPT, Claude, Gemini, Codex-class
coding models, and other high-capability reasoning or text models exposed through APIs.

### Research objective

Compare Microsoft Foundry, GitHub Models, Google Gemini cloud, Hugging Face Inference providers, and
other serious API-accessible model suppliers that should be considered in the same decision set. The
goal is not just to compare vendors broadly, but to determine which supplier or supplier mix is the
best fit for our actual product, engineering workflow, and likely commercial constraints.

### Important

Do not assume a single-vendor outcome is best. Consider whether the right recommendation is:

1. one primary supplier
2. a dual-supplier strategy
3. a tiered strategy by use case
4. a routing or abstraction approach across providers

### Evaluate each option against these needs

- access to large hosted models that cannot be installed locally
- availability of frontier models and broad model catalog coverage
- API quality and stability
- compatibility with OpenAI-style APIs or ease of integration
- authentication and key management model
- pricing model and likely cost profile
- rate limits, quotas, and throughput ceilings
- latency and reliability
- enterprise readiness, compliance, security, and governance
- regional availability and data residency considerations
- observability, usage tracking, and cost monitoring
- SDK and tooling maturity
- ease of experimentation versus production hardening
- support for model switching, fallback, and future portability
- risk of vendor lock-in
- suitability for both developer productivity and end-user product features

### Specific decision lens for this project

Assess fit for at least these likely use cases:

- narration transformation and script rewriting
- prompt-based text normalization
- long-form generation support for audiobook or conversation workflows
- coding and developer-assist tasks inside the product team
- possible future API or service-boundary integrations
- staged adoption from prototype to production

### Required outputs

1. Executive summary with a clear recommendation
2. Decision matrix comparing each supplier across the criteria above
3. Shortlist of top 3 options with rationale
4. Recommended architecture: single provider, dual provider, or provider-routing abstraction
5. Risks and tradeoffs for each shortlisted option
6. Estimated pricing approach, noting where exact pricing is unavailable
7. Integration implications for this project
8. A best-for-now recommendation and a best long-term recommendation if they differ
9. A list of unknowns that require stakeholder confirmation before final procurement
10. A final recommendation expressed as:
    - recommended primary supplier
    - recommended secondary or fallback supplier, if any
    - why this combination is the best fit

### Research quality bar

- prefer current, official vendor documentation and pricing pages
- distinguish verified facts from assumptions
- call out where a provider does not offer direct access to specific model families
- be explicit about model availability limitations, commercial restrictions, and regional caveats
- avoid generic marketing language
- make the recommendation decision-oriented, not merely descriptive

### Clarifying questions to ask first if missing

1. Is the decision primarily for internal developer tooling, customer-facing product inference, or
   both?
2. Should the recommendation optimize for lowest cost, best model quality, best governance, or best
   overall balance?
3. Which model families are mandatory: OpenAI, Claude, Gemini, open-weight models, Codex-style
   coding models, or all of them?
4. Is this supplier expected to power only text generation and transformation, or also
   speech-related, multimodal, embeddings, and agent workflows later?
5. Are there hard requirements around region, data residency, privacy, no-training guarantees, or
   enterprise compliance?
6. Are there existing commercial commitments, credits, or platform preferences with Microsoft,
   Google, GitHub, Hugging Face, or others?
7. Is portability important enough to justify an abstraction layer even if it adds engineering
   complexity?
8. Are expected workloads mainly experimentation, steady interactive traffic, or production-scale
   batch jobs?
9. Do we want one billing relationship or are we comfortable mixing providers for better coverage?
10. Should the research include aggregators and brokers such as OpenRouter, Together, Fireworks,
    Groq, Replicate, Anthropic direct, and OpenAI direct?

If critical information is missing, ask the clarifying questions first and pause before issuing a
final recommendation.
