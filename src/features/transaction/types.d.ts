import { Transaction } from '@/features/transaction/schema'

export interface ITransactionModel {
	getTransactions({
		from,
		to,
		accountId,
		userId
	}: {
		from: string | undefined
		to: string | undefined
		accountId: string | undefined
		userId: string
	}): Promise<
		{
			id: string
			date: Date
			category: string | null
			categoryId: string | null
			payee: string
			amount: number
			notes: string | null
			account: string
			accountId: string
		}[]
	>

	getTransaction({
		transactionId,
		userId
	}: {
		transactionId: string
		userId: string
	}): Promise<{
		id: string
		date: Date
		categoryId: string | null
		payee: string
		amount: number
		notes: string | null
		accountId: string
	}>

	createTransaction({
		userId,
		date,
		categoryId,
		payee,
		amount,
		notes,
		accountId
	}: {
		userId: string
		date: Date
		categoryId: string
		payee: string
		amount: number
		notes: string
		accountId: string
	}): Promise<Transaction>

	deleteTransactions(
		userId: string,
		transactionIds: Array<string>
	): Promise<Pick<Transaction, 'id'>[]>

	editTransaction({
		userId,
		transactionId,
		date,
		categoryId,
		payee,
		amount,
		notes,
		accountId
	}: {
		userId: string
		transactionId: string
		date: Date
		categoryId: string
		payee: string
		amount: number
		notes: string
		accountId: string
	}): Promise<Transaction>

	deleteTransaction({
		userId,
		transactionId
	}: {
		userId: string
		transactionId: string
	}): Promise<Pick<Transaction, 'id'>>
}
