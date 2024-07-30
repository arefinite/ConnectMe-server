import { NextFunction, Request, Response } from 'express';
import  asyncHandler  from 'express-async-handler';

// @desc    Create a new post
export const createPost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: 'Post created' })
})
 
// @desc    update a post
export const updatePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Post updated' })
})

// @desc    Delete a post
export const deletePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Post deleted' })
})

// @desc    like a post
export const likePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Post liked' })
})

// @desc    comment on a post
export const commentOnPost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Comment added' })
})