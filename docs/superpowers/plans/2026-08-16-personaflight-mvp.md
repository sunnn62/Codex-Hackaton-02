# PersonaFlight MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working pre-release web-app beta-testing MVP where diverse synthetic personas perform one real browser mission, produce evidence-backed UX issues, and compare results before and after a fix.

**Architecture:** A single Next.js App Router application owns the product UI and Node.js route handlers. A domain layer generates pairwise persona panels, a Playwright runner executes isolated browser sessions, and an actor abstraction supports deterministic demo mode plus a live OpenAI-backed mode. Run artifacts are written atomically as immutable JSON and image files under `.personaflight/runs` so the hackathon demo works without an external database.

**Tech Stack:** Node.js 22, Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS, Zod, Playwright, Vitest, Testing Library, OpenAI JavaScript SDK, ESLint.

## Global Constraints

- The working repository is `outputs/personaflight-mvp` and must be initialized as a Git repository before implementation.
- MVP execution supports deployed web/PWA URLs only; mobile adapters are documented but not implemented.
- The core live flow is `URL and mission → 6 personas → at least 3 isolated browser runs → evidence-backed issue → before/after comparison`.
- Demographic attributes never determine capability or behavior; those axes remain independent.
- Every verified issue must reference screenshot, action, DOM/accessibility, console, or network evidence.
- Browser actions that submit payment, send external messages, delete data, or leave the allowed origin are blocked.
- Live AI mode requires `OPENAI_API_KEY` and `OPENAI_MODEL`; no model name or secret is hardcoded.
- Demo mode must remain fully functional without external credentials.
- Inputs and model outputs are validated with Zod.
- Code changes use immutable object and array operations; no domain object is mutated in place.
- Tests are written before implementation and overall coverage must be at least 80% for `src/lib`.
- No source file exceeds 800 lines; functions remain under 50 lines unless a tool callback requires otherwise.
- Human approval is required before any generated code fix is applied; the MVP generates a fix brief rather than mutating a connected repository.

---

## File Map

```text
outputs/personaflight-mvp/
├── src/app/
│   ├── api/runs/route.ts                 # Create and list runs
│   ├── api/runs/[runId]/route.ts         # Read a run
│   ├── api/runs/[runId]/execute/route.ts # Execute a run
│   ├── api/compare/route.ts              # Compare two completed runs
│   ├── demo-app/page.tsx                 # Intentionally flawed/fixed target app
│   ├── runs/new/page.tsx                 # Mission setup wizard
│   ├── runs/[runId]/page.tsx             # Live progress and report
│   ├── page.tsx                           # Product landing/dashboard
│   ├── layout.tsx
│   └── globals.css
├── src/components/
│   ├── mission-form.tsx
│   ├── persona-grid.tsx
│   ├── run-progress.tsx
│   ├── issue-card.tsx
│   ├── evidence-timeline.tsx
│   └── comparison-panel.tsx
├── src/lib/domain/
│   ├── schemas.ts                         # Zod schemas and inferred types
│   ├── persona-generator.ts               # Pairwise persona selection
│   ├── success-evaluator.ts               # Deterministic evidence checks
│   ├── issue-reviewer.ts                  # Evidence gate and prioritization
│   └── compare-runs.ts                    # Before/after metrics
├── src/lib/actors/
│   ├── actor.ts                            # Actor interface
│   ├── demo-actor.ts                       # Credential-free deterministic actor
│   └── openai-actor.ts                     # Structured live action selection
├── src/lib/runner/
│   ├── browser-runner.ts                   # Playwright session loop
│   ├── evidence-capture.ts                 # Screenshot/ARIA/log capture
│   └── safety-policy.ts                    # Origin and destructive-action gate
├── src/lib/storage/
│   ├── run-store.ts                        # Atomic immutable artifact store
│   └── paths.ts                            # Safe artifact path resolution
├── src/lib/server/run-service.ts            # Orchestration boundary
├── tests/unit/                              # Vitest domain and storage tests
├── tests/integration/                       # Route and orchestration tests
├── tests/e2e/personaflight.spec.ts          # Critical product flow
├── docs/BUILD_LOG.md
├── docs/VALUE_AND_VIABILITY.md
├── docs/DEMO_SCRIPT.md
├── README.md
├── .env.example
└── package.json
```

