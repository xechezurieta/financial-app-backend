import express from 'express'
import { login } from './controllers/auth.controller'
import {
	bulkDeleteAccountsController,
	createAccountController,
	deleteAccountController,
	editAccountNameController,
	getAccountController,
	getAccountsController
} from './controllers/account.controller'
import {
	bulkDeleteCategoriesController,
	createCategoryController,
	deleteCategoryController,
	editCategoryNameController,
	getCategoriesController,
	getCategoryController
} from './controllers/category.controller'
import {
	bulkDeleteTransactionsController,
	createTransactionController,
	deleteTransactionController,
	editTransactionController,
	getTransactionController,
	getTransactionsController
} from './controllers/transaction.controller'
import { getSummaryController } from './controllers/summary.controller'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.post('/login', login)
// TODO: organize routes with router and proper structure
/* Accounts */
app.get('/accounts', getAccountsController)
app.post('/accounts', createAccountController)
app.post('/accounts/bulk-delete', bulkDeleteAccountsController)
app.post('/accounts/account', getAccountController)
app.patch('/accounts', editAccountNameController)
app.post('/accounts/single-delete', deleteAccountController)

/* Categories */
app.get('/categories', getCategoriesController)
app.post('/categories', createCategoryController)
app.post('/categories/bulk-delete', bulkDeleteCategoriesController)
app.post('/categories/category', getCategoryController)
app.patch('/categories', editCategoryNameController)
app.post('/categories/single-delete', deleteCategoryController)

/* Transactions */

app.post('/transactions', getTransactionsController)
app.post('/transactions/create', createTransactionController)
app.post('/transactions/bulk-delete', bulkDeleteTransactionsController)
app.post('/transactions/transaction', getTransactionController)
app.patch('/transactions', editTransactionController)
app.post('/transactions/single-delete', deleteTransactionController)

/* Summary */
app.get('/summary', getSummaryController)
app.listen(3001, () => {
	console.log('Backend listening on port 3001')
})
