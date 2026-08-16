import type {
  ConditionRun,
  ReplayComparison,
} from '@/lib/contracts/replay'

function sortedConditionIds(runs: readonly ConditionRun[]): string[] {
  return runs.map((run) => run.conditionId).sort()
}

function hasIdenticalConditions(
  before: readonly ConditionRun[],
  after: readonly ConditionRun[],
): boolean {
  return (
    JSON.stringify(sortedConditionIds(before)) ===
    JSON.stringify(sortedConditionIds(after))
  )
}

function replayVerdict(
  beforePassed: number,
  afterPassed: number,
  hasUnresolvedConditions: boolean,
): ReplayComparison['verdict'] {
  if (afterPassed < beforePassed) {
    return 'regressed'
  }
  if (afterPassed === beforePassed) {
    return 'no-change'
  }
  return hasUnresolvedConditions ? 'partial' : 'improved'
}

export function createReplayComparison(
  missionId: string,
  before: readonly ConditionRun[],
  after: readonly ConditionRun[],
): ReplayComparison {
  if (
    before.length !== 3 ||
    after.length !== 3 ||
    !hasIdenticalConditions(before, after)
  ) {
    throw new Error('Before and after runs must use identical conditions')
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

  return Object.freeze({
    missionId,
    beforePassed,
    afterPassed,
    verdict: replayVerdict(
      beforePassed,
      afterPassed,
      unresolvedConditionIds.length > 0,
    ),
    unresolvedConditionIds: Object.freeze(unresolvedConditionIds),
  })
}
