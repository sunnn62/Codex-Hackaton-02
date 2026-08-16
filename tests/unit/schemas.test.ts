import { describe, expect, it } from 'vitest'

import { createRunInputSchema, testPersonaSchema } from '@/lib/domain/schemas'

describe('PersonaFlight schemas', () => {
  it('rejects a non-http app URL', () => {
    const result = createRunInputSchema.safeParse({
      appUrl: 'file:///secret',
      appName: 'Demo',
      appDescription: 'Demo application for testing',
      targetAudience: 'solo builders',
      mission: 'Create one task',
      successCriteria: 'Task appears in Today',
      personaCount: 6,
      mode: 'demo',
    })

    expect(result.success).toBe(false)
  })

  it('keeps demographic and capability axes independent', () => {
    const result = testPersonaSchema.parse({
      id: 'senior-expert',
      label: '숙련된 고령 사용자',
      demographics: {
        ageRange: '60-69',
        primaryLanguage: 'ko',
        locale: 'ko-KR',
      },
      capability: {
        digitalLiteracy: 'high',
        domainKnowledge: 'high',
      },
      accessibility: {
        vision: 'standard',
        motor: 'standard',
        cognition: 'standard',
      },
      environment: {
        viewport: 'small-mobile',
        network: 'fast',
        interruptionLevel: 'low',
        inputMode: 'touch',
      },
      behavior: {
        patience: 'medium',
        exploration: 'high',
        privacySensitivity: 'high',
      },
    })

    expect(result.capability.digitalLiteracy).toBe('high')
  })
})
