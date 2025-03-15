import { AccountModel } from '@/modules/account/model'
import { CategoryModel } from '@/modules/category/model'
import { SummaryModel } from '@/modules/summary/model'
import { TransactionModel } from '@/modules/transaction/model'
import { createApp } from '@/app'
import { UserModel } from '@/modules/user/model'
import { startServer } from '@/lib/start-server'

const PORT = process.env.PORT || 8080

const main = async () => {
	const app = createApp({
		accountModel: AccountModel,
		categoryModel: CategoryModel,
		transactionModel: TransactionModel,
		summaryModel: SummaryModel,
		userModel: UserModel
	})

	startServer(app, Number(PORT))
}

main().catch((error) => {
	console.error('Failed to start server:', error)
	process.exit(1)
})
