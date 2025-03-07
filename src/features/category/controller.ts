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
			const categories = await this.categoryModel.getCategories({
				userId: '1'
			})
			res.json(categories)
		} catch (error) {
			console.error('Failed to get categories', error)
			res.status(500).send('Failed to get categories')
		}
	}

	getCategory = async (req: Request, res: Response) => {
		try {
			const category = await this.categoryModel.getCategory({
				categoryId: req.params.categoryId,
				userId: req.user.id
			})
			res.json(category)
		} catch (error) {
			console.error('Failed to get category', error)
			res.status(500).send('Failed to get category')
		}
	}

	createCategory = async (req: Request, res: Response) => {
		try {
			const category = await this.categoryModel.createCategory({
				userId: req.user.id,
				name: req.body.name
			})
			res.json(category)
		} catch (error) {
			console.error('Failed to create category', error)
			res.status(500).send('Failed to create category')
		}
	}

	deleteCategories = async (req: Request, res: Response) => {
		try {
			await this.categoryModel.deleteCategories({
				userId: req.user.id,
				categoryIds: req.body.categoryIds
			})
			res.send('Categories deleted')
		} catch (error) {
			console.error('Failed to delete categories', error)
			res.status(500).send('Failed to delete categories')
		}
	}

	deleteCategory = async (req: Request, res: Response) => {
		try {
			await this.categoryModel.deleteCategory({
				categoryId: req.params.categoryId,
				userId: req.user.id
			})
			res.send('Category deleted')
		} catch (error) {
			console.error('Failed to delete category', error)
			res.status(500).send('Failed to delete category')
		}
	}

	editCategoryName = async (req: Request, res: Response) => {
		try {
			await this.categoryModel.editCategoryName({
				categoryId: req.params.categoryId,
				userId: req.user.id,
				name: req.body.name
			})
			res.send('Category name edited')
		} catch (error) {
			console.error('Failed to edit category name', error)
			res.status(500).send('Failed to edit category name')
		}
	}
}
