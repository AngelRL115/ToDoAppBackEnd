import { Router } from 'express'
import * as TasksController from '../controllers/task.controller'

const taskRouter = Router()
const taskRoutes = (baseRouter: Router) => {
	baseRouter.use('/task', taskRouter)

    baseRouter.get('/getPendingTasks', TasksController.getPendingTasks)
    baseRouter.get('/getCompletedTasks', TasksController.getCompletedTasks)
}

export default taskRoutes