---

### Task 1: Repository, contracts, and test harness

**Files:**
- Create: `package.json`, `vitest.config.ts`, `playwright.config.ts`, `.env.example`, `.gitignore`
- Create: `src/lib/domain/schemas.ts`
- Create: `tests/unit/schemas.test.ts`
- Copy: `docs/superpowers/specs/2026-08-16-personaflight-design.md`

**Interfaces:**
- Produces: `CreateRunInput`, `TestPersona`, `ActionEvidence`, `PersonaResult`, `VerifiedIssue`, `TestRun` and their Zod schemas.
- Consumes: no earlier task.

- [ ] **Step 1: Initialize the repository and scaffold Next.js**

Run from `outputs`:

```powershell
git init personaflight-mvp
npm.cmd create next-app@latest personaflight-mvp -- --ts --tailwind --eslint --app --src-dir --use-npm --import-alias "@/*"
```

If `git init` precedes the scaffold, run the scaffold into the existing empty directory. Expected: a TypeScript App Router application with `npm run dev`, `npm run build`, and `npm run lint` scripts.

- [ ] **Step 2: Install runtime and test dependencies**

```powershell
npm.cmd install zod openai
npm.cmd install -D playwright @playwright/test vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom
npx.cmd playwright install chromium
```

Expected: dependency installation succeeds and Chromium is available.

- [ ] **Step 3: Write failing schema tests**

```ts
import { describe, expect, it } from 'vitest'
import { createRunInputSchema, testPersonaSchema } from '@/lib/domain/schemas'

describe('PersonaFlight schemas', () => {
  it('rejects a non-http app URL', () => {
    const result = createRunInputSchema.safeParse({
      appUrl: 'file:///secret',
      appName: 'Demo',
      appDescription: 'Demo app',
      targetAudience: 'solo builders',
      mission: 'Create one task',
      successCriteria: 'Task appears in Today',
      personaCount: 6,
      mode: 'demo',
    })
    expect(result.success).toBe(false)
  })

  it('keeps demographic and capability axes independent', () => {
    const result = testPersonaSchema.parse({
      id: 'senior-expert',
      label: '숙련된 고령 사용자',
      demographics: { ageRange: '60-69', primaryLanguage: 'ko', locale: 'ko-KR' },
      capability: { digitalLiteracy: 'high', domainKnowledge: 'high' },
      accessibility: { vision: 'standard', motor: 'standard', cognition: 'standard' },
      environment: { viewport: 'small-mobile', network: 'fast', interruptionLevel: 'low', inputMode: 'touch' },
      behavior: { patience: 'medium', exploration: 'high', privacySensitivity: 'high' },
    })
    expect(result.capability.digitalLiteracy).toBe('high')
  })
})
```

- [ ] **Step 4: Run the schema test and confirm RED**

Run: `npm.cmd run test -- tests/unit/schemas.test.ts`

Expected: FAIL because `@/lib/domain/schemas` does not exist.

- [ ] **Step 5: Implement the exact schemas**

Define immutable Zod objects matching the approved design. Add these run states exactly:

```ts
export const runStatusSchema = z.enum([
  'draft',
  'ready',
  'running',
  'completed',
  'partial',
  'failed',
])

export const createRunInputSchema = z.object({
  appUrl: z.string().url().refine((url) => ['http:', 'https:'].includes(new URL(url).protocol)),
  appName: z.string().trim().min(2).max(80),
  appDescription: z.string().trim().min(10).max(500),
  targetAudience: z.string().trim().min(3).max(300),
  mission: z.string().trim().min(5).max(300),
  successCriteria: z.string().trim().min(5).max(300),
  personaCount: z.number().int().min(3).max(12),
  mode: z.enum(['demo', 'live']),
  repositoryUrl: z.string().url().optional(),
})
```

Define all remaining interfaces by inferring from schemas with `z.infer` so runtime validation and TypeScript cannot drift.

