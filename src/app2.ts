import express, { json } from 'express' // require -> commonJS
import { createAccountRouter } from '@/features/account/router'
import 'dotenv/config'
import { IAccountModel } from '@/features/account/types'
import { createCategoryRouter } from '@/features/category/router'
import { ICategoryModel } from '@/features/category/types'
import { createTransactionRouter } from '@/features/transaction/router'
import { ITransactionModel } from '@/features/transaction/types'
import { ISummaryModel } from '@/features/summary/types'
import { createSummaryRouter } from '@/features/summary/router'
import { toNodeHandler } from 'better-auth/node'
import { auth } from '@/lib/auth'
import { authenticatedUser } from './middleware/require-auth'
import cors from 'cors'
import { createAuthRouter } from '@/features/auth/router'

// después
export const createApp = ({
	accountModel,
	categoryModel,
	transactionModel,
	summaryModel
}: {
	accountModel: IAccountModel
	categoryModel: ICategoryModel
	transactionModel: ITransactionModel
	summaryModel: ISummaryModel
}) => {
	const app = express()
	app.use(
		cors({
			origin: 'http://localhost:3000', // Replace with your frontend's origin
			methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
			credentials: true // Allow credentials (cookies, authorization headers, etc.)
		})
	)
	app.disable('x-powered-by')

	app.all('/api/auth/*', toNodeHandler(auth))
	app.use(json())
	app.use('/api', createAuthRouter())
	app.use(authenticatedUser)
	// Protected routes - apply requireAuth middleware
	app.use('/accounts', createAccountRouter({ accountModel }))
	app.use('/categories', createCategoryRouter({ categoryModel }))
	app.use('/transactions', createTransactionRouter({ transactionModel }))
	app.use('/summary', createSummaryRouter({ summaryModel }))

	const PORT = process.env.PORT ?? 8080
	app.listen(PORT, () => {
		console.log(`server listening on port http://localhost:${PORT}`)
	})
}
