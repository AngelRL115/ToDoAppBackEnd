/*  controllers/auth.controller.ts 
in this controller are methods to

- register new user
- login

*/

import { Request, response, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../prisma/prisma'
import { StatusCodes } from 'http-status-codes'
import * as dotenv from 'dotenv'


dotenv.config()

export const registerUser = async (req: Request, res: Response) => {
	const { name, username, email, password } = req.body
	let responseContent
	let responseStatus = StatusCodes.OK

	try {
		if (!name || !username || !email || !password) {
			responseStatus = StatusCodes.BAD_REQUEST
			responseContent = { error: 'All fields are required' }
			return res.status(responseStatus).send(responseContent)
		}

		const existingEmail = await prisma.user.findFirst({ where: { Email: email } })
		const existingUsername = await prisma.user.findFirst({ where: { Username: username } })
        
        if(existingEmail){
            responseStatus = StatusCodes.BAD_REQUEST
            responseContent = {error: 'Email already assign to an account'}
            return res.status(responseStatus).send(responseContent)
        }
        if(existingUsername){
            responseStatus = StatusCodes.BAD_REQUEST
            responseContent = {error:'Username already taken'}
            return res.status(responseStatus).send(responseContent)
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({
            data:{
                Name: name,
                Username: username,
                Email: email,
                Password: hashedPassword
            },
        })
        const token = jwt.sign({userid: newUser.idUser}, process.env.JWT_SECRET as string, {expiresIn: '1h'})
        responseContent = {token}
	} catch (error) {
        console.error(`[POST] authConstroller/registerUser error: ${error}`)
        responseStatus = StatusCodes.INTERNAL_SERVER_ERROR
        responseContent = { error: error}
        return res.status(responseStatus).send(responseContent)
    }

    res.status(responseStatus).send(responseContent)
}

export const login = async (req: Request, res: Response) => {
    const { credential, password} = req.body
    let responseStatus = StatusCodes.OK
    let responseContent

    try {
        const credentialToLogin = await prisma.user.findFirst({
            where:{
                OR: [{ Email: credential}, {Username: credential}],
            },
        })
        if(!credentialToLogin){
            responseStatus = StatusCodes.OK
            responseContent = {error: 'There is no account associated to this username or email'}
            return res.status(responseStatus).send(responseContent)
        }
        if(!credentialToLogin.Password){
            responseStatus = StatusCodes.BAD_REQUEST
            responseContent = {error: 'Password is missing for this user'}
            return res.status(responseStatus).send(responseContent)
        }

        const isValidPassword = await bcrypt.compare(password, credentialToLogin.Password)
        
        if(!isValidPassword){
            responseStatus = StatusCodes.UNAUTHORIZED
            responseContent = {error: 'Invalid credentials'}
            return res.status(responseStatus).send(responseContent)
        }

        const token = jwt.sign({userid: credentialToLogin.idUser}, process.env.JWT_SECRET as string, {expiresIn: '30d'})
        responseContent = {token, credentialToLogin}
    } catch (error) {
        console.error(`[POST] authController/loging error: ${error}`)
        responseStatus = StatusCodes.INTERNAL_SERVER_ERROR
        responseContent = {error: error}
        return res.status(responseStatus).send(responseContent)
    }
    
    res.status(responseStatus).send(responseContent)
}
