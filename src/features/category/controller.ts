import { Request, Response } from 'express'
import { ICategoryModel } from '@/features/category/types'

// TODO: user management
// TODO: error handling
// TODO: types
export class CategoryController {
	private categoryModel: ICategoryModel

	constructor({ categoryModel }: { categoryModel: ICategoryModel }) {
		this.categoryModel = categoryModel
	}

	getCategories = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id.toString()
			if (!userId) {
				res.status(401).send('User not found')
				return
			}

			const categories = await this.categoryModel.getCategories({
				userId
			})
			res.json({ categories })
		} catch (error) {
			console.error('Failed to get categories', error)
			res.status(500).send('Failed to get categories')
		}
	}

	getCategory = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id.toString()
			if (!userId) {
				res.status(401).send('User not found')
				return
			}
			const { categoryId } = req.params

			const category = await this.categoryModel.getCategory({
				categoryId,
				userId
			})
			res.json({ category })
		} catch (error) {
			console.error('Failed to get category', error)
			res.status(500).send('Failed to get category')
		}
	}

	createCategory = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id.toString()
			if (!userId) {
				res.status(401).send('User not found')
				return
			}
			const { name } = req.body

			const category = await this.categoryModel.createCategory({
				userId,
				name
			})
			res.json({ category })
		} catch (error) {
			console.error('Failed to create category', error)
			res.status(500).send('Failed to create category')
		}
	}

	deleteCategories = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id.toString()
			if (!userId) {
				res.status(401).send('User not found')
				return
			}
			const { categoryIds } = req.body

			const categories = await this.categoryModel.deleteCategories({
				userId,
				categoryIds
			})
			res.json({ categories })
		} catch (error) {
			console.error('Failed to delete categories', error)
			res.status(500).send('Failed to delete categories')
		}
	}

	deleteCategory = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id.toString()
			if (!userId) {
				res.status(401).send('User not found')
				return
			}
			const { categoryId } = req.params

			const deletedCategory = await this.categoryModel.deleteCategory({
				categoryId,
				userId
			})
			res.json({ deletedCategory })
		} catch (error) {
			console.error('Failed to delete category', error)
			res.status(500).send('Failed to delete category')
		}
	}

	editCategoryName = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id.toString()
			if (!userId) {
				res.status(401).send('User not found')
				return
			}
			const { categoryId } = req.params
			const { name } = req.body

			const category = await this.categoryModel.editCategoryName({
				categoryId,
				userId,
				name
			})
			res.json({ category })
		} catch (error) {
			console.error('Failed to edit category name', error)
			res.status(500).send('Failed to edit category name')
		}
	}
}
