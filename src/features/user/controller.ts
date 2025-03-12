import { Request, Response } from 'express'
import { IUserModel } from '@/features/user/types'
import jwt from 'jsonwebtoken'

export class UserController {
	private userModel: IUserModel

	constructor({ userModel }: { userModel: IUserModel }) {
		this.userModel = userModel
	}

	register = async (req: Request, res: Response) => {
		const { email, password } = req.body
		try {
			const user = await this.userModel.create({
				email,
				password
			})
			res.json({ user })
		} catch (error) {
			console.error('Failed to register user', error)
			res.status(500).send('Failed to register user')
		}
	}

	login = async (req: Request, res: Response) => {
		const { email, password } = req.body
		try {
			const user = await this.userModel.login({
				email,
				password
			})
			if (!process.env.JWT_SECRET) {
				throw new Error('SECRET is not defined')
			}
			const token = jwt.sign(
				{ id: user.id, email: user.email, role: user.role },
				process.env.JWT_SECRET,
				{ expiresIn: '24h' }
			)
			return res.json({ user, token })
		} catch (error) {
			console.error('Failed to login user', error)
			res.status(500).send('Failed to login user')
		}
	}
}
