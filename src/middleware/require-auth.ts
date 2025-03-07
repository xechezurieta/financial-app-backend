import { auth } from '@/lib/auth'
import { Request, Response, NextFunction } from 'express'
import { fromNodeHeaders } from 'better-auth/node'

declare global {
	namespace Express {
		interface Request {
			user: any
		}
	}
}

export const authenticatedUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const session = await auth.api.getSession({
			headers: fromNodeHeaders(req.headers)
		}) // Get session using better-auth
		console.log('requireAuth', session)
		if (!session) {
			res.status(401).json({ error: 'Unauthorized' }) // Reject if no session
			return
		}

		req.user = session?.user // Attach user to request
		console.log('req.user', req.user)
		next() // Continue to next middleware
	} catch (error) {
		next(error) // Pass error to Express error handler
	}
}
