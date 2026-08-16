# PersonaFlight Four-PC Orchestration

## Operating Model

One integrator freezes the shared contract, three workers build disjoint surfaces, and every change reaches `integration` through a reviewed pull request. The final branch order is Replay Engine, Product UI, Release QA, then `integration` to `main`.

| Owner | Branch | Model | Reasoning | Output |
|---|---|---|---|---|
| PC1 Integrator | `integration` | `gpt-5.6-sol` | `xhigh` | Contracts, API composition, merge, final review |
| PC2 Product UI | `feat/flight-record-ui` | `gpt-5.6-sol` | `high` | Responsive mission, evidence, diff, and Flight Record UI |
| PC3 Replay Engine | `feat/replay-engine` | `gpt-5.6-sol` | `xhigh` | Three conditions, evidence gate, replay, regression seed |
| PC4 Release QA | `test/demo-readiness` | `gpt-5.6-terra` | `high` | E2E, accessibility, release docs, demo evidence |

## Branch Bootstrap

PC1 pushes the shared baseline to `integration` and posts the exact commit SHA. Each worker branches from that SHA, not from a moving branch head.

```bash
git fetch origin
git switch -c <owned-branch> <baseline-sha>
```

No worker pushes to `main`. PC1 protects `main`, merges pull requests into `integration`, runs the full gates, and opens the final `integration` to `main` pull request.

## Four-Hour Clock

| Time | Gate |
|---|---|
| 00:00–00:20 | Repository, `AGENTS.md`, and shared contract baseline |
| 00:20–00:30 | Branch from the same SHA and start four Codex threads |
| 00:30–02:10 | UI, replay engine, QA, and API composition in parallel |
| 01:10 | Contract freeze and ten-minute interface check |
| 02:10 | Feature freeze; remove scope before adding features |
| 02:10–02:50 | Merge Replay, UI, then QA into `integration` |
| 02:50–03:20 | Unit, integration, E2E, coverage, lint, and build gates |
| 03:20–03:35 | Final diff review; fix only release-blocking findings |
| 03:35–03:50 | Record the verified three-minute demo |
| 03:50–04:00 | Final pull request and submission link audit |

## Shared Prompt Header

Paste this before the role-specific prompt on every PC:

```text
Read AGENTS.md before working. Confirm the current branch and your owned paths. Do not edit another owner's files or expand product scope. For every behavior change, write the smallest test first, run it, and record the expected RED failure before implementation. Demo mode must work without credentials. Finish with the commit hash, actual changed paths, verification commands and results, produced evidence, remaining risks, and integration instructions.
```

## PC1 Prompt — Integrator

```text
You own shared contracts, server orchestration, APIs, root configuration, and integration. Freeze the Replay Court contract first: one mission, exactly three non-demographic fault conditions, evidence-backed findings, a proposed patch, identical before/after runs, a partial-capable comparison, and a regression seed. Do not implement another owner's UI or replay behavior. After worker PRs arrive, merge Replay → UI → QA, run every quality gate after each merge, review integration against main, and reject unsupported success claims.
```

## PC2 Prompt — Product UI

```text
You own the user-visible Replay Court experience. Build a responsive, editorial preflight interface that communicates Mission Contract → three parallel conditions → evidence hearing → minimal diff → identical replay → before/after Flight Record. Use the shared contracts without changing them. Make status readable in a silent 20-second clip, avoid generic dashboard chrome, support desktop and 390×844 mobile, and never communicate failure through color alone. Provide desktop and mobile screenshots.
```

## PC3 Prompt — Replay Engine

```text
You own deterministic demo behavior for touch plus small viewport, low patience plus delayed feedback, and reduced inference plus ambiguous copy. Every accepted finding must cite real before-run evidence. Distinguish UX failure from infrastructure failure. Use the same mission, start state, conditions, and success rule after the proposed patch. Preserve partial verdicts and export a regression seed. Do not add demographic prediction, arbitrary URLs, external AI calls, or automatic patch application.
```

## PC4 Prompt — Release QA

```text
You own release proof, not new product scope. Build E2E coverage for the credential-free 90-second flow, desktop and 390×844 layouts, keyboard access, evidence rejection, minimal diff display, identical replay, partial verdict truthfulness, and regression seed download. Produce README reproduction steps, BUILD_LOG, VALUE_AND_VIABILITY, DEMO_SCRIPT, submission checklist, and real screenshots. Record only actual commits, PRs, reviews, and test outputs.
```

## Merge Gate

Every pull request must use `.github/PULL_REQUEST_TEMPLATE.md`. PC1 stops a merge when a worker changes an unowned contract, omits test evidence for behavior, invents AI activity, requires an API key for the demo, or weakens the evidence and human-approval boundaries.

## Build Log Evidence

- **Plan:** the product contract and shared contract commit.
- **Parallel:** the three worker branches created from the same SHA.
- **Review:** pull-request findings, rejected unsupported claims, and the final diff review.
- **Integrate:** merge order plus unit, E2E, mobile, coverage, and build outputs.

Screenshots of four Codex windows are supporting evidence. Commit hashes, pull requests, test results, and the working Flight Record are the authoritative evidence.
