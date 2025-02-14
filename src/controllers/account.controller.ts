import {
	createAccount,
	deleteAccount,
	deleteAccounts,
	editAccountName,
	getAccount,
	getAccounts
} from '../db/queries'
import { Request, Response } from 'express'
export const getAccountsController = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const accounts = await getAccounts('1')
		res.json({ accounts })
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}

export const createAccountController = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { name, userId } = req.body
	try {
		const account = await createAccount(userId, name)
		res.json({ account })
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}

export const bulkDeleteAccountsController = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { accountIds, userId } = req.body
	try {
		const deletedAccounts = await deleteAccounts(userId, accountIds)
		res.json({ deletedAccounts })
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}

export const getAccountController = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { accountId, userId } = req.body
	try {
		const account = await getAccount(accountId, userId)
		if (!account) {
			res.status(404).json({ message: 'Account not found' })
			return
		}
		res.json({ account })
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}

export const editAccountNameController = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { accountId, name, userId } = req.body
	try {
		const account = await editAccountName(accountId, userId, name)
		if (!account) {
			res.status(404).json({ message: 'Account not found' })
			return
		}
		res.json({ account })
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}

export const deleteAccountController = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { accountId, userId } = req.body
	try {
		const deletedAccount = await deleteAccount(userId, accountId)
		if (!deletedAccount) {
			res.status(404).json({ message: 'Account not found' })
			return
		}
		res.json({ deletedAccount })
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}
