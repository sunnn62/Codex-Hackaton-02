# PC1 가이드 — Integrator / Contract Owner

PC1은 가장 많은 기능을 직접 만드는 사람이 아니라, 네 명의 결과가 **한 제품으로 실제 작동하도록 만드는 통합 책임자**입니다. 공용 계약을 고정하고, 모든 PC가 같은 시작점에서 출발하게 하며, PR을 검토하고, 최종 데모가 거짓 없이 통과하는지 증명합니다.

## 1. 지금 가장 먼저 할 일

1. GitHub 로그인을 복구합니다.
2. 로컬 기준 브랜치를 `integration`으로 준비합니다.
3. 테스트, 린트, 빌드를 통과시킵니다.
4. 기준 commit을 `origin/integration`에 push합니다.
5. 정확한 commit SHA와 역할별 문서 링크를 PC2, PC3, PC4에게 공유합니다.

GitHub 인증:

```powershell
gh auth login -h github.com -p https -w
gh auth status
```

브라우저에서 인증을 승인하세요. 토큰을 채팅에 붙여넣지 않습니다.

## 2. PC1 소유 범위

PC1이 수정하고 결정하는 파일:

- `src/lib/contracts/**`
- `src/lib/server/**`
- `src/app/api/**`
- `.github/**`
- root 설정 파일
- `AGENTS.md`
- 병합 충돌 해결

PC2의 UI, PC3의 replay engine, PC4의 E2E·제출 문서는 각 담당자가 PR로 보냅니다. 긴급 버그라도 먼저 담당자에게 재현 증거를 전달하고, PC1이 직접 고쳤다면 Build Log에 이유를 남깁니다.

## 3. 기준 브랜치 만들기와 공유

저장소 루트 PowerShell에서 실행합니다.

```powershell
git status --short
git branch --show-current
git remote -v
git remote add origin https://github.com/sunnn62/Codex-Hackaton-02.git
git branch -M integration
npm.cmd run test
npm.cmd run lint
npm.cmd run build
git push -u origin integration
git rev-parse HEAD
```

이미 `origin`이 있다면 `git remote add origin ...`은 실행하지 않습니다. 대신 아래로 주소를 확인합니다.

```powershell
git remote get-url origin
```

마지막 `git rev-parse HEAD`의 40자리 SHA를 팀 채팅에 공유합니다. 예시:

```text
PersonaFlight baseline 준비 완료
Repo: https://github.com/sunnn62/Codex-Hackaton-02
Base branch: integration
Baseline SHA: 여기에 실제 40자리 SHA

공통 시작: docs/team/START_HERE.md
PC2: docs/team/PC2_UI_GUIDE.md
PC3: docs/team/PC3_REPLAY_GUIDE.md
PC4: docs/team/PC4_QA_GUIDE.md

각자 SHA에서 자기 브랜치를 만든 뒤 첫 commit SHA를 알려주세요.
```

## 4. PC1 Codex 설정

- 모델: `gpt-5.6-sol`
- Reasoning effort: `xhigh`
- 작업 위치: clone한 저장소의 Local 폴더
- 파일 권한: 현재 저장소 쓰기 허용
- 네트워크: npm과 GitHub 작업에 필요한 범위만 허용
- 자동 승인 금지: 삭제, secret 변경, 외부 배포, 결제

## 5. PC1이 Codex에 붙여넣을 프롬프트

