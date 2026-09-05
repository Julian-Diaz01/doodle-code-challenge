import type { UserConfig } from 'vite'
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig as UserConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      css: true,
      env: { TZ: 'UTC' },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov'],
        include: ['src/**/*.{ts,tsx}', 'src/components/Composer.tsx' ],
        exclude: [
          'src/**/*.d.ts',
          'src/main.tsx',
          'src/App.tsx',
          'src/types.ts',
          'src/components/**',
          'src/lib/**',
          'src/test/**',
          'src/**/*.test.{ts,tsx}',
        ],
        thresholds: {
          lines: 80,
          statements: 80,
          functions: 80,
          branches: 80,
        },
      },
    },
  }),
)
