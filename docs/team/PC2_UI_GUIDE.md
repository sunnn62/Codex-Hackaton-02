# PC2 가이드 — Product UI / Flight Record

PC2의 임무는 “예쁜 화면”만 만드는 것이 아닙니다. 심사위원이 소리 없이 20초만 보아도 **세 조건에서 실패를 발견하고, 코드 수정 후 같은 조건으로 다시 증명하는 제품**임을 이해하게 만드는 것이 목표입니다.

## 1. 담당 범위

PC2가 수정해도 되는 파일:

- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/components/**`
- UI 전용 `public/**`
- PC2가 새로 만드는 컴포넌트 테스트

수정하면 안 되는 파일:

- `src/lib/contracts/**`
- `src/lib/replay/**`
- `src/lib/evidence/**`
- `src/app/api/**`
- `tests/e2e/**`
- `package.json`, lockfile, 공용 설정

공용 타입이 부족하면 직접 고치지 말고 PC1에게 필요한 필드와 이유를 전달하세요.

## 2. 브랜치 만들기

PC1에게 받은 `<BASELINE_SHA>`를 실제 값으로 바꾸세요.

```powershell
git fetch origin
git switch -c feat/flight-record-ui <BASELINE_SHA>
git status
```

`On branch feat/flight-record-ui`가 보여야 합니다. 다른 브랜치라면 작업을 시작하지 말고 PC1에게 확인하세요.

## 3. Codex 설정

- 모델: `gpt-5.6-sol`
- Reasoning effort: `high`
- 프로젝트 폴더: 현재 clone한 저장소
- 권한: 저장소 내부 쓰기 허용

## 4. Codex에 붙여넣을 프롬프트

```text
AGENTS.md를 먼저 읽고 준수해.

너는 PersonaFlight Replay Court의 PC2 Product UI Engineer다. 현재 브랜치가 feat/flight-record-ui인지 확인하고, 아니라면 코드를 수정하지 말고 알려줘.

목표:
심사위원이 설명 없이 20초 안에 “하나의 미션을 세 조건으로 실행하고, 실패 증거를 확인하고, 최소 diff를 승인하고, 같은 조건으로 재실행해 before/after 개선을 증명하는 제품”이라고 이해할 수 있는 웹 UI를 완성한다.

너의 소유 범위:
- src/app/page.tsx
- src/app/layout.tsx
- src/app/globals.css
- src/components/**
- UI 전용 public/**
- UI 컴포넌트 테스트

다른 소유자의 src/lib/contracts, src/lib/replay, src/lib/evidence, src/app/api, tests/e2e, package.json은 수정하지 마라. 필요한 변경은 최종 HANDOFF에 요청으로 적어라.

반드시 유지할 사용자 흐름:
1. Mission Contract와 성공·실패 조건 확인
2. 정확히 세 개의 공개된 fault condition 확인
3. “3개 조건 병렬 실행”
4. BEFORE 0/3과 각 condition의 evidence ID 및 첫 실패 지점 확인
5. Codex 최소 수정 diff 검토
6. 사람의 승인 버튼
7. 동일 조건 replay
8. AFTER 3/3과 Flight Record 확인
9. regression seed 다운로드
10. synthetic 결과가 실제 사용자 조사를 대체하지 않는다는 안내

디자인 방향:
- generic SaaS dashboard 대신 “비행 전 검사 + 증거 재판 기록” 느낌
- dark ink, warm paper, acid lime success, coral blocker 색상
- 큰 editorial typography와 강한 정보 위계
- desktop과 390×844 모바일에서 overflow와 겹침이 없어야 함
- 실패는 빨간색만이 아니라 BLOCKED, 근거 ID, 설명 텍스트로 전달
- 키보드 focus가 명확하고 버튼 이름이 구체적이어야 함
- 영상에서 작은 글자가 안 보일 수 있으니 BEFORE 0/3, AFTER 3/3, RELEASE HOLD/CLEARED를 크게 표시

작업 방식:
1. 기존 UI와 테스트를 읽는다.
2. 동작 변경은 테스트를 먼저 고치거나 추가한다.
3. 테스트가 의도대로 실패하는 RED를 확인한다.
4. 최소 구현으로 GREEN을 만든다.
5. desktop과 390×844를 직접 확인한다.
6. npm.cmd run test와 npm.cmd run lint를 실행한다.

완료 보고:
- 실제 변경 파일
- RED와 GREEN 테스트 결과
- desktop/mobile screenshot 경로
- 남은 UI 위험
- PC1에게 필요한 변경 요청
- 추천 commit message

계획을 다섯 항목 이내로 먼저 보여준 뒤 바로 구현해. 범위를 넓히기 위한 질문은 하지 말고, 정말 계약 변경이 필요할 때만 멈춰 알려줘.
```

## 5. 직접 확인할 화면 체크리스트

- 첫 화면에서 Mission과 3 conditions가 스크롤 전에 보이는가?
- 버튼을 누를 때 Plan → Parallel → Review → Integrate가 진행되는가?
- evidence ID 세 개가 각각 보이는가?
- diff가 가로 스크롤로 화면 전체를 밀지 않는가?
- mobile에서 condition 카드가 한 열로 정렬되는가?
- focus outline이 배경과 구분되는가?
- 마지막 화면에 `AFTER · 3/3 PASS`와 다운로드 링크가 보이는가?

## 6. 테스트와 커밋

```powershell
npm.cmd run test
npm.cmd run lint
git status --short
git add src/app src/components tests/unit/replay-court.test.tsx
git commit -m "feat: polish the Flight Record experience"
git push -u origin feat/flight-record-ui
```

`git add .`는 사용하지 마세요. PC2 소유 파일만 명시적으로 stage합니다.

## 7. Pull Request

GitHub에서 `feat/flight-record-ui → integration` Draft PR을 만드세요. PR 본문에 다음을 포함합니다.

- 20초 silent demo에서 이해되는 핵심 변화
- desktop/mobile screenshot
- 실행한 테스트와 결과
- 계약 파일을 수정하지 않았다는 확인
- PC1이 병합 후 확인해야 할 UI 위험

PR 링크를 PC1에게 보내고, 병합 전까지 새 기능을 추가하지 마세요.

## 8. 막혔을 때

- 타입이 부족함: 필요한 타입 필드를 예시 값과 함께 PC1에게 요청
- engine 데이터가 없음: 임시 데이터를 새로 만들지 말고 기존 `createDemoFlightRecord()` 사용
- 다른 PR과 충돌: 임의로 해결하지 말고 충돌 파일을 PC1에게 전달
- 시간이 부족함: 애니메이션 → 장식 → 보조 설명 순으로 줄이고 핵심 흐름은 유지
