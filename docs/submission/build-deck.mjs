import pptxgen from "pptxgenjs";
import { fileURLToPath } from "node:url";

// Regenerate with:
//   npm install --no-save pptxgenjs
//   node docs/submission/build-deck.mjs
// This deck mirrors the bright, blue PersonaFlight UI used by the current MVP.

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Team 2";
pptx.company = "Codex Hackathon 02";
pptx.subject = "PersonaFlight product presentation";
pptx.title = "PersonaFlight — UX regression, evidenced";
pptx.lang = "ko-KR";
pptx.theme = {
  headFontFace: "Malgun Gothic",
  bodyFontFace: "Malgun Gothic",
  lang: "ko-KR",
};
pptx.defineLayout({ name: "PERSONAFLIGHT", width: 13.333, height: 7.5 });
pptx.layout = "PERSONAFLIGHT";

const OUT = fileURLToPath(new URL("./PersonaFlight_Hackathon_Final.pptx", import.meta.url));
const C = {
  navy: "0A1B33",
  ink: "0F172A",
  muted: "526B93",
  canvas: "F8FAFC",
  white: "FFFFFF",
  border: "E2E8F0",
  blue: "9CB8FA",
  blueDark: "334E68",
  blueSoft: "DCE8FF",
  bluePale: "EFF5FF",
  lavender: "EAE6FF",
  hold: "E96D66",
};

const SH = pptx.ShapeType;
const FONT = "Malgun Gothic";

function rect(slide, x, y, w, h, color, { round = false, line = null } = {}) {
  slide.addShape(round ? SH.roundRect : SH.rect, {
    x, y, w, h,
    rectRadius: round ? 0.08 : undefined,
    fill: { color },
    line: line ? { color: line, width: 0.6 } : { color, transparency: 100 },
  });
}

function circle(slide, x, y, d, color) {
  slide.addShape(SH.ellipse, {
    x, y, w: d, h: d,
    fill: { color }, line: { color, transparency: 100 },
  });
}

function text(slide, value, x, y, w, h, {
  size = 18, color = C.navy, bold = false, align = "left", valign = "mid",
  margin = 0, breakLine = false,
} = {}) {
  slide.addText(value, {
    x, y, w, h, fontFace: FONT, fontSize: size, color, bold,
    margin, breakLine, align, valign, paraSpaceAfterPt: 0,
    fit: "shrink",
  });
}

function label(slide, value, x, y, w = 2, color = C.blueDark) {
  text(slide, value, x, y, w, 0.18, { size: 8.5, color, bold: true });
}

function card(slide, x, y, w, h, color = C.white) {
  rect(slide, x, y, w, h, color, { round: true, line: C.border });
}

function header(slide, eyebrow, title, sub) {
  label(slide, eyebrow, 0.72, 0.50, 3.2);
  text(slide, title, 0.72, 0.79, 11.6, 0.62, { size: 24, color: C.navy, bold: true });
  text(slide, sub, 0.72, 1.48, 11.4, 0.30, { size: 10.5, color: C.muted });
}

function footer(slide, number) {
  rect(slide, 0.72, 7.08, 11.92, 0.01, C.border);
  text(slide, "PersonaFlight · Codex Hackathon 02", 0.72, 7.20, 3.3, 0.12, { size: 7.2, color: C.muted });
  text(slide, String(number).padStart(2, "0"), 12.02, 7.20, 0.42, 0.12, { size: 7.2, color: C.muted, align: "right" });
}

function base() {
  const slide = pptx.addSlide();
  slide.background = { color: C.canvas };
  return slide;
}