- [ ] **Step 6: Run unit tests and coverage**

Run: `npm.cmd run test -- --coverage`

Expected: two schema tests PASS and no test file reports an error.

- [ ] **Step 7: Commit the contract foundation**

```powershell
git add .
git commit -m "feat: establish PersonaFlight contracts and test harness"
```

---

### Task 2: Pairwise persona panel generator

**Files:**
- Create: `src/lib/domain/persona-generator.ts`
- Create: `tests/unit/persona-generator.test.ts`

**Interfaces:**
- Consumes: `TestPersona`, `CreateRunInput` from `schemas.ts`.
- Produces: `generatePersonaPanel(input: CreateRunInput): readonly TestPersona[]` and `calculateCoverage(panel): CoverageReport`.

- [ ] **Step 1: Write failing coverage tests**

```ts
import { describe, expect, it } from 'vitest'
import { calculateCoverage, generatePersonaPanel } from '@/lib/domain/persona-generator'

const input = {
  appUrl: 'http://localhost:3000/demo-app',
  appName: 'FocusList',
  appDescription: 'A lightweight daily task manager',
  targetAudience: 'people trying a productivity app for the first time',
  mission: 'Create a task and add it to Today',
  successCriteria: 'The new task is visible in the Today list',
  personaCount: 6,
  mode: 'demo' as const,
}

describe('generatePersonaPanel', () => {
  it('returns the requested immutable panel with required diversity', () => {
    const panel = generatePersonaPanel(input)
    const coverage = calculateCoverage(panel)
    expect(panel).toHaveLength(6)
    expect(new Set(panel.map((persona) => persona.id)).size).toBe(6)
    expect(coverage.requiredAxesCovered).toBe(true)
    expect(panel.some((persona) => persona.capability.digitalLiteracy === 'low')).toBe(true)
    expect(panel.some((persona) => persona.capability.digitalLiteracy === 'high' && persona.demographics.ageRange === '60-69')).toBe(true)
  })
})
```

- [ ] **Step 2: Run and confirm RED**

Run: `npm.cmd run test -- tests/unit/persona-generator.test.ts`

Expected: FAIL because the generator module does not exist.

- [ ] **Step 3: Implement deterministic pairwise selection**

Create a curated candidate pool whose axes are independent. Score each unselected candidate by the number of previously uncovered value pairs it adds, then immutably append the highest-scoring candidate until `personaCount` is reached. Break ties by stable candidate ID so tests and demos are reproducible.

```ts
export function generatePersonaPanel(input: CreateRunInput): readonly TestPersona[] {
  return Array.from({ length: input.personaCount }).reduce<readonly TestPersona[]>((panel) => {
    const candidate = selectHighestCoverageCandidate(CANDIDATES, panel)
    return candidate ? [...panel, candidate] : panel
  }, [])
}
```

The candidate pool must include the required axes from the design and explicitly include a digitally skilled `60-69` persona to prevent age stereotyping.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm.cmd run test -- tests/unit/persona-generator.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the persona engine**

```powershell
git add src/lib/domain tests/unit/persona-generator.test.ts
git commit -m "feat: generate diverse evidence-oriented persona panels"
```

---

### Task 3: Safe browser runner and evidence capture

**Files:**
- Create: `src/lib/actors/actor.ts`, `src/lib/actors/demo-actor.ts`
- Create: `src/lib/runner/safety-policy.ts`, `src/lib/runner/evidence-capture.ts`, `src/lib/runner/browser-runner.ts`
- Create: `tests/unit/safety-policy.test.ts`
- Create: `tests/integration/browser-runner.test.ts`
- Create: `src/app/demo-app/page.tsx`

**Interfaces:**
- Consumes: `TestPersona`, `ActionEvidence`, `PersonaResult`.
- Produces: `Actor.nextAction(context): Promise<ActorAction>` and `runPersonaSession(input): Promise<PersonaResult>`.

- [ ] **Step 1: Write safety-policy tests first**

Test these exact cases:

