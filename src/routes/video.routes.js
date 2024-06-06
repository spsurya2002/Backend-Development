import { Router } from "express";
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from "../controllers/video.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/upload-video").post(
    upload.fields([
        {
            name:"videoFile",
            maxCount:1
        },
        {
            name:"thumbnail",
            maxCount:1 
        }
    ]),
    publishAVideo )

router.route("/get-video-ByID/:videoId").get(getVideoById);    
router.route("/get-all-videos").get(getAllVideos);  
router.route("/delete-video/:videoId").post(deleteVideo);  
router.route("/update-video/:videoId").post(upload.single("thumbnail"),updateVideo);  

export default router 