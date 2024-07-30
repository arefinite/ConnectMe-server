import { NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import bcrypt from 'bcryptjs'
import { User } from '../model/user.model'
import { generateToken } from '../service/generateToken'

// @desc    Sign up a new user
export const SignUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //validation checks
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(createHttpError(400, { message: errors.array() }))
    }
    const { fullName, email, password } = req.body
    //check if user already exists
    const user = await User.findOne({ email })
    if (user)
      return next(createHttpError(400, { message: 'User already exists' }))
    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 10)
    //create a new user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    })
    if (!newUser)
      return next(createHttpError(400, { message: 'User not created' }))
    //generate token and store it in cookie
    generateToken(res, newUser._id.toString())
    //send response
    res.status(201).json({ message: 'User created successfully' })
  }
)

// @desc    Sign in a new user
export const SignIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //validation checks
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(createHttpError(400, { message: errors.array() }))
    }
    const { email, password } = req.body
    //check if user exists
    const user = await User.findOne({ email })
    if (!user)
      return next(createHttpError(400, { message: 'Wrong credentials' }))
    //check if password is correct
    const isMatchedPassword = await bcrypt.compare(password, user.password)
    if (!isMatchedPassword)
      return next(createHttpError(400, { message: 'Wrong credentials' }))
    //generate token and store it in cookie
    generateToken(res, user._id.toString())
    //send response
    res.status(200).json({ message: 'User signed in successfully' })
  }
)

// @desc    Sign out a user
export const SignOut = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //clear cookie
    res.clearCookie('auth-token')
    //send response
    res.status(200).json({ message: 'User signed out successfully' })
  }
)

// @desc    verify user
export const validateUser = asyncHandler(
  async (req: Request, res: Response) => {
    res.status(200).json({ userId: req.userId })
  }
)

// @desc    get current info
export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.userId
    const user = await User.findById(id).select('-password')
    if (!user) return next(createHttpError(404, 'User not found'))
    res.status(200).json(user)
  }
)
