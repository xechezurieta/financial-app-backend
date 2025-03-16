import request from 'supertest'
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import { createApp } from '@/app'
import { App } from 'supertest/types'
import jwt from 'jsonwebtoken'

// Mock jwt with conditional behavior based on JWT_SECRET
vi.mock('jsonwebtoken', () => ({
	default: {
		sign: vi.fn().mockImplementation((payload, secret) => {
			if (!secret) throw new Error('JWT secret is required')
			return 'test-jwt-token'
		})
	},
	sign: vi.fn().mockImplementation((payload, secret) => {
		if (!secret) throw new Error('JWT secret is required')
		return 'test-jwt-token'
	})
}))

// Define test user data
const testUser = {
	id: 'test-user-id',
	email: 'test@example.com',
	password: 'password123',
	role: 'user'
}

// Mock user model with more detailed implementation
const mockUserModel = {
	getUserByEmail: vi.fn().mockResolvedValue(null),
	create: vi.fn().mockResolvedValue(testUser),
	login: vi.fn().mockImplementation(async (credentials) => {
		if (
			credentials.email === testUser.email &&
			credentials.password === testUser.password
		) {
			return testUser
		}
		throw new Error('Invalid credentials')
	})
}

// Mock other required models with minimal implementations
const mockAccountModel = {
	getAccounts: vi.fn().mockResolvedValue([]),
	getAccount: vi.fn().mockResolvedValue({}),
	createAccount: vi.fn().mockResolvedValue({}),
	deleteAccounts: vi.fn().mockResolvedValue([]),
	deleteAccount: vi.fn().mockResolvedValue({}),
	editAccountName: vi.fn().mockResolvedValue({})
}

const mockCategoryModel = {
	getCategories: vi.fn().mockResolvedValue([]),
	getCategory: vi.fn().mockResolvedValue({}),
	createCategory: vi.fn().mockResolvedValue({}),
	deleteCategories: vi.fn().mockResolvedValue([]),
	editCategoryName: vi.fn().mockResolvedValue({}),
	deleteCategory: vi.fn().mockResolvedValue({})
}

const mockTransactionModel = {
	getTransactions: vi.fn().mockResolvedValue([]),
	getTransaction: vi.fn().mockResolvedValue({}),
	createTransaction: vi.fn().mockResolvedValue({}),
	deleteTransactions: vi.fn().mockResolvedValue([]),
	editTransaction: vi.fn().mockResolvedValue({}),
	deleteTransaction: vi.fn().mockResolvedValue({})
}

const mockSummaryModel = {
	fetchFinancialData: vi.fn().mockResolvedValue([]),
	getCategoriesSummary: vi
		.fn()
		.mockResolvedValue({ topCategories: [], otherCategories: [] }),
	getSummaryActiveDays: vi.fn().mockResolvedValue([])
}

describe('User Integration Tests', () => {
	let app: App

	beforeAll(() => {
		// Set JWT_SECRET for testing
		process.env.JWT_SECRET = 'test-secret-key'

		// Create the app with mocked dependencies
		app = createApp({
			accountModel: mockAccountModel,
			categoryModel: mockCategoryModel,
			transactionModel: mockTransactionModel,
			summaryModel: mockSummaryModel,
			userModel: mockUserModel
		})
	})

	beforeEach(() => {
		// Reset mock function calls before each test
		vi.clearAllMocks()
	})

	describe('POST /api/users/register', () => {
		it('should register a new user', async () => {
			const response = await request(app)
				.post('/api/users/register')
				.send({ email: testUser.email, password: testUser.password })
				.expect(200)

			expect(mockUserModel.create).toHaveBeenCalledWith({
				email: testUser.email,
				password: testUser.password
			})
			expect(response.body).toEqual({ user: testUser })
		})

		it('should handle registration failure', async () => {
			mockUserModel.create.mockRejectedValueOnce(
				new Error('Registration failed')
			)

			const response = await request(app)
				.post('/api/users/register')
				.send({ email: testUser.email, password: testUser.password })
				.expect(500)

			expect(response.text).toBe('Failed to register user')
		})
	})

	describe('POST /api/users/login', () => {
		it('should login a user and return a token', async () => {
			// Make sure the login mock is set up correctly
			mockUserModel.login.mockResolvedValueOnce(testUser)

			try {
				const response = await request(app)
					.post('/api/users/login')
					.send({ email: testUser.email, password: testUser.password })

				console.log('Login response status:', response.status)
				console.log('Login response body:', response.body)

				expect(response.status).toBe(200)
				expect(mockUserModel.login).toHaveBeenCalledWith({
					email: testUser.email,
					password: testUser.password
				})
				expect(jwt.sign).toHaveBeenCalledWith(
					{ id: testUser.id, email: testUser.email, role: testUser.role },
					process.env.JWT_SECRET,
					{ expiresIn: '24h' }
				)
				expect(response.body).toEqual({
					user: testUser,
					token: 'test-jwt-token'
				})
			} catch (error) {
				console.error('Test error:', error)
				throw error
			}
		})

		it('should handle login failure', async () => {
			mockUserModel.login.mockRejectedValueOnce(new Error('Login failed'))

			const response = await request(app)
				.post('/api/users/login')
				.send({ email: testUser.email, password: testUser.password })
				.expect(500)

			expect(response.text).toBe('Failed to login user')
		})

		it('should handle missing JWT_SECRET', async () => {
			// Temporarily remove JWT_SECRET
			const originalSecret = process.env.JWT_SECRET
			delete process.env.JWT_SECRET // Using delete instead of setting to undefined for proper env var removal

			try {
				// Make sure we have login mock properly set
				mockUserModel.login.mockResolvedValueOnce(testUser)

				const response = await request(app)
					.post('/api/users/login')
					.send({ email: testUser.email, password: testUser.password })

				console.log('Missing JWT test - response status:', response.status)
				console.log('Missing JWT test - response body:', response.body)
				console.log('Missing JWT test - response text:', response.text)

				expect(response.status).toBe(500)
				expect(response.text).toBe('Failed to login user')
			} catch (error) {
				console.error('JWT missing test error:', error)
				throw error
			} finally {
				// Restore JWT_SECRET
				process.env.JWT_SECRET = originalSecret
			}
		})
	})
})
