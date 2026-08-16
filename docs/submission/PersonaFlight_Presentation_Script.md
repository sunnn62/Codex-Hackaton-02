# PersonaFlight Replay Court — 해커톤 발표 대본

**총 목표 시간: 약 6분 27초.** 아래 시간은 전환을 포함한 발표자 기준이며, 각 본문 슬라이드는 35–60초입니다. 이 발표에서 말하는 제품은 **결정론적·무자격증명 FocusList 합성 데모**입니다. 실제 외부 앱을 실행하거나, 실제 저장소를 변경하거나, 배포된 서비스의 성과를 주장하지 않습니다.

## Slide 1 — PersonaFlight Replay Court (0:00–0:42, 42초)

**화면:** 제목, 한 줄 결과 `실패 증거 → 사람 승인 → 같은 조건 재실행`.

**대본:**

“PersonaFlight Replay Court는 출시 전에 핵심 UX 실패를 **증거로 찾고, 최소 수정안을 사람이 승인한 뒤, 같은 조건에서 다시 확인**하게 하는 프리플라이트 데모입니다. 오늘은 FocusList에서 ‘할 일을 만들고 Today에 추가한다’는 한 미션을 보겠습니다. 결론부터 말씀드리면, 같은 세 조건에서 BEFORE는 0/3, 승인 뒤 AFTER는 3/3입니다. 중요한 것은 AI가 사용자를 대신해 판단했다는 말이 아닙니다. 어떤 조건에서 어디가 막혔는지, 무엇을 바꿨는지, 그리고 같은 조건에서 다시 통과했는지를 남긴다는 점입니다.”

**전환:** “먼저, 왜 의견 대신 replay가 필요한지 보겠습니다.”

## Slide 2 — 문제와 차별점 (0:42–1:27, 45초)

**화면:** `일반 의견`과 `Evidence → Approval → Replay` 대비.

**대본:**

“혼자 앱을 만들 때는 구현은 빨라도 출시 전 검증이 끊기기 쉽습니다. 보통 AI persona 평가는 ‘불편할 것 같다’는 제안에서 멈춥니다. PersonaFlight는 그 제안을 바로 채택하지 않습니다. evidence ID가 있는 finding만 다루고, 그 finding을 해결하는 **최소 diff**를 보여줍니다. 그 다음에도 자동으로 코드를 고치지 않습니다. 사람이 승인한 뒤에만 동일 미션과 동일 조건을 replay합니다. 그래서 결과는 한 번의 그럴듯한 리포트가 아니라, BEFORE·AFTER와 regression seed를 가진 검증 기록입니다.”

**전환:** “이 데모는 의도적으로 한 미션과 정확히 세 조건에만 집중합니다.”

## Slide 3 — 한 미션, 정확히 세 조건, 동일 조건 replay (1:27–2:17, 50초)

**화면:** Mission Contract와 3개 condition 카드.

**대본:**

“미션은 단 하나, ‘할 일을 만들고 Today에 추가한다’입니다. 조건도 정확히 세 개입니다. 첫째, **Touch-only와 작은 viewport**. 둘째, **낮은 기다림 허용도와 지연된 피드백**. 셋째, **낮은 추론 여력과 모호한 문구**입니다. 이는 연령이나 성별로 사람의 능력을 추정하는 방식이 아닙니다. 재현할 수 있는 입력 방식, 화면 크기, 기다림, 문구 이해 부담을 공개한 조건입니다. 승인 뒤에도 미션, 시작 상태, 조건, 성공 기준을 바꾸지 않습니다. 따라서 3/3이라는 숫자는 조건을 느슨하게 만든 결과가 아니라, 같은 계약을 다시 실행한 결과입니다.”

**전환:** “이 계약을 제품 흐름으로 보면 90초 안에 네 단계로 정리됩니다.”

## Slide 4 — 90초 PLAN → PARALLEL → REVIEW → INTEGRATE (2:17–3:07, 50초)

