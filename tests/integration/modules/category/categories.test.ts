import request from 'supertest'
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import { createApp } from '@/app'
import {
	mockUser,
	mockCategory,
	mockNewCategory,
	mockUpdatedCategory,
	TEST_CATEGORY_ID,
	TEST_NEW_CATEGORY_NAME,
	TEST_UPDATED_CATEGORY_NAME
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

// Mock category model
const mockCategoryModel = {
	getCategories: vi.fn().mockResolvedValue([mockCategory]),
	getCategory: vi.fn().mockResolvedValue(mockCategory),
	createCategory: vi.fn().mockResolvedValue(mockNewCategory),
	deleteCategories: vi.fn().mockResolvedValue([{ id: TEST_CATEGORY_ID }]),
	deleteCategory: vi.fn().mockResolvedValue({ id: TEST_CATEGORY_ID }),
	editCategoryName: vi.fn().mockResolvedValue(mockUpdatedCategory)
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

describe('Category Integration Tests', () => {
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

	describe('GET /api/categories', () => {
		it('should return all categories for the authenticated user', async () => {
			const response = await request(app)
				.get('/api/categories')
				.expect('Content-Type', /json/)
				.expect(200)

			expect(mockCategoryModel.getCategories).toHaveBeenCalledWith({
				userId: mockUser.id
			})
			expect(response.body).toEqual({ categories: [mockCategory] })
		})
	})

	describe('GET /api/categories/:categoryId', () => {
		it('should return a specific category by ID', async () => {
			const response = await request(app)
				.get(`/api/categories/${TEST_CATEGORY_ID}`)
				.expect('Content-Type', /json/)
				.expect(200)

			expect(mockCategoryModel.getCategory).toHaveBeenCalledWith({
				categoryId: TEST_CATEGORY_ID,
				userId: mockUser.id
			})
			expect(response.body).toEqual({ category: mockCategory })
		})
	})

	describe('POST /api/categories', () => {
		it('should create a new category', async () => {
			const response = await request(app)
				.post('/api/categories')
				.send({ name: TEST_NEW_CATEGORY_NAME })
				.expect('Content-Type', /json/)
				.expect(200)

			expect(mockCategoryModel.createCategory).toHaveBeenCalledWith({
				userId: mockUser.id,
				name: TEST_NEW_CATEGORY_NAME
			})
			expect(response.body).toEqual({ category: mockNewCategory })
		})
	})

	describe('PATCH /api/categories/:categoryId', () => {
		it('should update a category name', async () => {
			const response = await request(app)
				.patch(`/api/categories/${TEST_CATEGORY_ID}`)
				.send({ name: TEST_UPDATED_CATEGORY_NAME })
				.expect('Content-Type', /json/)
				.expect(200)

			expect(mockCategoryModel.editCategoryName).toHaveBeenCalledWith({
				categoryId: TEST_CATEGORY_ID,
				userId: mockUser.id,
				name: TEST_UPDATED_CATEGORY_NAME
			})
			expect(response.body).toEqual({ category: mockUpdatedCategory })
		})
	})

	describe('DELETE /api/categories/:categoryId', () => {
		it('should delete a specific category', async () => {
			const response = await request(app)
				.delete(`/api/categories/${TEST_CATEGORY_ID}`)
				.expect('Content-Type', /json/)
				.expect(200)

			expect(mockCategoryModel.deleteCategory).toHaveBeenCalledWith({
				categoryId: TEST_CATEGORY_ID,
				userId: mockUser.id
			})
			expect(response.body).toEqual({
				deletedCategory: { id: TEST_CATEGORY_ID }
			})
		})
	})

	describe('DELETE /api/categories', () => {
		it('should delete multiple categories', async () => {
			const response = await request(app)
				.delete('/api/categories')
				.send({ categoryIds: [TEST_CATEGORY_ID] })
				.expect('Content-Type', /json/)
				.expect(200)

			expect(mockCategoryModel.deleteCategories).toHaveBeenCalledWith({
				userId: mockUser.id,
				categoryIds: [TEST_CATEGORY_ID]
			})
			expect(response.body).toEqual({ categories: [{ id: TEST_CATEGORY_ID }] })
		})
	})

	describe('Error handling', () => {
		it('should handle internal server errors on GET /api/categories', async () => {
			mockCategoryModel.getCategories.mockRejectedValueOnce(
				new Error('Database error')
			)

			const response = await request(app).get('/api/categories').expect(500)

			expect(response.text).toBe('Failed to get categories')
		})
	})
})
