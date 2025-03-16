import request from 'supertest'
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import { createApp } from '@/app'
import {
	mockUser,
	mockTransaction,
	mockNewTransaction,
	mockUpdatedTransaction,
	TEST_TRANSACTION_ID,
	TEST_ACCOUNT_ID,
	TEST_CATEGORY_ID,
	TEST_TRANSACTION_AMOUNT,
	TEST_TRANSACTION_DATE,
	TEST_TRANSACTION_PAYEE,
	TEST_TRANSACTION_NOTES
} from '@tests/common/constants'
import { NextFunction, Request, Response } from 'express'
import { App } from 'supertest/types'

// Mock authentication middleware
vi.mock('@/middlewares/auth', () => ({
	authMiddleware: (req: Request, res: Response, next: NextFunction) => {
		req.user = mockUser
		next()
	}
}))

// Mock transaction model
const mockTransactionModel = {
	getTransactions: vi.fn().mockResolvedValue([mockTransaction]),
	getTransaction: vi.fn().mockResolvedValue(mockTransaction),
	createTransaction: vi.fn().mockResolvedValue(mockNewTransaction),
	deleteTransactions: vi.fn().mockResolvedValue([{ id: TEST_TRANSACTION_ID }]),
	deleteTransaction: vi.fn().mockResolvedValue({ id: TEST_TRANSACTION_ID }),
	editTransaction: vi.fn().mockResolvedValue(mockUpdatedTransaction)
}

// Mock other required models with minimal implementations
const mockAccountModel = {
	getAccounts: vi.fn().mockResolvedValue([]),
	getAccount: vi.fn().mockResolvedValue({}),
	createAccount: vi.fn().mockResolvedValue({}),
	deleteAccounts: vi.fn().mockResolvedValue([]),
	editAccountName: vi.fn().mockResolvedValue({}),
	deleteAccount: vi.fn().mockResolvedValue({})
}

const mockCategoryModel = {
	getCategories: vi.fn().mockResolvedValue([]),
	getCategory: vi.fn().mockResolvedValue({}),
	createCategory: vi.fn().mockResolvedValue({}),
	deleteCategories: vi.fn().mockResolvedValue([]),
	editCategoryName: vi.fn().mockResolvedValue({}),
	deleteCategory: vi.fn().mockResolvedValue({})
}

const mockSummaryModel = {
	fetchFinancialData: vi.fn().mockResolvedValue([]),
	getCategoriesSummary: vi.fn().mockResolvedValue([]),
	getSummaryActiveDays: vi.fn().mockResolvedValue([])
}

const mockUserModel = {
	getUserByEmail: vi.fn().mockResolvedValue(null),
	create: vi.fn().mockResolvedValue({}),
	login: vi.fn().mockResolvedValue({})
}

