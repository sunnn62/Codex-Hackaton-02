import { describe, expect, it } from 'vitest'

import {
  isAllowedNavigation,
  isDestructiveAction,
} from '@/lib/runner/safety-policy'

describe('browser safety policy', () => {
  it('allows navigation within the tested origin', () => {
    expect(
      isAllowedNavigation(
        'https://demo.test/start',
        'https://demo.test/tasks',
      ),
    ).toBe(true)
  })

  it('blocks navigation outside the tested origin', () => {
    expect(
      isAllowedNavigation('https://demo.test/start', 'https://evil.test'),
    ).toBe(false)
  })

  it('blocks destructive account actions in Korean and English', () => {
    expect(
      isDestructiveAction({ type: 'click', accessibleName: 'Delete account' }),
    ).toBe(true)
    expect(
      isDestructiveAction({ type: 'click', accessibleName: '계정 삭제' }),
    ).toBe(true)
  })

  it('allows an ordinary save action', () => {
    expect(
      isDestructiveAction({ type: 'click', accessibleName: 'Save task' }),
    ).toBe(false)
  })
})
