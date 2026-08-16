import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const W = 1280;
const H = 720;
const ROOT = "C:/Users/yenac/Documents/Codex/2026-08-16/new-chat";
const OUT = `${ROOT}/outputs/PersonaFlight_Hackathon_Final.pptx`;
const RENDER = `${ROOT}/work/presentation-final/rendered`;
const ASSET = `${ROOT}/work/presentation-final/frames`;
const QA = `${ROOT}/outputs/qa-artifacts`;

const C = {
  ink: "#08152B",
  ink2: "#102345",
  paper: "#F5F7FA",
  white: "#FFFFFF",
  lime: "#D9FF57",
  blue: "#72A7FF",
  cyan: "#80E1FF",
  coral: "#FF806C",
  muted: "#9AABC4",
  darkMuted: "#52647E",
  rule: "#D6DEEA",
  success: "#4DE2A6",
};

const sources = {
  repo: "https://github.com/sunnn62/Codex-Hackaton-02",
  pr1: "https://github.com/sunnn62/Codex-Hackaton-02/pull/1",
  pr2: "https://github.com/sunnn62/Codex-Hackaton-02/pull/2",
  pr3: "https://github.com/sunnn62/Codex-Hackaton-02/pull/3",
  ci2: "https://github.com/sunnn62/Codex-Hackaton-02/actions/runs/31935260097",
};

function rect(slide, x, y, w, h, fill, radius = 0, line = "none", width = 0) {
  return slide.shapes.add({
    geometry: radius ? "roundRect" : "rect",
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { style: "solid", fill: line, width },
    ...(radius ? { borderRadius: radius } : {}),
  });
}