```ts
expect(isAllowedNavigation('https://demo.test/start', 'https://demo.test/tasks')).toBe(true)
expect(isAllowedNavigation('https://demo.test/start', 'https://evil.test')).toBe(false)
expect(isDestructiveAction({ type: 'click', accessibleName: 'Delete account' })).toBe(true)
expect(isDestructiveAction({ type: 'click', accessibleName: 'Save task' })).toBe(false)
```

- [ ] **Step 2: Run and confirm RED**

Run: `npm.cmd run test -- tests/unit/safety-policy.test.ts`

Expected: FAIL because the safety module does not exist.

- [ ] **Step 3: Implement the actor and safety contracts**

Use the following action union:

```ts
export type ActorAction =
  | { readonly type: 'click'; readonly elementId: string; readonly reason: string }
  | { readonly type: 'fill'; readonly elementId: string; readonly value: string; readonly reason: string }
  | { readonly type: 'press'; readonly key: string; readonly reason: string }
  | { readonly type: 'wait'; readonly milliseconds: number; readonly reason: string }
  | { readonly type: 'finish'; readonly outcome: 'completed' | 'blocked' | 'failed'; readonly reason: string }

export interface Actor {
  nextAction(context: ActorContext): Promise<ActorAction>
}
```

Reject navigation outside the initial origin and action names matching payment, purchase, send, delete, remove account, transfer, or equivalent Korean terms.

- [ ] **Step 4: Build the demo target app**

The route `/demo-app?version=before` must render a task form with these intentional problems:

- on a viewport below 420 px, the save button is partially clipped;
- the success message uses low contrast and disappears after 600 ms;
- delayed save lasts 1.2 seconds and gives no pending feedback.

`version=after` must keep the same workflow but provide a visible responsive button, pending state, and persistent status region. Add stable `data-pf-id` values to the demo elements; this is only the demo adapter, not a requirement for tested third-party apps.

- [ ] **Step 5: Implement evidence capture**

For every step, save:

```ts
const evidence: ActionEvidence = {
  runId,
  personaId: persona.id,
  sequence,
  action: describeAction(action),
  target: action.type === 'click' || action.type === 'fill' ? action.elementId : undefined,
  screenshotPath,
  ariaSnapshot: await page.locator('body').ariaSnapshot(),
  consoleErrors: [...consoleErrors],
  networkErrors: [...networkErrors],
  outcome,
  capturedAt: new Date().toISOString(),
}
```

Mask input values for elements whose name, label, or autocomplete indicates password, token, secret, email, telephone, or payment information.

- [ ] **Step 6: Implement the Playwright session loop**

Create one isolated browser context per persona, configure locale and viewport, and limit each session to 10 actions or 45 seconds. Capture evidence before and after every action. Return `blocked` rather than throw for an actor loop; throw only for infrastructure failures.

- [ ] **Step 7: Write and run the real integration test**

Start the app on port 3100, run three demo personas against `/demo-app?version=before`, and assert:

- three isolated results are returned;
- every result has at least two evidence records;
- at least one small-mobile persona fails or is blocked;
- no result navigates away from `localhost:3100`.

Run: `npm.cmd run test:integration -- tests/integration/browser-runner.test.ts`

Expected: PASS with Chromium launching successfully.

- [ ] **Step 8: Commit the executable test engine**

```powershell
git add src/lib/actors src/lib/runner src/app/demo-app tests
git commit -m "feat: execute safe persona missions with browser evidence"
```

---

### Task 4: Evidence gate, issue review, storage, and comparison

**Files:**
- Create: `src/lib/domain/success-evaluator.ts`, `src/lib/domain/issue-reviewer.ts`, `src/lib/domain/compare-runs.ts`
- Create: `src/lib/storage/paths.ts`, `src/lib/storage/run-store.ts`
- Create: `tests/unit/issue-reviewer.test.ts`, `tests/unit/compare-runs.test.ts`, `tests/unit/run-store.test.ts`

**Interfaces:**
- Consumes: completed `PersonaResult[]` and `TestRun`.
- Produces: `reviewIssues(results): readonly VerifiedIssue[]`, `compareRuns(before, after): RunComparison`, and `RunStore` methods.

