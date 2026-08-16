# Team Workflow

## Goal

- `main` 브랜치는 언제든 데모 가능한 상태로 유지합니다.
- 작은 기능 단위로 나누어 4명이 병렬로 작업합니다.
- Codex는 계획 수립, 구현 보조, 리뷰 및 테스트에 활용합니다.

## Branch rules

- `main`에 직접 push하지 않습니다.
- 작업 전 최신 `main`을 받아 기능 브랜치를 만듭니다.
- 브랜치 이름은 아래 형식을 사용합니다.

```text
feat/기능명
fix/수정명
docs/문서명
```

예시:

```text
feat/login
feat/main-page
fix/mobile-layout
```

## Working flow

1. 팀이 Codex Plan으로 MVP와 구현 순서를 합의합니다.
2. 각자 맡은 기능의 브랜치를 생성해 작업합니다.
3. 작업이 끝나면 PR을 만들고 팀원 1명 이상이 확인합니다.
4. 리뷰와 기본 동작 확인 후 `main`에 병합합니다.
5. 병합 뒤 핵심 사용자 흐름을 함께 점검합니다.

## Commit messages

아래 형식으로 간결하게 작성합니다.

```text
feat: 로그인 화면 구현
fix: 모바일 메뉴 레이아웃 수정
docs: 협업 규칙 추가
```

## Issues

이슈는 필수가 아닙니다. 시간이 허용되면 핵심 기능 단위로만 만들고, 그렇지 않으면 브랜치와 PR 제목으로 작업 단위를 명확히 합니다.

## Codex collaboration record

- **Plan**: MVP, 역할 분담, 구현 순서를 함께 정합니다.
- **Parallel**: 기능별 브랜치로 나누어 병렬 구현합니다.
- **Review**: PR 리뷰와 동작 검증으로 결과를 확인합니다.
- **Integrate**: 검토된 기능을 `main`에 병합해 하나의 사용자 흐름으로 완성합니다.
