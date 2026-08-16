export interface BrowserStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

interface StoredAccount {
  readonly name: string
  readonly email: string
  readonly passwordHash: string
}

export type AuthResult =
  | { readonly ok: true; readonly account: Pick<StoredAccount, 'name' | 'email'> }
  | { readonly ok: false; readonly message: string }

const ACCOUNTS_KEY = 'personaflight:accounts'
const SESSION_KEY = 'personaflight:session'

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function isStoredAccount(value: unknown): value is StoredAccount {
  return typeof value === 'object'
    && value !== null
    && typeof (value as StoredAccount).name === 'string'
    && typeof (value as StoredAccount).email === 'string'
    && typeof (value as StoredAccount).passwordHash === 'string'
}

function readAccounts(storage: BrowserStorage): StoredAccount[] {
  const rawAccounts = storage.getItem(ACCOUNTS_KEY)
  if (!rawAccounts) return []

  try {
    const parsed: unknown = JSON.parse(rawAccounts)
    return Array.isArray(parsed) && parsed.every(isStoredAccount) ? parsed : []
  } catch {
    return []
  }
}

async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(password)
  const hash = await globalThis.crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function startSession(storage: BrowserStorage, account: StoredAccount): void {
  storage.setItem(SESSION_KEY, JSON.stringify({ name: account.name, email: account.email }))
}

export async function registerBrowserAccount(
  input: { readonly name: string; readonly email: string; readonly password: string; readonly passwordConfirmation: string },
  storage: BrowserStorage = window.localStorage,
): Promise<AuthResult> {
  const name = input.name.trim()
  const email = normalizeEmail(input.email)

  if (!name) return { ok: false, message: '이름을 입력해 주세요.' }
  if (!email) return { ok: false, message: '이메일을 입력해 주세요.' }
  if (input.password.length < 8) return { ok: false, message: '비밀번호는 8자 이상이어야 합니다.' }
  if (input.password !== input.passwordConfirmation) return { ok: false, message: '비밀번호 확인이 일치하지 않습니다.' }

  const accounts = readAccounts(storage)
  if (accounts.some((account) => account.email === email)) {
    return { ok: false, message: '이미 가입된 이메일입니다. 로그인해 주세요.' }
  }

  const account: StoredAccount = { name, email, passwordHash: await hashPassword(input.password) }
  storage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]))
  startSession(storage, account)
  return { ok: true, account: { name: account.name, email: account.email } }
}

export async function loginBrowserAccount(
  input: { readonly email: string; readonly password: string },
  storage: BrowserStorage = window.localStorage,
): Promise<AuthResult> {
  const email = normalizeEmail(input.email)
  const account = readAccounts(storage).find((candidate) => candidate.email === email)
  if (!account || account.passwordHash !== await hashPassword(input.password)) {
    return { ok: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' }
  }

  startSession(storage, account)
  return { ok: true, account: { name: account.name, email: account.email } }
}
