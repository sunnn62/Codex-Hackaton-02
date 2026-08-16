# PersonaFlight Replay Court

## Product contract

Build a pre-release web UX regression demo for solo vibe coders.

The demo must show:

1. One prepared flawed mobile-web mission
2. Exactly three declared UX fault conditions
3. Screen and action evidence for every accepted finding
4. One minimal Codex patch diff
5. An identical-condition replay
6. A before/after Flight Record
7. A reusable regression seed

Synthetic conditions are heuristic evidence, not predictions of demographic behavior.

## Hard scope

- Demo must work without an API key.
- Do not add arbitrary URL testing.
- Do not implement live repository mutation.
- Do not infer ability from age or gender.
- Do not hide remaining failures after replay.
- Never expose secrets.
- Never push directly to main.
- Use immutable updates and Zod validation.
- Write tests before feature implementation.
- Keep files focused and functions small.

## Ownership

- PC1: contracts, server orchestration, APIs, integration
- PC2: product UI and visual presentation
- PC3: fault conditions, evidence, verdict, replay engine
- PC4: E2E, accessibility, release documents, demo evidence

Do not modify another role's owned files unless the integrator approves it.

## Required handoff

Before finishing, report:

- Commit hash
- Files changed
- Tests executed and results
- Screenshots or evidence produced
- Remaining risks
- Exact integration instructions
