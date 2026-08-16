import { expect, test, type Page } from '@playwright/test'

const screenshotDir = 'docs/assets/screenshots'

async function reachReplay(page: Page) {
  await page.getByRole('button', { name: '3개 조건 병렬 실행' }).click()
  await page.getByRole('button', { name: 'Codex 최소 수정 검토' }).click()
  await page.getByRole('button', { name: '승인 후 동일 조건 재실행' }).click()
}

test('completes the evidence-to-identical-replay demo without credentials', async ({ page }) => {
  const startedAt = Date.now()
  const consoleErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })

  await page.goto('/replay/focus-list')
  await expect(
    page.getByRole('heading', { name: '할 일을 만들고 오늘 목록에 추가한다' }),
  ).toBeVisible()
  await expect(page.getByTestId('fault-condition')).toHaveCount(3)

  await page.getByRole('button', { name: '3개 조건 병렬 실행' }).click()
  await expect(page.getByRole('heading', { name: 'BEFORE · 0/3 PASS' })).toBeVisible()
  await expect(page.getByText('RELEASE BLOCKER')).toBeVisible()
  await expect(page.getByTestId('evidence-id')).toHaveCount(3)
  await expect(page.getByTestId('evidence-id')).toHaveText([
    'before-touch-small-viewport-evidence',
    'before-low-patience-delayed-feedback-evidence',
    'before-reduced-inference-ambiguous-copy-evidence',
  ])

  await page.screenshot({ path: `${screenshotDir}/before-evidence-desktop.png`, fullPage: true })

  await page.getByRole('button', { name: 'Codex 최소 수정 검토' }).click()
  await expect(page.getByLabel('minimal code diff')).toContainText('할 일 저장')
  await expect(page.getByText('04 / CODEX PATCH')).toBeVisible()
  await expect(
    page.getByRole('button', { name: '승인 후 동일 조건 재실행' }),
  ).toBeVisible()

  await page.getByRole('button', { name: '승인 후 동일 조건 재실행' }).click()
  await expect(page.getByText('CLEARED', { exact: true })).toBeVisible()
  await expect(page.getByText('AFTER · 3/3 PASS')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Flight Record' })).toBeVisible()
  await expect(page.getByText('APPROVED · REPLAYED')).toBeVisible()
  await expect(page.getByText('Synthetic ≠ 실제 사용자 예측')).toBeVisible()
  expect(consoleErrors).toEqual([])
  expect(Date.now() - startedAt).toBeLessThan(90_000)

  await page.screenshot({ path: `${screenshotDir}/after-flight-record-desktop.png`, fullPage: true })
})

test('downloads a regression seed after a truthful replay verdict', async ({ page }) => {
  await page.goto('/replay/focus-list')
  await reachReplay(page)

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Regression seed 저장' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('personaflight-regression-seed.json')
  await download.saveAs('docs/assets/regression-seed/personaflight-regression-seed.json')
})

test('exposes keyboard focus and text status for every critical action', async ({ page }) => {
  await page.goto('/replay/focus-list')

  const execute = page.getByRole('button', { name: '3개 조건 병렬 실행' })
  await execute.focus()
  await expect(execute).toBeFocused()
  await execute.press('Enter')
  await expect(page.getByRole('heading', { name: 'BEFORE · 0/3 PASS' })).toBeVisible()

  const review = page.getByRole('button', { name: 'Codex 최소 수정 검토' })
  await review.focus()
  await review.press('Enter')
  await expect(page.getByText('04 / CODEX PATCH')).toBeVisible()

  const approve = page.getByRole('button', { name: '승인 후 동일 조건 재실행' })
  await approve.focus()
  await approve.press('Enter')
  await expect(page.getByText('AFTER · 3/3 PASS')).toBeVisible()

  const seed = page.getByRole('link', { name: 'Regression seed 저장' })
  await seed.focus()
  await expect(seed).toBeFocused()
  await expect(page.getByLabel('release readiness')).toContainText('CLEARED')
  await expect(page.getByLabel('release readiness')).toContainText('3/3 conditions pass')
})

test('keeps the critical flow usable at 390 by 844', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/replay/focus-list')
  await reachReplay(page)

  await expect(page.getByText('AFTER · 3/3 PASS')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Regression seed 저장' })).toBeVisible()
  const layout = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    mainRight: document.querySelector('main')?.getBoundingClientRect().right ?? 0,
  }))
  expect(layout.clientWidth).toBe(390)
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth)
  expect(layout.mainRight).toBeLessThanOrEqual(390)
  await page.screenshot({ path: `${screenshotDir}/after-flight-record-mobile-390x844.png`, fullPage: true })
})
