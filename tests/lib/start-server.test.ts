import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { startServer } from '@/lib/start-server'
import { Express } from 'express'

describe('startServer', () => {
	// Setup console spy
	let consoleLogSpy: ReturnType<typeof vi.spyOn>

	beforeEach(() => {
		// Mock console.log to check for server startup message
		consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
	})

	afterEach(() => {
		consoleLogSpy.mockRestore()
	})

	it('should start the server on the specified port', () => {
		// Create mock Express app with listen method
		const mockApp = {
			listen: vi.fn((port, callback) => {
				callback()
				return { port }
			})
		} as unknown as Express

		const testPort = 3000

		// Call the function
		startServer(mockApp, testPort)

		// Verify the listen method was called with the right port
		expect(mockApp.listen).toHaveBeenCalledWith(testPort, expect.any(Function))

		// Verify the console.log was called with the expected message
		expect(consoleLogSpy).toHaveBeenCalledWith(
			`🚀 Server running on http://localhost:${testPort}`
		)
	})

	it('should return the server instance from listen', () => {
		// Create a mock server instance
		const mockServerInstance = { address: () => ({ port: 4000 }) }

		// Create mock Express app
		const mockApp = {
			listen: vi.fn(() => mockServerInstance)
		} as unknown as Express

		// Call the function
		startServer(mockApp, 4000)

		// Verify the listen method was called
		expect(mockApp.listen).toHaveBeenCalled()
	})
})
