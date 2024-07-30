import { Router } from "express";
import { createPost } from "../controller/post.controller";


export const postRouter = Router()

postRouter.post('/create', createPost)
postRouter.put('/update/:id', createPost)
postRouter.delete('/delete/:id', createPost)
postRouter.put('/like/:id', createPost)
postRouter.put('/comment/:id', createPost)