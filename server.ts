import express from 'express'
import baseRouter from './routes/baseRouter'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import * as dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const logger = morgan('combined')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(cors())
app.use(logger)
app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))
app.disable('x-powered-by')

	
app.use('/Todo', baseRouter)

app.use((_req, res) => {
	res.status(404).send({ error: 'Invalid route' })
})

app.get('/', (_req, res) => {
	res.send('hola mundo')
})

app.listen(PORT, () => {
	console.log(`Server Running on port ${PORT}`)
})
