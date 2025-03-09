import { Router } from 'express'
import { UserController } from '@/features/user/controller'
import { IUserModel } from '@/features/user/types'

export const createUserRouter = ({ userModel }: { userModel: IUserModel }) => {
	const userRouter = Router()

	const userController = new UserController({ userModel })

	userRouter.post('/register', userController.register)
	userRouter.post('/login', userController.login)

	return userRouter
}
