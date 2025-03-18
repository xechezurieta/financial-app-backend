import { Router } from 'express'
import { HealthController } from '@/modules/health/controller'

export const createHealthRouter = () => {
	const healthRouter = Router()

	const healthController = new HealthController()

	healthRouter.get('/', healthController.health)

	return healthRouter
}
