/*  controllers/user.controller.ts 
in this controller are methods to

- get user profile information
- update user profile information (name, lastname, email)
- update user password (oldPassword, newPassword)

*/

import { Request, Response } from 'express'
import prisma from '../prisma/prisma'
import { JwtPayloadExtended } from '../express'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'

export const getUserProfile = async (req: Request, res: Response) => {
	const user = req.user as JwtPayloadExtended
	let responseContent
	let responseStatus = StatusCodes.OK

	try {
		const userProfile = await prisma.user.findUnique({
			where: { idUser: user.userid },
			select: {
				idUser: true,
				Name: true,
				Username: true,
				Email: true,
			},
		})

		if (!userProfile) {
			responseStatus = StatusCodes.NOT_FOUND
			responseContent = { error: 'User not found' }
			return res.status(responseStatus).send(responseContent)
		}
		responseContent = userProfile
	} catch (error) {
		responseStatus = StatusCodes.INTERNAL_SERVER_ERROR
		responseContent = { error: error }
		console.error(`[GET] userController/getUserProfile error: ${error}`)
		return res.status(responseStatus).send(responseContent)
	}

	res.status(responseStatus).send(responseContent)
}

export const setNewPassword = async (req: Request, res: Response) => {
	const user = req.user as JwtPayloadExtended
	let responseStatus = StatusCodes.OK
	let responseContent
	const { oldPassword, newPassword } = req.body

	try {
		const currentUser = await prisma.user.findUnique({ where: { idUser: user.userid } })

		if (!currentUser || !currentUser.Password) {
			responseStatus = StatusCodes.BAD_REQUEST
			responseContent = { error: 'User not found or password is missing' }
			return res.status(responseStatus).send(responseContent)
		}

		const isPasswordMatch = await bcrypt.compare(oldPassword, currentUser.Password)

		if (!isPasswordMatch) {
			responseStatus = StatusCodes.BAD_REQUEST
			responseContent = { error: 'Old password is incorrect' }
			return res.status(responseStatus).send(responseContent)
		}

		const isNewPasswordSameAsOld = await bcrypt.compare(newPassword, currentUser.Password)

		if (isNewPasswordSameAsOld) {
			responseStatus = StatusCodes.CONFLICT
			responseContent = { error: 'New Password cannot be the same as the old password' }
			return res.status(responseStatus).send(responseContent)
		}

		const hashedNewPassword = await bcrypt.hash(newPassword, 10)
		await prisma.user.update({
			where: { idUser: user.userid },
			data: { Password: hashedNewPassword },
		})

		responseContent = { message: 'Password updated successfully' }
	} catch (error) {
		console.error(`[GET] userController/setNewPassword error: ${error}`)
		responseStatus = StatusCodes.INTERNAL_SERVER_ERROR
		responseContent = { error: 'Something went wrong' }
		return res.status(responseStatus).send(responseContent)
	}

	return res.status(responseStatus).send(responseContent)
}
