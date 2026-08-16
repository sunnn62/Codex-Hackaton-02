'use client'

import { useMemo, useState } from 'react'

import {
  createRegressionSeed,
  type FlightRecord,
} from '@/lib/contracts/replay'

import styles from './replay-court.module.css'

type DemoStage = 'plan' | 'evidence' | 'patch' | 'replay'

interface ReplayCourtProps {
  readonly record: FlightRecord
}

const STAGES: readonly { readonly id: DemoStage; readonly label: string }[] = [
  { id: 'plan', label: 'PLAN' },
  { id: 'evidence', label: 'PARALLEL' },
  { id: 'patch', label: 'REVIEW' },
  { id: 'replay', label: 'INTEGRATE' },
]

function stageIndex(stage: DemoStage): number {
  return STAGES.findIndex((item) => item.id === stage)
}

function constraintText(
  constraints: FlightRecord['replayCase']['conditions'][number]['constraints'],
): string {
  return [
    constraints.viewport,
    constraints.inputMode,
    `${constraints.patience} patience`,
    `${constraints.inference} inference`,
  ].join(' · ')
}

function verdictLabel(
  verdict: FlightRecord['after'][number]['verdict'],
): string {
  return verdict === 'infrastructure-failure'
    ? 'INFRASTRUCTURE FAILURE'
    : verdict.toUpperCase()
}

