import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response } from 'express'
import { PublicUserInfo } from '@/db/schema'
import { TransactionController } from '@/modules/transaction/controller'
import {
	TEST_USER_ID,
	TEST_USER_EMAIL,
	TEST_USER_ROLE,
	TEST_ACCOUNT_ID,
	TEST_CATEGORY_ID,
	TEST_TRANSACTION_ID,
	TEST_TRANSACTION_AMOUNT,
	TEST_TRANSACTION_DATE,
	TEST_TRANSACTION_PAYEE,
	TEST_TRANSACTION_NOTES,
	mockTransaction,
	mockNewTransaction,
	mockUpdatedTransaction
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
const fakeTransactionModel = {
	getTransactions: vi.fn().mockResolvedValue([mockTransaction]),
	getTransaction: vi.fn().mockResolvedValue(mockTransaction),
	createTransaction: vi.fn().mockResolvedValue(mockNewTransaction),
	deleteTransactions: vi.fn().mockResolvedValue([{ id: TEST_TRANSACTION_ID }]),
	deleteTransaction: vi.fn().mockResolvedValue({ id: TEST_TRANSACTION_ID }),
	editTransaction: vi.fn().mockResolvedValue(mockUpdatedTransaction)
}

describe('TransactionController', () => {
	let controller: TransactionController
	let req: Partial<Request>
	let res: Partial<Response>

	beforeEach(() => {
		// Reset mocks between tests
		vi.clearAllMocks()

		controller = new TransactionController({
			transactionModel: fakeTransactionModel
		})
		req = {
			user: { id: TEST_USER_ID, email: TEST_USER_EMAIL, role: TEST_USER_ROLE },
			body: {},
			params: {},
			query: {}
		}
		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
			send: vi.fn()
		}
	})

	describe('getTransactions', () => {
		it('should return all user transactions when successful', async () => {
			// Arrange
			req.query = {
				from: '2023-01-01',
				to: '2023-12-31',
				accountId: TEST_ACCOUNT_ID
			}

			// Act
			await controller.getTransactions(req as Request, res as Response)

			// Assert
			expect(fakeTransactionModel.getTransactions).toHaveBeenCalledWith({
				userId: TEST_USER_ID,
				from: '2023-01-01',
				to: '2023-12-31',
				accountId: TEST_ACCOUNT_ID
			})
			expect(res.json).toHaveBeenCalledWith({
				transactions: [mockTransaction]
			})
		})

		it('should return 401 when user is not found', async () => {
			// Arrange
			req.user = undefined

			// Act
			await controller.getTransactions(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.send).toHaveBeenCalledWith('User not found')
			expect(fakeTransactionModel.getTransactions).not.toHaveBeenCalled()
		})
	})

	describe('getTransaction', () => {
		it('should return a single transaction when successful', async () => {
			// Arrange
			req.params = { transactionId: TEST_TRANSACTION_ID }

			// Act
			await controller.getTransaction(req as Request, res as Response)

			// Assert
			expect(fakeTransactionModel.getTransaction).toHaveBeenCalledWith({
				transactionId: TEST_TRANSACTION_ID,
				userId: TEST_USER_ID
			})
			expect(res.json).toHaveBeenCalledWith({
				transaction: mockTransaction
			})
		})

		it('should return 401 when user is not found', async () => {
			// Arrange
			req.params = { transactionId: TEST_TRANSACTION_ID }
			req.user = undefined

			// Act
			await controller.getTransaction(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.send).toHaveBeenCalledWith('User not found')
			expect(fakeTransactionModel.getTransaction).not.toHaveBeenCalled()
		})
	})

	describe('createTransaction', () => {
		it('should create and return a new transaction when successful', async () => {
			// Arrange
			req.body = {
				accountId: TEST_ACCOUNT_ID,
				categoryId: TEST_CATEGORY_ID,
				amount: TEST_TRANSACTION_AMOUNT,
				date: TEST_TRANSACTION_DATE.toISOString(),
				payee: TEST_TRANSACTION_PAYEE,
				notes: TEST_TRANSACTION_NOTES
			}

			// Act
			await controller.createTransaction(req as Request, res as Response)

			// Assert
			expect(fakeTransactionModel.createTransaction).toHaveBeenCalledWith({
				userId: TEST_USER_ID,
				accountId: TEST_ACCOUNT_ID,
				categoryId: TEST_CATEGORY_ID,
				amount: TEST_TRANSACTION_AMOUNT,
				date: expect.any(Date),
				payee: TEST_TRANSACTION_PAYEE,
				notes: TEST_TRANSACTION_NOTES
			})
			expect(res.json).toHaveBeenCalledWith({
				transaction: mockNewTransaction
			})
		})

		it('should return 401 when user is not found', async () => {
			// Arrange
			req.body = {
				accountId: TEST_ACCOUNT_ID,
				categoryId: TEST_CATEGORY_ID,
				amount: TEST_TRANSACTION_AMOUNT
			}
			req.user = undefined

			// Act
			await controller.createTransaction(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.send).toHaveBeenCalledWith('User not found')
			expect(fakeTransactionModel.createTransaction).not.toHaveBeenCalled()
		})
	})

	describe('deleteTransactions', () => {
		it('should delete multiple transactions when successful', async () => {
			// Arrange
			const transactionIds = [TEST_TRANSACTION_ID]
			req.body = { transactionIds }

			// Act
			await controller.deleteTransactions(req as Request, res as Response)

			// Assert
			expect(fakeTransactionModel.deleteTransactions).toHaveBeenCalledWith({
				userId: TEST_USER_ID,
				transactionIds
			})
			expect(res.json).toHaveBeenCalledWith({
				transactions: [{ id: TEST_TRANSACTION_ID }]
			})
		})

		it('should return 401 when user is not found', async () => {
			// Arrange
			const transactionIds = [TEST_TRANSACTION_ID]
			req.body = { transactionIds }
			req.user = undefined

			// Act
			await controller.deleteTransactions(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.send).toHaveBeenCalledWith('User not found')
			expect(fakeTransactionModel.deleteTransactions).not.toHaveBeenCalled()
		})
	})

	describe('deleteTransaction', () => {
		it('should delete a single transaction when successful', async () => {
			// Arrange
			req.params = { transactionId: TEST_TRANSACTION_ID }

			// Act
			await controller.deleteTransaction(req as Request, res as Response)

			// Assert
			expect(fakeTransactionModel.deleteTransaction).toHaveBeenCalledWith({
				transactionId: TEST_TRANSACTION_ID,
				userId: TEST_USER_ID
			})
			expect(res.json).toHaveBeenCalledWith({
				deletedTransaction: { id: TEST_TRANSACTION_ID }
			})
		})

		it('should return 401 when user is not found', async () => {
			// Arrange
			req.params = { transactionId: TEST_TRANSACTION_ID }
			req.user = undefined

			// Act
			await controller.deleteTransaction(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.send).toHaveBeenCalledWith('User not found')
			expect(fakeTransactionModel.deleteTransaction).not.toHaveBeenCalled()
		})
	})

	describe('editTransaction', () => {
		it('should update and return transaction when successful', async () => {
			// Arrange
			req.params = { transactionId: TEST_TRANSACTION_ID }
			req.body = {
				accountId: TEST_ACCOUNT_ID,
				categoryId: TEST_CATEGORY_ID,
				amount: TEST_TRANSACTION_AMOUNT * 1.5,
				date: TEST_TRANSACTION_DATE.toISOString(),
				payee: mockUpdatedTransaction.payee,
				notes: mockUpdatedTransaction.notes
			}

			// Act
			await controller.editTransaction(req as Request, res as Response)

			// Assert
			expect(fakeTransactionModel.editTransaction).toHaveBeenCalledWith({
				transactionId: TEST_TRANSACTION_ID,
				userId: TEST_USER_ID,
				accountId: TEST_ACCOUNT_ID,
				categoryId: TEST_CATEGORY_ID,
				amount: TEST_TRANSACTION_AMOUNT * 1.5,
				date: expect.any(Date),
				payee: mockUpdatedTransaction.payee,
				notes: mockUpdatedTransaction.notes
			})
			expect(res.json).toHaveBeenCalledWith(mockUpdatedTransaction)
		})

		it('should return 401 when user is not found', async () => {
			// Arrange
			req.params = { transactionId: TEST_TRANSACTION_ID }
			req.body = { amount: TEST_TRANSACTION_AMOUNT * 1.5 }
			req.user = undefined

			// Act
			await controller.editTransaction(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.send).toHaveBeenCalledWith('User not found')
			expect(fakeTransactionModel.editTransaction).not.toHaveBeenCalled()
		})
	})

	// Test error handling in each method
	describe('error handling', () => {
		it('should handle errors in getTransactions', async () => {
			// Arrange
			const errorMessage = 'Database error'
			fakeTransactionModel.getTransactions.mockRejectedValueOnce(
				new Error(errorMessage)
			)

			// Act
			await controller.getTransactions(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to get transactions')
		})

		it('should handle errors in getTransaction', async () => {
			// Arrange
			req.params = { transactionId: TEST_TRANSACTION_ID }
			const errorMessage = 'Database error'
			fakeTransactionModel.getTransaction.mockRejectedValueOnce(
				new Error(errorMessage)
			)

			// Act
			await controller.getTransaction(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to get transaction')
		})

		it('should handle errors in createTransaction', async () => {
			// Arrange
			req.body = {
				accountId: TEST_ACCOUNT_ID,
				amount: TEST_TRANSACTION_AMOUNT
			}
			const errorMessage = 'Database error'
			fakeTransactionModel.createTransaction.mockRejectedValueOnce(
				new Error(errorMessage)
			)

			// Act
			await controller.createTransaction(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to create transaction')
		})

		it('should handle errors in deleteTransactions', async () => {
			// Arrange
			const transactionIds = [TEST_TRANSACTION_ID]
			req.body = { transactionIds }
			const errorMessage = 'Database error'
			fakeTransactionModel.deleteTransactions.mockRejectedValueOnce(
				new Error(errorMessage)
			)

			// Act
			await controller.deleteTransactions(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to delete transactions')
		})

		it('should handle errors in deleteTransaction', async () => {
			// Arrange
			req.params = { transactionId: TEST_TRANSACTION_ID }
			const errorMessage = 'Database error'
			fakeTransactionModel.deleteTransaction.mockRejectedValueOnce(
				new Error(errorMessage)
			)

			// Act
			await controller.deleteTransaction(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to delete transaction')
		})

		it('should handle errors in editTransaction', async () => {
			// Arrange
			req.params = { transactionId: TEST_TRANSACTION_ID }
			req.body = { amount: TEST_TRANSACTION_AMOUNT }
			const errorMessage = 'Database error'
			fakeTransactionModel.editTransaction.mockRejectedValueOnce(
				new Error(errorMessage)
			)

			// Act
			await controller.editTransaction(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to edit transaction')
		})
	})
})
