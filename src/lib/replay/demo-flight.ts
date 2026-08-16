import {
  parseFlightRecord,
  parseReplayCase,
  type ActionEvidence,
  type FlightRecord,
  type Finding,
} from '@/lib/contracts/replay'
import { assertFindingEvidence } from '@/lib/evidence/evidence-gate'
import { createReplayComparison } from '@/lib/replay/replay-comparison'

export const demoReplayCase = parseReplayCase({
  id: 'focus-list-create-task',
  mission: {
    id: 'create-today-task',
    title: '할 일을 만들고 오늘 목록에 추가한다',
    startState: '빈 Today 목록과 닫힌 작성 폼',
    successCriterion: '새 할 일 “발표 리허설”이 Today 목록에 표시된다',
    failureCriterion: '저장 동작이나 완료 여부를 확인할 수 없다',
  },
  conditions: [
    {
      id: 'touch-small-viewport',
      label: 'Touch-only · Small viewport',
      constraints: {
        viewport: 'small-mobile',
        inputMode: 'touch',
        patience: 'standard',
        inference: 'standard',
      },
    },
    {
      id: 'low-patience-delayed-feedback',
      label: 'Low patience · Delayed feedback',
      constraints: {
        viewport: 'large-mobile',
        inputMode: 'touch',
        patience: 'low',
        inference: 'standard',
      },
    },
    {
      id: 'reduced-inference-ambiguous-copy',
      label: 'Reduced inference · Ambiguous copy',
      constraints: {
        viewport: 'desktop',
        inputMode: 'keyboard',
        patience: 'standard',
        inference: 'reduced',
      },
    },
  ],
})

const BEFORE_NOTES: Readonly<Record<string, string>> = Object.freeze({
  'touch-small-viewport':
    '390px 화면에서 primary CTA 아래쪽이 잘려 탭 대상을 확인하지 못했다.',
  'low-patience-delayed-feedback':
    '저장 후 pending 표시가 없어 1.2초 안에 완료 여부를 판단하지 못했다.',
  'reduced-inference-ambiguous-copy':
    '“Done” 레이블만으로 저장 동작과 닫기 동작을 구분하지 못했다.',
})

function createEvidence(
  conditionId: string,
  version: 'before' | 'after',
  sequence: number,
): ActionEvidence {
  const passed = version === 'after'
  return {
    id: `${version}-${conditionId}-evidence`,
    conditionId,
    version,
    sequence,
    screen: {
      id: passed ? 'focus-list-fixed' : 'focus-list-flawed',
      title: passed ? 'FocusList · fixed task form' : 'FocusList · flawed task form',
    },
    action: {
      type: 'click',
      target: 'save-task',
      description: passed
        ? '명확한 “할 일 저장” 버튼을 누르고 persistent status를 확인한다.'
        : BEFORE_NOTES[conditionId],
    },
    outcome: passed ? 'succeeded' : 'blocked',
    capturedAt: passed
      ? '2026-08-16T04:01:00.000Z'
      : '2026-08-16T04:00:00.000Z',
  }
}

function createRuns(version: 'before' | 'after') {
  return demoReplayCase.conditions.map((condition, index) => ({
    missionId: demoReplayCase.mission.id,
    conditionId: condition.id,
    version,
    verdict: version === 'after' ? ('passed' as const) : ('blocked' as const),
    evidence: [createEvidence(condition.id, version, index + 1)],
  }))
}

export function createDemoFlightRecord(): FlightRecord {
  const before = createRuns('before')
  const after = createRuns('after')
  const finding: Finding = {
    id: 'finding-save-state',
    title: '저장 동작과 완료 상태가 명확하지 않다',
    severity: 'blocker',
    evidenceIds: before.flatMap((run) =>
      run.evidence.map((evidence) => evidence.id),
    ),
  }

  assertFindingEvidence(finding, before)

  return parseFlightRecord({
    id: 'flight-record-focus-list',
    replayCase: demoReplayCase,
    before,
    finding,
    patch: {
      id: 'patch-save-state',
      title: 'CTA와 저장 상태를 명확하고 지속적으로 표시한다',
      summary:
        '모바일 CTA를 화면 안에 유지하고, 명확한 버튼 이름과 persistent status region을 제공한다.',
      diff: [
        '- <button className="clipped">Done</button>',
        '+ <button className="saveButton">할 일 저장</button>',
        '+ <p role="status">저장 완료 · Today에 추가됨</p>',
      ].join('\n'),
      status: 'proposed',
    },
    after,
    comparison: createReplayComparison(
      demoReplayCase.mission.id,
      before,
      after,
    ),
    generatedAt: '2026-08-16T04:01:30.000Z',
  })
}
