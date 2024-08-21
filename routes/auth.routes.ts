import { Router } from 'express'
import * as AuthController from '../controllers/auth.controller'

const authRouter = Router()
const authRoutes = (baseRouter: Router) => {
	baseRouter.use('/auth', authRouter)

	authRouter.post('/registerUser', AuthController.registerUser)
	authRouter.post('/login', AuthController.login)
}

export default authRoutes
