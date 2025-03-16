import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response } from 'express'
import { PublicUserInfo } from '@/db/schema'
import { SummaryController } from '@/modules/summary/controller'
import {
	TEST_USER_ID,
	TEST_USER_EMAIL,
	TEST_USER_ROLE,
	TEST_ACCOUNT_ID,
	mockCurrentPeriodSummary,
	mockPreviousPeriodSummary,
	mockTopCategories,
	mockOtherCategories,
	mockActiveDays
} from '@tests/common/constants'

const mockSummaryDays = vi.hoisted(() => ['2023-01-01', '2023-01-02'])
const TEST_START_DATE = vi.hoisted(() => new Date('2023-01-01'))
const TEST_END_DATE = vi.hoisted(() => new Date('2023-01-31'))

vi.mock('@/modules/summary/utils', () => {
	return {
		calculatePercentageChange: vi.fn().mockReturnValue(10),
		fillMissingDays: vi.fn().mockReturnValue(mockSummaryDays)
	}
})

// Mock date-fns functions
vi.mock('date-fns', () => {
	return {
		differenceInDays: vi.fn().mockReturnValue(30),
		parse: vi.fn((dateStr) => {
			if (dateStr === '2023-01-01') return TEST_START_DATE
			if (dateStr === '2023-01-31') return TEST_END_DATE
			return new Date()
		}),
		subDays: vi.fn((date, days) => {
			// For simplicity, return fixed dates for testing
			if (days === 30) return TEST_START_DATE
			return new Date(date.getTime() - days * 24 * 60 * 60 * 1000)
		})
	}
})

// Extend Express Request type to include user information
declare global {
	namespace Express {
		interface Request {
			user?: PublicUserInfo
		}
	}
}

const fakeSummaryModel = {
	fetchFinancialData: vi.fn().mockImplementation(({ startDate, endDate }) => {
		if (startDate === TEST_START_DATE && endDate === TEST_END_DATE) {
			return Promise.resolve([mockCurrentPeriodSummary])
		} else {
			return Promise.resolve([mockPreviousPeriodSummary])
		}
	}),
	getCategoriesSummary: vi.fn().mockResolvedValue({
		topCategories: mockTopCategories,
		otherCategories: mockOtherCategories
	}),
	getSummaryActiveDays: vi.fn().mockResolvedValue(mockActiveDays)
}

describe('SummaryController', () => {
	let controller: SummaryController
	let req: Partial<Request>
	let res: Partial<Response>

	beforeEach(() => {
		vi.clearAllMocks()

		controller = new SummaryController({ summaryModel: fakeSummaryModel })
		req = {
			user: { id: TEST_USER_ID, email: TEST_USER_EMAIL, role: TEST_USER_ROLE },
			query: {
				accountId: TEST_ACCOUNT_ID,
				from: '2023-01-01',
				to: '2023-01-31'
			}
		}
		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
			send: vi.fn()
		}
	})

	describe('getSummary', () => {
		it('should return summary data when successful', async () => {
			// Act
			await controller.getSummary(req as Request, res as Response)

			// Assert
			expect(fakeSummaryModel.fetchFinancialData).toHaveBeenCalledTimes(2)
			expect(fakeSummaryModel.getCategoriesSummary).toHaveBeenCalledWith({
				accountId: TEST_ACCOUNT_ID,
				userId: TEST_USER_ID,
				startDate: TEST_START_DATE,
				endDate: TEST_END_DATE
			})
			expect(fakeSummaryModel.getSummaryActiveDays).toHaveBeenCalledWith({
				accountId: TEST_ACCOUNT_ID,
				userId: TEST_USER_ID,
				startDate: TEST_START_DATE,
				endDate: TEST_END_DATE
			})
			expect(res.json).toHaveBeenCalledWith({
				data: expect.objectContaining({
					remainingAmount: mockCurrentPeriodSummary.remaining,
					incomeAmount: mockCurrentPeriodSummary.income,
					expensesAmount: mockCurrentPeriodSummary.expenses,
					categories: expect.arrayContaining([
						...mockTopCategories,
						{ name: 'Other', value: 400 } // Sum of mockOtherCategories values
					]),
					days: mockSummaryDays
				})
			})
		})

		it('should use default date range when no dates are provided', async () => {
			// Arrange
			req.query = { accountId: TEST_ACCOUNT_ID }

			// Act
			await controller.getSummary(req as Request, res as Response)

			// Assert
			expect(fakeSummaryModel.fetchFinancialData).toHaveBeenCalledTimes(2)
			expect(res.json).toHaveBeenCalled()
		})

		it('should return 401 when user is not found', async () => {
			// Arrange
			req.user = undefined

			// Act
			await controller.getSummary(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.send).toHaveBeenCalledWith('User not found')
			expect(fakeSummaryModel.fetchFinancialData).not.toHaveBeenCalled()
		})

		it('should handle case when there are no other categories', async () => {
			// Arrange
			fakeSummaryModel.getCategoriesSummary.mockResolvedValueOnce({
				topCategories: mockTopCategories,
				otherCategories: []
			})

			// Act
			await controller.getSummary(req as Request, res as Response)

			// Assert
			expect(res.json).toHaveBeenCalledWith({
				data: expect.objectContaining({
					categories: mockTopCategories
				})
			})
		})

		it('should handle errors and return 500 status', async () => {
			// Arrange
			fakeSummaryModel.fetchFinancialData.mockRejectedValueOnce(
				new Error('Database error')
			)

			// Act
			await controller.getSummary(req as Request, res as Response)

			// Assert
			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.send).toHaveBeenCalledWith('Failed to get summary')
		})
	})
})
