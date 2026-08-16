export interface DescribedAction {
  readonly type: string
  readonly accessibleName?: string
}

const DESTRUCTIVE_PATTERNS: readonly RegExp[] = [
  /delete\s+(account|profile|data)/i,
  /remove\s+(account|profile|data)/i,
  /purchase|checkout|pay\s+now|transfer\s+money|send\s+message/i,
  /계정\s*삭제|프로필\s*삭제|데이터\s*삭제|결제|구매|송금|메시지\s*전송/i,
]

export function isAllowedNavigation(
  initialUrl: string,
  candidateUrl: string,
): boolean {
  try {
    return new URL(initialUrl).origin === new URL(candidateUrl).origin
  } catch {
    return false
  }
}

export function isDestructiveAction(action: DescribedAction): boolean {
  const description = `${action.type} ${action.accessibleName ?? ''}`.trim()
  return DESTRUCTIVE_PATTERNS.some((pattern) => pattern.test(description))
}
