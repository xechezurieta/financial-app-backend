import { relations } from 'drizzle-orm'
import { integer, pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core'

/* export const usersTable = pgTable('users', {
	id: serial('id').primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	age: integer().notNull(),
	email: varchar({ length: 255 }).notNull().unique(),
	password: varchar({ length: 255 }).notNull().default('12345678')
})

export type User = typeof usersTable.$inferSelect */

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

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
})

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
})

export const account = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
})

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
})
