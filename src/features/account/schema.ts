import { relations } from 'drizzle-orm'
import { pgTable, text } from 'drizzle-orm/pg-core'
import { transactionsTable } from '../transaction/schema'

export const accountsTable = pgTable('accounts', {
	id: text('id').primaryKey(),
	plaidId: text('plaid_id'),
	name: text('name').notNull(),
	userId: text('user_id').notNull()
})

export type Account = typeof accountsTable.$inferSelect

export const accountsRelations = relations(accountsTable, ({ many }) => ({
	transactions: many(transactionsTable)
}))
