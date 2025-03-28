import { and, eq, inArray } from 'drizzle-orm'
import { db } from '../../db/drizzle'
import { categoriesTable, type Category } from '@/db/schema'
import { ICategoryModel } from '@/modules/category/types'

export class CategoryModel {
	static async getCategories({
		userId
	}: {
		userId: number
	}): Promise<Category[]> {
		try {
			return await db
				.select()
				.from(categoriesTable)
				.where(eq(categoriesTable.userId, userId.toString()))
		} catch (error) {
			console.error('Failed to get categories from database', error)
			throw new Error('Failed to retrieve categories')
		}
	}

	static async getCategory({
		categoryId,
		userId
	}: {
		categoryId: string
		userId: number
	}): Promise<Pick<Category, 'id' | 'name'> | undefined> {
		try {
			const [data] = await db
				.select({
					id: categoriesTable.id,
					name: categoriesTable.name
				})
				.from(categoriesTable)
				.where(
					and(
						eq(categoriesTable.id, categoryId),
						eq(categoriesTable.userId, userId.toString())
					)
				)
			return data
		} catch (error) {
			console.error('Failed to get category from database', error)
			throw new Error('Failed to retrieve category')
		}
	}

	static async createCategory({
		userId,
		name
	}: {
		userId: number
		name: string
	}): Promise<Category> {
		try {
			const [category] = await db
				.insert(categoriesTable)
				.values({
					id: crypto.randomUUID(),
					userId: userId.toString(),
					name,
					plaidId: crypto.randomUUID()
				})
				.returning()
			return category
		} catch (error) {
			console.error('Failed to create category in database', error)
			throw new Error('Failed to create category')
		}
	}

	static async deleteCategories({
		userId,
		categoryIds
	}: {
		userId: number
		categoryIds: Array<string>
	}): Promise<Pick<Category, 'id'>[]> {
		try {
			return await db
				.delete(categoriesTable)
				.where(
					and(
						eq(categoriesTable.userId, userId.toString()),
						inArray(categoriesTable.id, categoryIds)
					)
				)
				.returning({
					id: categoriesTable.id
				})
		} catch (error) {
			console.error('Failed to delete categories from database', error)
			throw new Error('Failed to delete categories')
		}
	}

	static async editCategoryName({
		categoryId,
		userId,
		name
	}: {
		categoryId: string
		userId: number
		name: string
	}): Promise<Category> {
		try {
			const [category] = await db
				.update(categoriesTable)
				.set({
					name
				})
				.where(
					and(
						eq(categoriesTable.id, categoryId),
						eq(categoriesTable.userId, userId.toString())
					)
				)
				.returning()
			return category
		} catch (error) {
			console.error('Failed to edit category name in database', error)
			throw new Error('Failed to edit category name')
		}
	}

	static async deleteCategory({
		userId,
		categoryId
	}: {
		userId: number
		categoryId: string
	}): Promise<Pick<Category, 'id'> | undefined> {
		try {
			const [category] = await db
				.delete(categoriesTable)
				.where(
					and(
						eq(categoriesTable.userId, userId.toString()),
						eq(categoriesTable.id, categoryId)
					)
				)
				.returning({
					id: categoriesTable.id
				})
			return category
		} catch (error) {
			console.error('Failed to delete category from database', error)
			throw new Error('Failed to delete category')
		}
	}
}

// eslint-disable-next-line
const CategoryModelInstance: ICategoryModel = CategoryModel
