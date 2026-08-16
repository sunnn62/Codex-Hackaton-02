# PC4 가이드 — Release QA / Demo / Submission

PC4는 “테스트 파일 담당”보다 더 중요한 Release Evidence 담당입니다. 제품이 작동한다는 주장, Codex와 팀이 병렬로 일했다는 주장, 사용자 가치가 있다는 주장을 실제 명령 결과와 화면으로 증명합니다.

## 1. 담당 범위

PC4가 수정해도 되는 파일:

- `tests/e2e/**`
- `tests/integration/**`
- Playwright의 QA 전용 설정
- `README.md`
- `docs/BUILD_LOG.md`
- `docs/VALUE_AND_VIABILITY.md`
- `docs/DEMO_SCRIPT.md`
- `docs/SUBMISSION_CHECKLIST.md`
- `docs/assets/**`

수정하면 안 되는 파일:

- `src/lib/contracts/**`
- `src/lib/replay/**`
- `src/components/**`
- 제품 구현 파일
- `package.json`, lockfile, 공용 설정

제품 결함을 발견하면 먼저 실패하는 E2E를 남기고 해당 파일 소유자와 PC1에게 전달하세요.

## 2. 브랜치 만들기

```powershell
git fetch origin
git switch -c test/demo-readiness <BASELINE_SHA>
git status
```

병렬 개발 중에는 일부 E2E가 실패해도 괜찮습니다. 실패 로그를 보존하고, PC1이 Replay와 UI PR을 병합한 후 최신 `integration`을 반영해 최종 검증하세요.

## 3. Codex 설정

- 모델: `gpt-5.6-terra`
- Reasoning effort: `high`
- 복잡한 최종 실패 분석만 `gpt-5.6-sol / xhigh` 사용
- 프로젝트 폴더: 현재 clone한 저장소

## 4. Codex에 붙여넣을 프롬프트

```text
AGENTS.md를 먼저 읽고 준수해.

너는 PersonaFlight Replay Court의 PC4 Release QA and Demo Producer다. 현재 브랜치가 test/demo-readiness인지 확인해.

목표:
API key와 계정 없이 90초 안에 끝나는 핵심 데모를 실제 브라우저에서 검증하고, 해커톤 제출에 필요한 README, Codex Build Log, Value & Viability, Demo Script, Submission Checklist, 실제 스크린샷을 만든다.

너의 소유 범위:
- tests/e2e/**
- tests/integration/**
- QA 전용 Playwright 설정
- README.md
- docs/BUILD_LOG.md
- docs/VALUE_AND_VIABILITY.md
- docs/DEMO_SCRIPT.md
- docs/SUBMISSION_CHECKLIST.md
- docs/assets/**

제품 구현 파일을 직접 고치지 마라. 버그를 발견하면 재현 E2E, 기대 결과, 실제 결과, screenshot을 남기고 PC1과 파일 소유자에게 전달해라.

E2E 필수 흐름:
1. 홈 화면에서 mission과 정확히 세 condition 확인
2. “3개 조건 병렬 실행” 클릭
3. BEFORE 0/3, blocker, evidence ID 세 개 확인
4. Codex 최소 수정 검토 클릭
5. diff와 human approval 경계 확인
6. 승인 후 동일 조건 재실행
7. AFTER 3/3과 Flight Record 확인
8. regression seed 다운로드
9. synthetic 결과가 실제 사용자 리서치를 대체하지 않는다는 안내 확인

반드시 검사할 실패/신뢰 조건:
- unknown evidence finding이 화면에 나오지 않음
- after에서 실패가 남으면 CLEARED로 표시하지 않음
- infrastructure failure를 UX blocker로 바꾸지 않음
- 버튼과 링크를 키보드로 사용할 수 있음
- 상태는 색상 외 텍스트로도 전달됨
- desktop과 390×844에서 가로 overflow와 겹침이 없음
- 새 clone에서 README 순서만으로 실행 가능
- 저장소에 실제 secret이 없음

문서 원칙:
- BUILD_LOG에는 실제 commit SHA, PR URL, test output, screenshot만 기록한다.
- Parallel을 꾸며내지 않는다. 네 branch가 같은 baseline SHA에서 시작한 사실을 기록한다.
- Value & Viability에서 시장성과 가격은 검증된 사실과 가설을 구분한다.
- Demo Script는 3분 이내이며 화면 동작, 내레이션, 실패 시 fallback을 포함한다.
- 외부 URL이 아직 없으면 placeholder를 사실처럼 쓰지 말고 TODO라고 표시한다.

완료 보고:
- test 결과
- screenshot 및 다운로드 artifact 경로
- release blocker 목록
- 문서 목록
- 영상 촬영 순서
- 추천 commit message

먼저 검증 계획을 다섯 항목 이내로 보여주고 바로 실행해.
```

## 5. 권장 E2E 시나리오 이름

- `completes the evidence-to-identical-replay demo without credentials`
- `keeps the critical flow usable at 390 by 844`
- `downloads a regression seed after a truthful replay verdict`
- `exposes keyboard focus and text status for every critical action`

테스트는 제품의 실제 버튼 이름과 heading을 사용하세요. CSS class만 찾는 테스트는 피합니다.

## 6. 최종 검증 명령

```powershell
npm.cmd run lint
npm.cmd run test -- --coverage
npm.cmd run test:integration
npm.cmd run test:e2e
npm.cmd run build
git status --short
```

각 명령의 exit code와 핵심 결과를 `docs/BUILD_LOG.md`에 기록하세요. 실패한 명령을 성공했다고 쓰면 안 됩니다.

## 7. 제출 문서 최소 내용

### BUILD_LOG

- Plan: 제품 계약과 baseline SHA
- Parallel: PC2, PC3, PC4 branch와 PR
- Review: 발견한 blocker와 수정 commit
- Integrate: 병합 순서와 최종 gate

### VALUE_AND_VIABILITY

- 사용자: 출시 직전의 1인 vibe coder
- 현재 대안: 본인 테스트, 지인 피드백, 출시 후 수정
- 차별성: persona report가 아닌 evidence → patch → identical replay
- 가치 가설과 검증할 인터뷰 질문
- 무료 demo, 유료 반복 regression, CI 확장 가설

### DEMO_SCRIPT

- 0:00–0:20 문제와 Mission Contract
- 0:20–0:50 세 condition과 병렬 실행
- 0:50–1:30 blocker와 evidence
- 1:30–2:00 Codex diff와 사람 승인
- 2:00–2:35 동일 조건 replay와 Flight Record
- 2:35–3:00 orchestration 증거와 사용자 가치

## 8. 커밋과 PR

```powershell
git add tests/e2e tests/integration README.md docs
git commit -m "test: prove PersonaFlight demo readiness"
git push -u origin test/demo-readiness
```

`test/demo-readiness → integration` Draft PR을 만들고, 실패가 남아 있으면 PR 제목이나 본문에 명확하게 표시하세요.

## 9. 막혔을 때

- 브라우저 설치 실패: 오류 전문과 환경을 기록하고 PC1에게 전달
- E2E selector 불안정: CSS 대신 role/name을 사용하고 PC2에게 accessible name 요청
- 시간이 부족: 여러 브라우저 지원을 버리고 Chromium desktop/mobile 핵심 흐름을 먼저 증명
- 영상 촬영 실패: 검증된 screenshot 순서로 fallback 발표 자료를 만들되, 영상 링크가 있는 것처럼 쓰지 않기
