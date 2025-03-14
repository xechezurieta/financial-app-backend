import { Router } from 'express'
import { SummaryController } from '@/features/summary/controller'
import { ISummaryModel } from '@/features/summary/types'

export const createSummaryRouter = ({
	summaryModel
}: {
	summaryModel: ISummaryModel
}) => {
	const summaryRouter = Router()

	const summaryController = new SummaryController({ summaryModel })

	summaryRouter.get('/', summaryController.getSummary)

	return summaryRouter
}
