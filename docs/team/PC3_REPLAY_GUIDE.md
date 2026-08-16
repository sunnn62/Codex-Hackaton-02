# PC3 가이드 — Evidence / Replay Engine

PC3의 임무는 PersonaFlight의 차별성을 실제 데이터 계약으로 증명하는 것입니다. “AI가 UX가 나쁘다고 말했다”가 아니라, **어느 화면에서 어떤 행동이 실패했고 그 근거를 수정 후 같은 조건으로 다시 실행했는지**를 결정론적으로 생성해야 합니다.

## 1. 담당 범위

PC3가 수정해도 되는 파일:

- `src/lib/replay/**`
- `src/lib/evidence/**`
- replay 관련 `src/lib/domain/**`
- `src/app/demo/**`
- `tests/unit/replay-*.test.ts`
- `tests/unit/evidence-*.test.ts`
- `tests/unit/demo-flight.test.ts`

수정하면 안 되는 파일:

- `src/lib/contracts/**`
- `src/components/**`
- `src/app/page.tsx`, layout, globals
- `tests/e2e/**`
- `package.json`, lockfile, 공용 설정

## 2. 브랜치 만들기

```powershell
git fetch origin
git switch -c feat/replay-engine <BASELINE_SHA>
git status
```

반드시 PC1이 공유한 정확한 SHA를 사용하세요.

## 3. Codex 설정

- 모델: `gpt-5.6-sol`
- Reasoning effort: `xhigh`
- 프로젝트 폴더: 현재 clone한 저장소
- 권한: 저장소 내부 쓰기 허용

## 4. Codex에 붙여넣을 프롬프트

```text
AGENTS.md를 먼저 읽고 준수해.

너는 PersonaFlight Replay Court의 PC3 Evidence and Replay Engineer다. 현재 브랜치가 feat/replay-engine인지 확인해.

목표:
준비된 FocusList 미션을 정확히 세 개의 공개된 behavioral fault condition으로 실행하고, 알려진 evidence ID가 있는 blocker만 채택하고, 최소 patch 제안 뒤 동일 조건 replay와 regression seed를 생성한다. Demo mode는 API key 없이 완전히 결정론적으로 동작해야 한다.

세 조건은 고정한다:
1. touch-only + small viewport
2. low patience + delayed feedback
3. reduced inference + ambiguous copy

연령, 성별, 국적이 위 행동을 만든다고 설명하지 마라.

너의 소유 범위:
- src/lib/replay/**
- src/lib/evidence/**
- replay 관련 src/lib/domain/**
- src/app/demo/**
- replay/evidence focused unit tests

src/lib/contracts/**는 PC1 소유다. 공용 계약이 부족하면 직접 수정하지 말고 HANDOFF에 필요한 필드와 이유를 적어라.

필수 불변 조건:
- before와 after는 같은 mission ID, 시작 상태, 성공 기준, condition ID를 사용한다.
- 각 condition run은 화면 ID, action, target, outcome, evidence ID를 가진다.
- finding이 인용한 모든 evidence ID는 실제 before evidence에 존재해야 한다.
- unknown evidence ID finding은 반드시 기각한다.
- browser/infrastructure failure를 UX failure처럼 표시하지 않는다.
- after에 하나라도 실패하면 full pass가 아닌 partial verdict다.
- patch는 proposed/approved 상태를 표현하지만 자동으로 외부 저장소에 적용하지 않는다.
- regression seed는 mission, 세 condition, 기대 통과 condition, unresolved condition을 보존한다.
- 같은 입력은 같은 결과를 반환한다.

TDD 시나리오:
1. 정확히 세 before run과 세 after run
2. before condition ID와 after condition ID 일치
3. unknown evidence ID 기각
4. 한 condition이 after에서 실패하면 partial verdict
5. infrastructure failure가 별도 결과로 유지됨
6. regression seed JSON round-trip
7. 원본 객체를 mutate하지 않고 결과가 깊게 freeze됨

작업 방식:
- 테스트를 먼저 작성하고 예상 RED를 실제로 실행한다.
- 한 번에 한 행동만 GREEN으로 만든다.
- 하드코딩된 demo fixture는 허용하지만 코드와 UI에서 deterministic fixture임을 투명하게 밝힌다.
- 외부 OpenAI 호출, arbitrary URL, DB, 로그인, live git patch 기능은 추가하지 않는다.

완료 보고:
- 실제 변경 파일
- RED/GREEN 명령과 결과
- public exports와 PC1/PC2가 사용하는 방법
- 남은 위험
- 추천 commit message

먼저 실행 계획을 다섯 항목 이내로 보여주고 바로 구현해.
```

## 5. 구현 체크리스트

- `createDemoFlightRecord()`가 공용 `FlightRecord` 타입을 만족하는가?
- finding에 evidence ID가 없으면 생성되지 않는가?
- 세 condition의 first failure가 서로 구체적인가?
- before와 after가 동일한 조건 순서를 유지하는가?
- patch diff가 한 blocker만 고치는 최소 변경인가?
- unresolved condition을 숨기지 않는가?
- 출력에 secret, 이메일, 전화번호 같은 입력값이 없는가?

## 6. 테스트와 커밋

```powershell
npm.cmd run test -- tests/unit/demo-flight.test.ts tests/unit/replay-contracts.test.ts
npm.cmd run test
git status --short
git add src/lib/replay src/lib/evidence src/lib/domain src/app/demo tests/unit/demo-flight.test.ts tests/unit/replay-*.test.ts tests/unit/evidence-*.test.ts
git commit -m "feat: prove fixes with evidence-backed replay"
git push -u origin feat/replay-engine
```

존재하지 않는 경로는 `git add`에서 제외하세요. `git add .`는 사용하지 않습니다.

## 7. Pull Request

`feat/replay-engine → integration` Draft PR을 만듭니다. 본문에 다음을 넣으세요.

- before/after 조건 일치 증거
- evidence gate 테스트 결과
- public exports
- UI가 읽을 데이터 예시
- partial/infrastructure failure 처리 방식
- 범위에서 의도적으로 제외한 것

## 8. 막혔을 때

- 계약 필드 부족: PC1에게 먼저 요청하고 임시 별도 타입을 만들지 않기
- UI 요구와 충돌: 데이터 의미를 바꾸지 말고 PC2가 표시 방법을 조정하도록 요청
- 브라우저 자동화가 불안정: deterministic fixture를 유지하고 browser automation은 후속 범위로 기록
- 시간 부족: 추가 condition과 AI narrative를 버리고 evidence gate와 identical replay를 유지
