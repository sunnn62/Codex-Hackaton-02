# PersonaFlight Hackathon Deck Design

## Communication job

By the end, Codex Community Hackathon judges should believe PersonaFlight is a working, evidence-backed pre-release UX regression product and that the team used Codex as a coordinated build partner rather than a text generator.

## Audience and format

- Audience: hackathon judges evaluating the submission and a live presentation.
- Format: 16:9 PowerPoint, eight main slides and four appendix slides.
- Main deck: concise enough to present, but each slide remains independently understandable.
- Speaker notes: a complete Korean talk track plus source notes.

## Narrative

1. PersonaFlight in one sentence.
2. The solo vibe coder's release-blindness problem and the gap in generic AI advice.
3. The product contract: one mission, exactly three declared conditions, identical replay.
4. The actual 90-second product flow: plan, parallel evidence, review, integrate.
5. Working proof: BEFORE 0/3, evidence IDs, human-approved minimal diff, AFTER 3/3, regression seed.
6. Codex Build Orchestration and four-PC collaboration with concrete review corrections.
7. Architecture and trust boundaries, including deterministic demo scope and infrastructure-failure semantics.
8. Value, viability, next experiments, and submission links.

Appendix:

1. Shared contract model and invariants.
2. Verification matrix and exact test evidence.
3. GitHub/PR integration ledger.
4. Honest limitations and next product milestones.

## Visual system

- Inspired by the product UI: ice-white canvas, deep navy typography, electric-blue accent, soft translucent geometry.
- Use real product screenshots as the main visual evidence.
- Avoid dense dashboard-card layouts; use flat editorial compositions with one dominant visual per slide.
- Use navy-to-blue gradients only as restrained emphasis.
- Typography: Aptos/Arial-compatible Korean system fonts, 50pt deck title, 35pt slide titles, body at least 16pt.

## Evidence rules

- Use only verified integration-state claims.
- PC2 visuals may be incorporated only after its fix commit passes build and the critical browser flow.
- Do not claim live LLM execution; describe the current flow as a deterministic, credential-free replay demo.
- Keep synthetic-persona limitations visible.
- Cite repository, PR, CI, and locally generated product artifacts in speaker notes.

## Deliverables

- `PersonaFlight_Hackathon_Final.pptx`
- `PersonaFlight_Presentation_Script.md`
- Rendered slide montage for QA only.
- Updated demo video after PC2 passes final verification; otherwise retain the already verified 35-second product-flow video.
