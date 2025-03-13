import { PublicUserInfo } from '@/db/schema'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// Extend Express Request type to include user information
declare global {
	namespace Express {
		interface Request {
			user?: PublicUserInfo
		}
	}
}

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Get authorization header
		const authHeader = req.headers.authorization
		if (!authHeader) {
			res.status(401).json({ message: 'Authorization header missing' })
			return
		}

		// Check if it's a bearer token
		if (!authHeader.startsWith('Bearer ')) {
			res.status(401).json({ message: 'Invalid token format' })
			return
		}

		// Extract the token
		const token = authHeader.split(' ')[1]

		if (!token) {
			res.status(401).json({ message: 'Token missing' })
			return
		}
		// Verify the token
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || 'default_secret'
		) as PublicUserInfo

		// Attach user info to request
		req.user = decoded

		next()
	} catch (error) {
		console.error('Auth middleware error:', error)
		res.status(401).json({ message: 'Invalid or expired token' })
	}
}
