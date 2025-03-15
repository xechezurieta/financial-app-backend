import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/db/drizzle'
import { IAccountModel } from '@/modules/account/types'
import { Account, accountsTable } from '@/db/schema'

export class AccountModel {
	static async getAccounts({ userId }: { userId: number }): Promise<Account[]> {
		try {
			return await db
				.select()
				.from(accountsTable)
				.where(eq(accountsTable.userId, userId.toString()))
		} catch (error) {
			console.error('Failed to get accounts from database', error)
			throw new Error('Failed to retrieve accounts')
		}
	}

	static async getAccount({
		accountId,
		userId
	}: {
		accountId: string
		userId: number
	}): Promise<Pick<Account, 'id' | 'name'> | undefined> {
		try {
			const [data] = await db
				.select({
					id: accountsTable.id,
					name: accountsTable.name
				})
				.from(accountsTable)
				.where(
					and(
						eq(accountsTable.id, accountId),
						eq(accountsTable.userId, userId.toString())
					)
				)
			return data
		} catch (error) {
			console.error('Failed to get account from database', error)
			throw new Error('Failed to retrieve account')
		}
	}

	static async createAccount({
		userId,
		name
	}: {
		userId: number
		name: string
	}): Promise<Account> {
		try {
			const [account] = await db
				.insert(accountsTable)
				.values({
					id: crypto.randomUUID(),
					userId: userId.toString(),
					name,
					plaidId: crypto.randomUUID()
				})
				.returning()
			return account
		} catch (error) {
			console.error('Failed to create account in database', error)
			throw new Error('Failed to create account')
		}
	}

	static async deleteAccounts({
		userId,
		accountIds
	}: {
		userId: number
		accountIds: Array<string>
	}): Promise<Pick<Account, 'id'>[]> {
		try {
			return await db
				.delete(accountsTable)
				.where(
					and(
						eq(accountsTable.userId, userId.toString()),
						inArray(accountsTable.id, accountIds)
					)
				)
				.returning({
					id: accountsTable.id
				})
		} catch (error) {
			console.error('Failed to delete accounts from database', error)
			throw new Error('Failed to delete accounts')
		}
	}

	static async editAccountName({
		accountId,
		userId,
		name
	}: {
		accountId: string
		userId: number
		name: string
	}): Promise<Account> {
		try {
			const [account] = await db
				.update(accountsTable)
				.set({
					name
				})
				.where(
					and(
						eq(accountsTable.id, accountId),
						eq(accountsTable.userId, userId.toString())
					)
				)
				.returning()
			return account
		} catch (error) {
			console.error('Failed to edit account name in database', error)
			throw new Error('Failed to edit account name')
		}
	}

	static async deleteAccount({
		userId,
		accountId
	}: {
		userId: number
		accountId: string
	}): Promise<Pick<Account, 'id'> | undefined> {
		try {
			const [deletedAccount] = await db
				.delete(accountsTable)
				.where(
					and(
						eq(accountsTable.userId, userId.toString()),
						eq(accountsTable.id, accountId)
					)
				)
				.returning({
					id: accountsTable.id
				})

			return deletedAccount
		} catch (error) {
			console.error('Failed to delete account from database', error)
			throw new Error('Failed to delete account')
		}
	}
}

// eslint-disable-next-line
const AccountModelInstance: IAccountModel = AccountModel