**화면:** 네 단계 흐름. PLAN: 계약 고정, PARALLEL: 세 조건, REVIEW: evidence와 최소 diff, INTEGRATE: 승인·replay·seed.

**대본:**

“첫 단계 PLAN에서 미션과 성공 기준을 고정합니다. PARALLEL에서는 세 조건을 같은 미션에 병렬로 적용합니다. REVIEW에서는 화면과 행동에 연결된 evidence ID로 blocker를 확인하고, 필요한 최소 diff를 검토합니다. INTEGRATE는 사람의 승인으로 시작합니다. 승인 후 같은 조건을 replay하고, BEFORE와 AFTER를 한 Flight Record로 비교하며, 통과 조건을 regression seed로 저장합니다. 이 흐름은 빠르게 보이기 위한 자동화가 아닙니다. evidence가 없는 finding, 승인 없는 진행, 조건을 바꾼 성공 주장을 경계로 막는 흐름입니다.”

**전환:** “이제 실제로 보이는 0/3에서 3/3까지를 35초 영상으로 보겠습니다.”

## Slide 5 — 동작 증명: BEFORE 0/3 → 승인된 최소 diff → AFTER 3/3 → seed (3:07–4:02, 55초)

**화면:** 검증 영상 재생과 BEFORE/AFTER Flight Record.

**대본:**

“이 영상은 H.264, 1280×720, 35.32초의 로컬 검증 자산입니다. 시작 시점의 BEFORE는 0/3입니다. 각 실패는 evidence ID에 연결되고, 제품은 그 blocker에 대한 최소 diff를 보여줍니다. 여기서 사람 승인이 있어야 데모가 다음 단계로 진행합니다. 승인 뒤에는 동일한 세 조건을 다시 실행해 AFTER 3/3을 보여줍니다. 마지막으로 이 통과 조건은 regression seed로 저장됩니다. 단, 이 화면의 diff와 mock은 결정론적 fixture입니다. 승인은 데모를 전진시키지만 실제 소스 코드를 수정하지는 않습니다.”

### 정확한 35초 데모 큐 시트

| 영상 시각 | 큐 | 발표자 멘트 |
|---|---|---|
| 0초 | 영상 시작 | “같은 미션과 세 조건으로 시작합니다.” |
| 2초 | **PLAN** | “계약을 고정하고 세 조건을 병렬로 준비합니다.” |
| 8초 | **BEFORE** | “BEFORE는 0/3이며, 각 blocker는 evidence ID로 추적됩니다.” |
| 14초 | **REVIEW** | “최소 diff를 사람이 검토하고 승인합니다.” |
| 20초 | **AFTER** | “조건을 바꾸지 않은 replay의 AFTER는 3/3입니다.” |
| 27초 | **seed** | “통과 조건을 regression seed로 남깁니다.” |
| 33초 | **disclaimer** | “이것은 합성 preflight이며 실제 사용자 연구를 대체하지 않습니다.” |
| 35.32초 | 영상 종료 | “이제 이 증거가 어떻게 팀 작업으로 통합됐는지 보겠습니다.” |

## Slide 6 — 네 PC의 Codex Build Orchestration (4:02–4:47, 45초)

**화면:** 네 lane과 PR 상태.

**대본:**

“이 결과를 네 대의 PC가 역할로 나눠 만들었습니다. PC1은 계약, 아키텍처, 통합, 교차 검토와 캡처를 맡았습니다. PC2는 제품 UI를 맡았고, 현재 E2E가 red라서 PR #3은 아직 병합되지 않았습니다. PC3는 evidence gate, replay 비교, regression seed를 담당했고 PR #1은 병합됐습니다. PC4는 trust-boundary 테스트, release QA, 제출 증거를 맡았고 PR #2는 병합됐습니다. 이 상태를 숨기지 않는 것이 핵심입니다. 작업을 병렬화하더라도 green인 결과만 통합 사실로 말합니다.”

**전환:** “그 신뢰 경계와 검증 범위를 다음 슬라이드에서 분리해 보겠습니다.”

