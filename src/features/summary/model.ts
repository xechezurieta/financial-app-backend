import { and, desc, eq, gte, lt, lte, sql, sum } from 'drizzle-orm'
import { db } from '@/db/drizzle'

import { ISummaryModel } from '@/features/summary/types'
import { transactionsTable } from '@/features/transaction/schema'
import { accountsTable } from '@/features/account/schema'
import { categoriesTable } from '@/features/category/schema'

export class SummaryModel {
	static async fetchFinancialData({
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
			.innerJoin(
				accountsTable,
				eq(transactionsTable.accountId, accountsTable.id)
			)
			.where(
				and(
					accountId ? eq(transactionsTable.accountId, accountId) : undefined,
					eq(accountsTable.userId, userId),
					gte(transactionsTable.date, startDate),
					lte(transactionsTable.date, endDate)
				)
			)
	}
	static async getCategoriesSummary({
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
			.innerJoin(
				accountsTable,
				eq(transactionsTable.accountId, accountsTable.id)
			)
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
	static async getSummaryActiveDays({
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
			.innerJoin(
				accountsTable,
				eq(transactionsTable.accountId, accountsTable.id)
			)
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
}

const SummaryModelInstance: ISummaryModel = SummaryModel
