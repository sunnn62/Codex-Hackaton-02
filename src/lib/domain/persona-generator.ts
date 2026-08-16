import type { CreateRunInput, TestPersona } from './schemas'

type CoverageFlag =
  | 'low-digital-literacy'
  | 'small-mobile'
  | 'constrained-network'
  | 'accessibility'
  | 'low-patience'
  | 'low-domain-knowledge'
  | 'non-primary-locale'
  | 'senior-expert'

export interface CoverageReport {
  readonly requiredAxesCovered: boolean
  readonly coveredFlags: readonly CoverageFlag[]
  readonly missingFlags: readonly CoverageFlag[]
  readonly pairCount: number
}

const REQUIRED_FLAGS: readonly CoverageFlag[] = [
  'low-digital-literacy',
  'small-mobile',
  'constrained-network',
  'accessibility',
  'low-patience',
  'low-domain-knowledge',
  'non-primary-locale',
  'senior-expert',
]

const CANDIDATES: readonly TestPersona[] = [
  {
    id: 'impatient-mobile-novice',
    label: '처음 온 성급한 모바일 사용자',
    demographics: {
      ageRange: '20-29',
      primaryLanguage: 'ko',
      locale: 'ko-KR',
    },
    capability: { digitalLiteracy: 'low', domainKnowledge: 'low' },
    accessibility: {
      vision: 'standard',
      motor: 'standard',
      cognition: 'standard',
    },
    environment: {
      viewport: 'small-mobile',
      network: 'slow',
      interruptionLevel: 'high',
      inputMode: 'touch',
    },
    behavior: {
      patience: 'low',
      exploration: 'low',
      privacySensitivity: 'medium',
    },
  },
  {
    id: 'senior-digital-expert',
    label: '디지털 도구에 능숙한 고령 사용자',
    demographics: {
      ageRange: '60-69',
      primaryLanguage: 'ko',
      locale: 'ko-KR',
    },
    capability: { digitalLiteracy: 'high', domainKnowledge: 'high' },
    accessibility: {
      vision: 'standard',
      motor: 'standard',
      cognition: 'standard',
    },
    environment: {
      viewport: 'desktop',
      network: 'fast',
      interruptionLevel: 'low',
      inputMode: 'keyboard',
    },
    behavior: {
      patience: 'high',
      exploration: 'high',
      privacySensitivity: 'high',
    },
  },
  {
    id: 'english-keyboard-first-timer',
    label: '영어권 키보드 사용자',
    demographics: {
      ageRange: '30-39',
      primaryLanguage: 'en',
      locale: 'en-US',
    },
    capability: { digitalLiteracy: 'medium', domainKnowledge: 'low' },
    accessibility: {
      vision: 'standard',
      motor: 'standard',
      cognition: 'standard',
    },
    environment: {
      viewport: 'desktop',
      network: 'intermittent',
      interruptionLevel: 'low',
      inputMode: 'keyboard',
    },
    behavior: {
      patience: 'medium',
      exploration: 'medium',
      privacySensitivity: 'high',
    },
  },
  {
    id: 'limited-dexterity-mobile',
    label: '한 손으로 사용하는 이동 중 사용자',
    demographics: {
      ageRange: '40-49',
      primaryLanguage: 'ko',
      locale: 'ko-KR',
    },
    capability: { digitalLiteracy: 'medium', domainKnowledge: 'medium' },
    accessibility: {
      vision: 'standard',
      motor: 'limited-dexterity',
      cognition: 'standard',
    },
    environment: {
      viewport: 'small-mobile',
      network: 'fast',
      interruptionLevel: 'high',
      inputMode: 'touch',
    },
    behavior: {
      patience: 'medium',
      exploration: 'low',
      privacySensitivity: 'medium',
    },
  },
  {
    id: 'color-sensitive-explorer',
    label: '색상보다 구조로 탐색하는 사용자',
    demographics: {
      ageRange: '20-29',
      primaryLanguage: 'ko',
      locale: 'ko-KR',
    },
    capability: { digitalLiteracy: 'high', domainKnowledge: 'medium' },
    accessibility: {
      vision: 'color-vision-difference',
      motor: 'standard',
      cognition: 'standard',
    },
    environment: {
      viewport: 'large-mobile',
      network: 'fast',
      interruptionLevel: 'low',
      inputMode: 'touch',
    },
    behavior: {
      patience: 'high',
      exploration: 'high',
      privacySensitivity: 'low',
    },
  },
  {
    id: 'interrupted-low-memory-user',
    label: '자주 방해받는 초보 사용자',
    demographics: {
      ageRange: '50-59',
      primaryLanguage: 'ko',
      locale: 'ko-KR',
    },
    capability: { digitalLiteracy: 'low', domainKnowledge: 'medium' },
    accessibility: {
      vision: 'standard',
      motor: 'standard',
      cognition: 'reduced-working-memory',
    },
    environment: {
      viewport: 'large-mobile',
      network: 'intermittent',
      interruptionLevel: 'high',
      inputMode: 'touch',
    },
    behavior: {
      patience: 'low',
      exploration: 'medium',
      privacySensitivity: 'medium',
    },
  },
  {
    id: 'privacy-conscious-power-user',
    label: '개인정보에 민감한 숙련 사용자',
    demographics: {
      ageRange: '30-39',
      primaryLanguage: 'ko',
      locale: 'ko-KR',
    },
    capability: { digitalLiteracy: 'high', domainKnowledge: 'high' },
    accessibility: {
      vision: 'standard',
      motor: 'standard',
      cognition: 'standard',
    },
    environment: {
      viewport: 'desktop',
      network: 'fast',
      interruptionLevel: 'low',
      inputMode: 'mouse',
    },
    behavior: {
      patience: 'medium',
      exploration: 'high',
      privacySensitivity: 'high',
    },
  },
  {
    id: 'patient-domain-newcomer',
    label: '천천히 배우는 도메인 초보자',
    demographics: {
      ageRange: '40-49',
      primaryLanguage: 'ja',
      locale: 'ja-JP',
    },
    capability: { digitalLiteracy: 'medium', domainKnowledge: 'low' },
    accessibility: {
      vision: 'standard',
      motor: 'standard',
      cognition: 'standard',
    },
    environment: {
      viewport: 'large-mobile',
      network: 'slow',
      interruptionLevel: 'low',
      inputMode: 'touch',
    },
    behavior: {
      patience: 'high',
      exploration: 'medium',
      privacySensitivity: 'low',
    },
  },
  {
    id: 'low-vision-domain-expert',
    label: '확대 화면을 사용하는 도메인 전문가',
    demographics: {
      ageRange: '30-39',
      primaryLanguage: 'ko',
      locale: 'ko-KR',
    },
    capability: { digitalLiteracy: 'high', domainKnowledge: 'high' },
    accessibility: {
      vision: 'low-vision',
      motor: 'standard',
      cognition: 'standard',
    },
    environment: {
      viewport: 'desktop',
      network: 'fast',
      interruptionLevel: 'low',
      inputMode: 'keyboard',
    },
    behavior: {
      patience: 'medium',
      exploration: 'high',
      privacySensitivity: 'medium',
    },
  },
  {
    id: 'arabic-mobile-newcomer',
    label: '오른쪽에서 왼쪽으로 읽는 모바일 초보자',
    demographics: {
      ageRange: '20-29',
      primaryLanguage: 'ar',
      locale: 'ar-SA',
    },
    capability: { digitalLiteracy: 'medium', domainKnowledge: 'low' },
    accessibility: {
      vision: 'standard',
      motor: 'standard',
      cognition: 'standard',
    },
    environment: {
      viewport: 'small-mobile',
      network: 'slow',
      interruptionLevel: 'low',
      inputMode: 'touch',
    },
    behavior: {
      patience: 'medium',
      exploration: 'low',
      privacySensitivity: 'high',
    },
  },
  {
    id: 'older-desktop-newcomer',
    label: '큰 화면을 선호하는 도메인 초보자',
    demographics: {
      ageRange: '70-79',
      primaryLanguage: 'ko',
      locale: 'ko-KR',
    },
    capability: { digitalLiteracy: 'medium', domainKnowledge: 'low' },
    accessibility: {
      vision: 'standard',
      motor: 'standard',
      cognition: 'standard',
    },
    environment: {
      viewport: 'desktop',
      network: 'fast',
      interruptionLevel: 'low',
      inputMode: 'mouse',
    },
    behavior: {
      patience: 'high',
      exploration: 'medium',
      privacySensitivity: 'medium',
    },
  },
  {
    id: 'expert-under-interruption',
    label: '업무 중 자주 방해받는 숙련 사용자',
    demographics: {
      ageRange: '30-39',
      primaryLanguage: 'ko',
      locale: 'ko-KR',
    },
    capability: { digitalLiteracy: 'high', domainKnowledge: 'high' },
    accessibility: {
      vision: 'standard',
      motor: 'standard',
      cognition: 'reduced-working-memory',
    },
    environment: {
      viewport: 'large-mobile',
      network: 'intermittent',
      interruptionLevel: 'high',
      inputMode: 'touch',
    },
    behavior: {
      patience: 'low',
      exploration: 'high',
      privacySensitivity: 'low',
    },
  },
]