// 01 — cover
{
  const s = base();
  rect(s, 0.60, 0.44, 12.13, 6.63, C.white, { round: true, line: C.border });
  rect(s, 0.92, 0.75, 1.48, 0.28, C.blueSoft, { round: true });
  text(s, "PERSONAFLIGHT", 1.08, 0.82, 1.1, 0.10, { size: 7.2, color: C.blueDark, bold: true });
  circle(s, 10.62, 1.20, 1.36, C.blueSoft);
  circle(s, 11.26, 1.72, 0.76, C.lavender);
  circle(s, 10.16, 2.54, 0.44, C.blue);
  text(s, "출시 전 UX 회귀를\n증거로 확인한다", 0.96, 1.72, 7.8, 1.70, { size: 37, color: C.navy, bold: true, breakLine: true });
  text(s, "의견형 AI 리포트가 아닌, 화면 · 행동 · 코드 diff를\n하나의 Flight Record로 남기는 pre-release workspace", 1.00, 3.78, 7.5, 0.63, { size: 14.5, color: C.muted, breakLine: true });
  card(s, 1.00, 5.27, 4.20, 1.08, C.bluePale);
  label(s, "THE DEMO", 1.28, 5.54, 1.3);
  text(s, "FocusList · 3 conditions · replay verdict", 1.28, 5.84, 3.55, 0.20, { size: 11.5, color: C.navy, bold: true });
  text(s, "TEAM 2  ·  Codex Hackathon 02", 1.00, 6.63, 3.0, 0.14, { size: 7.5, color: C.muted });
}

// 02 — problem
{
  const s = base();
  header(s, "WHY", "AI 피드백은 쉽게 나오지만, 출시 판정은 남지 않는다", "같은 조건에서 무엇이 바뀌었는지 확인할 수 있어야 팀이 다시 판단할 수 있습니다.");
  const cols = [0.72, 4.86, 9.00];
  const content = [
    ["BEFORE", "“좋아 보입니다”", "· 재현 조건 없음\n· 근거가 흩어짐\n· 다음 배포에서 다시 확인 불가", C.white, C.muted],
    ["PERSONAFLIGHT", "판정 가능한 기록", "· 동일한 페르소나와 조건\n· 화면 · 행동 · 코드 근거\n· replay 가능한 Flight Record", C.bluePale, C.blueDark],
    ["OUTCOME", "출시 전\n합의 가능한 verdict", "pass · no-change · regressed\npartial은 불확실성을 숨기지 않습니다.", C.white, C.muted],
  ];
  content.forEach(([eyebrow, title, body, fill, accent], i) => {
    card(s, cols[i], 2.67, 3.65, 3.16, fill);
    label(s, eyebrow, cols[i] + 0.28, 2.98, 1.8, accent);
    text(s, title, cols[i] + 0.28, 3.40, 2.90, 0.58, { size: 20, bold: true, breakLine: true });
    text(s, body, cols[i] + 0.28, 4.24, 2.95, 1.05, { size: 12.5, color: C.muted, breakLine: true });
  });
  footer(s, 2);
}

// 03 — flow
{
  const s = base();
  header(s, "PRODUCT FLOW", "프로젝트를 선택하고, 같은 조건으로 다시 비행합니다", "현재 MVP의 고정 데모 시나리오: FocusList에서 세 가지 fault condition을 비교합니다.");
  const steps = [
    ["01", "PROJECT", "FocusList\n데모 시나리오 선택", C.white],
    ["02", "PERSONA", "Touch · Patience ·\nInference를 가진 사용자", C.white],
    ["03", "SESSION", "동일 task와 condition으로\n피드백 기록", C.bluePale],
    ["04", "REPLAY", "before / after evidence로\nverdict 확인", C.white],
  ];
  steps.forEach(([n, title, body, fill], i) => {
    const x = 0.72 + i * 3.07;
    card(s, x, 3.12, 2.65, 2.10, fill);
    text(s, n, x + 0.28, 3.42, 0.42, 0.15, { size: 8.5, color: C.blueDark, bold: true });
    text(s, title, x + 0.28, 3.83, 2.0, 0.23, { size: 13.5, bold: true });
    text(s, body, x + 0.28, 4.38, 2.05, 0.58, { size: 10.5, color: C.muted, breakLine: true });
    if (i < 3) text(s, "→", x + 2.68, 4.02, 0.36, 0.25, { size: 17, color: C.muted, align: "center" });
  });
  rect(s, 0.72, 5.73, 11.92, 0.60, C.navy, { round: true });
  text(s, "핵심: ‘다른 테스트’가 아니라, 같은 mission · 같은 condition을 유지한 증거 비교", 1.00, 5.93, 11.2, 0.19, { size: 12.5, color: C.white, bold: true });
  footer(s, 3);
}

