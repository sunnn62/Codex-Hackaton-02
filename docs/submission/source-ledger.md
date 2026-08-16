# PersonaFlight 발표 사실 출처 원장

**용도:** `PersonaFlight_Presentation_Script.md`의 발표 주장에 대한 추적 원장입니다. 슬라이드에서 말하지 않는 기능은 이 원장에도 제품 사실로 추가하지 않습니다.

## 근거 등급과 판정 규칙

| 등급 | 의미 | 사용 방식 |
|---|---|---|
| A | `task-script-brief.md`에 제공된 검증 완료 사실 | 발표 수치·PR 상태·제한 사항의 최상위 근거 |
| B | 로컬 코드·자산에서 직접 확인한 보조 증거 | 현재 데모 구조와 영상/seed의 독립 확인 |
| C | 원격 GitHub URL | A 등급에서 제공한 PR/CI 상태의 링크 대상. 이 작업 중 네트워크로 재검증하지 않음 |

**충돌 처리:** 로컬 README와 BUILD_LOG에는 이전 테스트 수치, 이전 CI run, 작업 중이던 PR 상태가 남아 있습니다. 발표에서는 이 문서들의 오래된 수치를 사용하지 않고 A 등급 브리프를 우선합니다.

## 증거 카탈로그

| ID | 등급 | 증거 | 확인 가능한 내용 |
|---|---|---|---|
| A-01 | A | `work/presentation-final/task-script-brief.md` | 제품 범위, 한 미션·세 조건, 0/3→3/3, PR 상태, PC 역할, CI 수치, 제한 사항 |
| B-01 | B | `outputs/personaflight-mvp/src/lib/replay/demo-flight.ts` | `create-today-task` 및 세 condition ID의 결정론적 데모 정의 |
| B-02 | B | `outputs/personaflight-mvp/src/components/replay-court.tsx` | BEFORE/AFTER pass 표시와 regression seed 다운로드 UI |
| B-03 | B | `outputs/personaflight-mvp/src/lib/contracts/replay.ts` | regression seed 계약과 생성 로직 |
| B-04 | B | `outputs/PersonaFlight_demo_regression_seed.json` | 한 미션, 세 조건, 기대 통과 condition ID의 로컬 seed 자산 |
| B-05 | B | `outputs/PersonaFlight_demo.mp4` | `ffprobe`로 확인: H.264, 1280×720, 35.320000초 |
| B-06 | B | `outputs/personaflight-mvp/src/lib/domain/schemas.ts` | persona diversity 입력 범위가 최대 12 후보를 허용함; main visible flow에 연결됐다는 증거는 아님 |
| B-07 | B | `outputs/personaflight-mvp/README.md`, `AGENTS.md` | credential-free demo 및 synthetic evidence의 연구 대체 금지에 대한 보조 설명 |
| C-01 | C | [Repository](https://github.com/sunnn62/Codex-Hackaton-02) | 제출 저장소 링크 |
| C-02 | C | [PR #1](https://github.com/sunnn62/Codex-Hackaton-02/pull/1) | A-01이 제공한 PC3 병합 PR 링크 |
| C-03 | C | [PR #2](https://github.com/sunnn62/Codex-Hackaton-02/pull/2) | A-01이 제공한 PC4 병합 PR 링크 |
| C-04 | C | [PR #3](https://github.com/sunnn62/Codex-Hackaton-02/pull/3) | A-01이 제공한 PC2 미병합/red E2E PR 링크 |
| C-05 | C | [PC4 green CI](https://github.com/sunnn62/Codex-Hackaton-02/actions/runs/31935260097) | A-01이 제공한 PC4 CI 링크 |

## 슬라이드별 주장 매핑

| 슬라이드 | 발표 주장 | 근거 | 발표 시 경계 |
|---|---|---|---|
| 1 Cover | PersonaFlight는 evidence→사람 승인→같은 조건 replay를 잇는 FocusList 합성 데모다. | A-01, B-01, B-07 | 실제 외부 앱 runner라고 말하지 않는다. |
| 1 Cover | 미션은 task 생성 후 Today 추가이며, visible 결과는 BEFORE 0/3→AFTER 3/3이다. | A-01, B-01, B-02, B-04 | 이는 결정론적 데모의 결과다. |
| 2 Problem | finding은 evidence ID와 연결되고 최소 diff·사람 승인·replay·seed로 이어진다. | A-01, B-02, B-03 | AI 의견의 정확도나 실제 사용자 행동 예측을 주장하지 않는다. |
| 3 Contract | 세 조건은 Touch-only + Small viewport, Low patience + Delayed feedback, Reduced inference + Ambiguous copy다. | A-01, B-01, B-04 | 조건은 정확히 세 개이며 인구통계 기반 능력 추정이 아니다. |
| 3 Contract | 승인 뒤에도 동일 mission·condition·success criterion을 replay한다. | A-01, B-01, B-04 | BEFORE/AFTER가 임의의 다른 시험이라는 식으로 표현하지 않는다. |
| 4 Flow | PLAN→PARALLEL→REVIEW→INTEGRATE 흐름은 계약·병렬 조건·evidence/diff 검토·승인/replay/seed의 순서다. | A-01, B-01–B-04 | 90초는 발표용 흐름 표기이며, 외부 시스템 자동화 시간 SLA가 아니다. |
| 5 Proof | verified video는 H.264, 1280×720, 35.32초다. | A-01, B-05 | 발표 영상의 로컬 메타데이터 확인값이다. |
| 5 Proof | 2s PLAN, 8s BEFORE, 14s REVIEW, 20s AFTER, 27s seed, 33s disclaimer가 큐다. | A-01 | 이 cue sheet는 발표 운영 지시이며 제품 기능 주장 자체가 아니다. |
| 5 Proof | diff/mock은 결정론적 fixture이고 승인은 데모를 전진시키며 소스 코드를 수정하지 않는다. | A-01, B-01–B-03 | live repository mutation을 암시하지 않는다. |
| 6 Orchestration | PC1은 contract/architecture/integration/cross-review/capture, PC2는 UI, PC3는 evidence/replay/seed, PC4는 trust-boundary QA/submission evidence를 담당했다. | A-01 | 네 역할의 작업 범위이며, 모든 lane의 완료를 뜻하지 않는다. |
| 6 Orchestration | PC3 PR #1과 PC4 PR #2는 병합됐고, PC2 PR #3은 red E2E로 미병합이다. | A-01, C-02–C-04 | 현황을 정확히 말하며, PC2를 통합 완료로 표현하지 않는다. |
| 7 Architecture | PC4 merged green CI: 49 unit/component, 4 integration, 6 Chromium E2E; 98.85% statements, 94.56% branches, 100% functions, 98.74% lines; lint 및 Next production build pass. | A-01, C-05 | 이 숫자는 PC4의 병합된 green CI 사실로만 범위를 한정한다. 전체 제품의 외부 서비스 품질 보증으로 확대하지 않는다. |
| 7 Trust | live OpenAI API, live repository mutation, verified deployed service URL은 없다. | A-01 | package/env 예시나 향후 계획을 현재 기능으로 부르지 않는다. |
| 8 Value/Roadmap | 현재 가치는 재현 가능한 합성 preflight이고, 실제 연구를 대체하지 않는다. | A-01, B-07 | 시장 규모·유료 전환·실사용 효과에 대한 통계는 제시하지 않는다. |
| 8 Value/Roadmap | 외부 앱 실행, 실제 저장소 변경, 배포 서비스는 현재 검증된 기능이 아니라 다음 검증 대상이다. | A-01 | 로드맵은 약속 또는 출시 완료 발표가 아니다. |

## Appendix Q&A 근거

| 부록 | 답변에 사용할 사실 | 근거 |
|---|---|---|
| A1 Contracts | 한 미션, 정확히 세 조건, evidence ID 없는 finding 불채택, 동일 조건 replay. | A-01, B-01, B-04 |
| A2 Verification | PC4 CI의 테스트 수와 커버리지·lint·build 통과. | A-01, C-05 |
| A3 PR ledger | #1 PC3 merged, #2 PC4 merged, #3 PC2 red E2E/unmerged. | A-01, C-02–C-04 |
| A4 Limitations | external-app runner 아님; live API·repo mutation·verified service URL 없음; synthetic preflight는 실제 연구를 대체하지 않음. | A-01, B-07 |

## 발표 금지 또는 제한 표현

| 사용하지 않을 표현 | 이유 / 안전한 대체 |
|---|---|
| “실제 앱을 자동으로 고칩니다” | 실제 source mutation이 없다. → “사람 승인 뒤 데모의 동일 조건 replay를 진행합니다.” |
| “실사용자가 3/3 통과했습니다” | 합성 조건 기반 결정론적 데모다. → “데모의 세 공개 조건이 3/3 통과했습니다.” |
| “배포되어 바로 쓸 수 있습니다” | 검증된 deployed service URL이 없다. → “credential-free 로컬 FocusList 데모입니다.” |
| “OpenAI가 실시간으로 판단합니다” | live OpenAI API 호출이 없다. → “현재 데모는 결정론적 fixture입니다.” |
| “PC2까지 모두 통합 완료했습니다” | PC2 PR #3은 red E2E 상태로 미병합이다. → “미병합 상태를 통합 원장에 그대로 표시합니다.” |
| “persona diversity 기능이 데모를 구동합니다” | 최대 12 후보 지원은 domain에 있으나 main visible flow 연결 근거가 없다. → 필요 시 “별도 domain 지원 범위”로만 말한다. |