describe('Transaction Integration Tests', () => {
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

	describe('GET /api/transactions', () => {
		it('should return all transactions for the authenticated user', async () => {
			const response = await request(app)
				.get('/api/transactions')
				.expect('Content-Type', /json/)
				.expect(200)

			expect(mockTransactionModel.getTransactions).toHaveBeenCalledWith({
				userId: mockUser.id,
				from: undefined,
				to: undefined,
				accountId: undefined
			})
			expect(response.body).toEqual({ transactions: [mockTransaction] })
		})

		it('should handle query parameters for filtering', async () => {
			const from = '2023-01-01'
			const to = '2023-01-31'

			const response = await request(app)
				.get(
					`/api/transactions?from=${from}&to=${to}&accountId=${TEST_ACCOUNT_ID}`
				)
				.expect('Content-Type', /json/)
				.expect(200)

			expect(mockTransactionModel.getTransactions).toHaveBeenCalledWith({
				userId: mockUser.id,
				from,
				to,
				accountId: TEST_ACCOUNT_ID
			})
			expect(response.body).toEqual({ transactions: [mockTransaction] })
		})
	})

	describe('GET /api/transactions/:transactionId', () => {
		it('should return a specific transaction by ID', async () => {
			const response = await request(app)
				.get(`/api/transactions/${TEST_TRANSACTION_ID}`)
				.expect('Content-Type', /json/)
				.expect(200)

			expect(mockTransactionModel.getTransaction).toHaveBeenCalledWith({
				transactionId: TEST_TRANSACTION_ID,
				userId: mockUser.id
			})
			expect(response.body).toEqual({ transaction: mockTransaction })
		})
	})

	describe('POST /api/transactions', () => {
		it('should create a new transaction', async () => {
			const response = await request(app)
				.post('/api/transactions')
				.send({
					accountId: TEST_ACCOUNT_ID,
					categoryId: TEST_CATEGORY_ID,
					amount: TEST_TRANSACTION_AMOUNT,
					date: TEST_TRANSACTION_DATE,
					payee: TEST_TRANSACTION_PAYEE,
					notes: TEST_TRANSACTION_NOTES
				})
				.expect('Content-Type', /json/)
				.expect(200)

			expect(mockTransactionModel.createTransaction).toHaveBeenCalledWith({
				userId: mockUser.id,
				accountId: TEST_ACCOUNT_ID,
				categoryId: TEST_CATEGORY_ID,
				amount: TEST_TRANSACTION_AMOUNT,
				date: expect.any(Date),
				payee: TEST_TRANSACTION_PAYEE,
				notes: TEST_TRANSACTION_NOTES
			})
			expect(response.body).toEqual({ transaction: mockNewTransaction })
		})
	})

	describe('PATCH /api/transactions/:transactionId', () => {
		it('should update a transaction', async () => {
			const updatedAmount = TEST_TRANSACTION_AMOUNT * 1.5
			const updatedPayee = 'Updated Payee'

			const response = await request(app)
				.patch(`/api/transactions/${TEST_TRANSACTION_ID}`)
				.send({
					accountId: TEST_ACCOUNT_ID,
					categoryId: TEST_CATEGORY_ID,
					amount: updatedAmount,
					date: TEST_TRANSACTION_DATE,
					payee: updatedPayee,
					notes: TEST_TRANSACTION_NOTES
				})
				.expect('Content-Type', /json/)
				.expect(200)

			expect(mockTransactionModel.editTransaction).toHaveBeenCalledWith({
				transactionId: TEST_TRANSACTION_ID,
				userId: mockUser.id,
				accountId: TEST_ACCOUNT_ID,
				categoryId: TEST_CATEGORY_ID,
				amount: updatedAmount,
				date: expect.any(Date),
				payee: updatedPayee,
				notes: TEST_TRANSACTION_NOTES
			})
			expect(response.body).toEqual(mockUpdatedTransaction)
		})
	})

	describe('DELETE /api/transactions/:transactionId', () => {
		it('should delete a specific transaction', async () => {
			const response = await request(app)
				.delete(`/api/transactions/${TEST_TRANSACTION_ID}`)
				.expect('Content-Type', /json/)
				.expect(200)

			expect(mockTransactionModel.deleteTransaction).toHaveBeenCalledWith({
				transactionId: TEST_TRANSACTION_ID,
				userId: mockUser.id
			})
			expect(response.body).toEqual({
				deletedTransaction: { id: TEST_TRANSACTION_ID }
			})
		})
	})

	describe('DELETE /api/transactions', () => {
		it('should delete multiple transactions', async () => {
			const response = await request(app)
				.delete('/api/transactions')
				.send({ transactionIds: [TEST_TRANSACTION_ID] })
				.expect('Content-Type', /json/)
				.expect(200)

			expect(mockTransactionModel.deleteTransactions).toHaveBeenCalledWith({
				userId: mockUser.id,
				transactionIds: [TEST_TRANSACTION_ID]
			})
			expect(response.body).toEqual({
				transactions: [{ id: TEST_TRANSACTION_ID }]
			})
		})
	})

	describe('Error handling', () => {
		it('should handle internal server errors on GET /api/transactions', async () => {
			mockTransactionModel.getTransactions.mockRejectedValueOnce(
				new Error('Database error')
			)

			const response = await request(app).get('/api/transactions').expect(500)

			expect(response.text).toBe('Failed to get transactions')
		})
	})
})
