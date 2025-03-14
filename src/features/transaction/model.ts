import { parse, subDays } from 'date-fns'

import { and, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm'
import { db } from '@/db/drizzle'
import { ITransactionModel } from '@/features/transaction/types'
import {
	Transaction,
	transactionsTable,
	categoriesTable,
	accountsTable
} from '@/db/schema'

export class TransactionModel {
	static async getTransactions({
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
	> {
		const defaultTo = new Date()
		const defaultFrom = subDays(defaultTo, 30)

		const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom
		const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo

		try {
			return await db
				.select({
					id: transactionsTable.id,
					date: transactionsTable.date,
					category: categoriesTable.name,
					categoryId: transactionsTable.categoryId,
					payee: transactionsTable.payee,
					amount: transactionsTable.amount,
					notes: transactionsTable.notes,
					account: accountsTable.name,
					accountId: transactionsTable.accountId
				})
				.from(transactionsTable)
				.innerJoin(
					accountsTable,
					eq(transactionsTable.accountId, accountsTable.id)
				)
				.leftJoin(
					categoriesTable,
					eq(transactionsTable.categoryId, categoriesTable.id)
				)
				.where(
					and(
						accountId ? eq(transactionsTable.accountId, accountId) : undefined,
						eq(accountsTable.userId, userId),
						gte(transactionsTable.date, startDate),
						lte(transactionsTable.date, endDate)
					)
				)
				.orderBy(desc(transactionsTable.date))
		} catch (error) {
			console.error('Failed to get transactions from database', error)
			throw new Error('Failed to retrieve transactions')
		}
	}

	static async getTransaction({
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
	}> {
		try {
			const [data] = await db
				.select({
					id: transactionsTable.id,
					date: transactionsTable.date,
					categoryId: transactionsTable.categoryId,
					payee: transactionsTable.payee,
					amount: transactionsTable.amount,
					notes: transactionsTable.notes,
					accountId: transactionsTable.accountId
				})
				.from(transactionsTable)
				.innerJoin(
					accountsTable,
					eq(transactionsTable.accountId, accountsTable.id)
				)
				.where(
					and(
						eq(transactionsTable.id, transactionId),
						eq(accountsTable.userId, userId)
					)
				)

			return data
		} catch (error) {
			console.error('Failed to get transaction from database', error)
			throw new Error('Failed to retrieve transaction')
		}
	}

	static async createTransaction({
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
	}): Promise<Transaction> {
		try {
			const [transaction] = await db
				.insert(transactionsTable)
				.values({
					id: crypto.randomUUID(),
					date,
					categoryId: categoryId || null,
					payee,
					amount,
					notes,
					accountId
				})
				.returning()
			return transaction
		} catch (error) {
			console.error('Failed to create transaction in database', error)
			throw new Error('Failed to create transaction')
		}
	}

	static async deleteTransactions({
		userId,
		transactionIds
	}: {
		userId: string
		transactionIds: Array<string>
	}): Promise<Pick<Transaction, 'id'>[]> {
		try {
			const transactionToDelete = db.$with('transactions_to_delete').as(
				db
					.select({ id: transactionsTable.id })
					.from(transactionsTable)
					.innerJoin(
						accountsTable,
						eq(transactionsTable.accountId, accountsTable.id)
					)
					.where(
						and(
							inArray(transactionsTable.id, transactionIds),
							eq(accountsTable.userId, userId)
						)
					)
			)
			return await db
				.with(transactionToDelete)
				.delete(transactionsTable)
				.where(
					inArray(
						transactionsTable.id,
						sql`(select id from ${transactionToDelete})`
					)
				)
				.returning({
					id: transactionsTable.id
				})
		} catch (error) {
			console.error('Failed to delete transactions from database', error)
			throw new Error('Failed to delete transactions')
		}
	}

	static async editTransaction({
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
	}): Promise<Transaction> {
		try {
			const transactionToUpdate = db.$with('transactions_to_update').as(
				db
					.select({ id: transactionsTable.id })
					.from(transactionsTable)
					.innerJoin(
						accountsTable,
						eq(transactionsTable.accountId, accountsTable.id)
					)
					.where(
						and(
							eq(transactionsTable.id, transactionId),
							eq(accountsTable.userId, userId)
						)
					)
			)
			const [transaction] = await db
				.with(transactionToUpdate)
				.update(transactionsTable)
				.set({
					date,
					categoryId: categoryId || null,
					payee,
					amount,
					notes,
					accountId
				})
				.where(
					inArray(
						transactionsTable.id,
						sql`(select id from ${transactionToUpdate})`
					)
				)

				.returning()
			return transaction
		} catch (error) {
			console.error('Failed to edit transaction in database', error)
			throw new Error('Failed to edit transaction')
		}
	}

	static async deleteTransaction({
		userId,
		transactionId
	}: {
		userId: string
		transactionId: string
	}): Promise<Pick<Transaction, 'id'>> {
		try {
			const transactionToDelete = db.$with('delete').as(
				db
					.select({ id: transactionsTable.id })
					.from(transactionsTable)
					.innerJoin(
						accountsTable,
						eq(transactionsTable.accountId, accountsTable.id)
					)
					.where(
						and(
							eq(transactionsTable.id, transactionId),
							eq(accountsTable.userId, userId)
						)
					)
			)
			const [transaction] = await db
				.with(transactionToDelete)
				.delete(transactionsTable)
				.where(
					inArray(
						transactionsTable.id,
						sql`(select id from ${transactionToDelete})`
					)
				)
				.returning({
					id: transactionsTable.id
				})
			return transaction
		} catch (error) {
			console.error('Failed to delete transaction from database', error)
			throw error
		}
	}
}

const TransactionModelInstance: ITransactionModel = TransactionModel

export { TransactionModelInstance }
