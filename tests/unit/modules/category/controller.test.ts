import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response } from 'express'
import { PublicUserInfo } from '@/db/schema'
import { CategoryController } from '@/modules/category/controller'
import {
	TEST_USER_ID,
	TEST_USER_EMAIL,
	TEST_USER_ROLE,
	TEST_CATEGORY_ID,
	TEST_NEW_CATEGORY_NAME,
	TEST_UPDATED_CATEGORY_NAME,
	mockCategory,
	mockNewCategory,
	mockUpdatedCategory
} from '@tests/common/constants'

// Extend Express Request type to include user information
declare global {
	namespace Express {
		interface Request {
			user?: PublicUserInfo
		}
	}
}

// Mock model with typed responses
const fakeCategoryModel = {
	getCategories: vi.fn().mockResolvedValue([mockCategory]),
	getCategory: vi.fn().mockResolvedValue(mockCategory),
	createCategory: vi.fn().mockResolvedValue(mockNewCategory),
	deleteCategories: vi.fn().mockResolvedValue([{ id: TEST_CATEGORY_ID }]),
	deleteCategory: vi.fn().mockResolvedValue({ id: TEST_CATEGORY_ID }),
	editCategoryName: vi.fn().mockResolvedValue(mockUpdatedCategory)
}

describe('CategoryController', () => {
	let controller: CategoryController
	let req: Partial<Request>
	let res: Partial<Response>

	beforeEach(() => {
		// Reset mocks between tests
		vi.clearAllMocks()

		controller = new CategoryController({ categoryModel: fakeCategoryModel })
		req = {
			user: { id: TEST_USER_ID, email: TEST_USER_EMAIL, role: TEST_USER_ROLE },
			body: {},
			params: {}
		}
		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
			send: vi.fn()
		}
	})

	describe('getCategories', () => {
		it('should return all user categories when successful', async () => {
			// Act
			await controller.getCategories(req as Request, res as Response)

			// Assert
			expect(fakeCategoryModel.getCategories).toHaveBeenCalledWith({
				userId: TEST_USER_ID
			})
			expect(res.json).toHaveBeenCalledWith({
				categories: [mockCategory]
			})
		})

		it('should return 401 when user is not found', async () => {
			// Arrange
			req.user = undefined

			// Act
			await controller.getCategories(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.send).toHaveBeenCalledWith('User not found')
			expect(fakeCategoryModel.getCategories).not.toHaveBeenCalled()
		})
	})

	describe('getCategory', () => {
		it('should return a single category when successful', async () => {
			// Arrange
			req.params = { categoryId: TEST_CATEGORY_ID }

			// Act
			await controller.getCategory(req as Request, res as Response)

			// Assert
			expect(fakeCategoryModel.getCategory).toHaveBeenCalledWith({
				categoryId: TEST_CATEGORY_ID,
				userId: TEST_USER_ID
			})
			expect(res.json).toHaveBeenCalledWith({
				category: mockCategory
			})
		})

		it('should return 401 when user is not found', async () => {
			// Arrange
			req.params = { categoryId: TEST_CATEGORY_ID }
			req.user = undefined

			// Act
			await controller.getCategory(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.send).toHaveBeenCalledWith('User not found')
			expect(fakeCategoryModel.getCategory).not.toHaveBeenCalled()
		})
	})

	describe('createCategory', () => {
		it('should create and return a new category when successful', async () => {
			// Arrange
			req.body = { name: TEST_NEW_CATEGORY_NAME }

			// Act
			await controller.createCategory(req as Request, res as Response)

			// Assert
			expect(fakeCategoryModel.createCategory).toHaveBeenCalledWith({
				userId: TEST_USER_ID,
				name: TEST_NEW_CATEGORY_NAME
			})
			expect(res.json).toHaveBeenCalledWith({
				category: mockNewCategory
			})
		})

		it('should return 401 when user is not found', async () => {
			// Arrange
			req.body = { name: TEST_NEW_CATEGORY_NAME }
			req.user = undefined

			// Act
			await controller.createCategory(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.send).toHaveBeenCalledWith('User not found')
			expect(fakeCategoryModel.createCategory).not.toHaveBeenCalled()
		})
	})

	describe('deleteCategories', () => {
		it('should delete multiple categories when successful', async () => {
			// Arrange
			const categoryIds = [TEST_CATEGORY_ID]
			req.body = { categoryIds }

			// Act
			await controller.deleteCategories(req as Request, res as Response)

			// Assert
			expect(fakeCategoryModel.deleteCategories).toHaveBeenCalledWith({
				userId: TEST_USER_ID,
				categoryIds
			})
			expect(res.json).toHaveBeenCalledWith({
				categories: [{ id: TEST_CATEGORY_ID }]
			})
		})

		it('should return 401 when user is not found', async () => {
			// Arrange
			const categoryIds = [TEST_CATEGORY_ID]
			req.body = { categoryIds }
			req.user = undefined

			// Act
			await controller.deleteCategories(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.send).toHaveBeenCalledWith('User not found')
			expect(fakeCategoryModel.deleteCategories).not.toHaveBeenCalled()
		})
	})

	describe('deleteCategory', () => {
		it('should delete a single category when successful', async () => {
			// Arrange
			req.params = { categoryId: TEST_CATEGORY_ID }

			// Act
			await controller.deleteCategory(req as Request, res as Response)

			// Assert
			expect(fakeCategoryModel.deleteCategory).toHaveBeenCalledWith({
				categoryId: TEST_CATEGORY_ID,
				userId: TEST_USER_ID
			})
			expect(res.json).toHaveBeenCalledWith({
				deletedCategory: { id: TEST_CATEGORY_ID }
			})
		})

		it('should return 401 when user is not found', async () => {
			// Arrange
			req.params = { categoryId: TEST_CATEGORY_ID }
			req.user = undefined

			// Act
			await controller.deleteCategory(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.send).toHaveBeenCalledWith('User not found')
			expect(fakeCategoryModel.deleteCategory).not.toHaveBeenCalled()
		})
	})

	describe('editCategoryName', () => {
		it('should update and return category name when successful', async () => {
			// Arrange
			req.params = { categoryId: TEST_CATEGORY_ID }
			req.body = { name: TEST_UPDATED_CATEGORY_NAME }

			// Act
			await controller.editCategoryName(req as Request, res as Response)

			// Assert
			expect(fakeCategoryModel.editCategoryName).toHaveBeenCalledWith({
				categoryId: TEST_CATEGORY_ID,
				userId: TEST_USER_ID,
				name: TEST_UPDATED_CATEGORY_NAME
			})
			expect(res.json).toHaveBeenCalledWith({
				category: mockUpdatedCategory
			})
		})

		it('should return 401 when user is not found', async () => {
			// Arrange
			req.params = { categoryId: TEST_CATEGORY_ID }
			req.body = { name: TEST_UPDATED_CATEGORY_NAME }
			req.user = undefined

			// Act
			await controller.editCategoryName(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.send).toHaveBeenCalledWith('User not found')
			expect(fakeCategoryModel.editCategoryName).not.toHaveBeenCalled()
		})
	})

	// Test error handling in each method
	describe('error handling', () => {
		it('should handle errors in getCategories', async () => {
			// Arrange
			const errorMessage = 'Database error'
			fakeCategoryModel.getCategories.mockRejectedValueOnce(
				new Error(errorMessage)
			)

			// Act
			await controller.getCategories(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to get categories')
		})

		it('should handle errors in getCategory', async () => {
			// Arrange
			req.params = { categoryId: TEST_CATEGORY_ID }
			const errorMessage = 'Database error'
			fakeCategoryModel.getCategory.mockRejectedValueOnce(
				new Error(errorMessage)
			)

			// Act
			await controller.getCategory(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to get category')
		})

		it('should handle errors in createCategory', async () => {
			// Arrange
			req.body = { name: TEST_NEW_CATEGORY_NAME }
			const errorMessage = 'Database error'
			fakeCategoryModel.createCategory.mockRejectedValueOnce(
				new Error(errorMessage)
			)

			// Act
			await controller.createCategory(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to create category')
		})

		it('should handle errors in deleteCategories', async () => {
			// Arrange
			const categoryIds = [TEST_CATEGORY_ID]
			req.body = { categoryIds }
			const errorMessage = 'Database error'
			fakeCategoryModel.deleteCategories.mockRejectedValueOnce(
				new Error(errorMessage)
			)

			// Act
			await controller.deleteCategories(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to delete categories')
		})

		it('should handle errors in deleteCategory', async () => {
			// Arrange
			req.params = { categoryId: TEST_CATEGORY_ID }
			const errorMessage = 'Database error'
			fakeCategoryModel.deleteCategory.mockRejectedValueOnce(
				new Error(errorMessage)
			)

			// Act
			await controller.deleteCategory(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to delete category')
		})

		it('should handle errors in editCategoryName', async () => {
			// Arrange
			req.params = { categoryId: TEST_CATEGORY_ID }
			req.body = { name: TEST_UPDATED_CATEGORY_NAME }
			const errorMessage = 'Database error'
			fakeCategoryModel.editCategoryName.mockRejectedValueOnce(
				new Error(errorMessage)
			)

			// Act
			await controller.editCategoryName(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to edit category name')
		})
	})
})
