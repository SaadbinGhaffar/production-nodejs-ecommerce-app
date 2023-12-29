import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";

export const createCategoryController = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category Field is Required",
      });
    }
    await categoryModel.create({ category });
    res.status(201).send({
      success: true,
      message: "Category Created",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "ERROR IN Create Category  API",
    });
  }
};

export const getAllCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({}); //{}->-> means get all categories
    res.status(200).send({
      success: true,
      message: "All Categories Fetched Successfully",
      Total: category.length,
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "ERROR IN Get All Category  API",
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category Not Found",
      });
    }
    //Find Product with this category id
    const products = await productModel.find({ category: category._id });

    //Update Product Category

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = undefined;
      await product.save();
    }

    await category.deleteOne();

    res.status(200).send({
      success: true,
      message: `${category.category}   Deleted SuccessFully`,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "ERROR IN Delete Category  API",
    });
  }
};


export const updateCategoryController=async(req,res)=>{
    try {
        const category = await categoryModel.findById(req.params.id);
        if (!category) {
          return res.status(404).send({
            success: false,
            message: "Category Not Found",
          });
        }
        //Get New Category
        const {updatedCategory}=req.body
        //Find Product with this category id
        const products = await productModel.find({ category: category._id });
    
        //Update Product Category
    
        for (let i = 0; i < products.length; i++) {
          const product = products[i];
          product.category = updatedCategory;
          await product.save();
        }
        
        if(updatedCategory) category.category=updatedCategory

        await category.save();
    
        res.status(200).send({
          success: true,
          message: `Category  Updated   SuccessFully`,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: "ERROR IN Update Category  API",
        });
      }
}