- [ ] **Step 1: Write failing evidence-gate tests**

```ts
it('rejects opinions that have no evidence references', () => {
  expect(reviewIssueCandidate({ ...candidate, evidenceIds: [] }, evidenceIndex)).toBeNull()
})

it('keeps a reproducible issue with linked evidence', () => {
  const issue = reviewIssueCandidate({ ...candidate, evidenceIds: ['e-1'] }, evidenceIndex)
  expect(issue?.confidence).toBe('high')
})
```

- [ ] **Step 2: Write failing comparison tests**

Assert that a run improving from 2/4 to 4/4 reports `successRateDelta: 0.5`, while a newly failed persona appears in `regressions` even when the aggregate success rate improves.

- [ ] **Step 3: Implement reviewer and comparison functions**

Use deterministic rules before any AI narrative:

- no evidence IDs → reject;
- mission blocked for two or more personas → high severity;
- one accessibility-specific block → at least high severity;
- preference wording with mission success → low severity observation, not verified issue;
- after-run failure absent from before-run → regression.

- [ ] **Step 4: Write failing atomic-storage tests**

Create a temporary root, write a run, read it, update status through `save({ ...run, status: 'running' })`, and assert the original object remains unchanged and no `.tmp` file remains.

- [ ] **Step 5: Implement safe immutable run storage**

```ts
export interface RunStore {
  create(run: TestRun): Promise<TestRun>
  get(runId: string): Promise<TestRun | null>
  list(): Promise<readonly TestRun[]>
  save(run: TestRun): Promise<TestRun>
}
```

Resolve every path under the configured artifact root, reject traversal, serialize to a unique temporary file, and atomically rename it to `run.json`.

- [ ] **Step 6: Run domain and storage coverage**

Run: `npm.cmd run test -- --coverage`

Expected: all unit tests PASS and `src/lib/domain` plus `src/lib/storage` each meet 80% line coverage.

- [ ] **Step 7: Commit evidence and persistence**

```powershell
git add src/lib/domain src/lib/storage tests/unit
git commit -m "feat: verify UX issues and compare immutable run evidence"
```

---

### Task 5: Run service, HTTP APIs, and optional live AI actor

**Files:**
- Create: `src/lib/server/run-service.ts`
- Create: `src/lib/actors/openai-actor.ts`
- Create: `src/app/api/runs/route.ts`
- Create: `src/app/api/runs/[runId]/route.ts`
- Create: `src/app/api/runs/[runId]/execute/route.ts`
- Create: `src/app/api/compare/route.ts`
- Create: `tests/integration/run-service.test.ts`

**Interfaces:**
- Consumes: persona generator, actor, browser runner, reviewer, store, comparison.
- Produces: `RunService.createRun`, `executeRun`, `getRun`, `listRuns`, `compare`.

- [ ] **Step 1: Write the failing orchestration test**

```ts
it('moves a demo run from draft to completed with evidence-backed issues', async () => {
  const created = await service.createRun(validInput)
  expect(created.status).toBe('ready')
  const completed = await service.executeRun(created.id)
  expect(completed.status).toMatch(/completed|partial/)
  expect(completed.personas).toHaveLength(6)
  expect(completed.results.length).toBeGreaterThanOrEqual(3)
  expect(completed.issues.every((issue) => issue.evidenceIds.length > 0)).toBe(true)
})
```

- [ ] **Step 2: Run and confirm RED**

Run: `npm.cmd run test:integration -- tests/integration/run-service.test.ts`

Expected: FAIL because `RunService` does not exist.

- [ ] **Step 3: Implement orchestration with partial-failure handling**

`executeRun` must save `running` before launching sessions, use `Promise.allSettled`, preserve successful persona results when one browser fails, review issues from successful evidence, and finish as `partial` when at least one but not all sessions succeed.

- [ ] **Step 4: Implement route handlers with a common response envelope**

```ts
type ApiResponse<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: string }
```

Return 400 for invalid input, 404 for missing runs, 409 for executing a non-ready run, and 500 with a user-safe message for infrastructure failure. Log no secrets or raw model prompts.

