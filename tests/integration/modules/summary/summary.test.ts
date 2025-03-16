import request from 'supertest'
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import { createApp } from '@/app'
import { mockUser } from '@tests/common/constants'
import { NextFunction, Request, Response } from 'express'
import { App } from 'supertest/types'

// Mock authentication middleware
vi.mock('@/middlewares/auth', () => ({
	authMiddleware: (req: Request, res: Response, next: NextFunction) => {
		req.user = mockUser
		next()
	}
}))

// Mock summary model
const mockSummaryModel = {
	fetchFinancialData: vi.fn().mockResolvedValue([
		{ income: 1000, expenses: 500, remaining: 500 },
		{ income: 900, expenses: 550, remaining: 450 }
	]),
	getCategoriesSummary: vi.fn().mockResolvedValue({
		topCategories: [
			{ name: 'Food', value: 300 },
			{ name: 'Transport', value: 150 }
		],
		otherCategories: [{ name: 'Entertainment', value: 50 }]
	}),
	getSummaryActiveDays: vi.fn().mockResolvedValue([
		{ day: '2023-01-01', income: 100, expenses: 50 },
		{ day: '2023-01-02', income: 200, expenses: 100 }
	])
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

const mockUserModel = {
	getUserByEmail: vi.fn().mockResolvedValue(null),
	create: vi.fn().mockResolvedValue({}),
	login: vi.fn().mockResolvedValue({})
}

describe('Summary Integration Tests', () => {
	let app: App

	beforeAll(() => {
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

	describe('GET /api/summary', () => {
		it('should return summary data for the authenticated user', async () => {
			const response = await request(app)
				.get('/api/summary')
				.query({ from: '2023-01-01', to: '2023-01-31' })
				.expect('Content-Type', /json/)
				.expect(200)

			expect(mockSummaryModel.fetchFinancialData).toHaveBeenCalledTimes(2)
			expect(mockSummaryModel.getCategoriesSummary).toHaveBeenCalledTimes(1)
			expect(mockSummaryModel.getSummaryActiveDays).toHaveBeenCalledTimes(1)

			expect(response.body).toHaveProperty('data')
			expect(response.body.data).toHaveProperty('remainingAmount')
			expect(response.body.data).toHaveProperty('incomeAmount')
			expect(response.body.data).toHaveProperty('expensesAmount')
			expect(response.body.data).toHaveProperty('categories')
			expect(response.body.data).toHaveProperty('days')
		})

		it('should handle filtering by account ID', async () => {
			const accountId = 'test-account-id'

			await request(app).get('/api/summary').query({ accountId }).expect(200)

			expect(mockSummaryModel.fetchFinancialData).toHaveBeenCalledWith(
				expect.objectContaining({ accountId, userId: mockUser.id })
			)
			expect(mockSummaryModel.getCategoriesSummary).toHaveBeenCalledWith(
				expect.objectContaining({ accountId, userId: mockUser.id })
			)
			expect(mockSummaryModel.getSummaryActiveDays).toHaveBeenCalledWith(
				expect.objectContaining({ accountId, userId: mockUser.id })
			)
		})
	})

	describe('Error handling', () => {
		it('should handle internal server errors on GET /api/summary', async () => {
			mockSummaryModel.fetchFinancialData.mockRejectedValueOnce(
				new Error('Database error')
			)

			const response = await request(app).get('/api/summary').expect(500)

			expect(response.text).toBe('Failed to get summary')
		})
	})
})
