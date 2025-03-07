import { differenceInDays, parse, subDays } from 'date-fns'
import { Request, Response } from 'express'
import {
	fetchFinancialData,
	getCategoriesSummary,
	getSummaryActiveDays
} from '../db/queries'
import { calculatePercentageChange, fillMissingDays } from '../utils'
export const getSummaryController = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { from, to, accountId, userId } = req.query

		const defaultTo = new Date()
		const defaultFrom = subDays(defaultTo, 30)

		const startDate = from
			? parse(from as string, 'yyyy-MM-dd', new Date())
			: defaultFrom
		const endDate = to
			? parse(to as string, 'yyyy-MM-dd', new Date())
			: defaultTo

		const periodLength = differenceInDays(endDate, startDate) + 1

		const lastPeriodStartDate = subDays(startDate, periodLength)
		const lastPeriodEndDate = subDays(endDate, periodLength)
		const [currentPeriod] = await fetchFinancialData({
			accountId: accountId as string,
			userId: userId as string,
			startDate,
			endDate
		})

		const [lastPeriod] = await fetchFinancialData({
			accountId: accountId as string,
			userId: userId as string,
			startDate: lastPeriodStartDate,
			endDate: lastPeriodEndDate
		})

		const incomeChange = calculatePercentageChange({
			current: currentPeriod.income,
			previous: lastPeriod.income
		})

		const expensesChange = calculatePercentageChange({
			current: currentPeriod.expenses,
			previous: lastPeriod.expenses
		})

		const remainingChange = calculatePercentageChange({
			current: currentPeriod.remaining,
			previous: lastPeriod.remaining
		})

		const { topCategories, otherCategories } = await getCategoriesSummary({
			accountId: accountId as string,
			userId: userId as string,
			startDate,
			endDate
		})
		console.log({ topCategories, otherCategories })
		const otherSum = otherCategories.reduce(
			(acc, category) => acc + category.value,
			0
		)
		const finalCategories = topCategories
		if (otherSum > 0) {
			finalCategories.push({ name: 'Other', value: otherSum })
		}
		const activeDays = await getSummaryActiveDays({
			accountId: accountId as string,
			userId: userId as string,
			startDate,
			endDate
		})

		const days = fillMissingDays({
			activeDays,
			startDate,
			endDate
		})

		res.json({
			data: {
				remainingAmount: currentPeriod.remaining || 0,
				remainingChange: remainingChange || 0,
				incomeAmount: currentPeriod.income || 0,
				incomeChange: incomeChange || 0,
				expensesAmount: currentPeriod.expenses || 0,
				expensesChange: expensesChange || 0,
				categories: finalCategories,
				days
			}
		})
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}
