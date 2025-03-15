import { faker } from '@faker-js/faker'

// User constants
export const TEST_USER_ID = faker.number.int({ min: 1, max: 1000 })
export const TEST_USER_EMAIL = faker.internet.email()
export const TEST_USER_ROLE = 'standard'

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
export const TEST_TRANSACTION_DATE = faker.date.recent()
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
