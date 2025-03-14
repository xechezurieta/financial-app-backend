import { Router } from 'express'
import { AccountController } from '@/modules/account/controller'
import { IAccountModel } from '@/modules/account/types'

export const createAccountRouter = ({
	accountModel
}: {
	accountModel: IAccountModel
}) => {
	const accountRouter = Router()

	const accountController = new AccountController({ accountModel })

	accountRouter.get('/', accountController.getAccounts)
	accountRouter.get('/:accountId', accountController.getAccount)
	accountRouter.post('/', accountController.createAccount)
	accountRouter.delete('/', accountController.deleteAccounts)
	accountRouter.delete('/:accountId', accountController.deleteAccount)
	accountRouter.patch('/:accountId', accountController.editAccountName)

	return accountRouter
}
