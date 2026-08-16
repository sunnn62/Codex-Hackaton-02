import { mergeConfig, defineConfig } from 'vitest/config'
import baseConfig from './vitest.config'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['tests/integration/**/*.test.ts'],
      testTimeout: 60_000,
      hookTimeout: 60_000,
      coverage: { enabled: false },
    },
  }),
)
