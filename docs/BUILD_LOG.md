# Codex Build Log

작성일: 2026-08-16

이 문서는 AI 사용량이 아니라 사람과 Codex가 어떤 계약으로 계획하고, 병렬화하고, 검토하고, 통합했는지를 증명합니다. 확인되지 않은 PR, URL, 테스트 결과는 기록하지 않습니다.

## 1. Plan — 무엇을 사람과 AI에게 맡겼는가

### 사람이 결정한 것

- 타깃: 출시 직전의 1인 바이브코더
- 핵심 문제: 실제 사용자 패널과 QA 자원이 부족해 UX 실패를 출시 후에 발견함
- 차별점: persona 의견이 아니라 evidence → patch → identical replay
- 범위: 준비된 미션 한 개와 정확히 세 개의 공개 fault condition
- 승인 경계: 코드 수정과 replay는 사람 승인 후 진행
- 윤리 경계: synthetic evidence는 실제 사용자 조사나 인구집단 예측을 대체하지 않음

### Codex에 맡긴 것

- 아이디어와 요구사항을 실행 가능한 제품 계약으로 정리
- Zod 계약, 결정론적 demo record, UI, 테스트와 CI 구현
- RED → GREEN 테스트 루프 수행
- 부분 실패를 성공으로 표시하는지 독립 review
- desktop과 390×844 브라우저 핵심 흐름 검증
- 역할별 branch, 모델 설정, paste-ready prompt와 handoff 형식 작성

### 핵심 계획 문서

- `docs/plans/2026-08-16-001-feat-personaflight-replay-court-plan.md`
- `docs/ORCHESTRATION.md`
- `AGENTS.md`

## 2. Parallel — 네 명의 작업을 어떻게 병렬화했는가

모든 PC는 PC1이 push한 동일 baseline SHA에서 시작하고 서로 다른 파일을 소유합니다.

