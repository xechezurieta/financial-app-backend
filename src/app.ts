import express, { Application, json } from 'express'
import cors from 'cors'
import 'dotenv/config'
import { createAccountRouter } from '@/modules/account/router'
import { createCategoryRouter } from '@/modules/category/router'
import { createTransactionRouter } from '@/modules/transaction/router'
import { createSummaryRouter } from '@/modules/summary/router'
import { createUserRouter } from '@/modules/user/router'
import { IAccountModel } from '@/modules/account/types'
import { ICategoryModel } from '@/modules/category/types'
import { ITransactionModel } from '@/modules/transaction/types'
import { ISummaryModel } from '@/modules/summary/types'
import { IUserModel } from '@/modules/user/types'
import { authMiddleware } from '@/middlewares/auth'
import { createHealthRouter } from '@/modules/health/router'

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

	app.use('/api/health', createHealthRouter())
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

export const createApp = (dependencies: AppDependencies) => {
	const app = express()
	configureGlobalMiddlewares(app)
	configureRoutes(app, dependencies)
	return app
}
