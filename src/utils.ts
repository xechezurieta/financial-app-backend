import { eachDayOfInterval, isSameDay } from 'date-fns'

export function calculatePercentageChange({
	current,
	previous
}: {
	current: number
	previous: number
}) {
	if (previous === 0) {
		return previous === current ? 0 : 100
	}
	return ((current - previous) / previous) * 100
}

export function fillMissingDays({
	activeDays,
	startDate,
	endDate
}: {
	activeDays: {
		date: Date
		income: number
		expenses: number
	}[]
	startDate: Date
	endDate: Date
}) {
	if (activeDays.length === 0) {
		return []
	}
	const allDays = eachDayOfInterval({ start: startDate, end: endDate })

	const transactionsByDay = allDays.map((day) => {
		const found = activeDays.find((activeDay) => isSameDay(activeDay.date, day))
		if (found) {
			return found
		}
		return {
			date: day,
			income: 0,
			expenses: 0
		}
	})

	return transactionsByDay
}

export function convertAmountToMiliunits(amount: number) {
	return Math.round(amount * 1000)
}
