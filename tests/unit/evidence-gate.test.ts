import { describe, expect, it } from 'vitest'

import {
  assertFindingEvidence,
  validateFindingEvidence,
} from '@/lib/evidence/evidence-gate'
import { createDemoFlightRecord } from '@/lib/replay/demo-flight'

describe('evidence gate', () => {
  it('accepts a finding grounded in before-run evidence', () => {
    const record = createDemoFlightRecord()

    expect(validateFindingEvidence(record.finding, record.before)).toEqual({
      accepted: true,
      unknownEvidenceIds: [],
    })
  })

  it('rejects a finding that cites an unknown evidence ID', () => {
    const record = createDemoFlightRecord()
    const finding = {
      ...record.finding,
      evidenceIds: ['missing-evidence'],
    }

    expect(validateFindingEvidence(finding, record.before)).toEqual({
      accepted: false,
      unknownEvidenceIds: ['missing-evidence'],
    })
    expect(() => assertFindingEvidence(finding, record.before)).toThrow(
      /unknown evidence/i,
    )
  })

  it('does not mutate the supplied evidence or finding', () => {
    const record = createDemoFlightRecord()
    const evidenceIds = [...record.finding.evidenceIds]
    const evidence = record.before.flatMap((run) => run.evidence)

    validateFindingEvidence(record.finding, record.before)

    expect(record.finding.evidenceIds).toEqual(evidenceIds)
    expect(record.before.flatMap((run) => run.evidence)).toEqual(evidence)
  })
})
