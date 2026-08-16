# PersonaFlight Hackathon Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Produce a judge-ready 8-slide Korean presentation with four evidence appendices, a complete speaker script, and a verified demo-video handoff using only claims proven by the repository, CI, and captured product artifacts.

**Architecture:** Treat the deck as a generated, reproducible artifact. A JavaScript authoring script uses `@oai/artifact-tool` to compose a 16:9 visual system from verified screenshots, execution frames, CI facts, and an explicit source ledger. The main narrative follows problem → contract → flow → proof → Codex orchestration → architecture → value; appendices carry contracts, test evidence, PR history, and honest limitations. PC2 remains a gated optional visual refresh: it can replace the fallback video only after its critical E2E suite is green.

**Tech Stack:** JavaScript ES modules, `@oai/artifact-tool`, PowerPoint/PPTX, FFmpeg, bundled presentation rendering and validation utilities, Markdown.

## Global Constraints

- Use only verified current-product screenshots and exact CI/PR facts.
- Do not claim a live OpenAI call, a deployed service URL, or a merged PC2 UI until evidence exists.
- Keep the main deck presentation-ready; move detailed proof into four appendix slides.
- Use one coherent dark-navy/lime PersonaFlight visual system; never mix the unmerged white/blue PC2 mockup into the final deck.
- Include Korean speaker notes and a `[Sources]` block on every slide.
- Preserve the existing verified 35.32-second demo video unless PC2 reaches green and a replacement passes playback and visual QA.

---

### Task 1: Freeze the evidence and asset ledger

**Files:**
- Create: `work/presentation-final/source-ledger.md`
- Create: `work/presentation-final/frames/*.png`
- Reference: `outputs/qa-artifacts/flight-record-desktop.png`
- Reference: `outputs/qa-artifacts/flight-record-mobile-390x844.png`
- Reference: `outputs/PersonaFlight_demo.mp4`

1. Record the current integration SHA, merged PRs, PR CI runs, exact test counts, known limitations, and verified links.
2. Extract representative PLAN, BEFORE, REVIEW, AFTER, seed, and disclaimer frames from the verified video.
3. Inspect every extracted frame and reject any frame that does not visibly support its stated claim.

### Task 2: Write the complete Korean talk track

**Files:**
- Create: `outputs/PersonaFlight_Presentation_Script.md`

1. Write a concise 6–8 minute script for the eight main slides.
2. Add optional appendix talking points for likely judge questions.
3. Mark product boundaries truthfully: synthetic preflight, human-approved patch, deterministic demo, no verified live deployment.
4. Add a final 90-second demo cue sheet aligned to the verified video frames.

### Task 3: Author the PPTX reproducibly

**Files:**
- Create: `work/presentation-final/build-deck.mjs`
- Create: `outputs/PersonaFlight_Hackathon_Final.pptx`

1. Initialize one 16:9 deck using the custom PersonaFlight navy/lime visual system.
2. Build eight main slides with one dominant visual and a complete standalone message per slide.
3. Build four appendix slides with readable evidence tables and explicit status labels.
4. Add Korean speaker notes and per-slide `[Sources]` blocks.
5. Export the deck to the user-facing outputs directory.

### Task 4: Render and verify every slide

**Files:**
- Create: `work/presentation-final/rendered/*.png`
- Create: `work/presentation-final/montage.png`

1. Render the PPTX with the bundled presentation renderer.
2. Run the bundled slide test for overflow, invalid geometry, and export errors.
3. Inspect the montage and every slide at full size for clipping, weak hierarchy, tiny text, inconsistent styling, and unsupported claims.
4. Fix the authoring script and regenerate until all tests and the visual pass are clean.

### Task 5: Finalize the demo-video decision and submission handoff

**Files:**
- Preserve: `outputs/PersonaFlight_demo.mp4`
- Conditionally replace: `outputs/PersonaFlight_demo.mp4`
- Create: `outputs/PersonaFlight_Submission_Handoff.md`

1. Re-check PC2 PR #3 and its latest CI head.
2. If all critical E2E tests pass and the product flow is reachable, integrate or capture the updated UI, verify the new video, and refresh deck evidence only if time permits without weakening truthfulness.
3. Otherwise retain the verified current video and document PC2 as reviewed-but-not-merged.
4. Provide final artifact links, exact verification results, and remaining submission actions without placeholders masquerading as completed work.
