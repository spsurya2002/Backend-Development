import mongoose,{Schema} from "mongoose";

const commentsSchema= new Schema({
   
    content:{
        type:String,
        required:true,
    },
    video:{
        type:Schema.Types.ObjectId,//one to who being subscribed
        ref:"Video"
    },
    ownner:{
        type:Schema.Types.ObjectId,//one to who being subscribed
        ref:"User"
    },

},{timestamps:true});

export const Comment = mongoose.model("Comment",commentsSchema);