import PostModel  from './../Models/PostModel.js'
import mongoose from "mongoose";
import userModel from './../Models/userModel.js';


export const createPost = async (req, res) => {
  const { userId, ...postData } = req.body; // Destructure userId from request body

  try {
    // Fetch the user's first name and last name
    const user = await userModel.findById(userId);

    if (!user) {
     
      return res.status(404).json("User not found");
    }

  
    // Create a new post with user details
    const newPost = new PostModel({
      ...postData,
      userId,
      firstname: user.firstname || "Anonymous", // Add the user's first name to the post
      lastname: user.lastname || "", // Add the user's last name to the post
    });

    // Save the post to the database
    await newPost.save();

  

    // Return the newly created post
    res.status(200).json(newPost);
  } catch (error) {
    // Handle errors
    
    res.status(500).json({ message: "An error occurred while creating the post", error });
  }
};
// get  a post


export const getPost = async(req,res)=>{

const id = req.params.id

try {
    const post = await PostModel.findById(id)
    res.status(200).json(post)
    
} catch (error) {
    res.status(500).json(error)
}


}


// update a post



export const updatePost = async(req, res) => {
const postId =req.params.id
const {userId} = req.body


try {
    const post = await PostModel.findById(postId)
    if(post.userId === userId){

        await post.updateOne({$set: req.body})
        res.status(200).json("Post updated successfully")
    }else{
        res.status(403).json("Action forbidden")
    }



}
 catch (error) {
    res.status(500).json(error)
}
}



// delete a post


export const deletePost = async(req,res)=>{

const id = req.params.id
const {userId} = req.body
try {



    const post = await PostModel.findById(id)
    if(post.userId === userId){

        await post.deleteOne();
        res.status(200).json("Post deleted successfully")
    }else{

        res.status(403).json("Action forbidden")
    }
} catch (error) {
    res.status(500).json(erorr)
}



}


// Like or dislike a post
export const likePost = async (req, res) => {
  const { id } = req.params; // Post ID from URL parameters
  const { userId } = req.body; // User ID from request body

  try {
    // Find the post by ID
    const post = await PostModel.findById(id);

    if (!post) {
      // Post not found
      return res.status(404).json("Post not found");
    }

    if (!userId) {
      // User ID not provided
      return res.status(400).json("User ID is required");
    }

    // Check if the user has already liked the post
    if (post.likes.includes(userId)) {
      // If already liked, remove the like (unlike)
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post unliked!");
    } else {
      // If not liked, add the like
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post liked!");
    }
  } catch (error) {
    // Handle server errors
    console.error(error); // Log the error for debugging
    res.status(500).json("An error occurred while processing your request");
  }
};



// Get timeline posts
export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id
  try {
    const currentUserPosts = await PostModel.find({ userId: userId });

    const followingPosts = await userModel.aggregate([
      { 
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json(
      currentUserPosts
        .concat(...followingPosts[0].followingPosts)
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
    );
  } catch (error) {
    res.status(500).json(error);
  }
};