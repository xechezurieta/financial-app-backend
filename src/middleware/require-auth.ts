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

export const requireAuth = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const session = await auth.api.getSession({
		headers: fromNodeHeaders(req.headers)
	}) // Get session using better-auth

	if (!session) {
		return res.status(401).json({ error: 'Unauthorized' }) // Reject if no session
	}

	req.user = session.user // Attach user to request (if needed)
	next() // Continue to next middleware
}