export function ReplayCourt({ record }: ReplayCourtProps) {
  const [stage, setStage] = useState<DemoStage>('plan')
  const seed = useMemo(() => createRegressionSeed(record), [record])
  const seedHref = useMemo(
    () =>
      `data:application/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(seed, null, 2),
      )}`,
    [seed],
  )
  const currentStageIndex = stageIndex(stage)
  const totalConditions = record.replayCase.conditions.length
  const beforePassed = record.before.filter(
    (run) => run.verdict === 'passed',
  ).length
  const afterPassed = record.after.filter(
    (run) => run.verdict === 'passed',
  ).length
  const isCleared =
    stage === 'replay' &&
    afterPassed === totalConditions &&
    record.after.every((run) => run.verdict === 'passed')
  const conditionLabels = new Map(
    record.replayCase.conditions.map((condition) => [
      condition.id,
      condition.label,
    ]),
  )

  return (
    <main className={styles.shell}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>PERSONAFLIGHT / REPLAY COURT 01</p>
          <h1>출시 전에 실패를 재판하고, 같은 조건으로 다시 증명합니다.</h1>
          <p className={styles.lede}>
            의견형 AI 리포트가 아니라 화면·행동·코드 diff·동일 조건 replay를
            하나의 Flight Record로 남깁니다.
          </p>
        </div>
        <div className={styles.readiness} aria-label="release readiness">
          <span>RELEASE STATUS</span>
          <strong>{isCleared ? 'CLEARED' : 'HOLD'}</strong>
          <small>
            {stage === 'replay'
              ? `${afterPassed}/${totalConditions} conditions pass`
              : 'evidence required'}
          </small>
        </div>
      </header>

      <nav className={styles.stageRail} aria-label="Codex build orchestration">
        {STAGES.map((item, index) => (
          <div
            className={index <= currentStageIndex ? styles.stageActive : styles.stage}
            key={item.id}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item.label}</strong>
          </div>
        ))}
      </nav>

      <section className={styles.contract} aria-labelledby="mission-title">
        <div>
          <p className={styles.sectionLabel}>MISSION CONTRACT</p>
          <h2 id="mission-title">{record.replayCase.mission.title}</h2>
        </div>
        <dl>
          <div>
            <dt>START</dt>
            <dd>{record.replayCase.mission.startState}</dd>
          </div>
          <div>
            <dt>PASS</dt>
            <dd>{record.replayCase.mission.successCriterion}</dd>
          </div>
          <div>
            <dt>FAIL</dt>
            <dd>{record.replayCase.mission.failureCriterion}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.conditions} aria-label="declared fault conditions">
        {record.replayCase.conditions.map((condition, index) => (
          <article className={styles.conditionCard} data-testid="fault-condition" key={condition.id}>
            <span>CONDITION {index + 1}</span>
            <h3>{condition.label}</h3>
            <p>{constraintText(condition.constraints)}</p>
          </article>
        ))}
      </section>

      {stage === 'plan' ? (
        <section className={styles.actionDeck} aria-label="preflight action">
          <div>
            <p className={styles.sectionLabel}>READY TO TEST</p>
            <h2>동일한 계약, 서로 다른 세 가지 스트레스 조건</h2>
            <p>조건은 공개되어 있으며 연령이나 성별로 행동을 추측하지 않습니다.</p>
          </div>
          <button type="button" onClick={() => setStage('evidence')}>
            3개 조건 병렬 실행
          </button>
        </section>
      ) : null}

      {currentStageIndex >= stageIndex('evidence') ? (
        <section className={styles.hearing} aria-labelledby="before-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionLabel}>EVIDENCE HEARING</p>
              <h2 id="before-title">
                BEFORE · {beforePassed}/{totalConditions} PASS
              </h2>
            </div>
            <strong className={styles.blocker}>RELEASE BLOCKER</strong>
          </div>
          <p className={styles.finding}>{record.finding.title}</p>
          <div className={styles.evidenceGrid}>
            {record.before.map((run, index) => {
              const evidence = run.evidence[0]
              return (
                <article className={styles.evidenceCard} key={run.conditionId}>
                  <div className={styles.mockScreen} aria-label={`flawed app screen ${index + 1}`}>
                    <span>FocusList</span>
                    <strong>발표 리허설</strong>
                    <button type="button" tabIndex={-1}>Done</button>
                  </div>
                  <p className={styles.evidenceId} data-testid="evidence-id">
                    {evidence.id}
                  </p>
                  <h3>{conditionLabels.get(run.conditionId)}</h3>
                  <p>{evidence.action.description}</p>
                  <strong>BLOCKED AT: {evidence.action.target}</strong>
                </article>
              )
            })}
          </div>
          {stage === 'evidence' ? (
            <button className={styles.primaryAction} type="button" onClick={() => setStage('patch')}>
              Codex 최소 수정 검토
            </button>
          ) : null}
        </section>
      ) : null}

      {currentStageIndex >= stageIndex('patch') ? (
        <section className={styles.patchPanel} aria-labelledby="patch-title">
          <div>
            <p className={styles.sectionLabel}>CODEX PATCH / HUMAN APPROVAL</p>
            <h2 id="patch-title">{record.patch.title}</h2>
            <p>{record.patch.summary}</p>
          </div>
          <pre aria-label="minimal code diff">{record.patch.diff}</pre>
          {stage === 'patch' ? (
            <button type="button" onClick={() => setStage('replay')}>
              승인 후 동일 조건 재실행
            </button>
          ) : (
            <strong className={styles.approved}>APPROVED · REPLAYED</strong>
          )}
        </section>
      ) : null}

      {stage === 'replay' ? (
        <section className={styles.flightRecord} aria-labelledby="flight-record-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionLabel}>IDENTICAL-CONDITION VERDICT</p>
              <h2 id="flight-record-title">Flight Record</h2>
            </div>
            <strong className={isCleared ? styles.cleared : styles.blocker}>
              AFTER · {afterPassed}/{totalConditions} PASS
            </strong>
          </div>
          <div className={styles.comparison}>
            <div className={styles.beforeScore}>
              <span>BEFORE</span>
              <strong>{beforePassed} / {totalConditions}</strong>
              <p>저장 CTA와 상태 확인 실패</p>
            </div>
            <div className={styles.delta}>
              {afterPassed - beforePassed >= 0 ? '+' : ''}
              {afterPassed - beforePassed}
            </div>
            <div className={styles.afterScore}>
              <span>AFTER</span>
              <strong>{afterPassed} / {totalConditions}</strong>
              <p>
                {isCleared
                  ? '동일 미션·조건·판정 규칙 통과'
                  : '미해결 조건이 남아 release hold 유지'}
              </p>
            </div>
          </div>
          <div className={styles.runList}>
            {record.after.map((run) => (
              <div data-testid={`after-run-${run.conditionId}`} key={run.conditionId}>
                <span>{conditionLabels.get(run.conditionId)}</span>
                <strong>{verdictLabel(run.verdict)}</strong>
              </div>
            ))}
          </div>
          <a className={styles.download} download="personaflight-regression-seed.json" href={seedHref}>
            Regression seed 저장
          </a>
        </section>
      ) : null}

      <footer className={styles.disclaimer}>
        <strong>Synthetic ≠ 실제 사용자 예측</strong>
        <span>명백한 UX 사각지대를 제거하는 preflight evidence이며 실제 사용자 리서치를 대체하지 않습니다.</span>
      </footer>
    </main>
  )
}
