import { z } from 'zod'

export const missionContractSchema = z
  .object({
    id: z.string().trim().min(1).max(80),
    title: z.string().trim().min(5).max(160),
    startState: z.string().trim().min(3).max(240),
    successCriterion: z.string().trim().min(5).max(240),
    failureCriterion: z.string().trim().min(5).max(240),
  })
  .strict()
  .readonly()

export const faultConditionSchema = z
  .object({
    id: z.string().trim().min(1).max(80),
    label: z.string().trim().min(3).max(120),
    constraints: z
      .object({
        viewport: z.enum(['small-mobile', 'large-mobile', 'desktop']),
        inputMode: z.enum(['touch', 'keyboard', 'mouse']),
        patience: z.enum(['low', 'standard']),
        inference: z.enum(['reduced', 'standard']),
      })
      .strict()
      .readonly(),
  })
  .strict()
  .readonly()

const threeFaultConditionsSchema = z
  .tuple([faultConditionSchema, faultConditionSchema, faultConditionSchema])
  .readonly()

const runVersionSchema = z.enum(['before', 'after'])

export const replayCaseSchema = z
  .object({
    id: z.string().trim().min(1).max(80),
    mission: missionContractSchema,
    conditions: threeFaultConditionsSchema,
  })
  .strict()
  .readonly()

export const actionEvidenceSchema = z
  .object({
    id: z.string().trim().min(1).max(120),
    conditionId: z.string().trim().min(1).max(80),
    version: runVersionSchema,
    sequence: z.number().int().nonnegative(),
    screen: z
      .object({
        id: z.string().trim().min(1).max(120),
        title: z.string().trim().min(1).max(160),
      })
      .strict()
      .readonly(),
    action: z
      .object({
        type: z.enum(['click', 'fill', 'press', 'wait', 'finish']),
        target: z.string().trim().min(1).max(120).optional(),
        description: z.string().trim().min(3).max(240),
      })
      .strict()
      .readonly(),
    outcome: z.enum(['attempted', 'succeeded', 'blocked']),
    capturedAt: z.string().datetime(),
  })
  .strict()
  .readonly()

export const findingSchema = z
  .object({
    id: z.string().trim().min(1).max(120),
    title: z.string().trim().min(5).max(200),
    severity: z.enum(['blocker', 'warning']),
    evidenceIds: z.array(z.string().trim().min(1)).min(1).readonly(),
  })
  .strict()
  .readonly()

export const patchProposalSchema = z
  .object({
    id: z.string().trim().min(1).max(120),
    title: z.string().trim().min(5).max(200),
    summary: z.string().trim().min(5).max(500),
    diff: z.string().trim().min(1).max(10_000),
    status: z.enum(['proposed', 'approved', 'rejected']),
  })
  .strict()
  .readonly()

export const conditionRunSchema = z
  .object({
    missionId: z.string().trim().min(1).max(80),
    conditionId: z.string().trim().min(1).max(80),
    version: runVersionSchema,
    verdict: z.enum(['passed', 'blocked', 'infrastructure-failure']),
    evidence: z.array(actionEvidenceSchema).min(1).readonly(),
  })
  .strict()
  .readonly()

export const replayComparisonSchema = z
  .object({
    missionId: z.string().trim().min(1).max(80),
    beforePassed: z.number().int().min(0).max(3),
    afterPassed: z.number().int().min(0).max(3),
    verdict: z.enum(['improved', 'partial', 'no-change', 'regressed']),
    unresolvedConditionIds: z.array(z.string().trim().min(1)).readonly(),
  })
  .strict()
  .readonly()

export function deriveReplayVerdict(
  beforePassed: number,
  afterPassed: number,
  hasUnresolvedConditions: boolean,
  hasInfrastructureFailure: boolean,
): z.infer<typeof replayComparisonSchema>['verdict'] {
  if (hasInfrastructureFailure) {
    return 'partial'
  }
  if (afterPassed < beforePassed) {
    return 'regressed'
  }
  if (afterPassed === beforePassed) {
    return 'no-change'
  }
  return hasUnresolvedConditions ? 'partial' : 'improved'
}

const conditionRunsSchema = z
  .tuple([conditionRunSchema, conditionRunSchema, conditionRunSchema])
  .readonly()

