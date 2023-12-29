import express from 'express';
import { createProductController, deleteProductController, deleteProductImageController, getAllProductsController, getSingleProductController, getTopProductController, productReviewController, updateProductController, updateProductImageController } from '../controllers/productController.js';
import { isAdmin, isAuth } from '../middlewares/authMiddleware.js';
import { singleUpload } from '../middlewares/multer.js';

const router=express.Router();

//Routes
//GETTING ALL PRODUCTS

router.get('/get-all',getAllProductsController)

router.get('/get-top-products',getTopProductController)

router.get('/get-single/:id',getSingleProductController)

router.post('/create-product',isAuth,singleUpload,isAdmin, createProductController)

router.put('/update-product/:id',isAuth,isAdmin,updateProductController)

router.put('/update-product-image/:id',isAuth,singleUpload,isAdmin,updateProductImageController)

//Delete Product Image
router.delete('/delete-product-image/:id',isAuth,deleteProductImageController)

//DELETE PRODUCT
router.delete('/delete-product/:id',isAuth,deleteProductController)


//Review Product

router.put('/review/:id',isAuth,productReviewController)
export default router;