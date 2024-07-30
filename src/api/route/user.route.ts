import { Router } from 'express'
import { verifyToken } from '../middleware/verifyToken'
import {
  deleteProfile,
  followUnfollow,
  profile,
  suggestedUsers,
  updateProfile,
} from '../controller/user.controller'

export const userRouter = Router()

userRouter.get('/profile/:email', verifyToken, profile)
userRouter.get('/suggested-users', verifyToken, suggestedUsers)
userRouter.post('/follow-unfollow/:userId', verifyToken, followUnfollow)
userRouter.patch('/update-profile', verifyToken, updateProfile)
userRouter.delete('/delete-profile', verifyToken, deleteProfile)
