import { faker } from '@faker-js/faker'

// User constants
export const TEST_USER_ID = faker.number.int({ min: 1, max: 1000 })
export const TEST_USER_EMAIL = faker.internet.email()
export const TEST_USER_ROLE = 'standard'

export const mockUser = {
	id: TEST_USER_ID,
	email: TEST_USER_EMAIL,
	role: TEST_USER_ROLE
}

// Account constants
export const TEST_ACCOUNT_ID = faker.string.uuid()
export const TEST_NEW_ACCOUNT_ID = faker.string.uuid()
export const TEST_ACCOUNT_NAME = faker.finance.accountName()
export const TEST_NEW_ACCOUNT_NAME = faker.finance.accountName()
export const TEST_UPDATED_ACCOUNT_NAME = faker.finance.accountName()

// Mock account data
export const mockAccount = {
	id: TEST_ACCOUNT_ID,
	name: TEST_ACCOUNT_NAME
}

export const mockNewAccount = {
	id: TEST_NEW_ACCOUNT_ID,
	name: TEST_NEW_ACCOUNT_NAME
}

export const mockUpdatedAccount = {
	id: TEST_ACCOUNT_ID,
	name: TEST_UPDATED_ACCOUNT_NAME
}

// Category constants
export const TEST_CATEGORY_ID = faker.string.uuid()
export const TEST_NEW_CATEGORY_ID = faker.string.uuid()
export const TEST_CATEGORY_NAME = faker.commerce.department()
export const TEST_NEW_CATEGORY_NAME = faker.commerce.department()
export const TEST_UPDATED_CATEGORY_NAME = faker.commerce.department()

// Mock category data
export const mockCategory = {
	id: TEST_CATEGORY_ID,
	name: TEST_CATEGORY_NAME
}

export const mockNewCategory = {
	id: TEST_NEW_CATEGORY_ID,
	name: TEST_NEW_CATEGORY_NAME
}

export const mockUpdatedCategory = {
	id: TEST_CATEGORY_ID,
	name: TEST_UPDATED_CATEGORY_NAME
}

// Transaction constants
export const TEST_TRANSACTION_ID = faker.string.uuid()
export const TEST_NEW_TRANSACTION_ID = faker.string.uuid()
export const TEST_TRANSACTION_AMOUNT = faker.number.float({
	min: 10,
	max: 1000,
	fractionDigits: 2
})
export const TEST_TRANSACTION_DATE = faker.date.recent().toString()
export const TEST_TRANSACTION_PAYEE = faker.company.name()
export const TEST_TRANSACTION_NOTES = faker.lorem.sentence()

// Mock transaction data
export const mockTransaction = {
	id: TEST_TRANSACTION_ID,
	accountId: TEST_ACCOUNT_ID,
	categoryId: TEST_CATEGORY_ID,
	amount: TEST_TRANSACTION_AMOUNT,
	date: TEST_TRANSACTION_DATE,
	payee: TEST_TRANSACTION_PAYEE,
	notes: TEST_TRANSACTION_NOTES
}

export const mockNewTransaction = {
	id: TEST_NEW_TRANSACTION_ID,
	accountId: TEST_ACCOUNT_ID,
	categoryId: TEST_CATEGORY_ID,
	amount: TEST_TRANSACTION_AMOUNT,
	date: TEST_TRANSACTION_DATE,
	payee: TEST_TRANSACTION_PAYEE,
	notes: TEST_TRANSACTION_NOTES
}

export const mockUpdatedTransaction = {
	id: TEST_TRANSACTION_ID,
	accountId: TEST_ACCOUNT_ID,
	categoryId: TEST_CATEGORY_ID,
	amount: TEST_TRANSACTION_AMOUNT * 1.5,
	date: TEST_TRANSACTION_DATE,
	payee: faker.company.name(),
	notes: faker.lorem.sentence()
}

// Summary constants
export const TEST_START_DATE = new Date('2023-01-01')
export const TEST_END_DATE = new Date('2023-01-31')

// Mock summary data
export const mockCurrentPeriodSummary = {
	income: 5000,
	expenses: 3000,
	remaining: 2000
}

export const mockPreviousPeriodSummary = {
	income: 4500,
	expenses: 2800,
	remaining: 1700
}

export const mockTopCategories = [
	{ name: 'Food', value: 1200 },
	{ name: 'Housing', value: 900 },
	{ name: 'Transportation', value: 500 }
]

export const mockOtherCategories = [
	{ name: 'Entertainment', value: 200 },
	{ name: 'Miscellaneous', value: 200 }
]

export const mockActiveDays = [
	{ date: '2023-01-01', income: 500, expenses: 300 },
	{ date: '2023-01-15', income: 2500, expenses: 1200 },
	{ date: '2023-01-30', income: 2000, expenses: 1500 }
]

export const mockSummaryDays = [
	{ date: '2023-01-01', income: 500, expenses: 300 },
	{ date: '2023-01-02', income: 0, expenses: 0 },
	// More days would be here in a real implementation
	{ date: '2023-01-15', income: 2500, expenses: 1200 },
	// More days would be here in a real implementation
	{ date: '2023-01-30', income: 2000, expenses: 1500 },
	{ date: '2023-01-31', income: 0, expenses: 0 }
]
