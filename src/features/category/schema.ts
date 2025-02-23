import { relations } from 'drizzle-orm'
import { pgTable, text } from 'drizzle-orm/pg-core'
import { transactionsTable } from '../transaction/schema'

export const categoriesTable = pgTable('categories', {
	id: text('id').primaryKey(),
	plaidId: text('plaid_id'),
	name: text('name').notNull(),
	userId: text('user_id').notNull()
})

export type Category = typeof categoriesTable.$inferSelect

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
	transactions: many(transactionsTable)
}))
