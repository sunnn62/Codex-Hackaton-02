import { z } from 'zod'

const httpUrlSchema = z.string().url().refine((value) => {
  const protocol = new URL(value).protocol
  return protocol === 'http:' || protocol === 'https:'
}, 'HTTP 또는 HTTPS URL만 사용할 수 있습니다.')

export const createRunInputSchema = z.object({
  appUrl: httpUrlSchema,
  appName: z.string().trim().min(2).max(80),
  appDescription: z.string().trim().min(10).max(500),
  targetAudience: z.string().trim().min(3).max(300),
  mission: z.string().trim().min(5).max(300),
  successCriteria: z.string().trim().min(5).max(300),
  personaCount: z.number().int().min(3).max(12),
  mode: z.enum(['demo', 'live']),
  repositoryUrl: httpUrlSchema.optional(),
})

export const testPersonaSchema = z.object({
  id: z.string().trim().min(1),
  label: z.string().trim().min(1),
  demographics: z.object({
    ageRange: z.string().trim().min(1).optional(),
    genderIdentity: z.string().trim().min(1).optional(),
    primaryLanguage: z.string().trim().min(2),
    locale: z.string().trim().min(2),
  }),
  capability: z.object({
    digitalLiteracy: z.enum(['low', 'medium', 'high']),
    domainKnowledge: z.enum(['low', 'medium', 'high']),
  }),
  accessibility: z.object({
    vision: z.enum(['standard', 'low-vision', 'color-vision-difference']),
    motor: z.enum(['standard', 'limited-dexterity']),
    cognition: z.enum(['standard', 'reduced-working-memory']),
  }),
  environment: z.object({
    viewport: z.enum(['small-mobile', 'large-mobile', 'desktop']),
    network: z.enum(['fast', 'slow', 'intermittent']),
    interruptionLevel: z.enum(['low', 'high']),
    inputMode: z.enum(['mouse', 'touch', 'keyboard']),
  }),
  behavior: z.object({
    patience: z.enum(['low', 'medium', 'high']),
    exploration: z.enum(['low', 'medium', 'high']),
    privacySensitivity: z.enum(['low', 'medium', 'high']),
  }),
})

export type CreateRunInput = z.infer<typeof createRunInputSchema>
export type TestPersona = z.infer<typeof testPersonaSchema>
