import express from 'express';
import { addAddress,getAddress } from '../controllers/addressController.js';
import authuser from '../middlewares/authUser.js';

const addressRouter = express.Router();

addressRouter.post('/addaddress',authuser,addAddress)
addressRouter.get('/getaddress',authuser,getAddress)

export default addressRouter;