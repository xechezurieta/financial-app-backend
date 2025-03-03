import { Router } from 'express'
import { AuthController } from '@/features/auth/controller'

export const createAuthRouter = () => {
	const authRouter = Router()
	const authController = new AuthController()

	authRouter.get('/me', authController.getSession)

	return authRouter
}
