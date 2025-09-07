import express from 'express';
import { isauth, login, register ,logout } from '../controllers/UserController.js';
import authuser from '../middlewares/authUser.js';

const userRouter = express.Router();


userRouter.post('/register',register)
userRouter.post('/login',login)
userRouter.get('/isauth', authuser,isauth)
userRouter.get('/logout', authuser, logout)

export default userRouter;