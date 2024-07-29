import { Router } from 'express'
import * as TasksController from '../controllers/task'

const taskRouter = Router()
const taskRoutes = (baseRouter: Router) => {
	baseRouter.use('/task', taskRouter)

    baseRouter.get('/getTask', TasksController.getTask)
}

export default taskRoutes
