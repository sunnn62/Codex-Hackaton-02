# 3분 데모 영상 대본

목표 길이: 2분 40초–3분

## 촬영 전 준비

- 배포 URL 또는 로컬 앱을 새로고침
- 브라우저 zoom 100%
- 알림과 개인 정보가 보이는 탭 닫기
- desktop 화면에서 전체 흐름 한 번 리허설
- 다운로드 폴더 정리
- GitHub `integration` branch와 Build Log 탭 준비

## 0:00–0:20 — 문제와 한 줄 소개

화면: 첫 화면 hero와 Mission Contract

내레이션:

> 바이브코딩으로 혼자 앱을 만드는 속도는 빨라졌지만, 출시 전에 다양한 실제 사용 조건을 검증할 사람과 시간이 부족합니다. PersonaFlight Replay Court는 AI persona의 의견을 늘어놓는 대신, 실패 증거부터 코드 수정과 동일 조건 재검증까지 연결합니다.

## 0:20–0:45 — 공개된 조건과 윤리 경계

화면: 세 condition card를 가리킴

내레이션:

> 이 데모의 미션은 새 할 일을 Today 목록에 추가하는 것입니다. Touch-only small viewport, 낮은 기다림 허용도와 지연 피드백, 낮은 추론 부담과 모호한 문구라는 세 조건을 공개합니다. 연령이나 성별로 능력을 추측하지 않습니다.

행동: `3개 조건 병렬 실행` 클릭

## 0:45–1:20 — BEFORE evidence

화면: `BEFORE · 0/3 PASS`, evidence cards

내레이션:

> 세 조건 모두 같은 저장 지점에서 막혔지만 이유는 다릅니다. 작은 화면에서는 CTA를 확인하기 어렵고, 지연 상태가 없으며, Done이라는 문구가 저장인지 닫기인지 모호합니다. 각 주장은 화면, 행동, evidence ID에 연결됩니다. 근거가 없는 finding은 계약 단계에서 거부됩니다.

행동: 세 evidence ID와 `BLOCKED AT: save-task`를 차례로 가리킨 뒤 `Codex 최소 수정 검토` 클릭

## 1:20–1:50 — Codex patch와 사람 승인

화면: minimal code diff

내레이션:

> Codex는 전체 앱을 다시 쓰지 않고 blocker에 필요한 최소 diff만 제안합니다. CTA를 화면 안에 유지하고 이름을 명확하게 바꾸며 저장 상태를 지속적으로 표시합니다. 자동 적용하지 않고 사람이 diff를 검토합니다.

행동: diff를 보여주고 `승인 후 동일 조건 재실행` 클릭

## 1:50–2:20 — 동일 조건 replay

화면: `CLEARED`, `AFTER · 3/3 PASS`, before/after comparison

내레이션:

> 승인 후 미션과 세 조건을 바꾸지 않고 다시 실행했습니다. BEFORE 0/3에서 AFTER 3/3으로 개선됐고 Flight Record에 남습니다. 한 조건이라도 실패하면 CLEARED가 아니라 HOLD를 유지하도록 regression test로 검증했습니다.

행동: condition별 PASSED와 `Regression seed 저장`을 보여주고 다운로드

## 2:20–2:45 — Codex Orchestration 증거

화면: `docs/BUILD_LOG.md` 또는 GitHub PR 목록

내레이션:

> 네 대의 PC는 같은 baseline SHA에서 출발했습니다. PC1은 계약과 통합, PC2는 UI, PC3는 replay engine, PC4는 QA와 제출 증거를 맡았습니다. Plan, Parallel, Review, Integrate를 branch, RED/GREEN test, PR, 실제 SHA로 기록했습니다.

행동: 역할 표, review 수정 2개, 실제 CI 결과를 짧게 가리킴

## 2:45–3:00 — 가치와 마무리

화면: 첫 화면 또는 Value & Viability 핵심 문장

내레이션:

> PersonaFlight는 실제 사용자 리서치를 대체하지 않습니다. 그 전에 혼자서 제거할 수 있는 명백한 UX 사각지대를 증거로 찾아, 출시 후 실패를 출시 전 반복 가능한 회귀 테스트로 바꿉니다.

## 영상 실패 시 fallback

- 라이브 배포 실패: 검증된 로컬 빌드와 동일 SHA를 화면에 표시
- 다운로드 실패: seed JSON 내용을 저장된 artifact로 보여주되 실패를 숨기지 않음
- GitHub 로딩 실패: Build Log의 실제 SHA와 미리 캡처한 PR screenshot 사용
- 시간 초과: condition 설명을 10초로 줄이고 evidence → patch → replay와 orchestration 증거는 유지

## 촬영 후 검증

- [ ] 영상 길이 3분 이내
- [ ] 글자가 1080p에서 읽힘
- [ ] BEFORE 0/3, evidence ID, patch, human approval, AFTER 3/3이 모두 보임
- [ ] Plan/Parallel/Review/Integrate 증거가 보임
- [ ] synthetic disclaimer가 보이거나 내레이션에 포함됨
- [ ] 다른 PC에서 영상 URL 재생 성공
- [ ] 음성에 API key, 이메일, 알림 등 개인 정보가 없음