## Slide 7 — 아키텍처, 검증, 신뢰 경계 (4:47–5:37, 50초)

**화면:** Contract → deterministic fixture → human approval → identical replay → Flight Record/seed. 옆에 QA 수치와 금지 경계.

**대본:**

“구조의 중심은 shared contract와 결정론적 fixture입니다. evidence ID가 finding을 지지하고, 사람 승인이 replay의 경계가 되며, 같은 조건의 결과가 Flight Record와 seed로 남습니다. PC4의 병합된 green CI는 unit/component 49개, integration 4개, Chromium E2E 6개를 통과했습니다. 커버리지는 statements 98.85%, branches 94.56%, functions 100%, lines 98.74%이고 lint와 Next production build도 통과했습니다. 그러나 이 검증이 뜻하지 않는 것도 분명합니다. 라이브 OpenAI API 호출은 없고, 실제 저장소 변경도 없고, 검증된 배포 URL도 없습니다. 외부 앱을 실행하는 제품이라고 주장하지 않습니다.”

**전환:** “마지막으로, 지금의 가치와 다음 검증 순서를 명확히 하겠습니다.”

## Slide 8 — 가치, 실현 가능성, 로드맵, 마무리 (5:37–6:27, 50초)

**화면:** `오늘: 재현 가능한 합성 preflight` → `다음: 실제 사용자 연구와 별개로 검증`.

**대본:**

“PersonaFlight의 현재 가치는 한 문장으로 요약됩니다. 출시 전에 명백한 UX 막힘을 evidence, human approval, identical replay로 재현 가능하게 다루는 것입니다. 현재 실현된 범위는 credential-free FocusList 합성 데모입니다. 다음 단계는 이 데모의 성공을 과장하는 것이 아니라, 실제 preview와 실제 연구를 별도로 검증하는 일입니다. 예를 들어 외부 앱 실행, 실제 저장소 변경, 배포 서비스는 아직 검증하지 않았으므로 로드맵의 가설이지 현재 기능이 아닙니다. 합성 preflight도 실제 사용자 조사를 대체하지 않습니다. PersonaFlight는 그 사이의 빈칸을, ‘누가 그럴 것 같다’가 아니라 ‘이 조건에서 막혔고, 승인 뒤 같은 조건에서 통과했다’는 기록으로 채우겠습니다. 감사합니다.”

---

# Appendix — 간결한 Q&A 큐

## A1 — Shared contracts and invariants

**질문:** “왜 정확히 세 조건이며, replay의 공정성은 어떻게 지키나요?”

**답변 큐:** “이 데모의 계약은 한 미션·정확히 세 조건·같은 성공 기준입니다. AFTER에서 조건이나 성공 기준을 바꾸지 않고, evidence ID가 없는 finding은 채택하지 않습니다.”

## A2 — Verification matrix

**질문:** “3/3 외에 무엇을 검증했나요?”

**답변 큐:** “PC4의 병합된 CI에서 49 unit/component, 4 integration, 6 Chromium E2E를 통과했습니다. 커버리지와 lint·Next production build도 수치와 함께 원장에 남겼습니다. 이 검증은 결정론적 데모 범위에 대한 것입니다.”

## A3 — PR integration ledger

**질문:** “네 PC가 모두 병합됐나요?”

**답변 큐:** “아닙니다. PC3 PR #1과 PC4 PR #2만 병합됐습니다. PC2 PR #3은 E2E가 red라 미병합입니다. 발표에서는 미병합 작업을 완료된 통합으로 표현하지 않습니다.”

## A4 — Honest limitations and next milestones

**질문:** “실제 앱에도 바로 적용할 수 있나요?”

**답변 큐:** “아직 아닙니다. 현재는 external-app runner가 아닌 FocusList 합성 데모입니다. live OpenAI API, 실제 repository mutation, 검증된 service URL은 없습니다. 다음 단계에서는 실제 연구를 대체하지 않는다는 경계를 유지한 채, 별도의 검증으로 확장 가능성을 확인해야 합니다.”
