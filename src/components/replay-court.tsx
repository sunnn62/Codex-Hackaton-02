'use client'

import { useMemo, useState } from 'react'

import { createRegressionSeed, type FlightRecord } from '@/lib/contracts/replay'

import styles from './replay-court.module.css'

type DemoStage = 'plan' | 'evidence' | 'patch' | 'replay'

interface ReplayCourtProps {
  readonly record: FlightRecord
}

const STAGES: readonly { readonly id: DemoStage; readonly label: string; readonly description: string }[] = [
  { id: 'plan', label: 'PLAN', description: '검증 조건 선언' },
  { id: 'evidence', label: 'PARALLEL', description: '동일 조건 병렬 실행' },
  { id: 'patch', label: 'REVIEW', description: '수정안 승인' },
  { id: 'replay', label: 'INTEGRATE', description: '동일 조건 재실행' },
]

function stageIndex(stage: DemoStage): number {
  return STAGES.findIndex((item) => item.id === stage)
}

function constraintText(
  constraints: FlightRecord['replayCase']['conditions'][number]['constraints'],
): string {
  return [
    constraints.viewport.replace('-', ' '),
    constraints.inputMode,
    `${constraints.patience} patience`,
    `${constraints.inference} inference`,
  ].join(' · ')
}

function verdictLabel(verdict: FlightRecord['after'][number]['verdict']): string {
  return verdict === 'infrastructure-failure' ? 'INFRASTRUCTURE FAILURE' : verdict.toUpperCase()
}

