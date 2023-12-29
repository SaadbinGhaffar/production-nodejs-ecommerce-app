import userModel from "../models/UserModel.js";
import { getDataUri } from "../utils/Features.js";
import cloudinary from "cloudinary";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, address, city, country, phone, answer } =
      req.body; //schema ma jo ha wahan se ye ye utha lo jo {}<<-- isme likha hwa

    //Validation
    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !city ||
      !country ||
      !phone ||
      !answer
    ) {
      return res.status(500).send({
        success: false,
        message: "Please Fill All The Fields",
        error,
      });
    }

    //Check Existing USer
    const existingUser = await userModel.findOne({ email });

    //Validation

    if (existingUser) {
      res.status(500).send({
        success: false,
        message: "Email Already Exists",
      });
    }

    //Success
    const user = await userModel.create({
      name,
      email,
      password,
      address,
      city,
      country,
      phone,
      answer,
    });

    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in Register Api",
      error,
    });
  }
};

//LOGIN CONTROLLER

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validation
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please Fill In All Fields ",
        error,
      });
    }

    //Check For Existing User
    const user = await userModel.findOne({ email });

    //user validation
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User Does'nt exists",
      });
    }
    //Check Password
    const isMatch = await user.comparePassword(password); //req.body ma se jo plain password get kr rahy hein usko yahan pass krwa dengy
    //Validating Password
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Wrong Password",
        error,
      });
    }

    //Token

    const token = user.generateToken();

    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        sameSite: process.env.NODE_ENV === "development" ? true : false,
      }) //'token' k name se cookie ko create karengy aur sath reference dengy i.e token variable
      .send({
        success: true,
        message: "Login Successful",
        user,
        token,
      });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in Login Api",
      error,
    });
  }
};

//GET USER PROFILE

export const getUserProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id); //jese login kareingy toh token ayega toh req.body ma user aajayega aur user k ander ha _id ki field
    res.status(200).send({
      success: true,
      message: "User Profile Got",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in getUserProfileController Api",
      error,
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    //DELETING THE COOKIE
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        sameSite: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "LOGOUT SUCCESSFULLY",
      });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in LOGOUT Api",
      error,
    });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { name, email, address, city, country, phone } = req.body;

    //VALIDATION + UPDATE
    if (name) user.name = name; //agr name ka field selected ha to user.name ma jo name ha usko destructured name se change krdo wrna wese he rehne do
    if (email) user.email = email;
    if (address) user.address = address;
    if (city) user.city = city;
    if (country) user.country = country;
    if (phone) user.phone = phone;

    //SAVE USER
    await user.save();
    res.status(200).send({
      success: true,
      message: "user Updated",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in UPDATE-PROFILE API",
      error,
    });
  }
};

export const updatePasswordController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;
    //VALIDATION
    if (!oldPassword || !newPassword) {
      return res.status(500).send({
        success: false,
        message: "Please provide old or new passsword",
      });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid Old Password",
      });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password Updated",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in UPDATE-PASSWORD API",
      error,
    });
  }
};

//UPDATE USER PROFILE PHOTO

export const updateProfilePicController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    //GETTING FILE(PHOTO) FROM THE USER/CLIENT
    const file = getDataUri(req.file);
    //DELETING PREVIOUS IMAGE
    /* await cloudinary.v2.uploader.destroy(user.profilePic.public_id)*/
    //UPDATE PROFILE PIC
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    user.profilePic = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    //SAVING FUNCTION
    await user.save();
    res.status(200).send({
      success: true,
      message: "PROFILE-PICTURE UPDATED",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in UPDATE-PROFILE-PICTURE API",
      error,
    });
  }
};

//Forgot Pssword
export const resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword, answer } = req.body;
    if (!email || !newPassword || !answer) {
      return res.status(500).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User or Answer not Found",
      });
    }
    //Change password with newPassword

    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Your Password Has Been Reset Please Login",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in ResetPasswordController API",
      error,
    });
  }
};
