import { Account } from '@/features/account/schema'

export interface IAccountModel {
	getAccounts({ userId }: { userId: number }): Promise<Account[]>
	getAccount({
		accountId,
		userId
	}: {
		accountId: string
		userId: number
	}): Promise<Pick<Account, 'id' | 'name'> | undefined>
	createAccount({
		userId,
		name
	}: {
		userId: number
		name: string
	}): Promise<Account>
	deleteAccounts({
		userId,
		accountIds
	}: {
		userId: number
		accountIds: string[]
	}): Promise<Pick<Account, 'id'>[]>
	editAccountName({
		accountId,
		userId,
		name
	}: {
		accountId: string
		userId: number
		name: string
	}): Promise<Account>
	deleteAccount({
		userId,
		accountId
	}: {
		userId: number
		accountId: string
	}): Promise<Pick<Account, 'id'> | undefined>
}
