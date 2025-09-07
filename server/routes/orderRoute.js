import express from 'express';
import { getAllOrders, getUserOrders, placeOrderCod, placeOrderStripe } from '../controllers/orderController.js';
import authuser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

orderRouter.post('/cod', authuser , placeOrderCod);
orderRouter.post('/stripe', authuser , placeOrderStripe);
orderRouter.get('/user', authuser , getUserOrders);
orderRouter.get('/seller', authSeller , getAllOrders);


export default orderRouter;