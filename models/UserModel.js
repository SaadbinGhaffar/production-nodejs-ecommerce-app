import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import JWT from 'jsonwebtoken'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: [true, "Email Already Exists"],
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
      minLength: [6, "Password Should be 6 character Long"],
    },
    address: {
      type: String,
      required: [true, "Address is Required"],
    },
    city: {
      type: String,
      required: [true, "City is Required"],
    },
    country: {
      type: String,
      required: [true, "Country is Required"],
    },
    phone: {
      type: String,
      required: [true, "Phone Number is Required"],
    },
    profilePic: {
      public_id:{
        type: String,
      },
      url:{
        type: String,
      }
    },
    answer:{
      type: String,
      required: [true, "Answer is Required"],
    },
    role:{
      type:String,
      default:'user'
    }
  },
  { timestamps: true }
); //to catch time k kb knsa user bana ha

//PASSWORD HASHING-->> HASH FUNCTION

userSchema.pre('save',async function(next){//Save krny se phly kia krna chahty hein ye btana ha yahan pr
    if(!this.isModified('password')) return next();//Agr Password modify nahi hwa toh next jo kaam krna ha wo kroo
    this.password=await bcrypt.hash(this.password,10)
}) 

//COMPARE FUNCTION ->-> DECRYPTING USING COMPARE FUNCTION

userSchema.methods.comparePassword=async function(plainPassword){
return await bcrypt.compare(plainPassword,this.password)
}


//JSON WEB TOKEN

userSchema.methods.generateToken=function(){
                    //_id <<-- is schema ki _id se isko reference de rahy hein
    return JWT.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'7d'})
}


export const  userModel = mongoose.model("User", userSchema);
export default userModel;