function personaFlags(
  persona: TestPersona,
  primaryLocale: string,
): readonly CoverageFlag[] {
  const minimumAge = Number.parseInt(
    persona.demographics.ageRange?.split('-')[0] ?? '0',
    10,
  )
  return [
    ...(persona.capability.digitalLiteracy === 'low'
      ? (['low-digital-literacy'] as const)
      : []),
    ...(persona.environment.viewport === 'small-mobile'
      ? (['small-mobile'] as const)
      : []),
    ...(persona.environment.network !== 'fast'
      ? (['constrained-network'] as const)
      : []),
    ...(persona.accessibility.vision !== 'standard' ||
    persona.accessibility.motor !== 'standard' ||
    persona.accessibility.cognition !== 'standard'
      ? (['accessibility'] as const)
      : []),
    ...(persona.behavior.patience === 'low'
      ? (['low-patience'] as const)
      : []),
    ...(persona.capability.domainKnowledge === 'low'
      ? (['low-domain-knowledge'] as const)
      : []),
    ...(persona.demographics.locale !== primaryLocale
      ? (['non-primary-locale'] as const)
      : []),
    ...(minimumAge >= 60 &&
    persona.capability.digitalLiteracy === 'high'
      ? (['senior-expert'] as const)
      : []),
  ]
}

