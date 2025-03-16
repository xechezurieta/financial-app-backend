import request from 'supertest'
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import { createApp } from '@/app'
import {
	mockUser,
	mockAccount,
	mockNewAccount,
	mockUpdatedAccount,
	TEST_ACCOUNT_ID,
	TEST_NEW_ACCOUNT_NAME,
	TEST_UPDATED_ACCOUNT_NAME
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

// Mock account model
const mockAccountModel = {
	getAccounts: vi.fn().mockResolvedValue([mockAccount]),
	getAccount: vi.fn().mockResolvedValue(mockAccount),
	createAccount: vi.fn().mockResolvedValue(mockNewAccount),
	deleteAccounts: vi.fn().mockResolvedValue([{ id: TEST_ACCOUNT_ID }]),
	deleteAccount: vi.fn().mockResolvedValue({ id: TEST_ACCOUNT_ID }),
	editAccountName: vi.fn().mockResolvedValue(mockUpdatedAccount)
}

// Mock other required models with minimal implementations
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
	getCategoriesSummary: vi.fn().mockResolvedValue([]),
	getSummaryActiveDays: vi.fn().mockResolvedValue([])
}

const mockUserModel = {
	getUserByEmail: vi.fn().mockResolvedValue(null),
	create: vi.fn().mockResolvedValue({}),
	login: vi.fn().mockResolvedValue({})
}

describe('Account Integration Tests', () => {
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

	describe('GET /api/accounts', () => {
		it('should return all accounts for the authenticated user', async () => {
			const response = await request(app)
				.get('/api/accounts')
				.expect('Content-Type', /json/)
				.expect(200)

			expect(mockAccountModel.getAccounts).toHaveBeenCalledWith({
				userId: mockUser.id
			})
			expect(response.body).toEqual({ accounts: [mockAccount] })
		})
	})

	describe('GET /api/accounts/:accountId', () => {
		it('should return a specific account by ID', async () => {
			const response = await request(app)
				.get(`/api/accounts/${TEST_ACCOUNT_ID}`)
				.expect('Content-Type', /json/)
				.expect(200)

			expect(mockAccountModel.getAccount).toHaveBeenCalledWith({
				accountId: TEST_ACCOUNT_ID,
				userId: mockUser.id
			})
			expect(response.body).toEqual({ account: mockAccount })
		})
	})

	describe('POST /api/accounts', () => {
		it('should create a new account', async () => {
			const response = await request(app)
				.post('/api/accounts')
				.send({ name: TEST_NEW_ACCOUNT_NAME })
				.expect('Content-Type', /json/)
				.expect(200)

			expect(mockAccountModel.createAccount).toHaveBeenCalledWith({
				userId: mockUser.id,
				name: TEST_NEW_ACCOUNT_NAME
			})
			expect(response.body).toEqual({ account: mockNewAccount })
		})

		it('should return 400 if name is missing', async () => {
			await request(app).post('/api/accounts').send({}).expect(400)

			expect(mockAccountModel.createAccount).not.toHaveBeenCalled()
		})
	})

	describe('PUT /api/accounts/:accountId', () => {
		it('should update an account name', async () => {
			const response = await request(app)
				.put(`/api/accounts/${TEST_ACCOUNT_ID}`)
				.send({ name: TEST_UPDATED_ACCOUNT_NAME })
				.expect('Content-Type', /json/)
				.expect(200)

			expect(mockAccountModel.editAccountName).toHaveBeenCalledWith({
				accountId: TEST_ACCOUNT_ID,
				userId: mockUser.id,
				name: TEST_UPDATED_ACCOUNT_NAME
			})
			expect(response.body).toEqual({ account: mockUpdatedAccount })
		})

		it('should return 400 if name is missing', async () => {
			await request(app)
				.put(`/api/accounts/${TEST_ACCOUNT_ID}`)
				.send({})
				.expect(400)

			expect(mockAccountModel.editAccountName).not.toHaveBeenCalled()
		})
	})

	describe('DELETE /api/accounts/:accountId', () => {
		it('should delete a specific account', async () => {
			const response = await request(app)
				.delete(`/api/accounts/${TEST_ACCOUNT_ID}`)
				.expect('Content-Type', /json/)
				.expect(200)

			expect(mockAccountModel.deleteAccount).toHaveBeenCalledWith({
				accountId: TEST_ACCOUNT_ID,
				userId: mockUser.id
			})
			expect(response.body).toEqual({ deletedAccount: { id: TEST_ACCOUNT_ID } })
		})
	})

	describe('DELETE /api/accounts', () => {
		it('should delete multiple accounts', async () => {
			const response = await request(app)
				.delete('/api/accounts')
				.send({ accountIds: [TEST_ACCOUNT_ID] })
				.expect('Content-Type', /json/)
				.expect(200)

			expect(mockAccountModel.deleteAccounts).toHaveBeenCalledWith({
				userId: mockUser.id,
				accountIds: [TEST_ACCOUNT_ID]
			})
			expect(response.body).toEqual({ accounts: [{ id: TEST_ACCOUNT_ID }] })
		})

		it('should return 400 if accountIds is missing', async () => {
			await request(app).delete('/api/accounts').send({}).expect(400)

			expect(mockAccountModel.deleteAccounts).not.toHaveBeenCalled()
		})
	})

	describe('Error handling', () => {
		it('should handle internal server errors on GET /api/accounts', async () => {
			mockAccountModel.getAccounts.mockRejectedValueOnce(
				new Error('Database error')
			)

			const response = await request(app).get('/api/accounts').expect(500)

			expect(response.text).toBe('Failed to get accounts')
		})
	})
})
