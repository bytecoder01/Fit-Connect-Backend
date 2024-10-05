import express from "express";
import { createPost, deletePost, getPost, getTimelinePosts, likePost, updatePost } from "../Controllers/PostController.js";

const postRouter = express.Router();

postRouter.post('/', createPost)
postRouter.get('/:id', getPost)
postRouter.put('/:id', updatePost)
postRouter.delete('/:id', deletePost)
postRouter.put('/:id/like', likePost)
postRouter.get('/:id/timeline', getTimelinePosts)
export default postRouter;