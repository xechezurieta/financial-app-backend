import { createApp } from '@/app2'
import { AccountModel } from '@/features/account/model'
import { CategoryModel } from '@/features/category/model'
import { SummaryModel } from '@/features/summary/model'
import { TransactionModel } from '@/features/transaction/model'

createApp({
	accountModel: AccountModel,
	categoryModel: CategoryModel,
	transactionModel: TransactionModel,
	summaryModel: SummaryModel
})
