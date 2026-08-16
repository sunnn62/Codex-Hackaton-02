# PersonaFlight final submission bundle

This directory is the reproducible handoff for Team 2's PersonaFlight Replay Court.

## Run the product

```powershell
npm ci
npm run dev
```

Open `http://localhost:3000` and choose **90초 데모 시작**, or open
`http://localhost:3000/replay/focus-list` directly.

## Included artifacts

- `PersonaFlight_Hackathon_Final.pptx`: 8-slide main presentation + 4 appendices
- `PersonaFlight_Presentation_Script.md`: Korean live-presentation script and demo cues
- `PersonaFlight_demo.mp4`: verified 35.32-second H.264 product-flow video
- `PersonaFlight_demo_regression_seed.json`: downloadable replay seed
- `flight-record-desktop.png`: real desktop browser capture
- `flight-record-mobile-390x844.png`: real 390×844 touch viewport full-page capture
- `deck-montage.webp`: presentation overview
- `source-ledger.md`: claim-to-evidence map
- `build-deck.mjs`: reproducible `@oai/artifact-tool` deck authoring source
- `SESSION_CONVERSATION.json`: sanitized, user-visible session decision log

## Verified release gates

- 49 unit/component tests in the latest green CI lineage
- 4 integration tests
- 6 Chromium E2E scenarios in PC4's merged green CI
- Coverage: 98.85% statements, 94.56% branches, 100% functions, 98.74% lines
- GitHub Pages static export passes after base-path-aware persona assets and unoptimized images
- Latest PC2 red commit that removed the demo CTA was intentionally excluded; green SHA `b31444c` was integrated

## Honest scope

The current MVP is a deterministic, credential-free FocusList synthetic demo.
It demonstrates evidence gates, human approval, identical-condition replay, Flight
Record generation, and regression seed download. It does not yet execute arbitrary
external preview URLs or mutate a live repository, and it does not replace real user
research.
