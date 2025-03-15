import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response } from 'express'
import { PublicUserInfo } from '@/db/schema'
import { faker } from '@faker-js/faker'
import { AccountController } from '@/modules/account/controller'

// Extend Express Request type to include user information
declare global {
	namespace Express {
		interface Request {
			user?: PublicUserInfo
		}
	}
}

// Test constants
const TEST_USER_ID = faker.number.int({ min: 1, max: 1000 })
const TEST_USER_EMAIL = faker.internet.email()
const TEST_USER_ROLE = 'standard'

const TEST_ACCOUNT_ID = faker.string.uuid()
const TEST_NEW_ACCOUNT_ID = faker.string.uuid()
const TEST_ACCOUNT_NAME = faker.finance.accountName()
const TEST_NEW_ACCOUNT_NAME = faker.finance.accountName()
const TEST_UPDATED_ACCOUNT_NAME = faker.finance.accountName()

// Mock data
const mockAccount = {
	id: TEST_ACCOUNT_ID,
	name: TEST_ACCOUNT_NAME
}

const mockNewAccount = {
	id: TEST_NEW_ACCOUNT_ID,
	name: TEST_NEW_ACCOUNT_NAME
}

const mockUpdatedAccount = {
	id: TEST_ACCOUNT_ID,
	name: TEST_UPDATED_ACCOUNT_NAME
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

		// Similar error tests could be added for other methods
	})
})
