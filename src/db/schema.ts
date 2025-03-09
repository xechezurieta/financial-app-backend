import { relations } from 'drizzle-orm'
import {
	integer,
	pgTable,
	text,
	timestamp,
	serial,
	varchar
} from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 100 }),
	email: varchar('email', { length: 255 }).notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	role: varchar('role', { length: 20 }).notNull().default('standard'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
	deletedAt: timestamp('deleted_at')
})

export type User = typeof usersTable.$inferSelect

export type PublicUserInfo = Pick<User, 'id' | 'email' | 'role'>

export const accountsTable = pgTable('financial_account', {
	id: text('id').primaryKey(),
	plaidId: text('plaid_id'),
	name: text('name').notNull(),
	userId: text('user_id').notNull()
})

export type Account = typeof accountsTable.$inferSelect

export const accountsRelations = relations(accountsTable, ({ many }) => ({
	transactions: many(transactionsTable)
}))

export const categoriesTable = pgTable('category', {
	id: text('id').primaryKey(),
	plaidId: text('plaid_id'),
	name: text('name').notNull(),
	userId: text('user_id').notNull()
})

export type Category = typeof categoriesTable.$inferSelect

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
	transactions: many(transactionsTable)
}))

export const transactionsTable = pgTable('transaction', {
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
