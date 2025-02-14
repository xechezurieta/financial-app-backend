import { and, desc, eq, gte, inArray, lt, lte, sql, sum } from 'drizzle-orm'

import { db } from './drizzle'
import {
	accountsTable,
	categoriesTable,
	transactionsTable,
	User,
	usersTable
} from './schema'
import { differenceInDays, parse, subDays } from 'date-fns'

export async function getUser(email: string): Promise<Array<User>> {
	try {
		return await db.select().from(usersTable).where(eq(usersTable.email, email))
	} catch (error) {
		console.error('Failed to get user from database')
		throw error
	}
}
/* Accounts */
export async function getAccounts(userId: string) {
	try {
		return await db
			.select()
			.from(accountsTable)
			.where(eq(accountsTable.userId, userId))
	} catch (error) {
		console.error('Failed to get accounts from database')
		throw error
	}
}

export async function getAccount(accountId: string, userId: string) {
	try {
		const [data] = await db
			.select({
				id: accountsTable.id,
				name: accountsTable.name
			})
			.from(accountsTable)
			.where(
				and(eq(accountsTable.id, accountId), eq(accountsTable.userId, userId))
			)
		return data
	} catch (error) {
		console.error('Failed to get account from database', error)
		throw error
	}
}

export async function createAccount(userId: string, name: string) {
	try {
		const [account] = await db
			.insert(accountsTable)
			.values({
				id: crypto.randomUUID(),
				userId,
				name,
				plaidId: crypto.randomUUID()
			})
			.returning()
		return account
	} catch (error) {
		console.error('Failed to create account in database', error)
		throw error
	}
}

export async function deleteAccounts(
	userId: string,
	accountIds: Array<string>
) {
	try {
		return await db
			.delete(accountsTable)
			.where(
				and(
					eq(accountsTable.userId, userId),
					inArray(accountsTable.id, accountIds)
				)
			)
			.returning({
				id: accountsTable.id
			})
	} catch (error) {
		console.error('Failed to delete accounts from database', error)
		throw error
	}
}

export async function editAccountName(
	accountId: string,
	userId: string,
	name: string
) {
	try {
		const [account] = await db
			.update(accountsTable)
			.set({
				name
			})
			.where(
				and(eq(accountsTable.id, accountId), eq(accountsTable.userId, userId))
			)
			.returning()
		return account
	} catch (error) {
		console.error('Failed to edit account name in database', error)
		throw error
	}
}

export async function deleteAccount(userId: string, accountId: string) {
	try {
		const [account] = await db
			.delete(accountsTable)
			.where(
				and(eq(accountsTable.userId, userId), eq(accountsTable.id, accountId))
			)
			.returning({
				id: accountsTable.id
			})
		return account
	} catch (error) {
		console.error('Failed to delete account from database', error)
		throw error
	}
}

/* Categories */
export async function getCategories(userId: string) {
	try {
		return await db
			.select()
			.from(categoriesTable)
			.where(eq(categoriesTable.userId, userId))
	} catch (error) {
		console.error('Failed to get categories from database')
		throw error
	}
}

export async function getCategory(categoryId: string, userId: string) {
	try {
		const [data] = await db
			.select({
				id: categoriesTable.id,
				name: categoriesTable.name
			})
			.from(categoriesTable)
			.where(
				and(
					eq(categoriesTable.id, categoryId),
					eq(categoriesTable.userId, userId)
				)
			)
		return data
	} catch (error) {
		console.error('Failed to get category from database', error)
		throw error
	}
}

export async function createCategory(userId: string, name: string) {
	try {
		const [category] = await db
			.insert(categoriesTable)
			.values({
				id: crypto.randomUUID(),
				userId,
				name,
				plaidId: crypto.randomUUID()
			})
			.returning()
		return category
	} catch (error) {
		console.error('Failed to create category in database', error)
		throw error
	}
}

export async function deleteCategories(
	userId: string,
	categoryIds: Array<string>
) {
	try {
		return await db
			.delete(categoriesTable)
			.where(
				and(
					eq(categoriesTable.userId, userId),
					inArray(categoriesTable.id, categoryIds)
				)
			)
			.returning({
				id: categoriesTable.id
			})
	} catch (error) {
		console.error('Failed to delete categories from database', error)
		throw error
	}
}

export async function editCategoryName(
	categoryId: string,
	userId: string,
	name: string
) {
	try {
		const [category] = await db
			.update(categoriesTable)
			.set({
				name
			})
			.where(
				and(
					eq(categoriesTable.id, categoryId),
					eq(categoriesTable.userId, userId)
				)
			)
			.returning()
		return category
	} catch (error) {
		console.error('Failed to edit category name in database', error)
		throw error
	}
}

