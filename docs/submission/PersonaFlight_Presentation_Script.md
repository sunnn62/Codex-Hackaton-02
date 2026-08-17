# PersonaFlight 발표 스크립트

약 4분 기준의 8장 발표 자료입니다. 발표는 현재 integration UI의 밝은 블루 workspace와 FocusList 데모 흐름을 기준으로 합니다.

## 1. PersonaFlight — 출시 전 UX 회귀를 증거로 확인한다

"안녕하세요, Team 2의 PersonaFlight입니다. PersonaFlight는 출시 전에 UX가 실제로 좋아졌는지를 의견이 아니라 증거로 확인하는 workspace입니다. 오늘은 FocusList라는 고정 시나리오를 통해, 같은 조건에서 재현하고 Flight Record로 남기는 흐름을 보여드리겠습니다."

## 2. 왜 필요한가

"AI에게 피드백을 받으면 '좋아 보인다'는 답은 빠르게 얻을 수 있습니다. 하지만 그 피드백에는 어떤 사용 조건에서, 어떤 화면을 보고, 어떤 행동을 했는지가 남지 않는 경우가 많습니다. PersonaFlight는 이 빈 곳을 채웁니다. 같은 조건과 근거를 남겨서, 팀이 다음 배포에서도 다시 판단할 수 있게 합니다."

## 3. 제품 흐름

"흐름은 네 단계입니다. 먼저 프로젝트를 고르고, 사용자 페르소나를 선택합니다. 다음으로 같은 task와 condition에서 세션을 기록하고, 마지막으로 before와 after의 evidence를 replay합니다. 중요한 것은 매번 다른 테스트를 하는 것이 아니라, 같은 mission과 condition을 유지하는 것입니다."

## 4. 현재 UI

"현재 UI는 밝고 차분한 workspace입니다. 데모 프로젝트, 페르소나, replay 기록을 카드로 나누어 처음 보는 사람도 흐름을 따라갈 수 있게 했습니다. 복잡한 판정 로직은 화면 뒤에 두고, 사용자는 지금 무엇을 시작하고 무엇이 기록됐는지에만 집중합니다."

## 5. FocusList 데모

"데모에서는 FocusList를 세 가지 조건으로 봅니다. 작은 화면에서 터치만 가능한 사용자, 느린 피드백을 기다리기 어려운 사용자, 문구를 적게 추론하는 사용자입니다. 이 세션을 replay한 뒤에는 화면, 행동, 코드 diff와 condition을 하나의 Flight Record에 남깁니다. 근거가 모자라면 성공이라고 단정하지 않고 HOLD로 멈춥니다."

## 6. Codex와의 협업

"이번 해커톤에서는 역할을 네 PC로 나눴습니다. PC1은 계약과 통합, PC2는 UI, PC3은 evidence와 replay, PC4는 QA와 데모를 담당했습니다. 사람은 제품의 판단 기준과 우선순위를 정하고, Codex는 각 branch에서 구현과 테스트를 병렬로 진행했습니다. 이후 review와 integration 단계에서 서로의 결과를 다시 확인했습니다."

## 7. 지금 되는 것과 MVP 경계

"현재 FocusList의 세로 데모는 프로젝트 선택부터 persona, feedback, replay까지 동작합니다. 동시에 MVP 경계도 분명히 합니다. 외부 폴더와 GitHub 연결은 지금 안내 UI 단계이며, 다음 단계에서는 실제 프로젝트에서 evidence를 자동으로 수집하고 팀별 pre-release workflow로 확장할 계획입니다."

## 8. 마무리

"PersonaFlight의 목표는 단순합니다. 출시 전에는 느낌 대신 기록으로 확인하자는 것입니다. 같은 조건을 다시 비행하고, 누구나 근거를 보고 배포를 결정할 수 있게 만들겠습니다. 감사합니다."
