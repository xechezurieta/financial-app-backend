import { RequestHandler } from 'express'
import { auth } from '@/lib/auth'
import { fromNodeHeaders } from 'better-auth/node'

export class AuthController {
	getSession: RequestHandler = async (req, res) => {
		try {
			const session = await auth.api.getSession({
				headers: fromNodeHeaders(req.headers)
			})

			res.json(session)
		} catch (error) {
			console.error('Failed to get session', error)
			res.status(500).send('Failed to get session')
		}
	}
}
