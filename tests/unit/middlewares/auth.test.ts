import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { authMiddleware } from '@/middlewares/auth'
import { mockUser } from '@tests/common/constants'

vi.mock('jsonwebtoken')

describe('authMiddleware', () => {
	let req: Partial<Request>
	let res: Partial<Response>
	let next: NextFunction

	beforeEach(() => {
		req = {
			headers: {}
		}

		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn()
		}

		next = vi.fn()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('should return 401 if authorization header is missing', () => {
		authMiddleware(req as Request, res as Response, next)

		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({
			message: 'Authorization header missing'
		})
		expect(next).not.toHaveBeenCalled()
	})

	it('should return 401 if authorization header is not a Bearer token', () => {
		req.headers!.authorization = 'Basic token123'

		authMiddleware(req as Request, res as Response, next)

		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token format' })
		expect(next).not.toHaveBeenCalled()
	})

	it('should return 401 if token is missing after Bearer', () => {
		req.headers!.authorization = 'Bearer '

		authMiddleware(req as Request, res as Response, next)

		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({ message: 'Token missing' })
		expect(next).not.toHaveBeenCalled()
	})

	it('should return 401 if token is invalid or expired', () => {
		req.headers!.authorization = 'Bearer invalidtoken123'

		vi.mocked(jwt.verify).mockImplementation(() => {
			throw new Error('Invalid token')
		})

		authMiddleware(req as Request, res as Response, next)

		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({
			message: 'Invalid or expired token'
		})
		expect(next).not.toHaveBeenCalled()
	})

	it('should attach user info to request and call next if token is valid', () => {
		req.headers!.authorization = 'Bearer validtoken123'

		vi.mocked(jwt.verify).mockReturnValue(mockUser as any)

		authMiddleware(req as Request, res as Response, next)

		expect(req.user).toEqual(mockUser)
		expect(next).toHaveBeenCalled()
		expect(res.status).not.toHaveBeenCalled()
		expect(res.json).not.toHaveBeenCalled()
	})
})
