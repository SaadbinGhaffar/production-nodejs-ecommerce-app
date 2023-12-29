import multer from "multer";//used for file or image upload 

const storage=multer.memoryStorage()//iska matlab ha k temporary store hojayega phir baad ma isko ham cloudinary pr send krwa dengy

export const singleUpload=multer({storage}).single('file')//object a ander storage batayengy k kahan pr files store krna ha aur kia is type ki storage ha