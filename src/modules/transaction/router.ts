import { Router } from 'express'
import { TransactionController } from '@/modules/transaction/controller'
import { ITransactionModel } from '@/modules/transaction/types'

export const createTransactionRouter = ({
	transactionModel
}: {
	transactionModel: ITransactionModel
}) => {
	const transactionRouter = Router()

	const transactionController = new TransactionController({ transactionModel })

	transactionRouter.get('/', transactionController.getTransactions)
	transactionRouter.get('/:transactionId', transactionController.getTransaction)
	transactionRouter.post('/', transactionController.createTransaction)
	transactionRouter.delete('/', transactionController.deleteTransactions)
	transactionRouter.delete(
		'/:transactionId',
		transactionController.deleteTransaction
	)
	transactionRouter.patch(
		'/:transactionId',
		transactionController.editTransaction
	)

	return transactionRouter
}
