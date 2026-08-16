// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { ReplayCourt } from '@/components/replay-court'
import { parseFlightRecord } from '@/lib/contracts/replay'
import { createDemoFlightRecord } from '@/lib/replay/demo-flight'

afterEach(cleanup)

function reachReplay(): void {
  fireEvent.click(screen.getByRole('button', { name: '3개 조건 병렬 실행' }))
  fireEvent.click(screen.getByRole('button', { name: 'Codex 최소 수정 검토' }))
  fireEvent.click(screen.getByRole('button', { name: '승인 후 동일 조건 재실행' }))
}

describe('ReplayCourt', () => {
  it('introduces one mission and exactly three declared conditions', () => {
    render(<ReplayCourt record={createDemoFlightRecord()} />)

    expect(
      screen.getByRole('heading', {
        name: '할 일을 만들고 오늘 목록에 추가한다',
      }),
    ).toBeTruthy()
    expect(screen.getAllByTestId('fault-condition')).toHaveLength(3)
    expect(screen.getByText('Synthetic ≠ 실제 사용자 예측')).toBeTruthy()
  })

  it('moves through evidence, patch review, and identical replay', () => {
    render(<ReplayCourt record={createDemoFlightRecord()} />)

    fireEvent.click(
      screen.getByRole('button', { name: '3개 조건 병렬 실행' }),
    )
    expect(screen.getByText('BEFORE · 0/3 PASS')).toBeTruthy()
    expect(screen.getAllByTestId('evidence-id')).toHaveLength(3)

    fireEvent.click(
      screen.getByRole('button', { name: 'Codex 최소 수정 검토' }),
    )
    expect(screen.getByText(/할 일 저장/)).toBeTruthy()

    fireEvent.click(
      screen.getByRole('button', { name: '승인 후 동일 조건 재실행' }),
    )
    expect(screen.getByText('AFTER · 3/3 PASS')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Flight Record' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Regression seed 저장' })).toBeTruthy()
  })

  it('keeps a partial replay on hold and maps results by condition id', () => {
    const baseRecord = createDemoFlightRecord()
    const blockedRun = baseRecord.after[2]
    const partialRecord = parseFlightRecord({
      ...baseRecord,
      after: [
        {
          ...blockedRun,
          verdict: 'blocked',
          evidence: blockedRun.evidence.map((item) => ({
            ...item,
            outcome: 'blocked',
          })),
        },
        baseRecord.after[1],
        baseRecord.after[0],
      ],
      comparison: {
        ...baseRecord.comparison,
        afterPassed: 2,
        verdict: 'partial',
        unresolvedConditionIds: [blockedRun.conditionId],
      },
    })

    render(<ReplayCourt record={partialRecord} />)
    reachReplay()

    expect(screen.getByText('AFTER · 2/3 PASS')).toBeTruthy()
    expect(screen.getByText('HOLD')).toBeTruthy()
    expect(screen.queryByText('CLEARED')).toBeNull()
    expect(
      within(screen.getByTestId(`after-run-${blockedRun.conditionId}`)).getByText(
        baseRecord.replayCase.conditions[2].label,
      ),
    ).toBeTruthy()
    expect(
      within(screen.getByTestId(`after-run-${blockedRun.conditionId}`)).getByText(
        'BLOCKED',
      ),
    ).toBeTruthy()
  })
})
