import { Request, Response } from 'express'
import { IAccountModel } from '@/modules/account/types'

// TODO: user management
// TODO: error handling
// TODO: types
export class AccountController {
	private accountModel: IAccountModel

	constructor({ accountModel }: { accountModel: IAccountModel }) {
		this.accountModel = accountModel
	}

	getAccounts = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id.toString()
			if (!userId) {
				res.status(401).send('User not found')
				return
			}

			const accounts = await this.accountModel.getAccounts({
				userId
			})
			res.json({ accounts })
		} catch (error) {
			console.error('Failed to get accounts', error)
			res.status(500).send('Failed to get accounts')
		}
	}

	getAccount = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id.toString()
			if (!userId) {
				res.status(401).send('User not found')
				return
			}
			const { accountId } = req.params

			const account = await this.accountModel.getAccount({
				accountId,
				userId
			})
			res.json({ account })
		} catch (error) {
			console.error('Failed to get account', error)
			res.status(500).send('Failed to get account')
		}
	}

	createAccount = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id.toString()
			if (!userId) {
				res.status(401).send('User not found')
				return
			}
			const { name } = req.body

			const account = await this.accountModel.createAccount({
				userId,
				name
			})
			res.json({ account })
		} catch (error) {
			console.error('Failed to create account', error)
			res.status(500).send('Failed to create account')
		}
	}

	deleteAccounts = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id.toString()
			if (!userId) {
				res.status(401).send('User not found')
				return
			}
			const { accountIds } = req.body

			const accounts = await this.accountModel.deleteAccounts({
				userId,
				accountIds
			})
			res.json({ accounts })
		} catch (error) {
			console.error('Failed to delete accounts', error)
			res.status(500).send('Failed to delete accounts')
		}
	}

	deleteAccount = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id.toString()
			if (!userId) {
				res.status(401).send('User not found')
				return
			}
			const { accountId } = req.params

			const deletedAccount = await this.accountModel.deleteAccount({
				accountId,
				userId
			})
			res.json({ deletedAccount })
		} catch (error) {
			console.error('Failed to delete account', error)
			res.status(500).send('Failed to delete account')
		}
	}

	editAccountName = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id.toString()
			if (!userId) {
				res.status(401).send('User not found')
				return
			}
			const { accountId } = req.params
			const { name } = req.body

			const account = await this.accountModel.editAccountName({
				accountId,
				userId,
				name
			})
			res.json({ account })
		} catch (error) {
			console.error('Failed to edit account name', error)
			res.status(500).send('Failed to edit account name')
		}
	}
}
