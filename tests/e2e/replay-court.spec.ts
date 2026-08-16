import { expect, test } from '@playwright/test'

test('completes the evidence-to-identical-replay flow without credentials', async ({
  page,
}, testInfo) => {
  const response = await page.goto('/')

  expect(response?.ok()).toBe(true)
  await expect(page.getByTestId('fault-condition')).toHaveCount(3)
  await expect(page.getByLabel('release readiness')).toContainText('HOLD')

  const parallelButton = page.getByRole('button', {
    name: '3개 조건 병렬 실행',
  })
  await parallelButton.focus()
  await expect(parallelButton).toBeFocused()
  await parallelButton.press('Enter')
  await expect(
    page.getByRole('heading', { name: 'BEFORE · 0/3 PASS' }),
  ).toBeVisible()
  await expect(page.getByTestId('evidence-id')).toHaveCount(3)

  await page.getByRole('button', { name: 'Codex 최소 수정 검토' }).click()
  await expect(page.getByLabel('minimal code diff')).toContainText(
    '할 일 저장',
  )
  await expect(
    page.getByRole('heading', { name: 'Flight Record' }),
  ).toHaveCount(0)

  await page
    .getByRole('button', { name: '승인 후 동일 조건 재실행' })
    .click()

  await expect(page.getByLabel('release readiness')).toContainText('CLEARED')
  await expect(page.getByText('AFTER · 3/3 PASS')).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Flight Record' }),
  ).toBeVisible()

  const seedLink = page.getByRole('link', { name: 'Regression seed 저장' })
  const seedHref = await seedLink.getAttribute('href')
  expect(seedHref).toMatch(/^data:application\/json/)

  const encodedSeed = seedHref?.split(',', 2)[1]
  expect(encodedSeed).toBeTruthy()
  const seed = JSON.parse(decodeURIComponent(encodedSeed ?? '')) as {
    expectedPassedConditionIds: string[]
    unresolvedConditionIds: string[]
  }
  expect(seed.expectedPassedConditionIds).toHaveLength(3)
  expect(seed.unresolvedConditionIds).toEqual([])

  const desktopScreenshot = testInfo.outputPath('flight-record-desktop.png')
  await page.screenshot({ path: desktopScreenshot, fullPage: true })
  await testInfo.attach('flight-record-desktop', {
    path: desktopScreenshot,
    contentType: 'image/png',
  })
})

test.describe('mobile touch flow', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  })

  test('keeps the critical flow usable at 390 by 844', async (
    { page },
    testInfo,
  ) => {
    await page.goto('/')

    expect(await page.evaluate(() => navigator.maxTouchPoints)).toBeGreaterThan(
      0,
    )
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      ),
    ).toBe(false)

    await page.getByRole('button', { name: '3개 조건 병렬 실행' }).tap()
    await expect(page.getByText('BEFORE · 0/3 PASS')).toBeVisible()

    await page.getByRole('button', { name: 'Codex 최소 수정 검토' }).tap()
    await page
      .getByRole('button', { name: '승인 후 동일 조건 재실행' })
      .tap()

    await expect(
      page.getByRole('link', { name: 'Regression seed 저장' }),
    ).toBeVisible()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      ),
    ).toBe(false)

    const mobileScreenshot = testInfo.outputPath(
      'flight-record-mobile-touch.png',
    )
    await page.screenshot({ path: mobileScreenshot, fullPage: true })
    await testInfo.attach('flight-record-mobile-touch', {
      path: mobileScreenshot,
      contentType: 'image/png',
    })
  })
})
