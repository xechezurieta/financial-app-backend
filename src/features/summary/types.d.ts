export interface ISummaryModel {
	fetchFinancialData({
		userId,
		accountId,
		startDate,
		endDate
	}: {
		userId: string
		accountId: string
		startDate: Date
		endDate: Date
	}): Promise<
		{
			income: number
			expenses: number
			remaining: number
		}[]
	>
	getCategoriesSummary({
		userId,
		accountId,
		startDate,
		endDate
	}: {
		userId: string
		accountId: string
		startDate: Date
		endDate: Date
	}): Promise<{
		topCategories: {
			name: string
			value: number
		}[]
		otherCategories: {
			name: string
			value: number
		}[]
	}>
	getSummaryActiveDays({
		userId,
		accountId,
		startDate,
		endDate
	}: {
		userId: string
		accountId: string
		startDate: Date
		endDate: Date
	}): Promise<
		{
			date: Date
			income: number
			expenses: number
		}[]
	>
}
