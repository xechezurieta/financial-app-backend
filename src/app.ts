import express, { Application, json } from 'express'
import cors from 'cors'
import 'dotenv/config'

// Feature routers
import { createAccountRouter } from '@/modules/account/router'
import { createCategoryRouter } from '@/modules/category/router'
import { createTransactionRouter } from '@/modules/transaction/router'
import { createSummaryRouter } from '@/modules/summary/router'
import { createUserRouter } from '@/modules/user/router'

// Types
import { IAccountModel } from '@/modules/account/types'
import { ICategoryModel } from '@/modules/category/types'
import { ITransactionModel } from '@/modules/transaction/types'
import { ISummaryModel } from '@/modules/summary/types'
import { IUserModel } from '@/modules/user/types'

// Middleware
import { authMiddleware } from '@/middlewares/auth'

interface AppDependencies {
	accountModel: IAccountModel
	categoryModel: ICategoryModel
	transactionModel: ITransactionModel
	summaryModel: ISummaryModel
	userModel: IUserModel
}

const configureGlobalMiddlewares = (app: Application) => {
	app.disable('x-powered-by')
	app.use(
		cors({
			origin: process.env.FRONTEND_URL || 'http://localhost:3000',
			methods: ['GET', 'POST', 'PUT', 'DELETE'],
			credentials: true
		})
	)

	app.use(json())
}

const configureRoutes = (app: Application, dependencies: AppDependencies) => {
	const {
		accountModel,
		categoryModel,
		transactionModel,
		summaryModel,
		userModel
	} = dependencies
	app.use('/api/users', createUserRouter({ userModel }))

	// Protected routes with authentication middleware
	app.use(
		'/api/accounts',
		authMiddleware,
		createAccountRouter({ accountModel })
	)
	app.use(
		'/api/categories',
		authMiddleware,
		createCategoryRouter({ categoryModel })
	)
	app.use(
		'/api/transactions',
		authMiddleware,
		createTransactionRouter({ transactionModel })
	)
	app.use('/api/summary', authMiddleware, createSummaryRouter({ summaryModel }))
}

const startServer = (app: Application) => {
	const PORT = process.env.PORT ?? 8080
	app.listen(PORT, () => {
		console.log(`Server listening on http://localhost:${PORT}`)
	})
}

export const createApp = (dependencies: AppDependencies): Application => {
	const app = express()
	configureGlobalMiddlewares(app)
	configureRoutes(app, dependencies)
	startServer(app)

	return app
}
