import { Request, Response } from 'express'
import prisma from '../prisma/prisma'
import { JwtPayloadExtended } from '../express'
import { StatusCodes } from 'http-status-codes'

export const getPendingTasks = async (req: Request, res: Response) => {
	const user = req.user as JwtPayloadExtended
	let responseStatus = StatusCodes.OK
	let responseContent

	try {
		const totalTaskCount = await prisma.task.count()

		if (totalTaskCount === 0) {
			// No hay tareas en absoluto
			responseStatus = StatusCodes.NOT_FOUND
			responseContent = { message: 'No tasks found' }
			return res.status(responseStatus).send(responseContent)
		}

		// Busca tareas pendientes
		const tasks = await prisma.task.findMany({
			where: {
				User_idUser: user.userId,
				Status_idStatus: 2, // Estado de tarea pendiente
			},
		})

		if (tasks.length === 0) {
			// No hay tareas pendientes
			responseContent = { message: 'No pending tasks found' }
		} else {
			// Se encontraron tareas pendientes
			responseContent = tasks
		}
	} catch (error) {
		responseStatus = StatusCodes.INTERNAL_SERVER_ERROR
		responseContent = { error: 'Internal server error' }
		console.error(`[GET] taskController/getPendingTasks error: ${error}`)
	}

	return res.status(responseStatus).send(responseContent)
}

export const getCompletedTasks = async (req: Request, res: Response) => {
	const user = req.user as JwtPayloadExtended
	let responseStatus = StatusCodes.OK
	let responseContent

	try {
		const tasks = await prisma.task.findMany({
			where: {
				User_idUser: user.userId,
				Status_idStatus: 1, //Estado de tarea completado
			},
		})
        const totalTaskCount = await prisma.task.count()

        if(totalTaskCount === 0){
            //no hay tareas en absolto
            responseStatus = StatusCodes.NOT_FOUND
            responseContent = {message: 'no tasks found'}
            return res.status(responseStatus).send(responseContent)
        }

        if(tasks.length === 0 ){
            //no hay tareas completadas
            responseContent = {message: 'No completed tasks found'}
        }else{
            //se encontraron tareas completadas
            responseContent = tasks
        }
	} catch (error) {
        responseStatus = StatusCodes.INTERNAL_SERVER_ERROR
		responseContent = { error: 'Internal server error' }
		console.error(`[GET] taskController/getCompletedTasks error: ${error}`)
    }
    
    res.status(responseStatus).send(responseContent)
}
