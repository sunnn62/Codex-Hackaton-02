import {
  deriveReplayVerdict,
  type ConditionRun,
  type ReplayComparison,
} from '@/lib/contracts/replay'

function sortedConditionIds(runs: readonly ConditionRun[]): string[] {
  return runs.map((run) => run.conditionId).sort()
}

function assertRunVersions(
  runs: readonly ConditionRun[],
  expectedVersion: ConditionRun['version'],
  label: 'Before' | 'After',
): void {
  if (runs.some((run) => run.version !== expectedVersion)) {
    throw new Error(`${label} runs must use version "${expectedVersion}"`)
  }
}

function assertThreeDistinctConditionIds(
  runs: readonly ConditionRun[],
  label: 'Before' | 'After',
): Set<string> {
  const conditionIds = new Set(runs.map((run) => run.conditionId))

  if (runs.length !== 3 || conditionIds.size !== 3) {
    throw new Error(`${label} runs must contain exactly three distinct condition IDs`)
  }

  return conditionIds
}

function hasSameConditionSet(
  before: readonly ConditionRun[],
  after: readonly ConditionRun[],
): boolean {
  return (
    JSON.stringify(sortedConditionIds(before)) ===
    JSON.stringify(sortedConditionIds(after))
  )
}

export function createReplayComparison(
  missionId: string,
  before: readonly ConditionRun[],
  after: readonly ConditionRun[],
): ReplayComparison {
  assertRunVersions(before, 'before', 'Before')
  assertRunVersions(after, 'after', 'After')
  assertThreeDistinctConditionIds(before, 'Before')
  assertThreeDistinctConditionIds(after, 'After')

  if (!hasSameConditionSet(before, after)) {
    throw new Error('Before and after runs must use the same condition set')
  }

  if ([...before, ...after].some((run) => run.missionId !== missionId)) {
    throw new Error('Before and after runs must use the declared mission')
  }

  const beforePassed = before.filter((run) => run.verdict === 'passed').length
  const afterPassed = after.filter((run) => run.verdict === 'passed').length
  const unresolvedConditionIds = after
    .filter((run) => run.verdict !== 'passed')
    .map((run) => run.conditionId)
    .sort()
  const hasInfrastructureFailure = [...before, ...after].some(
    (run) => run.verdict === 'infrastructure-failure',
  )

  return Object.freeze({
    missionId,
    beforePassed,
    afterPassed,
    verdict: deriveReplayVerdict(
      beforePassed,
      afterPassed,
      unresolvedConditionIds.length > 0,
      hasInfrastructureFailure,
    ),
    unresolvedConditionIds: Object.freeze(unresolvedConditionIds),
  })
}