export async function deleteCategory(userId: string, categoryId: string) {
	try {
		const [category] = await db
			.delete(categoriesTable)
			.where(
				and(
					eq(categoriesTable.userId, userId),
					eq(categoriesTable.id, categoryId)
				)
			)
			.returning({
				id: categoriesTable.id
			})
		return category
	} catch (error) {
		console.error('Failed to delete category from database', error)
		throw error
	}
}

export async function getTransactions({
	from,
	to,
	accountId,
	userId
}: {
	from: string | undefined
	to: string | undefined
	accountId: string | undefined
	userId: string
}) {
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
		throw error
	}
}

export async function getTransaction(transactionId: string, userId: string) {
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
		throw error
	}
}

export async function createTransaction({
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
}) {
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
		throw error
	}
}

export async function deleteTransactions(
	userId: string,
	transactionIds: Array<string>
) {
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
		throw error
	}
}

export async function editTransaction({
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
}) {
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
		throw error
	}
}

export async function deleteTransaction(userId: string, transactionId: string) {
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

export async function fetchFinancialData({
	userId,
	accountId,
	startDate,
	endDate
}: {
	userId: string
	accountId: string
	startDate: Date
	endDate: Date
}) {
	return await db
		.select({
			income:
				sql`SUM(CASE WHEN ${transactionsTable.amount} >= 0 THEN ${transactionsTable.amount} ELSE 0 END)`.mapWith(
					Number
				),
			expenses:
				sql`SUM(CASE WHEN ${transactionsTable.amount} < 0 THEN ${transactionsTable.amount} ELSE 0 END)`.mapWith(
					Number
				),
			remaining: sum(transactionsTable.amount).mapWith(Number)
		})
		.from(transactionsTable)
		.innerJoin(accountsTable, eq(transactionsTable.accountId, accountsTable.id))
		.where(
			and(
				accountId ? eq(transactionsTable.accountId, accountId) : undefined,
				eq(accountsTable.userId, userId),
				gte(transactionsTable.date, startDate),
				lte(transactionsTable.date, endDate)
			)
		)
}

export async function getCategoriesSummary({
	userId,
	accountId,
	startDate,
	endDate
}: {
	userId: string
	accountId: string
	startDate: Date
	endDate: Date
}) {
	const categories = await db
		.select({
			name: categoriesTable.name,
			value: sql`SUM(ABS(${transactionsTable.amount}))`.mapWith(Number)
		})
		.from(transactionsTable)
		.innerJoin(accountsTable, eq(transactionsTable.accountId, accountsTable.id))
		.innerJoin(
			categoriesTable,
			eq(transactionsTable.categoryId, categoriesTable.id)
		)
		.where(
			and(
				accountId ? eq(transactionsTable.accountId, accountId) : undefined,
				eq(accountsTable.userId, userId),
				lt(transactionsTable.amount, 0),
				gte(transactionsTable.date, startDate),
				lte(transactionsTable.date, endDate)
			)
		)
		.groupBy(categoriesTable.name)
		.orderBy(desc(sql`SUM(ABS(${transactionsTable.amount}))`))

	console.log({ categories })
	const topCategories = categories.slice(0, 3)
	const otherCategories = categories.slice(3)

	return { topCategories, otherCategories }
}

export const getSummaryActiveDays = async ({
	userId,
	accountId,
	startDate,
	endDate
}: {
	userId: string
	accountId: string
	startDate: Date
	endDate: Date
}) => {
	const activeDays = await db
		.select({
			date: transactionsTable.date,
			income:
				sql`SUM(CASE WHEN ${transactionsTable.amount} >= 0 THEN ${transactionsTable.amount} ELSE 0 END)`.mapWith(
					Number
				),
			expenses:
				sql`SUM(CASE WHEN ${transactionsTable.amount} < 0 THEN ABS(${transactionsTable.amount}) ELSE 0 END)`.mapWith(
					Number
				)
		})
		.from(transactionsTable)
		.innerJoin(accountsTable, eq(transactionsTable.accountId, accountsTable.id))
		.where(
			and(
				accountId ? eq(transactionsTable.accountId, accountId) : undefined,
				eq(accountsTable.userId, userId),
				gte(transactionsTable.date, startDate),
				lte(transactionsTable.date, endDate)
			)
		)
		.groupBy(transactionsTable.date)
		.orderBy(transactionsTable.date)

	return activeDays
}
