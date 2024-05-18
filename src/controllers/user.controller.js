import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";





const registerUser = asyncHandler( async (req,res)=>{
  /*
     1. get user details from frontend
     2. validation -not empty
     3.check prior existance of user by email or username
     4.check for images and avatar -->upload them to cloudinary-->check avatar
     5.create user object-create entry in db
     6.remove password and refresh token field
     7.check for user creation
     8. return respose
   */
    //input data
    const {username,fullName,email,password}=req.body
    //validation for empty field
    if(
        [username,fullName,email,password].some((field)=>field?.trim()==="")) {
        throw new ApiError(400,"full name is required")
    }
    //validation for existense correct email
     
    //validation for existense of user
  const existedUser = await User.findOne({
      $or:[{ username }, { email }]
    })
    if(existedUser){
      throw new ApiError(409,"User  already exists!!")
    }
    const avatarLocalPath =  req.files?.avatar[0]?.path;
    // const coverImageLocalPath =  req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    // //check for avatar
    
    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar file is required")
    }
    // //upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
      throw new ApiError(400,"Avatar file is required") 
    }
    // create user object and upload in db
    const user =  await  User.create({
      fullName,
      username:username.toLowerCase(),
      email,
      password,
      avatar: avatar.url,
      coverImage:coverImage?.url||"",
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    
  if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
      new ApiResponse(200, createdUser, "User created Successfully")
  )


})  


export {registerUser}
