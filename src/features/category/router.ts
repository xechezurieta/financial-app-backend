import { Router } from 'express'
import { CategoryController } from '@/features/category/controller'
import { ICategoryModel } from '@/features/category/types'

// TODO: route management
// TODO: middleware
// TODO: types
export const createCategoryRouter = ({
	categoryModel
}: {
	categoryModel: ICategoryModel
}) => {
	const categoryRouter = Router()

	const categoryController = new CategoryController({ categoryModel })

	categoryRouter.get('/', categoryController.getCategories)
	categoryRouter.get('/:categoryId', categoryController.getCategory)
	categoryRouter.post('/', categoryController.createCategory)
	categoryRouter.delete('/', categoryController.deleteCategories)
	categoryRouter.delete('/:categoryId', categoryController.deleteCategory)
	categoryRouter.patch('/:categoryId', categoryController.editCategoryName)

	return categoryRouter
}