// 04 — UI language
{
  const s = base();
  header(s, "CURRENT UI", "밝고 차분한 workspace, 복잡한 판정은 카드 안으로", "현재 PersonaFlight의 블루 UI 언어를 발표자료에도 그대로 이어갑니다.");
  card(s, 0.72, 2.56, 11.92, 3.80, C.white);
  text(s, "PersonaFlight", 1.02, 2.92, 2.25, 0.22, { size: 16, bold: true });
  rect(s, 9.58, 2.83, 2.10, 0.39, C.navy, { round: true });
  text(s, "새 비행 시작", 9.83, 2.97, 1.52, 0.12, { size: 8.5, color: C.white, bold: true, align: "center" });
  text(s, "출시 전에, 실제 사용 조건에서 다시 확인하세요.", 1.02, 3.47, 7.9, 0.34, { size: 19, bold: true });
  text(s, "프로젝트 · 페르소나 · replay 기록을 한 작업 공간에서 연결합니다.", 1.02, 3.98, 7.9, 0.22, { size: 10.5, color: C.muted });
  const uiCards = [
    [1.02, "DEMO PROJECT", "FocusList", "준비된 scenario로 바로 시작", C.bluePale, C.blueDark],
    [4.60, "PERSONA", "3 사용자 관점", "touch · patience · inference", C.white, C.muted],
    [8.18, "REPLAY RECORD", "evidence required", "판정의 이유까지 함께 남김", C.blueSoft, C.blueDark],
  ];
  uiCards.forEach(([x, e, title, body, fill, accent]) => {
    card(s, x, 4.63, 3.30, 1.32, fill);
    label(s, e, x + 0.25, 4.88, 1.7, accent);
    text(s, title, x + 0.25, 5.18, 2.70, 0.22, { size: 14, bold: true });
    text(s, body, x + 0.25, 5.66, 2.72, 0.13, { size: 8.7, color: C.muted });
  });
  footer(s, 4);
}

// 05 — demo
{
  const s = base();
  header(s, "90-SECOND DEMO", "FocusList를 세 조건에서 재현하고, 결과를 Flight Record로 남깁니다", "데모는 실제 UI 흐름을 따라가며, 마지막에 evidence가 부족하면 HOLD로 멈춥니다.");
  const conditions = [
    ["Condition 1", "Touch-only", "Small viewport\n터치 입력만", C.bluePale],
    ["Condition 2", "Low patience", "Delayed feedback\n낮은 인내도", C.white],
    ["Condition 3", "Reduced inference", "Ambiguous copy\n낮은 추론", C.white],
  ];
  conditions.forEach(([eyebrow, title, body, fill], i) => {
    const x = 0.72 + i * 3.73;
    card(s, x, 2.91, 3.44, 1.92, fill);
    label(s, eyebrow, x + 0.28, 3.20, 1.4);
    text(s, title, x + 0.28, 3.63, 2.76, 0.24, { size: 15.5, bold: true });
    text(s, body, x + 0.28, 4.10, 2.75, 0.44, { size: 10.2, color: C.muted, breakLine: true });
  });
  card(s, 0.72, 5.25, 11.92, 1.05, C.navy);
  label(s, "FLIGHT RECORD", 1.00, 5.54, 1.45, C.blueSoft);
  text(s, "화면 + 행동 + 코드 diff + 동일 조건 → verdict", 1.00, 5.87, 7.90, 0.20, { size: 14.2, color: C.white, bold: true });
  rect(s, 10.08, 5.55, 1.85, 0.50, C.hold, { round: true });
  text(s, "HOLD · evidence required", 10.20, 5.73, 1.62, 0.14, { size: 7.8, color: C.white, bold: true, align: "center" });
  footer(s, 5);
}

