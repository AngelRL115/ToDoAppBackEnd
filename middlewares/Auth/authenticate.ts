import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JwtPayloadExtended } from '../../express'
import prisma from '../../prisma/prisma'
import * as dotenv from 'dotenv'

dotenv.config()

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers['authorization']
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ error: 'No token provided' })
	}

	const token = authHeader.split(' ')[1]

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayloadExtended

		const user = await prisma.user.findUnique({ where: { idUser: decoded.userid } })
		if (!user) {
			return res.status(401).json({ error: 'Unauthorized: User not found' })
		}

		// Guardamos el usuario completo en req.user por si se necesita en otras rutas
		req.user = { userid: decoded.userid } as JwtPayloadExtended
		next()
	} catch (error) {
		console.error(`[AUTH] Invalid token:
			 ${error}`)
		return res.status(401).json({ error: 'Unauthorized: Invalid token', message: error })
	}
}

export default authenticate
