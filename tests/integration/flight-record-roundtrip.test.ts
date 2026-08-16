import { describe, expect, it } from 'vitest'

import {
  createRegressionSeed,
  parseFlightRecord,
} from '@/lib/contracts/replay'
import { createDemoFlightRecord } from '@/lib/replay/demo-flight'

describe('Flight Record integration', () => {
  it('round-trips the demo record into a reusable regression seed', () => {
    const originalRecord = createDemoFlightRecord()
    const restoredRecord = parseFlightRecord(
      JSON.parse(JSON.stringify(originalRecord)),
    )
    const seed = createRegressionSeed(restoredRecord)

    expect(restoredRecord.replayCase.conditions).toHaveLength(3)
    expect(seed.mission.id).toBe(restoredRecord.replayCase.mission.id)
    expect(seed.conditions).toEqual(restoredRecord.replayCase.conditions)
    expect(seed.expectedPassedConditionIds).toEqual(
      restoredRecord.after.map((run) => run.conditionId),
    )
    expect(seed.unresolvedConditionIds).toEqual([])
  })
})