```text
AGENTS.md와 docs/ORCHESTRATION.md를 먼저 끝까지 읽고 준수해.

나는 PC1 Integrator다. 현재 저장소, 브랜치, git status, remote를 먼저 확인해. 내가 소유한 범위는 src/lib/contracts/**, src/lib/server/**, src/app/api/**, root 설정, .github/**, AGENTS.md, 그리고 병합 충돌 해결이다. PC2 UI, PC3 replay engine, PC4 QA/제출 문서의 소유 파일을 선제적으로 수정하지 마라.

제품 계약은 다음과 같다.
- 한 개의 준비된 mission
- 정확히 세 개의 비인구통계적 fault condition
- screen/action evidence가 연결된 finding만 허용
- Codex 최소 patch diff 제안
- 사람 승인 후에만 replay
- before와 after는 동일한 mission과 condition을 사용
- partial 또는 infrastructure failure를 full pass로 표시하지 않음
- demo mode는 API key 없이 작동
- synthetic evidence가 실제 사용자 조사나 인구집단 예측을 대체하지 않는다고 명시

먼저 실행 계획을 보여준 뒤 진행해. 모든 행동 변경은 테스트를 먼저 작성하고 실제 RED를 확인한 후 최소 구현으로 GREEN을 만들어. 결과를 승인할 때는 명령, exit code, test 개수, 파일 경로로 증명해. hardcoded secret, 무근거 성공 주장, 임의 URL 실행, 자동 live code mutation은 금지한다.

병합 요청이 오면 PR마다 다음을 확인해.
1. 담당 파일 범위를 넘지 않았는가
2. baseline SHA에서 출발했는가
3. 행동 변화에 RED/GREEN 증거가 있는가
4. evidence → patch → human approval → identical replay 흐름을 약화시키지 않았는가
5. demo가 credential 없이 동작하는가
6. test, lint, build가 실제로 통과하는가

병합 순서는 PC3 Replay → PC2 UI → PC4 QA다. 각 병합 뒤 전체 test와 build를 다시 실행한다. 완료 보고에는 commit SHA, 변경 파일, 검증 결과, 남은 위험, 다음 병합 순서를 포함해.
```

## 6. PR을 받았을 때의 검토 순서

PC3 → PC2 → PC4 순서로 받습니다. GitHub PR 화면에서 base가 `integration`인지 확인하세요.

각 PR마다:

1. PR 설명과 소유 파일을 확인합니다.
2. Draft 상태에서 변경 파일과 테스트 증거를 검토합니다.
3. 담당자가 최신 `integration`을 반영하도록 요청합니다.
4. 충돌이 없고 검증이 끝난 PR만 Ready로 바꿉니다.
5. 병합 직후 PC1 로컬에서 아래 검증을 실행합니다.

```powershell
git switch integration
git pull --ff-only origin integration
npm.cmd run test
npm.cmd run lint
npm.cmd run build
```

PC4의 E2E가 들어온 뒤에는 추가로 실행합니다.

```powershell
npm.cmd run test:integration
npm.cmd run test:e2e
npm.cmd run test:coverage
```

실패한 명령을 성공으로 기록하지 않습니다. 원인, 담당 PC, 재현 명령을 남기고 해당 PR을 멈춥니다.

## 7. PC1의 4시간 체크포인트

- 0:00–0:25: baseline 검증, push, SHA와 가이드 공유
- 0:25–1:40: 계약 질문 답변, 각 branch/첫 RED 확인
- 1:40–2:30: PC3 Replay PR 검토·병합, PC2 UI PR 검토·병합
- 2:30–3:10: PC4 QA PR 검토·병합, 전체 gate 실행
- 3:10–3:40: 브라우저 시연, 모바일 화면, 다운로드 artifact 확인
- 3:40–4:00: 영상, Build Log, Value & Viability, 제출 링크 최종 확인

## 8. PC1 최종 합격 기준

- 처음 clone한 환경에서 API key 없이 실행된다.
- 화면에서 Mission → 3 conditions → BEFORE evidence → patch review → human approval → identical replay → Flight Record가 이어진다.
- before/after 결과는 실제 record에서 계산되며 partial failure를 CLEARED로 속이지 않는다.
- desktop과 390×844 화면에서 핵심 버튼과 상태가 보인다.
- 테스트, 린트, 빌드, E2E, coverage의 최신 결과가 있다.
- GitHub PR과 commit SHA가 Build Log에 실제 값으로 기록된다.
- 데모 영상과 서비스 URL이 실제로 열리는지 다른 PC에서 확인한다.

## 9. 바로 팀에 보낼 한 줄

`docs/team/START_HERE.md를 먼저 읽고 GitHub·Codex 연결을 완료한 뒤, 자기 PC 가이드의 브랜치와 프롬프트만 사용해주세요. 연결이 끝나면 gh auth status, git branch --show-current, git rev-parse HEAD 결과를 PC1에게 보내주세요.`
