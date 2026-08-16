import { describe, expect, it } from 'vitest'

import {
  calculateCoverage,
  generatePersonaPanel,
} from '@/lib/domain/persona-generator'

const input = {
  appUrl: 'http://localhost:3000/demo-app',
  appName: 'FocusList',
  appDescription: 'A lightweight daily task manager',
  targetAudience: 'people trying a productivity app for the first time',
  mission: 'Create a task and add it to Today',
  successCriteria: 'The new task is visible in the Today list',
  personaCount: 6,
  mode: 'demo' as const,
}

describe('generatePersonaPanel', () => {
  it('returns the requested panel with required diversity', () => {
    const panel = generatePersonaPanel(input)
    const coverage = calculateCoverage(panel)

    expect(panel).toHaveLength(6)
    expect(new Set(panel.map((persona) => persona.id)).size).toBe(6)
    expect(coverage.requiredAxesCovered).toBe(true)
    expect(
      panel.some(
        (persona) => persona.capability.digitalLiteracy === 'low',
      ),
    ).toBe(true)
    expect(
      panel.some(
        (persona) =>
          persona.capability.digitalLiteracy === 'high' &&
          persona.demographics.ageRange === '60-69',
      ),
    ).toBe(true)
  })

  it('is deterministic for the same mission', () => {
    expect(generatePersonaPanel(input)).toEqual(generatePersonaPanel(input))
  })

  it('supports the schema maximum without silently truncating the panel', () => {
    const panel = generatePersonaPanel({ ...input, personaCount: 12 })

    expect(panel).toHaveLength(12)
    expect(new Set(panel.map((persona) => persona.id)).size).toBe(12)
  })

  it('returns fresh deeply frozen personas for every run', () => {
    const firstPanel = generatePersonaPanel(input)

    expect(Object.isFrozen(firstPanel[0])).toBe(true)
    expect(Object.isFrozen(firstPanel[0].capability)).toBe(true)
    expect(() => {
      firstPanel[0].capability.digitalLiteracy = 'high'
    }).toThrow()
    expect(generatePersonaPanel(input)).toEqual(firstPanel)
  })

  it('does not treat keyboard input alone as an accessibility need', () => {
    const keyboardOnly = generatePersonaPanel(input).find(
      (persona) => persona.id === 'senior-digital-expert',
    )

    expect(keyboardOnly).toBeDefined()
    expect(calculateCoverage([keyboardOnly!]).coveredFlags).not.toContain(
      'accessibility',
    )
  })

  it('uses the configured primary locale for language coverage', () => {
    const englishPersona = generatePersonaPanel(input).find(
      (persona) => persona.id === 'english-keyboard-first-timer',
    )

    expect(englishPersona).toBeDefined()
    expect(
      calculateCoverage([englishPersona!], 'en-US').coveredFlags,
    ).not.toContain('non-primary-locale')
  })
})