| PC | Branch | 소유 결과 | 현재 증거 |
|---|---|---|---|
| PC1 | `integration` | 계약, baseline, CI, review, merge | 원격 통합 `8f286ef`; [green CI](https://github.com/sunnn62/Codex-Hackaton-02/actions/runs/31930156060) |
| PC2 | `feat/flight-record-ui` | UI polish, responsive, accessibility screenshot | TODO — 실제 commit/PR 입력 |
| PC3 | `feat/replay-engine` | evidence gate, replay, partial/infrastructure handling | TODO — 실제 commit/PR 입력 |
| PC4 | `test/demo-readiness` | Integration/E2E, 영상, 제출 문서와 링크 | worker PR 대기; PC1 fallback QA는 `ce2ca1c`에서 검증 |

각 역할은 `docs/team/PC1_INTEGRATOR_GUIDE.md`부터 `PC4_QA_GUIDE.md`까지 독립적인 설정, 명령, 프롬프트, 완료 조건을 받습니다. 공용 계약이 부족하면 worker가 임시 타입을 만들지 않고 PC1에게 변경 요청을 전달합니다.

## 3. Review — 결과를 어떻게 검토하고 고쳤는가

### TDD 증거

- Replay contract: 존재하지 않는 module로 RED → schema skeleton의 의도된 실패 → 8개 GREEN
- Demo flight: 존재하지 않는 module로 RED → 3개 deterministic flight test GREEN
- UI flow: 접근 가능한 버튼/heading query RED → plan/evidence/patch/replay flow GREEN
- Review regression: partial record가 `CLEARED · 3/3`으로 잘못 표시되는 테스트 RED → 실제 run 기반 `HOLD · 2/3` GREEN
- Contract regression: comparison 값이 run과 모순되어도 통과하는 테스트 RED → schema comparison invariant GREEN

### 독립 review에서 발견하고 반영한 것

1. UI가 local stage만 보고 항상 `CLEARED · 3/3`을 표시할 수 있었음
   - 실제 before/after run에서 pass 수와 release status를 계산하도록 수정
2. run과 condition label을 배열 index로 연결해 순서가 바뀌면 잘못 표시할 수 있었음
   - `conditionId → label` lookup으로 수정하고 reorder regression test 추가
3. comparison count, verdict, unresolved IDs가 실제 run과 연결되지 않았음
   - Zod `superRefine`에서 실제 값과 일치하도록 강제
4. fault condition tuple과 version enum이 중복 선언됨
   - 공유 schema fragment로 추출
5. CI가 Integration/E2E 파일 삭제 시 해당 gate를 건너뛸 수 있었음
   - conditional gate를 제거하고 integration, Chromium, E2E를 항상 실행하도록 수정
6. GitHub Actions tag가 이동 가능한 공급망 위험
   - checkout/setup-node/upload-artifact를 검증된 full commit SHA로 고정
7. Windows에서 Playwright가 Next dev worker를 종료하지 못해 테스트가 멈출 수 있었음
   - production Next 앱을 Playwright global setup이 직접 열고 닫도록 바꿔 정상 종료와 포트 해제를 검증
8. 390×844 검증이 viewport만 작고 실제 touch context가 아니었음
   - `isMobile`, `hasTouch`, `tap()`을 사용하는 mobile context와 성공 screenshot evidence 추가

## 4. Integrate — 결과를 어떻게 하나로 합쳤는가

예정된 병합 순서는 계약 의존성을 따릅니다.

```text
PC1 baseline
→ PC3 Replay Engine
→ PC2 Product UI
→ PC4 Release QA
→ integration 전체 gate
→ main
```

원격 저장소의 기존 `integration` 이력과 PC1 기준선이 서로 다른 root에서 시작한 사실을 확인했습니다. 강제 push 대신 `--allow-unrelated-histories` merge로 기존 `Agent.md`와 `docs/WORKFLOW.md`를 보존했고, merge SHA `8f286ef`를 정상 push했습니다. 현재 worker PR은 아직 생성되지 않았으므로 네 명의 결과 병합이 끝났다고 기록하지 않습니다.

## 5. 현재 검증 증거

2026-08-16 PC1 로컬 기준:

| 명령/검증 | 결과 |
|---|---|
| `npm.cmd run test` | 6 files, 27 tests passed |
| `npm.cmd run lint` | exit 0 |
| `npm.cmd run test:coverage` | statements 96.77%, branches 90.27%, functions 100%, lines 96.52% |
| `npm.cmd run test:integration` | 1 file, 1 test passed |
| `npm.cmd run test:e2e` | production build 후 desktop keyboard + 390×844 mobile touch, 2 tests passed |
| `npm.cmd run build` | Next.js production build, TypeScript, 3 static pages 성공 |
| Browser desktop | 핵심 버튼 흐름과 3/3 Flight Record 확인 |
| Browser 390×844 | horizontal overflow 없음, download link visible |
| Browser console | warning/error 0 |
| Secret scan | 실제 secret 없음; 문서의 검색 정규식 예시만 검출 |
| GitHub Actions | [run 31930156060](https://github.com/sunnn62/Codex-Hackaton-02/actions/runs/31930156060), 모든 gate와 Playwright artifact upload 성공 |

### PC1 commit history

- `3e01cb0` — `feat: establish Replay Court product baseline`
- `440ced5` — `docs: orchestrate four-PC Codex sprint`
- `a23b71e` — `ci: enforce PersonaFlight quality gates`
- `0366c29` — `docs: prepare hackathon submission artifacts`
- `ce2ca1c` — `test: prove Replay Court release flow`
- `8f286ef` — `merge: preserve remote workflow in PersonaFlight baseline`

공유 기준선은 원격 `pc1-baseline`의 `b24efb6ef2177c43e426a8346a0cdfa30ab59dff`이며, 원격 통합 기준선은 [`8f286efd8727c3404f576267b3ea05d9dfac8115`](https://github.com/sunnn62/Codex-Hackaton-02/commit/8f286efd8727c3404f576267b3ea05d9dfac8115)입니다.

## 6. 제출 전 채워야 할 실제 증거

- [x] `integration` 원격 baseline SHA와 commit URL
- [ ] PC2 commit과 PR URL, desktop/mobile screenshot
- [ ] PC3 commit과 PR URL, focused test output
- [ ] PC4 commit과 PR URL, Integration/E2E output
- [ ] 최종 `main` SHA와 green CI URL
- [ ] 실제 Service URL을 다른 PC에서 열어본 결과
- [ ] 실제 Demo video URL을 다른 PC에서 재생한 결과
- [x] 최종 화면 screenshot: `docs/assets/flight-record-desktop.png`, `docs/assets/flight-record-mobile.png`

## 7. Post-Deploy Monitoring & Validation

정적 MVP이므로 서버 로그나 사용자 데이터는 없습니다. 배포 직후 PC4가 다음을 확인합니다.

- `/` 응답이 200이며 first contentful screen이 표시됨
- Mission과 세 conditions가 계정 없이 보임
- 버튼 세 번으로 Flight Record까지 진행 가능
- regression seed 다운로드 가능
- console error/warning 없음
- desktop과 390×844에서 가로 overflow 없음

위 항목 중 하나라도 실패하면 배포 SHA를 제출하지 않고 직전 green SHA로 되돌립니다.
