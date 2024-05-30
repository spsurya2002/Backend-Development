import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})
const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video

    const { title, description} = req.body
    if(
        [title, description].some((field)=>field?.trim()==="")) {
        throw new ApiError(400,"title and description of video is required")
    }
    
    const videoLocalPath = req.files?.videoFile[0]?.path;
    if (!videoLocalPath) {
      throw new ApiError(400,"video file is required")
    }
  
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(400,"thumbnail  is required")
    }
  
    const videoFile = await uploadOnCloudinary(videoLocalPath);
      if (!videoFile) {
      throw new ApiError(400,"failure occured at upload video on cloudinary!!")
    }
    
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail) {
        throw new ApiError(400,"failure occured at upload thumbnail on cloudinary!!")
    }
  
    const video =  await  Video.create({
      title,
      description,
      videoFile:videoFile.url,
      thumbnail:thumbnail.url,
      owner:req.user?._id,
      duration:videoFile.duration,
    })

    const createdVideo = await Video.findById(video._id);
    if(!createdVideo){
      throw new ApiError(400,"failure occured at create video on db!!")
    }
    return res
        .status(200)
        .json(new ApiResponse(200,createdVideo,"video uploaded  successfully!!"))
  })

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}