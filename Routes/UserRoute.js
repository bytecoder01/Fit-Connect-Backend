import express from "express";
import { deleteUser, followUser, getAllUsers, getUser, unfollowUser, updateUser } from "../Controllers/UserController.js";

import authMiddleWare from "../Middleware/AuthMiddleware.js";

const userRouter = express.Router();

userRouter.get('/:id', getUser)
userRouter.get('/', getAllUsers)
userRouter.put('/:id',authMiddleWare, updateUser)
userRouter.put('/:id/follow',authMiddleWare,  followUser)
userRouter.put('/:id/unfollow',authMiddleWare,  unfollowUser)

userRouter.delete('/:id', authMiddleWare, deleteUser)

export default userRouter;