function personaTraits(persona: TestPersona): readonly string[] {
  return [
    `age:${persona.demographics.ageRange ?? 'unspecified'}`,
    `language:${persona.demographics.primaryLanguage}`,
    `locale:${persona.demographics.locale}`,
    `digital:${persona.capability.digitalLiteracy}`,
    `domain:${persona.capability.domainKnowledge}`,
    `vision:${persona.accessibility.vision}`,
    `motor:${persona.accessibility.motor}`,
    `cognition:${persona.accessibility.cognition}`,
    `viewport:${persona.environment.viewport}`,
    `network:${persona.environment.network}`,
    `interruption:${persona.environment.interruptionLevel}`,
    `input:${persona.environment.inputMode}`,
    `patience:${persona.behavior.patience}`,
    `exploration:${persona.behavior.exploration}`,
    `privacy:${persona.behavior.privacySensitivity}`,
  ]
}

function personaPairs(persona: TestPersona): readonly string[] {
  const traits = personaTraits(persona)
  return traits.flatMap((left, leftIndex) =>
    traits.slice(leftIndex + 1).map((right) => `${left}|${right}`),
  )
}

function unique<T>(values: readonly T[]): readonly T[] {
  return [...new Set(values)]
}

function candidateScore(
  candidate: TestPersona,
  panel: readonly TestPersona[],
  primaryLocale: string,
): number {
  const coveredFlags = unique(
    panel.flatMap((persona) => personaFlags(persona, primaryLocale)),
  )
  const newRequiredFlags = personaFlags(candidate, primaryLocale).filter(
    (flag) => !coveredFlags.includes(flag),
  ).length
  const coveredPairs = unique(panel.flatMap(personaPairs))
  const newPairs = personaPairs(candidate).filter(
    (pair) => !coveredPairs.includes(pair),
  ).length
  return newRequiredFlags * 1_000 + newPairs
}

function selectCandidate(
  panel: readonly TestPersona[],
  primaryLocale: string,
): TestPersona | undefined {
  return CANDIDATES.filter(
    (candidate) => !panel.some((persona) => persona.id === candidate.id),
  )
    .map((candidate) => ({
      candidate,
      score: candidateScore(candidate, panel, primaryLocale),
    }))
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.candidate.id.localeCompare(right.candidate.id),
    )[0]?.candidate
}

function cloneAndFreezePersona(persona: TestPersona): TestPersona {
  const demographics = Object.freeze({ ...persona.demographics })
  const capability = Object.freeze({ ...persona.capability })
  const accessibility = Object.freeze({ ...persona.accessibility })
  const environment = Object.freeze({ ...persona.environment })
  const behavior = Object.freeze({ ...persona.behavior })
  return Object.freeze({
    ...persona,
    demographics,
    capability,
    accessibility,
    environment,
    behavior,
  })
}

export function generatePersonaPanel(
  input: CreateRunInput,
): readonly TestPersona[] {
  const primaryLocale = input.primaryLocale ?? 'ko-KR'
  return Array.from({ length: input.personaCount }).reduce<
    readonly TestPersona[]
  >((panel) => {
    const nextCandidate = selectCandidate(panel, primaryLocale)
    return nextCandidate
      ? [...panel, cloneAndFreezePersona(nextCandidate)]
      : panel
  }, [])
}

export function calculateCoverage(
  panel: readonly TestPersona[],
  primaryLocale = 'ko-KR',
): CoverageReport {
  const coveredFlags = unique(
    panel.flatMap((persona) => personaFlags(persona, primaryLocale)),
  )
  const missingFlags = REQUIRED_FLAGS.filter(
    (flag) => !coveredFlags.includes(flag),
  )
  return {
    requiredAxesCovered: missingFlags.length === 0,
    coveredFlags,
    missingFlags,
    pairCount: unique(panel.flatMap(personaPairs)).length,
  }
}
