import { eachDayOfInterval, format, subDays } from 'date-fns'
import { db } from './drizzle'
import {
	accountsTable,
	categoriesTable,
	transactionsTable
	/* usersTable */
} from './schema'
import { convertAmountToMiliunits } from '../lib/utils'

const SEED_USER_ID = '1'

const SEED_CATEGORIES = [
	{
		id: 'category_1',
		name: 'Groceries',
		userId: SEED_USER_ID,
		plaidId: null
	},
	{
		id: 'category_2',
		name: 'Rent',
		userId: SEED_USER_ID,
		plaidId: null
	},
	{
		id: 'category_3',
		name: 'Utilities',
		userId: SEED_USER_ID,
		plaidId: null
	},
	{
		id: 'category_4',
		name: 'Transportation',
		userId: SEED_USER_ID,
		plaidId: null
	},
	{
		id: 'category_5',
		name: 'Health',
		userId: SEED_USER_ID,
		plaidId: null
	},
	{
		id: 'category_6',
		name: 'Entertainment',
		userId: SEED_USER_ID,
		plaidId: null
	},
	{
		id: 'category_7',
		name: 'Clothing',
		userId: SEED_USER_ID,
		plaidId: null
	},
	{
		id: 'category_8',
		name: 'Miscellaneous',
		userId: SEED_USER_ID,
		plaidId: null
	}
]

const SEED_ACCOUNTS = [
	{
		id: 'account_1',
		name: 'Checking',
		userId: SEED_USER_ID,
		plaidId: null
	},
	{
		id: 'account_2',
		name: 'Savings',
		userId: SEED_USER_ID,
		plaidId: null
	}
]
const defaultTo = new Date()
const defaultFrom = subDays(defaultTo, 30)

const SEED_TRANSACTIONS: (typeof transactionsTable.$inferSelect)[] = []
const generateRandomAmount = (
	category: typeof categoriesTable.$inferInsert
) => {
	switch (category.name) {
		case 'Groceries':
			return Math.floor(Math.random() * 100) + 50
		case 'Rent':
			return Math.floor(Math.random() * 1000) + 500
		case 'Utilities':
			return Math.floor(Math.random() * 200) + 100
		case 'Transportation':
			return Math.floor(Math.random() * 50) + 20
		case 'Health':
			return Math.floor(Math.random() * 200) + 50
		case 'Entertainment':
			return Math.floor(Math.random() * 100) + 20
		case 'Clothing':
			return Math.floor(Math.random() * 100) + 20
		case 'Miscellaneous':
			return Math.floor(Math.random() * 100) + 20
		default:
			return Math.floor(Math.random() * 100) + 10
	}
}
const generateTransactionsForDay = (day: Date) => {
	const numTransactions = Math.floor(Math.random() * 4) + 1

	for (let i = 0; i < numTransactions; i++) {
		const category =
			SEED_CATEGORIES[Math.floor(Math.random() * SEED_CATEGORIES.length)]
		const isExpense = Math.random() > 0.6
		const amount = generateRandomAmount(category)
		const formattedAmount = convertAmountToMiliunits(
			isExpense ? -amount : amount
		)

		SEED_TRANSACTIONS.push({
			id: `transaction_${format(day, 'yyyyMMdd')}_${i}`,
			accountId: SEED_ACCOUNTS[0].id,
			categoryId: category.id,
			date: day,
			amount: formattedAmount,
			payee: 'Test Paye,e',
			notes: 'Test Notes'
		})
	}
}

const generateTransactions = () => {
	const days = eachDayOfInterval({ start: defaultFrom, end: defaultTo })
	days.forEach((day) => generateTransactionsForDay(day))
}

generateTransactions()
async function seed() {
	/* const name = 'test'
	const age = 20
	const email = 'test@test.com'
	const password = 'test'

	const [user] = await db
		.insert(usersTable)
		.values([
			{
				name,
				age,
				email,
				password
			}
		])
		.returning()

	console.log('Initial user created.', { user }) */
	await db.delete(transactionsTable).execute()
	await db.delete(accountsTable).execute()
	await db.delete(categoriesTable).execute()
	await db.insert(categoriesTable).values(SEED_CATEGORIES).execute()
	await db.insert(accountsTable).values(SEED_ACCOUNTS).execute()
	await db.insert(transactionsTable).values(SEED_TRANSACTIONS).execute()
}

seed()
	.catch((error) => {
		console.error('Seed process failed:', error)
		process.exit(1)
	})
	.finally(() => {
		console.log('Seed process finished. Exiting...')
		process.exit(0)
	})
