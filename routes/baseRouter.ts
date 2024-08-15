import express from 'express'
import taskRoutes from './task.routes'
import authRoutes from './auth.routes'

const baseRouter = express.Router()
taskRoutes(baseRouter)
authRoutes(baseRouter)
export default baseRouter
