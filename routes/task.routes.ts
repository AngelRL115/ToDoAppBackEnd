import { Router } from 'express'
import * as TaskController from '../controllers/task.controller'
import authenticate from '../middlewares/Auth/authenticate'

const taskRouter = Router()
const taskRoutes = (baseRouter: Router) => {
	baseRouter.use('/task', taskRouter)
    
	taskRouter.use('', authenticate)

	taskRouter.get('/getPendingTasks', TaskController.getPendingTasks)
	taskRouter.get('/getCompletedTasks', TaskController.getCompletedTasks)
	taskRouter.post('/createTask', TaskController.createTask)
	taskRouter.put('/updateTask', TaskController.updateTask)
	taskRouter.put('/checkTask', TaskController.checkTask)
	taskRouter.put('/uncheckTask', TaskController.uncheckTask)
	taskRouter.delete('/deleteTask',TaskController.deleteTask)
}

export default taskRoutes
