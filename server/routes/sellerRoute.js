import express from "express"
import { isauth, login, logout } from "../controllers/SellerController.js"
import authSeller from "../middlewares/authSeller.js"

const sellerRouter = express.Router();

sellerRouter.post('/login',login)
sellerRouter.get('/isauth',authSeller,isauth)
sellerRouter.get('/logout',authSeller,logout)

export default sellerRouter;