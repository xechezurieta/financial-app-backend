/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		setupFiles: './tests/setup.ts',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html']
		}
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'@tests': fileURLToPath(new URL('./tests', import.meta.url))
		}
	}
})
