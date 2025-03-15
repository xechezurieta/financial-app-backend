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
