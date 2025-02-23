import { relations } from 'drizzle-orm'
import {
	integer,
	pgTable,
	serial,
	varchar,
	text,
	timestamp
} from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
	id: serial('id').primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	age: integer().notNull(),
	email: varchar({ length: 255 }).notNull().unique(),
	password: varchar({ length: 255 }).notNull().default('12345678')
})

export type User = typeof usersTable.$inferSelect

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

export const transactionsTable = pgTable('transactions', {
	id: text('id').primaryKey(),
	amount: integer('amount').notNull(),
	payee: text('payee').notNull(),
	notes: text('notes'),
	date: timestamp('date', { mode: 'date' }).notNull(),
	accountId: text('account_id')
		.references(() => accountsTable.id, {
			onDelete: 'cascade'
		})
		.notNull(),
	categoryId: text('category_id').references(() => categoriesTable.id, {
		onDelete: 'set null'
	})
})

export type Transaction = typeof transactionsTable.$inferSelect

export const transactionsRelations = relations(
	transactionsTable,
	({ one }) => ({
		account: one(accountsTable, {
			fields: [transactionsTable.accountId],
			references: [accountsTable.id]
		}),
		categories: one(categoriesTable, {
			fields: [transactionsTable.categoryId],
			references: [categoriesTable.id]
		})
	})
)
