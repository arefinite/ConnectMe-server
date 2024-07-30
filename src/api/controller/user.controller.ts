import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import asyncHandler from 'express-async-handler'
import { Types } from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '../model/user.model'
import { Notification } from '../model/notification.model'
import cloudinary from '../../config/cloudinary'

// @desc    Get user profile
export const profile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.params
    const user = await User.findOne({ email }).select('-password')
    if (!user) return next(createHttpError(404, 'User not found'))
    res.status(200).json(user)
  }
)

// @desc    Update user profile
export const updateProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId
    const { fullName, email, info, currentPassword, newPassword, link } =
      req.body
    let { profileImg, coverImg } = req.body

    // Check for existence of newPassword and currentPassword before proceeding
    if (!newPassword || !currentPassword) {
      return next(
        createHttpError(400, 'Please enter current password and new password')
      )
    }

    let user = await User.findById(userId)
    if (!user) {
      return next(createHttpError(404, 'User not found'))
    }
    // match the current password
    const isMatched = await bcrypt.compare(currentPassword, user.password)
    if (!isMatched) {
      return next(createHttpError(400, 'Current password is incorrect'))
    }

    if (newPassword.length < 6) {
      return next(
        createHttpError(400, 'Password must be at least 6 characters')
      )
    }

    user.password = await bcrypt.hash(newPassword, 10)
    if (profileImg) {
      // Delete existing profile image from cloudinary
      if (user.profileImg) {
        const publicId = user.profileImg.split('/').pop()?.split('.')[0]
        if (publicId) {
          await cloudinary.uploader.destroy(publicId)
        }
      }
      // Upload profile image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(profileImg)
      profileImg = uploadResponse.secure_url
    }

    if (coverImg) {
      // Delete existing cover image from cloudinary
      if (user.coverImg) {
        const publicId = user.coverImg.split('/').pop()?.split('.')[0]
        if (publicId) {
          await cloudinary.uploader.destroy(publicId)
        }
      }
      // Upload cover image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(coverImg)
      coverImg = uploadResponse.secure_url
    }
    // Update user profile
    user.fullName = fullName || user.fullName
    user.email = email || user.email
    user.info = info || user.info
    user.link = link || user.link
    user.profileImg = profileImg || user.profileImg
    user.coverImg = coverImg || user.coverImg

    user = await user.save()

    // Ensure password is not returned in the response
    const { password, ...userWithoutPassword } = user.toObject()

    res.status(200).json(userWithoutPassword)
  }
)

// @desc    Delete user profile
export const deleteProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId
    const user = await User.findById(userId)
    if (!user) return next(createHttpError(404, 'User not found'))
    if (userId !== user._id.toString())
      return next(
        createHttpError(
          401,
          'Unauthorized! You can only delete your own account'
        )
      )
    // Delete user profile image from cloudinary
    if (user.profileImg) {
      const publicId = user.profileImg.split('/').pop()?.split('.')[0]
      if (publicId) {
        await cloudinary.uploader.destroy(publicId)
      }
    }
    // Delete user cover image from cloudinary
    if (user.coverImg) {
      const publicId = user.coverImg.split('/').pop()?.split('.')[0]
      if (publicId) {
        await cloudinary.uploader.destroy(publicId)
      }
    }
    await User.findByIdAndDelete(userId)
    res.clearCookie('auth-token')
    res.json({ message: 'User deleted' })
  }
)

// @desc    suggested users
export const suggestedUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = new Types.ObjectId(req.userId)
    //get users that current user is following
    const currentUserFollowing = await User.findById(userId).select('following')
    //get 20 random users except current user
    const users = await User.aggregate([
      { $match: { _id: { $ne: userId } } },
      { $sample: { size: 20 } },
    ])
    //filter users that current user is following
    const filteredUsers = users.filter(
      user => !currentUserFollowing?.following.includes(user._id.toString())
    )
    //get 5 users
    const suggestedUsers = filteredUsers.slice(0, 5)
    //remove password field
    suggestedUsers.forEach(user => (user.password = null))
    res.status(200).json(suggestedUsers)
  }
)

// @desc    follow-unfollow user
export const followUnfollow = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params
    const currentUser = await User.findById(req.userId)
    const userToFollowUnfollow = await User.findById(userId)
    if (userId === req.userId.toString())
      return next(createHttpError(400, 'Cannot follow/unfollow yourself'))
    if (!userToFollowUnfollow || !currentUser)
      return next(createHttpError(404, 'User not found'))
    const isFollowing = currentUser.following.includes(userId.toString())
    if (isFollowing) {
      // unfollow user
      await User.findByIdAndUpdate(currentUser._id, {
        $pull: { following: userId },
      })
      await User.findByIdAndUpdate(userToFollowUnfollow._id, {
        $pull: { followers: req.userId },
      })
      res.json({ message: 'User unfollowed' })
    } else {
      // follow user
      await User.findByIdAndUpdate(currentUser._id, {
        $push: { following: userId },
      })
      await User.findByIdAndUpdate(userToFollowUnfollow._id, {
        $push: { followers: req.userId },
      })
      //send notification
      const newNotification = new Notification({
        type: 'follow',
        from: currentUser._id,
        to: userToFollowUnfollow._id,
      })
      await newNotification.save()
      res.json({ message: 'User followed' })
    }
  }
)
