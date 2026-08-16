# 팀원 공통 시작 안내

환영합니다. 이 저장소는 PersonaFlight Replay Court 해커톤 MVP입니다. 네 명이 같은 파일을 동시에 고치면 통합 시간이 사라지므로, 각 PC는 자기 가이드의 파일만 수정하고 Pull Request로 PC1에게 전달합니다.

## 먼저 PC1에게 받을 것

작업을 시작하기 전에 PC1에게 아래 두 값을 받으세요.

1. GitHub 저장소: `https://github.com/sunnn62/Codex-Hackaton-02`
2. 기준 commit SHA: PC1이 `integration`에 push한 정확한 SHA

SHA를 받기 전에 코드를 작성하지 마세요. 네 명이 같은 시작점에서 출발했다는 사실이 Codex Build Log의 Parallel 증거가 됩니다.

## 1. GitHub 계정과 이 저장소 연결

PC1은 GitHub 저장소의 **Settings → Collaborators**에서 PC2, PC3, PC4의 GitHub 계정을 초대합니다. 팀원은 이메일 또는 GitHub 알림에서 초대를 수락해야 push와 Pull Request가 가능합니다.

각 PC에서 PowerShell을 열고 아래 명령을 실행하세요.

```powershell
git --version
node --version
gh --version
gh auth login -h github.com -p https -w
gh auth status
```

`gh auth login`을 실행하면 브라우저가 열립니다. GitHub에 로그인하고 표시된 인증 요청을 승인하세요. 토큰이나 비밀번호를 Codex 채팅, 코드, 문서에 붙여넣지 마세요. 마지막 `gh auth status`에서 `Logged in to github.com`이 보이면 연결된 것입니다.

`gh` 명령을 찾을 수 없다면 [GitHub CLI 설치 페이지](https://cli.github.com/)에서 Windows용 GitHub CLI를 설치한 뒤 PowerShell을 새로 여세요.

## 2. 저장소 clone과 Git 사용자 확인

Windows PowerShell 기준입니다.

```powershell
Set-Location $HOME\Documents
git clone https://github.com/sunnn62/Codex-Hackaton-02.git
Set-Location Codex-Hackaton-02
git fetch origin
git config user.name
git config user.email
npm.cmd install
```

이름이나 이메일이 비어 있으면 이 저장소에만 다음처럼 설정하세요.

```powershell
git config user.name "내 GitHub 이름"
git config user.email "내 GitHub 이메일"
```

## 3. Codex와 clone 폴더 연결

1. Codex 데스크톱 앱에서 새 task를 만듭니다.
2. 작업 위치에서 **Local**을 선택합니다.
3. 방금 clone한 `Codex-Hackaton-02` 폴더를 선택합니다.
4. 터미널에서 `git status`를 실행해 저장소가 맞는지 확인합니다.
5. 자기 PC 가이드에 적힌 모델과 reasoning effort를 선택합니다.
6. 새 task의 첫 메시지에 자기 가이드의 “Codex에 붙여넣을 프롬프트”를 그대로 넣습니다.

GitHub와 Codex를 별도 플러그인으로 연결할 필요는 없습니다. Codex가 로컬 clone을 수정하고, 같은 PC에서 로그인된 `git`/`gh`가 commit, push, PR을 담당합니다.

네 PC가 물리적으로 분리되어 있으므로 각자 clone이 이미 격리 공간입니다.

## 공통 Codex 설정

- 파일 권한: 현재 저장소만 쓰기 허용
- 네트워크: npm 설치와 GitHub push에만 허용
- 자동 승인: 외부 배포, 삭제, 결제, secret 변경은 허용하지 않기
- 채팅: 역할별 주 작업 채팅 하나 유지
- 모든 프롬프트 첫 줄: `AGENTS.md를 먼저 읽고 준수해.`

## 절대 지킬 것

- `main`과 `integration`에 직접 push하지 않습니다.
- 다른 PC가 소유한 파일을 고치지 않습니다.
- API key, 비밀번호, 토큰을 코드나 스크린샷에 넣지 않습니다.
- 행동 변화는 테스트를 먼저 작성하고 RED 결과를 확인합니다.
- “AI가 그랬다”가 아니라 commit, test, screenshot을 증거로 남깁니다.
- 나이와 성별로 사용자의 능력을 추측하는 문구를 추가하지 않습니다.

## 팀별 문서

- PC1: `docs/team/PC1_INTEGRATOR_GUIDE.md`
- PC2: `docs/team/PC2_UI_GUIDE.md`
- PC3: `docs/team/PC3_REPLAY_GUIDE.md`
- PC4: `docs/team/PC4_QA_GUIDE.md`

각 문서를 처음부터 끝까지 읽고, 안에 있는 프롬프트를 새 Codex 채팅에 그대로 붙여넣으세요.

## 연결 문제 빠른 해결

- `Repository not found`: 저장소 주소를 확인하고 Collaborator 초대를 수락했는지 확인합니다.
- `Permission denied` 또는 push 403: `gh auth status`를 확인하고, 필요하면 `gh auth login -h github.com -p https -w`를 다시 실행합니다.
- 잘못된 GitHub 계정으로 로그인됨: `gh auth logout -h github.com` 후 다시 로그인합니다.
- `npm.cmd install` 실패: 오류 전문을 복사해 자기 Codex task에 전달하고 임의로 package 버전을 바꾸지 않습니다.
- 브랜치 이름이 다름: 파일을 수정하지 말고 `git branch --show-current` 결과를 PC1에게 보냅니다.
