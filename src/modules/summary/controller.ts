import { Request, Response } from 'express'
import { ISummaryModel } from '@/modules/summary/types'
import { differenceInDays, parse, subDays } from 'date-fns'
import {
	calculatePercentageChange,
	fillMissingDays
} from '@/modules/summary/utils'

export class SummaryController {
	private summaryModel: ISummaryModel

	constructor({ summaryModel }: { summaryModel: ISummaryModel }) {
		this.summaryModel = summaryModel
	}

	getSummary = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id
			if (!userId) {
				res.status(401).send('User not found')
				return
			}
			const { from, to, accountId } = req.query

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
			const [currentPeriod] = await this.summaryModel.fetchFinancialData({
				accountId: accountId as string,
				userId,
				startDate,
				endDate
			})

			const [lastPeriod] = await this.summaryModel.fetchFinancialData({
				accountId: accountId as string,
				userId,
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

			const { topCategories, otherCategories } =
				await this.summaryModel.getCategoriesSummary({
					accountId: accountId as string,
					userId,
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
			const activeDays = await this.summaryModel.getSummaryActiveDays({
				accountId: accountId as string,
				userId,
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
			console.error('Failed to get summary', error)
			res.status(500).send('Failed to get summary')
		}
	}
}
