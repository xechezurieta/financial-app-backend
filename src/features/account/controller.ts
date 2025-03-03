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
			const accounts = await this.accountModel.getAccounts({
				userId: req.user.id
			})
			res.json(accounts)
		} catch (error) {
			console.error('Failed to get accounts', error)
			res.status(500).send('Failed to get accounts')
		}
	}

	getAccount = async (req: Request, res: Response) => {
		try {
			const account = await this.accountModel.getAccount({
				accountId: req.params.accountId,
				userId: req.user.id
			})
			res.json(account)
		} catch (error) {
			console.error('Failed to get account', error)
			res.status(500).send('Failed to get account')
		}
	}

	createAccount = async (req: Request, res: Response) => {
		try {
			const account = await this.accountModel.createAccount({
				userId: req.user.id,
				name: req.body.name
			})
			res.json(account)
		} catch (error) {
			console.error('Failed to create account', error)
			res.status(500).send('Failed to create account')
		}
	}

	deleteAccounts = async (req: Request, res: Response) => {
		try {
			await this.accountModel.deleteAccounts({
				userId: req.user.id,
				accountIds: req.body.accountIds
			})
			res.send('Accounts deleted')
		} catch (error) {
			console.error('Failed to delete accounts', error)
			res.status(500).send('Failed to delete accounts')
		}
	}

	deleteAccount = async (req: Request, res: Response) => {
		try {
			await this.accountModel.deleteAccount({
				accountId: req.params.accountId,
				userId: req.user.id
			})
			res.send('Account deleted')
		} catch (error) {
			console.error('Failed to delete account', error)
			res.status(500).send('Failed to delete account')
		}
	}

	editAccountName = async (req: Request, res: Response) => {
		try {
			await this.accountModel.editAccountName({
				accountId: req.params.accountId,
				userId: req.user.id,
				name: req.body.name
			})
			res.send('Account name edited')
		} catch (error) {
			console.error('Failed to edit account name', error)
			res.status(500).send('Failed to edit account name')
		}
	}
}
