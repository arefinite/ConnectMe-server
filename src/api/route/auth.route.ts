import { verifyToken } from './../middleware/verifyToken'
import { signInValidator, signUpValidator } from './../validator/auth.validator'
import { Router } from 'express'
import {
  getCurrentUser,
  SignIn,
  SignOut,
  SignUp,
  validateUser,
} from '../controller/auth.controller'

export const authRouter = Router()

authRouter.post('/sign-in', signInValidator, SignIn)
authRouter.post('/sign-up', signUpValidator, SignUp)
authRouter.post('/sign-out', SignOut)
authRouter.get('/validate-user', verifyToken, validateUser)
authRouter.get('/get-current-user', verifyToken, getCurrentUser)
