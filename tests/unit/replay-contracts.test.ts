import { describe, expect, it } from 'vitest'

import {
  createRegressionSeed,
  parseFlightRecord,
  parseReplayCase,
} from '@/lib/contracts/replay'

const validReplayCase = {
  id: 'focus-list-create-task',
  mission: {
    id: 'create-today-task',
    title: '할 일을 만들고 오늘 목록에 추가한다',
    startState: '빈 Today 목록',
    successCriterion: '새 할 일이 Today 목록에 표시된다',
    failureCriterion: '저장 완료 여부를 확인할 수 없다',
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
}

describe('parseReplayCase', () => {
  it('accepts exactly three declared behavioral conditions', () => {
    const replayCase = parseReplayCase(validReplayCase)

    expect(replayCase.conditions).toHaveLength(3)
    expect(replayCase.conditions.map((condition) => condition.id)).toEqual([
      'touch-small-viewport',
      'low-patience-delayed-feedback',
      'reduced-inference-ambiguous-copy',
    ])
  })

  it('rejects panels that do not contain exactly three conditions', () => {
    const invalidReplayCase = {
      ...validReplayCase,
      conditions: validReplayCase.conditions.slice(0, 2),
    }

    expect(() => parseReplayCase(invalidReplayCase)).toThrow()
  })

  it('rejects demographic attributes in a fault condition', () => {
    const invalidReplayCase = {
      ...validReplayCase,
      conditions: [
        {
          ...validReplayCase.conditions[0],
          ageRange: '60-69',
        },
        validReplayCase.conditions[1],
        validReplayCase.conditions[2],
      ],
    }

    expect(() => parseReplayCase(invalidReplayCase)).toThrow()
  })

  it('returns a deeply frozen contract for parallel workers', () => {
    const replayCase = parseReplayCase(validReplayCase)

    expect(Object.isFrozen(replayCase)).toBe(true)
    expect(Object.isFrozen(replayCase.mission)).toBe(true)
    expect(Object.isFrozen(replayCase.conditions)).toBe(true)
    expect(Object.isFrozen(replayCase.conditions[0].constraints)).toBe(true)
    expect(() => {
      const mutableConstraints = replayCase.conditions[0].constraints as {
        patience?: string
      }
      mutableConstraints.patience = 'low'
    }).toThrow()
  })
})

const evidence = (conditionId: string, version: 'before' | 'after') => ({
  id: `${version}-${conditionId}-evidence`,
  conditionId,
  version,
  sequence: 1,
  screen: {
    id: version === 'before' ? 'task-form-flawed' : 'task-form-fixed',
    title: 'FocusList task form',
  },
  action: {
    type: 'click' as const,
    target: 'save-task',
    description: '저장 버튼을 누른다',
  },
  outcome: version === 'before' ? ('blocked' as const) : ('succeeded' as const),
  capturedAt: '2026-08-16T04:00:00.000Z',
})

const runs = (version: 'before' | 'after') =>
  validReplayCase.conditions.map((condition) => ({
    missionId: validReplayCase.mission.id,
    conditionId: condition.id,
    version,
    verdict: version === 'before' ? ('blocked' as const) : ('passed' as const),
    evidence: [evidence(condition.id, version)],
  }))

const validFlightRecord = {
  id: 'flight-record-focus-list',
  replayCase: validReplayCase,
  before: runs('before'),
  finding: {
    id: 'finding-save-feedback',
    title: '저장 완료 여부를 확인할 수 없다',
    severity: 'blocker' as const,
    evidenceIds: validReplayCase.conditions.map(
      (condition) => `before-${condition.id}-evidence`,
    ),
  },
  patch: {
    id: 'patch-save-feedback',
    title: '저장 상태를 지속적으로 표시한다',
    summary: '저장 중과 저장 완료 상태를 명시한다',
    diff: '+ <p role="status">저장 완료</p>',
    status: 'proposed' as const,
  },
  after: runs('after'),
  comparison: {
    missionId: validReplayCase.mission.id,
    beforePassed: 0,
    afterPassed: 3,
    verdict: 'improved' as const,
    unresolvedConditionIds: [],
  },
  generatedAt: '2026-08-16T04:01:00.000Z',
}

describe('parseFlightRecord', () => {
  it('accepts an evidence-backed before and identical-condition replay', () => {
    const record = parseFlightRecord(validFlightRecord)

    expect(record.before).toHaveLength(3)
    expect(record.after).toHaveLength(3)
    expect(record.comparison.verdict).toBe('improved')
    expect(Object.isFrozen(record.after[0].evidence)).toBe(true)
  })

  it('rejects a finding that cites unknown evidence', () => {
    const invalidRecord = {
      ...validFlightRecord,
      finding: {
        ...validFlightRecord.finding,
        evidenceIds: ['missing-evidence'],
      },
    }

    expect(() => parseFlightRecord(invalidRecord)).toThrow(
      /unknown evidence/i,
    )
  })

  it('rejects replay runs that change the declared conditions', () => {
    const invalidRecord = {
      ...validFlightRecord,
      after: validFlightRecord.after.map((run, index) =>
        index === 0 ? { ...run, conditionId: 'new-condition' } : run,
      ),
    }

    expect(() => parseFlightRecord(invalidRecord)).toThrow(
      /identical conditions/i,
    )
  })

  it('accepts partial when an after infrastructure failure prevents comparison', () => {
    const after = validFlightRecord.after.map((run, index) => ({
      ...run,
      verdict:
        index === 0
          ? ('infrastructure-failure' as const)
          : ('blocked' as const),
    }))
    const record = parseFlightRecord({
      ...validFlightRecord,
      after,
      comparison: {
        ...validFlightRecord.comparison,
        afterPassed: 0,
        verdict: 'partial' as const,
        unresolvedConditionIds: after.map((run) => run.conditionId),
      },
    })

    expect(record.comparison.verdict).toBe('partial')
  })

  it('accepts partial when baseline infrastructure prevents comparison', () => {
    const before = validFlightRecord.before.map((run, index) => ({
      ...run,
      verdict:
        index === 0
          ? ('infrastructure-failure' as const)
          : ('blocked' as const),
    }))
    const record = parseFlightRecord({
      ...validFlightRecord,
      before,
      comparison: {
        ...validFlightRecord.comparison,
        verdict: 'partial' as const,
      },
    })

    expect(record.comparison.verdict).toBe('partial')
  })

  it('rejects comparison values that contradict the replay runs', () => {
    const invalidRecord = {
      ...validFlightRecord,
      comparison: {
        ...validFlightRecord.comparison,
        afterPassed: 2,
        verdict: 'partial' as const,
        unresolvedConditionIds: [validReplayCase.conditions[2].id],
      },
    }

    expect(() => parseFlightRecord(invalidRecord)).toThrow(
      /comparison must match/i,
    )
  })

  it('exports the identical mission and conditions as a frozen regression seed', () => {
    const record = parseFlightRecord(validFlightRecord)
    const seed = createRegressionSeed(record)

    expect(seed.schemaVersion).toBe(1)
    expect(seed.mission).toEqual(record.replayCase.mission)
    expect(seed.conditions).toEqual(record.replayCase.conditions)
    expect(seed.expectedPassedConditionIds).toEqual(
      validReplayCase.conditions.map((condition) => condition.id),
    )
    expect(Object.isFrozen(seed.expectedPassedConditionIds)).toBe(true)
  })
})
