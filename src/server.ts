import { AccountModel } from '@/features/account/model'
import { CategoryModel } from '@/features/category/model'
import { SummaryModel } from '@/features/summary/model'
import { TransactionModel } from '@/features/transaction/model'
import { createApp } from '@/app2'
import { UserModel } from '@/features/user/model'

createApp({
	accountModel: AccountModel,
	categoryModel: CategoryModel,
	transactionModel: TransactionModel,
	summaryModel: SummaryModel,
	userModel: UserModel
})
