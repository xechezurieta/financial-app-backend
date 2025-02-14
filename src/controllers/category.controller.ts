import {
	createCategory,
	deleteCategory,
	deleteCategories,
	editCategoryName,
	getCategory,
	getCategories
} from '../db/queries'
import { Request, Response } from 'express'

export const getCategoriesController = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const categories = await getCategories('1')
		res.json({ categories })
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}

export const createCategoryController = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { name, userId } = req.body
	try {
		const category = await createCategory(userId, name)
		res.json({ category })
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}

export const bulkDeleteCategoriesController = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { categoryIds, userId } = req.body
	try {
		const deletedCategories = await deleteCategories(userId, categoryIds)
		res.json({ deletedCategories })
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}

export const getCategoryController = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { categoryId, userId } = req.body
	try {
		const category = await getCategory(categoryId, userId)
		if (!category) {
			res.status(404).json({ message: 'Category not found' })
			return
		}
		res.json({ category })
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}

export const editCategoryNameController = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { categoryId, name, userId } = req.body
	try {
		const category = await editCategoryName(categoryId, userId, name)
		if (!category) {
			res.status(404).json({ message: 'Category not found' })
			return
		}
		res.json({ category })
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}

export const deleteCategoryController = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { categoryId, userId } = req.body
	try {
		const deletedCategory = await deleteCategory(userId, categoryId)
		if (!deletedCategory) {
			res.status(404).json({ message: 'Category not found' })
			return
		}
		res.json({ deletedCategory })
	} catch (error) {
		res.status(500).json({ message: 'Server error' })
	}
}
