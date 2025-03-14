import { Request, Response } from 'express'
import { ITransactionModel } from '@/features/transaction/types'

export class TransactionController {
	private transactionModel: ITransactionModel

	constructor({ transactionModel }: { transactionModel: ITransactionModel }) {
		this.transactionModel = transactionModel
	}

	getTransactions = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id.toString()
			if (!userId) {
				res.status(401).send('User not found')
				return
			}
			const { from, to, accountId } = req.body

			const transactions = await this.transactionModel.getTransactions({
				userId,
				from,
				to,
				accountId
			})
			res.json({ transactions })
		} catch (error) {
			console.error('Failed to get transactions', error)
			res.status(500).send('Failed to get transactions')
		}
	}

	getTransaction = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id.toString()
			if (!userId) {
				res.status(401).send('User not found')
				return
			}
			const { transactionId } = req.params

			const transaction = await this.transactionModel.getTransaction({
				transactionId,
				userId
			})
			res.json({ transaction })
		} catch (error) {
			console.error('Failed to get transaction', error)
			res.status(500).send('Failed to get transaction')
		}
	}

	createTransaction = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id.toString()
			if (!userId) {
				res.status(401).send('User not found')
				return
			}
			const { accountId, categoryId, amount, date, payee, notes } = req.body
			const transaction = await this.transactionModel.createTransaction({
				userId,
				accountId,
				categoryId,
				amount,
				date: new Date(date),
				payee,
				notes
			})
			res.json({ transaction })
		} catch (error) {
			console.error('Failed to create transaction', error)
			res.status(500).send('Failed to create transaction')
		}
	}

	deleteTransactions = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id.toString()
			if (!userId) {
				res.status(401).send('User not found')
				return
			}
			const { transactionIds } = req.body

			const transactions = await this.transactionModel.deleteTransactions({
				userId,
				transactionIds
			})
			res.json({ transactions })
		} catch (error) {
			console.error('Failed to delete transactions', error)
			res.status(500).send('Failed to delete transactions')
		}
	}

	deleteTransaction = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id.toString()
			if (!userId) {
				res.status(401).send('User not found')
				return
			}
			const { transactionId } = req.params

			const deletedTransaction = await this.transactionModel.deleteTransaction({
				transactionId,
				userId
			})
			res.json({ deletedTransaction })
		} catch (error) {
			console.error('Failed to delete transaction', error)
			res.status(500).send('Failed to delete transaction')
		}
	}

	editTransaction = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id.toString()
			if (!userId) {
				res.status(401).send('User not found')
				return
			}
			const { transactionId } = req.params
			const { amount, date, categoryId, payee, notes, accountId } = req.body

			const transaction = await this.transactionModel.editTransaction({
				transactionId,
				userId,
				amount,
				date: date ? new Date(date) : new Date(),
				categoryId,
				payee,
				notes,
				accountId
			})
			res.json(transaction)
		} catch (error) {
			console.error('Failed to edit transaction', error)
			res.status(500).send('Failed to edit transaction')
		}
	}
}
