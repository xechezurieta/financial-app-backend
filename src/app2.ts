import express, { Application, json } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'

// Feature routers
import { createAccountRouter } from '@/features/account/router'
import { createCategoryRouter } from '@/features/category/router'
import { createTransactionRouter } from '@/features/transaction/router'
import { createSummaryRouter } from '@/features/summary/router'
import { createUserRouter } from '@/features/user/router'

// Types
import { IAccountModel } from '@/features/account/types'
import { ICategoryModel } from '@/features/category/types'
import { ITransactionModel } from '@/features/transaction/types'
import { ISummaryModel } from '@/features/summary/types'
import { IUserModel } from '@/features/user/types'

// Middleware

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
	app.use(cookieParser())
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
	app.use('/api/accounts', json(), createAccountRouter({ accountModel }))
	app.use('/api/categories', createCategoryRouter({ categoryModel }))
	app.use('/api/transactions', createTransactionRouter({ transactionModel }))
	app.use('/api/summary', createSummaryRouter({ summaryModel }))
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
