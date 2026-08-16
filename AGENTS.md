# PersonaFlight Replay Court

## Product Contract

Build a pre-release web UX regression demo for solo vibe coders. The prepared demo must show one flawed mobile-web mission, exactly three declared UX fault conditions, screen and action evidence, one minimal Codex patch diff, an identical-condition replay, a before/after Flight Record, and a reusable regression seed.

Synthetic conditions are heuristic evidence. They are not predictions of demographic behavior and do not replace moderated user research.

## Hard Scope

- Demo mode must work without an API key or account.
- Do not add arbitrary URL testing, authentication, a database, or live repository mutation.
- Do not infer ability from age, gender, or another demographic attribute.
- Do not accept a finding without a known evidence ID.
- Do not hide infrastructure failures or unresolved replay failures.
- Never expose secrets or push directly to `main`.
- Use immutable updates, Zod validation, test-first behavior changes, and user-safe errors.

## Ownership

- PC1 Integrator: `src/lib/contracts/**`, `src/lib/server/**`, `src/app/api/**`, root configuration, and merge conflict resolution.
- PC2 Product UI: `src/app/**` except `src/app/api/**` and `src/app/demo/**`, `src/components/**`, and UI assets.
- PC3 Replay Engine: `src/lib/replay/**`, `src/lib/evidence/**`, replay-related `src/lib/domain/**`, `src/app/demo/**`, and focused unit tests named `replay-*` or `evidence-*`.
- PC4 Release QA: `tests/e2e/**`, `tests/integration/**`, `docs/**`, `README.md`, and release screenshots.

Do not modify another role's owned files without the integrator's approval. Record a requested cross-owner change in the PR description.

## Quality Gates

- Run focused tests while working and the relevant full gate before handoff.
- Target at least 80% line, function, and statement coverage in `src/lib`.
- Verify the critical flow at desktop and 390×844 mobile sizes.
- Communicate success and failure with text, not color alone.
- Keep files focused, functions small, and state updates immutable.

## Required Handoff

Report the commit hash, files changed, tests and results, evidence or screenshots produced, remaining risks, and exact integration instructions.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