export const flightRecordSchema = z
  .object({
    id: z.string().trim().min(1).max(120),
    replayCase: replayCaseSchema,
    before: conditionRunsSchema,
    finding: findingSchema,
    patch: patchProposalSchema,
    after: conditionRunsSchema,
    comparison: replayComparisonSchema,
    generatedAt: z.string().datetime(),
  })
  .strict()
  .superRefine((record, context) => {
    const expectedConditionIds = record.replayCase.conditions
      .map((condition) => condition.id)
      .sort()
    const beforeConditionIds = record.before
      .map((run) => run.conditionId)
      .sort()
    const afterConditionIds = record.after.map((run) => run.conditionId).sort()

    if (
      JSON.stringify(beforeConditionIds) !==
        JSON.stringify(expectedConditionIds) ||
      JSON.stringify(afterConditionIds) !== JSON.stringify(expectedConditionIds)
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Before and after runs must use identical conditions',
      })
    }

    const missionIds = [
      ...record.before.map((run) => run.missionId),
      ...record.after.map((run) => run.missionId),
      record.comparison.missionId,
    ]
    if (missionIds.some((id) => id !== record.replayCase.mission.id)) {
      context.addIssue({
        code: 'custom',
        message: 'Every run must use the declared mission',
      })
    }

    const evidenceIds = new Set(
      record.before.flatMap((run) => run.evidence.map((item) => item.id)),
    )
    if (record.finding.evidenceIds.some((id) => !evidenceIds.has(id))) {
      context.addIssue({
        code: 'custom',
        message: 'Finding cites unknown evidence',
      })
    }

    const invalidEvidence = [...record.before, ...record.after].some((run) =>
      run.evidence.some(
        (item) =>
          item.conditionId !== run.conditionId || item.version !== run.version,
      ),
    )
    if (invalidEvidence) {
      context.addIssue({
        code: 'custom',
        message: 'Evidence must belong to its condition run',
      })
    }

    const beforePassed = record.before.filter(
      (run) => run.verdict === 'passed',
    ).length
    const afterPassed = record.after.filter(
      (run) => run.verdict === 'passed',
    ).length
    const unresolvedConditionIds = record.after
      .filter((run) => run.verdict !== 'passed')
      .map((run) => run.conditionId)
      .sort()
    const declaredUnresolvedConditionIds = [
      ...record.comparison.unresolvedConditionIds,
    ].sort()
    const hasInfrastructureFailure = [...record.before, ...record.after].some(
      (run) => run.verdict === 'infrastructure-failure',
    )
    const expectedVerdict = deriveReplayVerdict(
      beforePassed,
      afterPassed,
      unresolvedConditionIds.length > 0,
      hasInfrastructureFailure,
    )

    if (
      record.comparison.beforePassed !== beforePassed ||
      record.comparison.afterPassed !== afterPassed ||
      record.comparison.verdict !== expectedVerdict ||
      JSON.stringify(declaredUnresolvedConditionIds) !==
        JSON.stringify(unresolvedConditionIds)
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Comparison must match the before and after runs',
      })
    }
  })
  .readonly()

export const regressionSeedSchema = z
  .object({
    schemaVersion: z.literal(1),
    sourceFlightRecordId: z.string().trim().min(1).max(120),
    mission: missionContractSchema,
    conditions: threeFaultConditionsSchema,
    expectedPassedConditionIds: z
      .array(z.string().trim().min(1).max(80))
      .readonly(),
    unresolvedConditionIds: z
      .array(z.string().trim().min(1).max(80))
      .readonly(),
  })
  .strict()
  .readonly()

export type MissionContract = z.infer<typeof missionContractSchema>
export type FaultCondition = z.infer<typeof faultConditionSchema>
export type ReplayCase = z.infer<typeof replayCaseSchema>
export type ActionEvidence = z.infer<typeof actionEvidenceSchema>
export type Finding = z.infer<typeof findingSchema>
export type PatchProposal = z.infer<typeof patchProposalSchema>
export type ConditionRun = z.infer<typeof conditionRunSchema>
export type ReplayComparison = z.infer<typeof replayComparisonSchema>
export type FlightRecord = z.infer<typeof flightRecordSchema>
export type RegressionSeed = z.infer<typeof regressionSeedSchema>

export function parseReplayCase(input: unknown): ReplayCase {
  return replayCaseSchema.parse(input)
}

export function parseFlightRecord(input: unknown): FlightRecord {
  return flightRecordSchema.parse(input)
}

export function createRegressionSeed(record: FlightRecord): RegressionSeed {
  const verdictByCondition = new Map(
    record.after.map((run) => [run.conditionId, run.verdict]),
  )
  const conditionIds = record.replayCase.conditions.map(
    (condition) => condition.id,
  )

  return regressionSeedSchema.parse({
    schemaVersion: 1,
    sourceFlightRecordId: record.id,
    mission: record.replayCase.mission,
    conditions: record.replayCase.conditions,
    expectedPassedConditionIds: conditionIds.filter(
      (conditionId) => verdictByCondition.get(conditionId) === 'passed',
    ),
    unresolvedConditionIds: conditionIds.filter(
      (conditionId) => verdictByCondition.get(conditionId) !== 'passed',
    ),
  })
}
