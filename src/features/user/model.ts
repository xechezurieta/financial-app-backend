import { db } from '@/db/drizzle'
import { PublicUserInfo, usersTable } from '@/db/schema'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { IUserModel } from '@/features/user/types'

const SALT_ROUNDS = 10

export class UserModel {
	// TODO: validations
	static async create({
		email,
		password
	}: {
		email: string
		password: string
	}): Promise<PublicUserInfo> {
		try {
			const user = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.email, email))
			if (user.length > 0) {
				throw new Error('User already exists')
			}
			const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
			const [newUser] = await db
				.insert(usersTable)
				.values({
					email,
					passwordHash
				})
				.returning({
					id: usersTable.id,
					email: usersTable.email,
					role: usersTable.role
				})
			return newUser
		} catch (error) {
			console.error('Failed to create user in database', error)
			throw new Error('Failed to create user')
		}
	}

	static async login({
		email,
		password
	}: {
		email: string
		password: string
	}): Promise<PublicUserInfo> {
		try {
			const [user] = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.email, email))
			if (!user) {
				throw new Error('User not found')
			}
			const match = await bcrypt.compare(password, user.passwordHash)
			if (!match) {
				throw new Error('Invalid password')
			}
			const publicUserInfo: PublicUserInfo = {
				id: user.id,
				email: user.email,
				role: user.role
			}
			return publicUserInfo
		} catch (error) {
			console.error('Failed to login user', error)
			throw new Error('Failed to login user')
		}
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserModelInstance: IUserModel = UserModel
