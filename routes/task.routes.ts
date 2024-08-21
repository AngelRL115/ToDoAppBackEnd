import { Router } from 'express'
import * as TaskController from '../controllers/task.controller'
import authenticate from '../middlewares/Auth/authenticate'

const taskRouter = Router()
const taskRoutes = (baseRouter: Router) => {
	baseRouter.use('/task', taskRouter)
    
	taskRouter.use('', authenticate)

	taskRouter.post('/createTask', TaskController.createTask)
}

export default taskRoutes