function textBox(slide, value, x, y, w, h, size, options = {}) {
  const box = slide.shapes.add({
    geometry: "textbox",
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  box.text = value;
  box.text.style = {
    fontSize: size,
    typeface: options.typeface ?? "Malgun Gothic",
    bold: options.bold ?? false,
    color: options.color ?? C.ink,
    alignment: options.align ?? "left",
    verticalAlignment: options.valign ?? "top",
    autoFit: "shrinkText",
    insets: options.insets ?? { top: 0, right: 0, bottom: 0, left: 0 },
  };
  return box;
}

function pill(slide, value, x, y, w, fill = C.lime, color = C.ink) {
  rect(slide, x, y, w, 32, fill, 16);
  textBox(slide, value, x + 8, y + 4, w - 16, 22, 12, { bold: true, color, align: "center", valign: "middle" });
}

function line(slide, x, y, w, color = C.rule, weight = 1) {
  slide.shapes.add({
    geometry: "line",
    position: { left: x, top: y, width: w, height: 0 },
    fill: "none",
    line: { style: "solid", fill: color, width: weight },
  });
}

function baseSlide(deck, index, eyebrow, title, dark = false) {
  const slide = deck.slides.add();
  slide.background.fill = dark ? C.ink : C.paper;
  const fg = dark ? C.white : C.ink;
  textBox(slide, eyebrow, 48, 32, 390, 20, 12, { bold: true, color: dark ? C.cyan : C.darkMuted });
  textBox(slide, title, 48, 68, 1125, 72, 36, { bold: true, color: fg });
  line(slide, 48, 151, 1184, dark ? C.ink2 : C.rule, 2);
  textBox(slide, "PERSONAFLIGHT · CODEX COMMUNITY HACKATHON", 48, 682, 520, 18, 10, { bold: true, color: dark ? C.muted : C.darkMuted });
  textBox(slide, String(index).padStart(2, "0"), 1184, 681, 48, 18, 11, { bold: true, color: dark ? C.muted : C.darkMuted, align: "right" });
  return slide;
}

function notes(slide, body, refs) {
  slide.speakerNotes.textFrame.setText([
    body,
    "",
    "[Sources]",
    ...refs.map((ref) => `- ${ref}`),
    "[/Sources]",
  ]);
  slide.speakerNotes.setVisible(true);
}

async function bytes(file) {
  const data = await fs.readFile(file);
  return new Uint8Array(data);
}

function image(slide, blob, alt, x, y, w, h, fit = "cover", crop) {
  return slide.images.add({
    blob,
    contentType: "image/png",
    alt,
    fit,
    position: { left: x, top: y, width: w, height: h },
    geometry: "roundRect",
    borderRadius: 18,
    ...(crop ? { crop } : {}),
  });
}

function metric(slide, value, label, x, y, w, fill = C.white, accent = C.ink) {
  rect(slide, x, y, w, 118, fill, 18, fill === C.white ? C.rule : "none", fill === C.white ? 1 : 0);
  textBox(slide, value, x + 20, y + 17, w - 40, 48, 34, { bold: true, color: accent });
  textBox(slide, label, x + 20, y + 75, w - 40, 24, 14, { bold: true, color: fill === C.ink2 ? C.muted : C.darkMuted });
}

async function main() {
  await fs.mkdir(RENDER, { recursive: true });
  const [plan, before, review, after, seed, disclaimer, desktop, mobile] = await Promise.all([
    bytes(`${ASSET}/frame-2.png`), bytes(`${ASSET}/frame-8.png`), bytes(`${ASSET}/frame-14.png`),
    bytes(`${ASSET}/frame-20.png`), bytes(`${ASSET}/frame-27.png`), bytes(`${ASSET}/frame-33.png`),
    bytes(`${QA}/flight-record-desktop.png`), bytes(`${QA}/flight-record-mobile-390x844.png`),
  ]);

  const deck = Presentation.create({ slideSize: { width: W, height: H } });

  // 01 Cover
  {
    const s = deck.slides.add(); s.background.fill = C.ink;
    rect(s, 0, 0, W, 12, C.lime);
    pill(s, "PRE-RELEASE UX REGRESSION", 48, 42, 235, C.cyan, C.ink);
    textBox(s, "PersonaFlight\nReplay Court", 48, 145, 690, 180, 66, { bold: true, color: C.white });
    textBox(s, "AI 의견이 아니라, 실패 증거와 동일 조건 재실행으로\n출시 전 UX 개선을 증명합니다.", 52, 354, 680, 90, 24, { bold: true, color: C.muted });
    rect(s, 830, 144, 346, 340, C.ink2, 30);
    textBox(s, "BEFORE", 870, 190, 260, 22, 13, { bold: true, color: C.muted, align: "center" });
    textBox(s, "0 / 3", 870, 222, 260, 66, 54, { bold: true, color: C.coral, align: "center" });
    textBox(s, "↓", 870, 306, 260, 40, 30, { bold: true, color: C.cyan, align: "center" });
    textBox(s, "AFTER", 870, 370, 260, 22, 13, { bold: true, color: C.muted, align: "center" });
    textBox(s, "3 / 3", 870, 402, 260, 66, 54, { bold: true, color: C.lime, align: "center" });
    textBox(s, "PLAN  →  PARALLEL  →  REVIEW  →  INTEGRATE", 50, 603, 830, 28, 17, { bold: true, color: C.cyan });
    textBox(s, "TEAM 2", 1090, 602, 86, 26, 13, { bold: true, color: C.white, align: "right" });
    notes(s, "PersonaFlight는 사람처럼 말하는 AI 테스터가 아니라, 1인 바이브코더가 출시 전에 UX 실패를 재현하고 수정 전후를 같은 조건으로 증명하는 Replay Court입니다.", [sources.repo, `${ROOT}/outputs/PersonaFlight_demo.mp4`]);
  }

  // 02 Problem and differentiation
  {
    const s = baseSlide(deck, 2, "01 · PROBLEM / DIFFERENTIATION", "빠른 출시는 쉬워졌지만, 출시 전 검증은 아직 혼자 감당합니다");
    const items = [
      ["출시 속도 ↑", "코드는 하루 만에 완성"],
      ["검증 자원 ↓", "QA·리서처·테스터가 없음"],
      ["문제 발견 지연", "이탈·리젝 후에야 수정"],
    ];
    items.forEach(([a,b],i)=>{ const x=48+i*392; rect(s,x,205,350,156,i===1?C.ink:C.white,20,C.rule,1); textBox(s,`0${i+1}`,x+22,226,44,24,13,{bold:true,color:i===1?C.cyan:C.blue}); textBox(s,a,x+22,268,300,34,24,{bold:true,color:i===1?C.white:C.ink}); textBox(s,b,x+22,314,300,24,15,{color:i===1?C.muted:C.darkMuted}); });
    textBox(s, "기존 AI UX 리뷰", 48, 414, 260, 24, 16, { bold: true, color: C.darkMuted });
    rect(s, 48, 450, 445, 138, C.white, 18, C.rule, 1);
    textBox(s, "“버튼을 더 눈에 띄게 하세요”", 73, 478, 395, 34, 22, { bold: true });
    textBox(s, "일반적 의견 · 근거 없음 · 재현 불가", 73, 531, 395, 24, 15, { color: C.darkMuted });
    textBox(s, "→", 520, 486, 72, 50, 40, { bold: true, color: C.blue, align: "center" });
    rect(s, 620, 424, 612, 178, C.lime, 22);
    textBox(s, "PersonaFlight", 650, 452, 540, 32, 18, { bold: true, color: C.ink });
    textBox(s, "Evidence ID → 최소 diff → 사람 승인 → 동일 조건 replay", 650, 497, 540, 50, 23, { bold: true });
    textBox(s, "‘좋아 보임’이 아니라 ‘같은 조건에서 통과함’을 남깁니다.", 650, 556, 540, 24, 15, { color: C.darkMuted });
    notes(s, "문제는 아이디어가 아니라 검증 루프입니다. 일반적인 AI 의견은 재현도 책임도 남지 않습니다. PersonaFlight는 의견을 증거와 재실행 가능한 기록으로 바꿉니다.", [sources.repo, `${ROOT}/outputs/personaflight-mvp/docs/PRODUCT_SPEC.md`]);
  }

  // 03 Contract
  {
    const s = baseSlide(deck, 3, "02 · PRODUCT CONTRACT", "하나의 미션, 정확히 세 조건, 같은 조건으로 다시 재판합니다", true);
    textBox(s, "MISSION", 48, 193, 150, 22, 13, { bold: true, color: C.cyan });
    textBox(s, "할 일을 만들고 Today 목록에 추가", 48, 224, 620, 48, 29, { bold: true, color: C.white });
    const conds = [
      ["01", "TOUCH", "small viewport\n+touch-only"],
      ["02", "PATIENCE", "delayed feedback\n+low patience"],
      ["03", "INFERENCE", "ambiguous copy\n+reduced inference"],
    ];
    conds.forEach(([n,t,d],i)=>{const x=48+i*392; rect(s,x,326,350,190,i===2?C.lime:C.ink2,22); textBox(s,n,x+23,346,44,24,13,{bold:true,color:i===2?C.ink:C.cyan}); textBox(s,t,x+23,392,300,32,24,{bold:true,color:i===2?C.ink:C.white}); textBox(s,d,x+23,442,300,48,16,{bold:true,color:i===2?C.darkMuted:C.muted});});
    rect(s, 48, 559, 1134, 62, C.white, 16);
    textBox(s, "불변식", 70, 577, 82, 22, 13, { bold: true, color: C.darkMuted });
    textBox(s, "mission ID · app version · condition set이 바뀌면 비교를 거부", 165, 572, 980, 30, 19, { bold: true, color: C.ink });
    notes(s, "페르소나를 인구통계로 단정하지 않고 행동 제약을 독립 축으로 분리했습니다. 비교할 때 미션, 버전, 세 조건이 그대로여야 하므로 결과를 임의로 유리하게 바꿀 수 없습니다.", [sources.pr1, `${ROOT}/outputs/personaflight-mvp/src/lib/contracts/replay.ts`]);
  }

  // 04 Product flow
  {
    const s = baseSlide(deck, 4, "03 · WORKING PRODUCT", "90초 핵심 흐름: PLAN → PARALLEL → REVIEW → INTEGRATE");
    const steps = [["PLAN","미션·3조건 고정"],["PARALLEL","BEFORE 증거 수집"],["REVIEW","최소 diff + 승인"],["INTEGRATE","동일 replay + seed"]];
    steps.forEach(([a,b],i)=>{const x=48+i*292; rect(s,x,186,260,94,i===3?C.lime:C.white,18,C.rule,1); textBox(s,`0${i+1}  ${a}`,x+18,203,224,24,15,{bold:true,color:C.ink}); textBox(s,b,x+18,243,224,22,13,{color:C.darkMuted}); if(i<3) textBox(s,"→",x+260,213,32,32,24,{bold:true,color:C.blue,align:"center"});});
    image(s, plan, "PLAN stage of PersonaFlight Replay Court", 48, 318, 1134, 286, "cover");
    pill(s, "CLICKABLE · NO ACCOUNT · NO API KEY", 822, 618, 360, C.ink, C.white);
    notes(s, "데모에서는 네 번만 봅니다. 계획에서 세 조건을 선언하고, 병렬 실행에서 0/3 실패 증거를 남기고, 리뷰에서 최소 수정안을 사람이 승인한 뒤, 같은 조건으로 3/3을 재검증합니다.", [`${ROOT}/outputs/PersonaFlight_demo.mp4`, `${ROOT}/outputs/personaflight-mvp/tests/e2e/replay-court.spec.ts`]);
  }

  // 05 Proof
  {
    const s = baseSlide(deck, 5, "04 · EVIDENCE", "작동하는 제품의 증거: 0/3에서 3/3까지 같은 기록으로 연결됩니다", true);
    image(s, before, "BEFORE 0 of 3 with evidence IDs", 48, 188, 548, 309, "cover");
    image(s, after, "AFTER 3 of 3 Flight Record", 636, 188, 548, 309, "cover");
    pill(s, "BEFORE · 0/3", 70, 514, 174, C.coral, C.ink);
    pill(s, "AFTER · 3/3", 658, 514, 174, C.lime, C.ink);
    rect(s, 48, 568, 1136, 62, C.ink2, 16);
    textBox(s, "EV-TOUCH-01  ·  EV-WAIT-02  ·  EV-COPY-03", 72, 583, 540, 28, 16, { bold: true, color: C.cyan });
    textBox(s, "Flight Record + regression seed JSON", 676, 583, 468, 28, 17, { bold: true, color: C.white, align: "right" });
    notes(s, "왼쪽은 조건별 Evidence ID가 남은 BEFORE 0/3, 오른쪽은 같은 조건을 통과한 AFTER 3/3입니다. 결과는 Flight Record와 regression seed JSON으로 재사용할 수 있습니다.", [`${ROOT}/outputs/qa-artifacts/flight-record-desktop.png`, `${ROOT}/outputs/PersonaFlight_demo_regression_seed.json`]);
  }

  // 06 Codex orchestration
  {
    const s = baseSlide(deck, 6, "05 · CODEX BUILD ORCHESTRATION", "AI 사용량이 아니라, 네 명과 AI가 함께 일한 방식을 남겼습니다");
    const stages = [
      ["PLAN","PC1","계약·baseline·완료 형식"],
      ["PARALLEL","PC2 / PC3 / PC4","UI · Replay · QA 분리"],
      ["REVIEW","CODEX + PC1","실패를 숨기지 않는 gate"],
      ["INTEGRATE","PC1","PR 선택 병합·회귀 검증"],
    ];
    stages.forEach(([a,o,d],i)=>{const x=48+i*292; rect(s,x,194,260,242,i===2?C.ink:i===3?C.lime:C.white,20,C.rule,1); textBox(s,`0${i+1}`,x+20,216,42,22,13,{bold:true,color:i===2?C.cyan:C.blue}); textBox(s,a,x+20,262,220,34,22,{bold:true,color:i===2?C.white:C.ink}); pill(s,o,x+20,316,Math.min(210,92+o.length*5),i===2?C.cyan:C.ink,i===2?C.ink:C.white); textBox(s,d,x+20,374,220,42,14,{bold:true,color:i===2?C.muted:C.darkMuted});});
    textBox(s, "REVIEW에서 실제로 막은 것", 48, 486, 290, 24, 15, { bold: true, color: C.darkMuted });
    const reviewItems=["빈/unknown Evidence ID","infra failure의 성공 오판","경로 회귀로 E2E red","green 확인 후에만 병합"];
    reviewItems.forEach((v,i)=>{const x=48+i*292; rect(s,x,527,260,72,i===3?C.ink2:C.white,16,C.rule,1); textBox(s,v,x+17,548,226,30,14,{bold:true,color:i===3?C.white:C.ink,align:"center",valign:"middle"});});
    notes(s, "사람은 목표와 윤리 경계, 승인 권한을 정했고 Codex는 계약, 작업 분해, 병렬 브랜치, 리뷰, 검증을 담당했습니다. 특히 PC2 PR은 build가 통과해도 E2E가 깨졌을 때 병합하지 않았고, green 후에만 통합했습니다.", [sources.pr1, sources.pr2, sources.pr3, `${ROOT}/outputs/personaflight-mvp/docs/ORCHESTRATION.md`]);
  }

  // 07 Architecture and quality
  {
    const s = baseSlide(deck, 7, "06 · ARCHITECTURE / TRUST", "UI보다 중요한 것은 실패를 성공처럼 보이지 않게 하는 계약입니다", true);
    const nodes=[["NEXT / REACT","product UI"],["ZOD CONTRACTS","mission · evidence · record"],["REPLAY ENGINE","comparison · verdict · seed"],["VITEST / PLAYWRIGHT","unit · integration · E2E"]];
    nodes.forEach(([a,b],i)=>{const x=48+i*292; rect(s,x,210,260,132,i===1?C.lime:C.ink2,20); textBox(s,a,x+18,235,224,28,17,{bold:true,color:i===1?C.ink:C.white,align:"center"}); textBox(s,b,x+18,284,224,24,13,{color:i===1?C.darkMuted:C.muted,align:"center"}); if(i<3) textBox(s,"→",x+260,250,32,34,25,{bold:true,color:C.cyan,align:"center"});});
    metric(s,"49","unit / component",48,400,258,C.white,C.ink);
    metric(s,"4","integration",340,400,258,C.white,C.ink);
    metric(s,"6","Chromium E2E",632,400,258,C.white,C.ink);
    metric(s,"98.74%","line coverage",924,400,258,C.lime,C.ink);
    rect(s,48,553,1134,72,C.ink2,16);
    textBox(s,"CLEARED 금지",70,571,170,24,14,{bold:true,color:C.coral});
    textBox(s,"하나라도 미통과하거나 infrastructure failure면 release success를 표시하지 않습니다.",246,567,900,30,18,{bold:true,color:C.white});
    notes(s, "UI는 Next와 React, 핵심 계약은 Zod, 비교와 seed는 replay engine, 검증은 Vitest와 Playwright입니다. 품질 수치보다 중요한 규칙은 인프라 실패나 부분 실패를 성공으로 표시하지 않는 것입니다.", [sources.ci2, `${ROOT}/outputs/personaflight-mvp/src/lib/contracts/replay.ts`, `${ROOT}/outputs/personaflight-mvp/tests`]);
  }

  // 08 Value / close
  {
    const s = baseSlide(deck, 8, "07 · VALUE / VIABILITY", "‘AI 의견’에서 ‘출시 전 품질 게이트’로 확장합니다");
    const roadmap=[["NOW","고정 FocusList synthetic replay","검증 완료"],["NEXT","preview URL sandbox runner","브라우저 증거"],["THEN","승인 patch + PR/CI Flight Record","반복 구독 가치"]];
    roadmap.forEach(([a,b,c],i)=>{const y=194+i*116; pill(s,a,48,y,100,i===0?C.lime:C.ink,i===0?C.ink:C.white); textBox(s,b,180,y+1,720,32,22,{bold:true}); textBox(s,c,952,y+3,230,26,14,{bold:true,color:i===0?C.blue:C.darkMuted,align:"right"}); if(i<2) line(s,180,y+65,1002,C.rule,1);});
    rect(s,48,565,1134,66,C.ink,18);
    textBox(s,"github.com/sunnn62/Codex-Hackaton-02",72,584,690,28,19,{bold:true,color:C.white});
    textBox(s,"Synthetic ≠ 실제 사용자 예측",820,586,330,24,14,{bold:true,color:C.cyan,align:"right"});
    notes(s, "오늘은 고정 fixture에서 증거와 재실행 계약을 검증했습니다. 다음은 실제 preview URL을 격리 브라우저에서 실행하고, 승인된 최소 patch를 같은 seed로 재실행해 PR과 CI에 Flight Record를 붙이는 것입니다.", [sources.repo, `${ROOT}/outputs/personaflight-mvp/docs/VALUE_AND_VIABILITY.md`, `${ASSET}/frame-33.png`]);
  }

  // A1 Contracts
  {
    const s = baseSlide(deck, 9, "APPENDIX A1 · CONTRACTS", "공용 계약과 핵심 불변식");
    const contracts=["MissionContract","FaultCondition","ActionEvidence","Finding","PatchProposal","ReplayRun","ReplayComparison","FlightRecord","RegressionSeed","PersonaProfile"];
    contracts.forEach((v,i)=>{const col=i%5,row=Math.floor(i/5);const x=48+col*228,y=196+row*92;rect(s,x,y,204,68,col===4?C.lime:C.white,15,C.rule,1);textBox(s,v,x+12,y+22,180,24,13,{bold:true,align:"center"});});
    rect(s,48,410,1134,180,C.ink,20);
    const inv=["exactly 3 unique conditions","before/after mission invariant","evidence ID required and known","infrastructure failure → partial","verdict derives from actual runs"];
    inv.forEach((v,i)=>textBox(s,`✓  ${v}`,78+(i%2)*548,438+Math.floor(i/2)*44,500,25,15,{bold:true,color:i===4?C.lime:C.white}));
    notes(s, "부록입니다. 핵심 데이터 구조를 타입과 런타임 검증으로 고정했고, 결과 수치와 verdict가 서로 모순되지 않도록 비교 규칙을 테스트합니다.", [sources.pr1, `${ROOT}/outputs/personaflight-mvp/src/lib/contracts/replay.ts`]);
  }

  // A2 Verification
  {
    const s = baseSlide(deck, 10, "APPENDIX A2 · VERIFICATION", "재현 가능한 검증 매트릭스");
    const rows=[
      ["Unit / component","49","PASS","contracts · UI · seed"],
      ["Integration","4","PASS","trust boundaries"],
      ["Chromium E2E","6","PASS","desktop + 390×844 touch"],
      ["Coverage","98.74% lines","PASS","94.56% branches"],
      ["Production build","Next.js","PASS","locked npm install"],
    ];
    ["검증","수치","상태","범위"].forEach((v,i)=>textBox(s,v,[48,410,610,790][i],190,[330,170,150,392][i],24,13,{bold:true,color:C.darkMuted}));
    rows.forEach((r,ri)=>{const y=226+ri*70;rect(s,48,y,1134,56,ri%2?"#EDF2F8":C.white,12);textBox(s,r[0],66,y+17,320,24,15,{bold:true});textBox(s,r[1],410,y+17,170,24,15,{bold:true});pill(s,r[2],610,y+12,112,C.success,C.ink);textBox(s,r[3],790,y+17,370,24,14,{color:C.darkMuted});});
    notes(s, "PC4 QA PR의 Ubuntu CI에서 49 unit, 4 integration, 6 Chromium E2E와 coverage, build, artifact upload가 모두 통과했습니다.", [sources.ci2, sources.pr2]);
  }

  // A3 PR ledger
  {
    const s = baseSlide(deck, 11, "APPENDIX A3 · PARALLEL INTEGRATION", "4대 PC 작업과 PR 통합 원장", true);
    const rows=[
      ["PC1","Integrator","contracts · review · merge","integration"],
      ["PC2","Product UI","landing · project · persona · replay","PR #3 GREEN"],
      ["PC3","Replay Engine","evidence gate · comparison · seed","PR #1 MERGED"],
      ["PC4","Release QA","trust tests · E2E · artifacts","PR #2 MERGED"],
    ];
    rows.forEach((r,i)=>{const y=190+i*94;rect(s,48,y,1134,74,i===1?C.lime:C.ink2,17);textBox(s,r[0],70,y+23,80,26,16,{bold:true,color:i===1?C.ink:C.cyan});textBox(s,r[1],170,y+23,170,26,16,{bold:true,color:i===1?C.ink:C.white});textBox(s,r[2],360,y+23,520,26,15,{color:i===1?C.darkMuted:C.muted});textBox(s,r[3],920,y+23,235,26,14,{bold:true,color:i===1?C.ink:C.white,align:"right"});});
    textBox(s,"공통 Baseline SHA",48,603,210,22,13,{bold:true,color:C.muted});
    textBox(s,"b24efb6ef2177c43e426a8346a0cdfa30ab59dff",270,600,600,24,14,{bold:true,color:C.white});
    notes(s, "같은 baseline에서 파일 소유권과 완료 보고 형식을 고정해 병렬화했고, PR마다 검토와 CI gate를 거친 뒤 PC1이 통합했습니다.", [sources.pr1, sources.pr2, sources.pr3, `${ROOT}/outputs/personaflight-mvp/docs/WORKFLOW.md`]);
  }

  // A4 Limits
  {
    const s = baseSlide(deck, 12, "APPENDIX A4 · HONEST BOUNDARIES", "현재 구현의 한계와 다음 검증 단계");
    const left=["고정 FocusList fixture","결정론적 mock screen · diff","실제 source mutation 없음","실제 사용자 연구 대체 안 함"];
    const right=["preview URL sandbox runner","console · network · action trace","승인 patch preview 재실행","synthetic vs. real-user 비교"];
    textBox(s,"TODAY · PROVEN",48,190,510,26,14,{bold:true,color:C.darkMuted});
    textBox(s,"NEXT · VALIDATE",674,190,510,26,14,{bold:true,color:C.blue});
    rect(s,48,228,510,320,C.white,20,C.rule,1); rect(s,674,228,510,320,C.ink,20);
    left.forEach((v,i)=>textBox(s,`✓  ${v}`,78,264+i*62,450,34,17,{bold:true,color:C.ink}));
    right.forEach((v,i)=>textBox(s,`${i+1}.  ${v}`,704,264+i*62,450,34,17,{bold:true,color:i===0?C.lime:C.white}));
    rect(s,48,582,1136,48,C.lime,14); textBox(s,"신뢰 원칙: 검증하지 않은 기능·배포·효과는 완료로 표시하지 않습니다.",68,594,1096,24,16,{bold:true,align:"center"});
    notes(s, "현재는 외부 앱을 실시간 조작하는 범용 runner가 아니라 고정 fixture로 계약을 증명한 MVP입니다. 이 한계를 숨기지 않고 다음 단계의 검증 항목으로 명시합니다.", [`${ROOT}/outputs/personaflight-mvp/docs/VALUE_AND_VIABILITY.md`, `${ROOT}/outputs/personaflight-mvp/docs/SUBMISSION_CHECKLIST.md`, `${ASSET}/frame-33.png`]);
  }

  for (const [i, slide] of deck.slides.items.entries()) {
    const stem = `slide-${String(i + 1).padStart(2, "0")}`;
    const png = await deck.export({ slide, format: "png", scale: 1 });
    await fs.writeFile(path.join(RENDER, `${stem}.png`), new Uint8Array(await png.arrayBuffer()));
    const layout = await slide.export({ format: "layout" });
    await fs.writeFile(path.join(RENDER, `${stem}.layout.json`), await layout.text(), "utf8");
  }
  const montage = await deck.export({ format: "webp", montage: true, scale: 1 });
  await fs.writeFile(path.join(RENDER, "deck-montage.webp"), new Uint8Array(await montage.arrayBuffer()));
  const pptx = await PresentationFile.exportPptx(deck);
  await pptx.save(OUT);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
