import { Request, Response } from 'express'
import { ITransactionModel } from '@/features/transaction/types'

export class TransactionController {
	private transactionModel: ITransactionModel

	constructor({ transactionModel }: { transactionModel: ITransactionModel }) {
		this.transactionModel = transactionModel
	}

	getTransactions = async (req: Request, res: Response) => {
		try {
			const transactions = await this.transactionModel.getTransactions({
				userId: req.user.id,
				from: undefined,
				to: undefined,
				accountId: undefined
			})
			res.json(transactions)
		} catch (error) {
			console.error('Failed to get transactions', error)
			res.status(500).send('Failed to get transactions')
		}
	}

	getTransaction = async (req: Request, res: Response) => {
		try {
			const transaction = await this.transactionModel.getTransaction({
				transactionId: req.params.transactionId,
				userId: req.user.id
			})
			res.json(transaction)
		} catch (error) {
			console.error('Failed to get transaction', error)
			res.status(500).send('Failed to get transaction')
		}
	}

	createTransaction = async (req: Request, res: Response) => {
		try {
			const transaction = await this.transactionModel.createTransaction({
				userId: req.user.id,
				accountId: req.body.accountId,
				categoryId: req.body.categoryId,
				amount: req.body.amount,
				date: new Date(req.body.date),
				payee: req.body.payee,
				notes: req.body.notes
			})
			res.json(transaction)
		} catch (error) {
			console.error('Failed to create transaction', error)
			res.status(500).send('Failed to create transaction')
		}
	}

	deleteTransactions = async (req: Request, res: Response) => {
		try {
			await this.transactionModel.deleteTransactions({
				userId: req.user.id,
				transactionIds: req.body.transactionIds
			})
			res.send('Transactions deleted')
		} catch (error) {
			console.error('Failed to delete transactions', error)
			res.status(500).send('Failed to delete transactions')
		}
	}

	deleteTransaction = async (req: Request, res: Response) => {
		try {
			await this.transactionModel.deleteTransaction({
				transactionId: req.params.transactionId,
				userId: req.user.id
			})
			res.send('Transaction deleted')
		} catch (error) {
			console.error('Failed to delete transaction', error)
			res.status(500).send('Failed to delete transaction')
		}
	}

	editTransaction = async (req: Request, res: Response) => {
		try {
			const transaction = await this.transactionModel.editTransaction({
				transactionId: req.params.transactionId,
				userId: req.user.id,
				amount: req.body.amount,
				date: req.body.date ? new Date(req.body.date) : new Date(),
				categoryId: req.body.categoryId,
				payee: req.body.payee,
				notes: req.body.notes,
				accountId: req.body.accountId
			})
			res.json(transaction)
		} catch (error) {
			console.error('Failed to edit transaction', error)
			res.status(500).send('Failed to edit transaction')
		}
	}
}
