import { Category } from '@/features/category/schema'

export interface ICategoryModel {
	getCategories({ userId }: { userId: number }): Promise<Category[]>
	getCategory({
		categoryId,
		userId
	}: {
		categoryId: string
		userId: number
	}): Promise<Pick<Category, 'id' | 'name'> | undefined>
	createCategory({
		userId,
		name
	}: {
		userId: number
		name: string
	}): Promise<Category>
	deleteCategories({
		userId,
		categoryIds
	}: {
		userId: number
		categoryIds: string[]
	}): Promise<Pick<Category, 'id'>[]>
	editCategoryName({
		categoryId,
		userId,
		name
	}: {
		categoryId: string
		userId: number
		name: string
	}): Promise<Category>
	deleteCategory({
		userId,
		categoryId
	}: {
		userId: number
		categoryId: string
	}): Promise<Pick<Category, 'id'> | undefined>
}