// 06 — orchestration
{
  const s = base();
  header(s, "CODEX ORCHESTRATION", "사람이 결정하고, Codex가 병렬 구현·검증을 맡았습니다", "오늘의 협업 기록 자체가 제품 신뢰성의 일부가 되도록 역할과 통합 지점을 분리했습니다.");
  const roles = [
    ["PC1", "Tech Lead", "공용 계약 · API 조립 · 최종 통합", C.white],
    ["PC2", "UX / Flight Record UI", "블루 workspace · 반응형 UI · 애니메이션", C.bluePale],
    ["PC3", "Evidence / Replay", "3 conditions · evidence gate · verdict", C.white],
    ["PC4", "QA / Demo", "E2E · 접근성 · 발표 자료 · 영상", C.blueSoft],
  ];
  roles.forEach(([pc, role, scope, fill], i) => {
    const x = 0.72 + i * 3.07;
    card(s, x, 2.98, 2.65, 2.20, fill);
    text(s, pc, x + 0.26, 3.28, 0.55, 0.16, { size: 9.5, color: C.blueDark, bold: true });
    text(s, role, x + 0.26, 3.70, 2.10, 0.40, { size: 13, bold: true, breakLine: true });
    text(s, scope, x + 0.26, 4.50, 2.10, 0.45, { size: 9.6, color: C.muted, breakLine: true });
  });
  const modes = [["PLAN", "요구사항 분리"], ["PARALLEL", "독립 branch / worktree"], ["REVIEW", "테스트와 PR 피드백"], ["INTEGRATE", "integration에서 데모"]];
  modes.forEach(([mode, detail], i) => {
    const x = 0.72 + i * 2.48;
    text(s, mode, x, 5.86, 1.85, 0.16, { size: 8.7, color: C.blueDark, bold: true });
    text(s, detail, x, 6.15, 2.20, 0.14, { size: 8.7, color: C.muted });
  });
  footer(s, 6);
}

// 07 — trust and MVP boundary
{
  const s = base();
  header(s, "TRUST, WITH HONEST BOUNDARIES", "작동하는 핵심 흐름과 MVP의 경계를 함께 보여줍니다", "데모에서 보이는 것만 약속하고, 다음 단계는 Flight Record를 실제 프로젝트에 연결하는 일입니다.");
  card(s, 0.72, 2.83, 5.62, 3.12, C.bluePale);
  label(s, "WHAT WORKS NOW", 1.00, 3.13, 1.85);
  text(s, "FocusList vertical demo", 1.00, 3.56, 4.40, 0.28, { size: 17.5, bold: true });
  text(s, "· 프로젝트 선택 → persona → feedback → replay\n· 세 fault condition을 같은 mission으로 비교\n· evidence가 부족하면 verdict를 확정하지 않음", 1.00, 4.18, 4.65, 1.08, { size: 11.4, color: C.muted, breakLine: true });
  card(s, 7.00, 2.83, 5.64, 3.12, C.white);
  label(s, "MVP BOUNDARY", 7.28, 3.13, 1.65, C.muted);
  text(s, "다음 Flight", 7.28, 3.56, 4.10, 0.28, { size: 17.5, bold: true });
  text(s, "· 외부 폴더와 GitHub 연결은 현재 안내 UI\n· 실제 프로젝트에서 자동 evidence 수집 확장\n· 팀별 배포 전 replay를 기본 workflow로", 7.28, 4.18, 4.65, 1.08, { size: 11.4, color: C.muted, breakLine: true });
  footer(s, 7);
}

// 08 — close
{
  const s = base();
  rect(s, 0.60, 0.44, 12.13, 6.63, C.navy, { round: true });
  rect(s, 0.94, 0.80, 1.82, 0.29, C.blueDark, { round: true });
  text(s, "PERSONAFLIGHT", 1.12, 0.87, 1.35, 0.11, { size: 7.2, color: C.white, bold: true });
  text(s, "출시 전에는,\n느낌 대신 기록으로 확인합니다.", 1.00, 1.74, 8.10, 1.38, { size: 32, color: C.white, bold: true, breakLine: true });
  text(s, "Project → Persona → Session → Flight Record", 1.03, 3.72, 7.70, 0.22, { size: 14, color: C.blueSoft, bold: true });
  text(s, "같은 조건을 다시 비행하고,\n누구나 근거를 보고 배포를 결정할 수 있게.", 1.03, 4.33, 6.55, 0.62, { size: 14.5, color: C.white, breakLine: true });
  card(s, 9.32, 4.58, 2.50, 1.10, C.bluePale);
  label(s, "TEAM 2", 9.62, 4.86, 1.0);
  text(s, "Thank you", 9.62, 5.25, 1.75, 0.24, { size: 16.5, bold: true });
  text(s, "GitHub · Demo · Deck", 1.00, 6.53, 2.52, 0.15, { size: 7.7, color: C.blueSoft });
}

await pptx.writeFile({ fileName: OUT });
console.log(`Created ${OUT}`);
