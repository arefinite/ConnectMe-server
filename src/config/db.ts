import asyncHandler from 'express-async-handler'
import { connect } from 'mongoose'
import { config } from './config'

export const dbConnect = async () => {
  try {
    await connect(config.DB_URI as string)
    console.log('Database connected successfully')
  } catch (err) {
    console.log('Database connection error:', err)
    process.exit(1)
  }
}
