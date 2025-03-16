import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response } from 'express'
import { PublicUserInfo } from '@/db/schema'
import { AccountController } from '@/modules/account/controller'
import {
	TEST_USER_ID,
	TEST_USER_EMAIL,
	TEST_USER_ROLE,
	TEST_ACCOUNT_ID,
	TEST_NEW_ACCOUNT_NAME,
	TEST_UPDATED_ACCOUNT_NAME,
	mockAccount,
	mockNewAccount,
	mockUpdatedAccount
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
const fakeAccountModel = {
	getAccounts: vi.fn().mockResolvedValue([mockAccount]),
	getAccount: vi.fn().mockResolvedValue(mockAccount),
	createAccount: vi.fn().mockResolvedValue(mockNewAccount),
	deleteAccounts: vi.fn().mockResolvedValue([{ id: TEST_ACCOUNT_ID }]),
	deleteAccount: vi.fn().mockResolvedValue({ id: TEST_ACCOUNT_ID }),
	editAccountName: vi.fn().mockResolvedValue(mockUpdatedAccount)
}

describe('AccountController', () => {
	let controller: AccountController
	let req: Partial<Request>
	let res: Partial<Response>

	beforeEach(() => {
		// Reset mocks between tests
		vi.clearAllMocks()

		controller = new AccountController({ accountModel: fakeAccountModel })
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

	describe('getAccounts', () => {
		it('should return all user accounts when successful', async () => {
			// Act
			await controller.getAccounts(req as Request, res as Response)

			// Assert
			expect(fakeAccountModel.getAccounts).toHaveBeenCalledWith({
				userId: TEST_USER_ID
			})
			expect(res.json).toHaveBeenCalledWith({
				accounts: [mockAccount]
			})
		})

		it('should return 401 when user is not found', async () => {
			// Arrange
			req.user = undefined

			// Act
			await controller.getAccounts(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.send).toHaveBeenCalledWith('User not found')
			expect(fakeAccountModel.getAccounts).not.toHaveBeenCalled()
		})
	})

	describe('getAccount', () => {
		it('should return a single account when successful', async () => {
			// Arrange
			req.params = { accountId: TEST_ACCOUNT_ID }

			// Act
			await controller.getAccount(req as Request, res as Response)

			// Assert
			expect(fakeAccountModel.getAccount).toHaveBeenCalledWith({
				accountId: TEST_ACCOUNT_ID,
				userId: TEST_USER_ID
			})
			expect(res.json).toHaveBeenCalledWith({
				account: mockAccount
			})
		})

		it('should return 401 when user is not found', async () => {
			// Arrange
			req.params = { accountId: TEST_ACCOUNT_ID }
			req.user = undefined

			// Act
			await controller.getAccount(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.send).toHaveBeenCalledWith('User not found')
			expect(fakeAccountModel.getAccount).not.toHaveBeenCalled()
		})
	})

	describe('createAccount', () => {
		it('should create and return a new account when successful', async () => {
			// Arrange
			req.body = { name: TEST_NEW_ACCOUNT_NAME }

			// Act
			await controller.createAccount(req as Request, res as Response)

			// Assert
			expect(fakeAccountModel.createAccount).toHaveBeenCalledWith({
				userId: TEST_USER_ID,
				name: TEST_NEW_ACCOUNT_NAME
			})
			expect(res.json).toHaveBeenCalledWith({
				account: mockNewAccount
			})
		})

		it('should return 401 when user is not found', async () => {
			// Arrange
			req.body = { name: TEST_NEW_ACCOUNT_NAME }
			req.user = undefined

			// Act
			await controller.createAccount(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.send).toHaveBeenCalledWith('User not found')
			expect(fakeAccountModel.createAccount).not.toHaveBeenCalled()
		})
	})

	describe('deleteAccounts', () => {
		it('should delete multiple accounts when successful', async () => {
			// Arrange
			const accountIds = [TEST_ACCOUNT_ID]
			req.body = { accountIds }

			// Act
			await controller.deleteAccounts(req as Request, res as Response)

			// Assert
			expect(fakeAccountModel.deleteAccounts).toHaveBeenCalledWith({
				userId: TEST_USER_ID,
				accountIds
			})
			expect(res.json).toHaveBeenCalledWith({
				accounts: [{ id: TEST_ACCOUNT_ID }]
			})
		})

		it('should return 401 when user is not found', async () => {
			// Arrange
			const accountIds = [TEST_ACCOUNT_ID]
			req.body = { accountIds }
			req.user = undefined

			// Act
			await controller.deleteAccounts(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.send).toHaveBeenCalledWith('User not found')
			expect(fakeAccountModel.deleteAccounts).not.toHaveBeenCalled()
		})
	})

	describe('deleteAccount', () => {
		it('should delete a single account when successful', async () => {
			// Arrange
			req.params = { accountId: TEST_ACCOUNT_ID }

			// Act
			await controller.deleteAccount(req as Request, res as Response)

			// Assert
			expect(fakeAccountModel.deleteAccount).toHaveBeenCalledWith({
				accountId: TEST_ACCOUNT_ID,
				userId: TEST_USER_ID
			})
			expect(res.json).toHaveBeenCalledWith({
				deletedAccount: { id: TEST_ACCOUNT_ID }
			})
		})

		it('should return 401 when user is not found', async () => {
			// Arrange
			req.params = { accountId: TEST_ACCOUNT_ID }
			req.user = undefined

			// Act
			await controller.deleteAccount(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.send).toHaveBeenCalledWith('User not found')
			expect(fakeAccountModel.deleteAccount).not.toHaveBeenCalled()
		})
	})

	describe('editAccountName', () => {
		it('should update and return account name when successful', async () => {
			// Arrange
			req.params = { accountId: TEST_ACCOUNT_ID }
			req.body = { name: TEST_UPDATED_ACCOUNT_NAME }

			// Act
			await controller.editAccountName(req as Request, res as Response)

			// Assert
			expect(fakeAccountModel.editAccountName).toHaveBeenCalledWith({
				accountId: TEST_ACCOUNT_ID,
				userId: TEST_USER_ID,
				name: TEST_UPDATED_ACCOUNT_NAME
			})
			expect(res.json).toHaveBeenCalledWith({
				account: mockUpdatedAccount
			})
		})

		it('should return 401 when user is not found', async () => {
			// Arrange
			req.params = { accountId: TEST_ACCOUNT_ID }
			req.body = { name: TEST_UPDATED_ACCOUNT_NAME }
			req.user = undefined

			// Act
			await controller.editAccountName(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.send).toHaveBeenCalledWith('User not found')
			expect(fakeAccountModel.editAccountName).not.toHaveBeenCalled()
		})
	})

	// Test error handling in each method
	describe('error handling', () => {
		it('should handle errors in getAccounts', async () => {
			// Arrange
			const errorMessage = 'Database error'
			fakeAccountModel.getAccounts.mockRejectedValueOnce(
				new Error(errorMessage)
			)

			// Act
			await controller.getAccounts(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to get accounts')
		})

		it('should handle errors in getAccount', async () => {
			// Arrange
			req.params = { accountId: TEST_ACCOUNT_ID }
			const errorMessage = 'Database error'
			fakeAccountModel.getAccount.mockRejectedValueOnce(new Error(errorMessage))

			// Act
			await controller.getAccount(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to get account')
		})

		it('should handle errors in createAccount', async () => {
			// Arrange
			req.body = { name: TEST_NEW_ACCOUNT_NAME }
			const errorMessage = 'Database error'
			fakeAccountModel.createAccount.mockRejectedValueOnce(
				new Error(errorMessage)
			)

			// Act
			await controller.createAccount(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to create account')
		})

		it('should handle errors in deleteAccounts', async () => {
			// Arrange
			const accountIds = [TEST_ACCOUNT_ID]
			req.body = { accountIds }
			const errorMessage = 'Database error'
			fakeAccountModel.deleteAccounts.mockRejectedValueOnce(
				new Error(errorMessage)
			)

			// Act
			await controller.deleteAccounts(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to delete accounts')
		})

		it('should handle errors in deleteAccount', async () => {
			// Arrange
			req.params = { accountId: TEST_ACCOUNT_ID }
			const errorMessage = 'Database error'
			fakeAccountModel.deleteAccount.mockRejectedValueOnce(
				new Error(errorMessage)
			)

			// Act
			await controller.deleteAccount(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to delete account')
		})

		it('should handle errors in editAccountName', async () => {
			// Arrange
			req.params = { accountId: TEST_ACCOUNT_ID }
			req.body = { name: TEST_UPDATED_ACCOUNT_NAME }
			const errorMessage = 'Database error'
			fakeAccountModel.editAccountName.mockRejectedValueOnce(
				new Error(errorMessage)
			)

			// Act
			await controller.editAccountName(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to edit account name')
		})
	})
})
