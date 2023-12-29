import express from 'express';
import { isAdmin, isAuth } from '../middlewares/authMiddleware.js';
import { changeOrderStatusController, createOrderController, getAllOrdersController, getAllOrdersController_Admin, getSingleOrderInfo, paymentController } from '../controllers/orderController.js';


const router=express.Router();

//Routes
//Create Orderss

router.post('/create-order',isAuth,isAdmin,createOrderController)

//GET ALL ORDERS
router.get('/get-all-order',isAuth,isAdmin,getAllOrdersController)

//GET SIGLE ORDER
router.get('/get-single-order/:id',isAdmin,isAuth,getSingleOrderInfo)

//accept payment
router.post('/payments',isAuth,isAdmin,paymentController)


//==========ADMIN PART===============//
//GETTING ALL ORDERS
router.get('/admin/get-all-orders',isAuth,isAdmin,getAllOrdersController_Admin)

//CHANGE ORDER STATUS

router.put('/admin/order/:id',isAuth,isAdmin,changeOrderStatusController)

export default router;