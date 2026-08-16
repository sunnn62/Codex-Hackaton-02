import { describe, expect, it } from 'vitest'

import {
  createDemoFlightRecord,
  demoReplayCase,
} from '@/lib/replay/demo-flight'
import { createRegressionSeed } from '@/lib/contracts/replay'

describe('createDemoFlightRecord', () => {
  it('produces three failed before runs and three successful identical replays', () => {
    const record = createDemoFlightRecord()

    expect(record.replayCase).toEqual(demoReplayCase)
    expect(record.before.map((run) => run.verdict)).toEqual([
      'blocked',
      'blocked',
      'blocked',
    ])
    expect(record.after.map((run) => run.verdict)).toEqual([
      'passed',
      'passed',
      'passed',
    ])
    expect(record.before.map((run) => run.conditionId)).toEqual(
      record.after.map((run) => run.conditionId),
    )
  })

  it('grounds the accepted blocker in known before-run evidence', () => {
    const record = createDemoFlightRecord()
    const beforeEvidenceIds = new Set(
      record.before.flatMap((run) => run.evidence.map((item) => item.id)),
    )

    expect(record.finding.severity).toBe('blocker')
    expect(record.finding.evidenceIds).toHaveLength(3)
    expect(
      record.finding.evidenceIds.every((id) => beforeEvidenceIds.has(id)),
    ).toBe(true)
  })

  it('exports a passing regression seed after replay', () => {
    const seed = createRegressionSeed(createDemoFlightRecord())

    expect(seed.expectedPassedConditionIds).toHaveLength(3)
    expect(seed.unresolvedConditionIds).toEqual([])
  })
})