export function ReplayCourt({ record }: ReplayCourtProps) {
  const [stage, setStage] = useState<DemoStage>('plan')
  const seed = useMemo(() => createRegressionSeed(record), [record])
  const seedHref = useMemo(
    () => `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(seed, null, 2))}`,
    [seed],
  )
  const currentStageIndex = stageIndex(stage)
  const totalConditions = record.replayCase.conditions.length
  const beforePassed = record.before.filter((run) => run.verdict === 'passed').length
  const afterPassed = record.after.filter((run) => run.verdict === 'passed').length
  const isCleared = stage === 'replay' && afterPassed === totalConditions && record.after.every((run) => run.verdict === 'passed')
  const conditionLabels = new Map(record.replayCase.conditions.map((condition) => [condition.id, condition.label]))

  return (
    <main className={styles.shell} id="top">
      <header className={styles.topbar}>
        <a className={styles.brand} href="#top" aria-label="PersonaFlight home"><span aria-hidden="true">✦</span>PersonaFlight</a>
        <div className={styles.topbarMeta}><span>REPLAY COURT / 01</span><i aria-hidden="true" /><span>DEMO MODE</span></div>
      </header>

      <section className={styles.hero} aria-labelledby="court-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>PRE-RELEASE UX REGRESSION CHECK</p>
          <h1 id="court-title">같은 실패를,<br />같은 조건으로 다시 증명합니다.</h1>
          <p>명확한 UX 결함만 증거로 남기고, 사람의 승인 후 동일 조건에서 다시 실행합니다.</p>
        </div>
        <div aria-label="release readiness" className={styles.readiness} aria-live="polite">
          <span>RELEASE STATUS</span>
          <strong>{isCleared ? 'CLEARED' : <>RELEASE <span>HOLD</span></>}</strong>
          <p>{isCleared ? `${afterPassed}/${totalConditions} conditions passed` : stage === 'plan' ? 'Evidence required before release' : `${beforePassed}/${totalConditions} conditions passed before patch`}</p>
          <b className={isCleared ? styles.statusPass : styles.statusHold}>{isCleared ? 'PASS / VERIFIED' : 'HOLD / REVIEW REQUIRED'}</b>
        </div>
      </section>

      <nav className={styles.stageRail} aria-label="Replay Court progress">
        {STAGES.map((item, index) => {
          const current = index === currentStageIndex
          const complete = index < currentStageIndex
          return <div className={`${styles.stage} ${current ? styles.stageCurrent : ''} ${complete ? styles.stageComplete : ''}`} key={item.id}>
            <span>{String(index + 1).padStart(2, '0')}</span><div><strong>{item.label}</strong><small>{item.description}</small></div><i aria-hidden="true" />
          </div>
        })}
      </nav>

      <section className={styles.contract} aria-labelledby="mission-title">
        <div><p className={styles.sectionLabel}>01 / MISSION CONTRACT</p><h2 id="mission-title">{record.replayCase.mission.title}</h2><p>하나의 준비된 모바일 웹 미션만 검증합니다.</p></div>
        <dl>
          <div><dt>START</dt><dd>{record.replayCase.mission.startState}</dd></div>
          <div><dt>PASS</dt><dd>{record.replayCase.mission.successCriterion}</dd></div>
          <div><dt>FAIL</dt><dd>{record.replayCase.mission.failureCriterion}</dd></div>
        </dl>
      </section>

      <section className={styles.conditionSection} aria-labelledby="conditions-title">
        <div className={styles.sectionHeading}><div><p className={styles.sectionLabel}>02 / DECLARED CONDITIONS</p><h2 id="conditions-title">공개된 3가지 검증 조건</h2></div><p>누구를 가정하지 않고, 관찰 가능한 환경만 선언합니다.</p></div>
        <div className={styles.conditions}>
          {record.replayCase.conditions.map((condition, index) => <article className={styles.conditionCard} data-testid="fault-condition" key={condition.id}>
            <div><span>CONDITION {String(index + 1).padStart(2, '0')}</span><span aria-hidden="true">↗</span></div><h3>{condition.label}</h3><p>{constraintText(condition.constraints)}</p><code>{condition.id}</code>
          </article>)}
        </div>
      </section>

      {stage === 'plan' ? <section className={styles.actionDeck} aria-label="preflight action">
        <div><p className={styles.sectionLabel}>NEXT / PARALLEL RUN</p><h2>세 조건에서 같은 미션을 실행합니다.</h2><p>실패한 화면과 행동만 이후 수정 검토의 근거가 됩니다.</p></div>
        <button className={styles.primaryAction} type="button" onClick={() => setStage('evidence')}><span>3개 조건 병렬 실행</span><span aria-hidden="true">→</span></button>
      </section> : null}

      {currentStageIndex >= stageIndex('evidence') ? <section className={styles.hearing} aria-labelledby="before-title">
        <div className={styles.sectionHeading}><div><p className={styles.sectionLabel}>03 / EVIDENCE HEARING</p><h2 id="before-title">BEFORE · {beforePassed}/{totalConditions} PASS</h2></div><strong className={styles.blocker}>RELEASE BLOCKER</strong></div>
        <div className={styles.findingBar}><span>FINDING / {record.finding.id}</span><p>{record.finding.title}</p></div>
        <div className={styles.evidenceGrid}>
          {record.before.map((run, index) => {
            const evidence = run.evidence[0]
            return <article className={styles.evidenceCard} key={run.conditionId}>
              <div className={styles.mockScreen} aria-label={`flawed app screen ${index + 1}`}><div><span>FocusList</span><span>•••</span></div><strong>발표 리허설</strong><p>오늘 안에 끝내야 할 일을 추가하세요.</p><button type="button" tabIndex={-1}>Done</button></div>
              <div className={styles.evidenceMeta}><p className={styles.evidenceId} data-testid="evidence-id">{evidence.id}</p><span>SCREEN · {evidence.screen.id}</span></div>
              <h3>{conditionLabels.get(run.conditionId)}</h3><p>{evidence.action.description}</p><strong className={styles.blockedAt}>BLOCKED AT / {evidence.action.target}</strong>
            </article>
          })}
        </div>
        {stage === 'evidence' ? <button className={styles.primaryAction} type="button" onClick={() => setStage('patch')}><span>Codex 최소 수정 검토</span><span aria-hidden="true">→</span></button> : null}
      </section> : null}

      {currentStageIndex >= stageIndex('patch') ? <section className={styles.patchPanel} aria-labelledby="patch-title">
        <div><p className={styles.sectionLabel}>04 / CODEX PATCH</p><h2 id="patch-title">{record.patch.title}</h2><p>{record.patch.summary}</p><div className={styles.approvalNote}><span aria-hidden="true">!</span><p>코드는 자동으로 바뀌지 않습니다. 담당자가 수정안을 확인하고 승인해야 합니다.</p></div></div>
        <div className={styles.diffPanel}><div><span>MINIMAL DIFF</span><span>{record.patch.id}</span></div><pre aria-label="minimal code diff">{record.patch.diff}</pre></div>
        {stage === 'patch' ? <button className={styles.primaryAction} type="button" onClick={() => setStage('replay')}><span>승인 후 동일 조건 재실행</span><span aria-hidden="true">→</span></button> : <strong className={styles.approved}>✓ HUMAN APPROVED · REPLAYED</strong>}
      </section> : null}

      {stage === 'replay' ? <section className={styles.flightRecord} aria-labelledby="flight-record-title">
        <div className={styles.sectionHeading}><div><p className={styles.sectionLabel}>05 / IDENTICAL-CONDITION VERDICT</p><h2 id="flight-record-title">Flight Record</h2></div><strong className={isCleared ? styles.cleared : styles.blocker}>AFTER · {afterPassed}/{totalConditions} PASS</strong></div>
        <div className={styles.comparison}><div className={styles.beforeScore}><span>BEFORE</span><strong>{beforePassed} / {totalConditions}</strong><p>동일 미션에서 저장 행동과 완료 상태를 확인하지 못했습니다.</p></div><div className={styles.delta}><span>REPLAY</span><strong>+{afterPassed - beforePassed}</strong></div><div className={styles.afterScore}><span>AFTER</span><strong>{afterPassed} / {totalConditions}</strong><p>{isCleared ? '동일 미션·조건·판정 규칙을 모두 통과했습니다.' : '미해결 조건이 남아 RELEASE HOLD를 유지합니다.'}</p></div></div>
        <div className={styles.runList}>{record.after.map((run, index) => <div data-testid={`after-run-${run.conditionId}`} key={run.conditionId}><span>{String(index + 1).padStart(2, '0')}</span><p>{conditionLabels.get(run.conditionId)}</p><code>{run.conditionId}</code><strong className={run.verdict === 'passed' ? styles.runPass : styles.runBlocked}>{verdictLabel(run.verdict)}</strong></div>)}</div>
        <a className={styles.download} download="personaflight-regression-seed.json" href={seedHref}><span>Regression seed 저장</span><span aria-hidden="true">↓</span></a>
      </section> : null}

      <footer className={styles.disclaimer}><strong>Synthetic ≠ 실제 사용자 예측</strong><span>명백한 UX 사각지대를 제거하는 preflight evidence이며 실제 사용자 리서치를 대체하지 않습니다.</span></footer>
    </main>
  )
}
