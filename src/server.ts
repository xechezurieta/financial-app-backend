import { AccountModel } from '@/modules/account/model'
import { CategoryModel } from '@/modules/category/model'
import { SummaryModel } from '@/modules/summary/model'
import { TransactionModel } from '@/modules/transaction/model'
import { createApp } from '@/app'
import { UserModel } from '@/modules/user/model'

createApp({
	accountModel: AccountModel,
	categoryModel: CategoryModel,
	transactionModel: TransactionModel,
	summaryModel: SummaryModel,
	userModel: UserModel
})
