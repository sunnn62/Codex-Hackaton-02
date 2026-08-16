import { describe, expect, it } from 'vitest'

import { createRegressionSeed, regressionSeedSchema } from '@/lib/contracts/replay'
import { createReplayComparison } from '@/lib/replay/replay-comparison'
import { createDemoFlightRecord } from '@/lib/replay/demo-flight'

describe('createReplayComparison', () => {
  it('returns a partial verdict when one after replay remains blocked', () => {
    const record = createDemoFlightRecord()
    const unresolvedRun = record.after[2]
    const after = record.after.map((run) =>
      run.conditionId === unresolvedRun.conditionId
        ? { ...run, verdict: 'blocked' as const }
        : run,
    )

    const comparison = createReplayComparison(
      record.replayCase.mission.id,
      record.before,
      after,
    )

    expect(comparison).toEqual({
      missionId: record.replayCase.mission.id,
      beforePassed: 0,
      afterPassed: 2,
      verdict: 'partial',
      unresolvedConditionIds: [unresolvedRun.conditionId],
    })
    expect(Object.isFrozen(comparison)).toBe(true)
    expect(Object.isFrozen(comparison.unresolvedConditionIds)).toBe(true)
    expect(record.after[2].verdict).toBe('passed')
  })

  it('keeps an infrastructure failure distinct and unresolved', () => {
    const record = createDemoFlightRecord()
    const failedRun = record.after[1]
    const after = record.after.map((run) =>
      run.conditionId === failedRun.conditionId
        ? { ...run, verdict: 'infrastructure-failure' as const }
        : run,
    )

    const comparison = createReplayComparison(
      record.replayCase.mission.id,
      record.before,
      after,
    )

    expect(after[1].verdict).toBe('infrastructure-failure')
    expect(comparison.verdict).toBe('partial')
    expect(comparison.unresolvedConditionIds).toEqual([failedRun.conditionId])
  })

  it('rejects before and after runs with different declared conditions', () => {
    const record = createDemoFlightRecord()

    expect(() =>
      createReplayComparison(
        record.replayCase.mission.id,
        record.before,
        record.after.slice(0, 2),
      ),
    ).toThrow(/identical conditions/i)
  })

  it('requires exactly three before and after runs', () => {
    const record = createDemoFlightRecord()

    expect(() =>
      createReplayComparison(
        record.replayCase.mission.id,
        record.before.slice(0, 2),
        record.after.slice(0, 2),
      ),
    ).toThrow(/identical conditions/i)
  })

  it('round-trips a deterministic regression seed', () => {
    const record = createDemoFlightRecord()
    const serializedSeed = JSON.stringify(createRegressionSeed(record))

    expect(regressionSeedSchema.parse(JSON.parse(serializedSeed))).toEqual(
      createRegressionSeed(record),
    )
  })
})
