# QA Evidence Assets

`tests/e2e/demo-readiness.spec.ts`는 성공한 Chromium run에서 아래 파일을 생성한다.

- `screenshots/before-evidence-desktop.png`
- `screenshots/after-flight-record-desktop.png`
- `screenshots/after-flight-record-mobile-390x844.png`
- `regression-seed/personaflight-regression-seed.json`

2026-08-16에는 macOS browser sandbox가 Chromium launch를 차단해 실제 product screenshot과 seed download artifact가 생성되지 않았다. 빈 placeholder나 합성 이미지는 제출 증거로 추가하지 않는다. 실행 로그와 release blocker는 `docs/BUILD_LOG.md`에 있다.
