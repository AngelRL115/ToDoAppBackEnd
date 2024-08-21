import { Request, response, Response } from 'express'
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
				User_idUser: user.userid,
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
				User_idUser: user.userid,
				Status_idStatus: 1, //Estado de tarea completado
			},
		})
		const totalTaskCount = await prisma.task.count()

		if (totalTaskCount === 0) {
			//no hay tareas en absolto
			responseStatus = StatusCodes.NOT_FOUND
			responseContent = { message: 'no tasks found' }
			return res.status(responseStatus).send(responseContent)
		}

		if (tasks.length === 0) {
			//no hay tareas completadas
			responseContent = { message: 'No completed tasks found' }
		} else {
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

export const createTask = async (req: Request, res: Response) => {
	const user = req.user as JwtPayloadExtended
	let responseStatus = StatusCodes.OK
	let responseContent

	try {
		const { title, description } = req.body
		if (!title || title == '') {
			responseStatus = StatusCodes.BAD_REQUEST
			responseContent = { error: 'A title should be provided' }
			return res.status(responseStatus).send(responseContent)
		}
		if (!description || description == '') {
			responseStatus = StatusCodes.BAD_REQUEST
			responseContent = { error: 'A description should be provided' }
			return res.status(responseStatus).send(responseContent)
		}


		const newTaskCreated = await prisma.task.create({
			data: {
				User_idUser: user.userid,
				Title: title,
				Description: description,
				Status_idStatus: 2,
			},
		})

		if (!newTaskCreated) {
			responseStatus = StatusCodes.BAD_GATEWAY
			responseContent = { error: 'Task cannot be created' }
			console.error(newTaskCreated)
			return res.status(responseStatus).send(responseContent)
		}
		responseContent = newTaskCreated
	} catch (error) {
		responseStatus = StatusCodes.INTERNAL_SERVER_ERROR
		responseContent = { error: `[POST] taskController/createTask error: ${error}` }
		console.error(error)
		return res.status(responseStatus).send(responseContent)
	}

	res.status(responseStatus).send(responseContent)
}

export const updateTask = async (req: Request, res: Response) => {
	const user = req.user as JwtPayloadExtended
	let responseStatus = StatusCodes.OK
	let responseContent

	try {
		const { idTask, title, description } = req.body

		const taskOwner = await prisma.task.findUnique({
			where: { idTask: idTask },
			select: {
				User_idUser: true,
			},
		})

		if (taskOwner?.User_idUser != user.userid) {
			responseStatus = StatusCodes.UNAUTHORIZED
			responseContent = { error: 'This task does not belong to the current user' }
			return res.status(responseStatus).send(responseContent)
		}
		if (!title || title == '') {
			responseStatus = StatusCodes.BAD_REQUEST
			responseContent = { error: 'A title should be provided, the update cannot proceed' }
			return res.status(responseStatus).send(responseContent)
		}
		if (!description || description == '') {
			responseStatus = StatusCodes.BAD_REQUEST
			responseContent = { error: 'A description should be provided, the update cannot proceed' }
			return res.status(responseStatus).send(responseContent)
		}

		const taskUpdated = await prisma.task.update({
			where: { idTask: idTask },
			data: {
				Title: title,
				Description: description,
			},
		})
		if (!taskUpdated) {
			responseStatus = StatusCodes.BAD_GATEWAY
			responseContent = { error: 'Task cannot be updated' }
			console.error(taskUpdated)
			return res.status(responseStatus).send(responseContent)
		}
		responseContent = taskUpdated
	} catch (error) {
		responseStatus = StatusCodes.INTERNAL_SERVER_ERROR
		responseContent = { error: `[POST] taskController/updateTask error: ${error}` }
		console.error(error)
		return res.status(responseStatus).send(responseContent)
	}
	res.status(responseStatus).send(responseContent)
}

//Fata hacer la funcion para el check y el uncheck dependiendo si la task ya fue finalizada o no

export const deleteTask = async (req: Request, res: Response) => {
	const user = req.user as JwtPayloadExtended
	let responseStatus = StatusCodes.OK
	let responseContent

	try {
		const { idTask } = req.body
		const taskOwner = await prisma.task.findUnique({
			where: { idTask: idTask },
			select: {
				User_idUser: true,
			},
		})

		if (taskOwner?.User_idUser != user.userid) {
			responseStatus = StatusCodes.UNAUTHORIZED
			responseContent = { error: 'This task does not belong to the current user' }
			return res.status(responseStatus).send(responseContent)
		}

		const taskDeleted = await prisma.task.delete({ where: { idTask: idTask } })

		if (!taskDeleted) {
			responseStatus = StatusCodes.BAD_REQUEST
			responseContent = { error: 'Task cannot be deleted' }
			console.error(taskDeleted)
			return res.status(responseStatus).send(responseContent)
		}

		responseContent = taskDeleted
	} catch (error) {
		responseStatus = StatusCodes.INTERNAL_SERVER_ERROR
		responseContent = { error: `[POST] taskController/deleteTask error: ${error}` }
		console.error(error)
		return res.status(responseStatus).send(responseContent)
	}
	res.status(responseStatus).send(responseContent)
}
