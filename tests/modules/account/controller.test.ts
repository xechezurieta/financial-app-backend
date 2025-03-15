// tests/unit/accountController.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response } from 'express'
import { AccountController } from '../../../src/modules/account/controller' // Corrected import path

const fakeAccountModel = {
	getAccounts: vi
		.fn()
		.mockResolvedValue([{ id: 'acc1', name: 'Test Account' }]),
	getAccount: vi.fn().mockResolvedValue({ id: 'acc1', name: 'Test Account' }),
	createAccount: vi.fn().mockResolvedValue({ id: 'acc2', name: 'New Account' }),
	deleteAccounts: vi.fn().mockResolvedValue([{ id: 'acc1' }]),
	deleteAccount: vi.fn().mockResolvedValue({ id: 'acc1' }),
	editAccountName: vi
		.fn()
		.mockResolvedValue({ id: 'acc1', name: 'Updated Account' })
}

describe('AccountController', () => {
	let controller: AccountController
	let req: Partial<Request>
	let res: Partial<Response>

	beforeEach(() => {
		controller = new AccountController({ accountModel: fakeAccountModel })
		req = {
			user: { id: 'test-user-id' },
			body: {},
			params: {}
		}
		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
			send: vi.fn()
		}
	})

	it('getAccounts should return accounts', async () => {
		await controller.getAccounts(req as Request, res as Response)
		expect(fakeAccountModel.getAccounts).toHaveBeenCalledWith({
			userId: 'test-user-id'
		})
		expect(res.json).toHaveBeenCalledWith({
			accounts: [{ id: 'acc1', name: 'Test Account' }]
		})
	})

	it('getAccount should return a single account', async () => {
		req.params = { accountId: 'acc1' }
		await controller.getAccount(req as Request, res as Response)
		expect(fakeAccountModel.getAccount).toHaveBeenCalledWith({
			accountId: 'acc1',
			userId: 'test-user-id'
		})
		expect(res.json).toHaveBeenCalledWith({
			account: { id: 'acc1', name: 'Test Account' }
		})
	})

	it('createAccount should create and return a new account', async () => {
		req.body = { name: 'New Account' }
		await controller.createAccount(req as Request, res as Response)
		expect(fakeAccountModel.createAccount).toHaveBeenCalledWith({
			userId: 'test-user-id',
			name: 'New Account'
		})
		expect(res.json).toHaveBeenCalledWith({
			account: { id: 'acc2', name: 'New Account' }
		})
	})

	it('deleteAccounts should delete multiple accounts', async () => {
		req.body = { accountIds: ['acc1'] }
		await controller.deleteAccounts(req as Request, res as Response)
		expect(fakeAccountModel.deleteAccounts).toHaveBeenCalledWith({
			userId: 'test-user-id',
			accountIds: ['acc1']
		})
		expect(res.json).toHaveBeenCalledWith({
			accounts: [{ id: 'acc1' }]
		})
	})

	it('deleteAccount should delete a single account', async () => {
		req.params = { accountId: 'acc1' }
		await controller.deleteAccount(req as Request, res as Response)
		expect(fakeAccountModel.deleteAccount).toHaveBeenCalledWith({
			accountId: 'acc1',
			userId: 'test-user-id'
		})
		expect(res.json).toHaveBeenCalledWith({
			deletedAccount: { id: 'acc1' }
		})
	})

	it('editAccountName should update and return account name', async () => {
		req.params = { accountId: 'acc1' }
		req.body = { name: 'Updated Account' }
		await controller.editAccountName(req as Request, res as Response)
		expect(fakeAccountModel.editAccountName).toHaveBeenCalledWith({
			accountId: 'acc1',
			userId: 'test-user-id',
			name: 'Updated Account'
		})
		expect(res.json).toHaveBeenCalledWith({
			account: { id: 'acc1', name: 'Updated Account' }
		})
	})
})
