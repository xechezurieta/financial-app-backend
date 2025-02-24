import { Category } from '@/features/category/schema'

export interface ICategoryModel {
	getCategories({ userId }: { userId: string }): Promise<Category[]>
	getCategory({
		categoryId,
		userId
	}: {
		categoryId: string
		userId: string
	}): Promise<Pick<Category, 'id' | 'name'> | undefined>
	createCategory({
		userId,
		name
	}: {
		userId: string
		name: string
	}): Promise<Category>
	deleteCategories({
		userId,
		categoryIds
	}: {
		userId: string
		categoryIds: string[]
	}): Promise<Pick<Category, 'id'>[]>
	editCategoryName({
		categoryId,
		userId,
		name
	}: {
		categoryId: string
		userId: string
		name: string
	}): Promise<Category>
	deleteCategory({
		userId,
		categoryId
	}: {
		userId: string
		categoryId: string
	}): Promise<Pick<Category, 'id'> | undefined>
}
