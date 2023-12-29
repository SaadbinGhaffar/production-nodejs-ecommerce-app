import mongoose from "mongoose";

//Review Model
const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "name is required"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    comment:{
        type:String
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: [true, "user is required"],
    },
  },
  { timestamps: true }
);

//Product Model
const productSchem = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Product Name is required"],
    },
    description: {
      type: String,
      require: [true, "Product Description is required"],
    },
    price: {
      type: Number,
      require: [true, "Product Price is required"],
    },
    stock: {
      type: Number,
      require: [true, "Product Stock is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, //jese he product create hoga toh uske sath he product id aajayegi aur phir category sth bhi id aajayegi
      ref: "Categories",
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    review: [reviewSchema],
    rating:{
        type:Number,
        default:0,

    },
    numReviews:{
        type:Number,
        default:0
    }
  },
  { timestamps: true }
);

export const productModel = mongoose.model("Products", productSchem); //products k name se mongodb ma folder banega
export default productModel;
