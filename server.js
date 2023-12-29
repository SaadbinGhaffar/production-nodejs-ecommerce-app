import express from 'express'
import colors from 'colors'
import morgan from 'morgan'; //ye middleware ka kaam krta ha jb tk middle ware execute nahi hogi aagy kaam ni karega
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'


import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary'

import Stripe from 'stripe';


//route



//dotenv Config -->> make sure to place it below the import otherwise it will not work
dotenv.config(); 

//DB connection

connectDB();

//STRIPE CONFIGURATION
export  const stripe=new Stripe(process.env.STRIPE_API_SECRET)//exporting it so we can use it in orderController

//CLOUDINARY CONFIG

cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})

const app=express();//app k ander express ki saari functionality enable hojayegi


//MiddleWare
app.use(helmet())//to secure the header
app.use(mongoSanitize())
app.use(morgan('dev'));
app.use(express.json()) //Client side se data receive krny k liye
app.use(cors());
app.use(cookieParser())

//Routes
import userRoutes from './routes/userRoutes.js'
import testRoutes from './routes/testRoutes.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import orderRoutes from './routes/orderRoutes.js'


app.use('/api/v1',testRoutes)//(,Route File Name)
app.use('/api/v1/user',userRoutes)//(,Route File Name)
app.use('/api/v1/product',productRoutes)
app.use('/api/v1/category',categoryRoutes)
app.use('/api/v1/order',orderRoutes)


app.get('/',(req,res)=>{
    res.status(200).send('welcome bitch')
})//req-> user hamein  provide karega --res->ham user ko kia response dengy 



const PORT=process.env.PORT || 8080;


app.listen(PORT,()=>{
    console.log(`Server Running on ${PORT} on ${process.env.NODE_ENV} mode`.bgCyan.white)
})