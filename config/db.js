//node.js app ko mongodb database se connect karein gy
import mongoose from "mongoose"
import  colors  from "colors"




//connection establishing with mongoDB

const connectDB=async()=>{
try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log(`Connected to DB fullstack ${mongoose.connection.host}`.bgCyan.white)
} catch (error) {
    console.log(error)
}
}

//Now Execute these functions in server.js files

export default connectDB;