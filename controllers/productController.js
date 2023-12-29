//Get All Products
import cloudinary from "cloudinary";
import productModel from "../models/productModel.js";
import { getDataUri } from "../utils/Features.js";

export const getAllProductsController = async (req, res) => {
  try {
    const {keyword,category}=req.query
    const products = await productModel.find({
      name:{//finding on the basis of keyword
        $regex:keyword ? keyword :"",//keyword ha to keyword show kro  warna empty string sow krwsao
        $options:"i",
      },
      
    }); //simply object pass krwa deny ka matlb ha k sab kuch isme find hojayega
    res.status(200).send({
      success: true,
      message: "All Products Fetched Successfully",
      totalProducts:products.length,
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "ERROR IN GET_ALL_PRODUCTS API",
    });
  }
};

//Get Top Products controller

export const getTopProductController=async(req,res)=>{
  try {
    const products =await productModel.find({}).sort({rating:-1}).limit(3)  //-1 indicates show the top products

    res.status(200).send({
      success: true,
      message: "Top 3 Proucts",
      products
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "ERROR IN GET_TOP_PRODUCTS API",
      error
    });
  }
}



export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id); //URL ma params ma se ID ko get kr rahy hein
    if (!product) {
      res.status(404).send({
        success: false,
        message: "Product Not Found",
      });
    }
    res.status(200).send({
      success: true,
      message: " Product Found",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "ERROR IN GET_SINGLE_PRODUCT API",
    });
  }
};

//CREATE PRODUCT CONTROLLER
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    //VALIDATION
    // if(!name|| !description || !price || !category || !stock)
    // {
    // return    res.status(500).send({
    //         success:false,
    //         message:"Tujhny nahi kaha saari fields dall"
    //     })
    // }
    if (!req.file) {
      return res.status(500).send({
        success: false,
        message: "Please Provide Product Imagess",
      });
    }

    const file = getDataUri(req.file);

    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    await productModel.create({
      name,
      description,
      price,
      category,
      stock,
      images: [image],
    });

    res.status(201).send({
      success: true,
      message: "Mubarkaaaaan Product Bannn gya ",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "ERROR IN CREATE_PRODUCT API",
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product Not Found",
      });
    }

    const { name, description, price, stock, category } = req.body;

    //Validate and Update
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.napriceme = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();
    res.status(200).send({
      success: true,
      message: "Product Updated",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "ERROR IN UPDATE_PRODUCT API",
    });
  }
};

export const updateProductImageController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product Not Found",
      });
    }

    //Check File
    if (!req.file) {
      return res.status(404).send({
        success: false,
        message: "Product Image Not Found",
      });
    }

    const file = getDataUri(req.file); //req.file ka saara content ly lo
    const cdb = await cloudinary.v2.uploader.upload(file.content); //File ka jo b content h usko upload krdo
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    //SAVE
    product.images.push(image);
    await product.save();
    res.status(200).send({
      success: true,
      message: "Image Updated Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "ERROR IN UPDATE_PRODUCT_IMAGE API",
    });
  }
};

//DELETE PRODUCT IMAGE
export const deleteProductImageController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    //VALIDATE PRODUCT
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product Image OT FOUND",
      });
    }

    //Find Image ID
    const id = req.query.id;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Image ID Not Found",
      });
    }

    let isExits = -1;
    product.images.forEach((item, index) => {
      if (item._id.toString() === id.toString()) isExits = index;
    });
    if (isExits < 0) {
      res.status(404).send({
        success: false,
        message: "Image ID Not Found",
      });
    }

    //DELETE PRODUCT IMAGE
    await cloudinary.v2.uploader.destroy(product.images[isExits].public_id); //jo index hoga wo get hoga isExists k through aur phir us us index ki public id ko delete kr dengy
    
    product.images.splice(isExits,1)//it is used to remove the image from the database
    await product.save()
   return res.status(200).send({
        success: true,
        message: "Product Image Deleted Successfully",
      });

} catch (error) {
    res.status(500).send({
      success: false,
      message: "ERROR IN DELETE_PRODUCT_IMAGE API",
    });
  }
};


//Delete Product Controller

export const deleteProductController=async(req,res)=>{
  try {
    const product=await productModel.findById(req.params.id)
    if(!product)
    {
      return  res.status(404).send({
        success: false,
        message: "Product Not Found",
      });
    }
    //Find and delete image from cloudinary
    for(let i=0;i<product.images.length;i++)
    {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }
    await product.deleteOne();
    res.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "ERROR IN DELETE_PRODUCT API",
    });
  }
}


//Create Product review and comment
export const productReviewController=async(req,res)=>{
  try {
    const {comment,rating}=req.body
    //Finding Product
    const product=await productModel.findById(req.params.id)
    //Check Previou Review
    const alreadyReviewed=product.review.find(r=>r.user.toString()===req.user._id.toString())
    if(alreadyReviewed){
    return  res.status(400).send({
        success: false,
        message: "Already Reviewed",
      });
    }
    //Creating new review
    const newReview={
      name:req.user.name,
      rating:Number(rating),
      comment,
      user:req.user._id

    }
    //passing review object to review array  
    product.review.push(newReview)
    //no. of review
    product.numReviews=product.review.length
    product.rating=product.review.reduce((acc,item)=>item.rating + acc,0  )/product.review.length   //it will calculate overall prouct rating based on  all user rating
    //save
    await product.save()
    res.status(200).send({
      success:true,
      message:"Review Added"
    })


  } catch (error) {
    res.status(500).send({
      success: false,
      message: "ERROR IN Review_Comment API",
    });
  }
}