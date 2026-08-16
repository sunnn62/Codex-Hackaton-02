import { describe, expect, it } from 'vitest'

import {
  createRegressionSeed,
  parseFlightRecord,
} from '@/lib/contracts/replay'
import { createDemoFlightRecord } from '@/lib/replay/demo-flight'

describe('Replay Court trust boundaries', () => {
  it('rejects a finding that cites unknown before evidence', () => {
    const record = createDemoFlightRecord()

    expect(() =>
      parseFlightRecord({
        ...record,
        finding: { ...record.finding, evidenceIds: ['unknown-evidence-id'] },
      }),
    ).toThrow('Finding cites unknown evidence')
  })

  it('does not permit a partial after run to claim CLEARED semantics', () => {
    const record = createDemoFlightRecord()
    const failedRun = record.after[0]

    expect(() =>
      parseFlightRecord({
        ...record,
        after: [
          { ...failedRun, verdict: 'blocked' as const },
          record.after[1],
          record.after[2],
        ],
      }),
    ).toThrow('Comparison must match the before and after runs')
  })

  it('preserves infrastructure failure as unresolved rather than UX success', () => {
    const record = createDemoFlightRecord()
    const failedRun = record.after[0]
    const infrastructureRecord = parseFlightRecord({
      ...record,
      after: [
        { ...failedRun, verdict: 'infrastructure-failure' as const },
        record.after[1],
        record.after[2],
      ],
      comparison: {
        ...record.comparison,
        afterPassed: 2,
        verdict: 'partial' as const,
        unresolvedConditionIds: [failedRun.conditionId],
      },
    })

    const seed = createRegressionSeed(infrastructureRecord)
    expect(seed.expectedPassedConditionIds).toHaveLength(2)
    expect(seed.unresolvedConditionIds).toEqual([failedRun.conditionId])
  })
})
