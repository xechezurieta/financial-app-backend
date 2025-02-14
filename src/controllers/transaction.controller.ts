import { Request, Response } from 'express'
import {
	getTransactions,
	createTransaction,
	deleteTransaction,
	deleteTransactions,
	editTransaction,
	getTransaction
} from '../db/queries'

export const getTransactionsController = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { from, to, accountId, userId } = req.body
		const transactions = await getTransactions({
			from,
			to,
			accountId,
			userId
		})
		res.json({ transactions })
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}

export const createTransactionController = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { userId, date, categoryId, payee, amount, notes, accountId } = req.body
	const parsedDate = new Date(date)
	try {
		const transaction = await createTransaction({
			userId,
			date: parsedDate,
			categoryId,
			payee,
			amount,
			notes,
			accountId
		})
		res.json({ transaction })
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}

export const bulkDeleteTransactionsController = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { transactionIds, userId } = req.body
	try {
		const deletedTransactions = await deleteTransactions(userId, transactionIds)
		res.json({ deletedTransactions })
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}

export const getTransactionController = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { transactionId, userId } = req.body
	try {
		const transaction = await getTransaction(transactionId, userId)
		if (!transaction) {
			res.status(404).json({ message: 'Transaction not found' })
			return
		}
		res.json({ transaction })
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}

export const editTransactionController = async (
	req: Request,
	res: Response
): Promise<void> => {
	const {
		userId,
		transactionId,
		date,
		categoryId,
		payee,
		amount,
		notes,
		accountId
	} = req.body
	const parsedDate = new Date(date)
	try {
		const transaction = await editTransaction({
			userId,
			transactionId,
			date: parsedDate,
			categoryId,
			payee,
			amount,
			notes,
			accountId
		})
		if (!transaction) {
			res.status(404).json({ message: 'Transaction not found' })
			return
		}
		res.json({ transaction })
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}

export const deleteTransactionController = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { transactionId, userId } = req.body
	try {
		const deletedTransaction = await deleteTransaction(userId, transactionId)
		if (!deletedTransaction) {
			res.status(404).json({ message: 'Transaction not found' })
			return
		}
		res.json({ deletedTransaction })
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}
