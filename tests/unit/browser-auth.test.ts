import { describe, expect, it } from 'vitest'

import { loginBrowserAccount, registerBrowserAccount, type BrowserStorage } from '@/lib/browser-auth'

function createStorage(): BrowserStorage {
  const values = new Map<string, string>()
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  }
}

describe('browser auth', () => {
  it('registers an account and permits only its matching credentials', async () => {
    const storage = createStorage()

    await expect(registerBrowserAccount({
      name: '테스트 사용자',
      email: 'TEST@example.com',
      password: 'correct-password',
      passwordConfirmation: 'correct-password',
    }, storage)).resolves.toMatchObject({ ok: true, account: { email: 'test@example.com' } })

    await expect(loginBrowserAccount({ email: 'test@example.com', password: 'wrong-password' }, storage)).resolves.toEqual({
      ok: false,
      message: '이메일 또는 비밀번호가 올바르지 않습니다.',
    })
    await expect(loginBrowserAccount({ email: 'test@example.com', password: 'correct-password' }, storage)).resolves.toMatchObject({
      ok: true,
      account: { name: '테스트 사용자' },
    })
  })

  it('rejects duplicate emails and mismatched passwords', async () => {
    const storage = createStorage()

    await expect(registerBrowserAccount({
      name: '첫 사용자', email: 'first@example.com', password: 'correct-password', passwordConfirmation: 'different-password',
    }, storage)).resolves.toEqual({ ok: false, message: '비밀번호 확인이 일치하지 않습니다.' })

    await registerBrowserAccount({
      name: '첫 사용자', email: 'first@example.com', password: 'correct-password', passwordConfirmation: 'correct-password',
    }, storage)
    await expect(registerBrowserAccount({
      name: '다른 사용자', email: 'FIRST@example.com', password: 'correct-password', passwordConfirmation: 'correct-password',
    }, storage)).resolves.toEqual({ ok: false, message: '이미 가입된 이메일입니다. 로그인해 주세요.' })
  })
})
