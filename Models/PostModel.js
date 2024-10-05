import mongoose from "mongoose";

const postSchema = mongoose.Schema({

userId: {type: String, required: true},

desc : String,
likes : [],
image:String,

firstname: { type: String },
lastname: { type: String },




},
{
timestamps: true
});
const PostModel = mongoose.model("Posts", postSchema)
export default PostModel;