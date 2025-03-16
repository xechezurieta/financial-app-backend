import { describe, it, expect } from 'vitest'
import {
	calculatePercentageChange,
	fillMissingDays,
	convertAmountToMiliunits
} from '@/lib/utils'
import { addDays, isSameDay } from 'date-fns'

describe('Utils', () => {
	describe('calculatePercentageChange', () => {
		it('should calculate positive percentage change', () => {
			const result = calculatePercentageChange({ current: 150, previous: 100 })
			expect(result).toBe(50) // 50% increase
		})

		it('should calculate negative percentage change', () => {
			const result = calculatePercentageChange({ current: 75, previous: 100 })
			expect(result).toBe(-25) // 25% decrease
		})

		it('should return 0 when both values are 0', () => {
			const result = calculatePercentageChange({ current: 0, previous: 0 })
			expect(result).toBe(0)
		})

		it('should return 100 when previous is 0 but current is not', () => {
			const result = calculatePercentageChange({ current: 100, previous: 0 })
			expect(result).toBe(100)
		})
	})

	describe('fillMissingDays', () => {
		it('should return empty array when activeDays is empty', () => {
			const startDate = new Date('2023-01-01')
			const endDate = new Date('2023-01-05')
			const result = fillMissingDays({
				activeDays: [],
				startDate,
				endDate
			})
			expect(result).toEqual([])
		})

		it('should fill in missing days with zero values', () => {
			const startDate = new Date('2023-01-01')
			const endDate = new Date('2023-01-05')
			const activeDays = [
				{
					date: new Date('2023-01-01'),
					income: 100,
					expenses: 50
				},
				{
					date: new Date('2023-01-03'),
					income: 200,
					expenses: 75
				}
			]

			const result = fillMissingDays({
				activeDays,
				startDate,
				endDate
			})

			expect(result).toHaveLength(5) // 5 days from Jan 1-5
			expect(result[0].income).toBe(100) // Jan 1
			expect(result[1].income).toBe(0) // Jan 2
			expect(result[2].income).toBe(200) // Jan 3
			expect(result[3].income).toBe(0) // Jan 4
			expect(result[4].income).toBe(0) // Jan 5
		})

		it('should preserve original data for active days', () => {
			const baseDate = new Date('2023-01-01')
			const startDate = baseDate
			const endDate = addDays(baseDate, 2)

			const activeDays = [
				{ date: baseDate, income: 150, expenses: 75 },
				{ date: addDays(baseDate, 1), income: 200, expenses: 100 }
			]

			const result = fillMissingDays({ activeDays, startDate, endDate })

			expect(result).toHaveLength(3)

			// Compare first two items directly with activeDays
			expect(result[0]).toEqual(activeDays[0])
			expect(result[1]).toEqual(activeDays[1])

			// For the third date, compare properties individually to avoid timezone issues
			expect(isSameDay(result[2].date, addDays(baseDate, 2))).toBe(true)
			expect(result[2].income).toBe(0)
			expect(result[2].expenses).toBe(0)
		})
	})

	describe('convertAmountToMiliunits', () => {
		it('should convert decimal to miliunits', () => {
			expect(convertAmountToMiliunits(1)).toBe(1000)
			expect(convertAmountToMiliunits(0.1)).toBe(100)
			expect(convertAmountToMiliunits(0.001)).toBe(1)
		})

		it('should round to nearest miliunit', () => {
			expect(convertAmountToMiliunits(1.2345)).toBe(1235)
			expect(convertAmountToMiliunits(0.0005)).toBe(1)
			expect(convertAmountToMiliunits(0.0004)).toBe(0)
		})

		it('should handle zero', () => {
			expect(convertAmountToMiliunits(0)).toBe(0)
		})

		it('should handle negative numbers', () => {
			expect(convertAmountToMiliunits(-1.5)).toBe(-1500)
		})
	})
})
