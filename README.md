# PersonaFlight

<p align="center">
  <strong>출시 전에 UX 실패를 증거로 재현하고, 수정과 동일 조건 replay까지 연결하는 프리플라이트 검증 도구</strong>
</p>

<p align="center">
  <a href="https://integration.dha5hxhbe87ff.amplifyapp.com/">Live Demo</a>
  ·
  <a href="#quick-start">Quick Start</a>
  ·
  <a href="#how-we-built-it">How we built it</a>
  ·
  <a href="#mvp-boundary">MVP Boundary</a>
</p>

---

## 한 줄로 말하면

**PersonaFlight는 “이 UX가 불편해 보인다”는 의견을 Flight Record로 바꾸는 도구입니다.**

재현 가능한 조건에서 실패를 확인하고, 근거를 남기고, 최소 수정안을 검토한 뒤, 같은 조건으로 다시 실행해 개선을 증명합니다.

```text
Mission
  → 3 conditions in parallel
  → evidence-backed failure
  → minimal patch proposal
  → human approval
  → identical replay
  → Flight Record + regression seed
```

## 왜 PersonaFlight인가

| 일반적인 UX 피드백 | PersonaFlight |
| --- | --- |
| “사용자가 헷갈릴 것 같아요.” | 어떤 조건에서 어떤 행동이 막혔는지 기록합니다. |
| 수정 제안에서 끝납니다. | 사람 승인 뒤 같은 조건으로 다시 실행합니다. |
| 개선 여부가 주관적입니다. | before / after 결과와 regression seed를 남깁니다. |

사람의 능력을 나이·성별 같은 인구통계로 추정하지 않습니다. 대신 viewport, 입력 방식, 피드백 지연, 문구 해석 부담처럼 **재현 가능한 조건**만 다룹니다.

## 데모에서 보는 흐름

현재 MVP는 `FocusList`의 한 가지 핵심 미션을 끝까지 보여줍니다.

> 새 할 일 **“발표 리허설”**을 Today 목록에 추가한다.

| 단계 | 검증하는 것 |
| --- | --- |
| `01 · PLAN` | 미션과 성공·실패 기준을 먼저 선언합니다. |
| `02 · PARALLEL` | 작은 화면·터치, 지연된 피드백, 모호한 문구의 세 조건을 병렬 실행합니다. |
| `03 · REVIEW` | evidence와 최소 patch diff를 사람이 검토합니다. |
| `04 · INTEGRATE` | 동일 조건 replay 결과와 regression seed를 Flight Record로 남깁니다. |

한 조건이라도 해결되지 않으면 결과를 `CLEARED`로 포장하지 않고 `HOLD` 또는 `PARTIAL`로 표시합니다.

## Quick Start

**Node.js 22.22.2+ 또는 24.15.0+**를 권장합니다.

```bash
git clone https://github.com/sunnn62/Codex-Hackaton-02.git
cd Codex-Hackaton-02
npm ci
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

Windows PowerShell에서 실행 파일 확장자가 필요하면 다음을 사용합니다.

```powershell
npm.cmd ci
npm.cmd run dev
```

## Quality Gates

```bash
npm run lint
npm run test:coverage
npm run test:integration
npm run build
npm run test:e2e:run
```

테스트는 evidence gate, replay comparison, Flight Record round-trip, desktop keyboard flow, mobile touch flow를 다룹니다.

## How We Built It

| 역할 | 책임 | 산출물 |
| --- | --- | --- |
| PC1 · Integrator | 공용 계약, CI, 통합 | 안정적인 제품 계약과 merge 기준 |
| PC2 · Product UI | 랜딩, 프로젝트·페르소나·피드백 UI | 짧은 시간 안에 이해되는 사용자 흐름 |
| PC3 · Replay Engine | evidence gate, before/after comparison | 같은 조건을 보존하는 결정론적 replay |
| PC4 · Release QA | E2E, 데모, 제출물 | 실제 동작을 보이는 검증과 문서 |

이 저장소는 다음의 협업 흔적을 함께 보존합니다.

- [`docs/team/START_HERE.md`](docs/team/START_HERE.md) — 팀 시작 가이드
- [`docs/ORCHESTRATION.md`](docs/ORCHESTRATION.md) — Plan · Parallel · Review · Integrate 전략
- [`docs/WORKFLOW.md`](docs/WORKFLOW.md) — Git·브랜치 협업 규칙

## Structure

```text
src/app/                 Next.js App Router 화면
src/components/          PersonaFlight UI와 Replay Court 인터랙션
src/lib/contracts/       Zod 기반 Flight Record 계약
src/lib/evidence/        evidence gate
src/lib/replay/          before / after 비교와 demo record
src/lib/runner/          URL·행동 안전 정책
tests/unit/              도메인·계약·UI 단위 테스트
tests/integration/       Flight Record round-trip 테스트
tests/e2e/               desktop·mobile 핵심 흐름
docs/                    오케스트레이션·제출·데모 문서
```

## MVP Boundary

FocusList의 evidence → review → identical replay 흐름은 동작하는 제품 vertical slice입니다.

다만 현재 다음 항목은 의도적으로 연결하지 않았습니다.

- 임의 폴더의 파일 업로드·분석
- GitHub 저장소 OAuth 연동 또는 자동 코드 수정
- 외부 Preview URL 크롤링·실행
- 실제 사용자 리서치나 인구집단 예측의 대체

프로젝트 추가와 GitHub·Preview 연결 화면은 이후 확장 방향을 보여주는 UI이며, 해커톤 MVP의 검증 대상은 고정된 FocusList 시나리오입니다.

## Links

- [GitHub Repository](https://github.com/sunnn62/Codex-Hackaton-02)
- [Live Demo · integration](https://integration.dha5hxhbe87ff.amplifyapp.com/)
- [Demo Video](https://drive.google.com/file/d/1FEK9Q9jVVChJHRl7bJb4fbUa7d15tv1R/view?usp=sharing)

---

<p align="center">
  Built by Team 2 with GPT-5 Codex · Hackathon 2026
</p>
