import express from 'express';
import { isAdmin, isAuth } from '../middlewares/authMiddleware.js';
import { createCategoryController, deleteCategoryController, getAllCategoryController, updateCategoryController } from '../controllers/categoryController.js';


const router=express.Router();

//Routes
//Create Category

router.post('/create-category',isAuth,isAdmin,createCategoryController)

router.get('/get-all-category',isAuth,getAllCategoryController)

router.delete('/delete-category/:id',isAuth,deleteCategoryController)

router.put('/update-category/:id',isAuth,isAdmin,updateCategoryController)


export default router;