import { Request, Response } from 'express'
import { IAccountModel } from '@/features/account/types'

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

			const account = await this.accountModel.getAccount({
				accountId: req.params.accountId,
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

			const account = await this.accountModel.createAccount({
				userId,
				name: req.body.name
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

			const accounts = await this.accountModel.deleteAccounts({
				userId,
				accountIds: req.body.accountIds
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

			const deletedAccount = await this.accountModel.deleteAccount({
				accountId: req.params.accountId,
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

			const account = await this.accountModel.editAccountName({
				accountId: req.params.accountId,
				userId,
				name: req.body.name
			})
			res.json({ account })
		} catch (error) {
			console.error('Failed to edit account name', error)
			res.status(500).send('Failed to edit account name')
		}
	}
}
