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
    const after = record.after.map((run, index) =>
      index === 2 ? { ...run, conditionId: 'unexpected-condition' } : run,
    )

    expect(() =>
      createReplayComparison(
        record.replayCase.mission.id,
        record.before,
        after,
      ),
    ).toThrow(/same condition set/i)
  })

  it('requires exactly three before and after runs', () => {
    const record = createDemoFlightRecord()

    expect(() =>
      createReplayComparison(
        record.replayCase.mission.id,
        record.before.slice(0, 2),
        record.after.slice(0, 2),
      ),
    ).toThrow(/three distinct condition IDs/i)
  })

  it('round-trips a deterministic regression seed', () => {
    const record = createDemoFlightRecord()
    const serializedSeed = JSON.stringify(createRegressionSeed(record))

    expect(regressionSeedSchema.parse(JSON.parse(serializedSeed))).toEqual(
      createRegressionSeed(record),
    )
  })

  it('rejects before or after runs with swapped versions', () => {
    const record = createDemoFlightRecord()
    const beforeWithAfterVersion = record.before.map((run, index) =>
      index === 0 ? { ...run, version: 'after' as const } : run,
    )
    const afterWithBeforeVersion = record.after.map((run, index) =>
      index === 0 ? { ...run, version: 'before' as const } : run,
    )

    expect(() =>
      createReplayComparison(
        record.replayCase.mission.id,
        beforeWithAfterVersion,
        record.after,
      ),
    ).toThrow(/before.*version/i)
    expect(() =>
      createReplayComparison(
        record.replayCase.mission.id,
        record.before,
        afterWithBeforeVersion,
      ),
    ).toThrow(/after.*version/i)
  })

  it('rejects three duplicate condition IDs', () => {
    const record = createDemoFlightRecord()
    const before = record.before.map((run) => ({
      ...run,
      conditionId: record.before[0].conditionId,
    }))

    expect(() =>
      createReplayComparison(record.replayCase.mission.id, before, record.after),
    ).toThrow(/three distinct condition IDs/i)
  })

  it('rejects runs from a different mission', () => {
    const record = createDemoFlightRecord()
    const after = record.after.map((run, index) =>
      index === 0 ? { ...run, missionId: 'different-mission' } : run,
    )

    expect(() =>
      createReplayComparison(record.replayCase.mission.id, record.before, after),
    ).toThrow(/declared mission/i)
  })

  it('reports a regression when fewer replay runs pass', () => {
    const record = createDemoFlightRecord()
    const before = record.before.map((run, index) =>
      index === 0 ? { ...run, verdict: 'passed' as const } : run,
    )
    const after = record.after.map((run) => ({
      ...run,
      verdict: 'blocked' as const,
    }))

    expect(
      createReplayComparison(record.replayCase.mission.id, before, after).verdict,
    ).toBe('regressed')
  })

  it('reports no change when the pass count stays the same', () => {
    const record = createDemoFlightRecord()
    const before = record.before.map((run, index) =>
      index === 0 ? { ...run, verdict: 'passed' as const } : run,
    )
    const after = record.after.map((run, index) =>
      index === 0 ? run : { ...run, verdict: 'blocked' as const },
    )

    expect(
      createReplayComparison(record.replayCase.mission.id, before, after).verdict,
    ).toBe('no-change')
  })

  it('returns partial when infrastructure failure keeps the pass count the same', () => {
    const record = createDemoFlightRecord()
    const after = record.after.map((run, index) => ({
      ...run,
      verdict:
        index === 0
          ? ('infrastructure-failure' as const)
          : ('blocked' as const),
    }))

    expect(
      createReplayComparison(record.replayCase.mission.id, record.before, after)
        .verdict,
    ).toBe('partial')
  })

  it('returns partial when infrastructure failure accompanies fewer passing runs', () => {
    const record = createDemoFlightRecord()
    const before = record.before.map((run) => ({
      ...run,
      verdict: 'passed' as const,
    }))
    const after = record.after.map((run, index) => ({
      ...run,
      verdict:
        index === 0
          ? ('infrastructure-failure' as const)
          : ('blocked' as const),
    }))

    expect(
      createReplayComparison(record.replayCase.mission.id, before, after).verdict,
    ).toBe('partial')
  })

  it('sorts multiple unresolved condition IDs deterministically', () => {
    const record = createDemoFlightRecord()
    const after = [
      { ...record.after[2], verdict: 'blocked' as const },
      { ...record.after[0], verdict: 'blocked' as const },
      { ...record.after[1], verdict: 'blocked' as const },
    ]

    expect(
      createReplayComparison(record.replayCase.mission.id, record.before, after)
        .unresolvedConditionIds,
    ).toEqual([
      'low-patience-delayed-feedback',
      'reduced-inference-ambiguous-copy',
      'touch-small-viewport',
    ])
  })
})
