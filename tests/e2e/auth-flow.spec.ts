import { expect, test } from '@playwright/test'

test('requires registration before allowing a browser-local login', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('90초 데모 시작')).toHaveCount(0)

  await page.getByRole('link', { name: '로그인' }).click()
  await page.locator('input[name="email"]').fill('demo@personaflight.dev')
  await page.locator('input[name="password"]').fill('not-registered')
  await page.getByRole('button', { name: '로그인하고 시작하기' }).click()
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByText('이메일 또는 비밀번호가 올바르지 않습니다.')).toBeVisible()

  await page.getByRole('link', { name: '회원가입' }).click()
  await page.locator('input[name="name"]').fill('데모 사용자')
  await page.locator('input[name="email"]').fill('demo@personaflight.dev')
  await page.locator('input[name="password"]').fill('registered-password')
  await page.locator('input[name="password-confirmation"]').fill('registered-password')
  await page.getByRole('button', { name: '회원가입하고 시작하기' }).click()
  await expect(page).toHaveURL(/\/replay$/)

  await page.goto('/login')
  await page.locator('input[name="email"]').fill('demo@personaflight.dev')
  await page.locator('input[name="password"]').fill('registered-password')
  await page.getByRole('button', { name: '로그인하고 시작하기' }).click()
  await expect(page).toHaveURL(/\/replay$/)
})
