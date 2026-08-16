# Submission Checklist

체크 표시에는 실제 파일, URL, 명령 결과가 있어야 합니다. “될 것 같다”는 완료가 아닙니다.

## 동작하는 MVP

- [x] 준비된 mission 한 개
- [x] 정확히 세 개의 공개 fault condition
- [x] before screen/action evidence와 evidence ID
- [x] Codex 최소 patch diff
- [x] human approval 경계
- [x] 동일 mission·condition replay
- [x] before/after Flight Record
- [x] partial replay는 `CLEARED`가 아닌 `HOLD`
- [x] regression seed 다운로드
- [x] API key와 계정 없는 demo mode
- [x] synthetic evidence disclaimer
- [x] Flight Record integration test
- [x] Playwright desktop keyboard + mobile touch critical-flow E2E

## 품질

- [x] unit/component 27 tests pass
- [x] lint exit 0
- [x] statements 96.77%, branches 90.27%, functions 100%, lines 96.52%
- [x] production build 성공
- [x] desktop browser 핵심 흐름 확인
- [x] 390×844 horizontal overflow 없음
- [x] browser warning/error 0
- [x] 실제 secret 없음
- [x] 원격 이력 통합 후 위 모든 명령 재실행
- [ ] 배포 URL을 다른 PC에서 검증

## GitHub와 Orchestration

- [x] `integration` local branch 준비
- [x] PC1 baseline commits 준비
- [x] PC2·PC3·PC4 역할·branch·모델·prompt 문서
- [x] PR template
- [x] CI workflow
- [x] GitHub 인증 복구
- [x] `origin/integration` baseline push
- [x] baseline full SHA 팀 공유: `b24efb6ef2177c43e426a8346a0cdfa30ab59dff`
- [ ] PC2 Draft PR
- [ ] PC3 Draft PR
- [ ] PC4 Draft PR
- [ ] Replay → UI → QA 병합
- [ ] 최종 `integration → main` PR
- [ ] main CI green URL

## 제출 문서

- [x] `README.md`
- [x] `docs/BUILD_LOG.md` 초안과 실제 PC1 evidence
- [x] `docs/VALUE_AND_VIABILITY.md`
- [x] `docs/DEMO_SCRIPT.md`
- [x] `docs/SUBMISSION_CHECKLIST.md`
- [ ] Build Log의 TODO를 실제 PR/SHA/CI URL로 교체
- [x] 최종 desktop/mobile screenshot (`docs/assets/`)
- [ ] 3분 demo video 촬영
- [ ] 영상 업로드
- [ ] 다른 PC에서 영상 재생 검증

## 최종 제출 링크

- GitHub: https://github.com/sunnn62/Codex-Hackaton-02
- Service: **TODO**
- Demo video: **TODO**
- Green integration baseline: [`8f286efd8727c3404f576267b3ea05d9dfac8115`](https://github.com/sunnn62/Codex-Hackaton-02/commit/8f286efd8727c3404f576267b3ea05d9dfac8115)
- CI run: [PersonaFlight CI #31930156060](https://github.com/sunnn62/Codex-Hackaton-02/actions/runs/31930156060)

## 제출 5분 전

- [ ] 모든 URL을 시크릿/로그아웃 창에서 열어봄
- [ ] 저장소가 심사위원에게 접근 가능함
- [ ] README 첫 화면에서 실행법과 차별점이 보임
- [ ] 서비스가 새로고침 후에도 열림
- [ ] 영상 음성과 화면이 정상 재생됨
- [ ] TODO, placeholder, 로컬 경로가 제출 본문에 남지 않음
- [ ] synthetic disclaimer가 제거되지 않음