- [ ] **Step 5: Implement the optional OpenAI actor**

Require both environment variables at construction. Send only the current persona, mission, success criteria, numbered accessible elements, current URL, and redacted recent evidence. Parse a structured `ActorAction` with Zod. If the model returns an unknown element or prohibited action, return `finish: blocked` and preserve the reason.

Demo mode must never instantiate the OpenAI client.

- [ ] **Step 6: Run integration tests**

Run: `npm.cmd run test:integration`

Expected: all service and route tests PASS without `OPENAI_API_KEY`.

- [ ] **Step 7: Commit the product API**

```powershell
git add src/app/api src/lib/server src/lib/actors tests/integration
git commit -m "feat: orchestrate persona runs through validated APIs"
```

---

### Task 6: Polished product UI and critical E2E flow

**Files:**
- Modify: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`
- Create: `src/app/runs/new/page.tsx`, `src/app/runs/[runId]/page.tsx`
- Create: `src/components/mission-form.tsx`, `persona-grid.tsx`, `run-progress.tsx`, `issue-card.tsx`, `evidence-timeline.tsx`, `comparison-panel.tsx`
- Create: `tests/e2e/personaflight.spec.ts`

**Interfaces:**
- Consumes: run and comparison APIs.
- Produces: complete 90-second demo journey.

- [ ] **Step 1: Write the failing E2E test**

```ts
test('creates, executes, and compares a diverse preflight test', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: '새 테스트 시작' }).click()
  await page.getByLabel('앱 URL').fill('http://localhost:3000/demo-app?version=before')
  await page.getByLabel('앱 이름').fill('FocusList')
  await page.getByLabel('앱 설명').fill('처음 쓰는 사람을 위한 가벼운 할 일 앱입니다.')
  await page.getByLabel('핵심 사용자').fill('생산성 앱을 처음 사용하는 사람')
  await page.getByLabel('핵심 미션').fill('할 일을 만들고 오늘 목록에 추가한다')
  await page.getByLabel('성공 조건').fill('새 할 일이 오늘 목록에 보인다')
  await page.getByRole('button', { name: '페르소나 패널 만들기' }).click()
  await expect(page.getByText('다양성 커버리지')).toBeVisible()
  await page.getByRole('button', { name: '프리플라이트 실행' }).click()
  await expect(page.getByText(/누가 · 어디서 · 왜 실패했는가/)).toBeVisible({ timeout: 60_000 })
  await expect(page.getByText(/행동 증거/)).toBeVisible()
})
```

- [ ] **Step 2: Run and confirm RED**

Run: `npm.cmd run test:e2e -- tests/e2e/personaflight.spec.ts`

Expected: FAIL because the product routes and controls do not exist.

- [ ] **Step 3: Build the landing and setup wizard**

Use a dark ink background, warm white panels, electric-lime success accents, coral risk accents, and large editorial typography. Avoid generic dashboard chrome. The landing hero must state:

```text
혼자 만든 앱에도 사용자 패널이 필요합니다.
다양한 AI 사용자가 출시 전에 실제 앱을 사용하고, 실패의 증거를 남깁니다.
```

The wizard must present three visible steps: `앱 연결`, `미션 정의`, `패널 확인`.

- [ ] **Step 4: Build the live run and report screen**

Display persona cards as active sessions, a stage rail showing Plan → Run → Review → Compare, and results in this hierarchy:

1. `누가 · 어디서 · 왜 실패했는가`
2. success-rate summary and coverage badge
3. persona outcome matrix
4. verified issue cards with severity and confidence
5. evidence timeline with screenshot modal
6. `Codex 수정 브리프 만들기` action

All colors must have text labels; failure cannot be communicated by red alone.

- [ ] **Step 5: Build before/after comparison**

Show success rate, average steps, resolved issues, and regressions side by side. If aggregate success improves but a persona regresses, show the regression above the success celebration.

- [ ] **Step 6: Run E2E and visual checks**

Run:

```powershell
npm.cmd run test:e2e
npm.cmd run build
```

Expected: E2E PASS at desktop and 390×844 mobile viewport; production build succeeds with no TypeScript error.

- [ ] **Step 7: Commit the demo-ready UI**

```powershell
git add src/app src/components tests/e2e
git commit -m "feat: deliver the PersonaFlight preflight experience"
```

---

### Task 7: Submission artifacts, verification, and release evidence

**Files:**
- Create: `README.md`, `docs/BUILD_LOG.md`, `docs/VALUE_AND_VIABILITY.md`, `docs/DEMO_SCRIPT.md`
- Modify: `.env.example`, `package.json`

**Interfaces:**
- Consumes: verified implementation, test output, screenshots, commits.
- Produces: repository-ready submission package and recording script.

- [ ] **Step 1: Write README with exact reproduction steps**

Include:

```powershell
npm.cmd install
npx.cmd playwright install chromium
Copy-Item .env.example .env.local
npm.cmd run dev
```

Document demo mode as the default, live mode variables, architecture, safety limits, test commands, and the product disclaimer that synthetic panels do not replace real user research.

- [ ] **Step 2: Populate the real Codex Build Log**

Use the approved record fields and add actual evidence for Plan, Parallel, Review, and Integrate. Each entry must link to a commit hash, diff, test output, screenshot, or rejected suggestion. Do not invent parallel work that did not occur.

- [ ] **Step 3: Complete Value & Viability**

Include target user, job-to-be-done, alternatives, differentiation, free/paid/CI packaging, measured execution cost from one demo run, and interview script for five vibe coders. Mark untested business claims as hypotheses.

- [ ] **Step 4: Write the three-minute demo script**

Use the exact six-part timing from the design. Include screen action, narration, on-screen caption, and fallback action for each segment.

- [ ] **Step 5: Run the full completion audit**

```powershell
npm.cmd run lint
npm.cmd run test -- --coverage
npm.cmd run test:integration
npm.cmd run test:e2e
npm.cmd run build
git status --short
```

Expected:

- lint exits 0;
- all unit and integration tests pass;
- `src/lib` line coverage is at least 80%;
- E2E critical flow passes;
- production build exits 0;
- only intentional demo artifacts or documentation changes remain before the final commit.

- [ ] **Step 6: Perform security and secret audit**

Run:

```powershell
rg -n "sk-[A-Za-z0-9_-]+|OPENAI_API_KEY=.+|password\s*[:=]\s*['\"]" . --glob '!node_modules/**' --glob '!.next/**'
```

Expected: no real secret match. Confirm route input validation, origin restriction, destructive-action blocking, redaction, and user-safe errors.

- [ ] **Step 7: Record release evidence and final commit**

Save screenshots of setup, live panel, evidence issue, and before/after comparison under `docs/assets`. Record or prepare the demo video from `docs/DEMO_SCRIPT.md`.

```powershell
git add .
git commit -m "docs: package PersonaFlight hackathon submission"
```

- [ ] **Step 8: Prepare external handoff fields**

Fill these only after the external action is actually completed:

```md
- GitHub repository: <actual URL>
- Service URL: <actual URL or 'local demo only'>
- Demo video: <actual URL>
- Codex Build Log: docs/BUILD_LOG.md
- Value & Viability: docs/VALUE_AND_VIABILITY.md
```

Creating public repositories, deploying, and uploading video require explicit account authorization and are not implied by local implementation.

---

## Final Acceptance Matrix

| Requirement | Proof |
|---|---|
| Problem and differentiation | Landing copy, README comparison, live diversity/evidence demo |
| Working core flow | Passing E2E plus live Chromium run artifacts |
| GPT-Codex orchestration | Build Log entries linked to real commits, reviews, and tests |
| User value and UI | Persona gap report, evidence timeline, before/after comparison, mobile visual check |
| Team integration | Four ownership lanes, shared schemas, integration tests, final merge evidence |
| GitHub/service | Actual URL only after authorized publish; otherwise reproducible local repository |
| Demo video | Three-minute script and recorded artifact/link |
| Value & Viability | Cost measurement, target interviews, packaging hypotheses |

