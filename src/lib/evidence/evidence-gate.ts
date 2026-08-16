import type { ConditionRun, Finding } from '@/lib/contracts/replay'

export type EvidenceValidation =
  | {
      readonly accepted: true
      readonly unknownEvidenceIds: readonly []
    }
  | {
      readonly accepted: false
      readonly unknownEvidenceIds: readonly string[]
    }

export function validateFindingEvidence(
  finding: Finding,
  beforeRuns: readonly ConditionRun[],
): EvidenceValidation {
  const knownEvidenceIds = new Set(
    beforeRuns.flatMap((run) => run.evidence.map((evidence) => evidence.id)),
  )
  const unknownEvidenceIds = [
    ...new Set(
      finding.evidenceIds.filter((evidenceId) => !knownEvidenceIds.has(evidenceId)),
    ),
  ]

  if (unknownEvidenceIds.length > 0) {
    return Object.freeze({
      accepted: false as const,
      unknownEvidenceIds: Object.freeze(unknownEvidenceIds),
    })
  }

  return Object.freeze({
    accepted: true as const,
    unknownEvidenceIds: Object.freeze([]) as readonly [],
  })
}

export function assertFindingEvidence(
  finding: Finding,
  beforeRuns: readonly ConditionRun[],
): void {
  const validation = validateFindingEvidence(finding, beforeRuns)

  if (!validation.accepted) {
    throw new Error(
      `Finding cites unknown evidence: ${validation.unknownEvidenceIds.join(', ')}`,
    )
  }
}
