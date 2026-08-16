# Value & Viability

## 한 줄 가치 제안

PersonaFlight Replay Court는 출시 직전의 1인 바이브코더에게 “AI가 불편하다고 말했다”가 아니라 **어떤 조건에서 어디서 실패했고, 최소 수정 후 같은 조건에서 정말 나아졌는지**를 재현 가능한 Flight Record로 제공합니다.

## 문제

바이브코딩은 구현 속도를 크게 높이지만 혼자 만드는 사람에게 다음 병목은 남습니다.

- 실제 타깃 사용자를 출시 전에 모집하기 어렵다.
- 개발자는 자신의 앱 사용 방식에 익숙해 초보자의 막힘을 놓친다.
- 서로 다른 viewport, 입력 방식, 기다림 허용도, 문구 추론 부담을 반복 검증하기 어렵다.
- 피드백을 받아도 재현, 우선순위, 수정, 회귀 테스트를 혼자 연결하기 어렵다.
- 결국 출시 후 이탈, 리뷰, 리젝을 통해 문제를 발견한다.

## 차별성

### 일반적인 AI persona report

```text
persona 생성 → 화면에 대한 의견 → 점수와 개선 제안
```

### PersonaFlight Replay Court

```text
명시적 mission
→ 공개된 fault condition
→ screen/action evidence
→ evidence ID가 연결된 blocker만 채택
→ 최소 code diff
→ human approval
→ 동일 조건 replay
→ partial-capable Flight Record
→ regression seed
```

핵심 차별성은 persona의 말투나 수가 아니라 **주장을 반박하고 다시 검증할 수 있는 증거 구조**입니다.

## 1차 사용자

- 웹앱, PWA, React Native, Flutter 앱을 만드는 1인 바이브코더
- 정식 QA와 UX researcher를 고용하기 어려운 개인 개발자
- 첫 출시 또는 큰 업데이트 직전 최소한의 신뢰 가능한 검증이 필요한 제작자

## 핵심 Job to Be Done

> 앱을 공개하기 직전에, 실제 사용자 테스트를 시작하기 전에 제거할 수 있는 명백한 UX 실패를 빠르게 발견하고, 수정이 같은 조건에서 효과가 있었는지 증명하고 싶다.

## 사용자 가치가 발생하는 순간

사용자는 10분 안에 다음 결과를 받아야 합니다.

1. 한 핵심 미션과 조건을 이해한다.
2. 적어도 하나의 출시 전 blocker를 화면·행동 증거로 확인한다.
3. 수정 diff가 왜 필요한지 검토하고 직접 승인한다.
4. 동일 조건 replay로 개선 또는 미해결을 확인한다.
5. 결과를 regression seed로 보존한다.

## Value 가설과 검증 방법

현재 아래 내용은 **검증된 시장 사실이 아니라 가설**입니다.

| 가설 | 검증 질문/행동 | 성공 신호 |
|---|---|---|
| 출시 전 10분 검증에 가치가 있다 | 최근 앱을 출시한 1인 개발자 5명에게 실제 데모 제공 | 3명 이상이 자신의 앱 URL/flow로 다시 사용 요청 |
| 단순 report보다 replay 증거를 선호한다 | persona report와 Flight Record를 나란히 제시 | 4명 이상이 우선 수정 항목 결정에 Flight Record 선택 |
| 반복 regression에 비용을 지불한다 | 무료 1회와 유료 반복 plan 제시 | 2명 이상이 가격 또는 팀/CI 연결 질문 |
| human approval 경계가 신뢰를 높인다 | 자동 수정형과 승인형을 비교 질문 | 다수가 승인형을 실제 저장소에 연결하겠다고 응답 |

## 수익 모델 가설

가격은 아직 검증되지 않았으므로 확정하지 않습니다.

- Free: 준비된 데모와 제한된 preflight run
- Maker: 프로젝트별 반복 replay와 regression history
- Pro: PR/CI 연결, 조건 library, 팀 공유 Flight Record
- Agency: 여러 client app, reusable mission packs, export/report

해커톤 이후에는 “월 얼마를 낼 것인가”보다 최근 출시에서 QA 실패로 소비한 시간과, 유료 반복 replay를 실제로 예약하는지를 먼저 측정합니다.

## 기술적 실현 가능성

### 현재 검증된 것

- API key 없는 결정론적 demo mode
- Zod 기반 mission/evidence/comparison 계약
- evidence 없는 finding 거절
- exact three condition과 identical-condition invariant
- partial verdict가 full success로 표시되지 않음
- 다운로드 가능한 regression seed
- unit 27개와 integration 30개로 위 계약을 검증
- lint와 production build
- CI Chromium E2E의 desktop keyboard·390×844 touch flow, console 상태, screenshot artifact

### 아직 검증되지 않은 것

- 실제 사용자에게 가치가 있는지, 어떤 가격을 수용하는지, 시장 크기

PC4의 로컬 QA sandbox에서는 Chromium launch가 macOS 권한으로 차단됐지만, GitHub Actions의 browser-capable runner가 해당 E2E와 screenshot artifact를 검증했다. 이 환경 제약은 UX finding으로 전환하지 않는다.

### 다음 단계

- 실제 preview URL을 격리 브라우저에서 실행
- screenshot, action trace, console/network evidence 수집
- Codex가 repository context에서 최소 patch를 제안하되 자동 적용 금지
- 승인된 patch가 있는 preview를 동일 seed로 재실행
- PR comment와 CI artifact로 Flight Record 게시

## 비용과 운영

현재 demo는 외부 AI/API 호출이 없어 실행 비용이 거의 없습니다. 실제 제품에서는 browser runtime, model inference, screenshot storage가 주요 변동비가 됩니다. 실행 횟수, condition 수, retention 기간을 plan별로 제한하고 동일 seed cache로 반복 비용을 줄입니다.

## 윤리와 신뢰

- 연령·성별 같은 인구통계로 능력이나 행동을 단정하지 않는다.
- 조건은 viewport, input, latency, copy ambiguity처럼 재현 가능해야 한다.
- AI 결과를 실제 사용자 집단의 반응으로 표현하지 않는다.
- evidence가 없는 finding은 채택하지 않는다.
- infrastructure failure와 UX failure를 분리한다.
- full pass가 아니면 `CLEARED`로 표시하지 않는다.
- 코드 수정은 사람이 승인한 후에만 진행한다.

## 성공 지표

- 첫 blocker 발견까지 걸린 시간
- evidence가 연결된 finding 비율
- replay 후 해결된 condition 비율
- false-positive로 사용자가 기각한 finding 비율
- regression seed 재사용률
- 실제 사용자 테스트 전에 발견한 release blocker 수

단일 “UX 점수”는 핵심 지표로 사용하지 않습니다. 누가 아니라 **어떤 조건에서 무엇이 실패했고 다시 통과했는지**를 측정합니다.
