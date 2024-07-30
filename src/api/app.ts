import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import path from 'node:path'
import { config } from '../config/config'
import { globalErrorHandler } from './middleware/globalErrorHandler'
import { authRouter } from './route/auth.route'
import cookieParser from 'cookie-parser'
import { userRouter } from './route/user.route'

export const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  cors({
    origin: config.FRONTEND_URL,
  })
)

if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.static(path.join(__dirname, '../../../client/dist')))

// Routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)

// Not found route
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'No route found' })
})

// Custom error logger
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(
    `Invalid field: ${err.fieldName} - Invalid value: ${err.value} - Error message: ${err.message} - Error name: ${err.name}`
  )
  next(err)
})

// Global error handler
app.use(globalErrorHandler)
