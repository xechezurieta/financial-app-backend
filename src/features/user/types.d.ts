import { PublicUserInfo } from '@/db/schema'

export interface IUserModel {
	create({
		email,
		password
	}: {
		email: string
		password: string
	}): Promise<PublicUserInfo>

	login({
		email,
		password
	}: {
		email: string
		password: string
	}): Promise<PublicUserInfo>
}
