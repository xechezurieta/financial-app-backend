import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response } from 'express'
import { UserController } from '@/modules/user/controller'
import {
	TEST_USER_ID,
	TEST_USER_EMAIL,
	TEST_USER_ROLE
} from '@tests/common/constants'
import jwt from 'jsonwebtoken'

// Mock jwt.sign function
vi.mock('jsonwebtoken', () => ({
	default: {
		sign: vi.fn().mockReturnValue('mocked-jwt-token')
	}
}))

// Set JWT_SECRET for testing
process.env.JWT_SECRET = 'test-secret'

// Mock user data
const mockUser = {
	id: TEST_USER_ID,
	email: TEST_USER_EMAIL,
	role: TEST_USER_ROLE
}

// Mock password for testing
const TEST_USER_PASSWORD = 'securePassword123'

// Mock model with typed responses
const fakeUserModel = {
	create: vi.fn().mockResolvedValue(mockUser),
	login: vi.fn().mockResolvedValue(mockUser)
}

describe('UserController', () => {
	let controller: UserController
	let req: Partial<Request>
	let res: Partial<Response>

	beforeEach(() => {
		// Reset mocks between tests
		vi.clearAllMocks()

		controller = new UserController({ userModel: fakeUserModel })
		req = {
			body: {
				email: TEST_USER_EMAIL,
				password: TEST_USER_PASSWORD
			}
		}
		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
			send: vi.fn()
		}
	})

	describe('register', () => {
		it('should create and return a new user when successful', async () => {
			// Act
			await controller.register(req as Request, res as Response)

			// Assert
			expect(fakeUserModel.create).toHaveBeenCalledWith({
				email: TEST_USER_EMAIL,
				password: TEST_USER_PASSWORD
			})
			expect(res.json).toHaveBeenCalledWith({
				user: mockUser
			})
		})

		it('should handle errors during registration', async () => {
			// Arrange
			const errorMessage = 'Email already in use'
			fakeUserModel.create.mockRejectedValueOnce(new Error(errorMessage))

			// Act
			await controller.register(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to register user')
		})
	})

	describe('login', () => {
		it('should login and return user with token when successful', async () => {
			// Act
			await controller.login(req as Request, res as Response)

			// Assert
			expect(fakeUserModel.login).toHaveBeenCalledWith({
				email: TEST_USER_EMAIL,
				password: TEST_USER_PASSWORD
			})
			expect(jwt.sign).toHaveBeenCalledWith(
				{ id: TEST_USER_ID, email: TEST_USER_EMAIL, role: TEST_USER_ROLE },
				'test-secret',
				{ expiresIn: '24h' }
			)
			expect(res.json).toHaveBeenCalledWith({
				user: mockUser,
				token: 'mocked-jwt-token'
			})
		})

		it('should handle errors during login', async () => {
			// Arrange
			const errorMessage = 'Invalid credentials'
			fakeUserModel.login.mockRejectedValueOnce(new Error(errorMessage))

			// Act
			await controller.login(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to login user')
		})

		it('should handle missing JWT_SECRET', async () => {
			// Arrange
			const originalSecret = process.env.JWT_SECRET
			delete process.env.JWT_SECRET

			// Act
			await controller.login(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to login user')

			// Restore JWT_SECRET
			process.env.JWT_SECRET = originalSecret
		})
	})
})
